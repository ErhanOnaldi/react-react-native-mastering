Sinema uygulamasında filmlerin süreleri dakika cinsinden saklanıyor ve kartlarda `"2 sa 19 dk"` gibi okunabilir bir metne dönüştürülüyor. Bu saf yardımcı fonksiyon yazıldı ve `@impl/formatRuntime` altında hazır duruyor.

Modül 0'da testlerin anatomisini (`describe`, `it`, `expect`) ve Hazırla-Çalıştır-Doğrula adımlarını görmüştün. Şimdi ilk kez kendi testlerini yazarak bu fonksiyonun sözleşmesini koruyacaksın.

## Gereksinimler

- 60 dakikadan az sürelerde yalnızca dakika bilgisi gösterilir (ör. `45` → `"45 dk"`).
- 60 dakika ve üzerindeki sürelerde saat ve kalan dakika birlikte gösterilir (ör. `139` → `"2 sa 19 dk"`).
- Kalan dakika sıfır olan tam saatlerde yalnızca saat bilgisi gösterilir (ör. `120` → `"2 sa"`).
- Süre `null`, `0` veya negatif olduğunda `"Süre bilinmiyor"` metni döndürülür.
- Yazdığın testler doğru implementasyonda geçmeli ve kasıtlı hatalar içeren mutant sürümleri yakalamalıdır.

## Örnek

| Girdi (`minutes`) | Beklenen Çıktı |
| --- | --- |
| `139` | `"2 sa 19 dk"` |
| `45` | `"45 dk"` |
| `120` | `"2 sa"` |
| `null` | `"Süre bilinmiyor"` |
| `0` | `"Süre bilinmiyor"` |
| `-5` | `"Süre bilinmiyor"` |

## Sözleşme

- Test dosyası: `formatRuntime.test.ts`
- İçe aktarım: `import { formatRuntime } from '@impl/formatRuntime'`
- Test araçları: `import { describe, expect, it } from 'vitest'`
- Karşılaştırmalarda `toBe` veya `toEqual` kullan.

## Kısıtlar

- `@impl/formatRuntime` dosyasını değiştiremezsin; yalnızca `formatRuntime.test.ts` dosyasında test yazacaksın.
- Ağ çağrısı, DOM veya mock gerektirmez; bu saf bir birim testidir.
