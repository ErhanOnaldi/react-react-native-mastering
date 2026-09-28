Detaydan aramaya dönerken kullanıcının önceki filtreli arama adresi korunmalı. Bilinen bir hedef bağlantı, geçmişe dönüş ise ayrı bir kullanıcı eylemi olarak sunulsun.

## Gereksinimler

- `Ara` adlı bağlantının hedefi `/search` olsun.
- `Aramaya dön` düğmesi önceki history adresine dönsün.
- Test başlangıç geçmişinde `/search?q=Matrix&page=2` adresi `/movie/550` adresinden önce bulunur.

## Örnek

`/search?q=Matrix&page=2` → `/movie/550` → `Aramaya dön` → `/search?q=Matrix&page=2`.

## Sözleşme

- `MovieNavigation.tsx` içinden `MovieNavigation` named export edilir.
- Ekranda `Ara` linki ve `Aramaya dön` düğmesi bulunur.
