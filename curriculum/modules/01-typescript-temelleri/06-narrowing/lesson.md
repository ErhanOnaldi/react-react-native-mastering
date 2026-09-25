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
const date = '' as string
const year = date === '' ? 'Tarih yok' : date.slice(0, 4)
void year
```

:::mistake
`if (score)` kontrolü `0` değerini de eksik sayar. TMDB'de 0 oy özel bir anlam taşır; niyetini `score === 0` diye yaz.
:::

## Sektörde
Bir union'ı kullanmadan önce hangi dalda olduğunu kanıtla. `as string` yazıp kontrolü atlamak kullanıcı hatasını geri getirir.
