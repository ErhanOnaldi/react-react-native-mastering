Bir okuma listesinde geçerli sayfa adresle paylaşılmalı; böylece aynı bağlantı aynı bölümü açar. `PageReader.test.tsx` içine sayfa davranışını ve sınır durumunu doğrulayan testler yaz.

## Gereksinimler

- `/read?page=2` açıldığında `Sayfa 2` ve `Kayıp harita` başlığı görünmeli.
- `Sonraki sayfa` düğmesine basılınca URL `page=2` içermeli ve `Gece treni` başlığı görünmeli.
- `/read?page=abc` açıldığında uygulama çökmemeli; `Sayfa 1` ve `Kıyı kasabası` görünmeli.
- Test adları Türkçe ve doğruladıkları davranışı anlatan cümleler olsun.

## Örnek

`/read?page=1` → `Sayfa 1`, `Kıyı kasabası`; sonraki sayfa → `?page=2`, `Kayıp harita`.

## Sözleşme

- Yazılacak dosya: `PageReader.test.tsx`.
- Uygulamayı `@impl/PageReader` içinden import et.
- Test edilen ekran `/read` adresinde açılır. Kullanıcıya görünen düğme adı `Sonraki sayfa`dır.
