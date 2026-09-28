Sinema'nın poster kartında başlık ve puan görsel olarak ayırt edilmiyor. İçeriği başlık ve puan için anlamlı HTML öğeleriyle düzenle ve kartı okunur hale getir.

## Gereksinimler
- Kart tek bir `<article>` içinde gösterilsin.
- Film başlığı bir `<h2>`, puan ayrı bir `<span>` olsun.
- Kart `rounded-xl border p-4`; başlık `font-semibold`, puan `text-sm` class'larını taşısın.

## Örnek
`Başlangıç` başlığı ve `8.1` puanı bulunan kartta başlık kalın, puan küçük yazılır.

## Sözleşme
- Dosya ve export: `PosterTile.tsx` → `PosterTile` bileşeni; mevcut `title` ve `score` props'larını kullanır.
- Önizlemede kartı açıp başlık ve puan düzenini görürsün.
