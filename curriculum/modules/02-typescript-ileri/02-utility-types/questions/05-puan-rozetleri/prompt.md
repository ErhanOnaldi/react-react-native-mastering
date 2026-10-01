Film listesinde puanı 7.5 ve üstü olan filmlerin rozeti boş görünüyor. Diğer filmlerde sorun yok ve kod hatasız derleniyor. Rozetin neden boş kaldığını bul ve bu tür bir hatanın bir daha derleme sırasında yakalanmasını sağla.

## Gereksinimler

- Puanı `7.5` ve üstü olan film `{ label: 'Çok iyi', color: 'green' }` rozetini almalı.
- `5` ile `7.5` arası (5 dahil) `{ label: 'İdare eder', color: 'amber' }`, `5`'in altı `{ label: 'Zayıf', color: 'red' }` almalı.
- Rozet tablosunda `RatingLevel`'daki her seviye için tam olarak bir rozet olmalı. `RatingLevel`'da olmayan bir anahtar (yazım hatası dahil) tip hatası vermeli.
- Tablodaki rozetler sonradan başka bir değerle değiştirilememeli; böyle bir atama tip hatası vermeli.

## Örnek

| Puan | Rozet |
| --- | --- |
| `8.4` | `{ label: 'Çok iyi', color: 'green' }` |
| `6.1` | `{ label: 'İdare eder', color: 'amber' }` |
| `3.2` | `{ label: 'Zayıf', color: 'red' }` |

## Sözleşme

- Dosya: `task.ts`
- Export tipleri: `RatingLevel`, `Badge` (değiştirme).
- Export sabit: `RATING_BADGES`.
- Export fonksiyonlar: `ratingLevel(vote: number): RatingLevel`, `badgeFor(vote: number): Badge`.
