---
title: "Query tarifini queryOptions ile paylaş"
minutes: 12
kind: concept
---

# Query tarifini queryOptions ile paylaş

Sinema film sayfasında oyuncu listesini gösterdiğini düşün. Ekran, oyuncuları almak için bir `queryKey` (cache’te bu cevabı tanıtan kimlik) ve bir `queryFn` (cevabı getiren fonksiyon) kullanıyor. Aynı bilgiyi oyuncu adına tıklanınca önceden yüklemek istersen, iki yerde aynı key ve fonksiyonu yazman gerekir. Bunlardan biri zamanla değişirse, iki ekran aynı veriye baktığını anlayamaz.

## Önce tek bir seçenek nesnesi

`queryOptions`, query seçeneklerini sıradan bir nesnede bir araya getiren TanStack Query yardımcısıdır. Bir key ailesindeki `all` değeri ortak başlangıçtır; ayrıntı key’i bu parçaya film id’sini ve veri türünü ekler:

```ts check
import { queryOptions } from '@tanstack/react-query'

type CastMember = { id: number; name: string }
declare function getCast(movieId: number): Promise<CastMember[]>

const movieKeys = { all: ['film-collection'] as const }
const castKey = (movieId: number) => [...movieKeys.all, movieId, 'cast'] as const

const castOptions = (movieId: number) =>
  queryOptions({
    queryKey: castKey(movieId),
    queryFn: () => getCast(movieId),
  })
```

`castOptions(550)` çağrısı henüz istek yapmaz; yalnızca key ve fonksiyonu taşıyan bir seçenek nesnesi üretir. `queryFn` bir `Promise<CastMember[]>` döndürdüğü için TypeScript, bu tarifi kullanan yerde `data` değerinin oyuncu dizisi olduğunu çıkarabilir. Bu otomatik tip bulmaya **type inference** denir; tekrar tekrar aynı tipi yazmanı önler.

## Aynı tarifi ekrana bağla

Şimdi tarifin nerede tüketildiğini ekleyelim. `useQuery` component’i bu key’in cache kaydına bağlar; Query verisi değiştiğinde component yeni sonucu gösterir. Bu bağlantıya **observer** denir: component’in belirli bir query sonucunu izlemesi.

```tsx check
import { queryOptions, useQuery } from '@tanstack/react-query'

type CastMember = { id: number; name: string }
declare function getCast(movieId: number): Promise<CastMember[]>
const movieKeys = { all: ['film-collection'] as const }
const castKey = (movieId: number) => [...movieKeys.all, movieId, 'cast'] as const
const castOptions = (movieId: number) =>
  queryOptions({
    queryKey: castKey(movieId),
    queryFn: () => getCast(movieId),
  })

function CastPanel({ movieId }: { movieId: number }) {
  const cast = useQuery(castOptions(movieId))

  if (cast.isPending) return <p>Oyuncular yükleniyor</p>
  if (cast.isError) return <p>Oyuncular alınamadı</p>
  return <p>{cast.data.map((person) => person.name).join(', ')}</p>
}
```

Bu component’te ayrı bir `queryKey` veya `queryFn` yazmadık; ikisi de `castOptions` içinden geldi. Böylece key’e film id’si eklemeyi unutmak zorlaşır. Film 550 ve film 680 ayrı oyuncu cevaplarıdır, bu yüzden ayrı cache kayıtlarına giderler.

## Tarif başka bir yerde de çalışır

Sinema’daki popüler film kartı, kullanıcı kartın üstüne gelince ayrıntı verisini önceden isteyebilir. Bu ön yüklemeye **prefetch** denir: veri birazdan gerekebilir diye cache’i erkenden doldurur. Kartın oyuncu listesini değil, bu kez filmin fragmanlarını önceden yükleyelim; böylece örnek, görevdeki `detail` ve `search` tariflerinin aynısını kullanmaz.

```ts check
import { queryOptions, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'

type Trailer = { id: string; name: string }
declare function getTrailers(movieId: number): Promise<Trailer[]>

const trailerOptions = (movieId: number) =>
  queryOptions({
    queryKey: ['movies', movieId, 'trailers'] as const,
    queryFn: () => getTrailers(movieId),
  })

function useTrailers(movieId: number) {
  return useQuery(trailerOptions(movieId))
}

function prefetchTrailers(movieId: number, client: QueryClient) {
  return client.prefetchQuery(trailerOptions(movieId))
}

async function getTrailerNames(client: QueryClient, movieId: number): Promise<string[]> {
  const trailers = await client.fetchQuery(trailerOptions(movieId))
  return trailers.map((trailer) => trailer.name)
}
```

