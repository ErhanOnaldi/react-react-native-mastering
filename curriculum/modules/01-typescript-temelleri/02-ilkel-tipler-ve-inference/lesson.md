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
const title = 'Dövüş Kulübü' // dar literal çıkarılır
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

## Çıkarımı adım adım oku
`const title = 'Başlangıç'` ifadesinde değer sonradan değişmez; TypeScript dar bir literal tutabilir. `let title = 'Başlangıç'` ise başka film adı alabilecek bir değişkendir ve genel `string` olarak anlaşılır. Bu farkı ezberlemeden, değişkenin yeniden atanıp atanmayacağını sor.

TMDB `vote_average: 8.437` gönderdiğinde `toFixed(1)` çağırabilirsin. Fakat form input'undan gelen `"8.437"` bir string'dir. Ekranda aynı görünseler de `"8" + 1` ile `8 + 1` farklı sonuç üretir. Veri sınırında dönüştürme gerekiyorsa bunu açıkça yap; tipi sırf hata sussun diye sayı olarak ilan etme.

## Küçük deneme
Boş bir diziye sonradan başlık eklemek istediğinde öğe tipini başlangıçta yaz: `const titles: string[] = []`. Fonksiyon parametresinde de çağıranın ne vermesi gerektiğini belirt. Buna karşılık `const score = 8.4` için `: number` eklemek çoğu zaman tekrar olur. Tip notasyonu niyeti açıklıyorsa kullan, yalnızca zaten görünen değeri tekrarlıyorsa çıkarıma bırak.

:::sector
Kod incelemesinde tiplerin çokluğu değil, yanlış verinin nerede yakalandığı önemlidir. Açık sınırlar ve sade yerel değişkenler birlikte okunur.
:::
