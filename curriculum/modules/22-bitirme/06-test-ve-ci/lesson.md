---
title: "Test stratejisi ve CI: güveni otomatikleştir"
minutes: 12
kind: project
---

# Test stratejisi ve CI: güveni otomatikleştir

:::pain[Problem]
Kendi bilgisayarında `pnpm dev` açıkken her şey harika çalışıyor gibi görünür: aramayı denedin, bir kitap ekledin, ekran yeşil. Ancak kodu GitHub'a gönderdiğinde arkadaşın projeyi klonluyor ve açar açmaz hata alıyor: TypeScript derlenmiyor, bir test unutulmuş, bir CSS dosyası üretim derlemesinde (`pnpm build`) eksik import yüzünden patlamış.

Bir yazılımın çalıştığına dair tek kanıt "benim makinemde çalışıyordu" cümlesi olamaz. Otomatikleşmemiş test ve denetlenmeyen derleme, üretime taşınan gizli bir saatli bombadır.
:::

Bu derste Kitaplık projesine çok katmanlı bir test stratejisi (Birim, RTL + MSW, Playwright E2E) kuruyor ve her kod push işleminde bu kontrolleri baştan sona yürüten bir GitHub Actions CI hattı inşa ediyorsun.

## Test Katmanları ve CI Zihinsel Modeli

Bir uygulamayı test ederken her şeyi her katmanda test etmeye çalışmak hem testleri aşırı yavaşlatır hem de kırılganlık yaratır:

:::model[Test katmanları]
Test piramidi üç ana kata ayrılır: tabanda çok hızlı ve ucuz **birim testleri** (saf fonksiyonlar, Zod şemaları, formatlayıcılar); ortada kullanıcı deneyimini taklit eden **bileşen ve entegrasyon testleri** (RTL + sahte ağ MSW); tepede ise gerçek tarayıcıda çalışan az sayıda kritik **uçtan uca (E2E) test** (Playwright).
:::

![Test piramidi ve CI kalite kontrol hattı](diagram:test-katmanlari)

Bu modeli şu temel kurallarla yönetirsin:

1. **Aynı davranışı üç katmanda kopyalama:** Bir Zod dönüşüm kuralını (örneğin kapak `-1` ise `null` yapma) birim testinde doğrula; E2E testinde tüm kitapların kapak mantığını tekrar test etmeye çalışma. E2E yalnızca kritik yolun (arama → detay → listeye ekle) entegrasyonunu doğrular.
2. **Gerçek ağa asla bağımlı olma:** Birim ve entegrasyon testlerinde MSW; E2E testlerinde `page.route` kullanarak dış ağ isteklerini deterministik verilerle karşıla. Gerçek Open Library veya harici sunucuya atılan testler ağ yavaşlığında patlar (flaky test).
3. **CI hattında derlemeyi mutlaka sına:** Sadece testleri koşturmak yetmez; `pnpm build` komutu çalıştırılmalı ve Vite'ın üretim paketi sorunsuz ürettiği kanıtlanmalıdır.
4. **Tanımsız istekleri hata say:** MSW yapılandırmasında `onUnhandledRequest: 'error'` kullanarak uygulamanın testler sırasında farkında olmadan bilinmeyen adreslere istek atmasını engelle.

## CI hattını adım adım izleyelim

Bir pull request açıldığında GitHub Actions sunucusunun izlediği doğrulama adımları:

| Sıra | İş akışı adımı | Çalışan komut | Amaç | Başarısızlık senaryosu |
| --- | --- | --- | --- | --- |
| 1 | Kod çekme ve ortam | `actions/checkout`, `pnpm/action-setup` | Depoyu ve pnpm ortamını hazırlar | Yanlış Node sürümü |
| 2 | Bağımlılık kurulumu | `pnpm install --frozen-lockfile` | `pnpm-lock.yaml` ile paketleri yükler | Lockfile uyuşmazlığı |
| 3 | Statik analiz | `pnpm lint && pnpm format:check` | Kod standartları ve kurallarını denetler | Biçim veya lint ihlali |
| 4 | Tip kontrolü | `pnpm typecheck` | TypeScript derleyicisi (`tsc -b`) | Tip uyumsuzluğu |
| 5 | Birim/Entegrasyon | `pnpm test` | Vitest + RTL + MSW testleri | İş mantığı kırılması |
| 6 | Üretim derlemesi | `pnpm build` | Vite üretim paketlemesi ve hash'li dosyalar | Eksik modül veya asset |
| 7 | E2E testleri | `pnpm test:e2e` | Playwright ile gerçek tarayıcı senaryoları | Rota veya kritik akış arızası |

## Kod örnekleri: Yanlış ve doğru test pratikleri

### Kırık örnek: Belirsiz bekleme ve kırılgan seçiciler

Aşağıdaki E2E testi ağ gecikmesine göre rastgele geçer veya kalır:

