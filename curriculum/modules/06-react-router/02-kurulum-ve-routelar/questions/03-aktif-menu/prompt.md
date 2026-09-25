Sinema menüsündeki düz `Link`ler hedefe götürüyor ama hangi sayfada olduğunu göstermiyor. Kök link, `/search` açıkken de etkin sanılmamalı.

## Görev

`Menu.tsx` içinde Ana sayfa (`/`) ve Ara (`/search`) linklerini `NavLink` yap. Ana sayfa linki yalnızca tam kök adreste etkin olsun. Ekran okuyucu `aria-current="page"` ile bunu anlar; NavLink bunu kendisi ekler.
