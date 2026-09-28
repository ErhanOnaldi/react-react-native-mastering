Film kataloğunda arama ve sıralama sırasında favori yıldızı başka filme kayıyor. Düzeltmende favori işareti her zaman seçildiği filme ait kalmalı.

## Gereksinimler
- Arama metni film başlıklarını filtrelemeli.
- Sıralama düğmesi yönü değiştirmeli.
- Bir film favoriye alındıktan sonra arama temizlenince favori kalmalı.
- Sıralama yönü değişince favori başka filme taşınmamalı.
- Favori durumu aria-pressed ile sunulmalı.

## Örnek
Matrix'i favorile, aramayı temizle; Matrix yıldızı seçili kalır. Dövüş Kulübü'nü favorile ve sıralamayı değiştir; aynı film seçili kalır.

## Sözleşme
- Dosya ve export: MovieCatalog.tsx → MovieCatalog()
- Arayüz: Film ara etiketli textbox, Sırala adlı düğme ve her film için “<başlık> favori” erişilebilir adlı düğme.
