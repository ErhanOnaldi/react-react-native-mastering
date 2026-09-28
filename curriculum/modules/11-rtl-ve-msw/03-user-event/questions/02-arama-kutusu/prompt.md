Kontrollü arama alanı, kullanıcının yazdığı değeri güncel tutmalı ve form gönderimini doğru değerle iletmeli.

## Gereksinimler
- Etiket “Film ara”, düğme adı “Ara” olmalı.
- Yazılan değer input’ta görünmeli ve `onChange` ile dışarı iletilmeli.
- Enter veya düğme gönderimi aynı submit davranışını çalıştırmalı.
- Submit değeri baş/son boşluklardan arındırılmalı; boş değer gönderilmemeli.
- Form gönderimi sayfa yenilememeli.

## Örnek
Input değeri ` Matrix ` → gönder → `onSubmit('Matrix')`.

## Sözleşme
- `SearchBox.tsx` dosyasında `SearchBox` export et.
- Props: `{ value: string; onChange(value: string): void; onSubmit(value: string): void }`.
- Input searchbox rolü ve “Film ara” adıyla; submit düğmesi “Ara” adıyla bulunabilmeli.
