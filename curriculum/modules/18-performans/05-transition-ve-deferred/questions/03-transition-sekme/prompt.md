Ağır içerik barındıran sekmeler arasında geçiş yapılırken arayüzün kilitlenmesini engellemek ve geçiş sırasında kullanıcıya bekleme durumunu hissettirmek istiyorsun.

## Gereksinimler
- İki sekme butonu sun: "Özet" ve "Oyuncular".
- Varsayılan olarak "Özet" sekmesi seçili olmalı ve ekranda "Film özeti" metni bulunmalıdır.
- "Oyuncular" butonuna tıklandığında sekme güncellenmeli ve "Oyuncu listesi" metni görünmelidir.
- Sekme geçişi düşük öncelikli bir geçiş (transition) olarak işletilmelidir.
- Geçiş işlemi devam ederken `role="status"` özniteliğine sahip alanda `Sekme açılıyor` metni gösterilmeli; işlem bittiğinde bu durum alanı boş dizeye dönmeli ancak DOM'da kalmalıdır.

## Örnek
Kullanıcı "Oyuncular" butonuna bastığında arayüz donmaz; durum alanında "Sekme açılıyor" belirir ve yeni sekme içeriği ("Oyuncu listesi") hazır olduğunda ekrana yansır.

## Sözleşme
- Dosya ve export: `MovieTabs.tsx` → `MovieTabs()`
- Arayüz: "Özet" ve "Oyuncular" adlı butonlar, `role="status"` elementi, "Film özeti" / "Oyuncu listesi" içerik metinleri.
