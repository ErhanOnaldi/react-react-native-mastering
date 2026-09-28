500 filmlik büyük bir veri kümesi listelenirken ekranda aynı anda yalnızca yaklaşık 6 satır görünmesine rağmen yüzlerce DOM düğümünün oluşturulması tarayıcı yerleşimini yavaşlatıyor. Yalnızca görünür alanı ve küçük bir tamponu DOM'da tutan sanallaştırılmış bir liste oluşturmak istiyorsun.

## Gereksinimler
- Dış kaydırma kapsayıcısını **240 px** sabit yükseklik ve taşmayı kaydıran (`overflow: 'auto'`) biçimde kur.
- Yalnızca ekranda görünen satırları ve küçük bir önbellek tamponunu (overscan: 3) DOM içine bas. 500 film için DOM'da bulunan toplam satır (`role="listitem"`) sayısı **30'dan az** olmalıdır.
- İç liste alanı (`role="list"`), listenin tamamı DOM'daymış gibi toplam sanal yüksekliği (`getTotalSize()`) korumalıdır.
- Her bir satır tahmini **40 px** yükseklikte olmalı ve satırlar `translateY` ile mutlak konumlandırılmalıdır (`position: 'absolute'`).
- Satır kimliği (key) olarak film `id` değeri kullanılmalıdır.
- İlk filmin başlığı ("Dövüş Kulübü") ekranda görünür olmalıdır.

## Örnek
500 öğelik dizi verildiğinde kaydırma çubuğunun yüksekliği yaklaşık 20.000 pikseldir; ancak sayfada yalnızca 10–15 adet gerçek DOM elementi bulunur. Kullanıcı aşağı kaydırdıkça eski satırlar DOM'dan çıkar, yenileri girer.

## Sözleşme
- Dosya ve export: `VirtualMovies.tsx` → `VirtualMovies({ movies }: { movies: Movie[] })`
- Tip tanımı:
  ```ts
  export interface Movie {
    id: number
    title: string
  }
  ```
- Arayüz: `role="list"` içinde `role="listitem"` elementleri.
