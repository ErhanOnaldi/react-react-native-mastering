---
title: "Davranış ve görünümü ayır"
minutes: 7
kind: concept
---

# Davranış ve görünümü ayır

:::pain[Problem]
Fragman dialogu, mobil film filtresi ve "Daha fazla" menüsü aynı `const [open, setOpen] = useState(false)` + `open/close/toggle` üçlüsünü tekrar ediyor. Birinde `toggle`'ı `setOpen(!open)` diye yazmışsın ve çift tıklamada menü kapanmıyor. Ama üçüne aynı dialog markup'ını zorlamak da yanlış: filtre bir çekmece, menü bir liste.
:::

## Headless hook
**Headless** bileşen/hook davranışı verir, görünümü vermez. `useDisclosure` yalnızca state ve eylemleri döndürür: `isOpen`, `open`, `close`, `toggle`. Hangi etiketin, hangi rolün, hangi CSS'in kullanılacağına onu çağıran bileşen karar verir.

```tsx check
import { useCallback, useState } from 'react'

export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((value) => !value), [])
  return { isOpen, open, close, toggle }
}
```

## İki küçük ama önemli karar
**Updater biçimi.** `toggle` içinde `setIsOpen(!isOpen)` yazarsan fonksiyon, oluşturulduğu render'ın `isOpen` snapshot'ını kullanır. Aynı olayda iki kez çağrılırsa ikisi de aynı eski değeri tersine çevirir. `setIsOpen((value) => !value)` her çağrıda en güncel değeri alır.

**Kararlı referans.** 18. modülde React Compiler varken elle `useCallback` yazmanın çoğu zaman gereksiz olduğunu gördün. Buradaki istisna: bu hook bir **kütüphane parçası**. Döndürdüğü `close`, başkalarının `useEffect` bağımlılığına girebilir (örneğin "rota değişince menüyü kapat"). Referans her render'da değişirse o effect her render'da yeniden çalışır. Hook'u kim, hangi ortamda (compiler'lı ya da değil) kullanırsa kullansın doğru davranması için referansı sen sabitlersin.

## Aynı mantık, farklı görünüm
```tsx title="MobileFilters.tsx"
const filters = useDisclosure()
return (
  <>
    <button type="button" aria-expanded={filters.isOpen} onClick={filters.toggle}>
      Filtreler
    </button>
    {filters.isOpen && <aside aria-label="Film filtreleri">…</aside>}
  </>
)
```

Burada dialog yok, focus trap yok; yalnızca `aria-expanded` ile açık/kapalı bilgisi var. Fragman modalı ise aynı hook'u dialog rolü, focus ve Escape ile birleştirecek.

:::mistake
Hook'u "her şeyin" sahibi yapma. Focus trap ve `aria-labelledby` yalnızca gerçek dialog kullanan UI'nın işi. Disclosure'ı dialog kurallarına bağlarsan filtre çekmecesinde gereksiz ve yanlış davranışlar üretirsin.
:::

:::sector
Radix, React Aria ve Headless UI gibi kütüphaneler tam da bu ayrımı yapar: davranış ve erişilebilirlik kütüphanede, görünüm sende. Sonraki derste bir adım daha atıp **hangi DOM etiketinin** render edileceğini de çağırana bırakacağız (`asChild`).
:::
