Rapor ekranı boş, yükleniyor, başarılı veya hatalı olabilir. Aynı anda birden çok çelişkili durum taşımadan her duruma uygun mesaj üret.

## Gereksinimler

- `idle`, `loading`, `success` ve `error` ayrı nesne biçimleri olmalı.
- Başarı verisi yalnız başarı durumunda; hata metni yalnız hata durumunda bulunmalı.
- Mesajlar sırasıyla `Hazır`, `Yükleniyor`, `Tamam` ve hata metni olmalı.

## Örnek

`{ status: 'error', error: 'Erişim yok' }` için mesaj `"Erişim yok"`; `{ status: 'success', data: 17 }` için `"Tamam"`.

## Sözleşme

- Dosya: `task.ts`
- Export tipi: `RemoteData<T>`.
- Export fonksiyon: `message(state: RemoteData<unknown>): string`.
