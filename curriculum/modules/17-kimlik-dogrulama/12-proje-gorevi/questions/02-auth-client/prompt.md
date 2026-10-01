Sinema uygulamasında aynı anda birden fazla bileşen korumalı kaynaklara istek attığında, süresi dolan erişim belirteci nedeniyle eşzamanlı `401` hataları oluşabilir. Belirteç döndürme kuralının bozulmaması ve mükerrer yenilemelerin oturumu düşürmemesi için istekleri tek uçuşta toparlayan merkezi bir istemci oluştur.

## Gereksinimler

- `authClient` korumalı API isteklerine güncel erişim belirtecini yetkilendirme başlığı olarak eklemelidir.
- Belirteç süresi dolduğunda gelen `401` yanıtları için `https://dummyjson.com/auth/refresh` adresine ortak ve tek bir `POST` yenileme isteği gönderilmelidir.
- Yenileme işlemi sürerken yetkilendirme hatası alan diğer tüm paralel istekler aynı yenileme sonucunu beklemelidir.
- Yenileme tamamlandığında bekleyen tüm orijinal istekler yeni belirteçle **bir kez** tekrar denenmeli ve sonuçları döndürülmelidir.
- Belirteç geçerli olduğunda gereksiz yenileme isteği atılmamalıdır.
- Uygulama genelinde kullanılmak üzere varsayılan depoya bağlı `authClient` örneği sağlanmalıdır.

## Örnek

| Durum | Beklenen Davranış |
| --- | --- |
| 2 paralel istek süresi dolmuş belirteçle gelir | Sunucuya **1 adet** yenileme isteği gider; iki istek de yeni belirteçle başarıyla tekrarlanır. |
| Belirteç geçerli | Yenileme isteği yapılmaz (0 refresh), doğrudan veri döner. |
| Yenilenen istek yine `401` alır | Yeni bir yenileme başlatılmaz, işlem hata ile sonlanır. |

## Sözleşme

- `src/features/auth/authClient.ts` dosyasından şu sembolleri named export et:
  - `createAuthClient(storage: TokenStorage)`
  - `authClient` (uygulama genelinde kullanılan hazır istemci örneği)
- İstemci arayüzü:
  - `{ get<T>(path: string): Promise<T> }`
- Depo bağımlılığı:
  - `TokenStorage`: `{ getTokens: () => Tokens | null; setTokens: (tokens: Tokens) => void }`
- `get(path)` içindeki `path` göreli bir DummyJSON yolu olmalıdır; örneğin `/auth/me` isteği `https://dummyjson.com/auth/me` adresine gider.

## Kısıtlar

- Eşzamanlı gelen `401` yanıtları için sunucuya birden fazla `/auth/refresh` isteği gönderilmemelidir.
