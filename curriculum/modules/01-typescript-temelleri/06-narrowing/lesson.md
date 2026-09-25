---
title: Narrowing ile güvenli dallanma
minutes: 10
kind: concept
---

# Narrowing ile güvenli dallanma

:::pain[Problem]
`poster_path` null olduğunda `.startsWith()` patladı. Boş `release_date` ise `slice` ile boş yıl verdi; bunu kullanıcıya nasıl göstereceksin?
:::

## Daraltma
Kontrolden sonra TypeScript kalan olasılığı bilir. `typeof` ilkel değerleri, `=== null` null'ı, `in` alan varlığını ayırır. Erken dönüş iç içe `if` kalabalığını azaltır.

```ts check
function posterLabel(path: string | null): string {
  if (path === null) return 'Poster yok'
  return path.startsWith('/') ? path : `/${path}`
}
void posterLabel
```

## Eksik değer ile boş değer
`path?.startsWith('/')` null durumda `undefined` döndürür. `??` yalnızca null/undefined için varsayılan verir; `||` boş string ve 0 için de varsayılan verir. Bu yüzden boş tarih için önce `date === ''` kontrolünü yap.

```ts check
let date: string = ''
const year = date === '' ? 'Tarih yok' : date.slice(0, 4)
void year
```

:::mistake
`if (score)` kontrolü `0` değerini de eksik sayar. TMDB'de 0 oy özel bir anlam taşır; niyetini `score === 0` diye yaz.
:::

## Dalların içinde tip değişir
`path === null` kontrolünden sonra null dalında döndüysen sonraki satırdaki `path` artık string'dir. Bu bilgi yalnızca derleyicinin tahmini değildir: kod akışındaki gerçek koşula dayanır. `typeof value === 'string'` bilinmeyen girdide benzer şekilde çalışır. Nesnede `title in value` alanın varlığını kanıtlar, fakat başlığın string olduğunu ayrıca kontrol etmen gerekir.

Truthy kontrolü kısa görünür ama tüm falsy değerleri kapsar: `null`, `undefined`, `''`, `0`, `false`. TMDB puanında 0 “henüz oy yok” demektir; boş tarih ise “tarih yok”. İkisine ayrı ve açık koşul yazmak ekran metnini kararlı yapar.

## `?.` ve `??` doğru yerde
`movie.poster_path?.startsWith('/')` null'da çökmez, fakat sonuç `boolean | undefined` olur. Bu sonuçla ne yapılacağını yine seçmelisin. `movie.poster_path ?? '/fallback.png'` null için varsayılan verir, boş string için vermez. Boş string de eksik sayılacaksa ayrıca kontrol et. Kısa sözdizimi, alanın gerçek anlamı hakkında karar vermenin yerini almaz.

:::sector
API sınırında erken dönüşler hata durumlarını üstte toplar. Mutlu yol aşağıda düz kalır; kod incelemesinde hangi boş değerin nasıl ele alındığı görülür.
:::
