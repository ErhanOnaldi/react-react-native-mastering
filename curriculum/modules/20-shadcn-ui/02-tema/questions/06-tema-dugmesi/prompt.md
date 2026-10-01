Sinema'da ziyaretçi açık ve koyu görünüm arasında geçebilsin. Tercih değişince aynı anda hem sayfanın tema sınıfı hem de düğmenin erişilebilir durumu güncellensin.

## Gereksinimler
- Başlangıçta `Koyu temaya geç` adlı bir düğme görünsün ve `aria-pressed="false"` olsun.
- Düğmeye basınca `<html>` öğesine `dark` sınıfı eklensin; düğme `Açık temaya geç` adını alsın ve `aria-pressed="true"` olsun.
- Düğmeye yeniden basınca `dark` sınıfı kaldırılsın; düğme başlangıç durumuna dönsün.

## Örnek
`Koyu temaya geç` düğmesine bas → `<html>` üzerinde `dark` sınıfı görünür ve düğme `Açık temaya geç` olur.

## Sözleşme
- `ThemeToggle.tsx` → named export `ThemeToggle`.
- Düğme `button` rolüyle bulunmalı.
