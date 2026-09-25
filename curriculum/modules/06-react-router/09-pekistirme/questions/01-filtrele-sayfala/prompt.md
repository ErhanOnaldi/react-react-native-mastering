Aramayı tüm listede yapıp sonra sayfalamak gerekir. Önce kesersen ikinci sayfadaki eşleşen filmi hiç göremezsin.

## Görev

`selectMovies(movies, params, pageSize)` statik filmleri önce `q` ve `genre` ile filtrelesin, sonra `page` dilimini dönsün.

- Başlık araması Türkçe büyük/küçük harfe duyarsız olsun.
- `genre` sayısal id olarak `genre_ids` içinde aransın.
- `page` yoksa veya geçersizse 1 olsun.
- Sayfalama filtrelenmiş listeye uygulansın.

Örnek: üç Aksiyon filminde `pageSize=2&page=2` → üçüncü film.
