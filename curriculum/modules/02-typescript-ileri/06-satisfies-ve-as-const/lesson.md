---
title: "Config sözleşmesini koru"
minutes: 8
kind: concept
---

# Config sözleşmesini koru

:::pain[Problem]
Tür renkleri tablosunda 53 numaralı Gerilim rengi unutulmuş. Tabloya `Record<number,string>` açıklaması ekleyince de tek tek renk literal'leri kaybolmuş.
:::

## Sabit veri ile tip sözleşmesini ayır

Kaynak koduna yazdığın sabit bir nesnenin iki özelliği olabilir: belirli bir şekle uyması ve içindeki değerlerin mümkün olduğunca kesin tiplerini koruması. Açık tip açıklaması şekli denetler ama bazen literal bilgiyi genişletir. `satisfies` uygunluğu kontrol ederken çıkarılan tipi korur; `as const` ise literal değerleri ve readonly alanları muhafaza eder.

`keyof` ve `typeof` ile tek kaynaktan tip üretmiştin. Bu derste kaynağın kendisini güvenli kuruyorsun. Sinema'nın tür-renk tablosu örnek olsa da aynı karar rota adlarında, izin listelerinde ve UI varyantlarında da gerekir. Dış JSON içinse hâlâ çalışma zamanı doğrulaması gerekir.

## Şekli denetle, çıkarımı koru

`as const` değerleri literal ve readonly tutar. `satisfies` verilen biçimi kontrol eder ama değişkenin çıkarılan tipini gereksiz yere genişletmez.

```ts check
const GENRES = [18, 53] as const
type GenreId = (typeof GENRES)[number]
const GENRE_COLORS = {
  18: 'indigo',
  53: 'rose',
} as const satisfies Record<GenreId, string>
type Color = (typeof GENRE_COLORS)[GenreId]
const color: Color = 'rose'
```

Yeni tür eklersen `Record` eksik rengi yakalar. Route tablosunda da aynı yöntem, URL literal'lerini korurken her değerin doğru biçimde olmasını sağlar.

:::mistake
`as const` veri doğrulama yapmaz. `satisfies` de çalışma zamanında gelen JSON'u kontrol etmez; ikisi kaynak kodundaki değerlerle ilgilidir.
:::

:::sector
TS 6 ortamında `erasableSyntaxOnly` ile `enum` yerine literal union ve `as const` nesnesi seçmek kodun tip silmeyle çalışmasına uygundur.
:::
