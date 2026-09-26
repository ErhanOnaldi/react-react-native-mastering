## Neden böyle?

`q` ve `page` URL'de yaşadığı için paylaşım ve geri/ileri kendiliğinden çalışır. Bu ikisini `useQuery`'nin key'ine koymak, her farklı arama+sayfa kombinasyonunu kendi cache girdisine ayırır; aynı kombinasyona kısa süre içinde dönüldüğünde `staleTime` süresi dolmadıysa TanStack Query veriyi ağdan değil elindeki cache'ten verir.

Alternatif olarak router loader ile URL'ye göre veri önceden yüklenebilir (`ensureQueryData`), ama query key mantığı aynı kalır. Sık tuzak: key'e yalnızca `query`'yi koyup `page`'i unutmak — bu durumda farklı sayfalar birbirinin cache'ini ezer. `13.9.1`'de gördüğün "yanlış key" belirtisi burada URL parametresiyle birleşince bu görevin asıl konusu oluyor. Sonraki görevde bu düzeni gerçek bir DummyJSON projesinde kendi dosya sınırınla kuracaksın.
