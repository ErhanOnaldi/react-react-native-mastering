## Sorun
Boş arama sonucunda eski kartlar kalıyor. Gerçek API bazen yavaş cevap verdiği için loading anını da görmek istiyorsun.

## Görev
`makeEmptySearchHandler(waitMs)` fonksiyonu `GET /search/movie` için MSW handler döndürsün. Handler `await delay(waitMs)` sonrası isteğin `page` query değerini (`yoksa 1`) kullanarak `{ page, results: [], total_pages: 1, total_results: 0 }` dönsün. Geçersiz sayfa (`<1` veya tam sayı değil) için 400 ve `{ status_code: 22 }` dön.

## Örnek
`?page=2` → `page: 2`, boş `results`.
