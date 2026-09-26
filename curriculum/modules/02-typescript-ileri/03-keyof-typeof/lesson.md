---
title: "Anahtarları ve değerleri türet"
minutes: 8
kind: concept
---

# Anahtarları ve değerleri türet

:::pain[Problem]
Sıralama kontrolünde `'title'` ve `'vote_average'` elle yazılmış. Bir yerde `'vote_avrage'` yazılınca geçersiz alan sessizce okunuyor.
:::

## Tipler arasındaki ilişkiyi çıkar

Bir nesnenin alan adlarını başka yerde elle tekrar yazarsan iki liste zamanla ayrışabilir. `keyof`, bir nesne tipinin geçerli anahtarlarını; indeksli erişim ise seçilen alanın değer tipini çıkarır. `typeof` farklı yönde çalışır: kodda gerçekten bulunan bir değerin tipini tip dünyasına taşır.

Önceki derste var olan tipten görünüm türetmiştin. Burada da aynı tek kaynak ilkesi geçerli, fakat kaynak bazen tip, bazen sabit değer. Sıralama seçeneklerinin film alanlarıyla uyumlu kalması bunun Sinema'daki karşılığıdır; menü seçenekleri ve form alanlarında da aynı ilişkiyi kurabilirsin.

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
