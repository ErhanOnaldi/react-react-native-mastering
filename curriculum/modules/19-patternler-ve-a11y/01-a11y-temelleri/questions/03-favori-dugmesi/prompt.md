Film kartındaki yıldız düğmesi gözle anlaşılıyor, ama ekran okuyucu yalnızca “düğme” diyor. Önizlemede Tab ile düğmeye gel: odak halkası var, anlamı yok.

## Görev
`FavoriteButton({ isFavorite, onToggle })` bileşenini düzelt. Bu düğme bir **toggle**; derste gördüğün “sabit ad + durum” yolunu kullan.

## Gereksinimler
- Gerçek bir `<button type="button">` kalsın (Tab, Enter, Space bedava gelsin).
- Erişilebilir adı her iki durumda da **Favori** olsun.
- Durumu `aria-pressed` ile bildir: favori değilken `false`, favoriyken `true`.
- Görsel yıldızı (`☆` / `★`) `aria-hidden="true"` ile ağaçtan gizle.
- Tıklama, Enter ve Space `onToggle`'ı her seferinde bir kez çağırsın.

| `isFavorite` | Ad | `aria-pressed` | Görsel |
| --- | --- | --- | --- |
| `false` | Favori | `false` | ☆ |
| `true` | Favori | `true` | ★ |
