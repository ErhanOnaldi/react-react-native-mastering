Bir ekran seçili listedeki hangi kayıtların favori olduğunu, liste sırasını koruyarak göstermeli.

## Gereksinimler

- Sonuç, seçili listede bulunan favori kimliklerinden oluşur.
- Çıktı seçili listenin sırasını korur.
- Aynı state referanslarıyla tekrar çağrıldığında aynı sonuç dizisi referansı döner.
- Favori girdisi değiştiğinde sonuç yeniden hesaplanır.

## Örnek

Favoriler `[550, 155]`, seçili liste `[603, 550]` ise sonuç `[550]` olur.

## Sözleşme

- Dosya: `overlap.ts`
- Export: `State`, `selectOverlap(state: State): number[]`
- `State`: `{ favorites: { ids: number[] }; watchlists: { selectedIds: number[] } }`
