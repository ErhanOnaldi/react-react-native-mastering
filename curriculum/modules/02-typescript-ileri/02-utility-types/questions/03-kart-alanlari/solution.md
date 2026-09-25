## Neden böyle?

- **Alternatif:** Kart tipini elle kopyalamak kısa görünür ama ana `Movie` değişince ayrışabilir.
- **Tuzak:** `poster_path` alanındaki `null` olasılığını silmek gerçek TMDB verisinde çökmeye yol açar.
- **Sektörde:** UI için küçük veri görünümleri çoğu zaman ana modelden `Pick` ile türetilir.
- **Sonraki adım:** React modülünde bu görünüm bileşenin props tipine dönüşecek.
