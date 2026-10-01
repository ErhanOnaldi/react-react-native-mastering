Bir film başlığı ve çıkış yılını ayrı gösteren `MovieHeading` bileşenini yaz. Yıl boşsa başlık tek başına kalsın.

## Gereksinimler

- Film başlığı heading olarak görünmelidir.
- Dolu `year` ayrı metin olarak görünmelidir.
- `year` boşsa yıl metni render edilmemelidir.
- Props değiştirilmemelidir.

## Örnek

`title="Matrix"`, `year="1999"` → “Matrix” heading'i ve “1999”; `year=""` → yalnız “Matrix”.

## Sözleşme

- Dosya ve export: `MovieHeading.tsx` → named export `MovieHeading`
- Props: `{ title: string; year: string }`
