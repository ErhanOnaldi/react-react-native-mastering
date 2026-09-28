Sayfa dilimi farklı sayfa sınırlarında doğru kayıtları seçmeli. İkinci sayfanın başlangıcını ve kısmi son sayfayı içerik düzeyinde doğrula.

## Gereksinimler

- 1’den 41’e sıralı id’lerle, 20’lik sayfa boyutunda ikinci sayfa 21–40 aralığını içermeli.
- Üçüncü sayfa tek kayıt olan 41’i içermeli.
- Testler son sayfanın içeriğini ve uzunluğunu birlikte güvenceye almalı.

## Örnek

| Sayfa | Beklenen id’ler |
| --- | --- |
| 2 | 21–40 |
| 3 | 41 |

## Sözleşme

- Yazılacak dosya: pageSlice.test.ts
- Test edilecek modül: @impl/pageSlice
- Çağrı: pageSlice<T>(items: T[], page: number, pageSize: number): T[]
