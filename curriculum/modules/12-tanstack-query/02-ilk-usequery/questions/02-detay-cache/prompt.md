Detay sayfasında aynı filme dönüldüğünde Türkçe başlığı hemen göster ve taze veri için gereksiz GET gönderme.

## Gereksinimler

- Film başlığını `<h2>` içinde göster.
- Veri gelene kadar `Yükleniyor`, hata durumunda `Hata: ...` metnini göster.
- 60 saniye içinde aynı film yeniden açıldığında yeni GET atma.
- Detay id’si değişince farklı filmin başlığını göster.

## Örnek

`id=550` → `Dövüş Kulübü`; aynı id ile ekrandan ayrılıp 60 saniye içinde dön → başlık yine görünür, bu akıştaki toplam detay isteği 1.

## Sözleşme

- `MovieDetail.tsx` dosyasından `MovieDetail({ id }: { id: number })` named export edilir.
- TMDB `/3/movie/:id` yanıtındaki `title` başlığı ekranda gösterilir.

## Kısıtlar

- İstek `Authorization: Bearer test-token` başlığını ve `language=tr-TR` parametresini taşır.
- HTTP başarısız yanıtı hata durumuna dönüşmelidir.
