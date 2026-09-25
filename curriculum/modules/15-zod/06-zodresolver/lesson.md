---
title: "Formdaki iki kural listesini birleştir"
minutes: 8
kind: concept
---

# Formdaki iki kural listesini birleştir

:::pain[Problem]
İzleme listesi adını hem RHF `register` kuralında hem TypeScript tipinde tutuyorsun. Birini değiştirince diğeri eski kalıyor.
:::

## Neden bu araç?

`useForm({ resolver: zodResolver(schema) })` RHF alan durumunu korurken kuralları Zod şemasından alır. `formState.errors` alanlara bağlı mesajları gösterir.

## Sinema'da bir adım ileri

Dönüşen alan varsa `useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>` kullan: input ve submit değerleri farklı olabilir. Label, `aria-invalid` ve `role="alert"` ilişkisini yine sen kurarsın.

## RHF’nin işi, Zod’un işi

RHF `register`, touched/dirty state ve submit akışını yönetir. Zod geçerli değerin ne olduğunu söyler. `zodResolver` ikisini bağlar; böylece aynı `min(1)` kuralını hem `register` hem şemada tutmazsın.

```tsx check
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
const schema = z.object({ name: z.string().trim().min(1, { error: 'Ad gerekli' }) })
export function NameForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({ resolver: zodResolver(schema) })
  return <form onSubmit={handleSubmit((value) => console.log(value.name))}>
    <label>Liste adı<input {...register('name')} aria-invalid={Boolean(errors.name)} /></label>
    {errors.name && <p role="alert">{errors.name.message}</p>}
    <button>Kaydet</button>
  </form>
}
```

Puan input'u gibi stringden sayıya dönen alanda üç generic önem kazanır. `z.input` formun ham alanlarını, `z.output` geçerli submit verisini tipleştirir. Hata mesajı için görsel bileşen ve erişilebilir ilişki kurma görevi yine sende kalır.

:::mistake[Sık hata]
Şemadaki kuralı `register` seçeneklerinde tekrar edersen iki kaynak yeniden ayrışır.
:::

:::sector
RHF alan durumunda güçlüdür; Zod aynı kuralları form dışındaki API ve test kodunda da kullanmanı sağlar.
:::
