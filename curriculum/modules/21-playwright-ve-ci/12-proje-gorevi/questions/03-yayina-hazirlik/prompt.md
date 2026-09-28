Sinema’nın E2E testleri yeşil, ancak bir kullanıcı `/movie/550` adresini doğrudan açınca 404 görüyor. Yayın dosyalarını ve hata bildirimini tamamla; yeni sürüm tarayıcıya ulaşsın, üretim hatası da izlenebilsin.

## Gereksinimler

- Bilinmeyen uygulama yolları başarılı HTML yanıtıyla açılır.
- Hash’li asset’ler bir yıl cachelenir; HTML her kullanımda yeniden doğrulanır.
- Sayfanın dış API bağlantıları TMDB ve DummyJSON için izinlidir; temel güvenlik başlıkları verilir.
- Hata bildirim adresi tanımlıysa hata ve bağlamı JSON olarak gönderilir. Tanımlı değilse hata konsola yazılır; raporlama hatası uygulamayı çökertmez.
- React tarafından yakalanan ve yakalanmayan kök hataları raporlanır. Üretim çıktısı, yayın sürümüyle eşleştirilebilecek gizli source map dosyaları üretir.

## Örnek

`/movie/550` yenilenince uygulama açılır. Yeni yayın `assets/index-b2.js` ürettiğinde tarayıcı yeniden doğruladığı HTML’den yeni adı öğrenir. Bir render hatası oluşunca kayıt, hatanın mesajı ve bileşen bağlamıyla gönderilir.

## Sözleşme

- `public/_redirects` statik host’un fallback kurallarını, `public/_headers` cache, CSP ve güvenlik başlıklarını içerir.
- `src/shared/lib/report-error.ts` dosyası `reportError(error: unknown, context?: Record<string, unknown>): Promise<void>` export eder.
- `src/main.tsx` React kökünde hata raporlamasını bağlar; `vite.config.ts` production build ayarlarını içerir.
- Hata adresi `VITE_ERROR_ENDPOINT` ile verilir. Bu adresi build sırasında erişilebilen istemci değeri olarak kabul et; gerçek sır koyma.

## Kısıtlar

- Hata raporu parolaları ve access token’ları taşımaz.
- Herhangi bir raporlama arızası ana kullanıcı akışına hata fırlatmaz.
- Hata adresi uygulamanın origin’i dışındaysa, o origin’e bağlantı iznini yayın CSP’sine ekle.
