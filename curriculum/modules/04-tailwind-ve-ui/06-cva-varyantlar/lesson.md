---
title: Button varyantları
minutes: 9
kind: concept
---

# Button varyantları

:::pain[Problem]
`cn()` çakışmayı çözdü ama primary, secondary ve ghost düğmelerin renkleri üç dosyada; küçük ve büyük boyut için iç içe ternary çoğalıyor.
:::

## Karar tablosu

`cva` ortak class ve sınırlı varyantları bir yerde tutar. `VariantProps` tablodan TypeScript props tipi çıkarır.

```ts check
import { cva, type VariantProps } from 'class-variance-authority'
const buttonVariants = cva('inline-flex items-center rounded-lg font-semibold', {
  variants: {
    variant: { primary: 'bg-sky-700 text-white', secondary: 'border text-sky-700', ghost: 'text-sky-700' },
    size: { sm: 'px-2 py-1 text-sm', md: 'px-4 py-2', lg: 'px-6 py-3 text-lg' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
  compoundVariants: [{ variant: 'ghost', size: 'sm', class: 'underline-offset-2' }],
})
type ButtonVariants = VariantProps<typeof buttonVariants>
const props: ButtonVariants = { variant: 'ghost', size: 'sm' }
buttonVariants(props)
```

`compoundVariants`, iki seçimin **birlikte** olduğu özel duruma class ekler. Her ikili için satır yazmak zorunda değilsin. Button `ComponentProps<'button'>` ile doğal HTML props'larını alır; `className` en sonda `cn(buttonVariants(...), className)` ile birleşir.

`variant="ghost"` yalnız görünüm değiştirir. Gerçek `disabled`, klavye odağı ve erişilebilir ad yine Button'ın sözleşmesidir. `buttonVariants` fonksiyonunu da export et: başka yerde aynı görünüm için class üretilebilir.

:::mistake[Sık hata]
`opacity-50` disabled görünümü verir ama tek başına tıklamayı kapatmaz. `disabled` niteliğini düğmeye ilet.
:::
