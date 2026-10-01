---
title: "Önkoşul hazır olunca sorgula"
minutes: 12
kind: concept
---

# Önkoşul hazır olunca sorgula

Bir film sayfasında oyuncu listesini almak için önce seçili filmin id’si gerekir. Sayfa ilk açıldığında seçim henüz yapılmamış olabilir. O sırada `/api/movies/undefined/cast` isteği göndermek yerine sorgunun beklemesini isteriz.

## Eksik id ile bekle

`enabled`, query’nin çalışmaya hazır olup olmadığını belirten seçenektir. Hook’u her render’da çağırmaya devam ederiz; yalnızca id gelene kadar query’yi kapalı tutarız.

```tsx check
import { useQuery } from '@tanstack/react-query'

type CastMember = { id: number; name: string }
declare function getCast(movieId: number): Promise<CastMember[]>

function useMovieCast(movieId: number | undefined) {
  return useQuery({
    queryKey: ['movies', movieId, 'cast'],
    enabled: movieId !== undefined,
    queryFn: () => {
      if (movieId === undefined) throw new Error('Film id gerekli')
      return getCast(movieId)
    },
  })
}
```

Burada `enabled` ve `queryFn` içinde ayrı bir kontrol bulunması bilinçlidir. Query devre dışıyken function çağrılmamalı; kontrol ise ileride kod değişip function yanlışlıkla çağrılsa bile `undefined` değerinin URL’ye gitmesini önler. `movieId !== undefined` kullanıyoruz; çünkü sıfırın geçersiz olduğunu bilmiyorsak `Boolean(movieId)` 0’ı da eksik sanır.

## “Bekliyor” ile “yükleniyor” aynı değil

Component, sorgunun sonucunu ekrana koyabilir. Query durumundaki `isPending`, henüz kullanılabilir cevap olmadığını söyler; `fetchStatus` ise ağ isteğinin şu anda çalışıp çalışmadığını söyler. Bu iki bilgi ilk render’da farklı şeyler anlatabilir:

```tsx check
import { useQuery } from '@tanstack/react-query'

type CastMember = { id: number; name: string }
declare function getCast(movieId: number): Promise<CastMember[]>

function useMovieCast(movieId: number | undefined) {
  return useQuery({
    queryKey: ['movies', movieId, 'cast'],
    enabled: movieId !== undefined,
    queryFn: () => {
      if (movieId === undefined) throw new Error('Film id gerekli')
      return getCast(movieId)
    },
  })
}

function CastNames({ movieId }: { movieId: number | undefined }) {
  const cast = useMovieCast(movieId)

  if (movieId === undefined) return <p>Önce bir film seç</p>
  if (cast.isPending && cast.fetchStatus === 'fetching') return <p>Oyuncular yükleniyor</p>
  if (cast.isError) return <p>Oyuncular alınamadı</p>
  if (cast.data === undefined) return <p>Oyuncu bilgisi henüz yok</p>
  return <p>{cast.data.map((person) => person.name).join(', ')}</p>
}
```

Film seçilmemişken query `pending` olabilir ama `fetchStatus` değeri `idle` kalır: ortada başlamış bir istek yoktur. Film seçilince id key’e girer ve istek başlar. Tek başına `isPending` ile her durumda spinner gösterirsen, kullanıcı seçim yapmadığı halde sayfanın sürekli yüklendiğini sanabilir.

| An | `movieId` | Query durumu | Ekrandaki karşılık |
|---|---:|---|---|
| Sayfa yeni açıldı | `undefined` | `pending`, `idle` | “Önce bir film seç” |
| Film seçildi | `550` | `pending`, `fetching` | “Oyuncular yükleniyor” |
| Cevap geldi | `550` | `success`, `idle` | Oyuncu adları |
| Başka film seçildi | `680` | Yeni key, `fetching` | Yeni filmin oyuncuları yükleniyor |

Tabloda aynı hook çağrısı sürerken yalnızca girdinin değiştiğini görüyorsun. Key’de id bulunduğundan film 550’nin cevabı film 680’in cevabı yerine kullanılamaz. Bu da bir filmden diğerine hızlı geçerken eski cevabın yanlış filme aitmiş gibi görünmesini önler.

## Bir sorgu gerçekten diğerine bağlı olsun

Şimdi seçilen filmin verisi geldikten sonra benzer filmleri isteyelim. İlk cevap ikinci sorguya gereken id’yi sağlar; bu gerçek bir veri bağımlılığıdır. İki bağımsız sorguyu bu biçimde arka arkaya bağlamak gerekmez.

