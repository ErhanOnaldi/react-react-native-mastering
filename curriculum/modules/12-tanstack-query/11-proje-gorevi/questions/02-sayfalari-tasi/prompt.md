Dört sayfada `useEffect` ile benzer loading/error/data state dalları var. Aramaya geri dönüşte istek sayacı artıyor; sayfa değişiminde liste boşalıyor.

## İstenen

- Home, Search, MovieDetails ve Favorites sayfalarının **sunucu verisi** akışını `useQuery`, `useQueries` veya `useInfiniteQuery` ile Query cache’inden yönet. Favori id’leri mevcut client state olarak kalsın.
- SearchPage’de URL’deki `q` ve `page`, HomePage’de `genre` ve `page` değişince doğru veri görünsün. Boş aramada GET atma. Geçersiz page için 1 kullan.
- Sayfalama sorgularında `keepPreviousData` kullan. Yeni sayfa beklerken önceki liste görünür ve geçici olduğu anlaşılır.
- `MovieDetailsPage` route id’si değiştiğinde yeni film görünsün. Loading, error, boş ve başarı durumları anlaşılır kalsın.

`?q=Dövüş` → detay → geri akışını istek sayacında karşılaştır: taze cache ile ikinci arama GET’i gitmemeli.
