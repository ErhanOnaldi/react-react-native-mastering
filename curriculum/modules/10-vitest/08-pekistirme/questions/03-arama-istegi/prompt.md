Sinema araması birden fazla kavramı birleştiriyor: sorguyu kırp, sayfayı taşı, Türkçe içerik iste, yetkilendir ve sonucu döndür. `@impl/searchMovies` içindeki `searchMovies(query, page)` fonksiyonu için test yaz.

- `"  dövüş  "`, sayfa `2` girdisinde URL’de `query=dövüş`, `page=2`, `language=tr-TR` olmalı.
- `Authorization: Bearer test-token` gönderilmeli.
- `{ page: 2, results: [{ id: 550, title: 'Dövüş Kulübü' }] }` yanıtı cevap olarak korunmalı.
- Sadece boşluk içeren sorguda hiç istek atılmamalı; boş sonuç dönmeli.

URL parametre sırasına bağlanma. Bu görev refactor’da kaybolan sayfa parametresine doğrudan regresyon testi olacak.
