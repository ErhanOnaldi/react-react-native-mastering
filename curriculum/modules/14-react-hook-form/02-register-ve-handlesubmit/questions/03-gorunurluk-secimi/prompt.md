İzleme listesi başlangıçta özel olsun; kullanıcı “Herkese açık” kutusunu işaretleyebilsin.

- Ad input'u ve `type="checkbox"` alanı formda çalışsın.
- Başlangıçta ad ve açıklama boş, `isPublic` false olsun.
- Geçerli submit'te `{ name, description, isPublic }` gönder; açıklama alanı görünmek zorunda değil ama değer boş string olmalı.

Örnek: kutu boş → `false`; işaretli → `true`.
