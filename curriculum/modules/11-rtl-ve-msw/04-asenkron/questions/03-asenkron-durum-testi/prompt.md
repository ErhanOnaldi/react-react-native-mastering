Film ayrıntısının yükleme, başarı ve sunucu hatası durumlarını koruyan kullanıcı testleri yaz.

## Gereksinimler
- Yavaş yanıt sürerken “Yükleniyor” status’ü görünür.
- Yanıt geldikten sonra “Dövüş Kulübü” başlığı görünür.
- 500 yanıtında “Film yüklenemedi” alert’i görünür.
- Başlık ve hata assertion’ları asenkron sonucu beklemelidir.

## Örnek
`id=550`: loading → heading; 500: alert.

## Sözleşme
- `MovieStatus.test.tsx` dosyasına test yaz.
- Bileşen `@impl/MovieStatus` yolundan import edilir; prop’u `id: number`.
- İstek `${TMDB_BASE}/movie/550` adresine gider ve `Authorization: Bearer test-token` taşır.
- Fixture host’u ve test server’ı `@test-utils` içinden alınabilir.

## Kısıtlar
- İki mutantın her birini yakala; sabit duvar saati uykusu kullanma.
