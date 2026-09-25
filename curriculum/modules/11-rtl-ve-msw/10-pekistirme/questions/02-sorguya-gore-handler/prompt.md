## Sorun
Arama testi her sorguda Matrix dönerse URL state hatası gizlenir. API yanıtını istek query’sine bağla.

## Görev
`makeSearchHandler(movies)` bir MSW `GET /search/movie` handler’ı döndürsün. İstek URL’sindeki `query` değerini trim edip Türkçe küçük harfe dönüştür; `title` içinde geçen filmleri filtrele. Boş query için hiç sonuç verme. Liste cevabı `{ page: 1, results, total_pages: 1, total_results }` biçiminde olsun. `movies` verisi için `TmdbListMovie[]` kullan.

## Örnek
`movies=[Dövüş Kulübü, Matrix]`, `?query=matrix` → yalnızca Matrix.
