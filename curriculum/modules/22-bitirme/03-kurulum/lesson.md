---
title: "Sıfırdan kurulum: araçlar birbirine değdiğinde"
minutes: 12
kind: project
---

# Sıfırdan kurulum: araçlar birbirine değdiğinde

:::pain[Problem]
Sinema’yı hazır bir iskeletle aldın; ESLint’i 8., Vitest’i 10., MSW’yi 11., Playwright’ı 21. modülde **teker teker** ekledin. Her biri tek başına kolaydı.

Hepsini aynı gün kurduğunda ise araçlar birbirine değer: `pnpm test` bir anda `e2e/smoke.spec.ts`’i de çalıştırmaya kalkar ve *“Playwright Test did not expect test() to be called here”* diye patlar. `@/` takma adı Vite’ta çalışır ama TypeScript kırmızı çizer. ESLint `playwright.config.ts`’te `process` tanımsız der. Kurulum bir kontrol listesi değil; parçaların **birbirine nasıl bağlandığını** bilmek.
:::

Bu derste Kitaplık’ın iskeletini, bütün kalite araçlarıyla birlikte sıfırdan kuruyorsun. Sıra önemli: her adım bir öncekinin üstüne oturur ve her adımın sonunda **bir şeyin çalıştığını görürsün**.

## Yol haritası

| # | Adım | Bitti sayılır, çünkü… |
| --- | --- | --- |
| 1 | Vite + React + TS iskeleti | `pnpm dev` açılıyor, `pnpm typecheck` sessiz |
| 2 | Tailwind v4 ve `@/` takma adı | Bir `bg-` class’ı ekranda görünüyor, `@/` import’u kırmızı değil |
| 3 | Router + Query ile uygulama iskeleti | `/` ve 404 sayfası açılıyor |
| 4 | ESLint + Prettier | `pnpm lint` ve `pnpm format:check` temiz |
| 5 | Vitest + RTL + MSW | İlk duman testi yeşil |
| 6 | Playwright | `pnpm test:e2e` gerçek tarayıcıda yeşil |

## 1. İskelet ve sürümler

REQUIREMENTS.md’nin bulunduğu klasöre Vite şablonunu kur:

```bash
pnpm create vite projects/kitaplik --template react-ts
```

Klasör boş olmadığı için ne yapacağını sorar: **Ignore files and continue** seç (belgelerin kalsın). Kurulumu hemen başlatmayı teklif ederse şimdilik **hayır** de.

Şablonun `package.json`’ı en son sürümleri yazar. Bu repo bir pnpm workspace’i ve platform testleri kökteki paketleri kullanır; iki farklı React kopyası olursa hook’lar çalışmaz. Bu yüzden sürümleri kökteki `pnpm-workspace.yaml` **catalog**’uyla aynı tut (görev metninde tam komutlar var).

:::tip[Şablonun lint seçimi]
Vite’ın güncel `react-ts` şablonu lint için ESLint yerine hızlı bir alternatif olan **oxlint** ile gelebilir. Biz 8. modülde öğrendiğin ESLint + typescript-eslint + react-hooks yığınını kuruyoruz; şablon oxlint getirdiyse config’ini ve paketini kaldır. Bu da küçük bir mimari karar — bir satırlık not olarak ADR’ne ekleyebilirsin.
:::

## 2. Tailwind v4 ve `@/` takma adı

Tailwind v4’te `tailwind.config.js` ve `postcss.config.js` **yok**; ayar CSS dosyasının içinde. `@/` takma adı ise iki yere yazılır, çünkü iki farklı araç dosyaları çözer: **TypeScript** (editör ve `tsc`) ve **Vite** (paketleme ve testler).

```ts title="vite.config.ts"
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
```

```jsonc title="tsconfig.app.json (ilgili kısım)"
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] } // TS 6: baseUrl yok, yol "./" ile başlar
  }
}
```

```css title="src/index.css"
@import 'tailwindcss';
```

:::mistake
Eski bir eğitimi izleyip `npx tailwindcss init -p` çalıştırmak ya da CSS’e `@tailwind base; @tailwind components;` yazmak. Bunlar Tailwind v3’tü; v4’te yerini tek satır `@import 'tailwindcss'` aldı. Aynı tuzak Router’da da var: `react-router-dom` paketi v8’de **kaldırıldı**; her şey `react-router`’dan, `RouterProvider` ise `react-router/dom`’dan gelir.
:::

## 3. Uygulama iskeleti: iki sözleşme dosyası

Testlerin (platformunkiler de, senin yazacakların da) uygulamanın tamamını bir URL’de render edebilmesi gerekiyor. Bunun için iki export sabit:

