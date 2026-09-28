Page 2 açılırken page 1’in kartları kaybolmasın; yeni liste gelene kadar geçiş durumunu açıkça göster.

## Gereksinimler

- `page` değerine göre popüler film sayfasını al ve sonuçları listele.
- Sayfa değişince yeni istek URL’inde doğru `page` değeri bulunsun.
- Yeni cevap gelene kadar önceki film başlıkları görünmeye devam etsin.
- Geçiş sırasında `Yeni sayfa yükleniyor` metnini göster.
- Yeni cevap gelince cevap sayısını ve yeni film başlığını göster.

## Örnek

`page=1` → mevcut kartlar; `page=2` → yeni sayfa yüklenirken aynı kartlar ve geçiş metni; cevap gelince `Koşucu` başlığı.

## Sözleşme

- `MoviePages.tsx` dosyasından `MoviePages({ page }: { page: number })` named export edilir.
- Sonuç TMDB `/3/movie/popular` endpoint’indeki `page` parametresinden gelir.

## Kısıtlar

- İstek `Authorization: Bearer test-token` ve `language=tr-TR` taşır.
