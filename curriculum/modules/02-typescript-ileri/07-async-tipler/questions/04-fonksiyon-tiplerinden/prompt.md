Bir film yükleyicisinin parametre ve sonuç tipleri başka bir açıklama fonksiyonunda yeniden kullanılacak. İmza kopyalamadan çağrı bilgilerini metne dönüştür.

## Gereksinimler

- Parametre tuple'ı `[id: number, token: string]` olmalı.
- Yükleyicinin dönüşü `Promise<{ id: number; title: string }>` olmalı.
- Çözümlenmiş sonuç `{ id: number; title: string }` olmalı.
- Açıklama verilen ID için `"<id> için istek"` üretmeli.

## Örnek

`[550, 'test-token']` parametreleri → `"550 için istek"`.

## Sözleşme

- Dosya: `task.ts`; `loadMovie(id: number, token: string): Promise<{ id: number; title: string }>` örnek fonksiyonu bu dosyada bulunmalı.
- Export tipleri: `LoadArgs`, `LoadPromise`, `LoadedMovie`.
- Export fonksiyon: `describeLoad(args: LoadArgs): string`.
