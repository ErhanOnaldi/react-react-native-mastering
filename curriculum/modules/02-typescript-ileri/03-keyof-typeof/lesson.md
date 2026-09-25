---
title: "Anahtarları ve değerleri türet"
minutes: 8
kind: concept
---

# Anahtarları ve değerleri türet

:::pain[Problem]
Sıralama kontrolünde `'title'` ve `'vote_average'` elle yazılmış. Bir yerde `'vote_avrage'` yazılınca geçersiz alan sessizce okunuyor.
:::

## Anahtarın da tipi var

`keyof Movie` geçerli alan adlarını birleştirir. `Movie['genre_ids']` ise alanın tipini doğrudan alır. `typeof` bir değerin tipini yakalar; tip ve çalışma zamanı arasındaki yön farkına dikkat et.

```ts check
type Movie = { id: number; title: string; genre_ids: number[] }
type MovieKey = keyof Movie
type GenreIds = Movie['genre_ids']
const field: MovieKey = 'title'
const ids: GenreIds = [18, 53]
const SORT_FIELDS = ['title', 'id'] as const
type SortField = (typeof SORT_FIELDS)[number]
const sort: SortField = 'title'
```

Dizi sıradan tanımlanırsa eleman tipi `string`e genişler. `as const` ile literal değerler korunur; dizi de readonly olur.

:::mistake
`typeof Movie` yazamazsın: `Movie` bir tip adı, çalışma zamanı değeri değil. `typeof SORT_FIELDS` yazabilirsin çünkü dizi gerçek bir değerdir.
:::

:::sector
Filtre ve sıralama anahtarlarını tek bir sabit diziden türetmek UI seçenekleriyle kabul edilen değerleri senkron tutar.
:::
