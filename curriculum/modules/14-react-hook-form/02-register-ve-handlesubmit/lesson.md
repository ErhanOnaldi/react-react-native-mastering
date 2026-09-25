---
title: "Alanları kaydet: register ve handleSubmit"
minutes: 7
kind: concept
---

# Alanları kaydet: register ve handleSubmit

:::pain[Problem]
İlk formda sekiz `value`, sekiz `onChange` ve kaydet tuşunda elle toplanan sekiz değer var. Yeni bir alan eklerken üç yeri değiştirmeyi unutmak kolay.
:::

## Form verisini tek yerde tanımla

React Hook Form 7'nin `useForm<FormValues>()` hook'u `register` ve `handleSubmit` verir. `register('name')` native input'a ref ve event bağları sağlar. Değerleri her tuşta üst bileşenin state'ine kopyalaman gerekmez. Bu, formun **hiç render etmeyeceği** anlamına gelmez: abone olduğun `formState` veya izlediğin değerler render tetikleyebilir.

```tsx
import { useForm } from 'react-hook-form'

type Watchlist = { id: string; createdAt: string; name: string; description: string }
type Values = Omit<Watchlist, 'id' | 'createdAt'>
const { register, handleSubmit } = useForm<Values>()
// <form onSubmit={handleSubmit((values) => save(values))}>
//   <input {...register('name')} />
// </form>
```

Bu kesitte `save` uygulamanın fonksiyonudur. `handleSubmit` native submit event'ini yönetir ve geçerli değerleri callback'e verir. `Omit` ile sunucunun ürettiği `id` ve zaman formdan çıkar; aynı tipi ikinci kez elle yazmayız.

## İlk tekrar

İlk kodda yalnızca ad ve açıklamayı kaydet. İkincisinde görünürlük seçimi ekle: checkbox değeri `boolean` olur ve `defaultValues` ile başlangıç durumunu açıkça belirlersin. Her yeni bağlam `register` kullanımına gerçek bir fark ekler.

:::mistake
`onSubmit={save()}` yazma; render sırasında çağırır. `handleSubmit(save)` bir event handler döndürür.
:::

:::sector
Form girdileri kullanıcı verisidir. TypeScript tipi veri şeklini anlatır, çalışma zamanında geçerliliğini kanıtlamaz. Bir sonraki derste yerleşik kuralları ekleyeceğiz.
:::
