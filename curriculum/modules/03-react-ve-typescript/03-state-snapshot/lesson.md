---
title: State snapshot’ı
minutes: 8
kind: concept
---

# State snapshot’ı

:::pain[Problem]
Sinema’daki “üç bilet ekle” düğmesinde `setCount(count + 1)` satırını üç kez yazdın. Ekrandaki sayı 3 yerine 1 arttı.
:::

## Her render kendi değerlerini görür

State, component'in render'lar arasında sakladığı bilgidir; fakat bir render içindeki değişken anında değişmez. O render sırasında tanımlanan event handler, o anın state **snapshot**'ını görür. `setState` bir sonraki render için güncelleme planlar. Bu yüzden aynı handler içinde eski değere bağlı birkaç güncelleme yaparken updater fonksiyonu gerekir.

Props dışarıdan gelirken state component'in zaman içindeki değişimini temsil eder. Sinema'daki sayaç, tek olayda üç güncellemenin neden aynı eski değeri okuduğunu gösterir. Bu zihinsel model biraz sonra controlled input, effect ve asenkron callback davranışlarını anlamanı kolaylaştıracak.

## Aynı render’ın fotoğrafı
Bir render sırasında `count` sabittir. Üç çağrı da aynı `count + 1` değerini sıraya koyar. Handler bittiğinde React güncellemeleri işler. Üç bağımsız artış gerekiyorsa sıradaki değeri alan updater kullan.

```tsx check
import { useState } from 'react'
export default function TicketCounter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => {
    setCount(n => n + 1)
    setCount(n => n + 1)
    setCount(n => n + 1)
  }}>Bilet: {count}</button>
}
```

`n` her sıradaki güncel ara değerdir. `setCount(3)` gibi sabit bir son değer atıyorsan updater gerekmeyebilir. Başlangıç değeri `null` ise `useState<Movie | null>(null)` gibi union’ı açık yazman gerekir; yoksa TypeScript state’i yalnızca `null` sanır.

:::mistake
`setCount` çağrısından hemen sonraki `console.log(count)` eski sayıyı gösterir. O satır hâlâ aynı render’ın closure’ındadır.
:::

:::sector
Aynı olayda birden çok değişiklik veya eski değere bağlı güncelleme varsa updater, yarışan etkileşimlerde niyeti açık tutar.
:::
