Film detayı isteği 500 döndüğünde ekran `Yükleniyor` yazısında kalıyor. Başka filme geçince bir önceki filmin hata mesajı da görülebiliyor.

`MovieDetail.tsx` içindeki `MovieDetail` bileşenini önce hatalı cevapla aç, sonra yeniden dene ve film kimliğini değiştir. Görülen durumların güncel filmi anlatmasını sağla.

## Arayüz sözleşmesi

- Hata durumunda kullanıcının tekrar deneyebileceği bir `Yeniden dene` düğmesi olsun.
- Başarısız yükleme alert rolünde “yüklenemedi” ifadesini içersin; yeniden denemede başarılı başlık görünsün ve yükleme mesajı hata halinde takılı kalmasın.
- Aynı film için ilk istek ve retry isteği olmak üzere iki istek atılsın; film kimliği değişince yeni filmin içeriği gösterilsin.
