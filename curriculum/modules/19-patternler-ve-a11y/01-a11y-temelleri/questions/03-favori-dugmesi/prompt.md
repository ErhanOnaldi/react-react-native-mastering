Film kartındaki yıldız düğmesi gözle anlaşılıyor, ama ekran okuyucu yalnızca “düğme” diyor. Düğmeyi klavye ve ekran okuyucu kullanıcılarının da anlayıp kullanabileceği hale getir.

## Gereksinimler
- Gerçek bir `<button type="button">` kalsın (Tab, Enter, Space bedava gelsin).
- Erişilebilir adı her iki durumda da **Favori** olsun.
- Durumu `aria-pressed` ile bildir: favori değilken `false`, favoriyken `true`.
- Görsel yıldızı (`☆` / `★`) `aria-hidden="true"` ile ağaçtan gizle.
- Tıklama, Enter ve Space `onToggle`'ı her seferinde bir kez çağırsın.

## Örnek

| `isFavorite` | Erişilebilir ad | Durum | Görsel |
| --- | --- | --- | --- |
| `false` | Favori | `false` | ☆ |
| `true` | Favori | `true` | ★ |

## Sözleşme

- `FavoriteButton.tsx` içinden named export `FavoriteButton({ isFavorite, onToggle })`.
- `onToggle: () => void`; `isFavorite: boolean`.
- Kontrolün rolü `button`, adı `Favori` olmalı.
