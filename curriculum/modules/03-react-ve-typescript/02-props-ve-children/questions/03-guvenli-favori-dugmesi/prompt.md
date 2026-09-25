Favori düğmesi form içinde yanlışlıkla submit başlatmamalı. `FavoriteButton` props tipini `Omit<ComponentProps<'button'>, 'type'>` üzerinden türet. Bileşen `type="button"` değerini sabitlesin; `children`, `onClick`, `disabled`, `aria-pressed` gibi doğal props’u gerçek `<button>`a aktar. Örnek: `<FavoriteButton disabled>Favori</FavoriteButton>`.

**Örnek:** Form içindeki `FavoriteButton` tıklanınca `onClick` çalışır, form submit olmaz.
