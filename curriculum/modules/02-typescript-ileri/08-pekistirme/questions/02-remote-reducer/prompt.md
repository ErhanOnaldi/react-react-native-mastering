Bir liste yenilemesi başlarken önceki sonuçlar ekranda kalmamalı. Her olay, uzak veri durumunu kendi yeni ve tutarlı biçimine geçirmeli.

## Gereksinimler

- Durumlar `idle`, `loading`, `success` ve `error` olmalı.
- Eylemler başlangıç, başarılı cevap, hata ve sıfırlama olaylarını taşımalı.
- Başlangıç olayı eski başarı verisini taşımamalı.
- Başarı yalnız veriyi, hata yalnız hata metnini içermeli; sıfırlama idle üretmeli.
- Her geçiş yeni durum nesnesi döndürmeli ve bilinmeyen eylemler exhaustive kontrol edilmeli.

## Örnek

`success` durumundaki listeye `start` gönderilince `{ status: 'loading' }` döner. `loading` durumuna `resolve` gönderilince yeni sonuçları taşıyan `success` döner.

## Sözleşme

- Dosya: `task.ts`
- Export tipleri: `RemoteData<T>`, `RemoteAction<T>`.
- Export fonksiyon: `transition<T>(state: RemoteData<T>, action: RemoteAction<T>): RemoteData<T>`.
