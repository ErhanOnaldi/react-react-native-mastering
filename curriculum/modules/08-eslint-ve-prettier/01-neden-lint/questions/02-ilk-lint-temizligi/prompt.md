# İlk lint temizliği

Sinema’dan alınan küçük bir TSX dosyasında artık kullanılmayan `MovieCard` import’u kaldı. Editördeki `movieSource` string’i, ESLint’e verilecek dosyanın **kaynak metni**.

- Kullanılmayan import’u kaldır.
- `MovieTitle` export’unu ve `Dövüş Kulübü` başlığını koru.
- `no-unused-vars` kuralı için **0 hata** üret.

`movieSource` içindeki kodu düzenle; string’i silme. Test gerçek ESLint Node API’siyle onu `MovieTitle.tsx` olarak inceliyor.
