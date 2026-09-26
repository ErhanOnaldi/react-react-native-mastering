---
title: "Şemadan tip çıkar"
minutes: 8
kind: concept
---

# Şemadan tip çıkar

:::pain[Problem]
Watchlist formunda `name` şemada zorunlu oldu ama elle yazılan `WatchlistValues` tipinde opsiyonel kaldı.
:::

## Kuraldan tip üret

Aynı alanları hem Zod şemasında hem TypeScript interface'inde elle yazarsan iki kaynak farklılaşabilir. `z.infer<typeof schema>` doğrulanmış sonucun tipini şemadan çıkarır. Böylece uygulama kodu, çalışan doğrulama kuralının tip düzeyindeki karşılığını kullanır. Dönüşüm yapan şemalarda ham girdi tipi ve doğrulanmış çıktı tipi farklı olabilir.

Utility type dersindeki tek kaynak düşüncesi burada çalışma zamanı sınırına taşınır. Sinema izleme listesinde isim kuralı değiştiğinde form ve kaydetme kodu aynı şemaya bakmalıdır. Sonraki dönüşüm dersinde `z.input` ve `z.output` farkı daha görünür olacak.

## Neden bu araç?

`z.infer<typeof schema>` parse edilmiş çıktının tipidir. Şema tek kaynak olunca form kuralı ve TypeScript tipi beraber değişir.

## Sinema'da bir adım ileri

Dönüşüm olmayan şemada `z.input` ile `z.output` aynıdır. Dönüşüm eklendiğinde ayrılacaklarını 5. derste göreceksin.

## Tek kaynak örneği

```ts check
import { z } from 'zod'
const watchlistSchema = z.object({ name: z.string().min(1), isPublic: z.boolean() })
type WatchlistValues = z.infer<typeof watchlistSchema>
const values: WatchlistValues = watchlistSchema.parse({ name: 'Klasikler', isPublic: false })
console.log(values.name)
```

Şimdi `isPublic` alanını şemada değiştirirsen TypeScript kullanıldığı yerleri de işaretler. Elle yazılmış ikinci interface güncellenmeyi beklemez. `.parse` çalışırken gereksiz alanları varsayılan olarak sonuçtan çıkarabilir; gönderdiğin ham nesnenin aynısını döndüreceğini varsayma.

`z.infer` doğrulanmış çıktı tipinin kısa yoludur. Dönüşümden sonra input ile output farklıysa `z.input<typeof schema>` ve `z.output<typeof schema>` açıkça kullanılır. Bu ayrım sayı girilen formda işimize yarayacak.

:::mistake[Sık hata]
`z.infer` boş stringi tip düzeyinde elemez; bu kural parse sırasında çalışır.
:::

:::sector
Şemadan çıkarılan tipi form, API ve kaydetme katmanında paylaşmak sürüklenmeyi azaltır.
:::
