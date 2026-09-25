---
title: "İhtiyaç anında rota yükleme"
minutes: 8
kind: concept
---

# İhtiyaç anında rota yükleme

:::pain[Problem]
Sinema açıldığında kullanıcı yalnızca ana sayfaya bakıyor ama büyük Favoriler ekranının kodu da ilk pakete giriyor. Açılış yükü büyüyor.
:::

## Rota modülünü geç yükle

Data mode'da bir rota için `lazy: () => import('./routes/favorites')` yazabilirsin. O modül `Component` gibi route alanlarını export eder. Eşleşme için gereken `path` rota ağacında kalır; içerik ancak rota ziyaret edilince yüklenir.

```tsx title="src/routes/favorites.tsx"
export function Component() {
  return <h1>Favoriler</h1>
}
```

```tsx title="src/router.tsx"
import { createBrowserRouter } from 'react-router'
const router = createBrowserRouter([{ path: '/favorites', lazy: () => import('./routes/favorites') }])
```

`Component` ile standart `default export` aynı şey değildir. `lazy` çözülen modülde route alanını arar. Bu yalnızca kod bölme konusuna giriş: veri önbelleği veya `loader` optimizasyonunu ileride ihtiyaç doğunca işleyeceğiz.

:::mistake[Sık hata]
`lazy` içine `path` koyma; React Router eşleşecek route'u modül yüklenmeden önce bilmelidir.
:::

:::sector
Büyük ve seyrek açılan sayfaları ayırmak başlangıç paketini küçültebilir. Ölçmeden her küçük route'u bölmek ek ağ gecikmesi doğurabilir.
:::