```ts
// TEHLİKE: Kırılgan test mantığı
import { test, expect } from '@playwright/test'

test('kitap aranır', async ({ page }) => {
  await page.goto('/')
  // HATA: CSS sınıfına veya iç DOM yapısına bağımlılık
  await page.locator('.search-input-wrapper > input').fill('Dune')
  await page.locator('button.btn-primary').click()

  // TEHLİKE: Yapay bekleme! Ağ 1001 ms sürerse test kalır!
  await page.waitForTimeout(1000)

  // HATA: Erişilebilir rol yerine div metni kontrolü
  expect(await page.locator('div.card-title').count()).toBeGreaterThan(0)
})
```

### Doğru örnek: Erişilebilir locator ve ağ taklidi

Kullanıcı gibi davranan, ağ isteklerini izole eden sağlam bir test kurgulayalım:

```ts
import { test, expect } from '@playwright/test'

test('kullanıcı kitap arar ve ilk sonuca tıklar', async ({ page }) => {
  // 1. Dış ağ isteğini page.route ile taklit et
  await page.route('**/search.json*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        numFound: 1,
        docs: [{ key: '/works/OL123W', title: 'Örnek Kitap', author_name: ['Test Yazarı'] }],
      }),
    })
  })

  // 2. Sayfayı aç ve kullanıcı gibi etkileşime gir
  await page.goto('/search')
  await page.getByRole('textbox', { name: 'Kitap ara' }).fill('Örnek')
  await page.getByRole('button', { name: 'Ara' }).click()

  // 3. Erişilebilir içerik üzerinden otomatik beklemeli assertion
  await expect(page.getByRole('link', { name: 'Örnek Kitap' })).toBeVisible()
})
```

Bu test:
- Ağ dalgalanmalarından etkilenmez.
- `waitForTimeout` içermez; Playwright element görünene kadar akıllıca bekler.
- CSS sınıflarına değil, kullanıcının gördüğü erişilebilir rollerine (`textbox`, `button`, `link`) güvenir.

## Sık karşılaşılan test ve CI hataları

:::mistake[CI hattında Playwright tarayıcı kurulumunu unutmak]
**Belirti:** Birim testler geçerken `pnpm test:e2e` adımında `Executable doesn't exist at /root/.cache/ms-playwright/chromium...` hatasıyla CI'ın çökmesi.  
**Neden:** Playwright Node paketini yüklemek tarayıcı ikililerini (Chromium) otomatik indirmez; CI ortamında açıkça kurulmalıdır.  
**Düzeltme:** CI workflow dosyasında `pnpm test:e2e` komutundan hemen önce `pnpm exec playwright install --with-deps chromium` adımını çalıştır.
:::

:::mistake[MSW handler'larında her sorguya aynı cevabı dönmek]
**Belirti:** Arama testlerinde yanlış sorgu veya olmayan kitap arandığında bile testlerin yeşil geçmesi ve gerçek arıza yakalayamaması.  
**Neden:** MSW handler'ı `q` veya `workId` parametrelerini okumadan statik tek bir nesne dönmüştür.  
**Düzeltme:** Handler içinde URL arama parametrelerini (`url.searchParams.get('q')`) denetle; bulunamayan id için 404 dönen gerçekçi bir sahte API modeli kur.
:::

:::sector[Sektörde CI/CD ve Test Kültürü]
Modern yazılım şirketlerinde bir özelliğin repoya birleşmesi (merge) için CI hattının tüm aşamalarından geçmesi zorunlu bir kuraldır (Branch Protection). Bir mühendisin yazdığı testler, yalnızca o anki kodu değil, 6 ay sonra başka bir ekip arkadaşının yapacağı refactor'da sistemin bozulmamasını güvenceye alır. Mülakatlarda CI pipeline deneyimi, yazılımcının sistem düşüncesine sahip olup olmadığını gösteren en güçlü sinyaldir.
:::

## Özet

- Test piramidi: Saf mantık için birim testleri, kullanıcı arayüzü ve MSW için entegrasyon testleri, kritik akışlar için Playwright E2E.
- Dış API'ler test ortamında daima taklit edilmeli; gerçek ağa istek atılmamalıdır.
- CI hattı lint, format, tip kontrolü, testler, üretim derlemesi (`build`) ve E2E adımlarını sırayla yürüterek tam kalite güvencesi sağlar.
- E2E testlerinde yapay bekleme süreleri (`waitForTimeout`) yerine erişilebilir roller ve otomatik beklemeli doğrulayıcılar kullanılır.

### Kendini yokla

1. **Soru:** Bir CI hattında `pnpm test` başarılı olmasına rağmen `pnpm build` neden başarısız olabilir?  
   **Cevap:** Çünkü Vitest testleri modülleri TypeScript ve JSX üzerinden doğrudan çalıştırabilir; ancak `vite build` sırasında unutulmuş bir tip uyumsuzluğu, eksik bir çevre değişkeni veya paketleme hatası ortaya çıkabilir. Bu yüzden CI'da üretim derlemesi mutlaka test edilmelidir.
2. **Soru:** MSW yapılandırmasında `onUnhandledRequest: 'error'` seçeneği neden hayati önem taşır?  
   **Cevap:** Eğer bir test sırasında bileşen beklenmeyen veya tanımsız bir adrese istek atarsa, MSW bunu sessizce gerçek ağa geçirmek yerine testi anında kırmızıya boyar. Böylece testlerin izole kaldığından ve sahte API'nin tam çalıştığından emin olunur.
