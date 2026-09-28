---
title: "Her değişikliği CI’da doğrula"
minutes: 14
kind: concept
---

# Testler CI’da da yeşil mi?

:::pain[Problem]
Bir rezervasyon akışını E2E testi yakalıyor; ama yalnızca kendi bilgisayarında çalıştırınca. Hatalı değişiklik test komutu çalışmadan main’e girdi. Üstelik CI’daki temiz makinede browser binary’si yüklü değil.
:::

## CI, temiz bir makinedeki tekrarlanabilir sıra

:::model[Kalite kapısı]
CI checkout’tan sonra uygulamayı kurar ve kontrolleri belirli sırada çalıştırır. Önce ucuz statik kontroller, sonra birim/entegrasyon testleri, en son tarayıcı gerektiren E2E koşar. Başarısız E2E için trace saklanır ki iş bittiğinde neden incelenebilsin.

![Temiz CI makinesinde kurulum, hızlı kontroller, tarayıcı ve E2E sırası](diagrams/ci-kapi.svg)
:::

Kesin kurallar:

1. **Lockfile’a bağlı kurulum** aynı bağımlılık ağacını her koşuda üretir.
2. **Lint ve typecheck erken çalışır.** Tarayıcı açmadan bulunabilecek hataları hızlıca gösterir.
3. **Vitest ayrı adımdır.** Unit ve RTL testleri Playwright’ın yerine geçmez; E2E de onları gereksiz kılmaz.
4. **Browser binary’si ve işletim sistemi bağımlılıkları** temiz runner’a ayrıca yüklenir.
5. **CI kendi server’ını başlatır.** Yerelde açık kalmış bir süreç testin yanlış uygulamaya bağlanmasına neden olmamalıdır.
6. **Trace başarısız koşulda artifact olarak saklanır.** Gizli token veya gerçek kullanıcı parolası workflow’a yazılmaz.

## Komutların sırasını izleyelim

CI bir sanal makineyi sıfırdan başlatır. Depoda kilit dosyası vardır ama node_modules yoktur; runner önce bağımlılıkları kurar. Daha sonra lint kaynak sorunlarını, typecheck tip uyuşmazlıklarını, Vitest davranış regresyonlarını arar. Son adımda Chromium kurulur, Playwright testleri uygulamayı başlatıp kritik yolculukları yürütür.

| Adım | Komut grubu | Ne zaman başarısız olur? | Sonraki adıma etkisi |
| --- | --- | --- | --- |
| 1 | Frozen install | Lockfile paket tanımlarıyla uyuşmaz | Kontroller başlamaz |
| 2 | Lint + typecheck | Kaynak kuralı veya tip bozuk | Hızlı düzeltme gerekir |
| 3 | Vitest | Birim/entegrasyon davranışı bozuk | E2E çalışmaz |
| 4 | Browser install | Binary veya sistem bağımlılığı eksik | Playwright açılmaz |
| 5 | Playwright | Birleşik kullanıcı yolu bozuk | Trace incelenir |

Kırık workflow yalnızca `pnpm test` ve `npx playwright test` çalıştırır. Bu, `test` script’inin ne yaptığına bağlı olarak lint/typecheck/build hatalarını atlayabilir; ayrıca Chromium henüz kurulmamış olabilir. CI adımlarını package script’lerine ve tarayıcı kurulumuna göre açıkça yaz.

Bir başka kırılma çalışma dizinidir. Install monorepo kökünde lockfile’ı görmelidir; Sinema script’leri ise Sinema’nın package.json dosyasının bulunduğu dizinde çalışmalıdır. Workflow bir dizinde pnpm install yapıp diğer projede Playwright config’ini ararsa hata uygulama kodunda değildir. Çalışma dizinini her adım için denetle.

