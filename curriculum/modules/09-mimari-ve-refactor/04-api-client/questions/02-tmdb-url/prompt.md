TMDB isteklerinin tam adresini kur; arama ve filtre değerleri Türkçe karakterlerde de doğru okunabilsin.

## Gereksinimler

- Her URL `https://api.themoviedb.org/3` köküne gitsin; verilen path `/` ile başlar.
- Her URL'de `language=tr-TR` bulunsun.
- Parametrelerdeki string ve number değerleri eklensin; `undefined` değer atlanmalı.
- Boşluk ve Türkçe karakter içeren değer URL'den geri okunduğunda değişmemeli.

## Örnek

`/search/movie`, `{ query: 'Dövüş Kulübü', page: 2 }` girdisi için URL'nin `pathname` değeri `/3/search/movie`, `query` değeri `Dövüş Kulübü`, `page` değeri `2` olmalı.

## Sözleşme

- Dosya ve export: `buildTmdbUrl.ts` → `buildTmdbUrl(path: string, params?: Record<string, string | number | undefined>): string`

## Kısıtlar

- Path ve query string'i tek bir tam URL içinde döndür.
