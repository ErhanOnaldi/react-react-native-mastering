# Effect’in film kimliğini izle

Sinema detayında route kimliği değiştiğinde tarayıcı başlığı ve sayfadaki film kimliği güncellenmeli. Var olan bileşende bu ilişkiyi düzelt.

## Gereksinimler

- Effect içindeki güncelleme render’dan gelen `id` değerini kullanmaya devam etmelidir.
- `id` değiştiğinde effect’in yeniden çalışacağı doğru biçimde bildirilmelidir.
- Lint hatası kalmamalı; `<h1>` içindeki `Film {id}` çıktısı korunmalıdır.

## Örnek

İlk `id`: `550` → başlık `Film 550`; sonraki `id`: `155` → effect yeni değeri kullanır ve başlık `Film 155` olur.

## Sözleşme

- Dosya: `detailsSource.ts` içindeki `detailsSource` adlı string dışa aktarımı.
- String, lint edilecek TSX bileşen kaynağını tutar; bileşen `MovieDetails`, prop `id` adını kullanır.

## Kısıtlar

- Effect içindeki `document.title` atamasını ve `<h1>` çıktısını kaldırma.
