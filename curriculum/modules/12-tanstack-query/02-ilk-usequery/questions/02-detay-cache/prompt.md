Detay sayfasında seçilen filmin Türkçe başlığını göster; id değiştiğinde yeni filme ait başlığa geç.

## Gereksinimler

- Film başlığını `<h2>` içinde göster.
- Veri gelene kadar `Yükleniyor`, hata durumunda `Hata: Film yüklenemedi` metnini göster.
- Detay id’si değişince farklı filmin başlığını göster.

## Örnek

`id=550` → `Dövüş Kulübü`; `id=27205` olduğunda → `Başlangıç`.

## Sözleşme

- `MovieDetail.tsx` dosyasından `MovieDetail({ id }: { id: number })` named export edilir.
- TMDB `/3/movie/:id` yanıtındaki `title` başlığı ekranda gösterilir.

## Kısıtlar

- İstek `Authorization: Bearer test-token` başlığını ve `language=tr-TR` parametresini taşır.
- HTTP başarısız yanıtı hata durumuna dönüşmelidir.
