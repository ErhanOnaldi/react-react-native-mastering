Önizlemede `Dövüş` yazıp hemen alanı `Matrix` olarak değiştir. `Matrix` sonucu önce geliyor; biraz sonra eski `Dövüş Kulübü` cevabı onu ekrandan siliyor. Ekranda son yazılan aramanın sonucu kalmalı.

## Gereksinimler

- `Film ara` alanı kullanıcı yazısını izler.
- `Dövüş` ve ardından `Matrix` yazıldığında iki arama isteği atılır.
- Hızlı dönen `Matrix` sonucu görünür.
- Eski `Dövüş` cevabı sonradan tamamlansa bile `Matrix` ekranda kalır.
- Eski sonuç listede tekrar görünmez.

## Örnek

`Dövüş` → hemen `Matrix`: cevap sırası `Matrix`, sonra `Dövüş` olsa bile listede yalnız güncel aramanın sonucu kalır.

## Sözleşme

- Dosya ve export: `MovieSearch.tsx` → `MovieSearch`
- Testler textbox'ı `Film ara` adıyla bulur.
- Testler `/3/search/movie` isteklerinin query sırasını `Dövüş`, `Matrix` olarak kontrol eder.

## Kısıtlar

- TMDB yetkilendirme başlığını koru.
