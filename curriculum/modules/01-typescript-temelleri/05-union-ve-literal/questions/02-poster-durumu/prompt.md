Görsel bileşeninin poster yükleme durumunu iki kesin seçenekle yönetmek istiyoruz. `posterState` fonksiyonu, gelen dosya yoluna göre durumun eksik mi yoksa hazır mı olduğunu bildiren bir literal union değeri döndürmelidir.

## Gereksinimler

- `PosterState` adında yalnızca `'missing' | 'ready'` değerlerini kabul eden literal union tipini tanımla ve export et.
- `posterState` fonksiyonu, parametre olarak gelen yol `null` veya boş metin (`""`) ise `'missing'` döndürmelidir.
- Yol dolu bir metin içeriyorsa `'ready'` döndürülmelidir.

## Örnek

| Girdi (`path`) | Çıktı |
| --- | --- |
| `null` | `'missing'` |
| `""` | `'missing'` |
| `"/x.jpg"` | `'ready'` |

## Sözleşme

- Dosya: `posterState.ts`
- Tip export: `type PosterState = 'missing' | 'ready'`
- Fonksiyon export: `posterState(path: string | null): PosterState`
