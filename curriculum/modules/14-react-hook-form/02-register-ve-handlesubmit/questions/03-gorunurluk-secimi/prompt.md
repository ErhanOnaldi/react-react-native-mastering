İzleme listesi başlangıçta özel olsun; kullanıcı “Herkese açık” kutusunu işaretleyebilsin.

- Ad input'unu ve `type="checkbox"` alanını `register` ile bağla.
- `defaultValues` içinde ad/açıklama boş, `isPublic` false olsun.
- `handleSubmit` ile `{ name, description, isPublic }` gönder; açıklama alanı görünmek zorunda değil ama değer boş string olmalı.

Örnek: kutu boş → `false`; işaretli → `true`.
