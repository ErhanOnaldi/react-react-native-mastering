Sinema'da `?q=Matrix&page=4&genre=28` açık. Sorgu değişince dördüncü sayfada kalan ekran boş sonuç sanıyor; tüm params nesnesini değiştirince de tür kayboluyor.

## Görev

`SearchControls` URL'yi tek kaynak olarak kullansın:

- Input değeri `q` parametresinden gelsin; her değişimde URL'ye yazılsın.
- **Aksiyon** `genre=28` yapsın; **Tüm türler** türü kaldırsın.
- Sorgu veya tür değişiminde `page` silinsin, diğer filtre korunsun.
- Görünen sayfa eksik veya bozuk değer için `1` olsun.

Örnek: `?q=Matrix&page=4&genre=28` üzerinde sorguyu temizlemek → `genre=28` kalır, `page` gider.
