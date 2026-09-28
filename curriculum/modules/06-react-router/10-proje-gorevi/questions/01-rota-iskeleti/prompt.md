Sinema'da ekran değiştirirken adres ve tarayıcı geçmişi de tutarlı olmalı. Uygulamanın sayfa ağacını gerçek adreslere bağlayan iskeleti kur.

## Gereksinimler

- `/` için ana sayfa, `/search`, `/movie/:id`, `/favorites` ve bilinmeyen adres için ekranlar tanımla.
- Ana, arama ve favoriler ekranlarına ortak menü ve çocuk içeriğinin yer aldığı bir alan ekle.
- Menü bağlantıları kendi adreslerine gitsin; yalnızca geçerli olan bağlantı etkin işaretlensin.
- Tanınmayan adres için `Sayfa bulunamadı` başlığı ve ana sayfaya dönüş bağlantısı göster.
- Router tüm uygulamada bir kez kurulsun; mevcut favori provider'ı tüm sayfalara erişsin.
- Sayfalarda sonraki görevde tamamlanacak davranışlar için temel başlık ve içerik bulunsun.

## Örnek

Menüde `Ara` seç → adres `/search`, yalnız Ara etkin; `/olmayan` aç → 404 başlığı ve dönüş bağlantısı.

## Sözleşme

- Dependency: workspace sürümüyle uyumlu `react-router`; `react-router-dom` ekleme.
- `src/router.tsx` → named exports `routes: RouteObject[]` ve `router`.
- `src/layouts/RootLayout.tsx` → named export `RootLayout`.
- `src/pages/HomePage.tsx`, `SearchPage.tsx`, `MovieDetailsPage.tsx`, `FavoritesPage.tsx`, `NotFoundPage.tsx` → aynı adlı named export'lar.
- Route'lar: index, `search`, `movie/:id`, `favorites` ve `*`; kök route hata ekranına sahip.
- `src/main.tsx` uygulama girişidir. Router DOM sağlayıcısı `react-router/dom`, diğer route API'leri `react-router` girişinden alınır.
