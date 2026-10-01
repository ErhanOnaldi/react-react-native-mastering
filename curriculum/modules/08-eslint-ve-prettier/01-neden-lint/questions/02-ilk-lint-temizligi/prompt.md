# İlk lint temizliği

Sinema’dan alınan küçük bir kaynak dosyada kullanılmayan bir import kaldı. Kaynak metnini düzelt ve film başlığını gösteren bileşeni koru.

## Gereksinimler

- Kullanılmayan import için sıfır lint hatası üret.
- Dışa aktarılan bileşen ve `Dövüş Kulübü` başlığı korunmalı.
- Bileşen prop olarak aldığı `title` değerini `<h1>` içinde göstermeli.

## Örnek

Girdi: `title = 'Dövüş Kulübü'` → çıktı: `<h1>Dövüş Kulübü</h1>`; lint hata sayısı `0`.

## Sözleşme

- Dosya: `movieSource.ts` içindeki `movieSource` adlı string dışa aktarımı.
- String, lint edilecek TSX kaynak metnini içerir; bileşen adı `MovieTitle`, prop adı `title` olmalıdır.

## Kısıtlar

- Kaynak string’ini silme veya boşaltma.
