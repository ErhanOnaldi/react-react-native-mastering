Bir rapor durumunu kullanıcıya gösterilecek metne dönüştür. Yeni bir durum eklendiğinde onu ele almayan kodun derleyici tarafından fark edilmesi gerekir.

## Gereksinimler

- `idle` → `Henüz istek yok`; `loading` → `Yükleniyor…`.
- Başarı durumunda verilen dönüştürücü `data` ile çağrılmalı.
- Hata durumunda `Hata: <mesaj>` biçimi kullanılmalı.
- Dönüş tipi her durum için string olmalı; yeni bir durum eklenip ele alınmazsa derleyici hata vermeli.

## Örnek

`{ status: 'success', data: 4 }` ve `String` → `"4"`; `{ status: 'error', error: '404' }` → `"Hata: 404"`.

## Sözleşme

- Dosya: `task.ts`
- Export tipi: `RemoteData<T>`.
- Export fonksiyon: `renderState<T>(state: RemoteData<T>, show: (data: T) => string): string`.
