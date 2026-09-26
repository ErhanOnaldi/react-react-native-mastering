## Neden böyle?
shadcn'in tema sözleşmesi adlandırmaya dayanır: `--x` bir yüzey, `--x-foreground` onun üstündeki metin. Bekçi bu sözleşmeyi kullandığı için yeni bir rol (`--sidebar` / `--sidebar-foreground`) eklediğinde kodu değiştirmen gerekmez.

OKLCH'nin ilk bileşeni **algısal** açıklıktır: 0.2 ile 0.9 arasındaki fark, göze de büyük görünür. HSL'deki `lightness` böyle değildir; aynı L değerindeki sarı ile mavi çok farklı parlaklıkta görünür. Bu, shadcn'in (ve Tailwind v4'ün) OKLCH'ye geçmesinin nedenlerinden biri.

### Alternatif ve sınır
- Gerçek WCAG kontrast oranı için OKLCH → sRGB → göreli parlaklık dönüşümü gerekir; bunu bir kütüphane (ör. `culori`) ya da tarayıcının DevTools kontrast denetimi yapar.
- `oklchLightness` okuyamadığı bir değerde hata fırlatıyor. Sessizce 0 döndürseydi bozuk bir token'ı "kontrast sorunu" diye raporlardı ya da gözden kaçırırdı.

### Sıradaki adım
Aynı adlandırma sözleşmesi formda da çalışır: `aria-invalid` durumundaki alanın kenarlığı `--destructive` rolünü kullanır. Sonraki derste form parçalarına geçiyoruz.
