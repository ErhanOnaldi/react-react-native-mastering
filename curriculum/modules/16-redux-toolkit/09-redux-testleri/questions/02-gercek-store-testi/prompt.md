Seçili kayıt sayısını ve yeni kayıt ekleme etkileşimini tek bir arayüzde sun.

## Gereksinimler

- Başlangıçta `[550, 603]` varsa `<output>` içinde `2 film` görünür.
- “550 ekle” düğmesi seçili kayıt kimliğini store’a ekler.
- Boş başlangıçta düğmeye iki kez basınca kimlik yalnız bir kez bulunur ve çıktı `1 film` olur.
- Arayüz güncel store state’ini göstermelidir.

## Örnek

Başlangıç boş → ilk tıklama: `1 film` → ikinci tıklama: hâlâ `1 film`.

## Sözleşme

- Dosya ve export: `WatchCounter.tsx` → `WatchCounter`
- Çıktı HTML `<output>` öğesinde; düğmenin erişilebilir adı `550 ekle`.
- Bileşen Provider altındaki store’u kullanır.
