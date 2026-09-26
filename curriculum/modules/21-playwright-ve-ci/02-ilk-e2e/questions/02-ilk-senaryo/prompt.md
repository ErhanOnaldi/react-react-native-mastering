## Bağlam

İlk E2E senaryon: kullanıcı Sinema’yı açar ve bu haftanın trend filmlerini görür. Basit görünüyor, ama bir E2E testinin değeri **neyi kontrol ettiğinde**: yalnız başlığa bakan bir test, TMDB 401 dönüp liste hiç gelmediğinde de yeşil kalır.

## Bu platformda test nasıl koşuyor?

Testler gerçek bir Chromium açar. `playwright.config.ts`’in işini test altyapısı yapıyor:

| Gerçek projede | Bu görevde |
| --- | --- |
| `webServer` Sinema’yı başlatır | `sinema-app.ts` sahte Sinema’yı `https://sinema.test` adresinde sunar |
| `use.baseURL` | `https://sinema.test` |
| TMDB | `fake-api.ts` (sahte TMDB; 5. derste perdesi kalkacak) |

İki dosya da salt okunur. Sayfadaki rolleri ve metinleri görmek için `sinema-app.ts`’e bakabilirsin.

## Görev

`homeScenario(page)` fonksiyonunu bir E2E testinin gövdesi gibi yaz. Kontrollerin için `@playwright/test`’ten gelen `expect`’i kullan.

1. Ana sayfayı aç: adres **göreli** olsun (`'/'`); tam adres yazma.
2. `h1` başlığının **“Sinema”** olduğunu doğrula.
3. **“Bu haftanın trend filmleri”** başlığının göründüğünü doğrula.
4. Listede **“Dövüş Kulübü”** filminin göründüğünü doğrula (kart başlıkları `<h3>`).

## Senaryon neyle sınanacak?

| Uygulama | Senaryon ne yapmalı? |
| --- | --- |
| Çalışan Sinema | Hatasız bitmeli |
| Aynı Sinema, `https://staging.sinema.test` adresinde | Hatasız bitmeli (göreli adres) |
| TMDB token’ını unutan sürüm (401, liste yok) | **Hata fırlatmalı** |
| Başlığı “Vite + React” kalmış sürüm | **Hata fırlatmalı** |
| Açılışta çöken sürüm (boş sayfa) | **Hata fırlatmalı** |

Bozuk sürümleri yakalamak için ayrıca bir şey yapman gerekmez: `expect` koşulu 5 saniye içinde sağlanmazsa kendisi hata fırlatır.
