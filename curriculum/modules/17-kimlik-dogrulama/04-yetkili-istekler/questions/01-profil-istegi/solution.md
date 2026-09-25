## Neden böyle?

DummyJSON access token’ı Bearer başlığından okur. `fetch` 401’de reject yapmadığı için `ok` kontrolü olmazsa hata JSON’u yanlışlıkla profil sayabilirsin. Token’ı URL’ye taşımak log ve geçmişe sızma riskini artırır.

Bu fonksiyon tek istek için yeterli. Aynı başlığı bütün özel endpoint’lerde çoğaltınca ortak `authClient` gerekir; sonraki derste 401 onarımı da oraya taşınacak.
