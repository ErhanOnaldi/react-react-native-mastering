Film detay kartlarında süreyi ham dakika yerine kullanıcı dostu bir saat ve dakika metni olarak göstermek istiyoruz. Test dosyasındaki beklentileri inceleyerek biçimlendirici fonksiyonu tamamla.

## Gereksinimler

- 0 veya negatif sürelerde `"0 dk"` dönmelidir.
- 60 dakikadan kısa süreler yalnızca dakika (`"45 dk"`) olarak gösterilmelidir.
- Tam saatlerde kalan dakika 0 ise dakika kısmı yazılmamalıdır (`"1 sa"`, `"2 sa"`).
- Hem saat hem dakika içeren sürelerde her iki birim aralarında bir boşlukla yer almalıdır (`"2 sa 5 dk"`).

## Örnek

| Girdi | Çıktı |
| --- | --- |
| `0` | `"0 dk"` |
| `45` | `"45 dk"` |
| `60` | `"1 sa"` |
| `125` | `"2 sa 5 dk"` |

## Sözleşme

- Dosya ve export: `formatRuntime.ts` → `export function formatRuntime(minutes: number): string`
