Arama kutusunda her tuş vuruşu hemen arama başlatmamalı. `useDebounce`, gelen değerin son kararlı halini belirli bir sessizlik süresinden sonra döndürsün.

## Gereksinimler

- İlk değer beklemeden döner.
- Değer hızlı değişirse gecikme bitmeden eski kararlı değer korunur.
- Gecikme tamamlandığında yalnızca son değer döner.
- Yeni değer geldiğinde önceki bekleyen iş temizlenir.

## Örnek

`"M"` ile başla; `"Ma"` yaz, 200 ms bekle; `"Mat"` yaz, 300 ms gecikmenin 299 ms'si dolduğunda hâlâ `"M"` görünür. 1 ms daha geçince `"Mat"` döner.

## Sözleşme

- Dosya ve export: `useDebounce.ts` → `useDebounce<T>(value: T, delay: number): T`
- Testler hook'u `renderHook` ve fake timer ile çalıştırır.
