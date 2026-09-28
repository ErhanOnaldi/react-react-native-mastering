Pekiştirme ekranında kullanıcı arama alanına yazdığında film başlıkları listelenmeli. Input temizlenince eski sonuçlar ekranda kalmamalı.

## Gereksinimler

- Ekranda `Film ara` adlı bir textbox bulunur.
- Kullanıcı `Matrix` yazınca cevap sonrası `Matrix` başlığı görünür.
- Input temizlenince eski `Matrix` sonucu ekrandan kalkar.
- Boş sorgu için yeni arama sonucu gösterilmez.
- Hızlı değişimlerde bekleyen zamanlayıcı ve ağ işi ekrana eski veri yazmamalı.
- TMDB araması yetkilendirme başlığıyla yapılır.

## Örnek

Kullanıcı `Matrix` yazar → listede `Matrix` görünür. Kullanıcı input'u temizler → listede `Matrix` kalmaz.

## Sözleşme

- Dosya ve export: `SearchPage.tsx` → `SearchPage`
- Testler textbox'ı `Film ara` erişilebilir adıyla bulur.
- Testler arama endpoint'ine en az bir istek atıldığını ve eski sonucun temizlendiğini kontrol eder.
