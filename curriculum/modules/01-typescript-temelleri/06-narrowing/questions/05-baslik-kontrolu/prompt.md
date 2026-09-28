Dış kaynaktan gelen veri beklenen film yapısında olmayabilir; bir sayı, `null` veya hatalı bir nesne gelebilir. `safeTitle` fonksiyonu, bilinmeyen bir girdiyi adım adım daraltarak güvenle başlık metnini çıkarmalıdır.

## Gereksinimler

- Verilen değer `null` olmayan bir nesne ise ve içinde metin (`string`) türünde bir `title` alanı barındırıyorsa bu başlığı döndür.
- Değer `null`, ilkel bir tip (ör. sayı) ya da `title` alanı metin olmayan bir nesne ise `"Başlık yok"` döndür.
- Tip güvenliğini korumak için tip zorlaması yapılmamalıdır.

## Örnek

| Girdi (`value`) | Çıktı |
| --- | --- |
| `{ title: "Dövüş Kulübü" }` | `"Dövüş Kulübü"` |
| `null` | `"Başlık yok"` |
| `5` | `"Başlık yok"` |
| `{ title: 550 }` | `"Başlık yok"` |

## Sözleşme

- Dosya ve export: `safeTitle.ts` → `safeTitle(value: unknown): string`

## Kısıtlar

- `any` veya `as` anahtar sözcükleri kullanılmamalıdır; kontrol tamamen çalışma zamanı kontrolleriyle daraltılmalıdır.
