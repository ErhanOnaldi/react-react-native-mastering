---
title: "İlk çalışma zamanı şeması"
minutes: 8
kind: concept
---

# İlk çalışma zamanı şeması

:::pain[Problem]
Film kartında `poster_path` bazen null; onu string sayan şema gerçek katalog kaydını reddediyor.
:::

## Neden bu araç?

`z.object` alanları, `z.string`, `z.number`, `z.array` ve `.nullable()` ile verinin gerçek biçimini tarif et. `.parse` yanlış veride hata fırlatır; `.safeParse` sonuç nesnesi döndürür.

## Sinema'da bir adım ileri

`z.email()` ve `z.url()` Zod 4’te üst düzey format doğrulayıcılarıdır. Kullanıcıya dönük kuralların mesajı için `{ error: "..." }` kullan. Önce yalnızca kullandığın alanları doğrulamak çoğu API tüketicisinde yeterlidir.

## İlk doğrulama

Aşağıdaki kod nesneyi kullanmadan önce denetler. `poster_path` değerinin null olması gerçek TMDB verisidir; `title` için aynı esneklik doğru değildir.

```ts check
import { z } from 'zod'
const movieSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1, { error: 'Başlık gerekli' }),
  poster_path: z.string().nullable(),
})
const result = movieSchema.safeParse({ id: 550, title: 'Dövüş Kulübü', poster_path: null })
if (result.success) console.log(result.data.title)
```

`.parse` başarısızlıkta `ZodError` fırlatır; `.safeParse` `{ success: false, error }` döndürür. Kartta yedek metin göstermek istiyorsan `safeParse`; API sınırında sorguyu hata durumuna taşımak istiyorsan `parse` uygundur.

`z.email()` ve `z.url()` yeni Zod 4 biçimidir. Örneğin paylaşım bağlantısı `z.url()` ile kontrol edilir. Eski `.email()`/`.url()` zincirini ya da `{ message: ... }` kullanımını yeni içerikte kopyalama.

:::mistake[Sık hata]
`optional` ile `nullable` aynı değildir: TMDB posteri çoğu zaman alan olarak gönderip değerini null yapar.
:::

:::sector
Dış API şemasını tükettiğin alanlardan başlat; her yeni ekran alanına gerçek fixture ile test ekle.
:::
