Sinema uygulamasının kart ve detay görünümlerinde puanların ve tarihlerin aynı kurallarla ekrana yansımasını sağlamalıyız. `projects/sinema/src/lib/format.ts` dosyasında puan ve tarih biçimlendirme yardımcılarını oluşturacaksın.

## Gereksinimler

- `src/lib/format.ts` dosyasını oluştur ve üç fonksiyonu named export olarak tanımla:
  - `formatVote(n: number): string`
    - Puan `0` ise `"Henüz oy yok"` metnini döndür.
    - Diğer puanları tek ondalık basamağa yuvarla; tam sayılarda sondaki `.0` ekini koru (ör. `8` → `"8.0"`, `7.456` → `"7.5"`).
  - `releaseYear(date: string): string`
    - Tarih dolu ise ilk 4 karakteri (yıl) döndür (ör. `"1999-10-15"` → `"1999"`).
    - Tarih boş (`""`) ise boş metin (`""`) döndür.
  - `formatDate(date: string): string`
    - Tarih boş (`""`) ise `"Tarih yok"` metnini döndür.
    - Tarih dolu ise Türkçe uzun tarih formatına çevir (ör. `"1999-10-15"` → `"15 Ekim 1999"`, `"2026-07-15"` → `"15 Temmuz 2026"`).
    - Saat dilimi farklarından dolayı günün kaymaması için UTC saat dilimini dikkate al.

## Örnek

| Fonksiyon | Girdi | Beklenen Çıktı |
| --- | --- | --- |
| `formatVote` | `0` | `"Henüz oy yok"` |
| `formatVote` | `8` | `"8.0"` |
| `formatVote` | `7.456` | `"7.5"` |
| `releaseYear` | `"1999-10-15"` | `"1999"` |
| `releaseYear` | `""` | `""` |
| `formatDate` | `"1999-10-15"` | `"15 Ekim 1999"` |
| `formatDate` | `""` | `"Tarih yok"` |

## Sözleşme

- Dosya yolu: `src/lib/format.ts` (Sinema projesi kökü altında)
- Export'lar:
  - `formatVote(n: number): string`
  - `releaseYear(date: string): string`
  - `formatDate(date: string): string`
