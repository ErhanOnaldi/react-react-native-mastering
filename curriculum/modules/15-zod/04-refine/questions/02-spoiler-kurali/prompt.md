Yorumda spoiler seçilmişse kısa açıklama gönderilmesin; spoiler olmayan taslak boş kalabilsin.

## Gereksinimler
- body string, hasSpoiler boolean olmalı.
- hasSpoiler false iken boş body kabul edilmeli.
- hasSpoiler true iken trimlenmiş body en az 10 karakter olmalı.
- İlişki kuralının hatası body alanına bağlanmalı ve mesajı Spoiler açıklaması çok kısa olmalı.

## Örnek
{ body: "", hasSpoiler: false } kabul edilir. { body: "  kısa  ", hasSpoiler: true } reddedilir.

## Sözleşme
- review.ts dosyasında reviewSchema named export'unu tanımla.

