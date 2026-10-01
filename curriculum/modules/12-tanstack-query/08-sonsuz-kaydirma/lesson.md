---
title: "Sonsuz listede sayfaları biriktir"
minutes: 15
kind: concept
---

# Sonsuz listede sayfaları biriktir

Bir film listesini sayfalı API’den aldığını düşün. Sayfa 1’deki filmler ekranda dururken kullanıcı “Daha fazla”ya bastığında sayfa 2 de listenin sonuna eklenmeli. Burada önemli fark şu: normal pagination yeni sayfayı gösterirken, sonsuz liste önceki sayfaları da tutar.

## Bir isteğin hangi sayfayı alacağını seç

Önce API’nin tek bir sayfa döndürdüğü en küçük örneğe bakalım. `page` sayısı isteğe verilir; API de o sayfanın filmlerini döndürür.

```ts check
type Movie = { id: number; title: string }
type MoviePage = { page: number; total_pages: number; results: Movie[] }

declare function getPopularMovies(page: number): Promise<MoviePage>

void getPopularMovies(1).then((firstPage) => {
  console.log(firstPage.page, firstPage.results.length)
})
```

Bu kod yalnızca ilk dilimi ister. `firstPage` içinde ikinci sayfa yoktur; kullanıcı başka sayfaya geçecekse yeni bir istek gerekir. Sıradaki örnekte sayfa numarasını değiştirince arayüzde ne olacağını ayıralım.

## Yeni sayfa eskisinin yerine mi geçecek?

Klasik pagination’da tek bir görünür sayfa tutabilirsin. Kullanıcı 2’ye bastığında `page` değişir ve yeni istek sonucu eskisinin yerini alır:

```tsx
const page = 2
const result = await getPopularMovies(page)
return <MovieList movies={result.results} />
```

Bu örnekte ekranda yalnızca sayfa 2’nin filmleri vardır. “Daha fazla” davranışı için önceki `results` dizisini de saklayıp yeni sonuçlarla birleştirmen gerekir. Bunu elle yapmak, sayfa listesi ve filtre değişince temizleme gibi ek işleri component’e yükler.

Sonsuz sorgu, yani `useInfiniteQuery`, bu biriktirme işini Query cache’inde sayfa sayfa yönetir. `initialPageParam` ilk sayfanın parametresidir. `queryFn` her çalıştığında Query’nin verdiği `pageParam` ile API’yi çağırır. `getNextPageParam` son cevaba bakıp sonraki isteğin parametresini ya da devam yoksa `undefined` değerini döndürür.

```ts check
import { useInfiniteQuery } from '@tanstack/react-query'

type MoviePage = { page: number; total_pages: number; results: { id: number; title: string }[] }
declare function getPopularMovies(page: number): Promise<MoviePage>

function usePopularMovies() {
  return useInfiniteQuery({
    queryKey: ['movies', 'popular'],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getPopularMovies(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  })
}
```

İlk istekte `pageParam` 1’dir. Birinci cevap geldikten sonra Query, `getNextPageParam` sonucundaki 2’yi bir sonraki isteğe verir. Üçüncü ve son sayfa geldiğinde fonksiyon `undefined` döndürür; böylece Query devam sayfası olmadığını bilir.

## Cevapları tek listede göster

`data.pages`, alınmış cevapların sıralı dizisidir. Her cevabın kullandığı parametreler de `data.pageParams` içinde aynı sırayla bulunur. Film kartlarını tek bir diziye çevirmek için JavaScript’in `flatMap` yöntemini kullanabilirsin: her sayfanın `results` listesini alır ve iç içe listeleri tek düz listeye açar.

```tsx
const movies = query.data?.pages.flatMap((page) => page.results) ?? []

return (
  <ul>
    {movies.map((movie) => <li key={movie.id}>{movie.title}</li>)}
  </ul>
)
```

Burada `pages` sırasıyla sayfa 1, sayfa 2 ve devamını içerir; `flatMap` her sayfanın filmlerini bu sırayı koruyarak birleştirir. Yeni sayfayı ayrıca `useState` içine kopyalamazsın, çünkü aynı kayıtların iki ayrı sahibi olması kolayca tutarsızlık yaratır.

![Sonsuz sorguda her sayfanın aynı query verisine eklenmesini gösteren akış](diagrams/infinite-pages.svg "Yeni pageParam ile gelen data, önceki sayfaların yanına eklenir.")

Sinema’da keşif listesini kategoriye göre değiştirdiğini düşün. Kategori değişirse bu başka bir akıştır; kategori query key’inde yer almalı. Aynı key altında eski kategorinin sayfaları kalmamalı. Aşağıdaki örnek sayfaları nasıl çizeceğini gösterir; `query` bu key’i ve sayfa zincirini tanımlar.

