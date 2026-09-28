TMDB'den gelen film kaydı bozuksa kart çökmek yerine açıklayıcı bir yedek başlık göstersin.

## Gereksinimler
- title mevcut, boş olmayan string ise aynen döndür.
- title eksik, null veya boşsa Film verisi geçersiz döndür.

## Örnek
{ title: "Matrix" } → "Matrix"

## Sözleşme
- label.ts dosyasında movieLabel(raw: unknown): string named export'unu tanımla.

