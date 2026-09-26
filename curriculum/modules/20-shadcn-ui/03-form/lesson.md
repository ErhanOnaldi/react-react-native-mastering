---
title: "Formda stil, veri ve hata bir arada"
minutes: 10
kind: concept
---

# Formda stil, veri ve hata bir arada

:::pain[Problem]
Sinema'nın yorum formunu 14. modülde erişilebilir yaptın: her alan için elle `id="review-body"`, `aria-invalid`, `aria-describedby="review-body-error"` yazdın. Şimdi aynı formu film kartında da göstermek istiyorsun: sayfada iki form olunca iki tane `review-body` id'si oluşuyor ve etiketler yanlış alana bağlanıyor. Üstelik puan seçilmeden gönderince ekranda "Invalid input: expected number, received undefined" yazıyor.
:::

## Bildiğin parçalar, yeni bir katman
14. modülden `useForm` ve `Controller`, 15. modülden `zodResolver` biliyorsun; 19. modülden Context, `useId` ve Slot. shadcn'in `form.tsx` dosyası bunları birleştiren **ince bir katman**: şema kuralı koyar, RHF değeri ve hatayı taşır, form parçaları da id'leri ve ARIA bağlarını **otomatik** kurar.

| Parça | Ne yapar? |
| --- | --- |
| `Form` | RHF'in `FormProvider`'ı; `useForm` sonucunu Context'e koyar. |
| `FormField` | `Controller`'ı sarar ve alan adını (`name`) Context'e koyar. |
| `FormItem` | `useId()` ile bir kimlik üretip Context'e koyar. |
| `useFormField()` | İki Context'i ve RHF alan durumunu okur: `{ error, formItemId, formMessageId, … }`. |
| `FormLabel` | `<label htmlFor={formItemId}>` |
| `FormControl` | **Slot**: `id`, `aria-invalid`, `aria-describedby`'yi tek çocuğuna geçirir. |
| `FormMessage` | Hata varsa `<p id={formMessageId}>{error.message}</p>` |

```tsx title="src/features/watchlists/ReviewForm.tsx"
const form = useForm<ReviewValues>({
  resolver: zodResolver(reviewSchema),
  defaultValues: { body: '' },
})

return (
  <Form {...form}>
    <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name="body"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Yorum</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </form>
  </Form>
)
```

Bu parça tek başına çalışan bir dosya değil; `Form…` parçaları CLI'ın kopyaladığı `form.tsx`'ten, `Textarea` da `textarea.tsx`'ten gelir. Önemli olan şu: **hiçbir id'yi elle yazmadın**. `useId` her `FormItem` için ayrı bir kimlik üretir; aynı form sayfada iki kez render edilse de çakışma olmaz.

:::info[Test ortamı]
jsdom `ResizeObserver` sağlamaz. Radix tabanlı Dialog ve menüleri test ederken `src/test/setup.ts` dosyana küçük tarayıcı API polyfill'lerini ekle:

```ts
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver
Element.prototype.hasPointerCapture ??= () => false
Element.prototype.releasePointerCapture ??= () => {}
Element.prototype.scrollIntoView ??= () => {}
```
:::

## `FormControl` neden Slot?
`FormControl` kendi DOM öğesini üretmez; ARIA bağlarını **tek çocuğuna** yapıştırır (19. modüldeki `asChild` fikri). Bu yüzden çocuğun gerçek form kontrolü olması gerekir. Araya bir `<div>` koyarsan `id` ve `aria-invalid` o div'e gider; etiket ve hata, textarea ile bağını kaybeder.

## Mesajlar şemadan gelir
`FormMessage` ekranda `error.message`'ı gösterir; o metin de Zod şemasından gelir. Zod 4'te mesajlar `error` parametresiyle verilir (eski `required_error`/`invalid_type_error`/`message` değil):

```ts check
import { z } from 'zod'

export const reviewSchema = z.object({
  body: z.string().trim().min(1, { error: 'Yorum gerekli' }),
  rating: z.number({ error: 'Puan seç' }).int().min(1).max(5),
})
```

`z.number({ error: 'Puan seç' })` şema düzeyindeki mesajdır: değer hiç yoksa (`undefined`) ya da sayı değilse (`NaN`) bu metin görünür. `min(1, { error: … })` ise yalnızca o kontrol düştüğünde kullanılır. Mesaj vermediğin her kural, kullanıcıya İngilizce ve teknik bir cümle gösterir.

:::mistake[Sık hata]
Şemada `transform` ya da `z.coerce` kullanırsan girdi ve çıktı tipleri ayrışır. O zaman `useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>` ile iki tipi de bilinçli ver; `z.infer` yalnızca çıktı tipidir.
:::

:::sector[Sektörde]
shadcn'in yeni `Field`, `FieldLabel`, `FieldError` parçaları aynı fikrin daha esnek bir yerleşim katmanıdır; altında yine RHF + `zodResolver` durur. Hangi parçayı kullanırsan kullan, kaynak dosyayı açıp `aria-invalid` ve `aria-describedby`'nin gerçekten doğru öğeye gittiğini test et: kod senin.
:::