```tsx
function MovieDiscover({ category }: { category: string }) {
  const query = useInfiniteQuery({
    queryKey: ['movies', 'discover', category],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getMoviesByCategory(category, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  })

  const movies = query.data?.pages.flatMap((page) => page.results) ?? []
  return <MovieList movies={movies} />
}
```

`category` key’in parçası olduğu için korku ve komedi listeleri ayrı cache girdileridir. Kullanıcı kategori değiştirince Query o akışın ilk sayfasını alır; film component’i de o kategoriye ait sayfaları gösterir. Key’de yalnız `'movies'` kalsaydı iki kategori aynı cevabı paylaşabilirdi.

## İstek sırasını takip et

İlk cevapta toplam üç sayfa olduğunu varsayalım. `getNextPageParam` son cevapla çalışır; sonuç, kullanıcı devam istediğinde kullanılacak parametredir.

| Olay | Gelen cevap | Sonraki parametre | Ekrandaki liste |
|---|---|---:|---|
| Liste açılır | Sayfa 1 | 2 | Sayfa 1 |
| Kullanıcı devam eder | Sayfa 2 | 3 | Sayfa 1 + 2 |
| Kullanıcı yeniden devam eder | Sayfa 3 | `undefined` | Sayfa 1 + 2 + 3 |
| Son durum | Yeni cevap yok | `hasNextPage` false | Devam düğmesi kapanır |

İlk yükleme durumu ile sonraki sayfanın yüklenmesi farklıdır. `isPending` ilk cevabı bekler; `isFetchingNextPage` devam isteğinin çalıştığını söyler. “Daha fazla” düğmesini devam isteği sırasında devre dışı bırakabilirsin. `hasNextPage` false ise yeni istek başlatacak sayfa yoktur.

## Sık yapılan hata: sayfa listesini elle biriktirmek

Şu yaklaşım ilk bakışta işe yarar:

```tsx
setMovies((current) => [...current, ...nextPage.results])
```

Ancak kullanıcı kategori değiştirdiğinde eski filmleri temizlemeyi, tekrarlanan istekleri ayırmayı ve aynı veriyi Query cache’iyle senkron tutmayı da kendin üstlenirsin. Belirti, yeni kategorinin kartlarından önce eski kategorinin kartlarının kısa süre görünmesi ya da bir sayfanın iki kez eklenmesidir. Sayfaları `useInfiniteQuery` içinde tutup ekranda `data.pages` üzerinden göstermek, isteklerin ve birikmiş verinin aynı yerde yönetilmesini sağlar.

## Aklında kalsın

- Normal pagination’da yeni sayfa eskisinin yerini alır; sonsuz listede sayfalar birikir.
- `initialPageParam` ilk parametreyi, `getNextPageParam` sonraki parametreyi belirler.
- `data.pages` cevapları, `data.pageParams` kullanılan parametreleri aynı sırayla tutar.
- Son cevapta `undefined` dönünce `hasNextPage` false olur.
- Filtre akışın kimliğini değiştiriyorsa filtre query key’inde olmalıdır.

**Yeni terimler**

- **Sonsuz sorgu (`useInfiniteQuery`):** Bir query içinde birden fazla sayfayı biriktirip cache’te tutar.
- **`pageParam`:** Query’nin o sayfa isteğinde API’ye verdiği değer.
- **`data.pages`:** Başarıyla alınan sayfa cevaplarının sıralı dizisi.
- **`flatMap`:** Her elemanı bir diziye çevirip sonuçları tek diziye açan array yöntemi.

**Kendini yokla:** Üçüncü sayfa `total_pages: 3` cevabını verirse sonraki parametre ne olur? `category` neden query key’inde yer alır?

**Yanıt:** `undefined` olur; başka sayfa yoktur. Kategori değişince başka bir film akışı oluştuğu için key’in de farklı olması gerekir.

:::info[Derinlemesine (isteğe bağlı)]
Çok uzun listelerde `maxPages` cache’te tutulacak sayfa sayısını sınırlar. Bu sınır eski sayfaları çıkarabileceği için kullanıcıların geriye dönmesi gerekiyorsa `getPreviousPageParam` ve geri yükleme davranışını da tasarlamalısın. Cursor kullanan bir API’de sayfa numarası artırmak yerine cevaptan gelen cursor’ı sonraki parametre olarak kullanırsın. API boş bir sayfa döndürse bile `total_pages` daha büyükse devam sayfası bulunabilir; bitişi boş `results` dizisinden değil API’nin `total_pages`, `nextCursor` veya `hasMore` bilgisinden anlamalısın. Listeyi ters çevirip çevirmemek de API zorunluluğu değil, ekranda istenen sıraya bağlıdır.
:::
