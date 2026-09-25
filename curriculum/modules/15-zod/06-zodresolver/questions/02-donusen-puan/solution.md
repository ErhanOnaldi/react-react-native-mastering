## Neden böyle?

`z.input` formun tuttuğu ham değeri, `z.output` submit handler'a ulaşan sayıyı anlatır. İkisi aynı sanılırsa dönüşümün tip güvencesi kaybolur. `z.coerce.number()` boş stringi 0 yapar; min(1) onu reddeder.

## Alternatif, tuzak ve devamı

`valueAsNumber` başka bir dönüşüm yoludur, ama burada dönüşümü şemada tutuyoruz. Boş string `0` olur ve min(1) ile reddedilir. API verisinde de önce dönüşüm, sonra kural sırası önemlidir.
