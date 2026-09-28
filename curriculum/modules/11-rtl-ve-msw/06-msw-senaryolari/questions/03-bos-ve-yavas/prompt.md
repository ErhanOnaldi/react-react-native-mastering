Arama endpoint’i boş sonuç, gecikmeli yanıt ve geçersiz sayfa davranışını üretmelidir.

## Gereksinimler
- Liste yanıtı `{ page, results: [], total_pages: 1, total_results: 0 }` biçimindedir.
- `page` query değeri yanıt içinde korunur; parametre yoksa 1 kullanılır.
- Sayfa değeri 1’den küçük veya tam sayı değilse 400 ve `{ status_code: 22 }` dön.
- Yanıt, factory’ye verilen süre kadar gecikmelidir.

## Örnek
`?page=2` → `page: 2`, boş `results`; `?page=0` → 400.

## Sözleşme
- `emptyHandler.ts` dosyasında `makeEmptySearchHandler(waitMs: number)` export et.
- Dönen handler `GET ${TMDB_BASE}/search/movie` için geçerlidir.
