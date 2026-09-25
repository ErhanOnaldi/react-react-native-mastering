## Sorun
Sinema aramasında yalnızca fetch çağrısı kontrol edildiği için boş liste ve hata mesajı bozulsa da test geçiyor.

## Görev
`@impl/SearchPanel` için kullanıcı akışları yaz. Kullanıcı "Matrix" yazıp "Ara"ya basınca önce loading, sonra Matrix başlığı görünsün. Loading durumunu güvenilir biçimde görmek için bu başarı handler’ında `await delay(150)` kullan. `server.use` ile boş TMDB listesi döndürüp "Film bulunamadı" durumunu sına. Ayrı testte 500 dönüp "Arama başarısız" alert’ini sına. `requests('/3/search/movie')` kaydında query=Matrix olduğunu doğrula.

## Örnek
Gövde: `{ page: 1, results: [], total_pages: 1, total_results: 0 }`.
