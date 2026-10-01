---
title: "Kart parçalarını birleştir"
minutes: 6
kind: practice
---

# Kart parçalarını birleştir

Bu kısa tekrar, aynı film arayüzünde iki şeyi buluşturuyor: içerik alan kart parçaları ve doğal HTML davranışını koruyan küçük bileşenler. `Badge` ile `Card` içeriğini çağıran yerden alır; `Skeleton` yükleme sırasında yer tutar, `Input` ise arama değerini çağırandan alır.

:::model[Composition]
`children`, değişebilen içeriği sabit bir çerçevenin içine çağıran yerden taşır. Burada puanı `Card` içine koyarsın; kartın kendisi filmin içeriğini seçmez.
:::

:::model[Props aşağı, olaylar yukarı]
`ComponentProps` doğal HTML öğesinin props tipini bileşene taşımayı sağlar. Böylece `data-*`, `aria-*` ve event props'larını tek tek yeniden tanımlamazsın. `Input` controlled kalır: değeri prop olarak alır, yazma olayını yukarıya iletir.
:::

Çalışırken önce kart, sonra yükleme alanı ve arama alanı üzerinde ayrı ayrı ilerle. Her parçanın hangi HTML öğesi olduğunu ve hangi props'ları doğal olarak taşıması gerektiğini düşün. Skeleton yalnızca görsel bir yer tutucuysa erişilebilirlik ağacından gizlenir; yükleniyor bilgisini çevresindeki arayüz verir. Input'un erişilebilir adını da kullanım yeri belirler.

`cn` temel class'larla dışarıdan gelen `className` değerini birleştirip bilinen Tailwind çakışmalarını çözer. Dış class son girdiyse aynı utility kararını değiştirebilir; düz string birleştirme bunu garanti etmez. Class listesinde iki çakışan padding utility'sinin kalıp kalmadığına bak, ardından Input'a yazıp callback'in değişikliği üst bileşene ilettiğini doğrula.

## Özet

- `children` değişken içeriği kart çerçevesine yerleştirir.
- Doğal HTML props'ları bileşenin `data-*`, `aria-*` ve event davranışını korur.
- `cn` bilinen class çakışmalarını çözer; dış class override edebilir.
- Skeleton görsel yer tutucudur; Input'un değeri kullanım yerinde tutulur.

**Terimler:**

- **Native props:** Bir HTML öğesinin kendi props'ları; örneğin button için `disabled` ve `onClick`.
- **Controlled Input:** Değeri üst bileşenden gelen ve değişikliği callback ile bildiren input.
- **Override:** Dışarıdan gelen bir değerin temel görünüm kararını değiştirmesi.

**Kendini yokla:** Skeleton yükleme mesajını da vermeli mi? Hayır; dekoratif yer tutucuyu gizle, durumu çevreleyen arayüz anlatsın.
