Birden fazla bileşen aynı anda korumalı kaynaklara istek attığında, erişim belirtecinin süresi dolmuşsa tüm istekler eşzamanlı olarak yetkilendirme hatası alır. Belirteç döndürme kuralının bozulmaması için tek bir yenileme işlemi paylaşılmalı ve bekleyen istekler taze belirteçle tekrarlanmalıdır.

## Gereksinimler

- İstemcinin `get` metodu `https://dummyjson.com` taban adresine eklenen verilen göreli yola istek atmalı, depoda erişim belirteci varsa yetkilendirme başlığına eklemelidir.
- İstek `401` dışında bir hata ile sonuçlanırsa belirteç yenileme denenmemeli, hata doğrudan durum koduyla fırlatılmalıdır.
- İstek `401` yetkilendirme hatası aldığında bir yenileme işlemi başlatılmalı; aynı anda yetkilendirme hatası alan diğer eşzamanlı istekler de aynı yenileme sonucunu beklemelidir.
- Yenileme işlemi başarıyla tamamlandığında, hata alan tüm istekler yeni erişim belirteciyle **yalnızca bir kez** tekrarlanmalıdır.
- Yenileme veya yeniden deneme işlemi başarısız olursa hata fırlatılmalı, sonsuz döngüye girilmemelidir.
- Yenileme tamamlandıktan sonra, gelecekteki olası süre dolumlarında yeni bir yenileme süreci başlatılabilmelidir.

## Örnek

| Durum | Beklenen Davranış |
| --- | --- |
| 2 paralel istek süresi dolmuş belirteçle çağrılır | Ağa **1 adet** yenileme isteği gider; 2 istek de yeni belirteçle tekrarlanarak başarıyla çözülür. |
| Belirteç geçerli | Yenileme isteği atılmaz (0 refresh), doğrudan veri döner. |
| Yeniden denenen istek yine `401` alır | Yeni bir yenileme başlatılmaz, hata fırlatılır. |

## Sözleşme

- `authClient.ts` dosyasından `createAuthClient(storage: TokenStorage): AuthClient` fonksiyonunu named export et.
- Sözleşme tipleri:
  - `AuthClient`: `{ get<T>(path: string): Promise<T> }`
  - `TokenStorage`: `{ getTokens: () => Tokens | null; setTokens: (tokens: Tokens) => void }`
- Yardımcı bağımlılık: `refreshSession(storage: TokenStorage): Promise<Tokens>` fonksiyonu `./refreshSession` dosyasından import edilebilir.

## Kısıtlar

- Eşzamanlı gelen `401` yanıtları için sunucuya asla birden fazla yenileme isteği gönderilmemelidir.
