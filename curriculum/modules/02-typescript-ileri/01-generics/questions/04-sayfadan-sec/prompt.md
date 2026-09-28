Trend sayfasındaki sonuçlarda bir kaydı ararken sayfalama bilgisinin değişmemesi ve öğenin kendine özgü alanlarının korunması gerekiyor.

## Gereksinimler

- Sayfa `page`, `results`, `total_pages` ve `total_results` alanlarını taşımalı.
- İstenen sayısal kimlikteki öğe dönmeli; bulunamazsa `undefined` dönmeli.
- Dönüş tipi aranan öğenin tüm alanlarını korumalı.

## Örnek

Sayfada `{ id: 550, title: 'Dövüş Kulübü', poster_path: null }` varsa `550` araması bu nesneyi döndürür. Sayfada yalnız `id: 155` varken `550` aranırsa sonuç `undefined` olur.

## Sözleşme

- Dosya: `task.ts`
- Export tipi: `Paginated<T>`; `results` alanı `T[]`.
- Export fonksiyon: `findOnPage<T extends { id: number }>(page: Paginated<T>, id: number): T | undefined`.
