Film detayı ekranının bekleme, başarı ve hata davranışlarını sınayan testler yaz.

## Gereksinimler
- İlk istek sürerken “Yükleniyor” metni status rolüyle görünür.
- `id=550` yanıtlandıktan sonra “Dövüş Kulübü” başlığı görünür.
- Bulunmayan film için “Film yüklenemedi” alert’i görünür.
- `id=550` isteği bir kez gönderilir.

## Örnek
`id=550` → “Yükleniyor” → “Dövüş Kulübü” başlığı.

## Sözleşme
- `MovieTitle.test.tsx` dosyasına test yaz.
- Bileşen `@impl/MovieTitle` yolundan import edilir ve `id: number` prop’u alır.
- Test ortamının MSW fixture’ı gerçek ağa çıkmadan istekleri yanıtlar.

## Kısıtlar

- Sabit süre bekleme kullanma; her iki mutantı da en az bir testte yakala.
