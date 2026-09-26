---
title: "401 sonrası tek refresh"
minutes: 10
kind: concept
---

# 401 sonrası tek refresh

:::pain[Sinema’da sorun]
Profil sayfası ve kullanıcı menüsündeki hesap rozeti aynı anda `/auth/me` istiyor. Süresi dolmuş token yüzünden ikisi de 401 alıyor; iki ayrı refresh isteği gidiyor. DummyJSON refresh token’ı tek kullanımlık tuttuğu için ikinci istek 403 oluyor.
:::

## Süresi dolan oturumu yenile

Access token kısa ömürlü olabilir. Refresh token, sunucunun izin verdiği durumda yeni token çifti almak için kullanılır; sıradan profil isteğine eklenmez. Birden çok istek aynı anda 401 aldığında her birinin ayrı yenileme başlatması yarış ve geçersiz token sorunları doğurabilir. Paylaşılan tek yenileme işlemi ve sınırlı retry bu akışı düzenler.

Sinema profil ve kullanıcı menüsü aynı oturuma bakar. Önceki Bearer isteği bilgisi burada hata sonrası tekrar denemeye bağlanır. Refresh başarısızsa oturum temizlenmeli; yeni token üretmek istemcinin değil sunucunun yetkisidir.

## Önce rotation

`POST /auth/refresh` gövdesine `{ refreshToken }` gönder. Başarılı yanıttaki **iki** token’ı sakla. 403 dönerse oturum artık devam ettirilemez; giriş ekranına dön. Refresh isteği kendi kendini yeniden refresh etmemeli.

## Sonra tek uçuş

İki 401 için ortak bir `Promise` tut. İlk istek refresh’i başlatır; ikincisi aynı Promise’ı bekler. Başarıda ikisi de yeni access token ile kendi orijinal isteğini **bir kez** tekrarlar. `finally` ile ortak Promise’ı temizle ki sonraki süre dolumu yeni refresh yapabilsin.

Bir ayrıntı daha var: ikinci 401 yanıtı, ilk refresh **bittikten sonra** gelebilir. İstekte kullandığın token storage’dakinden farklıysa başka istek zaten yenilemiştir; güncel token’la retry yap. Bu kontrol, Promise temizlenmiş olsa bile gereksiz ikinci refresh’i engeller.

`vi.useFakeTimers({ toFake: ['Date'] })` ve `vi.setSystemTime(...)` token’ın `exp` sonrasına geçmeyi sağlar. Testte `requests('/auth/refresh')` sayacı 1 olmalı. 401 dışındaki hatalarda refresh denememelisin.

:::mistake[Sık hata]
Retry da 401 dönerse tekrar refresh etmek sonsuz döngü üretir. Yeniden denemeyi bir turla sınırla.
:::

:::sector[Sektörde]
Bu client oturum sürekliliğini sağlar; backend’in gerçek yetki kontrolünün yerine geçmez.
:::
