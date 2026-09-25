Detay sayfası ilk açıldığında birden çok yükleme dalı ve geç gelen GET var. Route düzeyinde veriyi hazırla.

- `src/pages/MovieDetailsPage.tsx` default export `MovieDetailsPage`: `movieQueries.detail(id)` ile `useSuspenseQuery` kullan; gelen film başlığını göster. `id` URL parametresinden gelir, geçersizse açık hata ver.
- `src/router.tsx` export `routes` içinde `/movie/:id` route’unun `loader`’ı, aynı `movieQueries.detail(id)` ile `queryClient.ensureQueryData` çağırmalı. Geçersiz id’yi reddet.
- Bu route’un render ağacına `<Suspense fallback=...>` ve ErrorBoundary yerleştir. İstek 500 olunca kullanıcı hata ekranı görsün; diğer route’lar çalışabilsin.

Loader verisini component state’ine kopyalama; `useSuspenseQuery` cache aboneliğini sürdürür. `/rated` route’unu koru.
