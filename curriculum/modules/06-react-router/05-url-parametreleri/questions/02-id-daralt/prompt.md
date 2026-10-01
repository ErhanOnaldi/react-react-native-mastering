URL'den gelen film kimliği metindir ve eksik ya da bozuk olabilir. Geçerli pozitif film kimliklerini güvenli bir sayıya dönüştür.

## Gereksinimler

- Pozitif, güvenli tam sayı metninde sayısal id döndür.
- Değer eksik, boş, rakam dışı, sıfır veya güvenli tam sayı sınırının dışındaysa `null` döndür.
- Ondalık ve başında/sonunda başka karakter bulunan girdileri kabul etme.

## Örnek

| Girdi | Çıktı |
| --- | --- |
| `'550'` | `550` |
| `undefined`, `''`, `'5x'`, `'0'` | `null` |
| `'99999999999999999999'` | `null` |

## Sözleşme

- `parseMovieId.ts` → `parseMovieId(id: string | undefined): number | null`.
