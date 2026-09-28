Kullanıcı giriş yaptığında sunucu kimlik doğrulaması gerçekleştirir ve oturum belirteçlerini teslim eder. İstemcinin bu belirteçleri güvenle alması ve son kullanma tarihini arayüzde takip edebilmek için belirteç gövdesini ayrıştırması gerekir.

## Gereksinimler

- `login` fonksiyonu kullanıcı adı ve parolayı kimlik sunucusuna ileterek oturum açmalıdır.
- Başarılı yanıttan erişim ve yenileme belirteçlerini içeren nesne döndürülmelidir.
- Hatalı kimlik bilgisi veya sunucu reddi durumunda, sunucunun döndürdüğü hata mesajını taşıyan bir hata fırlatılmalıdır.
- `decodeJwtPayload` fonksiyonu verilen belirtecin gövde bölümünü çözümleyerek kullanıcı adı ve süre bilgilerini nesne olarak döndürmelidir.
- Belirteç bozuk biçimdeyse, gerekli alanları içermiyorsa veya çözümleme başarısız olursa `null` döndürülmeli, hata fırlatılmamalıdır.

## Örnek

| Çağrı | Beklenen Sonuç |
| --- | --- |
| `login('emilys', 'emilyspass')` | `{ accessToken: "...", refreshToken: "..." }` |
| `login('emilys', 'hatali')` | Hata fırlatılır: `"Invalid credentials"` |
| `decodeJwtPayload(gecerliToken)` | `{ username: "emilys", exp: 1727485200 }` |
| `decodeJwtPayload('bozuk-token')` | `null` |
| `decodeJwtPayload('a.e30.b')` | `null` |

## Sözleşme

- `login.ts` dosyasından şu fonksiyonları named export et:
  - `login(username: string, password: string): Promise<Tokens>`
  - `decodeJwtPayload(token: string): JwtPayload | null`
- Tipler:
  - `Tokens`: `{ accessToken: string; refreshToken: string }`
  - `JwtPayload`: `{ username: string; exp: number }`
