Sinema’da `?page=0` yanlışlıkla TMDB’ye giderse 400 cevabı kullanıcıya genel hata gibi görünür. URL’den gelen sayıyı isteğe çıkmadan önce doğrula. Bu klasik kod görevinde testler hazır; `requirePage.ts` dosyasını sen tamamlayacaksın.

## Sözleşme

- `requirePage(page: number): number` export et.
- Tam sayı ve 1–500 aralığındaysa değeri aynen döndür.
- 0, negatif, ondalık ve 500’den büyük değerlerde `RangeError("Sayfa 1 ile 500 arasında olmalı")` fırlat.

| Girdi | Sonuç |
| --- | --- |
| `2` | `2` |
| `500` | `500` |
| `0` | `RangeError` |
| `2.5` | `RangeError` |

Test dosyasındaki `toBe` ile `toThrow` kullanımını karşılaştır: biri normal dönüşü, diğeri görünür hata sözleşmesini ölçer.
