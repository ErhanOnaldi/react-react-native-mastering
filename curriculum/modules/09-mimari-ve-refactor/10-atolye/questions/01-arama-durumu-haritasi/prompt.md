Arama çalışma alanı paylaşılabilir olsun: adresi, sonucu ve gezinme geçmişini birlikte güncelle; geçici bilgi paneli gezinince kapansın.

## Gereksinimler

- Arama alanı accessible name olarak `Arama`, sayfa düğmeleri `Önceki sayfa` ve `Sonraki sayfa`, panel düğmesi `Bilgi` adlarını taşısın.
- Arama metni `q`, sayfa `page` parametresinde bulunsun; ilk sayfa 1 olsun.
- Arama değişince sayfa 1'e dönsün. Geri/ileri gezinince adres, input ve film sonuçları aynı seçimi göstersin.
- Bilgi düğmesi `Arama bilgisi` içeriğini açıp kapatsın; URL ile gezinme paneli kapatsın.
- Film başlıkları ile yüklenme ve hata halleri okunabilsin.
- Boş aramada istek gönderilmesin.

## Örnek

`/search?q=Matrix&page=2` açıldığında Matrix sonuçları görünür. `Dövüş` arayıp ileri/geri gezinirken adres ve film sonuçları seçili aramayla eşleşir. `Bilgi` açıkken URL değişince bilgi metni kapanır.

## Sözleşme

- Dosya ve export: `SearchWorkspace.tsx` → named export `SearchWorkspace`.
- Bileşen `/search` route'u altında router ile render edilir.
- Accessible name'ler gereksinimlerdeki metinlerle birebir eşleşir.

## Kısıtlar

- URL'deki `q` ve `page` seçimleri tek doğruluk kaynağı olarak kalsın.
