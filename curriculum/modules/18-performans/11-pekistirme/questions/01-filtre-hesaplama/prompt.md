Bir katalog aramasında pahalı filtre, ilgisiz sayaç güncellendiğinde yeniden çalışıyor. Arama inputu anında güncel kalsın; liste doğru sorguya göre güncellensin ve ilgisiz sayaç filtreyi yeniden çalıştırmasın.

## Gereksinimler
- Input güncel sorgu state'ine bağlı olmalı.
- Liste güncellenmesi input etkileşimini gereksiz yere kilitlememeli.
- Filtre yalnız başlıklar, liste sorgusu veya filtre fonksiyonu değişince yeniden çalışmalı.
- Sayaç artışında verilen filter fonksiyonunun çağrı sayısı değişmemeli.
- Arama değiştiğinde eşleşen başlıklar gösterilmeli.

## Örnek
Başlangıçta üç başlık görünür. Sayaç tıklanınca filtre çağrısı sayısı sabit kalır. Arama alanına Matrix yazınca listede yalnız Matrix görünür.

## Sözleşme
- Dosya ve export: SearchMetrics.tsx → SearchMetrics({ titles, filter })
- Props: titles: string[], filter: (titles: string[], query: string) => string[]
- Arayüz: Film ara etiketli textbox, Sayaç adlı düğme ve sonuç listesi (li öğeleri).
