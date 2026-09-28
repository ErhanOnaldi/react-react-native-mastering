Aynı filme bakan iki favori düğmesi ortak durumu okumalı. Birinden yapılan ekleme veya çıkarma diğer düğmede de hemen görünmeli.

## Gereksinimler

- İlk durumda düğmeler `Favoriye ekle` metnini gösterir.
- Bir düğmeye basınca aynı id'ye bakan tüm tüketiciler `Favoriden çıkar` durumuna geçer.
- Tekrar basınca tüm tüketiciler `Favoriye ekle` durumuna döner.
- Id listesi güncellenirken mevcut dizi değiştirilmez; yeni dizi üretilir.

## Örnek

İki `<FavoriteToggle id={550} />` aynı provider altında render edilir. İlk düğmeye tıklayınca iki düğmenin metni de `Favoriden çıkar` olur.

## Sözleşme

- Dosya ve export: `FavoriteToggle.tsx` → `Provider`, `FavoriteToggle`
- `FavoriteToggle` prop'u: `{ id: number }`
- Testler button rolünü `Favoriye ekle` ve `Favoriden çıkar` adlarıyla arar.
