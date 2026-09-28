Filmlerin başlık ve varsa slogan (tagline) bilgilerini birleştirerek kısa bir özet metni oluşturmak istiyoruz. API'den gelen veride poster alanı `null` olabileceği gibi slogan alanı da hiç bulunmayabilir.

## Gereksinimler

- `MovieSummary` arayüzünü tanımla:
  - `id`: salt okunur (`readonly`) sayı
  - `title`: metin
  - `poster_path`: metin veya `null`
  - `tagline`: opsiyonel metin
- `summary` fonksiyonu, verilen film nesnesinde slogan varsa `"Başlık — Slogan"` (arada uzun tire `—` ve boşluklar) formatında birleştirilmiş metin döndürmelidir.
- Slogan tanımlı değilse veya eksikse yalnızca film başlığı döndürülmelidir.
- `poster_path` alanının `null` veya dolu olması özet metnini etkilememelidir.

## Örnek

| Girdi (`movie`) | Çıktı |
| --- | --- |
| `{ id: 550, title: "Dövüş Kulübü", poster_path: null, tagline: "İlk kural" }` | `"Dövüş Kulübü — İlk kural"` |
| `{ id: 550, title: "Dövüş Kulübü", poster_path: null }` | `"Dövüş Kulübü"` |

## Sözleşme

- Dosya: `movieSummary.ts`
- Tip export: `interface MovieSummary`
- Fonksiyon export: `summary(movie: MovieSummary): string`
