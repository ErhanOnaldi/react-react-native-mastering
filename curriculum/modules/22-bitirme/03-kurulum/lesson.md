---
title: "Sıfırdan kurulum: araçlar birbirine değdiğinde"
minutes: 12
kind: project
---

# Sıfırdan kurulum: araçlar birbirine değdiğinde

:::pain[Problem]
Öğrenirken araçları tek tek tanıdın: Vite'ı ayrı bir derste, Vitest'i başka bir modülde, ESLint ve Tailwind'i kendi başlıklarında gördün. Hepsi izole ortamlarda mükemmel çalışıyordu.

Fakat boş bir klasörde `pnpm create vite` çalıştırıp hepsini aynı anda kurmaya kalktığında araçlar birbirine çarpar: TypeScript `@/` yolunu çözer ama Vite derleyicisi dosyayı bulamaz; `pnpm test` çalıştırdığında Vitest Playwright'ın E2E test dosyalarını çalıştırmaya çalışıp çöker; ESLint Tailwind v4'ün yeni CSS direktiflerine kızar. Araçların **birbirine değdiği yüzeyler** yapılandırılmadığında proje daha başlamadan kilitlenir.
:::

Bu derste modern bir React uygulamasının temel araç zincirini sıfırdan ayağa kaldırıyor; paket yönetimi, derleme, tip kontrolü, lint, biçimlendirme ve iki katmanlı test altyapısını tek bir tutarlı hatta birleştiriyorsun.

## Araç zincirinin katmanları ve zihinsel model

Bir frontend projesinde araçlar keyfi seçilmez; her birinin yaşam döngüsünde kesin bir görevi ve sınır çizgisi vardır.

![Kaynak koddan derleme, test ve yayın aşamalarına geçiş](diagram:build-ve-yayin)

Bu mimariyi şu temel kurallarla yönetirsin:

1. **Paket sorumluluğunu ayır:** Tarayıcıya gidecek ve son kullanıcının indireceği JavaScript paketleri (React, Router, TanStack Query, Zod) `dependencies` alanında yaşar. Yalnızca geliştirme, derleme ve test anında Node.js üzerinde çalışan araçlar (Vite, TypeScript, Vitest, Playwright, ESLint) `devDependencies` içinde olmalıdır.
2. **Derleme ile test ortamını ayır:** `vite.config.ts` tarayıcı paketi üretir; `vitest.config.ts` ise Node/jsdom üzerinde birim test koşturur. Test ayarlarını doğrudan `vite.config.ts` içine gömmek yerine ayrı tutmak hem derleme hızını korur hem de sorumlulukları ayırır.
3. **Yol takma adını (alias) iki yerde tanımla:** TypeScript'e `@/*` yolunu öğretmek (`tsconfig.app.json`) derleyicinin tip kontrolü yapmasını sağlar ancak Vite paketleyicisinin bu yolu çözebilmesi için `vite.config.ts` içinde `resolve.alias` tanımı da şarttır.
4. **Test katmanlarını izole et:** Vitest tarayıcı DOM'unu taklit eden jsdom üzerinde birim/entegrasyon testlerini koşturur; gerçek tarayıcı açan Playwright E2E testleri ise ayrı bir dünyadır. Vitest yapılandırmasında `e2e/**` dizini mutlaka hariç tutulmalıdır (`exclude`).

## Araç zincirini adım adım izleyelim

Kurulumu rastgele dosyalar açarak değil, kontrol edilebilir bir doğrulama sırasıyla yürütürsün:

| Sıra | Adım | Üretilen dosya | Doğrulama komutu | Beklenen başarı çıktısı |
| --- | --- | --- | --- | --- |
| 1 | Proje iskeleti ve paketler | `package.json` | `pnpm install` | Paketler kilitlenir, node_modules oluşur |
| 2 | Tip kontrolü ve derleme | `tsconfig*.json`, `vite.config.ts` | `pnpm typecheck` | `tsc -b` sıfır hatayla tamamlanır |
| 3 | Kod kalitesi ve biçim | `eslint.config.js`, `.prettierrc` | `pnpm lint && pnpm format:check` | Tüm dosyalar standartlara uygundur |
| 4 | Birim ve entegrasyon testi | `vitest.config.ts`, `src/test/setup.ts` | `pnpm test` | jsdom üzerinde duman testi yeşil döner |
| 5 | Uçtan uca (E2E) test | `playwright.config.ts`, `e2e/*.spec.ts` | `pnpm test:e2e` | Headless Chromium gerçek sayfayı açar |

## Örnekler: Yanlış ve doğru yapılandırma

### Kırık örnek: Test ayarlarının derleme yapılandırmasına gömülmesi

Aşağıdaki dosya Vitest ve Vite'ı tek bir yerde toplar ancak üretim derlemesinde tip hatalarına ve paketleme karmaşasına yol açar:

