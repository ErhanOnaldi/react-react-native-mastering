Gerçek POST çalışıyor; şimdi buton kullanıcıya ne olduğunu söylesin.

`RateButton({ movieId, rate })` bileşenini yaz. `rate` async fonksiyonu `{ movieId, value }` alır. 8,5 puan butonuna tıklanınca `useMutation` ile çağır.

- Beklerken buton disabled ve “Kaydediliyor…” yazsın.
- Başarılı olunca “Kaydedildi” görünsün.
- Hata olunca “Puan kaydedilemedi” görünsün.

Mutation’ı render sırasında çağırma; yalnızca click event’inde başlat.
