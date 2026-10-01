## Neden böyle?

`T extends { id: number }` fonksiyonun her öğede `id` okuyabilmesini sağlar, `T` ise filmin `title` gibi diğer alanlarını korur. `map` yeni bir dizi üretir; koşul eşleşen öğeyi `next` ile değiştirir, diğer öğeleri olduğu gibi döndürür. Eşleşme yoksa içerik aynı kalır ama dizi yenidir.
