---
title: "Query key’leri"
minutes: 8
kind: concept
---

# Query key’leri

:::pain[Problem]
`?q=Matrix` ve `?q=Dövüş` aynı `['movies']` key’ini kullanınca ikinci arama ilk filmleri gösteriyor. Cache var ama kimlik yanlış.
:::

## Parametreler kimliğin parçası

```ts check title="src/features/movies/api/movie-keys.ts"
const movieKeys = {
  all: ['movies'] as const,
  search: (query: string, page: number) => ['movies', 'search', query, page] as const,
  detail: (id: number) => ['movies', 'detail', id] as const,
}
```

Aynı veri → aynı key; farklı veri → farklı key. Query key dizisindeki parametreler JSON ile serileştirilebilir olmalı. URL’de `?q=Dövüş&page=2` varsa `useSearchParams` ile okuduğun `q` ve `page` değerleri key’e girmeli. `page` geçersizse önce güvenli bir varsayılan seç.

## Yeni bağlam: route id

Detay rotasında `id` değişince key de değişir. Effect dependency array’inde `id` unutulunca yaşadığın eski film sorununun Query karşılığı budur. Key değişimi farklı cache girdisine geçirir. Sadece `queryFn` closure’ında `id` kullanmak yetmez.

:::sector
Key factory, key biçimini tek yerde tutar. Sonraki modülde invalidation yaparken aynı aileyi hedeflemek kolaylaşır.
:::
