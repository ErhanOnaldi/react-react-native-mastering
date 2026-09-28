Arama ve detay cevaplarının cache kimliğini tek bir public sözleşmede üret.

## Gereksinimler

- `all` değeri `['movies']` olsun.
- `search(query, page)` `['movies', 'search', query.trim(), page]` döndürsün.
- `detail(id)` `['movies', 'detail', id]` döndürsün.
- Başındaki/sonundaki boşlukları yok say; arama metninin iç boşluklarını koru.

## Örnek

- `search(' Matrix ', 2)` → `['movies', 'search', 'Matrix', 2]`
- `detail(550)` → `['movies', 'detail', 550]`

## Sözleşme

- `movieKeys.ts` dosyasından `movieKeys` named export edilir.
- `all`, `search(query: string, page: number)` ve `detail(id: number)` alanları public’tir.
- Dönen tuple tipleri literal olarak korunur.
