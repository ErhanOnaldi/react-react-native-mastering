İçeriği çağrı yerinden alan açılır bir bölüm oluştur. Kendi durumunu yöneten ve dışarıdan yönetilen kullanım desteklensin.

## Gereksinimler

- Başlığı `<button>` ile göster; düğme bir `<section>` içinde bulunsun.
- Bölüm açıksa `children` görünür, kapalıysa gizli olsun.
- `open` verilmişse dış değer görünümü belirlesin; tıklama `onOpenChange`'e yeni değeri bildirsin, prop değişene kadar görünüm değişmesin.
- `open` verilmemişse iç durum `defaultOpen ?? false` ile başlasın; tıklama iç durumu ve varsa callback'i güncellesin.
- `aria-expanded` gerçek açık durumunu bildirsin.

## Örnek

`defaultOpen` verilen “Trend” bölümü ilk açılışta içeriğini gösterir. `open={false}` verilen “Favoriler” bölümü tıklanınca sahibine `true` önerir; içerik ancak `open` sonradan `true` olursa görünür.

## Sözleşme

- Dosya ve export: `MovieShelf.tsx` → named export `MovieShelf`.
- Props: `title: string`, `children: ReactNode`, `open?: boolean`, `defaultOpen?: boolean`, `onOpenChange?: (open: boolean) => void`.
- Başlık düğmesinin accessible name'i `title` değeridir.
