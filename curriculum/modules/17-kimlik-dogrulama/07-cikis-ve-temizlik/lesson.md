---
title: "Çıkıştan sonra eski veri görünmesin"
minutes: 8
kind: concept
---

# Çıkıştan sonra eski veri görünmesin

:::pain[Sinema’da sorun]
Emily çıkış yaptı. Yeni kullanıcı giriş yaptıktan sonra profil ekranında bir an Emily’nin cache’lenmiş verisi göründü; watchlist Redux’ta da kaldı.
:::

## Çıkış neden birden çok kaynağı temizler?

Logout yalnız token'ı silmek değildir. Önceki kullanıcıya ait Redux state, Query cache ve kalıcı saklama da temizlenmelidir; aksi hâlde yeni kullanıcı kısa süreliğine eski kişinin verisini görebilir. Oturum bitişi tek bir akışta yönetilirse butonla çıkış ve refresh başarısızlığı aynı temizlik kuralını kullanır.

Query key ve cache derslerinde verinin ömrünü, Redux'ta client state'i, token dersinde kalıcı saklamayı kurdun. Sinema'daki kullanıcı değişimi bu sahiplerin hepsinin birlikte sıfırlanmasını gerektirir. Bu, kimlik doğrulamanın güvenli kapanış adımıdır.

## Oturum sınırı

Çıkışta token’ları ve kullanıcıyı temizle, kalıcı kopyayı kaldır, kullanıcıya özel Redux slice’larını başlangıç durumuna döndür ve `queryClient.clear()` çağır. `invalidateQueries` veriyi eski kullanıcıya ait olarak tutup yeniden çekebilir; `clear()` bütün query/mutation cache’ini siler. Uygulamada yeni oturum için yeniden veri çekilir.

Saklama listener’ı varsa sıralamayı düşün: logout action’ı eski veriyi yeniden localStorage’a yazmamalı. Tek bir çıkış fonksiyonu yan etkileri koordine etsin.

Somut kontrol: çıkıştan önce `queryClient.getQueryData(['profile'])` Emily’yi gösterir; `clear()` sonrasında `undefined` olmalı. Yeni oturum açılınca `useQuery` profili yeniden getirir. Böylece eski profil bir anlığına bile gösterilmez.

:::sector[Sektörde]
Çıkış temizliği yalnız butonla değil refresh 403 gibi “oturum bitti” olayında da kullanılmalıdır.
:::
