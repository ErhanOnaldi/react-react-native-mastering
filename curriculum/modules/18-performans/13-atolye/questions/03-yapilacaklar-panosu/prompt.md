Gerçek DummyJSON kullanıcıları ve yapılacaklarıyla paylaşılabilir bir pano kur. Kullanıcı seçimi ve tamamlanma filtresi bağımsız çalışmalı; seçimler sayfa yenilenince korunmalı.

## Gereksinimler
- Kullanıcı listesi DummyJSON /users verisinden gelmeli.
- Seçilen kullanıcının işleri DummyJSON /todos/user/:userId kaynağından yüklenmeli.
- Tümü, tamamlananlar ve tamamlanmayanlar durumları filtrelenebilmeli.
- Kullanıcı ve durum seçimi URL'den okunmalı, URL'de güncellenmeli ve yenilemede korunmalı.
- İşler tamamlanmış/tamamlanmamış olduğu anlaşılır biçimde göstermeli.
- Kullanıcı veya işler yüklenemezse anlaşılır hata; eşleşme yoksa boş durum gösterilmeli.
- Veri getirme ile liste/filtre görünümü ayrı modüllerde olmalı.
- Büyük listede filtre değişimi arayüzü kilitlememeli.

## Örnek
Kullanıcı 4 ve tamamlanmamış durumu seçildiğinde URL bu iki seçimi içerir; yenilemeden sonra aynı kullanıcının tamamlanmamış işleri görünür.

## Sözleşme
- Proje yolu: projects/atolye/src/yapilacaklar-panosu/
- Uygulamadan açılabilir bir pano oluştur; dosya adları ve dışa aktarılan arayüz serbesttir.
- Gerçek servis yolları: /users ve /todos/user/:userId.

## Kısıtlar
- Kişi seçimi ile tamamlanma filtresi birbirinden bağımsız olmalı.
- Birkaç kullanıcı ve filtre birleşimini gerçek verilerle dene.
