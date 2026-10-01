Harici bir film cevabında kayıt kimliği, başlık ve kapak yolu bulunmalı. Geçerli alanları kontrol et ve kapak yolunun boş olabileceğini koru.

## Gereksinimler

- `id` sayı, `title` metin olmalı.
- `poster_path` metin veya null olmalı ve anahtar bulunmalı.
- Ek alanlar kabul edilebilir.
- Null, dizi, eksik alan ve yanlış tipte alanlar reddedilmeli.

## Örnek

`{ id: 550, title: 'Dövüş Kulübü', poster_path: null }` → `true`; `{ id: '550', title: 'Dövüş Kulübü', poster_path: null }` → `false`.

## Sözleşme

- Dosya: `task.ts`
- Export tipi: `MovieBrief = { id: number; title: string; poster_path: string | null }`.
- Export fonksiyon: `isMovieBrief(value: unknown): value is MovieBrief`.
