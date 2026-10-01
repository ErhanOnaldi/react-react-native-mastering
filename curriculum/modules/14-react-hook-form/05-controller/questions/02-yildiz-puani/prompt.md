Yorum formunda özel yıldız seçimi ve metin alanı birlikte gönderilsin. Seçim yapılmadan gönderime izin verme.

## Gereksinimler

- Puan başlangıçta `0` olsun; yalnız 1–5 arasındaki değerler geçerli.
- Puan seçilmeden gönderimde “Puan seç” mesajını `role="alert"` içinde göster ve callback'i çağırma.
- Yorum alanı boşsa “Yorum gerekli” mesajını aynı şekilde göster ve callback'i çağırma.
- Puan ve yorum birlikte `{ rating, body }` olarak gönderilsin.
- Seçilen yıldız düğmesinin erişilebilir adı “N yıldız” olsun ve seçiliyken `aria-pressed="true"` taşısın.

## Örnek

4 yıldız seç, `Harika` yaz, Gönder → `{ rating: 4, body: 'Harika' }`.

## Sözleşme

- Dosya ve export: `StarReviewForm.tsx` → named export `StarReviewForm`.
- Prop: `onSave(values: { rating: number; body: string }): void`.
- Arayüz: “Yorum” textbox'ı, “N yıldız” düğmeleri ve “Gönder” düğmesi.
