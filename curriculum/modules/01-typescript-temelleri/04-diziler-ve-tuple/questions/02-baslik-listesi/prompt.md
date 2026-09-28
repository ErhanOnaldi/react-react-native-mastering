Öne çıkan filmler listesinde yalnızca görseli hazır olan filmleri göstermek istiyoruz. `movieTitles` fonksiyonu, film listesindeki posteri bulunan filmleri seçip bu filmlerin başlıklarını orijinal sırasıyla bir metin dizisi olarak döndürmelidir.

## Gereksinimler

- `ListMovie` tipini tanımla ve export et: `title: string`, `poster_path: string | null`.
- `movieTitles` fonksiyonu verilen `ListMovie[]` dizisini almalı ve `string[]` döndürmelidir.
- `poster_path` alanı `null` olmayan filmler filtrelenmeli ve yalnızca başlıkları (`title`) sırayla toplanmalıdır.
- Verilen dizi boşsa boş dizi (`[]`) döndürülmelidir.
- Orijinal girdi dizisi değiştirilmemeli (mutasyona uğratılmamalı), yeni bir dizi üretilmelidir.

## Örnek

| Girdi (`movies`) | Çıktı |
| --- | --- |
| `[{ title: "Dövüş Kulübü", poster_path: "/x.jpg" }, { title: "İsimsiz", poster_path: null }, { title: "Başlangıç", poster_path: "/y.jpg" }]` | `["Dövüş Kulübü", "Başlangıç"]` |
| `[]` | `[]` |

## Sözleşme

- Dosya: `movieTitles.ts`
- Tip export: `type ListMovie` (veya `interface ListMovie`)
- Fonksiyon export: `movieTitles(movies: ListMovie[]): string[]`

## Kısıtlar

- Girdi dizisi üzerinde `.splice()` veya doğrudan eleman silme gibi mutasyon yaratan işlemler yapılmamalıdır.
