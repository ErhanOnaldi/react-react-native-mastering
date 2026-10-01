`WatchCounter` bileşeninin gerçek store bağlantısını sınayan RTL testlerini yaz. Testler başlangıç görünümünü ve kullanıcı tıklamasının store ile ekrana etkisini doğrulasın.

## Gereksinimler

- Başlangıçta `[550, 603]` varsa `<output>` içinde `2 film` görünür.
- “550 ekle” düğmesi seçili kayıt kimliğini store’a ekler.
- Boş başlangıçta düğmeye iki kez basınca kimlik yalnız bir kez bulunur ve çıktı `1 film` olur.
- Arayüz güncel store state’ini göstermelidir.

## Örnek

Başlangıç boş → ilk tıklama: `1 film` → ikinci tıklama: hâlâ `1 film`.

## Sözleşme

- Test dosyası: `WatchCounter.test.tsx`
- Test edilecek export: `@impl/WatchCounter` içinden `setupStore(ids?: number[])` ve `WatchCounter`.
- Çıktı HTML `<output>` öğesinde; düğmenin erişilebilir adı `550 ekle`.
- `WatchCounter` Provider altındaki store’u kullanır.
