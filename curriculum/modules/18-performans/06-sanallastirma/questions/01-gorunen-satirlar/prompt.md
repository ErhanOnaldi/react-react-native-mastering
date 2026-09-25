## Durum
500 filmin hepsi DOM'da. Ekranda yaklaşık 6 satır görünürken tarayıcı 500 satırın yerleşimini yapıyor.

## Yap
- `@tanstack/react-virtual` içindeki `useVirtualizer` ile yalnız görünür satırları render et.
- Dış kaydırma alanı **240 px**, satır tahmini **40 px**, `overscan` **3** olsun.
- İç alan `getTotalSize()` kadar yüksek kalsın; satırlar `virtualItem.start` ile yerleşsin.
- Satır kimliği film `id` olsun. `initialRect` test ve ilk önizleme için `{ width: 320, height: 240 }` olabilir.

Önizlemede 500 filmde de az sayıda gerçek DOM satırı görmelisin.
