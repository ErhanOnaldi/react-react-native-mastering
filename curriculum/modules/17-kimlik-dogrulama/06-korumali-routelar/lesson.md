---
title: "İzleme listesine kapı koy"
minutes: 8
kind: concept
---

# İzleme listesine kapı koy

:::pain[Sinema’da sorun]
Giriş butonunu gizledin ama `/watchlists` URL’sini doğrudan yazınca özel sayfa açılıyor. Bir bağlantıyı saklamak, route’u korumaz.
:::

## Layout route

React Router 8’de `Outlet` çocuk route’u yerleştirir. Koruma bileşeni token yoksa `<Navigate to="/login" replace state={{ from: location.pathname }} />` döndürür. Token varsa `<Outlet />` döndürür. İlgili sayfaları tek bir pathless parent altında grupla; her sayfaya aynı kontrolü kopyalama.

```tsx title="src/router.tsx"
{ element: <ProtectedRoute isAuthenticated={signedIn} />, children: [
  { path: 'watchlists', element: <WatchlistsPage /> },
  { path: 'profile', element: <ProfilePage /> },
] }
```

Bu nesne, mevcut `RootLayout` route’unun `children` dizisine eklenir. `/login` aynı korumalı grubun dışında kalır; yoksa giriş ekranına da erişemezsin.

Yenileme sonrası token kalıcı depodan okunuyorsa ilk render’da “henüz kontrol ediliyor” durumunu düşün. Erken redirect, geçerli oturumu bir anlığına login’e atabilir. Kullanıcı döndüğünde `from` yolunu kullanmak deneyimi tamamlar.

:::mistake[Sık hata]
Client route koruması API güvenliği değildir. Kullanıcı JavaScript’i değiştirebilir; özel veriyi sunucu da yetki kontrolüyle korumalı. Bu sahte projede watchlist’ler yerel depoda olduğu için gerçek sunucu gizliliği sağlanmaz.
:::
