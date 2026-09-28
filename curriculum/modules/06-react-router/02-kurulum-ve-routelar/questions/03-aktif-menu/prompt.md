Sinema menüsünde kullanıcı hangi sayfada olduğunu anlayabilmeli. Ana sayfa bağlantısı arama sayfasındayken etkin görünmemeli.

## Gereksinimler

- Menüde `Ana sayfa` ve `Ara` bağlantıları olsun.
- `/` adresinde yalnızca `Ana sayfa` bağlantısında `aria-current="page"` bulunsun.
- `/search` adresinde yalnızca `Ara` bağlantısında `aria-current="page"` bulunsun.

## Örnek

`/search` açıldığında Ara etkin, Ana sayfa etkin değil.

## Sözleşme

- `Menu.tsx` içinden `Menu` named export edilir.
- Route'lar `/` ve `/search` adreslerinde aynı menüyü render eder.
