---
title: "Bağımlı sorgular"
minutes: 8
kind: concept
---

# Bağımlı sorgular

:::pain[Problem]
Detay rotası ilk anda geçerli bir `id` vermiyorsa `/movie/NaN` isteği gidiyor. Favori listesinde `id` henüz yokken detay sorgusu başlamamalı.
:::

## Bir veriyi bekleyen ikinci sorgu

Bazı istekler ancak başka bir değer hazır olduğunda anlamlıdır. Bağımlı query, gerekli kimlik veya önceki sorgu sonucu gelene kadar başlatılmaz; hook yine her render'da aynı sırayla çağrılır. Koşul sorgunun seçeneklerinde ifade edilir. Böylece geçersiz parametreyle istek atmak yerine veri bağımlılığını açıkça modelliyorsun.

Router'da URL parametresini doğrulamayı öğrendin; Query burada doğrulanmış değeri bekler. Sinema'daki `/movie/NaN` semptomu, URL sınırıyla ağ sınırının kopmasından doğar. Aynı yaklaşım önce kullanıcıyı, sonra o kullanıcının kayıtlarını yükleyen akışlarda da geçerlidir.

## Koşullu başlat

`enabled: Boolean(id)` sorguyu durdurur; `id` geldiğinde otomatik başlatır. TypeScript yine `id` tipini daraltmanı isteyebilir. `skipToken` ise `queryFn` yerine konur ve tip çıkarımını korur:

```ts check title="src/useOptionalMovie.ts"
import { skipToken, useQuery } from '@tanstack/react-query'

declare function getMovieDetails(id: number): Promise<{ title: string }>

export function useOptionalMovie(id: number | undefined) {
  return useQuery({
    queryKey: ['movies', 'detail', id],
    queryFn: id === undefined ? skipToken : () => getMovieDetails(id),
  })
}
```

`skipToken` ile devre dışı sorguda `refetch()` çağırırsan queryFn bulunmadığı için hata alırsın. Kullanıcı tıklamasıyla elle başlatman gerekiyorsa `enabled: false` ve geçerli bir `queryFn` düşün.

:::mistake
Hook’u koşullu çağırma. Koşul, hook’un içinde `enabled` veya `queryFn` seçimi olmalı.
:::
