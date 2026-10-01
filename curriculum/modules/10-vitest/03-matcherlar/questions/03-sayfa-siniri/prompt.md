TMDB sayfa numarası 1–500 aralığında bir tam sayı olmalı. `requirePage` geçerli değeri aynen döndürür, geçersiz değerde açık bir `RangeError` üretir. Bu davranışın sınırlarını test et.

## Gereksinimler

- 1 ve 500 aynı sayı olarak dönmeli.
- 0, negatif, ondalık ve 500’den büyük değerler reddedilmeli.
- Hata türü `RangeError`, mesajı `Sayfa 1 ile 500 arasında olmalı` olmalı.
- Testler geçerli sınırları ve geçersiz değerleri ayrı davranış adlarıyla göstermeli.

## Örnek

| Girdi | Sonuç |
| --- | --- |
| 2 | 2 |
| 500 | 500 |
| 0 | RangeError |
| 2.5 | RangeError |

## Sözleşme

- Yazılacak dosya: `requirePage.test.ts`
- Test edilecek modül: `@impl/requirePage`
- Export: `requirePage(page: number): number`
