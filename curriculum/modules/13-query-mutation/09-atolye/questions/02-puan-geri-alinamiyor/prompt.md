Film puanını seçince ekranda hemen yeni değer görünüyor. Sunucu 500 dönerse eski puan geri gelmiyor; başarılı kayıttan sonra da `Puanladıklarım` listesi eski kalıyor.

`MovieRating.tsx` içindeki `MovieRating` bileşeninde 550 numaralı filmi aç. `7 puan ver` ve `8,5 puan ver` seçeneklerini kullan; bir denemeyi başarısız, birini başarılı cevapla tekrar et. Görünen puan ve liste her durumda sunucunun son kabul ettiği değerle uzlaşsın.

## Arayüz sözleşmesi

- `Puanladıklarım` listesi yüklenirken `Liste yükleniyor` metni görünsün.
- Kayıt başarısız olursa görünen hata mesajı `kaydedilemedi` kelimesini içersin.
