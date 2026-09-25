Sinema refactor’undan sonra build yeşildi, fakat arama sayfasındaki hata iki gün saklandı. Şimdi projede her değişiklikten sonra çalıştırabileceğin bir test komutu kur.

## Yapılacaklar

1. `vite.config.ts` içinde `defineConfig` öğesini `vitest/config` üzerinden import et. Mevcut Vite ayarlarını koruyarak `test: { environment: 'jsdom', globals: false }` ekle. Hook testleri DOM ortamına ihtiyaç duyacak.
2. `package.json` dosyasına `"test": "vitest run"` script’ini ekle. Proje bağımlılıklarında `vitest` ve `jsdom` bulunsun; sürümleri kök catalog ile aynı olsun.
3. `src/shared/lib/format.test.ts` oluştur. `formatVote`, `releaseYear` ve `formatDate` fonksiyonlarını aynı klasördeki `format.ts` dosyasından import et. `describe`, `it`, `expect` öğelerini `vitest` paketinden açıkça import et.

| Durum | Beklenen |
| --- | --- |
| `formatVote(8)` | `"8.0"` |
| `formatVote(0)` | `"Henüz oy yok"` |
| `releaseYear("")` | `""` |
| `formatDate("")` | `"Tarih yok"` |

Test adlarını Türkçe davranış cümleleri olarak yaz. Ardından Sinema klasöründe `pnpm test` çalıştır ve testlerden birinin gerçekten kırıldığını görmek için bir beklenen değeri kısa süreliğine yanlış yazıp geri düzelt.
