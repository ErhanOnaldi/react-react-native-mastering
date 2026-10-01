Favori hook’u, bir film id’sini tek kez listede tutmalı ve aynı id’yi yeniden değiştirdiğinde kaldırmalı.

## Gereksinimler
- Başlangıç listesi boştur.
- İlk toggle film id’sini ekler.
- Aynı id’yi tekrar toggle etmek onu kaldırır.

## Örnek
`[]` → `toggle(550)` → `[550]` → aynı toggle → `[]`.

## Sözleşme
- `useFavoriteIds.test.ts` dosyasına test yaz.
- Hook `@impl/useFavoriteIds` yolundan import edilir; `toggle(id: number)` ile `ids: number[]` döndürür.
- Her iki mutantın davranışını yakala.
