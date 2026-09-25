## Neden böyle?

`queryClient` tek uygulama cache’i olarak kurulur ve sağlayıcıyla ağaca verilir.

Altı `movieQueries` tarifi parametreleri key’e taşır ve mevcut API fonksiyonlarını kullanır.

Factory’nin tip çıkarımı `fetchQuery` ve sayfalarda tekrar generic yazmayı gerektirmez.

Sonraki modülde puan verme mutation’ı ve invalidation eklenecek.
