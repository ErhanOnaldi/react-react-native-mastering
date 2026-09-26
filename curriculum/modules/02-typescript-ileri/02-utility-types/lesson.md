---
title: "Var olan tipten yeni tip"
minutes: 9
kind: concept
---

# Var olan tipten yeni tip

:::pain[Problem]
`MovieCard` yalnızca `id`, `title` ve `poster_path` okuyor. Kart için bütün `Movie` alanlarını yeniden yazınca `poster_path` bir dosyada `string`, diğerinde `string | null` olmuş.
:::

## Tip türetmek ne demek?

Bir veri modelinin her kullanım yeri bütün alanlara ihtiyaç duymaz. Ayrı ayrı tipler kopyalamak yerine mevcut tipten yeni bir görünüm türetirsen, ortak alanların anlamı tek kaynaktan gelir. TypeScript'in `Pick`, `Omit`, `Partial`, `Record` ve `Readonly` gibi utility type'ları bu dönüşümleri tip düzeyinde ifade eder.

Bu, generic fikrinin pratik devamıdır: `Pick<T, K>` bir nesne tipi ve anahtar kümesi alır. Sinema kartında daha küçük bir `Movie` görünümü istemen bu genel ilişkinin somut hâli. Türetilen tipin yalnızca derleyiciye yol gösterdiğini, çalışma zamanındaki nesneyi değiştirmediğini aklında tut.

## Tek kaynaktan türet

`Pick<Movie, 'id' | 'title' | 'poster_path'>` kartın ihtiyacını ana `Movie` tipinden alır. Böylece null bilgisi de taşınır. Ters ihtiyaçta `Omit<Movie, 'id'>` kimliği çıkartır. `Omit` merdivenine burada başlıyoruz: önce tek alan, sonra birkaç alan; daha sonra `Partial` ile birleşecek.

```ts check
type Movie = { id: number; title: string; poster_path: string | null; vote_average: number }
type MovieCard = Pick<Movie, 'id' | 'title' | 'poster_path'>
type NewMovie = Omit<Movie, 'id'>
type MoviePatch = Partial<Pick<Movie, 'title' | 'poster_path'>>
const patch: MoviePatch = { poster_path: null }
```

`Partial<T>` tüm alanları opsiyonel yapar; mevcut alanın `null` olma bilgisini değiştirmez. `Record<K,V>` belirli anahtarların her biri için değer ister. `Readonly<T>` üst düzey alanların yeniden atanmasını engeller.

## Sınır

Bu yardımcılar çalışma zamanında nesneden alan silmez. `Omit<Movie, 'id'>` tipini yazmak, elindeki nesnenin `id` değerini fiziksel olarak kaldırmaz. İhtiyaç olduğunda destructuring ile gerçekten kaldır.

:::sector
React modülünde `Omit<ComponentProps<'button'>, 'type'>` ile bileşen API'si kuracaksın. Zod modülünde aynı düşüncenin şema karşılığına döneceğiz.
:::
