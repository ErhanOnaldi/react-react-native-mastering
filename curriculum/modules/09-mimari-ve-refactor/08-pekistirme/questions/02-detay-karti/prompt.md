Film detayında poster olan ve olmayan veri için iki ayrı kart JSX’i var. İkisi de çalışıyor. Başlık stilini değiştirince ikinci dal eski kalıyor.

## Önce gözlemle

Davranış testleri starter’da yeşil. Yapısal test ortak başlık kullanımını, rubric okunurluğu denetler.

## İstenen

`MovieSummary({ movie })` davranışını koru:

- Her durumda `<h2>` içinde film başlığı ve `<p>` içinde açıklama.
- `poster_path` varsa `img` göster; `alt` film başlığı olsun.
- Poster yoksa kırık `img` üretme.
- Ortak başlık ve açıklama JSX’i yalnız bir kez yazılsın.
- `MoviePoster.tsx` içinde `MoviePoster({ title, path })` export et. Poster kararını buraya taşı ve `MovieSummary` içinde kullan.

Bu görev API çağrısı yapmaz; görünüm sınırını temizler.
