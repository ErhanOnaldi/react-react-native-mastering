Film detay route’unun id ve navigasyon davranışlarını sınayan testler yaz.

## Gereksinimler
- `/movie/603` adresinde `Film #603` başlığı görünür.
- “Aramaya dön” bağlantısına tıklanınca `/search` açılır ve “Arama” başlığı görünür.
- `/movie` adresinde “Film seçilmedi” başlığı görünür.

## Örnek
`/movie/603` → `Film #603`; “Aramaya dön” bağlantısına tıkla → `/search` ve “Arama”.

## Sözleşme
- `MovieRoute.test.tsx` dosyasına test yaz.
- Bileşen `@impl/MovieRoute` yolundan import edilir.
- Test route’ları `/movie/:id`, `/movie` ve `/search` adreslerini kapsamalı.
- Başlık heading, dönüş kontrolü link rolüyle bulunur.

## Kısıtlar

- Her iki verilen mutantı da testlerle yakala.
