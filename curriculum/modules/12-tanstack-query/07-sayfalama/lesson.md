---
title: "Sayfa değişirken önceki sonucu koru"
minutes: 12
kind: concept
---

# Sayfa değişirken önceki sonucu koru

Sinema’da bir türe tıklayıp filmleri sayfa sayfa gezdiğini düşün. “Sonraki sayfa”ya basınca yeni istek sürerken listeyi tamamen boşaltmak zorunda değilsin; eski kartlar bir an daha ekranda kalabilir. Ama bu kartların yeni sayfaya aitmiş gibi görünmemesi gerekir.

## Önce her sayfanın key’ini ayır

Bir **sayfalama** ekranı, uzun bir listeyi daha küçük sayfa cevaplarına böler. Page 1 ile page 2 farklı film listeleri olduğundan sayfa numarası `queryKey` içinde yer almalı. Örnekte tür id’si ve sayfa birlikte key’e giriyor:

```ts check
import { queryOptions } from '@tanstack/react-query'

type GenrePage = { results: { id: number; title: string }[]; total_pages: number; total_results: number }
declare function getGenreMovies(genreId: number, page: number): Promise<GenrePage>

const genreMovieOptions = (genreId: number, page: number) =>
  queryOptions({
    queryKey: ['movies', 'genre', genreId, page] as const,
    queryFn: () => getGenreMovies(genreId, page),
  })
```

Page numarası key’de olunca Query her sayfanın cevabını ayrı yerde tutar. Tür id’si de key’de bulunmalı; aynı sayfa numarasındaki iki türün cevapları da farklıdır. Key ile isteğe giden girdiler aynı olursa cache’te hangi listenin bulunduğunu anlamak kolaydır.

## Yeni cevap gelene kadar önceki kartları göster

İki ayrı sayfa key’i koruyoruz, ama ekranda boşluk görmek istemiyoruz. `placeholderData` yeni key’in isteği bitene kadar önceki cevabı geçici olarak göstermeyi sağlar. Bu geçici gösterilen veriye **placeholder** denir; page 1’in kalıcı cache cevabı yine page 1 key’inde durur.

```tsx check
import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'

type GenrePage = { results: { id: number; title: string }[]; total_pages: number; total_results: number }
declare function getGenreMovies(genreId: number, page: number): Promise<GenrePage>
const genreMovieOptions = (genreId: number, page: number) =>
  queryOptions({
    queryKey: ['movies', 'genre', genreId, page] as const,
    queryFn: () => getGenreMovies(genreId, page),
  })

function GenreMovies({ genreId, page }: { genreId: number; page: number }) {
  const movies = useQuery({
    ...genreMovieOptions(genreId, page),
    placeholderData: keepPreviousData,
  })

  if (movies.isPending) return <p>Filmler yükleniyor</p>
  if (movies.isError) return <p>Filmler alınamadı</p>

  return (
    <section aria-busy={movies.isFetching}>
      {movies.isPlaceholderData && <p>Yeni sayfa yükleniyor</p>}
      <ul>{movies.data.results.map((movie) => <li key={movie.id}>{movie.title}</li>)}</ul>
    </section>
  )
}
```

`keepPreviousData`, önceki query’nin verisini yeni query tamamlanana dek placeholder olarak sunan TanStack Query fonksiyonudur. `isPlaceholderData` true olduğunda ekrandaki liste hedef sayfanın kesin cevabı olmayabilir. Küçük bir geçiş mesajı bunu açık eder; tam ekran yükleniyor ekranı ise var olan kartları gereksiz yere siler.

