İzleme listesi etiketleri artık dinamik. Başlangıçta tek boş etiket alanı göster.

- “Etiket ekle” yeni alan açsın.
- Her satırda o satırı silen bir düğme olsun.
- `useFieldArray` kullan; React key olarak `field.id` ver.
- “Kaydet” kalan etiketleri `{ tags: [{ value: ... }] }` şeklinde göndersin.

Örnek: `klasik` ekle, ikinci alana `aksiyon` yaz, ilkini sil → yalnızca `aksiyon` kalır.
