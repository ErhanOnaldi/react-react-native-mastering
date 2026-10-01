İki arama ardı ardına geldiğinde yavaş kalan eski cevap ekrandaki yeni sonucu bozmamalı. `SearchTitle`, son verilen sorgunun sonucunu korusun.

## Gereksinimler

- İlk sorgu yavaş, ikinci sorgu hızlı döndüğünde ekranda ikinci sorgunun başlığı kalır.
- Eski cevap sonradan tamamlanırsa ekranı değiştirmez.
- Her sorgu için `/search/movie?query=...` isteği yetkilendirme başlığıyla yapılır.
- Boş sonuçta güvenli bir geri dönüş metni kullanılabilir.

## Örnek

`query="eski"` hemen ardından `query="yeni"` olur. Cevaplar ters sırayla bitse bile ekranda `Yeni Film` kalır.

## Sözleşme

- Dosya ve export: `SearchTitle.tsx` → `SearchTitle`
- Prop: `{ query: string }`
- Testler ekranda `Yeni Film` metninin eski cevap sonrası da kaldığını kontrol eder.
