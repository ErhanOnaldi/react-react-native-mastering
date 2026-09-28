Kullanıcı `Aramaya geç` düğmesine bastığında imleç film arama alanına taşınmalı. Bu, klavyeyle hemen yazmaya devam etmeyi sağlar.

## Gereksinimler

- Ekranda `Aramaya geç` adlı bir button bulunur.
- Ekranda `Film ara` adlı bir textbox bulunur.
- Button tıklandığında odak `Film ara` textbox'ına geçer.

## Örnek

Kullanıcı düğmeye basar → `document.activeElement` film arama input'u olur.

## Sözleşme

- Dosya ve export: `SearchFocus.tsx` → `SearchFocus`
- Testler `button` ve `textbox` rollerini erişilebilir adlarıyla bulur.
