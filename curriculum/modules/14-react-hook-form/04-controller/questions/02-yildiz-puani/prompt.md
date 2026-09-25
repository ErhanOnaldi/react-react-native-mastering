Sinema yorum formundaki özel yıldız seçimini RHF'ye bağla.

- `RatingStars` API'si `value`/`onChange` olarak kalsın.
- `Controller` ile `rating` alanını bağla; başlangıç 0, geçerli aralık 1–5.
- Puan seçilmeden submit edilirse “Puan seç” göster; `onSave` çağrılmasın.
- Yorum alanını `register` ile bağla. Seçilen puan ve metin birlikte gönderilsin.

Örnek: 4 yıldız, `Harika` → `{ rating: 4, body: 'Harika' }`.
