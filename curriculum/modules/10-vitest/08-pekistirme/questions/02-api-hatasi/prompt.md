Sinema’da bulunmayan film `404` döner. Hata sayfası hangi mesajı göstereceğine `ApiError` alanlarıyla karar verir. `@impl/errorClient` içindeki `getMovie(id)` fonksiyonuna, sahte `fetch` ile hata testi yaz.

- `vi.fn` ile `Response.json({ status_code: 34, status_message: 'Film bulunamadı' }, { status: 404 })` döndür.
- `getMovie(999999)` reddedilmeli.
- Hata nesnesinin `status: 404`, `statusCode: 34` ve `message: 'Film bulunamadı'` alanlarını ölç.
- Global fetch’i test sonunda geri al.

Sadece “herhangi bir hata fırladı” assertion’ı yetersizdir: yanlış türde hata da geçebilir.
