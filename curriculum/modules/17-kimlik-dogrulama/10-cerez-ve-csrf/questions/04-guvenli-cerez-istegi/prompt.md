Çerez tabanlı oturum kullanan bir API'ye istek atarken tarayıcının kimlik çerezlerini iletmesi ve durum değiştiren işlemlerde CSRF saldırılarına karşı anti-forgery token'ın başlık olarak eklenmesi gerekir. İstek seçeneklerini güvenli biçimde yapılandıran bir yardımcı fonksiyon oluştur.

## Gereksinimler

- Fonksiyon daima `credentials: 'include'` seçeneğini içermelidir.
- `method` belirtilmemişse varsayılan `'GET'` olmalı; küçük harfle verilmişse büyük harfe çevrilmelidir.
- Durum değiştiren yöntemlerde (`POST`, `PUT`, `DELETE`, `PATCH`), `csrfToken` sağlanmışsa bu değer `X-CSRF-TOKEN` başlığı olarak eklenmelidir.
- Güvenli okuma yöntemlerinde (`GET`, `HEAD`) `csrfToken` verilmiş olsa bile `X-CSRF-TOKEN` başlığı eklenmemelidir.
- `body` mevcut olduğunda, `headers` içinde önceden tanımlı bir `Content-Type` yoksa `'application/json'` eklenmelidir.
- Kullanıcı tarafından sağlanan diğer özel başlıklar korunmalıdır.

## Örnek

| Girdi | Beklenen Yapılandırma Özeti |
| --- | --- |
| `{ method: 'get' }` | `method: 'GET'`, `credentials: 'include'` |
| `{ method: 'post', csrfToken: 'tok123' }` | `method: 'POST'`, `headers['X-CSRF-TOKEN']: 'tok123'` |
| `{ method: 'get', csrfToken: 'tok123' }` | `method: 'GET'`, `X-CSRF-TOKEN` eklenmez |
| `{ method: 'post', body: '{"ok":true}' }` | `headers['Content-Type']: 'application/json'` |

## Sözleşme

- `buildCookieRequest.ts` dosyasından `buildCookieRequest(config?: RequestConfig): RequestInit` fonksiyonunu export et.
- `RequestConfig` arayüzü `method?: string`, `headers?: Record<string, string>`, `body?: string` ve `csrfToken?: string` alanlarını kabul etmelidir.