```tsx check title="src/app/providers.tsx"
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'

interface AppProvidersProps {
  queryClient: QueryClient
  children: ReactNode
}

/** Tüm global provider'lar tek yerde: main.tsx ve testler aynı ağacı kullanır. */
export function AppProviders({ queryClient, children }: AppProvidersProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
```

```tsx check title="src/app/routes.tsx (ilk hali)"
import type { QueryClient } from '@tanstack/react-query'
import { Outlet, type RouteObject } from 'react-router'

function RootLayout() {
  return <Outlet />
}

function HomePage() {
  return <h1>Kitaplık</h1>
}

function NotFoundPage() {
  return <h1>Sayfa bulunamadı</h1>
}

export function createRoutes(queryClient: QueryClient): RouteObject[] {
  // queryClient şimdilik kullanılmıyor; 5. derste loader'lar veriyi bununla önceden isteyecek
  void queryClient
  return [
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ]
}
```

Neden `routes` dizisi değil de **fabrika fonksiyonu**? Çünkü route’lar (loader’lar) bir `QueryClient`’a ihtiyaç duyabilir. `main.tsx` uygulamanın tek istemcisini verir, testler her testte **taze** bir istemci verir; önbellek testten teste taşmaz. Bu, 12. modülde tek bir global `queryClient` import etmenin test tarafındaki bedelini ortadan kaldırır.

```tsx title="src/main.tsx"
const queryClient = createQueryClient()
const router = createBrowserRouter(createRoutes(queryClient))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders queryClient={queryClient}>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
)
```

## 4. ESLint ve Prettier

8. modüldeki flat config’in aynısı; tek fark, React kurallarını sadece `src/`’ye uygulamak (config dosyaları Node’da çalışır):

```js title="eslint.config.js"
export default defineConfig([
  globalIgnores(['dist', 'coverage', 'test-results', 'playwright-report']),
  {
    files: ['**/*.{js,ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  { files: ['src/**/*.{ts,tsx}'], extends: [reactHooks.configs.flat.recommended] },
  { files: ['src/**/*.tsx'], extends: [reactRefresh.configs.vite] },
  prettier, // her zaman en sonda: biçim kurallarını kapatır
])
```

## 5. Vitest: ayar ayrı dosyada

Sinema’da test ayarları `vite.config.ts`’in `test` alanındaydı. Kitaplık’ta onları **`vitest.config.ts`**’e taşıyoruz ve uygulamanın Vite ayarını genişletiyoruz:

```ts title="vitest.config.ts"
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      exclude: [...configDefaults.exclude, 'e2e/**'], // Playwright senaryoları Vitest'in işi değil
    },
  }),
)
```

İki sebebi var. Birincisi **sorumluluk**: `vite.config.ts` uygulamanın nasıl paketleneceğini, `vitest.config.ts` testlerin nasıl çalışacağını anlatır. İkincisi **platform**: proje görevlerini çalıştırırken platform senin `vite.config.ts`’ini okur (takma ad ve eklentiler için) ama kendi test ortamını kurar. Test ayarların orada olursa (özellikle göreli `setupFiles` yolu) platformun testleri yanlış klasörde dosya arar.

`exclude` satırını unutursan acıyı hemen görürsün: Vitest varsayılan olarak `*.spec.ts` dosyalarını da test sayar ve Playwright’ın `test()`’ini kendi içinde çağırmaya çalışır.

Setup dosyası 11. modüldeki gibidir: jest-dom eşleştiricileri, RTL temizliği (`globals: false` olduğu için elle) ve **hata modunda** bir MSW sunucusu. Handler listesi şimdilik boş olabilir; 6. derste Open Library’yi taklit eden handler’ları ekleyeceksin.

## 6. Playwright

```ts title="playwright.config.ts"
export default defineConfig({
  testDir: 'e2e',
  use: { baseURL: 'http://localhost:5175' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm dev --port 5175 --strictPort',
    url: 'http://localhost:5175',
    reuseExistingServer: !process.env.CI,
  },
})
```

İlk seferde tarayıcıyı indir: `pnpm exec playwright install chromium`. `playwright.config.ts` ve `e2e/` klasörü uygulama kodu değil, Node’da çalışır; bu yüzden `tsconfig.node.json`’ın `include` listesine ekle ki `tsc -b` onları da denetlesin.

:::sector
Şirketlerde bu kurulum çoğu zaman bir şablon repodan ya da iç bir CLI’dan tek komutla gelir. Ama o şablonu yazan, bozulduğunda düzelten ve yeni bir aracı içine yerleştiren kişi olmak için kurulumu en az bir kez elle, parçaların neden birbirine bağlandığını anlayarak yapmış olmak gerekir. Bir de trend notu: Rust tabanlı araçlar (oxlint, Biome, Rolldown) hızla yayılıyor; ama sorulacak sorular aynı kalıyor — hangi araç hangi dosyadan sorumlu, kim kimi okuyor?
:::
