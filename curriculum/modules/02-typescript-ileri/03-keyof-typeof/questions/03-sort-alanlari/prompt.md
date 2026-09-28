Sinema'nın film listesi üç alana göre sıralanabiliyor. İzinli alanların listesi ile metin etiketleri aynı değerleri kullanmalı; URL'den gelen yanlış yazım reddedilmeli.

## Gereksinimler

- İzinli alanlar `popularity`, `vote_average` ve `release_date` olmalı.
- Geçerli alanlar tanımlı diziden literal union olarak türetilmeli.
- Alan üyeliği izinli değerlerde true, diğer stringlerde false vermeli.
- Etiketler sırasıyla `Popülerlik`, `Puan` ve `Vizyon tarihi` olmalı.

## Örnek

`'vote_average'` izinli, `'vote_avrage'` geçersizdir.

## Sözleşme

- Dosya: `task.ts`
- Export sabit: `SORT_FIELDS`.
- Export tipi: `SortField`.
- Export fonksiyonlar: `isSortField(value: string): value is SortField`, `sortLabel(field: SortField): string`.
