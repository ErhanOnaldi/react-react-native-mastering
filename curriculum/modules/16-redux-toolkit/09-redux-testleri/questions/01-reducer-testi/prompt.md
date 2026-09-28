Toplu kayıt ekleme kuralı, tekrarları atlayıp eski state’i korumalı.

## Gereksinimler

- Yeni kimlikler girdideki sırayla eklenir.
- Zaten listede olan veya aynı payload içinde daha önce eklenen kimlik yeniden eklenmez.
- Reducer çalıştırılması eski state’i değiştirmez.

## Örnek

Başlangıç `[550]`, payload `[550, 603, 603]` → `[550, 603]`.

## Sözleşme

- Dosya: `bulk.ts`
- Export: `listSlice`, `addMany(ids: number[])`
- State biçimi: `{ ids: number[] }`
