## Neden böyle?

`*` eşleşmeyen adres içindir; `errorElement` eşleşen route'ta loader veya render hatası içindir. `useRouteError()` bilinmeyen tiptedir; önce daraltmak güvenli erişim sağlar. Ham exception metnini kullanıcıya göstermek gereksiz teknik ayrıntı sızdırır. Sonraki derste route kodunu ihtiyaç anında yükleyeceksin.

:::sector
Sektörde hata ekranı kullanıcının dönebileceği bir yol sunar ve teknik ayrıntıyı log tarafında bırakır.
:::
