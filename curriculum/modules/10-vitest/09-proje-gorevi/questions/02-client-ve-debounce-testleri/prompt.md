Sinema’da arama sayfası `?page=2` iken ilk sayfayı gösterdi. Ortak client ve debounce için test yazarsan aynı refactor hatası daha erken görünür.

## API client

`src/shared/api/tmdb-client.test.ts` oluştur. `tmdbClient` ve `ApiError` öğelerini `./tmdb-client` dosyasından import et.

- `vi.fn` ile sahte `fetch` kur; `vi.stubGlobal('fetch', fake)` ile tak. Gerçek TMDB’ye çıkma.
- `tmdbClient.get('/search/movie', { query: 'Dövüş', page: 2 })` için URL’de `language=tr-TR`, `query=Dövüş`, `page=2` ve `Authorization: Bearer ...` başlığını doğrula. Query parametre sırasına bağlanma.
- Sahte cevapta `{ results: [{ id: 550, title: 'Dövüş Kulübü' }] }` dön; client’ın veriyi koruduğunu ölç.
- Ayrı bir testte 404 TMDB cevabının `ApiError` olarak `status`, `statusCode` ve `message` alanlarıyla taşındığını doğrula.
- Her testten sonra `vi.unstubAllGlobals()` çağır.

## Debounce

`src/hooks/useDebounce.test.ts` oluştur. `useDebounce` öğesini `./useDebounce` dosyasından import et. `renderHook` ve `act` için `@testing-library/react` kullan.

- `vi.useFakeTimers()` aç; test sonunda `vi.useRealTimers()` ile geri dön.
- Başlangıç değeri hemen görünür. Yeni değer 499 ms sonra görünmez, 500 ms sonra görünür.
- `"ba"` yazdıktan 200 ms sonra `"başlangıç"` yazılırsa ilk timer’ın bitişinde eski arama değeri ekrana gelmez; yalnızca son değişimden 500 ms sonra yeni değer görünür.

Sinema klasöründe `pnpm test` çalıştır. Bir assertion’ı kısa süreliğine yanlış yapıp kırmızı sonucu gör, ardından düzelt.
