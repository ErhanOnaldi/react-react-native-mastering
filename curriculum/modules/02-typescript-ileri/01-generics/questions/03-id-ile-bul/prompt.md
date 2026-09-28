Film ve oyuncu kayıtları farklı alanlar taşısa da her ikisinin sayısal bir kimliği var. Kimliğe göre arama yaparken eşleşen nesnenin tüm alanlarını koru.

## Gereksinimler

- Fonksiyon yalnızca `id: number` alanı olan öğeleri kabul etmeli.
- Eşleşen öğenin kendisi ve tam tipi dönmeli.
- Eşleşme yoksa `undefined` dönmeli.
- Girdi salt okunur dizi olabilir.

## Örnek

`[{ id: 18, name: 'Dram' }]` listesinde `18` aranırsa `{ id: 18, name: 'Dram' }` döner; `3` aranırsa `undefined` döner.

## Sözleşme

- Dosya: `task.ts`
- Export: `findById<T extends { id: number }>(items: readonly T[], id: number): T | undefined`.
