Önizlemede bir filme not yazıp listeyi ters çevirdiğinde not aynı filmle kalmalı. Kaynak film dizisinin sırası da korunmalıdır.

## Gereksinimler

- “Sırayı ters çevir” düğmesi görünür sırayı tersine çevirmelidir.
- Film satırları sıralama sonrasında aynı filme ait not değerini korumalıdır.
- Aynı düğmeye iki kez basınca başlangıç sırası geri gelmelidir.
- Kaynak film verisi yerinde değiştirilmemelidir.

## Örnek

Dövüş Kulübü notuna “Güçlü final” yaz → sırayı ters çevir → not Dövüş Kulübü input'unda kalır; Matrix input'u boş kalır.

## Sözleşme

- Dosya ve export: `SortableNotes.tsx` → named export `SortableNotes`
- Props: yok; başlangıç film verisi starter'da sağlanır.
- Arayüz: `textbox` adları `[BAŞLIK] notu`, ters çevirme düğmesinin adı “Sırayı ters çevir”.
