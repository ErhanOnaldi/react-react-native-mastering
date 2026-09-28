Fragman penceresi açılınca focus arkadaki arama kutusunda kalıyor. Açılış, klavye dolaşımı, kapatma ve focus dönüşünü tutarlı hale getir.

## Gereksinimler

- Açıkken `role="dialog"`, `aria-modal="true"` ve görünür **Fragman** başlığından gelen erişilebilir adı olsun.
- İçinde **Oynat** ve **Kapat** düğmeleri bulunsun; açılışta Oynat focus alsın.
- Kapat'tayken Tab → Oynat; Oynat'tayken Shift+Tab → Kapat.
- Escape ve Kapat `onClose` çağırsın. Kapanınca focus açılıştan önceki aktif öğeye dönsün.
- Kapalıyken dialog DOM'da bulunmasın.
- Dialog açıkken üst bileşen yeni bir `onClose` fonksiyonuyla yeniden render olursa focus yerinde kalsın.

## Örnek

`Fragmanı aç` → `Oynat` odağı alır → Tab ile `Kapat`'a gider → Tab ile `Oynat`'a döner → Escape ile dialog kapanır ve focus `Fragmanı aç`'a döner.

## Sözleşme

- `FocusDialog.tsx` içinden named export `FocusDialog({ open, onClose })`.
- `open: boolean`; `onClose: () => void`.
- Dialog adı `Fragman`; içeride `Oynat` ve `Kapat` adlı button'lar.
