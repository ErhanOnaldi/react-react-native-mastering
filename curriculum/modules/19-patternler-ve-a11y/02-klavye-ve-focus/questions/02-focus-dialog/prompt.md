Fragman penceresi açılınca focus arkadaki arama kutusunda kalıyor. Önizlemede **Fragmanı aç**'a bas, sonra Tab/Shift+Tab ile dolaş ve Escape'e bas: focus nereye gidiyor?

## Görev
`FocusDialog({ open, onClose })` bileşenine modal dialog sözleşmesini ekle.

## Gereksinimler
- Açıkken `role="dialog"`, `aria-modal="true"` olsun ve adı görünür **Fragman** başlığından gelsin (`aria-labelledby` + `useId`).
- İçinde **Oynat** ve **Kapat** düğmeleri olsun; açılışta **Oynat** focus alsın.
- Kapat'tayken Tab → Oynat; Oynat'tayken Shift+Tab → Kapat.
- Escape ve Kapat `onClose` çağırsın. Kapanınca focus, açılıştan önceki aktif öğeye dönsün.
- Kapalıyken dialog DOM'da olmasın.
- **Yeni:** Dialog açıkken üst bileşen yeni bir `onClose` fonksiyonuyla yeniden render olursa focus **yerinde kalsın** (effect yeniden kurulmasın).

## İpucu olmadan önce dene
Önizlemedeki üst bileşen her saniye yeniden render oluyor. Kapat'a gel ve bekle: focus zıplıyorsa effect'in neye bağlı olduğuna bak.
