---
title: Composition
minutes: 8
kind: concept
---

# Composition

:::pain[Problem]
MovieCard’a `showPoster`, `showBadge`, `showFooter`, `footerText` gibi yeni prop’lar eklendikçe her varyant için koşul yazıyorsun. Kartın içine dışarıdan farklı eylem koymak zorlaştı.
:::

## Parçalardan bileşen kur

Composition, büyük bir component'e her varyant için yeni boolean prop eklemek yerine küçük parçaları birlikte kullanma yaklaşımıdır. `children` genel içerik için, `actions` gibi slot props ise belirli bir bölge için yer açar. Böylece çerçeve ile içine konan davranışın sorumluluğu ayrılır.

Props dersinde `children`ın türünü, state derslerinde veri akışını öğrendin. Şimdi bu ikisini component tasarımında kullanıyorsun: Sinema kartı görünümü sağlar, üst component gerekli eylemi yerleştirir. Yine de her parçayı baştan soyutlama; farklı kullanım gerçekten ortaya çıktığında uygun sınırı seç.

## İçeriği yerleştir
Layout bileşeni yalnızca çerçeveyi yönetebilir; içerik `children` ile, özel bölge ise `actions` gibi bir slot prop’u ile gelir. Böylece aynı kart hem favori düğmesi hem ileride puan eylemi gösterebilir.

```tsx check
import type { ReactNode } from 'react'
function Card({ children, actions }: { children: ReactNode; actions?: ReactNode }) {
  return <article><div>{children}</div>{actions == null ? null : <footer>{actions}</footer>}</article>
}
export default Card
```

Composition, üst bileşenin veriyi doğrudan gerekli çocuğa yerleştirmesine de izin verir. Her ara bileşenden aynı eylem props’unu geçirmek zorunda kalmazsın. Fakat paylaşılan state’i nereye koyacağını yine kullanım belirler; `children` her şeyi otomatik çözmez.

:::mistake
Sırf esnek görünsün diye her bölgeyi soyutlamak, basit kartı okunmaz yapar. Gerçek ikinci kullanım ortaya çıktığında slot ekle.
:::

:::sector
`children` ve küçük slot’lar, büyük “her durumu bilen” bileşenlerin yerine okunur birleşimler sağlar.
:::
