Arama senaryosu, kullanıcı yeni bir ifade yazdığında sonuçların ve URL’nin aynı aramayı göstermesini doğrulamalı.

## Gereksinimler

- /search sayfasını aç.
- Film ara adlı searchbox’a önce matrix yazıldığında iki sonuç görünmeli.
- Aynı alana başlangıç yazıldığında URL’nin q parametresi başlangıç olmalı.
- Başlangıç bağlantısı görünmeli ve sonuç listesinde tam bir listitem bulunmalı.
- Aranıyor… durumu sonuçlar geldikten sonra görünür olmamalı.
- Yavaş yanıt, eski sonuçların kalması, URL’nin güncellenmemesi, kalıcı yüklenme veya yetkisiz yanıt senaryoyu başarısız kılmalı.

## Örnek

matrix → Matrix ve Matrix Reloaded; ardından başlangıç → yalnızca Başlangıç. URL sorgusu ikinci ifadeyi taşır ve yüklenme mesajı kalkar.

## Sözleşme

- Dosya ve export: searchScenario.ts içinden searchScenario(page: Page): Promise<void> fonksiyonunu export et.
- Arama alanı searchbox rolü ve Film ara adıyla bulunur.
- Sonuç alanı Arama sonuçları adlı region; her sonuç listitem ve film adıyla link içerir.
- Yüklenme durumu Aranıyor… metnidir.
