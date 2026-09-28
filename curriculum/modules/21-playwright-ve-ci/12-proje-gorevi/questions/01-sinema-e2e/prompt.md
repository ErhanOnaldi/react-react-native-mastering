Sinema’nın iki kritik kullanıcı yolculuğunu gerçek tarayıcıda koru: aramadan film ayrıntısına gitme ve oturum açıp izleme listesi oluşturma.

## Gereksinimler

- Ana sayfa → Ara → dövüş araması → Dövüş Kulübü ayrıntısı akışını yürüt.
- Boş oturumla /watchlists açıldığında kullanıcı giriş sayfasına yönlenmeli; girişten sonra liste sayfasına dönüp yeni liste kaydedilebilmeli.
- TMDB ve DummyJSON yanıtları test verisiyle sabitlenmeli; gerçek ağa bağımlılık olmamalı.
- TMDB isteğinde Authorization Bearer başlığı yoksa 401 dönmeli.
- Locator’lar erişilebilir rol ve adlara dayanmalı; sabit uyku olmamalı.
- Chromium ile Playwright testleri yerelde çalıştırılabilmeli.

## Örnek

Arama: Ana sayfa → Ara → dövüş → Dövüş Kulübü bağlantısı → detay başlığı.  
Oturum: /watchlists → /login → başarılı giriş → /watchlists → Hafta sonu listesi görünür.

## Sözleşme

- Proje: sinema.
- Config: projects/sinema/playwright.config.ts.
- E2E dosyaları: projects/sinema/e2e/search.spec.ts ve projects/sinema/e2e/auth-watchlist.spec.ts.
- Test komutları: projects/sinema/package.json içinde @playwright/test bağımlılığı ve Playwright’ı çalıştıran script bulunur.
- Playwright testleri e2e/ klasöründen yüklenir, uygulama http://localhost:5174 adresinde açılır.
- Arama senaryosunda rol/ad metinleri: Ara, Film ara, Dövüş Kulübü.
- Giriş senaryosunda alanlar: Kullanıcı adı, Parola, Liste adı; düğmeler: Giriş yap, Kaydet.

## Kısıtlar

- Giriş akışı boş oturumdan başlamalı; hazır storageState ile atlanmamalı.
- Test verisi testler arasında deterministik olmalı.
