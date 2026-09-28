Ham API verisindeki null posterler ve boş tarihler arayüz bileşenlerinde doğrudan kullanıldığında kırılganlığa yol açar. `normalizeMovie` fonksiyonu, ham bir film nesnesini alıp arayüzde doğrudan gösterilebilecek güvenli ve temiz bir kart veri nesnesine dönüştürmelidir.

## Gereksinimler

- `RawMovie` tipini tanımla ve export et:
  - `id`: sayı
  - `title`: metin
  - `release_date`: metin
  - `poster_path`: metin veya `null`
- `DisplayMovie` tipini tanımla ve export et:
  - `id`: sayı
  - `title`: metin
  - `year`: metin
  - `poster`: metin veya `null`
- `normalizeMovie` fonksiyonu:
  - `id` ve `title` alanlarını olduğu gibi aktarmalıdır.
  - `release_date` dolu ise ilk 4 karakterini (yıl), boş (`""`) ise `"Tarih yok"` metnini `year` alanına atamalıdır.
  - `poster_path` `null` veya boş metin (`""`) ise `poster` alanına `null`, dolu bir yol ise aynı yolu aktarmalıdır.
- Orijinal girdi nesnesi mutasyona uğratılmamalı, yeni bir nesne döndürülmelidir.

## Örnek

| Girdi (`movie`) | Çıktı |
| --- | --- |
| `{ id: 550, title: "Dövüş Kulübü", release_date: "1999-10-15", poster_path: "/x.jpg" }` | `{ id: 550, title: "Dövüş Kulübü", year: "1999", poster: "/x.jpg" }` |
| `{ id: 1, title: "Yeni film", release_date: "", poster_path: null }` | `{ id: 1, title: "Yeni film", year: "Tarih yok", poster: null }` |
| `{ id: 2, title: "Film", release_date: "2026-01-01", poster_path: "" }` | `{ id: 2, title: "Film", year: "2026", poster: null }` |

## Sözleşme

- Dosya: `normalizeMovie.ts`
- Tip export'ları: `type RawMovie`, `type DisplayMovie` (veya interface)
- Fonksiyon export: `normalizeMovie(movie: RawMovie): DisplayMovie`

## Kısıtlar

- Parametre olarak gelen `movie` nesnesinin alanları doğrudan değiştirilmemelidir.
