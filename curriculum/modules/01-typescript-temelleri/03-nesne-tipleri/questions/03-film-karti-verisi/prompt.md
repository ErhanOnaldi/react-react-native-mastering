Film kartı bileşenine tüm API yanıtını geçmek yerine yalnızca gereken alanları içeren yalın bir veri nesnesi iletmek istiyoruz. `cardData` fonksiyonu, film nesnesinden kimlik bilgisini ve formatlanmış etiket metnini içeren yeni bir nesne üretmelidir.

## Gereksinimler

- `CardMovie` tipini tanımla ve export et: `id: number`, `title: string`, `vote_average: number`.
- `cardData` fonksiyonu verilen `CardMovie` nesnesini alıp `{ id, label }` şeklinde yeni bir nesne döndürmelidir.
- `label` alanı, `"Başlık (X.X)"` biçiminde olmalı; puan tek ondalık basamağa yuvarlanmalı ve tam sayılarda sondaki sıfır korunmalıdır (ör. `8` → `"8.0"`, `8.437` → `"8.4"`).

## Örnek

| Girdi (`movie`) | Çıktı |
| --- | --- |
| `{ id: 550, title: "Dövüş Kulübü", vote_average: 8.437 }` | `{ id: 550, label: "Dövüş Kulübü (8.4)" }` |
| `{ id: 155, title: "Kara Şövalye", vote_average: 8 }` | `{ id: 155, label: "Kara Şövalye (8.0)" }` |

## Sözleşme

- Dosya: `cardData.ts`
- Tip export: `type CardMovie` (veya `interface CardMovie`)
- Fonksiyon export: `cardData(movie: CardMovie): { id: number; label: string }`
