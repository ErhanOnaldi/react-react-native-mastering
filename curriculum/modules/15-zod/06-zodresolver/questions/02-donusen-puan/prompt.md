Kullanıcı 1 ile 5 arasında puan girebilsin; geçerli gönderimde callback sayısal değer alsın.

## Gereksinimler
- Puan alanı tam sayı ve 1–5 aralığında olmalı; aralık dışındaki değer gönderilmemeli.
- Geçerli girdi onSave callback'ine number olarak ulaşmalı.
- Label Puan, düğme Gönder olmalı; geçersiz girişte role=alert görünmeli.

## Örnek
Input'a 4 girilip gönderildiğinde onSave(4) çağrılır. 0 veya 6 gönderilmez.

## Sözleşme
- RatingForm.tsx dosyasında RatingForm({ onSave }: { onSave: (rating: number) => void }) named export bileşenini tanımla.

## Kısıtlar
- Formun ham input değeri ile callback'e giden değer doğru biçimde tiplendirilmelidir.

