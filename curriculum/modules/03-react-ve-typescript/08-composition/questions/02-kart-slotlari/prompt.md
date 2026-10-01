Film bilgi kutusu, ana içeriği ve isteğe bağlı alt eylemi farklı yerlerde göstermeli. Alt eylem verilmediğinde footer bulunmamalıdır.

## Gereksinimler

- Ana çocuk içeriği `article` içinde görünmelidir.
- Alt eylem verildiğinde `footer` içinde görünmelidir.
- Alt eylem verilmediğinde `footer` hiç oluşturulmamalıdır.

## Örnek

Ana içerik olarak “Matrix” başlığını ve alt eylem olarak “Favoriye ekle” düğmesini ver → başlık article içinde, düğme footer içinde görünür.

## Sözleşme

- Dosya ve export: `MoviePanel.tsx` → named export `MoviePanel`
- Props: zorunlu ana içerik `children`; isteğe bağlı gösterilebilir `actions` içeriği
- Arayüz: ana içerik `article` içinde; verilen eylem `footer` içinde.
