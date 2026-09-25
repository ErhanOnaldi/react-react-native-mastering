---
title: "Alanlar arası kurallar"
minutes: 8
kind: concept
---

# Alanlar arası kurallar

:::pain[Problem]
Yorum metni dolu, puan da geçerli; fakat spoiler işaretli yorumun açıklaması yok. Tek alan kuralları bu ilişkiyi göremiyor.
:::

## Neden bu araç?

`.refine(predicate, { error, path })` bütün nesneye bakar ve hatayı ilgili alanın yoluna yerleştirir.

## Sinema'da bir adım ileri

Sadece tek alana ait min/max kuralını `.refine` ile yeniden yazma. Çoklu hata veya karmaşık koşul gerektiğinde `.superRefine` kullanılabilir.

## İlişkiyi ifade et

```ts check
import { z } from 'zod'
const reviewSchema = z.object({ body: z.string(), spoiler: z.boolean() })
  .refine((value) => !value.spoiler || value.body.trim().length >= 10, {
    path: ['body'], error: 'Spoiler açıklaması çok kısa',
  })
const result = reviewSchema.safeParse({ body: 'kısa', spoiler: true })
if (!result.success) console.log(result.error.issues[0].path)
```

Burada kural `body` değerinin tek başına özelliği değildir; `spoiler` seçimine bağlıdır. `path: ['body']` hatayı ilgili input altında göstermeyi sağlar. Sadece minimum uzunluk gerekiyorsa `.min()` daha okunur kalır.

Birkaç alan için birden çok özel issue üretilmesi gerekiyorsa `.superRefine` seçilebilir. Bu derste tek ilişki olduğu için `.refine` yeterli.

:::mistake[Sık hata]
Alanlar arası bir kuralı yalnızca `body.min(...)` ile yazarsan spoiler kapalıyken de hata üretirsin.
:::

:::sector
Hatanın `path` değeri form kütüphanesinin ilgili input altında mesaj gösterebilmesi için önemlidir.
:::
