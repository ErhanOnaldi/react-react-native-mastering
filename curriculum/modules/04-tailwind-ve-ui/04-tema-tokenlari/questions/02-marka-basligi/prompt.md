Sinema'nın marka başlığı farklı sayfalarda aynı tipografi ve tema rengini kullansın; çağıran ekran ek class da ekleyebilsin.

## Gereksinimler
- Başlık `<h2>` olarak render edilsin ve çocuk metnini göstersin.
- Sabit class'lar `font-display text-brand-700 dark:text-brand-300` olsun.
- Dışarıdan gelen `className` kaybolmasın.
- Gelen class `cn` ile birleştirilsin ki aynı Tailwind özelliğindeki son değer geçerli olsun.

## Örnek
`Sinema` çocuk metni ve `text-rose-700` ek class'ı verildiğinde son renk class'ı başlığın rengini değiştirir.

## Sözleşme
- Dosya ve export: `BrandHeading.tsx` → `BrandHeading({ children, className })`.
- Önizleme marka başlığını ve utility class'larını gösterir.
