Trend ve popüler içerik cevapları aynı sayfalama bilgilerini taşıyor. Bu ortak alanları tek bir tipte ifade et ve ilk sonucu güvenle seç.

## Gereksinimler

- `page`, `total_pages` ve `total_results` sayı; `results` öğe dizisi olmalı.
- Film ve tür cevapları aynı kabuğu kullanmalı, kendi öğe tiplerini korumalı.
- İlk öğe dönmeli; liste boşsa `undefined` dönmeli.

## Örnek

`results: [{ id: 18, name: 'Dram' }]` olan sayfadan ilk sonuç `{ id: 18, name: 'Dram' }` olur. `results: []` ise sonuç `undefined` olur.

## Sözleşme

- Dosya: `task.ts`
- Export tipleri: `Movie = { id: number; title: string }`, `Genre = { id: number; name: string }`, `Paginated<T>`, `MovieListResponse`, `GenreListResponse`.
- `Paginated<T>` alanları: `page`, `results`, `total_pages`, `total_results`.
- Export fonksiyon: `firstResult<T>(response: Paginated<T>): T | undefined`.
