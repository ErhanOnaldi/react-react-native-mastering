Etiket seçim hook’u, bir seçeneği tek kez listede tutmalı ve aynı seçeneği yeniden değiştirdiğinde kaldırmalı.

## Gereksinimler
- Başlangıç listesi boştur.
- İlk toggle seçeneği ekler.
- Aynı seçeneği tekrar toggle etmek onu kaldırır.

## Örnek
`[]` → `toggle('Mavi')` → `['Mavi']` → aynı toggle → `[]`.

## Sözleşme
- `useFavoriteIds.test.ts` dosyasına test yaz.
- Hook `@impl/useFavoriteIds` yolundan import edilir ve `toggle(id)` ile `ids` döndürür.
- Her iki mutantın davranışını yakala.
