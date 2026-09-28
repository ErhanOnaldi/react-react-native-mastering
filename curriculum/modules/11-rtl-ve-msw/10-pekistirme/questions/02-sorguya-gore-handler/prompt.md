Arama cevabındaki filmler, kullanıcının gönderdiği query ile eşleşmeli; boş sorgu sonuç döndürmemelidir.

## Gereksinimler
- Baş/son boşluklar eşleşmeyi etkilemez.
- Büyük/küçük harf farkı eşleşmeyi etkilemez; Türkçe harf dönüşümü doğru uygulanır.
- Sorgu, film başlığında aranır.
- Boş query için sonuç dizisi boş ve `total_results` sıfırdır.
- Cevap `{ page: 1, results, total_pages: 1, total_results }` biçimindedir.

## Örnek
`[Dövüş Kulübü, Matrix]` ve `query=matrix` → yalnız Matrix.

## Sözleşme
- `searchHandler.ts` dosyasından `makeSearchHandler(movies: TmdbListMovie[])` export et.
- Fonksiyon `${TMDB_BASE}/search/movie` adresi için MSW handler döndürür.
- `TmdbListMovie` tipi `@test-utils` içinden alınır.
