Film kartının tipi elle yazılmış ve `Movie`'den farklı. Bu yüzden film listesini kartlara çeviren `cardLines` derlenmiyor. Kartın tipini `Movie`'ye bağla ve posteri olmayan filmleri kartta belirt.

## Gereksinimler

- `MovieCardData` elle kopyalanmamalı, `movie.ts`'teki `Movie` tipinden türetilmeli. Yalnızca `id`, `title`, `poster_path` ve `vote_average` alanlarını, `Movie`'deki tipleriyle taşımalı.
- `cardLines`, `Movie` listesini kabul etmeli ve derlenmeli.
- `cardLine` yalnızca bu dört alanı içeren bir nesneyle de çağrılabilmeli.
- Satır biçimi: `<başlık> · <puan>`. Puan tek ondalık basamakla yazılır.
- Poster yoksa (`poster_path` değeri `null` ise) satırın sonuna ` · poster yok` eklenmeli.

## Örnek

| Girdi | Çıktı |
| --- | --- |
| `{ title: 'Kara Şövalye', poster_path: '/p.jpg', vote_average: 8.52, … }` | `"Kara Şövalye · 8.5"` |
| `{ title: 'Dövüş Kulübü', poster_path: null, vote_average: 8.438, … }` | `"Dövüş Kulübü · 8.4 · poster yok"` |

## Sözleşme

- Dosya: `task.ts`. `movie.ts` salt okunurdur.
- Export tipi: `MovieCardData`.
- Export fonksiyonlar: `cardLine(movie: MovieCardData): string`, `cardLines(movies: Movie[]): string[]`.
