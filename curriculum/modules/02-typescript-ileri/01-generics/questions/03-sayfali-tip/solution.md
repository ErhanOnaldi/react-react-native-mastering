## Neden böyle?

`Paginated<T>` sayfalama alanlarını tek yerde tutar ve yalnızca `results` öğe tipiyle değişir. `MovieListResponse` ile `GenreListResponse` böylece aynı şekli kullanırken kendi alanlarını korur. İlk öğe olmayabileceği için `firstResult` dönüşünde `undefined` vardır.