```tsx check
import { useQuery } from '@tanstack/react-query'

type Movie = { id: number; title: string }
type Recommendation = { id: number; title: string }
declare function getMovie(movieId: number): Promise<Movie>
declare function getRecommendations(movieId: number): Promise<Recommendation[]>

function MovieRecommendations({ movieId }: { movieId: number | undefined }) {
  const movie = useQuery({
    queryKey: ['movies', 'detail', movieId],
    enabled: movieId !== undefined,
    queryFn: () => {
      if (movieId === undefined) throw new Error('Film id gerekli')
      return getMovie(movieId)
    },
  })

  const recommendations = useQuery({
    queryKey: ['movies', movie.data?.id, 'recommendations'],
    enabled: movie.data !== undefined,
    queryFn: () => {
      if (movie.data === undefined) throw new Error('Film henüz yüklenmedi')
      return getRecommendations(movie.data.id)
    },
  })

  if (movieId === undefined) return <p>Bir film seç</p>
  if (movie.isPending) return <p>Film yükleniyor</p>
  if (movie.isError) return <p>Film alınamadı</p>
  if (recommendations.isPending) return <p>Benzer filmler yükleniyor</p>
  if (recommendations.isError) return <p>Benzer filmler alınamadı</p>

  return <ul>{recommendations.data.map((item) => <li key={item.id}>{item.title}</li>)}</ul>
}
```

Önce film isteği başlar; filmi tanımadan benzerlerini soramayız. Film cevabı geldikten sonraki render’da ikinci hook hâlâ aynı sırada çağrılır, ama `enabled` artık true olur ve öneri isteği başlar. Bu ardışık beklemeye **waterfall** denir. Her iki isteğin de ayrı ayrı 180 ms sürdüğünü varsayarsak, seri akışta öneriler kabaca 360 ms’de gelir; bağımsız istekler paralel olsaydı yaklaşık 180 ms yeterdi. Burada seri beklemek gerekir, çünkü öneri isteği film id’sine bağlıdır.

![İlk sorgudan id geldikten sonra ikinci sorgunun başlaması](diagrams/bagimli-sorgu.svg "İkinci sorgu gerekli kimlik gelene kadar bekler.")

| Sıra | Film sorgusu | Öneri sorgusu | Ağda olan |
|---|---|---|---|
| İlk render | `enabled` id varsa açık | `enabled: false` | Film isteği başlar |
| Film cevabı | `success`, `data.id` hazır | Yeni render’da etkinleşir | Öneri isteği başlar |
| Öneri cevabı | Cache’te kalır | `success` | Öneriler görünür |
| Film id’si değişir | Yeni film key’i | Yeni film cevabını bekler | Yeni bağımlı akış başlar |

Bu tür gecikme gereksiz görünüyorsa önce verinin gerçekten bağımlı olup olmadığını kontrol et. İki panel aynı anda alınabiliyorsa iki query’yi de aynı render’da başlat. API yalnızca ilk cevaptan gelen id ile ikinci cevabı veriyorsa waterfall davranışın doğal bedelidir.

:::mistake[Hook’u koşullu çağırmak]
**Belirti:** İlk render’da olmayan bir query, sonraki render’da eklendiğinde React Hook sırası uyarısı çıkar. **Neden:** `if (movieId) useQuery(...)` hook listesini render’dan render’a değiştirmiştir. **Düzeltme:** Hook’u üst seviyede her render’da çağır; bekleme koşulunu `enabled` seçeneğine ver.
:::

:::mistake[Id’yi `!` ile garanti sanmak]
**Belirti:** `/api/movies/undefined/cast` isteği çıkar. **Neden:** TypeScript’teki `movieId!` yalnızca derleyici uyarısını susturur; çalışma anında id üretmez. **Düzeltme:** Hem `enabled` ile beklet hem de `queryFn` içinde eksik değeri açıkça kontrol et.
:::

:::info[Derinlemesine (isteğe bağlı): `skipToken`]
`skipToken`, id yokken `queryFn` yerine verilen özel değerdir; böylece eksik parametreyle fetch function seçilemez. TypeScript’in hangi dalda id bulunduğunu anlamasına yardım eder. Bu query’de elle `refetch()` kullanamazsın, çünkü çağrılacak bir function yoktur; elle yeniden deneme gerekiyorsa `enabled` daha uygundur.
:::

## Özet

- Hook’lar her render’da aynı sırada çağrılır; sorgunun başlamasını `enabled` ile beklersin.
- Eksik değeri hem query function içinde kontrol et, hem geçerli girdiyi key’e koy.
- `pending` veri olmadığını, `fetchStatus` ise ağ isteğinin çalışıp çalışmadığını anlatır.
- Gerçekten bağlı iki istek waterfall oluşturur; bağımsız sorgular aynı anda başlayabilir.

**Yeni terimler:**

- **`enabled`:** Query’nin hangi koşulda çalışabileceğini belirleyen seçenek.
- **`pending`:** Henüz query verisi bulunmayan durum.
- **`fetchStatus`:** Query için ağ işinin çalışıp çalışmadığını gösteren alan.
- **Waterfall:** Bir istek bitmeden gerekli girdisi oluşmayan sonraki isteğin başlayamaması.

**Kendini yokla:** Film seçilmemişken `pending` görüp neden hemen spinner göstermemelisin? Film ve öneri sorguları neden seri başlar?

**Yanıt:** Sorgu `pending` olsa bile `fetchStatus: idle` ise ağ isteği çalışmıyordur; seçim bekleniyordur. Öneriler için önce film cevabından id gerektiği için ikinci istek ilkinden sonra başlar.
