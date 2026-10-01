## Neden böyle?

`onMutate` eski listeyi context’e koyup silinen satırı immutable `filter` ile çıkarır. `remove` reject ederse `onError` snapshot’ı geri yükler; başarıda `onSuccess` yalnız bu session’ın listesini yeniler. Silme başarısızken cache’i yeniden okumak gerekmez, çünkü sunucudaki kayıt değişmemiştir.
