---
title: "Query key’leri"
minutes: 8
kind: concept
---

# Query key’leri

:::pain[Problem]
`?q=Matrix` ve `?q=Dövüş` aynı `['movies']` key’ini kullanınca ikinci arama ilk filmleri gösteriyor. Cache var ama kimlik yanlış.
:::

## Cache girdisinin kimliği

Cache, bir sonucu daha sonra bulabilmek için anahtar kullanır. Query key'i yalnızca bir etiket değildir; hangi parametre birleşiminin hangi veriyi temsil ettiğini belirleyen kimliktir. Sonucu etkileyen `q`, `page` veya `id` değişirse key de değişmelidir. Aynı key'i paylaşan okumalar aynı cache girdisini paylaşır.

Router dersinde URL'yi ekran durumunun kaynağı yaptın. Şimdi URL'den okunan değerler Query key'ine geçiyor. Sinema'da iki aramanın karışması, bu bağlantının eksik kurulmasından doğar. Sonraki mutation dersinde hangi cache girdisinin güncelleneceğini de bu kimlik üzerinden belirleyeceksin.

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
