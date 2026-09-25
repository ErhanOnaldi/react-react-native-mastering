Çalışan kodda aynı `release_date` mantığı üç dalda duruyor. Yarın boş tarih metni değişince bir dal unutulabilir.

## Önce gözlemle

Starter’ı çalıştır: **davranış testleri baştan yeşil**. Son yapısal kontrol tekrarın azaltılmasını ister.

## İstenen

`describeMovie(movie, kind)` çıktıları **aynen** kalsın:

| kind | Örnek çıktı |
| --- | --- |
| `trending` | `Trend · Matrix · 1999` |
| `favorite` | `Favori · Matrix · 1999` |
| `search` | `Arama · Matrix · 1999` |

Boş tarih `Tarih yok` olur. Yıl mantığını `formatMovieYear.ts` içindeki `formatMovieYear(releaseDate)` fonksiyonuna çıkar ve `describeMovie` içinde kullan. Son cümleyi tek yerde kur. Farklı etiketler için açık bir eşleme veya küçük koşul seçebilirsin.
