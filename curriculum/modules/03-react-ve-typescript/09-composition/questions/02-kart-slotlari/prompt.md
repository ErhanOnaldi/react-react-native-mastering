Film bilgi kutusu, ana içeriği ve isteğe bağlı alt eylemi farklı yerlerde göstermeli. Alt eylem verilmediğinde footer bulunmamalıdır.

## Gereksinimler

- Ana çocuk içeriği `article` içinde görünmelidir.
- Alt eylem verildiğinde `footer` içinde görünmelidir.
- Alt eylem verilmediğinde `footer` hiç oluşturulmamalıdır.
- Sayı `0` geçerli bir alt içeriktir ve footer içinde görünmelidir.

## Örnek

Ana içerik olarak bir başlık ve alt eylem olarak “Favoriye ekle” düğmesi ver → başlık article içinde, düğme footer içinde görünür.

## Sözleşme

- Dosya ve export: `MoviePanel.tsx` → named export `MoviePanel`
- Props: `{ children: ReactNode; actions?: ReactNode }`
- Arayüz: ana içerik `article` içinde; verilen eylem `footer` içinde.
