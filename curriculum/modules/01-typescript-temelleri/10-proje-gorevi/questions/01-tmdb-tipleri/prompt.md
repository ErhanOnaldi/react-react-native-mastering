Sinema projesinde TMDB API'sinden gelen film ve sayfalama verilerini uygulamanın tüm bileşenlerinde güvenle kullanabilmek için merkezi veri tiplerini tanımlamalıyız. `projects/sinema/src/types/tmdb.ts` dosyasında film öğesini ve liste cevabını modelleyen sözleşmeleri kuracaksın.

## Gereksinimler

- `src/types/tmdb.ts` dosyasını oluştur.
- `Movie` tipini tanımla ve export et:
  - `id`: sayı
  - `title`: metin
  - `original_title`: metin
  - `overview`: metin
  - `poster_path`: metin veya `null`
  - `backdrop_path`: metin veya `null`
  - `release_date`: metin
  - `genre_ids`: sayı dizisi (`number[]`)
  - `vote_average`: sayı
  - `vote_count`: sayı
  - `popularity`: sayı
  - `adult`: boolean
  - `original_language`: metin
  - `video`: boolean
- `MovieListResponse` tipini tanımla ve export et:
  - `page`: sayı
  - `results`: `Movie[]`
  - `total_pages`: sayı
  - `total_results`: sayı

## Örnek

TMDB liste öğesinde `poster_path` veya `backdrop_path` `null` gelebilir; `release_date` alanı ise boş string (`""`) olabilir. Tiplerin bu durumları karşılayacak esneklikte olması gerekir.

## Sözleşme

- Dosya yolu: `src/types/tmdb.ts` (Sinema projesi kökü altında)
- Tip export'ları: `interface Movie` (veya `type Movie`), `interface MovieListResponse` (veya `type MovieListResponse`)