![Sayfa key'i değişince eski verinin geçici gösterilip yeni cevapla değişmesini anlatan diyagram](diagrams/sayfa-placeholder.svg "Eski sayfa yalnızca geçiş sırasında yer tutar.")

## İstek ve ekranı sırayla izle

Page 1 gösterilirken kullanıcı page 2’ye geçsin. Yeni key seçildiği anda page 2 isteği başlar. Query page 1’i geçici olarak tutar, sonra page 2 cevabı gelince onu gösterir.

| An | URL ve izlenen key | Ekrandaki film listesi | Durum |
|---|---|---|---|
| Önce | `?page=1`, key `[..., 1]` | Page 1 | Normal cevap |
| “Sonraki” tıklandı | `?page=2`, key `[..., 2]` | Page 1 geçici | `isPlaceholderData` true |
| İstek sürüyor | Page 2 key’i | Page 1 geçici | “Yeni sayfa yükleniyor” |
| Cevap geldi | Page 2 key’i | Page 2 | Placeholder sona erer |
| Geri tuşu | Page 1 key’i | Page 1 cache’teyse o | Tazelik politikasına göre |

Tabloda `data` dolu kaldığı için `isPending` bu geçişi tek başına anlatmaz. Ayrıca URL page 2 derken kartlar kısa süre page 1 olabilir; bu nedenle yeni sayfa mesajını göstermek önemlidir. Page 1’in `hasMore` gibi bilgilerini page 2 için kesin sanma: yeni cevap gelene kadar `isPlaceholderData` değerini kontrol edip hedef sayfaya özel eylemleri beklet.

## URL, key ve istek aynı sayfayı anlatsın

Bir sonraki küçük adımda sayfa numarasını URL’den alıp bileşene geçiriyoruz. URL sayfa seçimini paylaşılabilir ve geri tuşuyla gezilebilir yapar. URL değeri metin gelir; önce pozitif tam sayıya çevirip doğrula, sonra hem key’e hem API isteğine aynı sayıyı ver.

```tsx check
import { keepPreviousData, useQuery } from '@tanstack/react-query'

type GenrePage = {
  results: { id: number; title: string }[]
  total_pages: number
  total_results: number
}
declare function getGenreMovies(genreId: number, page: number): Promise<GenrePage>
declare function readPageFromUrl(search: string): number

function DramaPage({ search }: { search: string }) {
  const page = readPageFromUrl(search)
  const genreId = 18
  const movies = useQuery({
    queryKey: ['movies', 'genre', genreId, page],
    queryFn: () => getGenreMovies(genreId, page),
    placeholderData: keepPreviousData,
  })

  if (movies.isPending) return <p>Dram filmleri yükleniyor</p>
  if (movies.isError) return <p>Dram filmleri alınamadı</p>

  return (
    <section aria-busy={movies.isFetching}>
      <h2>Dram filmleri · sayfa {page}</h2>
      <p>Toplam eşleşme: {movies.data.total_results}</p>
      {movies.isPlaceholderData && <p>Yeni sayfa yükleniyor</p>}
      <ul>{movies.data.results.map((movie) => <li key={movie.id}>{movie.title}</li>)}</ul>
    </section>
  )
}
```

`readPageFromUrl` burada URL sınırındaki doğrulamayı temsil ediyor; `NaN`, sıfır, negatif veya ondalık değerler API’ye gönderilmemeli. Tür değişince de key’in tür parçası değişir. Çoğu listede filtre değiştiğinde sayfayı 1’e almak mantıklıdır; çünkü yeni türde page 5 boş olabilir. Böylece adres, key ve istek aynı sonucu tarif eder.

:::mistake[Eski listeyi yeni sayfanın cevabı sanmak]
**Belirti:** Başlık “sayfa 2” derken page 1’in filmleri kısa süre görünür. **Neden:** `placeholderData` yeni cevabı beklerken eski listeyi tutuyordur. **Düzeltme:** `isPlaceholderData` ile geçiş mesajı göster ve yeni cevaba bağlı kontrolleri o sırada çalıştırma.
:::

:::mistake[Sayfa numarasını key’den çıkarmak]
**Belirti:** URL page 2 olur ama yeni sayfa verisi gelmez veya eski cevap kullanılır. **Neden:** Page 1 ve page 2 aynı key’i paylaşıyordur. **Düzeltme:** Sayfa numarasını hem query key’e hem `queryFn` isteğine koy.
:::

:::mistake[Geçersiz URL sayısını göndermek]
**Belirti:** API `page=NaN` veya `page=-1` için hata verir. **Neden:** URL’den gelen metin doğrulanmadan sayıya çevrilmiştir. **Düzeltme:** Pozitif tam sayı değilse page 1 gibi anlamlı bir varsayılan kullan.
:::

Geri tuşuyla page 1’e dönünce cevap hemen görünebilir; bu, page 1’in cache’te durup durmamasına ve fresh sayılıp sayılmamasına bağlıdır. `placeholderData` geçiş davranışıdır, cache’in ne kadar tutulduğunu veya verinin ne kadar taze sayıldığını belirlemez. Bu süreleri değiştirmek, boşluk sorununu doğrudan çözmez.

## Özet

- Sayfa veya filtre cevabı değiştiriyorsa her ikisi de query key’e girer.
- `placeholderData: keepPreviousData`, yeni key yüklenirken önceki sonucu geçici olarak gösterir.
- `isPlaceholderData` açıkken görünen kartlarla hedef sayfanın gerçek verisi farklı olabilir.
- URL, query key ve API isteği aynı sayfa ve filtre değerlerini kullanmalıdır.
- Placeholder geçişi düzenler; cache’in tazeliği ve bellekte kalma süresi ayrı ayarlardır.

**Yeni terimler:**

- **Sayfalama:** Uzun bir listeyi numaralı küçük sonuç gruplarıyla gezme.
- **Placeholder:** Yeni sonuç gelene kadar geçici gösterilen önceki query verisi.
- **`placeholderData`:** Yeni query cevabı beklenirken geçici veriyi belirleyen seçenek.
- **`isPlaceholderData`:** Query verisinin hedef key’in kesin sonucu olmayabileceğini bildiren alan.

**Kendini yokla:** Page 2 isteği sürerken görünen page 1 filmleri hangi key’in kalıcı verisidir? Filtre değişince neden page 1’e dönmek iyi olabilir?

**Yanıt:** Filmler page 1 key’inin verisidir; page 2 için yalnızca geçici placeholder olarak gösterilir. Yeni filtrede page 5 boş olabileceğinden ilk sayfaya dönmek anlamlı sonuç bulmayı kolaylaştırır.
