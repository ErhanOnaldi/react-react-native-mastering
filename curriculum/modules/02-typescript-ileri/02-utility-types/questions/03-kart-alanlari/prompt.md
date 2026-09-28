Yazar kartı yalnızca kayıt kimliğine, başlığa ve kapak yoluna ihtiyaç duyuyor. Kart etiketi kapak yokken bunu açıkça belirtmeli.

## Gereksinimler

- `MovieCardData`, `Movie` tipindeki yalnızca `id`, `title` ve `poster_path` alanlarından oluşmalı.
- `poster_path` null olabilmeli.
- Kapak null ise `"<başlık> (poster yok)"`, doluysa yalnızca başlık dönmeli.

## Örnek

`{ id: 7, title: 'Kıyı', poster_path: null }` → `"Kıyı (poster yok)"`

## Sözleşme

- Dosya: `task.ts`
- Export tipleri: `Movie`, `MovieCardData`.
- Export fonksiyon: `cardLabel(movie: MovieCardData): string`.
