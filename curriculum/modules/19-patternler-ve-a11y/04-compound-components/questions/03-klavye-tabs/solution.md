## Neden böyle?
Tabs, dialogdan farklı klavye modeli kullanır: Tab seçili sekmeye gelir, oklar grup içinde dolaşır. `aria-controls` ve `aria-labelledby` iki yönlü ilişki kurar; `useId` birden çok Tabs örneğinde çakışmayı önler. DOM sırası değişirse tuş hareketi de görünen sırayı izler. Sonraki projede film detayındaki gerçek sekmelere aynı sözleşmeyi taşıyacaksın.

### Alternatif ve sınır
Tıklamayla seçimi değiştirmek tek başına kolaydır; yön tuşları için DOM sırasını izlemek elle indeks tablosundan daha dayanıklıdır.

### Sık hata
`tabIndex` bütün sekmelerde 0 olursa Tab gereksiz duraklar yaratır.

### Sektörde ve sıradaki adım
Projedeki gerçek film detayında videolar sekmesi veri yokken kaldırılınca da yön tuşu sırası doğru kalmalı.
