Sayfalama çubuğunda geçerli sayfanın önceki ve sonraki komşularını kapsayan bir başlangıç-bitiş penceresi hesaplamak istiyoruz. `pageRange` fonksiyonu, aktif sayfa ve toplam sayfa sayısına göre tam iki elemandan oluşan bir aralık tuple'ı döndürmelidir.

## Gereksinimler

- `PageRange` adında iki elemanlı `[first: number, last: number]` tuple tipini tanımla ve export et.
- `pageRange` fonksiyonu, aktif sayfanın bir öncesi ile bir sonrasını kapsayan aralığı `[start, end]` tuple'ı olarak döndürmelidir.
- Aralık başlangıcı `1`'den küçük olamaz (ör. `page = 1` için başlangıç `1` kalır).
- Aralık bitişi `totalPages` değerinden büyük olamaz (ör. `page = 5, totalPages = 5` için bitiş `5` kalır).

## Örnek

| Girdi (`page`, `totalPages`) | Çıktı |
| --- | --- |
| `(1, 5)` | `[1, 2]` |
| `(5, 5)` | `[4, 5]` |
| `(3, 5)` | `[2, 4]` |

## Sözleşme

- Dosya: `pageRange.ts`
- Tip export: `type PageRange = [first: number, last: number]`
- Fonksiyon export: `pageRange(page: number, totalPages: number): PageRange`
