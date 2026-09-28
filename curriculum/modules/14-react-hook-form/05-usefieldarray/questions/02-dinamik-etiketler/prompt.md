İzleme listesine kullanıcı tarafından eklenip silinebilen etiket satırları ekle. Kalan değerler kaydedilirken sırayla korunmalı.

## Gereksinimler

- İlk render'da bir boş “Etiket 1” alanı göster.
- “Etiket ekle” yeni boş alan açsın; her satır için “Etiket N sil” düğmesi bulunsun.
- Bir satır silinince kalan alan değerleri ve sıraları doğru kalsın.
- Kaydet'te `{ tags: [{ value: string }] }` nesnesini callback'e ilet.
- Ekleme/silme düğmeleri formu göndermesin.

## Örnek

İlk alana `klasik` yaz, ikinci satırı ekleyip `aksiyon` yaz, ilk satırı sil → `{ tags: [{ value: 'aksiyon' }] }`.

## Sözleşme

- Dosya ve export: `TagForm.tsx` → named export `TagForm`.
- Prop: `onSave(values: { tags: { value: string }[] }): void`.
- Arayüz: `Etiket N` label'lı textbox'lar, “Etiket ekle”, “Etiket N sil” ve “Kaydet” düğmeleri.
