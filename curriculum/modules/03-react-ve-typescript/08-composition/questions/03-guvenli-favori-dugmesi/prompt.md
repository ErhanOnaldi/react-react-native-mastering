Sinema ekranında formu göndermeyen, tekrar kullanılabilir bir eylem düğmesi kur. Çağıran düğme içeriğini ve doğal button özelliklerini verebilsin.

## Gereksinimler

- Children, gerçek bir `button` içinde görünmelidir.
- `disabled`, `aria-pressed` ve `onClick` özellikleri düğmeye aktarılmalıdır.
- Form içindeki tıklama verilen callback'i çalıştırmalı, formu göndermemelidir.
- Çağıran düğme türünü `submit` olarak değiştirememelidir.

## Sözleşme

- Dosya ve export: `FavoriteButton.tsx` → named export `FavoriteButton`
- Props: button'ın doğal özellikleri; `type` değeri çağırana açık değildir
