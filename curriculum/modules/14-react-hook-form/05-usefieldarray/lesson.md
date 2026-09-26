---
title: "Etiketler için dinamik alanlar"
minutes: 7
kind: concept
---

# Etiketler için dinamik alanlar

:::pain[Problem]
İzleme listesine ilk etiket kolaydı. “Bir etiket daha” tuşuyla alan sayısı değişince ayrı state ve indeksle silme kodu kırılganlaştı.
:::

## Sayısı değişen form alanları

Bazı formlarda alan sayısı baştan sabit değildir: kullanıcı etiket ekler, satır siler veya sıralar. `useFieldArray` bu diziyi form durumuyla birlikte yönetir; `append` ve `remove` gibi işlemlerle alanların kimliği korunur. React'teki liste `key` kuralı burada özellikle önemlidir, çünkü her satırın kendi input durumu vardır.

Sinema izleme listesinde etiket sayısı kullanıcıya bağlıdır. Önceki `key` dersinde konum ile kimlik farkını gördün; `field.id` bu formdaki kararlı kimliği sağlar. Dizi indeksi alan yolunda kullanılsa da render kimliği olarak kullanılmamalıdır.

## Alan dizisini yönet

`useFieldArray({ control, name: 'tags' })`, `fields`, `append`, `remove` verir. RHF 7'de her `field.id` sabit React key'idir; dizinin indeksi key olmaz. Dizi öğesi bir nesne olmalı: `{ value: string }`. `append({ value: '' })` tüm alanlarıyla yeni öğe ekler. `register(`tags.${index}.value`)` yolu ilgili input'u bağlar.

```tsx
const { fields, append, remove } = useFieldArray({ control, name: 'tags' })
// fields.map((field, index) => <input key={field.id} {...register(`tags.${index}.value`)} />)
```

Bu kesit bir form bileşeninden alınmıştır. Silme tuşunun `type="button"` olması gerekir; yoksa formu yanlışlıkla gönderir. Silinen indeks sonrasında RHF kayıt yollarını yönetir.

:::mistake
`key={index}` silme sonrası önceki input durumunu yanlış satıra taşıyabilir. `field.id` kullan. RHF 8 beta'daki `key` alanı bu modülün API'si değildir.
:::

:::sector
Etiket ve film satırları aynı teknikle yönetilir ama verileri farklıdır. Diziyi gerekmedikçe düz string dizisi gibi modelleme; `useFieldArray` nesne satırlarıyla çalışır.
:::
