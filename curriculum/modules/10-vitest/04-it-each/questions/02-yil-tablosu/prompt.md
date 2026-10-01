Film çıkış tarihi boş veya dolu olabilir. Her girdi için yıl çıkarma davranışını ayrı raporlanan örneklerle güvenceye al.

## Gereksinimler

- Boş tarih boş string üretmeli.
- Dolu tarihte ilk dört karakter yıl olarak dönmeli.
- Test başlığı o satırın tarih girdisini göstermeli.
- Doğru uygulama geçmeli, verilen hatalı sürümlerden en az biri kalmalı.

## Örnek

| Tarih | Beklenen |
| --- | --- |
| boş string | boş string |
| 1999-10-15 | 1999 |
| 2024-01-01 | 2024 |

## Sözleşme

- Yazılacak dosya: releaseYear.test.ts
- Test edilecek modül: @impl/releaseYear
- Fonksiyon: releaseYear(date: string): string
