`tmdbClient` artık ortak HTTP işini yapıyor. Yine de sayfalarda `/trending/movie/week` gibi endpoint metinleri dolaşıyorsa bir TMDB değişikliği çok yeri etkiler.

## İstenen

`src/features/movies/api/movies-api.ts` dosyasından şu **named export** fonksiyonları çıkar ve sayfa/hook kullanımını bunlara taşı:

| Fonksiyon | TMDB çağrısı | Dönüş |
| --- | --- | --- |
| `getTrendingMovies(page)` | `/trending/movie/week`, `page` | `MovieListResponse` |
| `discoverMovies({ genreId, page })` | `/discover/movie`, `with_genres`, `page` | `MovieListResponse` |
| `searchMovies({ query, page })` | `/search/movie`, `query`, `page` | `MovieListResponse` |
| `getMovieDetails(id)` | `/movie/:id`, `append_to_response=credits,videos` | `MovieDetails` |
| `getGenres()` | `/genre/movie/list` | `{ genres: Genre[] }` |

- Fonksiyonların dönüşleri `MovieListResponse`, `MovieDetails` ve `Genre` tipleriyle uyumlu olsun; aynı veri biçimi beş farklı tip gibi görünmesin.
- Tüm fonksiyonlar `tmdbClient.get<T>` kullansın. Sayfalar, search ve favorites feature’ları bu fonksiyonlara bağlansın. `getMovieDetails` favorilerde de kullanılabilir.
- Önceki v1 davranışını koru: `?page=2`, `?genre=28`, Türkçe arama, detayda kadro ve favoriler çalışmalı.

Örnek: `searchMovies({ query: 'Dövüş', page: 1 })` sonucunda `Dövüş Kulübü` bulunur. Detay çağrısı `credits` ve `videos` verisini birlikte ister.
