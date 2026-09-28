Puan formunda sunucu hata döndürdüğünde seçtiğin değer kayboluyor; yeniden denemeden önce aynı puanı tekrar seçmen gerekiyor.

## Gereksinimler

- Sunucu hatasından sonra seçili puan ekranda kalmalı.
- Hata mesajı görünür olmalı ve “kaydedilemedi” kelimesini içermeli.
- Aynı değerle tekrar gönderim yapılabilmeli; başarılı yanıtta “Puan kaydedildi” görünmeli.
- Başarılı gönderimden sonra hata mesajı kaldırılmalı.

## Örnek

9 puan seç → Gönder → sunucu hata cevabı verir → seçim 9 olarak kalır. Tekrar Gönder → başarılı cevap → “Puan kaydedildi”.

## Sözleşme

- Dosya ve export: `RatingForm.tsx` → named export `RatingForm`.
- Arayüz: “Puan” adlı seçim alanı, “Gönder” düğmesi; hata `role="alert"`, başarı görünür metin olarak bulunabilsin.
- Önizleme `Preview.tsx` üzerinden formu gösterir.
