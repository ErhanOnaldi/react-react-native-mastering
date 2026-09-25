Sinema’nın eski login butonu yalnız bir boolean değiştiriyordu; yanlış parola bile başarılı görünüyordu.

## Görev

`login.ts` içinde iki fonksiyonu tamamla:

- `login(username, password)` DummyJSON `POST /auth/login` adresine JSON gönderir. Başarılı yanıttan `accessToken` ve `refreshToken` döndürür; başarısız yanıttaki `message` ile `Error` fırlatır.
- `decodeJwtPayload(token)` JWT’nin ikinci parçasını base64url olarak çözer. `{ username, exp }` alanlarını döndürür. Bozuk biçim veya bu alanlar yoksa `null` döndürür. Decode işlemi **imza doğrulaması değildir**.

| Girdi | Beklenen |
| --- | --- |
| `emilys`, `emilyspass` | İki token gelir; access payload’ında `username: 'emilys'` vardır. |
| Yanlış parola | `Invalid credentials` hatası |
| `bozuk-token` | `null` |

`exp` Unix saniyesidir; tarayıcı saati milisaniye kullanır.
