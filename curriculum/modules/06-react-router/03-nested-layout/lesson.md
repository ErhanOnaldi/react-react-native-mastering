---
title: "Ortak layout ve Outlet"
minutes: 8
kind: concept
---

# Ortak layout ve Outlet

:::pain[Problem]
"Ana sayfa", "Ara" ve "Favoriler" sayfalarına aynı menüyü kopyaladın. Bir link değişince üç dosyayı düzeltmen gerekiyor; birinde eski menü kalıyor.
:::

## Üst rota ortak kabuk olsun

`RootLayout` menüyü bir kez gösterir. `<Outlet />`, eşleşen alt rotanın içeriğine ayrılmış yerdir. Üst rotanın `children` dizisinde `index: true`, `/` adresinin varsayılan çocuğudur.

```tsx title="src/router.tsx"
import { Outlet, NavLink, createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

function Layout() {
  return <><nav><NavLink to="/" end>Ana sayfa</NavLink><NavLink to="/search">Ara</NavLink></nav><Outlet /></>
}
const router = createBrowserRouter([{ path: '/', element: <Layout />, children: [
  { index: true, element: <h1>Filmler</h1> },
  { path: 'search', element: <h1>Arama</h1> },
] }])
export function App() { return <RouterProvider router={router} /> }
```

`search` alt yolu başında `/` olmadan yazıldı: `/` ebeveynine göre `/search` olur. `NavLink` üzerinde `end`, ana sayfa bağlantısının alt yollarda etkin görünmesini önler.

:::mistake[Sık hata]
`Outlet` unutulursa URL değişir ama çocuğun içeriği görünmez. Bu, rota tanımı doğru olduğu halde "boş sayfa" görünen klasik hatadır.
:::

:::sector
Kalıcı menü, header ve footer gibi parçalar layout'ta yaşar; sayfa bileşeni yalnızca kendi içeriğini anlatır.
:::
