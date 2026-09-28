İzleme listesi formunun ad ve açıklama alanlarını yeniden kur. İki alana girilen metin kaydetme callback'ine birlikte ulaşmalı.

## Gereksinimler

- “Liste adı” ve “Açıklama” etiketli alanlarını göster.
- Başlangıçta iki alan da boş olsun.
- “Kaydet” gönderiminde güncel `{ name, description }` değerlerini callback'e ilet.
- Açıklama girilmezse değeri boş string olarak gönder.

## Örnek

`Liste adı: Akşam`, `Açıklama: Kısa filmler` → Kaydet → `{ name: 'Akşam', description: 'Kısa filmler' }`.

## Sözleşme

- Dosya ve export: `WatchlistNameForm.tsx` → named export `WatchlistNameForm`.
- Prop: `onSave(values: WatchlistValues)`; `WatchlistValues` tipi `{ name: string; description: string }`.
- Arayüz: “Liste adı”, “Açıklama” label'ları ve “Kaydet” adlı submit düğmesi.
