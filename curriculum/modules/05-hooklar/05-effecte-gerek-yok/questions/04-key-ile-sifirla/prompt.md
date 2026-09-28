Her filmin not kutusu kendi yerel taslağını tutmalı. Aynı film yeniden render edildiğinde not korunur; başka filme geçildiğinde not kutusu boş başlar.

## Gereksinimler

- Aynı `id` ile yeniden render edildiğinde yazılan not korunur.
- Farklı `id` geldiğinde not alanı boşalır.
- Not alanı erişilebilir adı `Film notu` olan textbox olarak kalır.
- Kullanıcının yazdığı not gereksiz render'larda silinmez.

## Örnek

550 filminde `İzle` yaz → aynı 550 tekrar render edilir → değer `İzle`. Sonra 27205'e geç → değer boş string.

## Sözleşme

- Dosya ve export: `MovieNotes.tsx` → `MovieNotes`
- Prop: `{ id: number }`
- Testler `Film notu` textbox değerini kontrol eder.
