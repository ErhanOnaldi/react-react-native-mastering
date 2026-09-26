Detay sayfası ilk açıldığında birden çok yükleme dalı ve geç gelen GET var. Route düzeyinde veriyi hazırla.

- `src/pages/MovieDetailsPage.tsx` default export `MovieDetailsPage`: URL’deki `id` için `movieQueries.detail(id)` verisini göster. Geçersiz id açık hata versin.
- `src/router.tsx` export `routes` içinde `/movie/:id` route’unun `loader`’ı film verisini aynı query key’ine önceden koysun. Geçersiz id’yi reddetsin ve detay GET’i başlatmasın.
- Bu route’un render ağacına `<Suspense fallback=...>` ve ErrorBoundary yerleştir. İstek 500 olunca kullanıcı hata ekranı görsün; diğer route’lar çalışabilsin.

`/rated` route’unu koru.
