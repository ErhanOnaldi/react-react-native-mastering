Popüler film rafında sıralama değişince favori işaretleri yanlış filmin üzerinde görünüyor. Düzenlemeden sonra her film sıralama ve favori ekleme/çıkarma boyunca kendi durumunu korumalı.

## Gereksinimler

- Verilen dört film başlığa göre Türkçe alfabetik sırada görünmelidir: Coyote Acme'ye Karşı, Oak Caddesi'nin Sonu, Örümcek-Adam: Yepyeni Bir Gün, Resident Evil.
- “Sıralamayı ters çevir” düğmesi görünür sırayı ters çevirmelidir.
- Her satırda film başlığı ve o filme ait “favori” düğmesi görünmelidir.
- Favori düğmesi seçimi `aria-pressed` ile belirtmelidir.
- Sıralama değişse de seçilmiş filmler aynı kalmalı; birini çıkarmak diğer favorileri etkilememelidir.

## Örnek

Resident Evil ve Coyote Acme'ye Karşı filmlerini favorile → sırayı ters çevir → iki düğme de basılı kalır ve aynı film satırlarıyla birlikte yer değiştirir.

## Sözleşme

- Dosya ve export: `MovieShelf.tsx` → named export `MovieShelf`
- Props: yok; popüler film verisi başlangıç kodunda sağlanır.
- Arayüz: liste öğeleri film başlığını, `[BAŞLIK] favori` adlı button'ı içerir; sıralama button'ının adı “Sıralamayı ters çevir”.
