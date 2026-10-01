Film uç noktasının yetki gereksinimini ve bulunmayan film yanıtını koruyan bir handler oluştur.

## Gereksinimler
- `GET /movie/:id` için davranış üret.
- `Authorization` değeri `Bearer ` ile başlayıp boş olmayan token içermiyorsa 401 ve `{ status_code: 7 }` dön.
- Yetkili istek `id=550` için 200 ve `{ id: 550, title: 'Dövüş Kulübü' }` dön.
- Başka id için 404 ve `{ status_code: 34 }` dön.

## Örnek
`/movie/550` + `Bearer demo` → 200; başlık yok → 401.

## Sözleşme
- `filmHandler.ts` dosyasında `filmHandler` adlı handler’ı export et.
- URL tabanı `TMDB_BASE`.
- JSON cevaplarının alan adları ve HTTP status’ları yukarıdaki gereksinimlerle aynıdır.
