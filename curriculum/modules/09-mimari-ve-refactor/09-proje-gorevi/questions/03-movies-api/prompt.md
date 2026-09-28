Sinema sayfalarının ihtiyaç duyduğu film verilerini anlamlı feature API fonksiyonlarıyla sun; mevcut akışları koru.

## Gereksinimler

- Trend listesi verilen sayfayı, keşif listesi tür ve sayfayı, arama listesi sorgu ve sayfayı getirir.
- Detay cevabı filmle birlikte kadro ve video bilgisini de içerir.
- Tür listesi Türkçe adlarla gelir.
- Her endpoint ortak HTTP client'ı kullanır; sayfalar ham endpoint adresi taşımadan feature API'ye bağlanır.
- Trend, filtre, arama, detay, favori ve URL sayfalama davranışı sürer.
- Liste ve detay cevapları ortak veri tipleriyle ifade edilir.
- Detay isteğinde kadro ve videolar beraber istenir; keşifte tür id'si, aramada sorgu ve sayfa iletilir.

## Örnek

`Dövüş` sorgusu `Dövüş Kulübü` sonucunu içerir. İkinci trend sayfası `page=2` gönderir. Film detayı tek cevapta kadro ve video alanlarını içerir.

## Sözleşme

- `src/features/movies/api/movies-api.ts` named exportları:
  - `getTrendingMovies(page: number)` → `MovieListResponse`
  - `discoverMovies({ genreId, page }: { genreId: number; page: number })` → `MovieListResponse`
  - `searchMovies({ query, page }: { query: string; page: number })` → `MovieListResponse`
  - `getMovieDetails(id: number)` → `MovieDetails`
  - `getGenres()` → `{ genres: Genre[] }`
- Bu fonksiyonlar `src/shared/api/tmdb-client.ts` içindeki `tmdbClient` ile konuşur.
- Detay parametresi: `append_to_response=credits,videos`; keşif parametresi: `with_genres`.

## Kısıtlar

- Arayüz bileşenleri endpoint yolunu, Bearer başlığını veya TMDB kök adresini tekrar etmez.
