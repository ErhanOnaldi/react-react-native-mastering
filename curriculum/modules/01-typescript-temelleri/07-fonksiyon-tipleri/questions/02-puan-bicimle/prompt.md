Kartlarda ve detay sayfasında film puanlarının tutarlı bir metin formatıyla gösterilmesini istiyoruz. `formatScore` fonksiyonu, verilen sayısal puanı isteğe bağlı bir basamak hassasiyetiyle biçimlendirmeli ve oylanmamış filmleri özel bir metinle ayırt etmelidir.

## Gereksinimler

- Puan `0` ise `"Henüz oy yok"` metnini döndür.
- İkinci parametre (`digits`) belirtilmediğinde varsayılan olarak `1` basamak hassasiyet kullan.
- Belirtilen veya varsayılan basamak hassasiyetine göre puanı yuvarlayarak metin olarak döndür.

## Örnek

| Girdi (`vote`, `digits`) | Çıktı |
| --- | --- |
| `formatScore(0)` | `"Henüz oy yok"` |
| `formatScore(7.456)` | `"7.5"` |
| `formatScore(7.456, 2)` | `"7.46"` |

## Sözleşme

- Dosya ve export: `formatScore.ts` → `formatScore(vote: number, digits?: number): string` (veya varsayılan değerli parametre `digits = 1`)
