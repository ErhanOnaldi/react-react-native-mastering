Dialog, filtre çekmecesi ve menü aynı aç/kapat davranışını tekrarlıyor. DOM üretmeyen, bu durumu ve eylemleri paylaşan bir hook oluştur.

## Gereksinimler

- Başlangıç değeri verilmezse kapalı olsun; istenirse başlangıç değeri alınsın.
- `open` her çağrıda açık, `close` her çağrıda kapalı duruma getirsin.
- Aynı olayda iki `toggle` çağrısı başlangıç durumuna dönsün.
- Dönen `open`, `close` ve `toggle` fonksiyonlarının referansı render'lar arasında değişmesin.
- Hook DOM, rol veya focus davranışı üretmesin.

## Örnek

Başlangıç `false`; `open()` → `true`; `toggle()` iki kez → `true` durumuna geri döner.

## Sözleşme

- `useDisclosure.ts` içinden named export `useDisclosure(initial = false)`.
- Dönüş tipi `{ isOpen: boolean; open: () => void; close: () => void; toggle: () => void }`.
