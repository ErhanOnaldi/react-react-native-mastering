Sinema'nın trend, arama ve detay adresleri aynı TMDB tabanını ve Türkçe dil parametresini kullanacak. Query değerlerini string birleştirerek kurarsan `Kara Şövalye` ve `A&B` gibi aramalar bozulur.

## Gereksinimler

`buildTmdbUrl.ts` içinde **named export** `buildTmdbUrl(path, params?)` fonksiyonunu tamamla. Dönüş tipi `string`.

- Taban: `https://api.themoviedb.org/3`; `path` başında `/` olsa da olmasa da çalışsın.
- Her URL'de varsayılan `language=tr-TR` olsun.
- `params` içindeki string ve number değerleri query'ye ekle; `undefined` olanları atla. `params.language` verilirse varsayılanı değiştirebilsin.
- Query'yi `URLSearchParams` ile kur; karakter kodlamasını elle yazma.

| Girdi | Beklenen query değerleri |
| --- | --- |
| `('/trending/movie/week')` | `language=tr-TR` |
| `('search/movie', { query: 'Kara Şövalye', page: 2 })` | `language=tr-TR`, `query=Kara Şövalye`, `page=2` |
| `('/discover/movie', { with_genres: 28, page: undefined })` | `language=tr-TR`, `with_genres=28`; `page` yok |

Testler URL'yi parse ederek değerleri karşılaştırır. Sıra ve boşluğun `+` ya da `%20` oluşu önemli değil.
