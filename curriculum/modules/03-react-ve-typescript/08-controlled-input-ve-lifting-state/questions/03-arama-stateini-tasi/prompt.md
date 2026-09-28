Kitap rafındaki bir arama alanı yazıldıkça görünür kitapları başlığa göre daraltmalı. Arama temizlenince tüm kitaplar dönmeli; eşleşme yoksa açıklayıcı boş durum görünmelidir.

## Gereksinimler

- “Rafı ara” adıyla bir textbox bulunmalıdır.
- Verilen üç kitap için başlık eşleşmesi büyük/küçük harfe duyarsız olmalıdır.
- Arama sırasında yalnız eşleşen başlıklar görünmelidir.
- Input temizlenince üç kitap yeniden görünmelidir.
- Eşleşme yoksa “Film bulunamadı” yazmalıdır.

## Örnek

`"otel"` yaz → yalnız “Anayurt Oteli”; alanı temizle → üç kitap.

## Sözleşme

- Dosya ve export: `SearchableMovies.tsx` → named export `SearchableMovies`
- Props: yok; statik kitap verisi bileşen içinde sağlanır.
- Arayüz: “Rafı ara” textbox'ı ve eşleşen kitapları içeren `li` öğeleri.
