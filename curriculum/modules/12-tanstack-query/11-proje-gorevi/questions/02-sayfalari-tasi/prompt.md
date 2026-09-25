Dört sayfada `useEffect` ile benzer loading/error/data state dalları var. Aramaya geri dönüşte istek sayacı artıyor; sayfa değişiminde liste boşalıyor.

## İstenen

- Home, Search, MovieDetails ve Favorites sayfalarının **sunucu verisi** akışını `useQuery` ve `movieQueries` tarifleriyle yönet. Favori id’leri mevcut client state olarak kalsın; detaylar `movieQueries.detail(id)` üzerinden okunsun.
- SearchPage’de URL’deki `q` ve `page` key’e girsin. Boş aramada GET atma (`skipToken` veya `enabled`). HomePage’de `genre` ve `page` key’e girsin. Geçersiz page için 1 kullan.
- Sayfalama sorgularında `placeholderData: keepPreviousData` kullan. Yeni sayfa beklerken önceki liste görünür, `isPlaceholderData` ile geçici durumu belirt.
- `MovieDetailsPage` route id’si değiştiğinde yeni key yeni filmi göstersin. Loading, error, boş ve başarı durumları anlaşılır kalsın.

`?q=Dövüş` → detay → geri akışını istek sayacında karşılaştır: taze cache ile ikinci arama GET’i gitmemeli.
