## Neden böyle?

Ayrı bir `visibleMovies` state’i, query değiştiğinde güncellenmeyi unutabilir. Filtre sonucu mevcut statik veri ve query’den her render’da hesaplanır. Türkçe büyük/küçük harf için `toLocaleLowerCase('tr')` kullanmak “İ/i” örneklerinde yararlıdır. Sonraki birleşik görevde aynı sorgu favori state’iyle birlikte yaşayacak.
