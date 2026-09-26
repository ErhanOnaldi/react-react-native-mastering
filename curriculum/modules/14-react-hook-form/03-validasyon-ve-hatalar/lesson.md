---
title: "Kurallar ve alan hataları"
minutes: 7
kind: concept
---

# Kurallar ve alan hataları

:::pain[Problem]
Boş isimli izleme listesi kaydedildi. Önceki formda tek bir `if` bunu engelliyordu; şimdi kuralı input'a yakın yazıp hatayı doğru alanda göstermen gerekiyor.
:::

## Geçerli veri ile anlaşılır hata

Validation, kullanıcı girdisinin belirlediğin kuralları sağlayıp sağlamadığını kontrol eder. Formda kural kadar hatanın hangi alana ait olduğu ve kullanıcıya nasıl anlatıldığı da önemlidir. RHF, alan kurallarını çalıştırıp sonuçları `formState.errors` içinde tutar; `handleSubmit` geçersiz veriyle başarı callback'ini çağırmaz.

Önceki derste alanları forma kaydettin. Şimdi Sinema liste adının boş veya kısa olmasını alan düzeyinde açıklıyorsun. Bu kurallar daha sonra Zod şemasına taşınacak; önce hata akışını form içinde anlaman, resolver'ın neyi değiştirdiğini görmeni sağlar.

## Kurallar alanın yanında

`register('name', { required: 'Ad gerekli', minLength: { value: 3, message: 'En az 3 karakter' } })` yerleşik RHF 7 doğrulamasıdır. `handleSubmit` geçerli veriyi callback'e geçirir; geçersiz durumda onu çağırmaz. Hatalar `formState.errors` altında alan adına göre bulunur. `mode: 'onSubmit'` varsayılandır: ilk hata submit'te görünür.

```tsx
const { register, formState: { errors } } = useForm<{ name: string }>()
// <input {...register('name', { required: 'Ad gerekli' })} />
// {errors.name && <p role="alert">{errors.name.message}</p>}
```

Bu bir hook içi kesittir. `role="alert"` mesajı duyurur; label ve hata ilişkisini dokuzuncu derste tamamlayacağız.

## İkinci adım

Açıklama opsiyonel olsa da girildiyse en çok 120 karakter olmalı. İsimde `required`, açıklamada `maxLength` kullan. `validate` fonksiyonu bir alana özgü özel kontrol gerektiğinde işe yarar. Formlar büyüyünce kurallar ile TypeScript tipinin ayrı kaynaklar olması sorununa Modül 15'te Zod çözümü gelecek.

:::mistake
`errors.name` yalnızca hata nesnesidir; mesajı `errors.name?.message` ile göster. Hata yokken boş bir alert üretme.
:::

:::sector
Hata mesajını kullanıcıya ne yapacağını anlatacak kadar somut yaz: “Geçersiz” yerine “Ad en az 3 karakter olmalı”.
:::
