Sinema uygulamasında kullanıcıların hesaplarıyla oturum açabilmesi, kimlik durumunun Redux store'da yönetilmesi ve sayfa yenilemelerinde oturumun korunabilmesi için giriş akışını ve durum dilimini oluştur.

## Gereksinimler

- `auth-api.ts` içindeki oturum açma fonksiyonu kullanıcı adı ve parolayı `https://dummyjson.com/auth/login` adresine `POST` ile iletmeli; başarılı yanıttan kullanıcı kimliği, kullanıcı adı ve belirteç çiftini döndürmelidir.
- Hatalı kimlik bilgilerinde sunucunun döndürdüğü hata mesajı fırlatılmalıdır.
- `authSlice.ts` başlangıçta boş oturum durumuna sahip olmalı; kimlik belirleme eyleminde kullanıcı ve belirteçleri saklamalı, çıkış eyleminde tüm alanları `null` değerine sıfırlamalıdır.
- `LoginPage` bileşeni kullanıcıdan bilgileri almalı, geçerli girişte durumu ve depolamayı güncelleyerek profili açmalıdır.
- `ProfilePage` bileşeni oturum açmış kullanıcının kimlik bilgilerini ekranda göstermelidir.

## Örnek

| Eylem / Çağrı | Beklenen Sonuç |
| --- | --- |
| `login('emilys', 'emilyspass')` | `{ id: 1, username: 'emilys', accessToken: '...', refreshToken: '...' }` |
| `login('emilys', 'yanlis')` | Hata fırlatılır: `"Invalid credentials"` |
| `setCredentials(...)` dispatch | Store'da `user.username === 'emilys'`, belirteçler dolu |
| `clearAuth()` dispatch | Store'da `user: null`, `accessToken: null`, `refreshToken: null` |

## Sözleşme

- `src/features/auth/auth-api.ts`:
  - `login(username: string, password: string)` fonksiyonunu named export et.
- `src/features/auth/authSlice.ts`:
  - `authSlice`, `setCredentials`, `clearAuth` sembollerini named export et.
  - State yapısı: `{ user: { id: number; username: string } | null; accessToken: string | null; refreshToken: string | null }`
- `src/pages/LoginPage.tsx`:
  - `LoginPage` bileşenini named export et.
- `src/pages/ProfilePage.tsx`:
  - `ProfilePage` bileşenini named export et.
