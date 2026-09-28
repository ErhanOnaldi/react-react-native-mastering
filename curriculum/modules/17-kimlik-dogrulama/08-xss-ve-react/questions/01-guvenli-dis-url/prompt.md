Kullanıcıların profil veya yorum alanlarında paylaştığı harici web siteleri doğrudan `<a href="...">` içine yerleştirildiğinde, `javascript:` veya zararlı veri şemaları içeren URL'ler XSS zafiyetine yol açabilir. Verilen URL değerini protokol izin listesiyle doğrulayan bir yardımcı fonksiyon oluştur.

## Gereksinimler

- Yalnızca `https:`, `http:` ve `mailto:` protokollerine sahip mutlak URL'ler geçerli kabul edilmelidir.
- `javascript:`, `data:`, `vbscript:` gibi tehlikeli şemalar reddedilmeli ve `fallback` değeri döndürülmelidir.
- Boş dizgiler, geçerli bir mutlak URL biçiminde olmayan adresler veya `string` tipinde olmayan girdiler için `fallback` döndürülmelidir.
- Belirtilmediğinde varsayılan `fallback` değeri `'#'` olmalıdır.
- Geçerli URL'lerin başındaki ve sonundaki boşluklar temizlenerek döndürülmelidir.

## Örnek

| Girdi | Beklenen Çıktı (varsayılan fallback) |
| --- | --- |
| `"https://themoviedb.org"` | `"https://themoviedb.org"` |
| `"mailto:info@example.com"` | `"mailto:info@example.com"` |
| `"javascript:alert(document.cookie)"` | `'#'` |
| `"data:text/html,<script>alert(1)</script>"` | `'#'` |
| `"ornek-sayfa"` (şemasız göreli dizgi) | `'#'` |
| `null` | `'#'` |

## Sözleşme

- `safeExternalUrl.ts` dosyasından `safeExternalUrl(value: unknown, fallback?: string): string` fonksiyonunu named export et (varsayılan fallback: `'#'`).
