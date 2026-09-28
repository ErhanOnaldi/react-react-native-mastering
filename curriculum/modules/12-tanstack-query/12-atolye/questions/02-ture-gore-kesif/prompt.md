Keşif listesinde tür ve sayfa seçimi doğru filmleri göstersin; URL geçmişinden geri dönünce önceki seçim geri yüklensin.

## Gereksinimler

- `Tür` seçicisinde `Aksiyon` (28) ve `Komedi` (35) seçenekleri bulunsun.
- `Sonraki sayfa` ve `Önceki sayfa` düğmeleri sayfayı değiştirip güncel listeyi göstersin.
- Tür ve page seçimi URL’de `genre` ve `page` parametreleriyle paylaşılabilsin.
- Tür değiştiğinde page 1’e dön; güncel numarayı `Sayfa N` biçiminde göster.
- Aksiyon, sayfa 2’ye gidip Komedi’ye geçtikten sonra geri gezinince Aksiyon, sayfa 2 seçimi ve sonucu geri gelsin.
- Yükleme ve hata görünümleri anlaşılır olsun.

## Örnek

`/discover?genre=28&page=1` → sonraki → Komedi seç → `page=1` → geri → `genre=28&page=2` ve Aksiyon sonucu.

## Sözleşme

- `GenreDiscover.tsx` dosyasından `GenreDiscover()` named export edilir.
- Tür kontrolü accessible name olarak `Tür` kullanır; sayfa düğmelerinin adları `Sonraki sayfa` ve `Önceki sayfa` olur.
- TMDB `/3/discover/movie` cevabındaki film başlıkları görünür.

## Kısıtlar

- İstekler `Authorization: Bearer test-token` ve `language=tr-TR` kullanır.
