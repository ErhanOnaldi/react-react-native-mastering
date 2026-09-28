Mekan kataloğunun dış veri sınırında bir doğrulayıcı hazır. Davranış testleriyle geçersiz cevapların kayıt gibi kullanılmasını önle.

## Gereksinimler

- `{ id: 12, name: 'Sahil', address: null }` geçerli kabul edilmeli.
- Doğru şekle ek alan geldiğinde nesne yine kabul edilmeli.
- `null`, dizi ve primitive değerler reddedilmeli.
- `id` sayı değilse, `name` metin değilse veya `address` eksik / string ya da null dışında bir değerse nesne reddedilmeli.
- Testler doğru implementasyonda geçmeli ve hatalı sürümlerin her birini yakalamalı.

## Örnek

| Değer | Beklenen |
| --- | --- |
| `{ id: 12, name: 'Sahil', address: null }` | `true` |
| `{ id: 12, name: 'Sahil', address: 'İskele', active: true }` | `true` |
| `{ id: 12, name: 'Sahil' }` | `false` |
| `null` | `false` |

## Sözleşme

- Yazılacak test dosyası: `venueGuard.test.ts`
- İçe aktarım: `import { isVenue } from '@impl/venueGuard'`
- Test araçları: `import { describe, expect, it } from 'vitest'`
- `isVenue(value: unknown)` boolean sonuç verir.

## Kısıtlar

- `impl/` altındaki doğrulayıcıyı değiştiremezsin; yalnızca test dosyasını yaz.
- DOM, ağ isteği veya mock gerekmez.
