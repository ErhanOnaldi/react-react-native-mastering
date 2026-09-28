Kitap biçimi seçimini erişilebilir ve doğrulanabilir bir kontrol olarak kur. Kullanıcı bir biçim seçmeden kaydetmeye çalışırsa seçim alanına bağlı, okunabilir bir hata görmeli.

## Gereksinimler

- `Kitap biçimi` adlı bir seçim grubu ve `E-kitap`, `Basılı`, `Sesli` seçeneklerini göster.
- Seçenekler fareyle ve ArrowRight ile kullanılabilsin; seçilen radio `aria-checked="true"` taşısın ve focus alsın.
- Seçim yapılmadan `Kaydet` tıklanırsa `alert` rolünde hata göster; hata seçime ait erişilebilir açıklama olarak bağlansın.
- Geçerli seçim yapılınca hata kalksın.
- Kaydetme sonrası `Kaydedildi: {seçilen biçim}` metni gösterilsin.
- Kod içinde seçilen component API biçimini ve gerekçesini yorumla.

## Örnek

İlk durumda `Kaydet` → hata. ArrowRight ile `Basılı` seç → hata kaybolur. `Kaydet` → `Kaydedildi: Basılı`.

## Sözleşme

- `ChoiceControl.tsx` içinden named export `ChoiceControl`.
- Seçim grubu `radiogroup` rolü ve `Kitap biçimi` adı taşır.
- Kontroller `radio`; kaydet düğmesinin adı `Kaydet`; hata `alert` rolüyle görünür.
