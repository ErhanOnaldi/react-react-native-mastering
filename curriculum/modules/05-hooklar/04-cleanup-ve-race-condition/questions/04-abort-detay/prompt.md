Film detayı değişirken eski detay isteği hâlâ yolda olabilir. `AbortDetails`, yeni film geldiğinde eski isteği iptal etmeli ve ekranda yeni filmin başlığını korumalı.

## Gereksinimler

- `id` 550'den 27205'e değiştiğinde ekranda `Başlangıç` görünür.
- 550 için başlatılmış eski isteğin sinyali iptal edilmiş olur.
- Eski istek geç tamamlansa bile ekranda `Başlangıç` kalır.
- İptal edilen istek kullanıcıya normal hata gibi gösterilmez.
- TMDB yetkilendirme başlığı gönderilir.

## Örnek

550 isteği 90 ms, 27205 isteği 5 ms sürer. Hızlı cevap geldikten sonra eski cevap tamamlandığında başlık tekrar `Dövüş Kulübü` olmamalıdır.

## Sözleşme

- Dosya ve export: `AbortDetails.tsx` → `AbortDetails`
- Prop: `{ id: number }`
- Testler ekrandaki `Başlangıç` metnini ve eski isteğin `AbortSignal.aborted` durumunu kontrol eder.
