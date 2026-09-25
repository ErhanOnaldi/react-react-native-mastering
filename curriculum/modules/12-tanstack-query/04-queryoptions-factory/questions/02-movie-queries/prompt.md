Kart ve detay sayfası aynı film için ayrı key yazıyor. İkisine de verilecek tipli tarifi kur.

## İstenen

`movieQueries` export et:

- `all`: `['movies']`.
- `detail(id)`: `queryOptions` ile key `['movies','detail',id]`, TMDB `/movie/:id`, 60 saniye staleTime.
- `search(query,page)`: key’de normalize edilmiş query ve page; TMDB `/search/movie` çağrısında da bu değerler.
- Bearer ve `language=tr-TR` gönder; HTTP hatasını fırlat.

Dönen veri `queryFn` üzerinden tip çıkarımına sahip olmalı; çağıran her yerde generic yazmamalı.
