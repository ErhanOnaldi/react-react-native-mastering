Kütüphane kartındaki eylem düğmesi, form içinde kullanılsa bile formu göndermemeli. Düğme doğal HTML özelliklerini ve içeriğini çağırandan alabilmeli.

## Gereksinimler

- Verilen çocuk içerik gerçek button içinde görünmelidir.
- `disabled`, `aria-pressed` ve `onClick` gibi button özellikleri gerçek elemana aktarılmalıdır.
- Düğmeye tıklanınca verilen click callback çalışmalıdır.
- Düğme bir form içindeyken tıklama form submit'i başlatmamalıdır.
- Çağıran düğme türünü değiştirerek bu davranışı bozamamalıdır.

## Örnek

Form içindeki “Kaydet” düğmesine basınca kaydetme callback'i çalışır, form gönderimi çalışmaz.

## Sözleşme

- Dosya ve export: `FavoriteButton.tsx` → named export `FavoriteButton`
- Props: native button props; `type` çağıran için kapalıdır.
- Arayüz: `button` rolü, children adı ve aktarılan ARIA/disabled özellikleri.
