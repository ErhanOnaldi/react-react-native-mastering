Watchlist bağlantısını elle yazınca sayfa açılıyor. Tek tek sayfalara kontrol eklemek yerine parent layout route’u koru.

## Görev

`ProtectedRoute({ isAuthenticated })` bileşenini tamamla:

- Giriş varsa `<Outlet />` döndür; çocuk sayfa görünür.
- Giriş yoksa `/login` adresine `<Navigate replace />` ile yönlendir.
- Geldiği yolu `state={{ from: location.pathname }}` olarak aktar; girişten sonra geri dönüş için kullanılacak.

Test `createMemoryRouter` içinde pathless layout route kurar. `/watchlists` ve `/profile` aynı kapıyı paylaşabilir; `/login` açık kalır. Bu client kontrolüdür, API yetkisi sunucuda uygulanmalıdır.
