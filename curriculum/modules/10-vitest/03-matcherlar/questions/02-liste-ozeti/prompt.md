Liste özeti ikinci sayfayı ve toplam sayfa sayısını bildirir. Bu iki değerin doğru kaldığını, sonuç nesnesine ileride başka alanlar eklendiğinde testi kırmadan doğrula.

## Gereksinimler

- 41 toplam sonuç ve 20 kayıtlık sayfa boyutuyla ikinci sayfanın özeti page değeri 2 olmalı.
- Aynı girdi için total_pages değeri 3 olmalı.
- Bu alanları ayrı assertion’larla güvenceye al.
- Ek alanlar testin geçmesini engellememeli.

## Örnek

Girdi: page 2, total_results 41, results içinde 20 film.
Beklenen alanlar: page 2 ve total_pages 3.

## Sözleşme

- Yazılacak dosya: summarizeMovies.test.ts
- Test edilecek modül: @impl/summarizeMovies
- summarizeMovies(data: MoviePage) çağrısının sonucunda page ve total_pages alanları denetlenir.
- MoviePage girdisi: page number, total_results number, results ise id ve title alanlı film dizisidir.
