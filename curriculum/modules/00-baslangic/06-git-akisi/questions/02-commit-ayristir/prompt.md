Commit mesajlarını özetleyen bir araç için başlık satırını parçalara ayır. Mesaj beklenen biçimde değilse sonuç üretme.

## Gereksinimler
- Tür, hazır `TYPES` listesindeki değerlerden biri olmalı.
- Kapsam isteğe bağlıdır; yoksa sonuçtaki `scope` değeri `undefined` olsun.
- Kapsam varsa boş olamaz.
- `!` işareti türden sonra veya kapsamdan sonra gelebilir; sonuçta `breaking` değerini buna göre belirle.
- İki nokta üst üste işaretinden sonra tam bir boşluk bulunmalı ve açıklama boş olmamalı. Sonuçtaki açıklamanın başındaki ve sonundaki boşlukları temizle.
- Çok satırlı mesajlarda yalnızca ilk satırı değerlendir.
- Geçersiz biçim, bilinmeyen tür veya boş açıklama için `null` döndür.

## Örnek
| Girdi | Sonuç |
| --- | --- |
| `feat(sinema): puan rozeti ekle` | `{ type: 'feat', scope: 'sinema', breaking: false, subject: 'puan rozeti ekle' }` |
| `fix!: oturum yapısını değiştir` | `{ type: 'fix', scope: undefined, breaking: true, subject: 'oturum yapısını değiştir' }` |
| `düzeltmeler` | `null` |

## Sözleşme
- Dosya ve export: `parseCommit.ts` → `parseCommit(message: string): ParsedCommit | null`.
- `ParsedCommit` alanları: `type: CommitType`, `scope: string | undefined`, `breaking: boolean`, `subject: string`.
- `CommitType`, dosyada tanımlı `TYPES` listesindeki türlerden oluşur.
