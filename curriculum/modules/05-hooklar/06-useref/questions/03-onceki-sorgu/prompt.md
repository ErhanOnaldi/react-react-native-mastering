Arama metni değiştiğinde ekranda bir önceki sorgu da gösterilsin. İlk render'da önceki değer olmadığı açıkça yazmalı.

## Gereksinimler

- İlk render'da `Önceki: yok` metni görünür.
- Yeni `query` prop'u geldiği render'da bir önceki query görünür.
- Şimdiki query önceki değer olarak aynı render içinde yazılmamalı.

## Örnek

`query="Matrix"` ile ilk render → `Önceki: yok`. Aynı bileşen `query="Dövüş"` ile yeniden render edilir → `Önceki: Matrix`.

## Sözleşme

- Dosya ve export: `PreviousQuery.tsx` → `PreviousQuery`
- Prop: `{ query: string }`
- Testler `Önceki: ...` metnini arar.
