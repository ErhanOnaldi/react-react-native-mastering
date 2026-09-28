Sinema filtrelerinde iki tür kimliği Türkçe adlarıyla gösteriliyor. Her kimliğin bir adı bulunmalı ve seçilen kimlik için doğru ad dönmeli.

## Gereksinimler

- Geçerli kimlikler `18` ve `53` olmalı.
- İsim tablosunda iki kimliğin ikisi de bulunmalı ve tablo yeniden atamaya kapalı olmalı.
- `18` için `Dram`, `53` için `Gerilim` dönmeli.

## Örnek

Kimlik `18` için sonuç `"Dram"`; kimlik `53` için `"Gerilim"`.

## Sözleşme

- Dosya: `task.ts`
- Export tipleri: `GenreId = 18 | 53`, `GenreNames = Readonly<Record<GenreId, string>>`.
- Export sabit: `GENRE_NAMES`.
- Export fonksiyon: `genreLabel(id: GenreId): string`.
