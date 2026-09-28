Popüler film ekranına tekrar kullanılabilir başlık filtresi ekle. Panel için iki tasarım seçeneği de uygundur; seçimini ve diğerine göre somut bir ödünleşimi kod yorumunda açıkla.

## Gereksinimler

- Kullanıcı “Film ara” alanından başlıkları arayabilmelidir.
- Arama büyük/küçük harfe duyarsız olmalı; Türkçe harflerle eşleşme korunmalıdır.
- Arama eşleşen filmleri liste olarak göstermelidir.
- Alan temizlendiğinde dört popüler film yeniden görünmelidir.
- Panel belirli film başlıklarına gömülmemelidir.
- Kod yorumunda seçilen tasarımın genişleme veya kullanım maliyeti açıklanmalıdır.

## Örnek

“resident” → yalnız Resident Evil; “ÖRÜMCEK” → yalnız Örümcek-Adam: Yepyeni Bir Gün; alanı temizle → dört film.

## Sözleşme

- Dosya ve export: `MovieBrowser.tsx` → named export `MovieBrowser`
- Props: başlangıç film verisi bileşende sağlanır.
- Arayüz: “Film ara” adlı textbox ve film `listitem`'ları.
- Tasarım seçeneği: tek yapılandırma alanı olan panel veya ekranın içine ayrı kontrol parçaları yerleştirebildiği panel.
