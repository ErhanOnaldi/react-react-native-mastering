---
title: "Kirli, gönderiliyor, sıfırla"
minutes: 7
kind: concept
---

# Kirli, gönderiliyor, sıfırla

:::pain[Problem]
İzleme listesini kaydettin ama eski ad input'ta kaldı. İkinci kez kaydetmeye basınca da aynı veri yeniden gönderiliyor.
:::

## Durumları kullan

`defaultValues`, formun ilk ve sıfırlanacak değerlerini tanımlar. `formState.isDirty`, mevcut değerler ile bu varsayılanları karşılaştırır. `formState.isSubmitting`, async `handleSubmit` callback'i sürerken true olur. Başarılı kayıttan sonra `reset()` varsayılanlara döner; istersen `reset(newValues)` ile yeni başlangıç da verebilirsin.

```tsx
const { handleSubmit, reset, formState: { isDirty, isSubmitting } } = useForm<Values>({ defaultValues })
// <button disabled={!isDirty || isSubmitting}>Kaydet</button>
// await save(values); reset()
```

Bu kesitte `Values`, `defaultValues` ve `save` uygulamanın tanımlarıdır. `isDirty` değerini görmek için `formState`'ten render sırasında okuyarak abone olursun.

:::mistake
`reset()`'i isteği başlatır başlatmaz çağırma. İstek başarısız olursa kullanıcının yazdıkları silinir.
:::

:::sector
Düzenleme formunda `Partial<Values>` yama verisi için uygundur; yeni liste oluşturma formunda zorunlu alanları `Partial` yapma. Sunucu kimliğini form tipinden `Omit` ile çıkar.
:::
