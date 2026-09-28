Popüler film ekranında aynı listeye kısa süre sonra dönüldüğünde yeniden ağdan beklemek zorunda kalma.

## Gereksinimler

- Popüler film başlıklarını göster.
- İlk açılışta yüklenme, başarısız cevapta okunabilir hata durumu göster.
- Ekrandan ayrılıp bir dakika dolmadan dönünce aynı listeyi yeniden isteme.

## Örnek

Aç → `Örümcek-Adam: Yepyeni Bir Gün` başlığını gör → ayrıl → geri dön → başlık görünür, popüler film isteği toplam bir kez yapılmış olur.

## Sözleşme

- `PopularMovies.tsx` dosyasından `PopularMovies()` named export edilir.
- Hata görünümünde `yüklenemedi` sözcüğü yer alır.

## Kısıtlar

- İstek `Authorization: Bearer test-token` başlığı ve `language=tr-TR` parametresini taşır.