```ts
// TEHLİKE: vite.config.ts içine vitest ayarları kontrolsüz gömülmüş
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Vite build sırasında test alanı gereksiz yer kaplar ve tipleri kirletir:
  test: {
    globals: true,
    environment: 'jsdom',
    // HATA: e2e testleri dışlanmamış; pnpm test playwright testlerini koşturmaya çalışıp patlar!
  },
})
```

### Doğru örnek: Temiz ayrılmış yapılandırma

Üretim derleyicisi ile test koşucusunu iki ayrı dosyada yapılandırıp `mergeConfig` ile bağlayalım:

```ts
// vitest.config.ts — Test ortamı izole edilmiştir
import { defineConfig, mergeConfig } from 'vitest/config'
import { configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      // E2E testleri Vitest'in menzilinden çıkarılır:
      exclude: [...configDefaults.exclude, 'e2e/**'],
    },
  }),
)
```

## Sık karşılaşılan kurulum hataları

:::mistake[Yol takma adının (alias) yalnızca tsconfig'e yazılması]
**Belirti:** Editörde veya `pnpm typecheck` çalıştırıldığında hiçbir hata görülmez; ancak `pnpm dev` açıldığında tarayıcı konsolunda `Failed to resolve import "@/components/Header"` hatası patlar.  
**Neden:** `tsconfig.json` sadece statik tip denetimi yapar; çalışma zamanında modülü bulup getiren motor Vite'tır.  
**Düzeltme:** `vite.config.ts` dosyasına `resolve: { alias: { '@': path.resolve(__dirname, './src') } }` tanımını ekle.
:::

:::mistake[ESLint flat config sırasında prettier eklentisinin başa konması]
**Belirti:** Kod biçimlendirildiğinde ESLint kurallarının kodla savaşması ve çakışan girinti hataları fırlatması.  
**Neden:** `eslint-config-prettier`, ESLint'in stil ve biçim kurallarını devre dışı bırakır. Dizinin başında tanımlanırsa sonraki eklentiler bu kuralları tekrar aktif eder.  
**Düzeltme:** `eslint.config.js` yapılandırma dizisinde `eslint-config-prettier` kural setini daima **en son eleman** olarak yerleştir.
:::

:::mistake[Playwright CI ortamında sunucu bekleme hatası]
**Belirti:** Yerel makinede `pnpm test:e2e` sorunsuz çalışırken GitHub Actions CI hattında `webServer` zaman aşımı verip başarısız olması.  
**Neden:** Yerel ortamda açık kalan bir Vite dev sunucusu portu işgal ederken CI ortamında taze sunucunun açılması beklenir; `reuseExistingServer` bayrağı CI için `false` yapılmamıştır.  
**Düzeltme:** `playwright.config.ts` içinde `webServer: { reuseExistingServer: !process.env.CI }` kontrolünü sağla.
:::

:::sector[Sektörde şablonlar ve temel altyapı]
Kıdemli mühendislerin en değerli reflekslerinden biri, sıfırdan bir depo açıldığında ekibin geri kalanının rahat çalışabileceği "altın yolu" (Golden Path) kurmaktır. `pnpm typecheck && pnpm lint && pnpm test` zincirini tek bir komutta çalışabilir ve CI'da kırılamaz kılmak, projeyi haftalar sonra ortaya çıkacak uyumsuzluk maliyetlerinden kurtarır.
:::

## Özet

- Bağımlılıklar `dependencies` (çalışma zamanı) ve `devDependencies` (araçlar) olarak ayrılmalıdır.
- `tsconfig` tip kontrolü yaparken, `vite.config.ts` modül çözümlemesini üstlenir; takma adlar (alias) her iki tarafta da tanımlanmalıdır.
- `vitest.config.ts` bağımsız tutulmalı ve `e2e/**` dizini Vitest kapsamı dışında bırakılmalıdır.
- Temiz bir kurulum, tek bir script çalıştığında (`typecheck`, `lint`, `format:check`, `test`, `test:e2e`) sıfır uyarı ve sıfır hatayla tamamlanmalıdır.

### Kendini yokla

1. **Soru:** Bir React projesinde `react-router` paketi `devDependencies` alanına yazılırsa ne olur?  
   **Cevap:** Geliştirme ortamında çalışabilir; ancak üretim derlemesi alınıp sunucuya taşındığında veya bağımlılıklar budandığında (`pnpm install --prod`), tarayıcı paketi bağımlılığı bulamayacağı için çalışma zamanında çöker.
2. **Soru:** Vitest ayarlarında `e2e/**` klasörünü hariç tutmazsak ne yaşanır?  
   **Cevap:** Vitest, Playwright için yazılmış `*.spec.ts` dosyalarını kendi birim testi sanarak çalıştırmaya kalkar. Playwright'ın `page` fixture'ı jsdom ortamında bulunmadığı için testler anında hata verir.
