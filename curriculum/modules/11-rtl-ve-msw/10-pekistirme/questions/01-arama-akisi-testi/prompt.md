## Sorun
Sinema aramasında yalnızca fetch çağrısı kontrol edildiği için boş liste ve hata mesajı bozulsa da test geçiyor.

## Görev
`@impl/SearchPanel` için kullanıcı akışları yaz. Kullanıcı "Matrix" yazıp "Ara"ya basınca önce loading, sonra Matrix başlığı görünsün. Yanıtı loading durumunun gözlenebileceği kadar geciktir. Boş TMDB listesinde "Film bulunamadı", 500 yanıtında "Arama başarısız" alert’i görünsün. Arama isteğinin query değeri Matrix olsun.

## Örnek
Gövde: `{ page: 1, results: [], total_pages: 1, total_results: 0 }`.
