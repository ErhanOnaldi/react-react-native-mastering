Sinema arama ve film detay sayfalarının kullanıcıya görünen başarı, boş sonuç ve hata davranışlarını koruyan testleri yaz.

## Gereksinimler
- Arama sayfası `?q=Matrix` ile açılabilmeli; kullanıcı arama kutusunda metin girebilmeli.
- Sonuçta Matrix başlığı görünmeli ve istek query değeri `Matrix` olmalı.
- Boş sonuçta açıklayıcı boş durum, 500 yanıtında alert veya hata metni görünmeli.
- Detay sayfasında `/movie/550` Dövüş Kulübü’nü, bulunmayan id ise 404 hata durumunu göstermeli.
- Asenkron sonuç görünene kadar beklenmeli; testler birbirinden bağımsız olmalı.
- Gerçek ağa çıkılmamalı; fixture istekleri `Authorization: Bearer` taşımalı.

## Örnek
`?q=Matrix` → Matrix başlığı; `/movie/999999` → kullanıcıya görünür hata.

## Sözleşme
- `projects/sinema/src/pages/SearchPage.test.tsx` ve `projects/sinema/src/pages/MovieDetailsPage.test.tsx` dosyalarını oluştur.
- Sayfalar projedeki `src/test/setup.ts`, `src/test/render.tsx` ve MSW handler altyapısını kullanır.
- Türkçe fixture başlıkları: 550 `Dövüş Kulübü`, 603 `Matrix`.

## Kısıtlar
- Test dosyalarının dışında proje dosyalarını değiştirme.
