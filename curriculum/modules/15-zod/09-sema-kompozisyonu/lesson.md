---
title: "Omit merdiveninin şema basamağı"
minutes: 8
kind: review
---

# Omit merdiveninin şema basamağı

:::pain[Problem]
Kaydedilmiş izleme listesinde `id` var, yeni liste formunda henüz `id` yok; aynı alanları elle tekrar yazmak kuralları ayırıyor.
:::

## Neden bu araç?

`.extend` alan ekler, `.pick` seçer, `.omit` çıkarır. `Omit<T, "id">` yalnızca tip düzeyindedir; `schema.omit({ id: true })` çalışma zamanı doğrulamasını da değiştirir.

## Sinema'da bir adım ileri

Kaydetme sonrası sunucunun eklediği `id` için tam şemayı, form girdisi için türetilmiş şemayı kullan. Gereksiz şema kopyaları yerine küçük ve açık dönüşümleri tercih et.

## Aynı kuralı türet

```ts check
import { z } from 'zod'
const saved = z.object({ id: z.string(), name: z.string().min(1), isPublic: z.boolean() })
const input = saved.omit({ id: true })
const title = saved.pick({ name: true })
const shared = saved.extend({ shareUrl: z.url() })
input.parse({ name: 'Klasikler', isPublic: false })
void title; void shared
```

2. modülde `Omit<SavedWatchlist, 'id'>` ile form tipi türettin. O tip çalışma zamanında kaybolur. `.omit({ id: true })` ise form girdisini gerçekten parse eden yeni bir şema verir; orijinal `saved` şeması saklanan nesne için kalır.

`.pick` sadece kart başlığını seçen bir görünümde, `.extend` paylaşım URL'si eklenen bağlamda kullanılır. Her yöntem farklı bir ihtiyacı karşılar. Şema dönüşümlerinden sonra `z.infer` ile tipleri yeniden çıkar; ayrı interface çoğaltma.

:::mistake[Sık hata]
TypeScript `Omit` tek başına gelen form verisini doğrulamaz.
:::

:::sector
Türetilmiş şemalar kayıt ve form sözleşmelerini aynı alan kurallarında buluşturur.
:::
