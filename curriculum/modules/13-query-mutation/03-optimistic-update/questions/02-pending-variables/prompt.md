Sunucu yavaşken 8,5’i yalnız tıklanan kartta hemen görmek istiyorsun. Cache’i değiştirmeden `PendingRating({ movieId, rate })` bileşenini yaz.

- “8,5 ver” butonu `rate({ movieId, value: 8.5 })` mutation’ını başlatsın.
- Pending sırasında `mutation.variables.value` ile “8,5 gönderiliyor” göster.
- Hata gelirse geçici değer kaybolsun ve `role="alert"` ile “Kaydedilemedi” göster.

Bu yaklaşım tek kartta geçici değer için yeterli; paylaşılan listeyi sonraki görev değiştirecek.
