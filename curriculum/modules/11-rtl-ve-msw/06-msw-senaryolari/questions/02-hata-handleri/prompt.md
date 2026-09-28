Arama endpoint’inin hata yanıtını testlerde seçilebilir hale getir ve geçersiz status değerini reddet.

## Gereksinimler
- Verilen status ile `{ status_message: 'Arama başarısız' }` JSON cevabı üret.
- Yalnızca 400–599 aralığındaki status değerlerini kabul et.
- Aralık dışı değer için `RangeError` fırlat.

## Örnek
`503` → arama isteğine 503; `200` → `RangeError`.

## Sözleşme
- `errorHandler.ts` dosyasından `makeSearchErrorHandler(status: number)` export edilir.
- Fonksiyon MSW handler’ı döndürür; endpoint `${TMDB_BASE}/search/movie`.
