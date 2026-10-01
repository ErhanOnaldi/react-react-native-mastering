TMDB yanıtı HTTP hatasıysa durum kodunu bildir; başarılı HTTP cevabındaki yanlış film verisini de uygulamaya geçirme.

## Gereksinimler
- İstenen adrese GET isteği gönder ve Authorization başlığında Bearer test-token kullan.
- HTTP başarısızsa durum kodunu içeren hata üret.
- Başarılı yanıt gövdesinde id tam sayı, title boş olmayan string olmalı.
- Başarılı sonuç yalnızca id ve title alanlarını içersin; title null ise işlem reddedilsin.

## Örnek
200 ve { id: 550, title: "Dövüş Kulübü" } → { id: 550, title: "Dövüş Kulübü" }. 404 yanıtı HTTP durumunu belirten hatayla reddedilir.

## Sözleşme
- client.ts dosyasında getMovie(path: string) named export'unu tanımla.

