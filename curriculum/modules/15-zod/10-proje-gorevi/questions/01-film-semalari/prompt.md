Sinema detay sayfasının güveneceği veriyi tek yerde tanımla.

1. `package.json`'a catalog sürümünden `zod` ve `@hookform/resolvers` ekle.
2. `src/features/movies/api/schemas.ts` oluştur; named export `movieSchema`, `movieListSchema`, `movieDetailsSchema`.
3. `movieSchema` liste öğesindeki en az şu alanları gerçek TMDB tipleriyle doğrulasın: `id`, `title`, `original_title`, `overview`, `poster_path: string | null`, `backdrop_path: string | null`, `release_date`, `genre_ids: number[]`, `vote_average`, `vote_count`, `popularity`, `adult`, `original_language`, `video`. `title` boş veya null olamaz.
4. `movieListSchema` `page`, `results`, `total_pages`, `total_results` alanlarını; `movieDetailsSchema` film alanlarına ek olarak `runtime: number | null`, `genres: { id; name }[]`, `tagline`, `status`, `budget`, `revenue` ve varsa `credits`/`videos` yapısını doğrulasın. Detay yanıtında `genre_ids` yoktur.
5. `src/features/movies/types.ts` tipleri şemalarla uyumlu olsun; mevcut sayfaların tip kontrolü geçsin.

Dövüş Kulübü (550) ve 27205 gerçek fixture'ları geçmeli. `title: null` hem liste hem detay şemasında kalmalı.
