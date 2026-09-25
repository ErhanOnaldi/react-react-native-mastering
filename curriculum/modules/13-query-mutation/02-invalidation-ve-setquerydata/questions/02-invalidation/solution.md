## Neden böyle?

Mutation key’lerden hangisinin etkilendiğini bilemez. Invalidation sunucuyu doğru kaynak kabul eder ve aktif query’yi yeniden okur. Filtresiz `invalidateQueries()` ilgisiz sayfaları da yeniler. Sonraki görevde veri zaten elimizdeyse nasıl ek GET’siz güncellendiğini göreceksin.
