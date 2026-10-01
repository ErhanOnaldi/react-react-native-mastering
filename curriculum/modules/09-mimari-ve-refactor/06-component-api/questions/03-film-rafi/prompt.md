Başlığı ve içeriği çağrı yerinden alan açılır bir bölüm oluştur. Açık/kapalı değerinin tek sahibi çağrı yeri olsun.

## Gereksinimler

- Başlığı `<button>` ile göster; düğme bir `<section>` içinde bulunsun.
- Bölüm açıksa `children` görünür, kapalıysa gizli olsun.
- `open` değeri görünümü belirlesin; tıklama `onOpenChange`'e yeni değeri bildirsin, prop değişene kadar görünüm değişmesin.
- `aria-expanded` gerçek açık durumunu bildirsin.

## Örnek

`open={false}` verilen “Favoriler” bölümü tıklanınca sahibine `true` önerir; içerik ancak sahibi `open` değerini `true` yapınca görünür.

## Sözleşme

- Dosya ve export: `MovieShelf.tsx` → named export `MovieShelf`.
- Props: `title: string`, `children: ReactNode`, `open: boolean`, `onOpenChange: (open: boolean) => void`.
- Başlık düğmesinin accessible name'i `title` değeridir.
