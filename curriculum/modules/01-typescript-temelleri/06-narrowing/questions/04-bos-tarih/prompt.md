Filmlerin yayın tarihi bilgisi boş metin olarak gelebilir. `yearLabel` fonksiyonu, gelen tarih metnine göre kullanıcıya ya dört haneli yılı ya da açıklayıcı bir yedek metni göstermelidir.

## Gereksinimler

- Gelen `date` metni boş (`""`) ise `"Tarih yok"` döndürülmelidir.
- Tarih metni doluysa ilk 4 karakteri (yıl) döndürülmelidir.

## Örnek

| Girdi (`date`) | Çıktı |
| --- | --- |
| `"2026-07-15"` | `"2026"` |
| `""` | `"Tarih yok"` |

## Sözleşme

- Dosya ve export: `yearLabel.ts` → `yearLabel(date: string): string`
