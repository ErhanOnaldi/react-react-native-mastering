Keşif ekranında tür ve sayfa değiştikçe TMDB'nin o seçime ait filmleri görünmeli. Önceki seçime geri dönünce başka türün sonucu ekranda kalmamalı.

Testler `GenreDiscover.tsx` içindeki `GenreDiscover` bileşenini router ve veri sağlayıcısı içinde açar.

- `Tür` kontrolünde `Aksiyon` (28) ve `Komedi` (35) bulunur.
- `Sonraki sayfa` ve `Önceki sayfa` ile sayfa değişir; ilk sayfa 1'dir.
- Seçim URL'de `genre` ve `page` olarak paylaşılabilir. Tür değişince sayfa 1'e döner.
- Başlıklar `/discover/movie` sonucundan gelir; yükleme ve hata durumları görünür.

Örnek: Aksiyon, sayfa 2 → Komedi, sayfa 1 → geri → Aksiyon, sayfa 2.
