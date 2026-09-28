Film özetinin mevcut çıktısını korurken tarih biçimlendirme kuralını tek, yeniden kullanılabilir bir birime çıkar.

## Gereksinimler

- `trending`, `favorite` ve `search` için mevcut etiket, film adı ve yıl çıktıları aynen korunmalı.
- Boş tarih her türde `Tarih yok` olarak görünmeli.
- Etiket seçimi her üç türü kapsamalı; son cümle biçimi dallarda tekrarlanmamalı.
- Dolu ve boş tarih ayrı ayrı biçimlendirilebilmeli.

## Örnek

| Tür | Film | Tarih | Çıktı |
| --- | --- | --- | --- |
| `trending` | Matrix | `1999-03-31` | `Trend · Matrix · 1999` |
| `favorite` | Dövüş Kulübü | boş | `Favori · Dövüş Kulübü · Tarih yok` |
| `search` | Başlangıç | `2010-07-16` | `Arama · Başlangıç · 2010` |

## Sözleşme

- `describeMovie.ts` → named export `describeMovie(movie, kind)`; film alanları `title` ve `release_date`, tür union'ı `trending | favorite | search`.
- `formatMovieYear.ts` → named export `formatMovieYear(releaseDate: string): string`.

## Kısıtlar

- Dosyaların ikisi de `files` sözleşmesine göre mevcut dış sonucu vermeli.
