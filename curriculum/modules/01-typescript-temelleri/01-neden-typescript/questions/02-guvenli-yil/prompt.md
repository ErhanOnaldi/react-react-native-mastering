Film kartlarında yayın tarihi gösterilirken yanlış yazılmış bir alan adı JavaScript çalışma zamanında sessizce `undefined` üretebilir ve ekranda boş veya bozuk bir etiket bırakabilir. `movieYear` fonksiyonu ile film nesnesinin tarih bilgisini güvenle okuyup görüntüleme yılına dönüştürmelisin.

## Gereksinimler

- Verilen film nesnesinin yayın tarihini oku.
- Tarih alanı dolu bir ISO metniyse (ör. `"1999-10-15"`), ilk 4 karakteri (yıl) döndür.
- Tarih alanı boş metin (`""`) ise `"Tarih yok"` metnini döndür.

## Örnek

| Girdi (`movie`) | Çıktı |
| --- | --- |
| `{ release_date: "1999-10-15" }` | `"1999"` |
| `{ release_date: "" }` | `"Tarih yok"` |

## Sözleşme

- Dosya ve export: `movieYear.ts` → `movieYear(movie: { release_date: string }): string`

## Kısıtlar

- Parametre nesnesinin beklenen alan adı `release_date` olmalıdır.
