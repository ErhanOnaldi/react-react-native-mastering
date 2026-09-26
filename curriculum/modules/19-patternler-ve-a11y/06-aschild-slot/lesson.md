---
title: "Bir düğme içinde başka düğme"
minutes: 8
kind: concept
---

# Bir düğme içinde başka düğme

:::pain[Problem]
`Modal.Trigger` içine film kartının mevcut `<button>`unu koydun. DOM'da `<button><button>Fragmanı aç</button></button>` oluştu; click ve focus davranışı karıştı.
:::

## Tek semantik öğe üret

Bir davranış bileşenini başka bir butonun çevresine koyarsan iç içe etkileşimli HTML oluşabilir. `asChild` veya Slot yaklaşımı, sarmalayıcı DOM düğümü üretmek yerine davranışı tek child öğeye aktarır. Event handler, class ve ref aktarımı dikkat ister; bir tarafın değerini sessizce ezmek davranışı bozabilir.

Sinema fragman düğmesi bu sorunu somutlaştırıyor. Önceki composition dersinde içerik yerleştirmeyi, a11y dersinde semantik öğe seçimini gördün. Slot ikisini birleştirir: ortaya tek doğru button veya link çıkmalı ve kullanıcının kendi handler'ı çalışmaya devam etmelidir.

## Tek DOM öğesi
`asChild` seçeneğinde Trigger kendi `<button>`unu render etmez; tek child'ı `cloneElement` ile zenginleştirir. Çocuğun `onClick` handler'ı da çalışmalı, Trigger'ın açma handler'ı da. `aria-*`, `className` ve ref birleşimi kaybolmamalı.

```tsx title="MovieCard.tsx"
<Modal.Trigger asChild>
  <button type="button" className="movie-action">Fragmanı aç</button>
</Modal.Trigger>
```

React 19'da fonksiyon bileşenleri `ref` prop'unu doğrudan alabilir; yeni bileşenlerde `forwardRef` zorunlu değil. Slot, child ref'i ile kendi ref'ini birleştirirken callback ref ve object ref'i ele alır. Tip güvenliği için tek bir React element kabul et; string veya iki sibling geçilirse açık hata ver.

## Yeni bağlam: link
Asıl aksiyon gezinmeyse `<a>` kullan; `asChild` ile stil ve ortak davranışları aktarabilirsin. Dialog açma eylemini link içine saklama: semantik etiket davranışı anlatmalı.

:::mistake
`{...child.props}` sırasını rastgele seçmek, kullanıcıdan gelen `onClick` veya `className` değerini silebilir. Handler'ları açıkça birleştir ve `defaultPrevented` politikasını belirle.
:::

:::sector
Bir sonraki modülde hazır Slot primitive'lerinin bu ayrıntıları nasıl yönettiğini göreceksin.
:::
