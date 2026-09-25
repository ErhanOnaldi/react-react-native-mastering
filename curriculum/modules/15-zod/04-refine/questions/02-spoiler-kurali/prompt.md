Yorum formunda spoiler işaretlendiyse metin en az 10 karakter olmalı. `reviewSchema` export et.

- `body`: string, `hasSpoiler`: boolean.
- Spoiler yoksa boş metne izin ver (taslak olabilir).
- Spoiler varsa trimlenmiş metin 10 karakterden kısa olduğunda hata yolu `body`, mesaj `Spoiler açıklaması çok kısa` olsun.
