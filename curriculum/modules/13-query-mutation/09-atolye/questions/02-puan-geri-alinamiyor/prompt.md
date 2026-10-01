Film puanını seçince ekranda hemen yeni değer görünüyor. Sunucu 500 dönerse eski puan geri gelmiyor; başarılı kayıttan sonra da `Puanladıklarım` listesi eski kalıyor.

`MovieRating.tsx` içindeki `MovieRating` bileşeninde 550 numaralı filmi aç. `7 puan ver` ve `8,5 puan ver` seçeneklerini kullan; bir denemeyi başarısız, birini başarılı cevapla tekrar et. Görünen puan ve liste her durumda sunucunun son kabul ettiği değerle uzlaşsın.

## Arayüz sözleşmesi

- `Puanladıklarım` listesi beklerken `Liste yükleniyor` metni görünsün.
- Sunucu puanı reddederse görünen hata mesajı `kaydedilemedi` kelimesini içersin.
- Puan isteği beklerken seçilen puan hemen görünsün; hata halinde son onaylı puan geri gelsin.
- Başarılı puan isteğinden sonra rated liste yeniden yüklensin.
