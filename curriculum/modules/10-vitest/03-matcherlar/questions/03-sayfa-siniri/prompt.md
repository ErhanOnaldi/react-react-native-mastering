Sayfa numarası 1–500 aralığında bir tam sayı olmalıdır. Geçerli değeri koru; aralık dışı veya tam sayı olmayan değeri açıkça reddet.

## Gereksinimler

- 1 ve 500 geçerlidir ve aynı sayı olarak döner.
- 0, negatif, ondalık ve 500’den büyük değerler RangeError üretir.
- Hata mesajı tam olarak: Sayfa 1 ile 500 arasında olmalı

## Örnek

| Girdi | Sonuç |
| --- | --- |
| 2 | 2 |
| 500 | 500 |
| 0 | RangeError |
| 2.5 | RangeError |

## Sözleşme

- Düzenlenecek dosya: requirePage.ts
- Export: requirePage(page: number): number
