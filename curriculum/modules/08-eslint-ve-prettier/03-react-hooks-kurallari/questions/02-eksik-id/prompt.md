# Effect’in film kimliğini izle

Sinema detayında film kimliği değiştiğinde tarayıcı sekmesinin başlığı da güncellenmeli. `MovieDetails` bileşenini bu davranışı sağlayacak biçimde tamamla.

## Gereksinimler

- Bileşen her render’da bir Effect çağırmalıdır.
- Effect `document.title` değerini `Film {id}` biçiminde güncellemeli ve `id` değiştiğinde yeniden çalışmalıdır.
- Lint hatası kalmamalı; `<h1>` içindeki `Film {id}` çıktısı korunmalıdır.

## Örnek

İlk `id`: `550` → başlık `Film 550`; sonraki `id`: `155` → effect yeni değeri kullanır ve başlık `Film 155` olur.

## Sözleşme

- Dosya: `detailsSource.ts` içindeki `detailsSource` adlı string dışa aktarımı.
- String, lint edilecek TSX bileşen kaynağını tutar; bileşen `MovieDetails`, prop `id` adını kullanır.

## Kısıtlar

- Başlık `Film {id}` olmalı; JSX çıktısı `<h1>Film {id}</h1>` kalmalıdır.
