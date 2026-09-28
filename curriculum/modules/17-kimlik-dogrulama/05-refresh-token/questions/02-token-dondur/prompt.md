Kısa ömürlü erişim belirtecinin süresi dolduğunda, oturumun kesintiye uğramaması için eldeki yenileme belirteci sunucuya iletilerek yeni bir belirteç çifti alınmalıdır. Sunucunun uyguladığı belirteç döndürme (rotation) kuralı gereğince eski yenileme belirteci ikinci kez kullanılamaz.

## Gereksinimler

- Depodan mevcut oturum belirteçleri okunmalı; depoda oturum yoksa ağa istek atılmadan hata fırlatılmalıdır.
- Mevcut yenileme belirteci kimlik yenileme uç noktasına iletilmelidir.
- Başarılı yanıttan gelen yeni erişim ve yenileme belirteçleri depoya atomik olarak kaydedilmeli ve fonksiyon tarafından döndürülmelidir.
- Sunucu yenileme isteğini reddederse (örneğin kullanılmış belirteç nedeniyle `403`), hata fırlatılmalı ve depo durumu değiştirilmemelidir.

## Örnek

| Durum | Beklenen Davranış |
| --- | --- |
| Geçerli yenileme belirteci var | Yeni belirteç çifti döner, depodaki `setTokens` yeni çiftle çağrılır. |
| Zaten kullanılmış yenileme belirteci | Hata fırlatılır (`403`), depodaki belirteçler değiştirilmez. |
| Depoda hiçbir belirteç yok | Ağa istek atılmaz, doğrudan hata fırlatılır. |

## Sözleşme

- `refreshSession.ts` dosyasından `refreshSession(storage: TokenStorage): Promise<Tokens>` fonksiyonunu named export et.
- Tipler:
  - `Tokens`: `{ accessToken: string; refreshToken: string }`
  - `TokenStorage`: `{ getTokens: () => Tokens | null; setTokens: (tokens: Tokens) => void }`
