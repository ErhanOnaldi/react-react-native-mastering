---
title: "Her değişikliği CI’da doğrula"
minutes: 17
kind: concept
---

# Sinema testleri temiz makinede

Sinema’da E2E testi kendi bilgisayarında geçiyor. Pull request açıldığında CI ise “Executable doesn’t exist” diyor. Senin bilgisayarında Playwright daha önce Chromium’u indirmiş; CI runner’ı yepyeni olduğu için o tarayıcı dosyaları onda yok.

**CI** (*continuous integration*), her kod değişikliğinde otomatik kontrolleri temiz bir makinede çalıştırma yöntemidir. Bu makineye **runner** denir. Temiz runner’da yalnızca depodaki dosyalar bulunur; senin bilgisayarındaki `node_modules`, açık geliştirme sunucusu veya indirilmiş browser ona miras kalmaz.

## Önce ihtiyacı, sonra sırayı görelim

Bir testin çalışması için runner’da paketler kurulu olmalı. Repoda `pnpm-lock.yaml` adlı **lockfile** (kurulacak bağımlılıkların tam sürümlerini kaydeden dosya) bulunur. `pnpm install --frozen-lockfile` bu dosyadaki sürümleri kurar ve CI’ın sessizce farklı bağımlılıklara geçmesini engeller.

İlk örnekte yalnızca bu temiz başlangıcı kur:

```yaml title=".github/workflows/sinema.yml (parça)"
steps:
  - uses: actions/checkout@v4
  - run: pnpm install --frozen-lockfile
```

**Ne oldu, neden?** Önce kod depodan alındı, sonra lockfile’da kayıtlı paketler kuruldu. Runner daha önce kurulmuş paketlere güvenmediği için bu adım aynı depoyla tekrar edilebilir.

Paketten sonra tarayıcı gerektirmeyen kontrolleri çalıştırabiliriz. **Lint**, kodun belirlenen kurallara uyup uymadığını denetler; **typecheck**, TypeScript tip uyuşmazlıklarını arar. Bu kontroller hızlı ve browser açmadan çalışır. Hata burada bulunursa pahalı E2E aşamasına gerek kalmaz.

```yaml title=".github/workflows/sinema.yml (devamı)"
  - run: pnpm lint
  - run: pnpm typecheck
  - run: pnpm test
```

**Ne oldu, neden?** Kaynak ve tip sorunları önce kontrol edildi; ardından `pnpm test` birim ve React Testing Library testlerini çalıştırdı. Bunlar Playwright E2E’nin yerini almaz: küçük parçalar için hızlı geri bildirim verir, E2E ise gerçek browser’da kullanıcı yolculuğunu birleştirir.

## Tarayıcıyı ve E2E’yi ekle

Bir sonraki örnekte browser dosyasını da temiz runner’a kurup Sinema’nın arama sayfasını test edelim:

```yaml title=".github/workflows/sinema-e2e.yml (parça)"
steps:
  - run: pnpm install --frozen-lockfile
  - run: npx playwright install --with-deps chromium
  - run: npx playwright test tests/search.spec.ts
```

Playwright npm paketi, Chromium’un çalıştırılabilir dosyasıyla aynı şey değildir. `playwright install` browser dosyalarını indirir; Linux runner’da `--with-deps` gereken işletim sistemi kitaplıklarını da kurar. Bunlar yoksa E2E başlamadan executable hatası alırsın.

**Ne oldu, neden?** Temiz makine önce bağımlılıkları kurdu, sonra Chromium’u ve sistem kitaplıklarını aldı, en son test dosyasını browser’da çalıştırdı. E2E’den önce browser kurulması, testin var olmayan bir uygulama hatasını değil, hazır olmayan test ortamını işaretlemesini engeller.

| Sıra | Kontrol | Bulduğu sorun | Sonraki adım |
| --- | --- | --- | --- |
| 1 | Lockfile’a bağlı install | Kilit dosyasıyla paket tanımları uyuşmuyor | Workflow burada kalır |
| 2 | Lint ve typecheck | Kaynak kuralı veya tip hatası | Hızlı düzeltme yap |
| 3 | Vitest | Birim/UI davranışı bozuk | Hangi küçük davranışın değiştiğini incele |
| 4 | Production build | Üretim paketi üretilemiyor | Build hatasını düzelt |
| 5 | Browser install | Browser dosyası veya sistem kitaplığı eksik | E2E başlamaz |
| 6 | Playwright E2E | Birleşik kullanıcı yolu bozuk | Trace kanıtını incele |

**Ne oldu, neden?** Bu sırada ucuz ve browser gerektirmeyen kontroller daha önce; browser açan E2E daha sonra gelir. Build’i de ayrı kontrol edince geliştirme sunucusunda görünmeyen production import sorunu kullanıcı yolculuğuna gelmeden bulunur.

