Kullanıcı yeni bir izleme listesi oluştururken listenin herkese açık olup olmadığını seçebilsin. Başlangıç tercihi özel olmalı.

## Gereksinimler

- “Liste adı” alanı ve “Herkese açık” checkbox'ı göster.
- Form değerleri `name`, `description` ve `isPublic` olsun; ilk iki değer boş string, görünürlük `false` ile başlasın.
- Gönderimde üç değeri callback'e birlikte ilet. Açıklama alanının ekranda olması gerekmez; değeri boş string olarak gönder.
- Checkbox seçildiğinde gönderilen `isPublic` değeri `true` olsun.

## Örnek

Checkbox boş → `{ name: 'Akşam', description: '', isPublic: false }`; checkbox seçili → aynı nesnede `isPublic: true`.

## Sözleşme

- Dosya ve export: `VisibilityForm.tsx` → named export `VisibilityForm`.
- Prop: `onSave(values: Values)`; `Values` tipi `{ name: string; description: string; isPublic: boolean }`.
- Arayüz: “Liste adı” adlı textbox, “Herkese açık” adlı checkbox ve “Kaydet” adlı submit düğmesi.