GitHub Actions’ta workflow push ve pull request tetikleyicileriyle aynı dosyayı kullanabilir; iş (job) içindeki adımlar sıralı çalışır ve önceki adım başarısız olursa sonrakiler varsayılan olarak atlanır. Bu davranış hızlı hatalarda kaynak tüketimini azaltır. Artifact yükleme ise başarısız işte de çalışması gerektiğinden kendi koşulunu belirtmelidir. Retry sayısını artırmak, başarısız test kanıtını saklamanın yerine geçmez.

Kurulum cache’i yalnızca süreyi kısaltır; kilit dosyasının yerini almaz. Cache miss olduğunda workflow aynı bağımlılıkları yeniden kurabilmelidir. `--frozen-lockfile` CI’da lockfile değişikliğini sessizce kabul etmez; package.json değişti ama pnpm-lock.yaml güncellenmediyse iş erken ve belirgin biçimde kalır. Bu, geliştirici bilgisayarındaki node_modules durumunun sonucu etkilemesini önler.

Workflow başarısını yalnızca yeşil rozet olarak değil, hangi kanıtların toplandığıyla değerlendir. Lint kaynak biçimini ve kuralları, typecheck tip tutarlılığını, Vitest küçük davranışları, E2E kullanıcı yolculuğunu, build dağıtılabilir çıktının üretilebildiğini gösterir. Birini diğerinin yerine koyarsan görünmeyen hata sınıfı oluşur. Projede hangi kapıların olduğunu ve her birinin hangi riski azalttığını takım README’sinde kısa biçimde yazmak bakım işini kolaylaştırır.

## Önce bozulmayı gör, sonra workflow’u düzelt

Kırık sıra E2E’yi tarayıcı kurulumundan önce başlatır. CI “Executable doesn’t exist” der; daha uzun timeout eklemek browser executable üretmez. Doğru sıra kurulum → lint → typecheck → Vitest → browser install → E2E’dir.

E2E kalınca yalnızca terminaldeki son satır yeterli olmayabilir. Trace ilk retry’da üretiliyorsa test-results içeriğini artifact olarak yükle. Upload adımı önceki adım başarısız olduğunda da çalışmalıdır; yoksa en çok gerektiği anda dosya kaybolur. Artifact saklama süresini ekibin inceleme ihtiyacına göre sınırla.

## Workflow aynı adımları yeniden kurmalı

Bir workflow dosyası terminal kısayolu değildir. Her koşuda repo checkout edilir, runtime ve paket yöneticisi hazırlanır, lockfile’a bağlı bağımlılıklar kurulur, ardından kalite kapıları ayrı komutlar olarak çalışır. Ayrı adımlar logları okunur yapar ve ilk hatanın hangi kontrolde çıktığını gösterir.

Kırık workflow tarayıcı testi çalıştırır ama tarayıcıyı kurmaz:

~~~yaml
steps:
  - run: pnpm install --frozen-lockfile
  - run: npx playwright test
~~~

Temiz runner’da Playwright paketi kurulmuş olsa bile Chromium executable’ı olmayabilir. Linux browser’ı sistem kitaplıklarına da ihtiyaç duyar. Düzeltme, E2E’den önce Chromium ve sistem bağımlılıklarını kurmak ve hızlı kontrolleri önce çalıştırmaktır. Tek bir yeşil E2E satırından workflow’un tamamı doğru sonucunu çıkarma.

## Aynı komutlar, temiz makine

`.github/workflows/site-check.yml` dosyası push ve pull request sırasında komutları çalıştırır. Örnek web paketinde lint, typecheck, test ve build ayrı script’lerdir. Bağımlılık kurulumu için frozen lockfile kullan; E2E adımında Linux runner’a Playwright browser’ını ve sistem kitaplıklarını ayrıca yükle.

```yaml title=".github/workflows/site-check.yml"
name: Site checks
on: [push, pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
        working-directory: apps/site
      - run: pnpm typecheck
        working-directory: apps/site
      - run: pnpm test
        working-directory: apps/site
      - run: pnpm build
        working-directory: apps/site
```

