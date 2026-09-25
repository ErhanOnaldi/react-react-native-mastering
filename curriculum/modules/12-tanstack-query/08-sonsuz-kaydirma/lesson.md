---
title: "Sonsuz kaydırma"
minutes: 8
kind: concept
---

# Sonsuz kaydırma

:::pain[Problem]
Trend sayfasında "Daha fazla" ile sayfa 2’yi getirince sayfa 1 kayboluyor. Burada önceki sayfanın yerine koymak değil, sayfaları birleştirmek istiyorsun.
:::

## Sayfa zinciri

`useInfiniteQuery` sonucunda `data.pages` ve `data.pageParams` bulunur. `initialPageParam: 1` ile başlat; `getNextPageParam` son cevabın `page` ve `total_pages` alanlarından sonraki sayfayı hesaplar. `hasNextPage` yanlışsa düğmeyi kapat, `isFetchingNextPage` sürerken tekrar tıklamayı engelle.

```ts check title="src/next-page.ts"
export function nextPage(last: { page: number; total_pages: number }) {
  return last.page < last.total_pages ? last.page + 1 : undefined
}
```

`maxPages` bellekte tutulan sayfa sayısını sınırlar. İleri ve geri yönde kullanılacaksa `getPreviousPageParam` da gerekir; yalnız ileri yönde sınırlama yapınca eski sayfaya dönme davranışını ayrıca tasarla. Görüntülemek için `data.pages.flatMap(page => page.results)` kullan.

:::mistake
`useQuery` ile tek bir `page` anahtarını değiştirip eski sayfayı ayrıca `useState` dizisine eklemek cache ile yerel diziyi iki kaynak yapar.
:::
