Emily çıkış yaptıktan sonra yeni oturum eski profil cache’ini ve watchlist state’ini görebiliyor.

## Görev

`logout(deps)` fonksiyonunu yaz. `deps` içinde `queryClient`, `storage` ve `resetStore` var.

- `storage.removeItem('sinema-auth')` ile kalıcı token çiftini kaldır.
- `resetStore()` ile auth ve kullanıcıya ait Redux state’ini başlangıç durumuna döndür. Uygulamanın gerçek reset action’ları bu callback’in arkasına bağlanacak.
- `queryClient.clear()` ile eski oturuma ait query/mutation cache’ini sil.

Test, cache’e önce Emily profili koyar. Logout sonrası veri bulunmamalı ve yeni kullanıcıya ait oturum başladığında eski state geri gelmemeli.
