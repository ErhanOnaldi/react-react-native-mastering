---
title: "queryOptions ve factory"
minutes: 8
kind: concept
---

# queryOptions ve factory

:::pain[Problem]
Detay sayfası ve kartın hover davranışı `/movie/550` için farklı key yazarsa prefetch edilen veri sayfada kullanılamaz.
:::

## Sorgu tanımını tek yerde tut

Bir query'nin kimliği (`queryKey`) ve veriyi getiren işlevi (`queryFn`) birlikte bir sözleşme oluşturur. İkisini farklı yerlerde ayrı ayrı yazmak, aynı veriye farklı key verme riskini büyütür. `queryOptions` bu seçenekleri yeniden kullanılabilir, tipli bir tarif hâline getirir; tarifi oluşturmak kendi başına ağ isteği başlatmaz.

Generic ve tek kaynak ilkelerini TypeScript modülünde gördün. Sinema'nın detay sorgusu hem ekranda hem prefetch sırasında kullanılınca aynı tip ve key bilgisini paylaşması gerekir. Bu tarif, ileride router loader'ı ve testlerde de aynı veriye işaret edebilir.

## Tek tarif

`queryOptions` key ile fetch fonksiyonunu aynı tipli nesnede toplar. `useQuery(movieQueries.detail(id))` ve `queryClient.prefetchQuery(movieQueries.detail(id))` aynı tarifi kullanır.

```ts check title="src/features/movies/api/movie-queries.ts"
import { queryOptions } from '@tanstack/react-query'

type Movie = { id: number; title: string }
declare function getMovieDetails(id: number): Promise<Movie>

export const movieQueries = {
  all: ['movies'] as const,
  detail: (id: number) =>
    queryOptions({
      queryKey: ['movies', 'detail', id] as const,
      queryFn: () => getMovieDetails(id),
      staleTime: 60_000,
    }),
}
```

`Movie` tipi `queryFn`’in dönüşünden çıkarılır; `useQuery` tarafında yeniden generic yazman gerekmez. Önceki generic merdivenine yeni basamak: aynı tip bilgisi `fetchQuery` ve `prefetchQuery` çağrılarına da taşınır.

:::mistake
`queryOptions` veri çekmez; yalnızca seçenekleri kurar. İsteği `useQuery` veya `queryClient` metodu başlatır.
:::
