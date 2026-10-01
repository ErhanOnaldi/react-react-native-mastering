## Neden böyle?

`data.pages` biriken sayfaların kaynağıdır; ayrıca `useState` dizisi tutmazsın. `getNextPageParam` son sayfayı bulunca `undefined` döndürür ve devam düğmesi kapanır. Her istek `pageParam` kullandığı için ardışık sayfalar doğru sırada eklenir.
