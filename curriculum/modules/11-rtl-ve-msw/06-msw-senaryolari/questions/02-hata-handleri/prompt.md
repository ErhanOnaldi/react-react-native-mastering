## Sorun
Arama sayfası normal yanıtla çalışıyor. 500 dönüşünü yeniden üretmeden hata görünümünü güvenle sınayamazsın.

## Görev
`makeSearchErrorHandler(status)` fonksiyonu bir MSW handler döndürsün. `GET ${TMDB_BASE}/search/movie` isteğine verilen HTTP status ile `{ status_message: "Arama başarısız" }` JSON cevabı üret. `status` 400–599 aralığında değilse `RangeError` fırlat.

## Örnek
`server.use(makeSearchErrorHandler(503))` → arama isteği 503.
