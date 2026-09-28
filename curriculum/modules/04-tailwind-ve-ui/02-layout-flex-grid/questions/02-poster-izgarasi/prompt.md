Sinema kataloğundaki posterler dar pencerede sıkışıyor, geniş ekranda ise alanı iyi kullanmıyor. Film listesini farklı pencere genişliklerine uyarla.

## Gereksinimler
- Filmler `Filmler` adlı bir bölüm içinde gösterilsin.
- Her film ayrı article olarak render edilsin ve başlığı görünsün.
- Bölüm class'ları `grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4` olsun.
- Kartlar `min-w-0` taşısın.

## Örnek
2 film verildiğinde iki article görünür. Bölüm, sırasıyla iki, üç ve dört sütun class'larını taşır.

## Sözleşme
- Dosya ve export: `PosterGrid.tsx` → `PosterGrid({ movies })`; her movie `id` ve `title` alanı taşır.
- Bölümün erişilebilir adı `Filmler`, kartların rolü `article` olur.
- Önizlemede pencereyi daraltıp genişleterek düzeni gözlemle.
