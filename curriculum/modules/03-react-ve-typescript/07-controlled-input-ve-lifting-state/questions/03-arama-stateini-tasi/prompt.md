Film arama alanı yazıldıkça Sinema kataloğunu başlığa göre daraltmalı. Alanı temizleyince üç film de dönmeli; eşleşme yoksa boş sonuç mesajı göster.

## Gereksinimler

- “Film ara” adlı textbox bulunmalıdır.
- Film başlığı eşleşmesi büyük/küçük harfe duyarsız olmalıdır.
- Yalnız eşleşen filmler görünmelidir.
- Alan temizlenince üç film görünmelidir.
- Eşleşme yoksa “Film bulunamadı” görünmelidir.

## Örnek

`kara` → yalnız “Kara Şövalye”; `Matrix` arayıp alanı temizle → Dövüş Kulübü, Kara Şövalye ve Matrix görünür.

## Sözleşme

- Dosya ve export: `SearchableMovies.tsx` → named export `SearchableMovies`
- Props yok; üç film bileşende sağlanır.
- Arayüz: “Film ara” textbox'ı ve eşleşen başlıklar `li` öğeleri olarak.
