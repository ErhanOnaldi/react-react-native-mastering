Sinema'nın marka başlığı farklı sayfalarda aynı tipografi ve tema rengini kullansın; çağıran ekran ek class da ekleyebilsin.

## Gereksinimler
- Başlık `<h2>` olarak render edilsin ve çocuk metnini göstersin.
- `font-display`, `text-brand-700` ve `dark:text-brand-300` class'ları bulunsun.
- Dışarıdan gelen `className` kaybolmasın.

## Örnek
`Sinema` çocuk metni ve `text-2xl` ek class'ı verildiğinde ikisi aynı h2 üzerinde görünür.

## Sözleşme
- Dosya ve export: `BrandHeading.tsx` → `BrandHeading({ children, className })`.
- Önizleme marka başlığını ve utility class'larını gösterir.
