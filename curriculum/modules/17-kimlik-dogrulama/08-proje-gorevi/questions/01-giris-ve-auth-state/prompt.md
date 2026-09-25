Sinema’nın izleme listesi kime ait olduğunu bilmiyor. Giriş yapıp kullanıcıyı ve iki token’ı tut.

## Dosya ve export sözleşmesi

| Dosya | Zorunlu export |
| --- | --- |
| `src/features/auth/auth-api.ts` | `login(username, password)` → `{ accessToken, refreshToken, id, username }` |
| `src/features/auth/authSlice.ts` | `authSlice`, `setCredentials({ user: { id, username }, accessToken, refreshToken })`, `clearAuth()`; state `{ user, accessToken, refreshToken }` ve boş durumda hepsi `null` |
| `src/pages/LoginPage.tsx` | `LoginPage` |
| `src/pages/ProfilePage.tsx` | `ProfilePage` |

`POST /auth/login` için `emilys` / `emilyspass` kullan. RHF + Zod ile boş alanları engelle; 400 `Invalid credentials` mesajını göster. Başarılı girişte hem store’u hem `sinema-auth` localStorage kaydını güncelle. Sayfa yenilemede kayıt okunup auth state kurulmalı. `/profile` gerçek `/auth/me` yanıtındaki kullanıcıyı göstersin; token’ı bileşende elle string birleştirmek yerine sonraki görevdeki client’a bağla.

:::warning
Bu örneğin localStorage seçimi XSS riskini taşır. Gerçek backend ile `httpOnly` cookie oturumu tasarlayabiliyorsan CSRF önlemleriyle birlikte değerlendir.
:::
