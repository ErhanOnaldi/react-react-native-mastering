Arama ve detay sayfaları TMDB adresini elle birleştirince `?`, `&` ve Türkçe karakterler kolay bozuluyor.

## İstenen

`buildTmdbUrl(path, params?)` tam URL döndürsün.

- Kök: `https://api.themoviedb.org/3`. `path` başında `/` ile gelir.
- Her istekte `language=tr-TR` olsun.
- `params` içindeki string ve number değerlerini ekle; `undefined` değerleri atla.
- `URL`/`URLSearchParams` kullan; boşluk ve `ö` gibi karakterleri güvenli kodla.

Örnek: `buildTmdbUrl('/search/movie', { query: 'Dövüş Kulübü', page: 2 })` çıktısı bir URL olmalı; `searchParams.get('query')` yeniden `Dövüş Kulübü` vermeli.
