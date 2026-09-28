Sinema’nın Home, Search, Details ve Favorites ekranlarında sunucu verisi ortak cache’ten gelsin; arama ve sayfalama seçimleri doğru sonucu belirlesin.

## Gereksinimler

- Dört ekrandaki server data akışını Query’den yönet; favori id’lerini mevcut client state’te bırak.
- Search’te `q` ve `page`, Home’da `genre` ve `page` değişince doğru içerik gelsin.
- Boş arama isteği gönderme; geçersiz sayfayı 1 kabul et.
- Sayfa değişirken önceki liste yeni cevap gelene kadar görünür kalsın ve geçiş anlaşılır olsun.
- Detay id’si değişince yeni film göster; loading, error, empty ve success görünümleri anlaşılır kalsın.
- Taze arama verisine geri dönünce aynı arama için ikinci GET gönderme.

## Örnek

`?q=Dövüş&page=1` → detay → geri: sonuç `Dövüş Kulübü` görünür ve taze dönüşte arama isteği tekrarlanmaz. `page=2` yüklenirken önceki kartlar geçici olarak kalır.

## Sözleşme

- `src/pages/HomePage.tsx`, `SearchPage.tsx`, `MovieDetailsPage.tsx` ve `FavoritesPage.tsx` dosyaları uygulamanın mevcut named/default export’larını korur.
- Arama ifadesi, sayfa, tür ve film id’si ilgili sorgu kimliğine yansır.

## Kısıtlar

- Mevcut `movieQueries` tariflerini ve `movies-api.ts` fonksiyonlarını kullan; favori seçimini server data gibi saklama.
