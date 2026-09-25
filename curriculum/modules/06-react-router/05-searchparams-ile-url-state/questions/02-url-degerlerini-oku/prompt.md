`?q=Matrix&page=3&genre=28` adresini yenileyince aynı ekranı kurmak istiyorsun. URL'deki tüm değerler önce metindir.

## Görev

`readSearch(params)` şu güvenli değeri dönsün:

- `q`: baş ve son boşlukları kırpılmış metin; yoksa `''`.
- `page`: pozitif güvenli tam sayı; yoksa veya geçersizse `1`.
- `genre`: pozitif güvenli tam sayı; yoksa veya geçersizse `null`.

Örnek: `?q=Matrix&page=3&genre=28` → `{ q: 'Matrix', page: 3, genre: 28 }`.
