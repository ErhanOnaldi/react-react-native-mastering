Bu hook öğretim için yalın bir fetch akışıdır. Cache, tekrar deneme ve istek tekilleştirme yapmaz; Sinema v1’de bu eksikliği göreceksin. Sonra TanStack Query bu ağ durumunu daha kapsamlı yönetecek.

## Alternatif ve tuzak

HTTP 500 için `fetch` Promise’i otomatik reddetmez; `response.ok` kontrolü şarttır. AbortError kullanıcı hatası değildir.

## Sektörde ve sonra

Bu öğretim hook’unda cache yok; TanStack Query modülünün ihtiyacı buradan doğar.
