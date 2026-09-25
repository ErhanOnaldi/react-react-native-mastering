Detay sayfası doğru Bearer başlığını gönderiyor; arama sayfası unutunca 401 alıyor. Ortak bir kapı kur.

## İstenen

`ApiError` ve `createTmdbClient(token)` export et. Dönen nesnenin `get<T>(path, params?)` metodu olsun.

- TMDB kökü `https://api.themoviedb.org/3`; her isteğe `language=tr-TR` ekle.
- `Authorization: Bearer <token>` başlığını gönder. `params` string/number/undefined değerleri alır; undefined atlanır.
- Başarıda JSON’u `T` olarak döndür.
- HTTP hata cevabında `ApiError` fırlat: `status` HTTP kodu, `statusCode` TMDB `status_code` değeri (yoksa `null`), `message` TMDB `status_message` (yoksa anlamlı varsayılan).

`get<{ title: string }>('/movie/550')` başlık olarak `Dövüş Kulübü` döndürmeli.
