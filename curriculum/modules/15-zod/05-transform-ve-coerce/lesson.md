---
title: "URL stringini güvenli sayıya çevir"
minutes: 8
kind: concept
---

# URL stringini güvenli sayıya çevir

:::pain[Problem]
`?page=abc` ya da `?page=0` arama sayfasına geliyor. `Number(...)` tek başına `NaN` ve geçersiz aralıkları yönetmiyor.
:::

## Ham girdi ile kullanılan değer

URL ve HTML form alanları çoğu zaman metin üretir; uygulama ise sayı veya başka bir biçim bekler. **Coercion** gelen değeri hedef tipe dönüştürmeyi dener, **transform** doğrulanmış değerden yeni bir çıktı üretir. Dönüştürme tek başına geçerlilik anlamına gelmez: `NaN`, sıfır veya aralık dışı sayı ayrıca reddedilmelidir.

Router'da `page` değerini string olarak okudun. Sinema'nın sayfalama şeması bu dış girdiyi güvenli sayıya taşır. Tip düzeyinde de ham `z.input` ile kullanılan `z.output` ayrılabilir; sonraki form resolver dersinde bu ayrım önem kazanacak.

## Neden bu araç?

URLSearchParams her zaman string ya da null döndürür. `z.coerce.number().int().min(1)` dönüşüm ve sınırı birleştirir; eksik parametreyi `undefined` olarak geçirirsen `.default(1)` kullanılabilir.

## Sinema'da bir adım ileri

`z.coerce.boolean()` için `Boolean("false")` true olur. Metin tabanlı flag için `z.stringbool()` seç. `z.input<typeof schema>` ham girdi, `z.output<typeof schema>` doğrulanmış çıktıdır.

## Ham girdi ve sonuç farklıdır

```ts check
import { z } from 'zod'
const pageSchema = z.coerce.number().int().min(1)
type PageInput = z.input<typeof pageSchema>
type PageOutput = z.output<typeof pageSchema>
const input: PageInput = '2'
const page: PageOutput = pageSchema.parse(input)
console.log(page + 1) // 3
```

`Number('')` sıfır döndürür; `.min(1)` bu değeri eler. `Number('abc')` ise `NaN` olur ve doğrulamadan kalır. Eksik `page` için URL'yi okurken `'1'` ver ya da kontrollü varsayılan uygula. Kullanıcı URL'si değiştirilebilir olduğundan başarısız parse durumunda güvenli ilk sayfaya dönmek arama ekranında iyi bir tercihtir.

`Boolean('false')` true olduğu için `z.coerce.boolean()` URL flag'i için yanlış anlam üretir. `z.stringbool()` ise `true/false`, `1/0`, `yes/no` gibi metinleri gerçek boolean olarak ayrıştırır.

:::mistake[Sık hata]
`z.coerce.boolean()` dolu `"false"` stringini true yapar; URL flag’i için `z.stringbool()` seç.
:::

:::sector
Paylaşılabilir URL’ler kullanıcı tarafından değiştirilebilir; geçersiz sayfayı güvenli varsayılana çevir.
:::
