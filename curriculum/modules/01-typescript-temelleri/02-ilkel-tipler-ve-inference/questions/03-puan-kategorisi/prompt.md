Filmleri puan aralıklarına göre rozetlerle gruplandırmak istiyoruz. `scoreBand` fonksiyonu gelen sayısal puan değerine göre ilgili kategori metnini döndürmelidir.

## Gereksinimler

- Verilen sayısal puan `0` ise `"oy yok"` döndürülmelidir.
- Puan `8` ve üzerinde ise `"yüksek"` döndürülmelidir.
- Diğer tüm geçerli puanlarda (`0`'dan büyük ve `8`'den küçük) `"normal"` döndürülmelidir.

## Örnek

| Girdi (`vote`) | Çıktı |
| --- | --- |
| `0` | `"oy yok"` |
| `8.437` | `"yüksek"` |
| `7.9` | `"normal"` |

## Sözleşme

- Dosya ve export: `scoreBand.ts` → `scoreBand(vote: number): string`
