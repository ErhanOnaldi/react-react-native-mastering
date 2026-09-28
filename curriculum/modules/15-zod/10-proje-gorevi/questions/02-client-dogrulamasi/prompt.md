Sinema'nın TMDB istemcisi HTTP cevabını ve film detayının alanlarını kullanan ekranlara ulaşmadan önce denetlesin.

## Gereksinimler
- TMDB isteği mevcut yetkilendirme başlığını kullanmalı.
- Başarılı detay yanıtı film detay sözleşmesine uymalı.
- HTTP 200 içindeki title=null reddedilmeli.
- HTTP 404 reddedilmeli ve veri doğrulama başarısı gibi dönmemeli.

## Örnek
Geçerli Dövüş Kulübü detayı title alanını taşır. Aynı endpoint null başlık döndürürse istemci Promise'i reddeder.

## Sözleşme
- src/shared/api/tmdb-client.ts içinden tmdbClient nesnesini named export et.
- tmdbClient.get(path, schema, params?) çağrısı doğrulanmış cevabı döndürmelidir.

