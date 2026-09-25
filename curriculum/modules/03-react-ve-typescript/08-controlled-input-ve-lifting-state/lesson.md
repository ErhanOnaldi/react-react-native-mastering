---
title: Controlled input ve state’i yukarı taşıma
minutes: 9
kind: concept
---

# Controlled input ve state’i yukarı taşıma

:::pain[Problem]
Sinema arama kutusu yazılanı biliyor, kart listesi ise kendi içinde bütün filmleri tutuyor. Kutudaki “Kara” yazısı listede hiçbir şeyi değiştirmiyor.
:::

## Tek kaynak
Controlled input’un `value` değeri state’ten gelir; `onChange` aynı state’i günceller. Hem arama kutusu hem liste bu değere ihtiyaç duyuyorsa state’i ikisinin ortak üst bileşeni App’e taşı. Kutunun yalnızca `value` ve `onChange` sözleşmesi kalır.

```tsx check
import { useState } from 'react'
export default function SearchExample() {
  const [query, setQuery] = useState('')
  const titles = ['Dövüş Kulübü', 'Kara Şövalye']
  const visible = titles.filter(title => title.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr')))
  return <><input aria-label="Film ara" value={query} onChange={e => setQuery(e.currentTarget.value)} /><ul>{visible.map(title => <li key={title}>{title}</li>)}</ul></>
}
```

`visible` mevcut props ve query’den hesaplanır; ayrıca state’te saklamak iki kaynağı senkron tutma yükü doğurur. Filmler bu modülde statik fixture örneklerinden gelir; arama için henüz fetch gerekmiyor.

:::mistake
`value` verip `onChange` eklememek input’u salt okunur yapar. Klavyeyle yazmayı önizlemede dene.
:::

:::sector
State’i, onu okuyan bileşenlerin en yakın ortak atasına koymak, veri akışını görünür kılar.
:::
