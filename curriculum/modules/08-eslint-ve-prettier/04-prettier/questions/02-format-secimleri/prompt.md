# Sinema format seçenekleri

Ekipte aynı film listesinin farklı tırnak ve noktalı virgül tercihleriyle kaydedilmesini önle. Ortak TypeScript biçim seçeneklerini tanımla.

## Gereksinimler

- String değerlerinde tek tırnak kullan.
- Satır sonunda noktalı virgül kullanma.
- Satır genişliği hedefi `80` karakter olsun.
- Format sonucu `Dövüş Kulübü` metnini korumalı ve uzun film dizisini okunabilir satırlara ayırmalıdır.

## Örnek

Girdi: `const title = "Dövüş Kulübü";` → çıktı: `const title = 'Dövüş Kulübü'`.

## Sözleşme

- Dosya: `formatOptions.ts` içindeki `formatOptions` adlı named export.
- Export, Prettier `Options` tipine uyumlu olmalı ve TypeScript parser’ını seçmelidir.

## Kısıtlar

- `printWidth` satır uzunluğu hedefidir; tek başına her satırın kesin üst sınırını garanti etmez.
