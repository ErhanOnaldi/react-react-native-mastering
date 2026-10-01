Kullanıcı giriş yaptığında sunucu kimlik doğrulaması gerçekleştirir ve oturum belirteçlerini teslim eder. İstemci başarılı yanıttan belirteç çiftini almalı, başarısız yanıtta da sunucunun hata mesajını göstermelidir.

## Gereksinimler

- `login` fonksiyonu kullanıcı adı ve parolayı `https://dummyjson.com/auth/login` adresine `POST` isteğiyle ileterek oturum açmalıdır.
- Başarılı yanıttan erişim ve yenileme belirteçlerini içeren nesne döndürülmelidir.
- Hatalı kimlik bilgisi veya sunucu reddi durumunda, sunucunun döndürdüğü hata mesajını taşıyan bir hata fırlatılmalıdır.

## Örnek

| Çağrı | Beklenen Sonuç |
| --- | --- |
| `login('emilys', 'emilyspass')` | `{ accessToken: "...", refreshToken: "..." }` |
| `login('emilys', 'hatali')` | Hata fırlatılır: `"Invalid credentials"` |

## Sözleşme

- `login.ts` dosyasından şu fonksiyonu named export et:
  - `login(username: string, password: string): Promise<Tokens>`
- Tipler:
  - `Tokens`: `{ accessToken: string; refreshToken: string }`
