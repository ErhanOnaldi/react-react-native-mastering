Film listesindeki kartları bulan yardımcılar, sayfanın görünür yapısı değiştiğinde de doğru filmi ve eylemi bulmalı.

## Gereksinimler

- Film başlıkları yalnızca Filmler adlı listedeki kartlardan, sayfa sırasıyla bulunmalı.
- Başlığı tam eşleşen film kartı bulunmalı; Matrix araması Matrix Reloaded kartını seçmemeli.
- Kartın favori düğmesi bulunmalı; düğme hem Favorilere ekle hem Favorilerden çıkar adıyla bulunabilmeli.
- Yardımcılar locator döndürmeli; kendi başlarına tıklama veya bekleme yapmamalı.
- Eski ve shadcn tabanlı görünümde aynı davranış korunmalı.

## Örnek

Film listesi Dövüş Kulübü, Başlangıç ve Matrix içerir. Başlık locator’ı bu listedeki üç başlığı döndürür; Matrix kartı tek eşleşmedir; Matrix Reloaded kartındaki favori düğmesi yalnızca o karta aittir.

## Sözleşme

- Dosya ve export: locators.ts içinden movieTitles(page: Page), movieCard(page: Page, title: string) ve favoriteButton(page: Page, title: string) fonksiyonlarını export et.
- Her fonksiyon Playwright Locator döndürür.
- Film listesi erişilebilir adı Filmler olan listedir; her kart listitem, başlık h3 ve favori kontrolü button rolündedir.
