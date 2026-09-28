RFC 9111 HTTP Caching spesifikasyonuna göre `Cache-Control` başlığı önbellek davranışını belirleyen en yetkili mekanizmadır. Başlık, virgülle ayrılmış anahtar veya anahtar-değer çiftlerinden oluşur.

`max-age` saniye cinsinden tazelik süresini belirtir. Ancak yanıtta `no-cache` veya `no-store` bulunuyorsa süre ne kadar uzun olursa olsun istemci bu cevabı sunucuya sormadan taze kabul edemez:
- `no-store`: Veri hiçbir şekilde kalıcı depolanmaz.
- `no-cache`: Veri saklanabilir; ancak her kullanımda sunucuya koşullu istek (`ETag` / `If-None-Match`) gönderilerek doğrulanmalıdır.

Tarayıcıların dahili HTTP önbelleği bu kuralları otomatik işletir. Uygulama düzeyinde (örneğin TanStack Query ile) önbellek kurarken de bu temel HTTP kavramlarını anlamak verinin ne zaman bayatlayacağını öngörmeyi sağlar.
