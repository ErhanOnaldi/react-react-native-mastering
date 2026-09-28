Film listesindeki hatalı kaydı tanıla; geçerli liste için hata olmadığını belirt.

## Gereksinimler
- results dizisindeki her öğenin title alanı boş olmayan string olmalı.
- Tüm öğeler geçerliyse null döndür.
- Başlık eksik, null veya boşsa okunabilir hata metni döndür; metin results ve title alan yollarını içersin.

## Örnek
{ results: [{ title: "Matrix" }] } → null. { results: [{ title: null }] } → results ve title yollarını içeren metin.

## Sözleşme
- errors.ts dosyasında describeListError(raw: unknown): string | null named export'unu tanımla.

