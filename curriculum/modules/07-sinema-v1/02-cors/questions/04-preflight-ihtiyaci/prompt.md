Farklı kökler (origin) arasında veri taşırken tarayıcının asıl istekten önce bir ön kontrol isteği gönderip göndermeyeceğini belirlemek gerekir. Verilen istek yapılandırmasına göre ön kontrol gereksinimini hesaplayan bir yardımcı fonksiyon yaz.

## Gereksinimler

- Yöntem `GET`, `HEAD` veya `POST` dışında bir değerse (`PUT`, `DELETE`, `PATCH` gibi) ön kontrol gerekir (`true`). Yöntem belirtilmemişse varsayılan `GET` kabul edilir.
- Başlık adları büyük/küçük harf duyarsız kontrol edilmelidir.
- İstek başlıklarında yalnızca güvenli listedeki adlar bulunabilir: `accept`, `accept-language`, `content-language` ve `content-type`. Bu liste dışındaki herhangi bir başlık (`authorization`, `x-api-key` vb.) ön kontrol gerektirir (`true`).
- `content-type` başlığı varsa değeri (parametreleri hariç, örneğin `; charset=utf-8` gibi ekler ayrıştırılarak) yalnızca şu üç değerden biri olabilir:
  - `application/x-www-form-urlencoded`
  - `multipart/form-data`
  - `text/plain`
- Başka bir içerik türü (örneğin `application/json`) ön kontrol gerektirir (`true`).
- Yukarıdaki tüm koşulları sağlayan basit istekler için ön kontrol gerekmez (`false`).

## Örnek

| Yöntem | Başlıklar | Sonuç |
| --- | --- | --- |
| `GET` | Yok | `false` |
| `GET` | `{ "Accept": "application/json" }` | `false` |
| `POST` | `{ "Content-Type": "application/json" }` | `true` |
| `GET` | `{ "Authorization": "Bearer token" }` | `true` |
| `DELETE` | Yok | `true` |
| `POST` | `{ "content-type": "text/plain; charset=utf-8" }` | `false` |

## Sözleşme

- `needsPreflight.ts` → `RequestOptions` arayüzü: `method?: string`, `headers?: Record<string, string>`.
- `needsPreflight.ts` → `needsPreflight(options?: RequestOptions): boolean`.
