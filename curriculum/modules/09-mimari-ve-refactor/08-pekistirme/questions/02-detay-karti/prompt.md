Film detay görünümünde afiş olsun ya da olmasın aynı başlık ve açıklamayı göster; afiş kararını ayrı kullanılabilir bir bileşende sun.

## Gereksinimler

- Başlık `<h2>` ve açıklama `<p>` içinde gösterilsin.
- `poster_path` doluysa doğru TMDB görsel URL'sine sahip `img` ve film başlığına eşit alt metin gösterilsin.
- `poster_path` null ise kırık görsel gösterilmesin.
- Başlık ve açıklama görünümü tek noktada tanımlansın.

## Örnek

`poster_path: '/poster.jpg'` için görsel adresi `https://image.tmdb.org/t/p/w185/poster.jpg` olur. `poster_path: null` için başlık ve açıklama kalır, görsel yoktur.

## Sözleşme

- `MovieSummary.tsx` → named export `MovieSummary({ movie })`; film alanları `title`, `overview`, `poster_path`.
- `MoviePoster.tsx` → named export `MoviePoster({ title, path })`; `path` değeri string veya null.
- Başlık seviyesi 2; görsel accessible name'i film başlığı.
