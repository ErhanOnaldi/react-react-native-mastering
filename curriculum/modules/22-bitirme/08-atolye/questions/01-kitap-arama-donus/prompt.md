Kitaplık arama ekranında kullanıcı bir kitap adı yazıp arasın; sonuç sayfalanabilsin. Aynı aramaya kısa süre içinde geri dönüldüğünde sonucu tekrar beklemesin; adres çubuğundaki bağlantıyı paylaşınca aynı arama ve sayfa açılsın.

## Giriş ve davranış

Testler `BookSearch.tsx` içindeki `BookSearch` bileşenini adres çubuğu ve veri sağlayıcısıyla birlikte açar.

- `Kitap ara` alanına yazıp aratınca sonuç listelenir.
- `Sonraki sayfa` / `Önceki sayfa` ile sayfa değişir; ilk sayfa 1'dir.
- Geri gidince önceki sayfanın sonucu yeniden görünür; gereksiz bir bekleme olmaz.
- Sonuç yoksa bunu anlaşılır biçimde söyle.

## Arayüz sözleşmesi

- Sonuç yoksa ekranda `Kitap bulunamadı` metni görünsün.

Örnek: "Dune" ara → sonraki sayfa → geri → ilk sayfanın sonucu tekrar görünür.
