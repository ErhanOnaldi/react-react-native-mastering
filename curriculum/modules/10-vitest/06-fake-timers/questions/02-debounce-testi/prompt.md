Arama değerindeki son değişiklik 500 ms boyunca sabit kaldıktan sonra sonuç olarak görünmeli. Daha yeni bir değer gelirse önceki bekleme iptal edilmeli.

## Gereksinimler

- Başlangıç değeri hemen görünmeli.
- Yeni değer 499 ms sonra görünmemeli, 500 ms sonra görünmeli.
- “ba” değerinden 200 ms sonra “başlangıç” gelirse ilk timer’ın eski bitişinde sonuç başlangıç değeri olarak kalmalı.
- Son değişiklikten 500 ms sonra en yeni değer görünmeli.
- Test sonunda gerçek saat geri yüklenmeli.

## Örnek

Zaman çizelgesi: “” → “ba” → 200 ms → “başlangıç” → ilk timer’ın bitişi → son değerden itibaren 500 ms.
İlk timer’ın bitişinde “ba” görünmez; son noktada “başlangıç” görünür.

## Sözleşme

- Yazılacak dosya: useDebounce.test.ts
- Test edilecek modül: @impl/useDebounce
- Hook: useDebounce<T>(value: T, delay: number): T
