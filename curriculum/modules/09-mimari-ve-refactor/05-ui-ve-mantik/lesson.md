---
title: "UI ile davranışın sınırını çiz"
minutes: 18
kind: concept
---

# UI ile davranışın sınırını çiz

Sinema'da bir film listesini türe göre süzmek isteyebilirsin. Elinde zaten `movies` listesi varsa, ekrandaki film sayısını yeni bir `useState` ile saklaman gerekmez:

```ts check
type Movie = { id: number; title: string; genreId: number }

export function countMovies(movies: Movie[]): number {
  return movies.length
}
```

Burada sonuç yalnızca eldeki listeden hesaplanıyor; ayrı state olsaydı liste ve sayı iki kopya olarak yaşardı. Liste değiştiğinde birini güncelleyip diğerini unutmak kolaydır. Render sırasında tekrar hesaplamak hem daha az kod hem de daha az senkronizasyon sorunu demektir.

## Hesabı görünümden ayır

Bu kez tür kimliğine göre filtreleme ekleyelim. **Saf fonksiyon**, aynı girdide aynı sonucu veren ve dış dünyayı değiştirmeyen fonksiyondur; filtreyi böyle tutunca hesap UI'dan bağımsız olur:

```ts check
type Movie = { id: number; title: string; genreId: number }

export function moviesInGenre(movies: Movie[], genreId: number): Movie[] {
  return movies.filter((movie) => movie.genreId === genreId)
}
```

Yeni olan tek fikir, sayım yerine filtreleme. Component bu fonksiyondan gelen listeyi çizer; tür filtresi değişince yeni listeyi tekrar hesaplar. Filtrelenmiş liste için de ikinci bir state tutmaya gerek yok, çünkü kaynak liste ile seçilen türden bulunabiliyor.

Bir component aynı hesabı yapıp bir yandan da isteği başlatmaya başlarsa, iki tür değişiklik aynı yerde birikir: hesap kuralı değişince veri yükleme kodunu okumak, yükleme değişince JSX'i okumak gerekir. Bu yüzden görünür arayüzü component'te; birden fazla yerde tekrarlanan state davranışını **custom Hook** içinde tutabiliriz. Hook, adı `use` ile başlayan ve React Hook'larını çağıran bir fonksiyondur; state davranışını paylaşır ama kendi başına ekran çizmez.

## İstek durumunu küçük bir Hook'a koy

Sinema'da filmin oyuncu listesini isteyen bir Hook düşün. Önce bu Hook yalnızca yükleme ve başarı hallerini döndürsün:

```tsx check
import { useEffect, useState } from 'react'

type CastMember = { id: number; name: string }
type CastState = { status: 'loading' } | { status: 'success'; cast: CastMember[] }

export function useMovieCast(
  movieId: number,
  load: (id: number) => Promise<CastMember[]>,
): CastState {
  const [state, setState] = useState<CastState>({ status: 'loading' })
  useEffect(() => {
    setState({ status: 'loading' })
    load(movieId).then((cast) => setState({ status: 'success', cast }))
  }, [movieId, load])
  return state
}
```

Hook isteği başlatır ve sonucunu state'e koyar; `CastList` gibi bir component ise `status` değerine göre yükleme yazısını veya oyuncuları gösterir. Bu kodun eksik yanı, hata durumunu ve film kimliği değişince önceki isteğin geç yanıtını henüz ele almaması. Bir sonraki adımda yalnızca bu zamanlama sorununu ekleyeceğiz.

![Sayfanın hook, saf dönüşüm ve UI bileşeniyle ilişkisini gösteren akış](diagrams/ui-mantik-siniri.svg "Veri yükleme ve çizim ayrı sorumluluklardır.")

## Kimlik değişince eski cevabı koruma

Bir **geç cevap**, yeni seçim yapıldıktan sonra tamamlanıp eski seçimin verisini ekrana yazmaya çalışan istektir. Örneğin film 550'nin oyuncu isteği yavaş, 603'ün isteği hızlı biterse 550 cevabı sonradan gelip 603 listesini ezebilir. Bu yarışa karşı effect'in **cleanup** fonksiyonu eski işi kapatır: cleanup, effect yeniden çalışmadan veya component ekrandan kalkmadan önce React'in çağırdığı temizleme işlevidir.

```tsx check
import { useEffect, useState } from 'react'

type CastMember = { id: number; name: string }
type CastState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; cast: CastMember[] }

export function useMovieCast(
  movieId: number,
  load: (id: number, signal: AbortSignal) => Promise<CastMember[]>,
): CastState {
  const [state, setState] = useState<CastState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    setState({ status: 'loading' })
    load(movieId, controller.signal).then(
      (cast) => {
        if (active) setState({ status: 'success', cast })
      },
      (error: unknown) => {
        if (active) {
          const message = error instanceof Error ? error.message : 'İstek başarısız'
          setState({ status: 'error', message })
        }
      },
    )
    return () => {
      active = false
      controller.abort()
    }
  }, [movieId, load])

  return state
}
```

`AbortController`, `fetch` isteğine iptal sinyali gönderen web API'sidir. Burada hem isteği iptal ediyoruz hem `active` bayrağıyla yalnızca hâlâ geçerli isteğin state yazmasına izin veriyoruz. Loader iptal sinyalini dikkate almasa bile eski callback `active === false` görür ve yeni filmin sonucunu ezemez.

