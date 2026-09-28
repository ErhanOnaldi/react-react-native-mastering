Sinema’daki ortak film okumaları aynı cache kimliğini paylaşsın; detay ve arama verisi kısa dönüşlerde yeniden kullanılabilsin.

## Gereksinimler

- Uygulama için tek, paylaşılabilir cache sahibi oluştur ve React ağacının üstünde kullan.
- Film sorgularının public kimlik ailesini ve tipli tariflerini tek yerde tanımla.
- `all`, `trending(page)`, `discover({ genreId, page })`, `search({ query, page })`, `detail(id)` ve `genres()` tariflerini sun.
- Cevabı etkileyen parametreler key’i değiştirsin; aynı filtre ve sayfa aynı key’i kullansın.
- Detay ve arama cevapları 60 saniye taze kalsın; aynı taze detayın ikinci okuması ek GET üretmesin.
- Var olan API çağrılarının Bearer ve hata davranışını koru.

## Örnek

`detail(550)` → `Dövüş Kulübü`; aynı tarif tekrar okunduğunda `/3/movie/550` için toplam bir GET.

## Sözleşme

- `src/shared/api/query-client.ts` → named export `queryClient`.
- `src/features/movies/api/movie-queries.ts` → named export `movieQueries` ve yukarıdaki altı public tarifi.
- `src/main.tsx` → React uygulamasının kökünde aynı QueryClient paylaşılır.

## Kısıtlar

- Var olan `src/features/movies/api/movies-api.ts` fonksiyonlarını kullan; ikinci bir HTTP istemcisi oluşturma.
