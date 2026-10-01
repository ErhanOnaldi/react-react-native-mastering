Sinema arama kutusunun kullanıcı etkileşimlerini sınayan testler yaz.

## Gereksinimler
- “Film ara” adlı arama alanına yazılan metin input’ta görünmeli ve `onChange` callback’ine iletilmeli.
- “Ara” düğmesine tıklamak ve Enter’a basmak aramayı göndermeli.
- Gönderilen metnin başındaki ve sonundaki boşluklar kaldırılmalı.
- Boş metin gönderilmemeli.

## Örnek
` Matrix ` yazıp Enter’a basıldığında `onSubmit('Matrix')` çağrılır.

## Sözleşme
- `SearchBox.test.tsx` dosyasına test yaz.
- Bileşen `@impl/SearchBox` yolundan import edilir.
- Props: `{ value: string; onChange(value: string): void; onSubmit(value: string): void }`.
- Arama alanı searchbox rolü ve “Film ara” adıyla; gönderme düğmesi “Ara” adıyla bulunur.

## Kısıtlar

- Her iki verilen mutant da en az bir testte kalmalıdır.
