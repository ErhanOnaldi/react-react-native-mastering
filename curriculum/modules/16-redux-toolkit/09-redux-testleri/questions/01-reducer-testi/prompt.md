Bir watchlist reducer’ı toplu film kimliği ekler. Reducer’ın tekrarları atladığını ve eski state’i koruduğunu gösteren testleri yaz.

## Gereksinimler

- Yeni kimlikler girdideki sırayla eklenir.
- Zaten listede olan veya aynı payload içinde daha önce eklenen kimlik yeniden eklenmez.
- Reducer çalıştırılması eski state’i değiştirmez.

## Örnek

Başlangıç `[550]`, payload `[550, 603, 603]` → `[550, 603]`.

## Sözleşme

- Dosya: `bulk.test.ts`
- Test edilecek export: `@impl/bulk` içinden `listSlice` ve `addMany(ids: number[])`
- State biçimi: `{ ids: number[] }`
