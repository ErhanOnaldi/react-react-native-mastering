Sinema’da bulunmayan film `404` döner. Hata sayfası hangi mesajı göstereceğine `ApiError` alanlarıyla karar verir. `@impl/errorClient` içindeki `getMovie(id)` fonksiyonuna hata testi yaz.

- 404 yanıtında TMDB gövdesi `{ status_code: 34, status_message: 'Film bulunamadı' }` olsun.
- `getMovie(999999)` reddedilmeli.
- Hata nesnesinin `status: 404`, `statusCode: 34` ve `message: 'Film bulunamadı'` alanlarını ölç.
- Testten sonra değiştirilen global davranış geri alınsın.

Sadece “herhangi bir hata fırladı” assertion’ı yetersizdir: yanlış türde hata da geçebilir.