Ekran ve hover davranışı aynı `trailerOptions(movieId)` tarifini verdiği için aynı key’i kullanır. Tarifi tanımlamak istek başlatmaz; `useQuery` ya da `prefetchQuery` gibi bir tüketici onu çalıştırır. Prefetch çağrısı sonucu geri döndürüp ekrana basmaz, cache’i hazırlar. Eğer çağıran kodun veriyi hemen kullanması gerekiyorsa `QueryClient.fetchQuery(options)` bir Promise ile veriyi döndürür.

![Bir options tarifinin component, prefetch ve fetch tüketicileri tarafından paylaşılması](diagrams/query-tarifi.svg "Aynı key ve query function farklı kullanımlara taşınır.")

| Zaman | Ne çağrılır? | İstek / sonuç | Cache’te ne olur? |
|---|---|---|---|
| Kart görünür | `trailerOptions(550)` | İstek yok | Key ve fonksiyon hazır |
| Fare karta gelir | `prefetchQuery(trailerOptions(550))` | Veri çağırana dönmez | Fragman cevabı cache’e yazılabilir |
| Fragman paneli açılır | `useQuery(trailerOptions(550))` | Query sonucu ekranda okunur | Aynı key izlenir |
| Başka kod veriyi bekler | `fetchQuery(trailerOptions(550))` | Promise veriyle çözülür | Aynı key kullanılır |

Tablodaki adımlar, seçenekleri kurma ile ağı kullanma arasındaki farkı gösterir. Aynı film id’si aynı key’i kurar; başka id ayrı cevap demektir. Query function’ın dönüş tipi de tarife eklenir, dolayısıyla `fetchQuery` sonucundaki veri tipini ayrıca elle belirtmek gerekmez.

## Kopyalanan key’i düzelt

Kolayca yapılan bir hata, aynı fragman isteğini iki farklı key’le tanımlamaktır:

```ts
const card = { queryKey: ['movies', 550, 'trailer'], queryFn: () => getTrailers(550) }
const page = { queryKey: ['movies', 'trailer', 550], queryFn: () => getTrailers(550) }
```

**Belirti:** Hover sonrası fragman isteği yapılmış olsa da panel açılınca ikinci GET görünür. **Neden:** Key dizilerindeki parçaların sırası ve yazımı farklı olduğundan Query bunları iki cevap sayar. **Düzeltme:** Key’i ve fonksiyonu tek factory’de kur, iki kullanımda aynı factory’yi aynı id’yle çağır.

```ts check
import { queryOptions } from '@tanstack/react-query'

type Trailer = { id: string; name: string }
declare function getTrailers(movieId: number): Promise<Trailer[]>

const movieTrailerOptions = (movieId: number) =>
  queryOptions({
    queryKey: ['movies', movieId, 'trailers'] as const,
    queryFn: () => getTrailers(movieId),
  })
```

Query tarifleri çoğunlukla ilgili API fonksiyonlarının yakınında tutulur. Böylece key, veri getirme işi ve TypeScript tipi birlikte değişir; ama ağ isteğinin ne zaman başlayacağına yine tarifi tüketen kod karar verir.

:::info[Derinlemesine (isteğe bağlı)]
HTTP cache de cevapları saklayabilir, ancak tarayıcı bunu HTTP kurallarına göre yapar; TanStack Query ise uygulama belleğindeki veriyi yönetir. ETag ve 304 yanıtları HTTP cache doğrulamasıdır; ayrıntısı 7. modüldeki HTTP cache konusuna aittir.
:::

## Özet

- `queryOptions` key, query function ve ayarları yeniden kullanılabilir tek tarifte toplar; çağrılması tek başına istek başlatmaz.
- `queryFn` dönüş tipi tarife taşınır, bu yüzden `data` ve `fetchQuery` sonucu için çoğu zaman ayrıca generic yazmazsın.
- `useQuery` cache sonucunu ekrana bağlar; `prefetchQuery` erkenden doldurur; `fetchQuery` çağırana sonucu verir.
- Aynı cevabı paylaşan yerlerde aynı factory’yi ve aynı parametreleri kullan.

**Yeni terimler:**

- **Query options:** Query’yi tanımlayan key, fonksiyon ve ayarları içeren nesne.
- **Type inference:** TypeScript’in koddan tipi kendisinin çıkarması.
- **Observer:** Bir component’in belirli cache sonucunu izlemesi.
- **Prefetch:** Birazdan gerekebilecek veriyi cache’e önceden alma.

**Kendini yokla:** Factory’yi çağırmak neden GET yapmaz? Aynı key’i kullanan bir hover prefetch’i ile panelin faydası nedir?

**Yanıt:** Factory yalnızca seçenek nesnesi kurar; onu tüketen query metodu istek yapar. Aynı key olunca panel önceden cache’e gelen cevabı okuyabilir.
