Her render'da aynı props değerleri aynı film başlığını vermeli. Verilen başlık ve yıl bilgisini ekranda okunur biçimde göster.

## Gereksinimler

- `title` bir heading olarak görünmelidir.
- `year` ayrı metin olarak görünmelidir.
- `year` boş string ise yıl metni hiç render edilmemelidir.
- Gelen props değiştirilmemelidir.

## Örnek

`title="Matrix"`, `year="1999"` → “Matrix” heading'i ve yanında “1999”; `year=""` → yalnız “Matrix” heading'i.

## Sözleşme

- Dosya ve export: `MovieHeading.tsx` → named export `MovieHeading`
- Props: `{ title: string; year: string }`
- Arayüz: film başlığı heading olarak, dolu yıl düz metin olarak görünür.
