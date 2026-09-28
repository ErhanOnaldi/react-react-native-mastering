Film listeleme ekranında kullanıcıların kart veya liste düzeni arasında geçiş yapmasını sağlayan bir görünüm seçici bulunuyor. `viewLabel` fonksiyonu, yalnızca tanımlı iki görünüm modunu kabul etmeli ve ekranda gösterilecek Türkçe başlığı döndürmelidir.

## Gereksinimler

- `ViewMode` adında yalnızca `'grid' | 'list'` literal değerlerini kabul eden tipi tanımla ve export et.
- `viewLabel` fonksiyonu, `'grid'` için `"Kartlar"`, `'list'` için `"Liste"` metnini döndürmelidir.
- Bu iki değer dışındaki herhangi bir metin TypeScript derleme zamanında tip hatası üretmelidir.

## Örnek

| Girdi (`mode`) | Çıktı |
| --- | --- |
| `'grid'` | `"Kartlar"` |
| `'list'` | `"Liste"` |

## Sözleşme

- Dosya: `viewLabel.ts`
- Tip export: `type ViewMode = 'grid' | 'list'`
- Fonksiyon export: `viewLabel(mode: ViewMode): string`
