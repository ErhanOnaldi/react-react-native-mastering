Sinema detay route’u açılırken film verisi route görünmeden önce hazırlanmalı; geçersiz id istek başlatmamalı.

## Gereksinimler

- `/movie/:id` için URL id’si pozitif tam sayı olmalı; geçersiz değer detay isteği başlatmadan reddedilmeli.
- Geçerli id’nin film verisi Query cache’inde bulunmalı ve detay sayfası aynı veriyi göstermeli.
- Loader ve sayfa aynı film query kimliğini kullanmalı; loader’dan sonra aynı film için ikinci GET çıkmamalı.
- Sayfa beklerken loading fallback’i, ilk veri isteği hata verince anlaşılır hata UI’ı göstermeli.
- Hata sınırı yalnız detay ağacını etkilemeli; diğer route’lar çalışmaya devam etmeli.
- `/rated` route’u korunmalı.

## Örnek

`/movie/550` route’u Dövüş Kulübü verisini cache’e hazırlar. `/movie/abc` için film GET’i atılmaz.

## Sözleşme

- `src/pages/MovieDetailsPage.tsx`: default export `MovieDetailsPage`.
- `src/router.tsx`: export edilen `routes` içindeki `/movie/:id` route’una loader ve sınırlar ekle.
- Detay verisi için mevcut `movieQueries.detail(id)` tarifi kullanılır.
- QueryClient `src/shared/api/query-client` içinden `queryClient` adıyla alınır.
