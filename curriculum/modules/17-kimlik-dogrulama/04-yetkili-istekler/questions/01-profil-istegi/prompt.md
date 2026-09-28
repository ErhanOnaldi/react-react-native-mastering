Korumalı bir kullanıcı profili uç noktasına kimlik kanıtı sunarak istek atan ve gelen profil verisini ayrıştıran bir istemci fonksiyonu oluştur.

## Gereksinimler

- İstemci fonksiyonu verilen erişim belirtecini yetkilendirme başlığı olarak sunucuya iletmelidir.
- Sunucu isteği başarıyla yanıtladığında, profil nesnesinden kullanıcı kimliği (`id`) ve kullanıcı adı (`username`) alanları döndürülmelidir.
- Belirteç eksikse, geçersizse veya süresi dolmuşsa sunucunun döndürdüğü durum kodunu (`401`) içeren bir hata fırlatılmalıdır.
- Hata durumlarında sahte veya varsayılan bir profil döndürülmemeli, hata açıkça çağırıcıya yansıtılmalıdır.

## Örnek

| Belirteç | Beklenen Sonuç |
| --- | --- |
| Geçerli erişim belirteci | `{ id: 1, username: "emilys" }` |
| Boş belirteç (`""`) | Hata fırlatılır: `"401"` içeren mesaj |
| Süresi dolmuş belirteç | Hata fırlatılır: `"401"` içeren mesaj |

## Sözleşme

- `profile.ts` dosyasından `getProfile(accessToken: string): Promise<Profile>` fonksiyonunu named export et.
- Tip:
  - `Profile`: `{ id: number; username: string }`
