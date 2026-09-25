Sinema'daki `setPage` geçişi tarayıcı geçmişine yazılmıyor. Şimdi gerçek URL'lerle çalışan iskeleti VS Code'da kur.

## Dosya ve export sözleşmesi

1. `package.json` içine workspace sürümüyle uyumlu `react-router` dependency ekle. `react-router-dom` kullanma.
2. `src/router.tsx` **named export** olarak `routes: RouteObject[]` ve `router = createBrowserRouter(routes)` sunsun.
3. Kök route `/` içinde `src/layouts/RootLayout.tsx` dosyasının **named export** `RootLayout` bileşeni olsun. Bu bileşen Ana sayfa (`/`), Ara (`/search`), Favoriler (`/favorites`) menüsünü ve `<Outlet />` içersin. `NavLink` ile yalnızca geçerli link etkin olsun; kök linkte `end` kullan.
4. Çocuklar: index → `HomePage`, `search` → `SearchPage`, `movie/:id` → `MovieDetailsPage`, `favorites` → `FavoritesPage`, `*` → `NotFoundPage`. Her biri `src/pages/<Ad>.tsx` içinde **named export** olsun.
5. Kök route'a `errorElement` ekle; hata ekranında güvenli mesaj ve ana sayfa bağlantısı göster.
6. `src/main.tsx` içinde `FavoritesProvider` ağacının altında `<RouterProvider router={router} />` render et. `RouterProvider` import'u `react-router/dom`; diğer API'ler `react-router` içinden.

Bu görevde sayfalara temel başlık ve içeriği yerleştir. Sonraki görevde URL değerleriyle davranışlarını tamamlayacaksın. Testler `routes` dizisini `createMemoryRouter` ile açıyor.
