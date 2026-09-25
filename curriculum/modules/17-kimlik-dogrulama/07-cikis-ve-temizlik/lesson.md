---
title: "Çıkıştan sonra eski veri görünmesin"
minutes: 8
kind: concept
---

# Çıkıştan sonra eski veri görünmesin

:::pain[Sinema’da sorun]
Emily çıkış yaptı. Yeni kullanıcı giriş yaptıktan sonra profil ekranında bir an Emily’nin cache’lenmiş verisi göründü; watchlist Redux’ta da kaldı.
:::

## Oturum sınırı

Çıkışta token’ları ve kullanıcıyı temizle, kalıcı kopyayı kaldır, kullanıcıya özel Redux slice’larını başlangıç durumuna döndür ve `queryClient.clear()` çağır. `invalidateQueries` veriyi eski kullanıcıya ait olarak tutup yeniden çekebilir; `clear()` bütün query/mutation cache’ini siler. Uygulamada yeni oturum için yeniden veri çekilir.

Saklama listener’ı varsa sıralamayı düşün: logout action’ı eski veriyi yeniden localStorage’a yazmamalı. Tek bir çıkış fonksiyonu yan etkileri koordine etsin.

Somut kontrol: çıkıştan önce `queryClient.getQueryData(['profile'])` Emily’yi gösterir; `clear()` sonrasında `undefined` olmalı. Yeni oturum açılınca `useQuery` profili yeniden getirir. Böylece eski profil bir anlığına bile gösterilmez.

:::sector[Sektörde]
Çıkış temizliği yalnız butonla değil refresh 403 gibi “oturum bitti” olayında da kullanılmalıdır.
:::
