Sinema'da film listesi ve detay yanıtlarının kullandığımız alanları karşıladığını uygulama içinde doğrula.

## Gereksinimler
- Film kaydı id number, title/original_title/overview/poster_path/backdrop_path/release_date/original_language string alanları, genre_ids number dizisi, vote_average/vote_count/popularity number alanları ve adult/video boolean alanları taşır.
- poster_path ve backdrop_path null olabilir. Film title alanı boş veya null olamaz.
- Liste yanıtı page, results, total_pages ve total_results alanlarını içerir; sayaçlar number'dır.
- Detay kaydı genre_ids yerine runtime number veya null, genres öğeleri id/name taşıyan dizi, tagline/status string, budget/revenue number alanlarına sahiptir.
- Gerçek detay yanıtındaki opsiyonel credits ve videos alanları korunmalı ve mevcut uygulamanın kullandığı cast, crew ve video değerleriyle uyumlu olmalıdır.

## Örnek
Katalogdan alınmış bir film ve poster_path=null geçerlidir. Aynı kaydın title alanı null olduğunda liste ve detay kaydı reddedilir.

## Sözleşme
- src/features/movies/api/schemas.ts içinde movieSchema, movieListSchema ve movieDetailsSchema named export'larını oluştur.
- src/features/movies/types.ts içindeki Movie, MovieDetails, Genre, CastMember, CrewMember ve Video tiplerini şemaların çıktılarından türet.

