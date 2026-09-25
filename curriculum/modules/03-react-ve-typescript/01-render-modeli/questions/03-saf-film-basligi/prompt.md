Dövüş Kulübü kartının başlığı, her render’da aynı props için aynı sonucu vermeli. `MovieHeading({ title, year })` bileşenini yaz: `<h2>` içinde `title`, yanındaki `<span>` içinde `year` göster. `year` boşsa span gösterme. Props’u değiştirme. Örnek: `title="Matrix"`, `year="1999"` → “Matrix” başlığı ve “1999” metni.

**Örnek:** `<MovieHeading title="Matrix" year="1999" />` → “Matrix” heading’i ve yanında “1999”; boş yılda yalnız heading.
