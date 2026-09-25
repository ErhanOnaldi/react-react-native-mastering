Login çalışsa bile `/watchlists` URL’si girişsiz açılıyor; çıkıştan sonra da Emily’nin profil cache’i kalıyor.

## Dosya ve export sözleşmesi

| Dosya | Zorunlu export |
| --- | --- |
| `src/features/auth/ProtectedRoute.tsx` | `ProtectedRoute({ isAuthenticated })`; girişte `<Outlet />`, aksi halde `/login` adresine `Navigate replace`, `state.from` ile dönüş yolu |
| `src/features/auth/logout.ts` | `logout({ queryClient, storage, resetStore })`; `sinema-auth` kaydını, kullanıcıya ait Redux state’ini ve Query cache’ini temizler |
| `src/router.tsx` | `routes`, `router`; açık `/login`, korumalı `/watchlists` ve `/profile` |

`/watchlists` ve `/profile` route’larını aynı pathless ProtectedRoute parent’ına yerleştir. `/login` açık kalmalı. `src/pages/LoginPage.tsx` girişten sonra `location.state.from` varsa oraya dönebilir. `src/pages/ProfilePage.tsx` gerçek `/auth/me` verisini göstermeli.

Çıkış butonu `logout` fonksiyonunu kullansın. `resetStore` callback’i auth ve kullanıcıya ait watchlist/favori gibi slice’ları sıfırlasın; `queryClient.clear()` eski kullanıcı verisini kaldırsın. Bu client UX korumasıdır: yerel watchlist’leri gerçek sunucu yetkisi olmadan gizli veri sayma.
