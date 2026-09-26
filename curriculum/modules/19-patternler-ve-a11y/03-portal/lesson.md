---
title: "Modal neden kartın altında kaldı?"
minutes: 7
kind: concept
---

# Modal neden kartın altında kaldı?

:::pain[Problem]
Film kartının içinde açtığın modal, kartın `overflow: hidden` sınırında kesiliyor. `z-index` yükseltmek de kartın stacking context'inden çıkaramıyor.
:::

## DOM yerini değiştir
`createPortal(children, document.body)` React bileşen ilişkisini korur, DOM düğümünü ise `body` altına taşır. Böylece kartın `overflow` sınırına takılmaz.

```tsx check
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'

export function BodyPortal({ children }: { children: ReactNode }) {
  return createPortal(children, document.body)
}
```

Portal içindeki React event'leri **React ağacına göre** yukarı yayılır. Arka plan click handler'ı yanlışlıkla dialog içi tıklamaya tepki veriyorsa `event.stopPropagation()` veya hedef kontrolü gerekir. Portal kendi başına `role`, focus trap ya da Escape davranışı eklemez; bunlar önceki dersin ayrı sözleşmesidir.

## Yer seçimi
`document.body` küçük bir uygulama için yeterli. Daha büyük bir uygulamada özel `#modal-root` kullanabilirsin; hedef element yoksa açık bir fallback tasarla. Sunucu render sırasında `document` olmadığı için hedefi tarayıcıda hazır olduğu anda seçersin.

:::sector
Portal, tooltip ve popover'da da kullanılır. Bir sonraki adımda aynı portalı Modal.Content'ın içine alıp trigger/content ilişkisini Context ile kuracağız.
:::
