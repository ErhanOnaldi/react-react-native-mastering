TMDB'nin film ve tür listeleri aynı sayfa bilgilerini taşır, ama `results` içindeki öğeler farklıdır. Tanımlayacağın ortak sayfa tipiyle iki cevabı da anlat ve bir sayfanın ilk sonucunu döndüren fonksiyonu yaz.

## Gereksinimler

- `Paginated<T>` şu alanları taşımalı: `page: number`, `results: T[]`, `total_pages: number`, `total_results: number`.
- `MovieListResponse`, `Paginated<Movie>` ile aynı tipte olmalı. `Movie` tipi `{ id: number; title: string }`.
- `GenreListResponse`, `Paginated<Genre>` ile aynı tipte olmalı. `Genre` tipi `{ id: number; name: string }`.
- `firstResult` sayfanın ilk sonucunu döndürmeli; sayfa boşsa `undefined` dönmeli.
- Film veya türün kendine ait alanları `results` içinde korunmalı.

## Örnek

`results: [{ id: 18, name: 'Dram' }]` olan tür sayfasında `firstResult` sonucu `{ id: 18, name: 'Dram' }` olur. `results: []` ise sonuç `undefined` olur.

## Sözleşme

- Dosya: `task.ts`
- Dışa aktarılan tipler: `Movie`, `Genre`, `Paginated`, `MovieListResponse`, `GenreListResponse`.
- Dışa aktarılan fonksiyon: `firstResult`.
