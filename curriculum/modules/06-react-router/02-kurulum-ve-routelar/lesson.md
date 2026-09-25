---
title: "Router kurulumu ve bağlantılar"
minutes: 9
kind: concept
---

# Router kurulumu ve bağlantılar

:::pain[Problem]
Ana sayfadaki "Ara" düğmesi `setPage('search')` çağırıyor. Ekran değişse de adres `/` kalıyor; yenileyince ana sayfa geri geliyor.
:::

## Rota ağacını kur

Data mode'da rota tanımları bileşenlerden ayrıdır. `createBrowserRouter` tarayıcı geçmişini kullanır; `RouterProvider` uygulamaya bu router'ı verir.

```tsx title="src/router.tsx"
import { createBrowserRouter, type RouteObject } from 'react-router'
import { RouterProvider } from 'react-router/dom'

const routes: RouteObject[] = [
  { path: '/', element: <h1>Ana sayfa</h1> },
  { path: '/search', element: <h1>Ara</h1> },
]
const router = createBrowserRouter(routes)
export function App() { return <RouterProvider router={router} /> }
```

`RouteObject[]` ayrı tutulduğunda testte aynı ağacı `createMemoryRouter(routes, { initialEntries: ['/search'] })` ile açabilirsin. Testte gerçek tarayıcı geçmişine bağımlı kalmazsın.

## Bağlantı da geçmişe katılsın

`<a href="/search">` tam sayfa yükler. Uygulama içi geçiş için `<Link to="/search">Ara</Link>` kullan. Menüde etkin sayfayı göstermek için `NavLink` kullan; `className={({ isActive }) => isActive ? 'active' : ''}` kabul eder. İkisi de `react-router` içinden gelir.

:::mistake[Sık hata]
React Router 8'de `react-router-dom` import etme. `Link`, `NavLink`, `createBrowserRouter` → `react-router`; DOM'a özel `RouterProvider` → `react-router/dom`.
:::

:::sector
Rota ağacını modül düzeyinde kurmak, render sırasında her seferinde yeni router yaratmayı önler. Sonraki derste ortak menüyü her sayfaya kopyalamadan paylaşacağız.
:::
