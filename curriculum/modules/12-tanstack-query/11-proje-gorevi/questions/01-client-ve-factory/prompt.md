Sinema v2’de arama, detay ve trendin API fonksiyonları var; fakat hangi sayfanın hangi veriyi cache’leyeceği ortak bir kurala bağlı değil.

## İstenen

- `@tanstack/react-query` ekle. `src/shared/api/query-client.ts` dosyasında **`queryClient`** export et; uygulama boyunca aynı cache kullanılsın. Detay ve arama verisi en az 60 saniye taze kalsın.
- `src/features/movies/api/movie-queries.ts` dosyasında **`movieQueries`** export et: `all`, `trending(page)`, `discover({ genreId, page })`, `search({ query, page })`, `detail(id)`, `genres()`.
- `detail(id)` ve `search(params)` tarifleri bağımsız bir QueryClient ile kullanıldığında da 60 saniye taze kalsın. Tarifler mevcut `movies-api.ts` fonksiyonlarından veri alsın; Bearer ve `ApiError` davranışları korunsun.
- Aynı filtre ve sayfa aynı key; farklı query/page/id farklı key olsun. Detay key’i sonraki hover prefetch ile aynı olmalı.

Örnek: `queryClient.fetchQuery(movieQueries.detail(550))` başlık olarak **Dövüş Kulübü** döndürür. Aynı taze tarifi tekrar okumak yeni GET üretmez.
