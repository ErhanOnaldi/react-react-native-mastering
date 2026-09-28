Popüler ve arama ekranlarında aynı film liste görünümünü kullan; ekranda değişen veri alma akışı ve ortak görünüm birbirinden bağımsız kalsın.

## Gereksinimler

- `Popüler` ve `Arama` düğmeleri ilgili ekranı gösterir.
- Arama ekranında accessible name'i `Film ara` olan alan bulunur; `Dövüş` yazıldığında `Dövüş Kulübü` görünür.
- Her iki ekranda başlıklar liste öğeleri olarak sunulur.
- Yükleme ve boş sonuç kullanıcıya anlaşılır biçimde bildirilir; istek hatası `alert` rolünde `yüklenemedi` ifadesini içerir.
- Aramadan popülere dönünce popüler liste çalışır.

## Örnek

Popüler ekranı aç → `Arama` seç → `Film ara` alanına `Dövüş` yaz → `Dövüş Kulübü` gör → `Popüler` seç → popüler film listesi görünür.

## Sözleşme

- Dosya ve export: `MoviePages.tsx` → named export `MoviePages`.
- Ekran düğmeleri accessible name `Popüler` ve `Arama`; arama alanının adı `Film ara`.
- Film başlıkları `<li>` semantiğiyle listelenir.