![Temiz CI makinesinde kurulum, hızlı kontroller, tarayıcı ve E2E sırası](diagrams/ci-kapi.svg "Başarısız adım bir sonrakini durdurur; test sırası nedeni daraltır.")

## Aynı sonucu üreten workflow

Şimdi bu parçaları tek bir workflow’da birleştirelim. Workflow, GitHub Actions’ın çalıştıracağı YAML dosyasıdır. Örnekte Sinema’nın script’leri `projects/sinema` içinde, lockfile ise monorepo kökündedir.

```yaml title=".github/workflows/sinema.yml"
name: Sinema checks
on: [push, pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 10 }
      - uses: actions/setup-node@v4
        with: { node-version: 24 }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        working-directory: projects/sinema
```

`working-directory`, o komutu hangi klasörde çalıştıracağını söyler. `pnpm install` kökte lockfile’ı görür; `pnpm build` ise Sinema’nın `package.json` dosyasını bulur. Lint ve Vitest adımlarını da projede tanımlı script’lerle build’den önce eklersin.

**Ne oldu, neden?** GitHub Actions push ve pull request’te temiz Ubuntu makinesi açtı. Önce runtime ve pnpm hazırlandı, sonra kök bağımlılıkları kuruldu; uygulama komutu Sinema’nın klasöründe çalıştı. Yanlış çalışma dizininde doğru komut bile `package.json` ya da config bulamayabilir.

CI’da **build**, kaynak koddan yayınlanabilir üretim dosyalarını çıkaran komuttur. `pnpm dev` geliştirme sunucusunu çalıştırabilirken build ayrı bir kod yolu ve yapılandırmayı kullanır. Bu nedenle build adımı, E2E yeşil olsa bile bulunabilecek production import hatalarını yakalar.

Workflow adımları sırayla çalışır; başarısız adım varsayılan olarak sonraki adımları durdurur. Bir E2E kalınca önceki dersteki trace’i CI loglarının yanında indirilebilir saklayabilirsin. Böyle dosya bir **artifact**’tır; upload ayarında başarısız işte de çalışmasına izin ver, yoksa tanı için gereken trace silinir.

:::mistake[Yerel kuruluma güvenmek]
**Belirti:** Test sende geçiyor ama temiz runner browser veya paket bulamıyor. → **Neden:** Yerel makinede önceden kurulmuş kaynaklara dayanılmış. → **Düzeltme:** Lockfile’a bağlı kurulumu ve Playwright browser kurulumunu workflow’a ekle.
:::

:::mistake[Her şeyi tek komutta toplamak]
**Belirti:** CI kırmızı, ama logda hatanın lint’ten mi testten mi geldiği belirsiz. → **Neden:** Kontroller tek script içinde birleştirilmiş. → **Düzeltme:** İhtiyaç olan kontrolleri ayrı adımlarda çalıştır; ilk başarısız adımı logda kolayca gör.
:::

:::info[Derinlemesine (isteğe bağlı)]
Workflow cache’i paketleri tekrar indirmenin süresini azaltabilir; cache lockfile değildir ve temiz kurulumun yerini tutmaz. Browser cache’i de ayrı yönetilebilir. Başarısız E2E dosyalarını sınırlı süre sakla ve sahte token kullan; gerçek sırları workflow dosyasına yazma.
:::

## Özet

- CI runner temiz makinedir; senin yerel kurulumuna güvenemez.
- Frozen install lockfile’daki sürümlere bağlı kalır.
- Lint, typecheck, Vitest, build, browser kurulumunu ve E2E’yi uygun sırada çalıştır.
- Playwright paketi kurulu olsa bile Chromium runner’da ayrıca kurulmalıdır.
- Adımları ayrı tut, E2E trace’ini başarısız koşuda da sakla.

**Yeni terimler**

- **CI:** Her değişikliği temiz makinede otomatik kontrol etme yöntemi.
- **Runner:** Workflow adımlarını çalıştıran CI makinesi.
- **Lockfile:** Bağımlılıkların kurulacağı tam sürümleri kaydeden dosya.
- **Lint:** Kodun belirlenen yazım ve kalite kurallarını denetleyen araç.
- **Typecheck:** TypeScript tiplerinin birbiriyle uyumlu olup olmadığını denetleme.
- **Artifact:** CI işinden sonra indirilebilir biçimde saklanan dosya.
- **Workflow:** CI’ın hangi olayda hangi adımları çalıştıracağını söyleyen dosya.

**Kendini yokla:** CI, “Executable doesn’t exist” diyor. Hangi kaynağı kurmayı unutmuş olabilirsin?  
*Cevap:* Playwright browser’ını ve Linux’ta gereken sistem kitaplıklarını.

**Kendini yokla:** Neden build’i E2E’den önce ayrıca çalıştırmak yararlı?  
*Cevap:* Production paketi üretilemeyen bir değişikliği daha geç ve pahalı browser adımından önce bulur.
