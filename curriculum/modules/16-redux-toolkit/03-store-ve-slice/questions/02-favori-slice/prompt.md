Bir kullanıcı aynı kayıt üzerinde tekrar tekrar seçim yapabilir. Seçim eklenmeli veya kaldırılmalı; diğer kayıtlar korunmalı.

## Gereksinimler

- 550 kimliği ilk işlemde listeye eklenir; aynı kimlik tekrar işlendiğinde çıkarılır.
- Başka kimlikler eklenip çıkarılmaz.
- Kök state’ten seçim listesini okuyan selector doğru ID dizisini döndürür.
- Önceki state nesnesi ve dizisi değişmeden kalır.

## Örnek

`550` üzerinde işlem: `[] → [550] → []`. Başlangıç `[155]` iken `603` eklemek `[155, 603]` üretir.

## Sözleşme

- Dosya: `favorites.ts`
- Export: `favoritesSlice`, `toggleFavorite(id: number)`, `selectFavoriteIds`
- Kök state biçimi: `{ favorites: { ids: number[] } }`
