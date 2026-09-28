Film kartlarında TMDB'den gelen ham puan değerini tek ondalıklı ve kullanıcı dostu bir metin olarak göstermek istiyoruz.

## Gereksinimler

- Verilen puan değeri tek basamaklı ondalık sayıya yuvarlanmalıdır.
- Tam sayılarda virgülden sonraki sıfır korunmalıdır (örneğin `8` girdiğinde `"8.0"` üretilmelidir).
- Puan değeri `0` olduğunda `"Henüz oy yok"` metni dönmelidir.

## Örnek

| Girdi | Çıktı |
| --- | --- |
| `7.456` | `"7.5"` |
| `8` | `"8.0"` |
| `0` | `"Henüz oy yok"` |

## Sözleşme

- Dosya ve export: `formatVote.ts` → `export function formatVote(voteAverage: number): string`
