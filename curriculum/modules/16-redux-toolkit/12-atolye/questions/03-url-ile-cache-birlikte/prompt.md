Film arama sayfasında yazılan metin ve sayfa paylaşılabilir olmalı; tarayıcının geri tuşuna basınca önceki arama sonucu görünmeli, aynı aramaya tekrar dönüldüğünde gereksiz bir bekleme olmamalı.

`MovieSearchPage.tsx` içindeki `MovieSearchPage` bileşenini tamamla:

- Arama metni ve sayfa numarası URL'de tutulmalı; metin değişince sayfa 1'e dönmeli.
- Sonuçlar TMDB'den gelir; yükleme ve hata durumları okunabilir olmalı.
- Geri/ileri ile daha önce görülmüş bir aramaya dönüldüğünde sonuç hemen görünmeli; aynı arama kısa süre içinde tekrar ağdan istenmemeli.
