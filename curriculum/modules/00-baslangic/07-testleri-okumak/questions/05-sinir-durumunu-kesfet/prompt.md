Film kartlarında uzun özet metinlerinin kart düzenini bozmasını engellemek istiyoruz. Belirli bir karakter sınırını aşan metinleri kısaltan yardımcı fonksiyonu tamamla.

## Gereksinimler

- Verilen metin belirlenen karakter sınırını aşıyorsa kısaltılmalı ve sonuna üç nokta (`"..."`) eklenmelidir.
- Metin sınıra eşit veya daha kısaysa hiçbir değişiklik yapılmadan döndürülmelidir.
- Test dosyasında listelenen tüm özel durumları ve beklentileri inceleyerek kodunu uyarla.

## Örnek

| Metin | Sınır | Çıktı |
| --- | --- | --- |
| `"Kısa özet"` | `20` | `"Kısa özet"` |
| `"Geleceğe Dönüş bir bilimkurgu klasiğidir"` | `14` | `"Geleceğe Dönüş..."` |

## Sözleşme

- Dosya ve export: `truncateOverview.ts` → `export function truncateOverview(text: string, maxLength: number): string`