Monorepo’da install repo kökünde, uygulama script’leri package.json’ın bulunduğu dizinde çalışabilir. E2E ayrı job veya sonraki step’te koşarsa o adımda browser binary’sini yükle ve Playwright config’in başlattığı app’in çalışma dizinini belirgin tut. Teste sahte env ver; gerçek token’ı workflow’a yazma.

## Sıra neden önemli?

Önce lint ve typecheck hızlı hata verir. Vitest bileşen davranışını sınar. Sonra Chromium kurulur ve E2E gerçek tarayıcıda router ile UI’yi birleştirir. Aynı senaryoların farklı katmanlarda tekrarı, farklı türde hataları yakalar.

Playwright JSON raporu için `npx playwright test --reporter=json` kullanabilirsin. CI’da okunabilir terminal çıktısı istiyorsan varsayılan reporter’ı koru; JSON’u ayrı artifact olarak yükle. Başarısız E2E koşusunda `test-results/` trace artifact’ı indirip önceki dersteki Trace Viewer’da aç.

Workflow’u ilk kez eklediğinde yalnızca YAML’ın sözdizimini değil, gerçek tetikleyiciyi ve checkout edilen dalı da dene. Pull request job’ında fork kodu için gizli secret’lar çoğu zaman erişilebilir değildir; bu nedenle E2E’nin sahte token ile açılması güvenilir bir varsayımdır. İş başlarken çalışma dizinini, Node/pnpm sürümlerini ve script adlarını logdan okuyabilmek tanıyı hızlandırır.

Bir CI job’ı başarısız olsa da sonraki job’lar çalışacak şekilde tasarlanmış olabilir. Buna ihtiyacın varsa dependency ve koşul ifadelerini dikkatle kur; aksi halde kullanıcı açısından başarılı görünen workflow başarısız quality gate’i saklayabilir. Temel projede basit sıralı job yeterlidir: her kapının çıkış kodu bir sonraki adıma geçişi belirlesin. Yayınlama gibi geri alınması zor adımları doğrulama job’ının yeşil olmasına bağla.

:::sector[Sektörde]
E2E sayısını kritik akışlarla sınırla: ana sayfa → arama → detay ve giriş → izleme listesi. Ayrıntılı kenar durumlarının çoğu Vitest/RTL katmanında daha hızlı ve kolay incelenir.
:::

:::mistake[CI’da yerel cache’e güvenmek]
**Belirti:** Geliştiricide geçen workflow temiz runner’da paket veya browser bulamaz. → **Neden:** Yerel makinede önceden kurulmuş kaynaklara dayanılmıştır. → **Düzeltme:** Lockfile ile kurulum ve browser yüklemesini workflow’a koy.
:::

:::mistake[Başarısız trace’i saklamamak]
**Belirti:** İş kırmızı ama trace indirilemiyor. → **Neden:** Artifact yükleme adımı yalnızca başarılı işte çalışıyor veya hiç eklenmemiştir. → **Düzeltme:** Başarısızlık koşulunda test-results klasörünü artifact yap.
:::

:::mistake[E2E’yi hızlı kontrollerden önce çalıştırmak]
**Belirti:** Basit tip hatası için tüm tarayıcı paketi beklenir. → **Neden:** Ucuz kontroller sona bırakılmıştır. → **Düzeltme:** Lint, typecheck ve Vitest’i E2E’den önce sırala.
:::

## Özet

- CI temiz runner’dır; yerel kurulumlara güvenemez.
- Frozen install lockfile ile tekrarlanabilir bağımlılık ağacı kurar.
- Lint, typecheck ve Vitest’i browser testlerinden önce çalıştır.
- Chromium’u ve gerekli sistem paketlerini ayrıca kur.
- Başarısız E2E trace’ini artifact olarak sakla.

**Kendini yokla:** CI’da Chromium executable bulunamadı. Hangi adım eksik?  
*Cevap:* Playwright browser ve sistem bağımlılığı kurulumu.

**Kendini yokla:** Trace upload neden failure koşulunda çalışmalı?  
*Cevap:* Başarısız testin kanıtı ancak başarısız koşuda gerekir.
