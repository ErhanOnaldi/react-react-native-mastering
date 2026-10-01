# Sinema için Prettier ayarı

Ekipte aynı film listesinin farklı tırnak ve noktalı virgül tercihleriyle kaydedilmesini önle. Proje kökünde ortak Prettier ayar dosyasını oluştur.

## Gereksinimler

- String değerlerinde tek tırnak kullan.
- Satır sonunda noktalı virgül kullanma.
- Satır genişliği hedefi `80` karakter olsun.
- TypeScript kaynakları biçimlendirilmelidir.
- Format sonucu `Dövüş Kulübü` metnini korumalı ve uzun film dizisini okunabilir satırlara ayırmalıdır.

## Örnek

Girdi: `const title = "Dövüş Kulübü";` → çıktı: `const title = 'Dövüş Kulübü'`.

## Sözleşme

- Dosya: `prettier-config.json` içindeki ayarlar, proje config’inde `.prettierrc.json` olarak kullanılmalıdır.
- Ayarlar Prettier'ın okuyacağı geçerli JSON olmalı ve TypeScript parser’ını seçmelidir.

## Kısıtlar

- `printWidth` satır uzunluğu hedefidir; tek başına her satırın kesin üst sınırını garanti etmez.
