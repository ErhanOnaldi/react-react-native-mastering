Arama kontrolleri adresle aynı seçimleri göstermeli. Sorgu veya tür değiştiğinde eski sayfa numarasını kaldır, ilgisiz filtreleri koru.

## Gereksinimler

- `Film ara` adlı text input'un değeri `q` parametresinden gelsin ve değişince URL güncellensin.
- `Aksiyon` düğmesi `genre=28` seçsin; `Tüm türler` düğmesi genre parametresini kaldırsın.
- Sorgu veya tür değişince `page` kaldırılsın; diğer filtreler korunsun.
- Sayfa eksik veya bozuksa görünür metin `Sayfa 1` olsun.

## Örnek

`?q=Matrix&page=4&genre=28` üzerinde sorguyu temizle → `genre=28` kalır, `page` kalkar.

## Sözleşme

- `SearchControls.tsx` içinden `SearchControls` named export edilir.
- Route `/search` adresinde açılır.
- Arama alanının erişilebilir adı `Film ara`; tür düğmelerinin adları `Aksiyon` ve `Tüm türler`.
