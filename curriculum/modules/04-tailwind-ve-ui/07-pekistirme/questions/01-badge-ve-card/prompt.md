Puan etiketi ve içerik kartı farklı ekranlarda tekrar kullanılabilsin; çağıran içerik ekleyebilsin ve kendi HTML niteliklerini iletebilsin.

## Gereksinimler
- `Badge` bir `<span>`, `Card` bir `<article>` döndürsün ve çocuk içeriğini göstersin.
- Badge class'ları `rounded-full bg-sky-100 px-2`; Card class'ları `rounded-xl border p-4` olsun.
- Dış `className` temel class'larla çakıştığında override etsin.
- `data-*` nitelikleri doğru öğeye aktarılsın.

## Örnek
Card içinde başlık ve `8.4` Badge'i verildiğinde puan kartın içinde görünür. Card'a `p-8` verilince `p-4` yerine o değer kalır.

## Sözleşme
- Dosya ve export: `UiPieces.tsx` → `Badge` (`span`) ve `Card` (`article`).
- Her iki bileşen `children`, native element props'ları ve `className` alır.
- Önizlemede Badge'i kartın içinde görürsün.
