Sinema’nın API client’ı ve arama gecikmesi için kalıcı testler ekle. Doğru query, yetkilendirme, hata ayrıntısı ve son değerin bekleme süresi boyunca korunması doğrulansın.

## Gereksinimler

- İkinci sayfa aramasında query, page ve language parametreleri doğru olmalı; Authorization Bearer başlığı gönderilmeli.
- Başarılı client yanıtındaki film korunmalı.
- HTTP 404 cevabı ApiError içinde status 404, statusCode 34 ve mesaj Film bulunamadı değerlerini taşımalı.
- Debounce başlangıç değerini hemen vermeli; 499 ms’de yeni değer görünmemeli, 500 ms’de görünmeli.
- 200 ms sonra yeni bir değer gelirse önceki timer’ın eski bitişinde eski arama görünmemeli; son değerden 500 ms sonra en yeni değer görünmeli.
- Gerçek ağ kullanma ve testlerin sonunda global fetch ile timer durumunu geri yükle.
- Sinema klasöründe pnpm test çalıştır.

## Örnek

İkinci sayfa araması: query Dövüş, page 2, language tr-TR ve Bearer kimlik doğrulaması.
404 yanıtı: HTTP 404, servis kodu 34 ve Film bulunamadı mesajı.
Debounce: “ba” değerinden 200 ms sonra “başlangıç” gelirse, ilk timer’ın bitişinde hâlâ eski yayın değeri korunur.

## Sözleşme

- Test dosyası: src/shared/api/tmdb-client.test.ts
- İçe aktarılan export’lar: tmdbClient ve ApiError; kaynak src/shared/api/tmdb-client
- Client çağrısı: tmdbClient.get(path, params)
- Test dosyası: src/hooks/useDebounce.test.ts
- İçe aktarılan export: useDebounce; kaynak src/hooks/useDebounce
- Hook imzası: useDebounce<T>(value: T, delay: number): T

## Kısıtlar

- URL parametrelerinin dizilişine bağlanma.
- Testte gerçek TMDB servisine erişme.
