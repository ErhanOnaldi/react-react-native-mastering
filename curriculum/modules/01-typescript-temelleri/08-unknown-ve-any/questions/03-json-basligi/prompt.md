Ağ üzerinden çekilen JSON verisi (`res.json()`) henüz tipi doğrulanmamış ham bir veridir; film nesnesi yerine bir hata gövdesi (ör. `{ status_code: 7 }`) gelebilir. `readMovieTitle` fonksiyonu, `unknown` olarak gelen ham veriyi güvenle kontrol edip yalnızca geçerli bir film başlığı varsa metin, aksi halde `null` döndürmelidir.

## Gereksinimler

- Gelen değer `null` olmayan bir nesne olmalıdır.
- Nesne içinde `title` alanı bulunmalı ve bu alanın tipi metin (`string`) olmalıdır.
- Bu koşullar sağlanıyorsa başlık metni döndürülmelidir.
- Değer nesne değilse, `null` ise, `title` alanı eksikse veya `title` metin değilse (ör. sayıysa) `null` döndürülmelidir.

## Örnek

| Girdi (`raw`) | Çıktı |
| --- | --- |
| `{ title: "Başlangıç" }` | `"Başlangıç"` |
| `{ status_code: 7 }` | `null` |
| `{ title: 123 }` | `null` |
| `null` | `null` |

## Sözleşme

- Dosya ve export: `readMovieTitle.ts` → `readMovieTitle(raw: unknown): string | null`

## Kısıtlar

- `any` veya `as` ile tip zorlaması yapılmamalıdır; doğrulama çalışma zamanı kontrolleriyle sağlanmalıdır.
