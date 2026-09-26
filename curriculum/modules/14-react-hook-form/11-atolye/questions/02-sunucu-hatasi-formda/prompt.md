Bir puan seç ve `Gönder`'e bas. Sunucu hata döndürdüğünde form sanki kayıt başarılıymış gibi varsayılan puana geri dönüyor; kullanıcı ikinci denemesinde önce seçtiği puanı yeniden seçmek zorunda kalıyor.

`RatingForm.tsx` içindeki `RatingForm` bileşeninde bu belirtiyi tekrar et: bir puan seç, gönder, sunucunun hata döndürdüğü durumu gözle. Seçtiğin puan hata sonrasında ekranda kalmalı; form yalnızca sunucu isteği gerçekten kabul ettiğinde sıfırlanmalı.

## Arayüz sözleşmesi

- Sunucu hatasında görünen mesaj `kaydedilemedi` kelimesini içersin.
