Kullanıcının seçim listesi yenilemeden sonra korunmalı; kayıt hatası arayüzün çalışmasını durdurmamalı.

## Gereksinimler

- Seçim değişikliği sonrasında güncel ID dizisi JSON olarak storage’a yazılır.
- İlk eklemeden sonra değer `[550]`; aynı ID çıkarılınca `[]` olur.
- Başka bir ID eklendiğinde mevcut ID korunur ve yeni ID sona eklenir.
- Storage yazma hatası uygulama state geçişini çökertmez.

## Örnek

`550` ekle → storage `[550]`; `603` ekle → `[550, 603]`; `550` çıkar → `[603]`.

## Sözleşme

- Dosya: `persist.ts`
- Export: `setupStore()`, `toggle(id: number)`
- Storage anahtarı: `sinema:favorites`; store kök state alanı: `favorites.ids`
