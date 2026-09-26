## Durum

Popüler film ekranına başlık filtresi eklemen istendi. Aynı filtre panelinin daha sonra başka bir listede de kullanılabileceğini düşün. Veriler TMDB popüler fixture'ından alınmış ve hazır.

## İstenen

`MovieBrowser.tsx` dosyasındaki `MovieBrowser` için iki uygulanabilir panel API'sinden **birini** seç:

- Tek bir `mode` prop'u: panelin arama görünümünü bu prop belirler.
- Ayrı kompozisyon parçaları: ekran, filtre kontrolünü panelin içine yerleştirir.

Seçimini kod yorumunda, diğer seçeneğe göre bir ödünleşmeyle açıkla. Kullanıcı “Film ara” alanına yazdığında başlıklar Türkçe büyük/küçük harf farkı olmadan süzülsün. Alan temizlenince tüm filmler geri gelsin. Sonuçlar liste olarak görünsün.

## Örnek

“resident” → yalnızca “Resident Evil”; alanı temizle → popüler filmlerin tamamı.
