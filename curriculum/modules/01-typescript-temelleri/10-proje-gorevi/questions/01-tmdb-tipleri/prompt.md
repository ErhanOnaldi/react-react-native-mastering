Sinema'nın gerçek TMDB trend listesini bağlamadan önce veri sözleşmesini kur. `curriculum/fixtures/tmdb/trending-week.json` ve `popular-1.json` içindeki **liste öğelerine** bak. Bazı filmlerin posteri null, tarihi boş string olabilir.

`projects/sinema/src/types/tmdb.ts` dosyasını oluştur ve şu iki adı **export** et:

- `Movie`: `id: number`, `title: string`, `original_title: string`, `overview: string`, `poster_path: string | null`, `backdrop_path: string | null`, `release_date: string`, `genre_ids: number[]`, `vote_average: number`, `vote_count: number`, `popularity: number`, `adult: boolean`, `original_language: string`, `video: boolean`.
- `MovieListResponse`: `page: number`, `results: Movie[]`, `total_pages: number`, `total_results: number`.

Örnek: `poster_path: null` geçerlidir; `release_date: ''` de geçerlidir. `movie-550.json` bir **detay** cevabıdır ve farklı alanlar taşır. `pnpm typecheck` ile alan adlarını kontrol et; görevin testlerini çalıştır.
