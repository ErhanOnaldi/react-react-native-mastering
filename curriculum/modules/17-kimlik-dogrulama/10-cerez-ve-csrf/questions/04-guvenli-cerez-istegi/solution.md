# Çerezli İstekler ve CSRF Başlığı

Çerez tabanlı oturumlarda `fetch` varsayılan olarak çapraz kaynaklı (cross-origin) isteklere çerezleri iliştirmez. Tarayıcının kimlik doğrulama çerezlerini göndermesini sağlamak için `credentials: 'include'` zorunludur.

## Durum değiştiren işlemler ve CSRF

CSRF saldırıları genellikle `POST`, `PUT`, `DELETE` gibi sunucu tarafında veri değiştiren eylemleri hedefler. Güvenli HTTP yöntemleri olan `GET` ve `HEAD` istekleri sunucu durumunu değiştirmemelidir (RFC 9110 idempotent/safe methods kuralı). Bu nedenle anti-forgery token'lar (`X-CSRF-TOKEN` veya ASP.NET Core `RequestVerificationToken`) yalnızca durum değiştiren isteklerde zorunlu tutulur.

## JSON gövde başlığı

`body` içeren API isteklerinde sunucunun JSON içeriğini doğru ayrıştırabilmesi için `Content-Type: application/json` başlığı gerekir. Eğer kullanıcı özel bir içerik tipi (örneğin `multipart/form-data`) tanımlamadıysa varsayılan olarak JSON tanımlanır.
