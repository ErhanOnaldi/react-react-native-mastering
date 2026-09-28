Sinema'nın istek bileşenlerinde boş, yükleniyor, başarılı ve hatalı cevap ayrı gösterilmeli. Bu durum biçimlerini ve her durumu tanıyan yardımcıları ortak bir modülde oluştur.

## Gereksinimler

- Dört durum `idle`, `loading`, `success` ve `error` olmalı.
- Başarı dalı yalnız veriyi, hata dalı yalnız hata metnini taşımalı; diğer dallar eski veri veya hata taşımamalı.
- Her durum kontrolü yalnızca kendi dalında true dönmeli.
- Başarı kontrolünden sonra generic veri tipi korunmalı.

## Örnek

`{ status: 'success', data: { title: 'Kıyı' } }` başarı kontrolünde true verir ve daraltmadan sonra `data.title` okunabilir. `{ status: 'loading' }` için başarı kontrolü false verir.

## Sözleşme

- Dosya: `src/lib/remote-data.ts`.
- Export tipi:

```ts
export type RemoteData<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
```

- Export guard'lar:
  - `isIdle<T>(state: RemoteData<T>): state is { status: 'idle' }`.
  - `isLoading<T>(state: RemoteData<T>): state is { status: 'loading' }`.
  - `isSuccess<T>(state: RemoteData<T>): state is { status: 'success'; data: T }`.
  - `isError<T>(state: RemoteData<T>): state is { status: 'error'; error: string }`.

## Kısıtlar

- Dosya ağ isteği yapmamalı.
- `idle` ve `loading` dalları eski veri taşımamalı.
