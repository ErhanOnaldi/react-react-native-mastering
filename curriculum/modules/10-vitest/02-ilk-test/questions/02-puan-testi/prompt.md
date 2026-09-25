Sinema kartındaki puan helper’ı refactor sonrasında `8.0` yerine `8` gösteriyor olabilir. `impl/formatVote.ts` doğru sürüm; onu değiştiremezsin. `formatVote.test.ts` içine davranış testleri yaz.

- Tam sayı puanın tek ondalıklı görünümünü kontrol et.
- Henüz oylanmamış filmde `0` değerinin anlamını kontrol et.
- Her testte Arrange → Act → Assert sırasını ve Türkçe davranış adını kullan.

| Girdi | Beklenen |
| --- | --- |
| `8` | `"8.0"` |
| `0` | `"Henüz oy yok"` |

Testlerin doğru sürümde geçmeli; iki hatalı sürümün ikisini de yakalamalı.
