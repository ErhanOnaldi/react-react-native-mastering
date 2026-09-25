Arama sayfasındaki üç ayrı state dalı birbirinden kopmuş. Query sonucunun ayrımlı `status` değerini kullan.

## İstenen

- `SearchStatus({ query })` Bearer ile `/search/movie?query=...&language=tr-TR` çağırmalı.
- Beklerken `Aranıyor`, hata halinde `role="alert"` içinde `Hata: Arama yüklenemedi` göstermeli.
- Boş `results` için `Sonuç yok`; doluysa film başlıklarını listelemeli.
- HTTP 500 cevabını başarı gibi ele alma.
