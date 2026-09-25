Sinema v2’de arama, detay ve trendin API fonksiyonları var; fakat hangi sayfanın hangi veriyi cache’leyeceği ortak bir kurala bağlı değil.

## İstenen

- `@tanstack/react-query` ekle. `src/shared/api/query-client.ts` dosyasında **`queryClient`** export et; en az 60 saniyelik bir `staleTime` seç ve uygulamayı `QueryClientProvider` ile sar. Devtools geliştirme sırasında isteğe bağlı kullanılabilir.
- `src/features/movies/api/movie-queries.ts` dosyasında **`movieQueries`** export et: `all`, `trending(page)`, `discover({ genreId, page })`, `search({ query, page })`, `detail(id)`, `genres()`.
- `detail(id)` ve `search(params)` tariflerinde `staleTime: 60_000` olsun; böylece bağımsız bir QueryClient de taze cache’i kullanır. Her fonksiyon `queryOptions` ile `queryKey` + `queryFn` tarifi döndürsün. `queryFn` mevcut `movies-api.ts` fonksiyonlarını kullansın; Bearer ve `ApiError` mantığını yeniden yazma.
- Aynı filtre ve sayfa aynı key; farklı query/page/id farklı key olsun. Detay key’i sonraki hover prefetch ile aynı olmalı.

Örnek: `queryClient.fetchQuery(movieQueries.detail(550))` başlık olarak **Dövüş Kulübü** döndürür. Aynı taze tarifi tekrar okumak yeni GET üretmez.