`load` fonksiyonunu her render'da yeniden oluşturmamaya dikkat et. Çünkü effect onu dependency olarak izliyor: render başına yeni fonksiyon, effect'in yeniden çalışmasına ve yeni istek açmasına neden olur. Loader'ı modül seviyesinde tanımlamak veya component dışından vermek bu örnekteki en basit yoldur.

| Zaman | Olay | Hook state'i | Ekran |
| --- | --- | --- | --- |
| `movieId = 550` | İlk istek başlar | `loading` | Oyuncular yükleniyor |
| 550 cevabı gelir | Aktif cevap kabul edilir | `success` (550 oyuncuları) | 550 oyuncu listesi |
| `movieId = 603` olur | Eski cleanup, sonra yeni istek | `loading` | Yeni oyuncular yükleniyor |
| 603 cevabı gelir | Yeni istek tamamlanır | `success` (603 oyuncuları) | 603 oyuncu listesi |
| Eski 550 cevabı gecikir | `active` artık `false` | 603 `success` korunur | Eski film listeyi ezmez |

Bu tablo sıranın neden önemli olduğunu gösterir: film değişince eski effect önce temizlenir, sonra yenisi çalışır. Her `then` çağrısında state yazmak yeterli değildir; yalnız güncel seçime ait cevabın yazması gerekir.

:::info[Derinlemesine (isteğe bağlı)]
`AbortController` ve effect cleanup'ı önceki Hook'lar modülünde gördün. İstek kütüphanesi iptal sinyalini desteklemiyorsa `active` gibi bir işaretle eski sonucu yok sayabilirsin; sinyal kullanmak ağ isteğinin de gerçekten iptal olmasına yardım eder.
:::

:::mistake[Belirti: yeni film başlığının altında önceki oyuncular görünüyor]
**Belirti →** 603 seçiliyken liste bir an 550 oyuncularına dönüyor. **Neden →** Eski istek geç tamamlanıp state'i güncelledi. **Düzeltme →** Cleanup'ta eski isteği iptal et ve/veya artık etkin olmayan isteğin callback'inde state yazma.
:::

:::mistake[Belirti: boş oyuncu listesinde yükleme hiç bitmiyor]
**Belirti →** İstek başarılı, ama boş liste geldiğinde spinner kalıyor. **Neden →** Başarıyı yalnızca liste uzunluğu sıfırdan büyükse işaretliyorsun. **Düzeltme →** Boş liste de `success` cevabıdır; “oyuncu yok” görünümünü component'te ayrı göster.
:::

## Sonucu kullanıcıya component göstersin

State'in görünür karşılığını UI component'i seçer. `loading`, `error` ve `success` birbirinden ayrı durumlardır; başarı içindeki boş liste de hata değildir. Hook değer ve durum döndürür, component bunları yazı, kart veya listeye çevirir. Aynı oyuncu verisi farklı bir yerde tablo olarak da gösterilebilir.

:::model[State kategorileri]
Servis cevabının sahibi server state, URL'deki seçimin sahibi URL state'tir. Hook seçili film kimliğini sahibinden alıp isteği yürütür; sayfa da dönen durumu görünür arayüze çevirir. İki yerde aynı film seçimini saklarsan hangi kopyanın güncel olduğunu belirlemen gerekir.
:::

![Server, client, URL ve form state'in sahibini gösteren karar haritası](diagram:state-kategorileri)

Bir davranışı Hook'a taşımak sırf dosya sayısını artırmak için yapılmaz. Birden fazla ekranda aynı istek geçişini kullanacaksan veya component'in yaşam döngüsü kodunu okumak zorlaşıyorsa Hook sınırı yararlıdır. Tek satırlık `movies.length` hesabını Hook yapmak fazladan katman ekler.

**Neden görünüm JSX'i Hook'a koymuyoruz?** Hook'un çağıranı hangi metinle boş durumu göstereceğine veya oyuncuları nasıl düzenleyeceğine karar vermek isteyebilir. Hook data ve state davranışını verir; component görünür kararı verir. Ayrıca render sırasında doğrudan istek başlatma: her render yeni istek çıkarabilir; dış sistemle konuşma effect'in yaşam döngüsünde yapılır.

## Özet

- Props'tan hesaplanabilen değeri state'e kopyalama; render sırasında türet.
- Saf fonksiyon hesap yapar, custom Hook tekrarlanan React state davranışını yürütür.
- Component loading, error, empty ve success hallerini kullanıcıya gösterir.
- Parametre değişince eski effect temizlenir; geç cevap yeni sonucu ezmemelidir.
- Boş başarı, hata ve yükleme üç farklı sonuçtur.

**Yeni terimler**

- **Saf fonksiyon:** Aynı girdide aynı sonucu veren, dış dünyayı değiştirmeyen fonksiyon.
- **Custom Hook:** React Hook'larını kullanan, state davranışını paylaşan `use...` fonksiyonu.
- **Cleanup:** Effect yenilenmeden veya component kalkmadan önce çalışan temizleme işlevi.
- **Geç cevap:** Eski isteğin yeni seçimden sonra tamamlanıp state yazmaya çalışması.

**Kendini yokla:** Film listesi değiştiğinde `movies.length` için ayrıca state tutarsan ne risk doğar?  
*Cevap:* Liste ve sayı farklı kalabilir; sayıyı her render'da listeden hesapla.

**Kendini yokla:** Eski isteğin yeni film state'ini ezmesini nasıl önlersin?  
*Cevap:* Cleanup'ta isteği iptal edebilir ve eski isteğin callback'inde state yazmasını engelleyebilirsin.
