## Neden böyle?

Router eşleşme için `path` değerini önce bilir; lazy modülden `Component` gibi eşleşme dışı alanları alır. `React.lazy` default export sözleşmesiyle karıştırma. Seyrek ziyaret edilen büyük sayfalar için kod bölme faydalı olabilir; sonraki modülde veri yükleme ayrı konu olacak.

:::sector
Sektörde kod bölme kararı büyük route paketleri ölçülerek verilir; her küçük route ayrı parça olmak zorunda değildir.
:::
