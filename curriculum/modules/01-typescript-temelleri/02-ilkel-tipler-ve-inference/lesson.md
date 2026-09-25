---
title: İlkel tipler ve inference
minutes: 8
kind: concept
---

# İlkel tipler ve inference

:::pain[Problem]
TMDB `vote_average` sayısını metin sandığında `toFixed` çalışmıyor; `title` sayıya çevrilince kartta anlamsız bir sonuç çıkıyor.
:::

## Üç temel tip
`string` metin, `number` sayı, `boolean` doğru/yanlış değeridir. JS değerleri zaten taşır; TypeScript bunları kodda izler.

```ts check
const title = 'Dövüş Kulübü' // string çıkarılır
let vote = 8.437 // number çıkarılır
const adult = false // false literal'i korunur
vote = 8.5
void title; void adult
```

## Ne zaman açık tip?
Sağdaki değerden tip belliyse tekrar yazma. Fonksiyon sınırında veya başlangıçta boş bir koleksiyonda niyetini açıkla: `const titles: string[] = []`. `const` ile değişmeyen ilkel değerde dar literal tip çıkarılır; `let` yeniden atanabileceğinden genelde geniş tipe açılır.

:::mistake[Yalancı güven]
`let score = 0` yazınca `score` number olur; sonra `score = '8.4'` atamak tip hatasıdır. Dönüşüm gerekiyorsa açıkça yap.
:::

## Sektörde
Fazla tip notasyonu okumayı zorlaştırır. Tip çıkarımını kullan, dışarıya sunduğun fonksiyon sözleşmesini açık bırak.
