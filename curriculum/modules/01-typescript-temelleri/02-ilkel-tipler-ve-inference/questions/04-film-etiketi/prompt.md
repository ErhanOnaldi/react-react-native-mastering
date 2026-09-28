Film kartı üzerinde izleyici kitlesi ve tek ondalıklı puan bilgisini birleştiren bir etiket rozeti oluşturmak istiyoruz. `movieBadge` fonksiyonu hedef kitleyi ve yuvarlanmış puanı aralarında ` · ` olacak şekilde tek bir metne dönüştürmelidir.

## Gereksinimler

- `adult` parametresi `true` ise kitle metni `"18+"`, `false` ise `"Genel"` olmalıdır.
- Sayısal puan tek ondalık basamağa yuvarlanmalı ve tam sayılarda sondaki sıfır korunmalıdır (ör. `8` → `"8.0"`, `7.456` → `"7.5"`).
- Kitle ve puan metinleri `" · "` (boşluk, nokta işareti, boşluk) ile birleştirilmelidir.

## Örnek

| Girdi (`vote`, `adult`) | Çıktı |
| --- | --- |
| `(7.456, false)` | `"Genel · 7.5"` |
| `(8, true)` | `"18+ · 8.0"` |

## Sözleşme

- Dosya ve export: `movieBadge.ts` → `movieBadge(vote: number, adult: boolean): string`
