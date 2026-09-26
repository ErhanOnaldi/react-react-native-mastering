---
title: "Özel yıldız seçimini bağla"
minutes: 7
kind: concept
---

# Özel yıldız seçimini bağla

:::pain[Problem]
Sinema'nın yıldız bileşeni native input değil; `value` ve `onChange` prop'larıyla çalışıyor. `register` için bir DOM input ref'i yok.
:::

## Native olmayan alanı bağla

`register`, ref ve native input event'leriyle çalışan HTML alanlarında uygundur. Bazı UI bileşenleri ise kendi `value` ve `onChange` API'sini sunar. `Controller`, RHF'nin alan durumunu bu özel API'ye bağlayan köprüdür. Değerin de değişim olayının da aynı form kaynağına bağlı kalması gerekir.

Sinema'nın yıldız seçimi normal metin kutusu olmadığı için `register` yeterli değildir. Controlled input bilgisi burada yeniden kullanılır: özel bileşenin gördüğü değer ile RHF'nin sakladığı değer eşleşir. Native alanlarda yine daha basit `register` yolunu seçersin.

## Controller köprü olur

RHF 7 `Controller`, `control`, `name`, `render` alır. `render` içindeki `field.value` ve `field.onChange` özel bileşene aktarılır; bileşen blur olayı sağlıyorsa `field.onBlur` da aktarılır. `defaultValues` puanı örneğin `0` yapar; `undefined` ile controlled/uncontrolled geçişi üretme.

```tsx
<Controller control={control} name="rating" rules={{ min: { value: 1, message: 'Puan seç' } }}
  render={({ field }) => <RatingStars value={field.value} onChange={field.onChange} />} />
```

Bu kesitte `control` ve `RatingStars` bileşenin içindedir. Native metin alanı yine `register` ile bağlanır. `Controller`'ı her input için kullanmak gereksiz bir katmandır.

:::mistake
Sadece `field.value` aktarıp `field.onChange`'i unutursan yıldızlar görünür ama form verisi değişmez. Değeri ayrı `useState`'te tutarsan iki gerçek kaynak oluşur.
:::

:::sector
Özel tasarım bileşenlerinin API'sini `value`/`onChange` biçiminde tutmak, form kütüphaneleriyle uyumu kolaylaştırır.
:::
