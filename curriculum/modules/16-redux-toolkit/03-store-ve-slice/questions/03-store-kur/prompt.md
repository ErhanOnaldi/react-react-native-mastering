Uygulama iki bağımsız ortak veriyi tek store üzerinden kullanmalı: kayıt kimlikleri ve görünüm tercihi.

## Gereksinimler

- `setupStore()` başlangıçta `{ favorites: { ids: [] }, ui: { theme: "light" } }` döndürür.
- Bir kayıt ekleme ve temayı koyuya alma işlemlerinden sonra state `{ favorites: { ids: [550] }, ui: { theme: "dark" } }` olur.
- Her `setupStore()` çağrısı bağımsız başlangıç state’i olan yeni bir store üretir.

## Örnek

Bir store’da kayıt ekleyip temayı değiştirdikten sonra ikinci bir store oluştur. İkinci store’un kayıt listesi boş ve teması açık olmalı.

## Sözleşme

- Dosya: `store.ts`
- Export: `setupStore()`; hazır slice action’ları `add(id: number)` ve `toggle()` import edilir.
- Store kök anahtarları: `favorites` ve `ui`.
