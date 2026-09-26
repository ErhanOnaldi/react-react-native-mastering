Kitaplık’ın iskeletini bütün araçlarıyla kur. Özellik yok; sadece **her şeyin çalıştığını kanıtlayan** bir temel.

## Kurulum komutları

```bash
pnpm create vite projects/kitaplik --template react-ts   # "Ignore files and continue"
cd projects/kitaplik

# Tarayıcıya giden kod
pnpm add react@^19.3.0 react-dom@^19.3.0 react-router@^8.4.0 @tanstack/react-query@^5.103.2 \
  react-hook-form@^7.88.0 @hookform/resolvers@^5.9.1 zod@^4.6.5

# Derleme ve stil
pnpm add -D typescript@~6.0.3 vite@^8.3.1 @vitejs/plugin-react@^6.1.1 tailwindcss@^4.3.3 \
  @tailwindcss/vite@^4.3.3 @types/react@^19.3.0 @types/react-dom@^19.3.0 @types/node@^24.13.3

# Lint ve biçim
pnpm add -D eslint@^10.11.0 @eslint/js@^10.0.1 typescript-eslint@^8.70.1 eslint-plugin-react-hooks@^7.1.1 \
  eslint-plugin-react-refresh@^0.5.7 eslint-config-prettier@^10.1.8 globals@^17.12.0 \
  prettier@^3.9.9 prettier-plugin-tailwindcss@^0.8.1

# Test
pnpm add -D vitest@^5.0.2 jsdom@^30.1.1 @testing-library/react@^16.3.3 @testing-library/dom@^10.4.2 \
  @testing-library/jest-dom@^7.0.1 @testing-library/user-event@^14.6.7 msw@^2.15.0 @playwright/test@^1.63.0
pnpm exec playwright install chromium
```

Sürümler kökteki `pnpm-workspace.yaml` catalog’undan: platform testleri aynı React kopyasını kullanmalı.

## Sözleşme

Testler aşağıdakileri kontrol eder. Dosyaların **içini nasıl düzenleyeceğin** sana kalmış.

| Dosya | Beklenen |
| --- | --- |
| `package.json` | `"type": "module"`, `"private": true`. Script’ler: `dev` (vite), `build` (`tsc -b && vite build`), `preview`, `typecheck` (`tsc -b`), `lint` (`eslint .`), `format` (`prettier --write .`), `format:check` (`prettier --check .`), `test` (`vitest run`), `test:e2e` (`playwright test`). Tarayıcıya giden paketler `dependencies`’te, araçlar `devDependencies`’te; `react-router-dom` yok. |
| `tsconfig*.json` | `src/main.tsx`’i derleyen config strict, `jsx: react-jsx`, `paths: { "@/*": ["./src/*"] }`. `tsc -b` hatasız. |
| `vite.config.ts` | React ve Tailwind eklentileri; `@` → `src` takma adı; **`test` alanı yok**. |
| `index.html` | `<html lang="tr">`, `<title>Kitaplık</title>` |
| `src/main.tsx` + CSS | İmport ettiği CSS dosyası `@import 'tailwindcss'` içerir; `@tailwind` direktifi ve `tailwind.config.js` yok. |
| `eslint.config.js` | Proje kökünde; TSX’te `react-hooks` (rules-of-hooks hata), typescript-eslint, `react-refresh` kuralları açık; `eslint-config-prettier` en sonda. `src`’de lint hatası yok. |
| Prettier ayarı | Proje kökünde (örn. `.prettierrc.json`); `src` altındaki dosyalar biçimli. |
| `vitest.config.ts` | `environment: 'jsdom'`, en az bir `setupFiles`; `e2e/` hariç tutulmuş. |
| Setup dosyası | `@testing-library/jest-dom/vitest`, `cleanup()`, MSW `server.listen({ onUnhandledRequest: 'error' })` |
| `src/**/*.test.tsx` | En az bir duman testi; `pnpm test` yeşil |
| `playwright.config.ts` | `testDir: 'e2e'`, `webServer` (komut + url/port); `e2e/` altında en az bir senaryo |
| `src/app/routes.tsx` | `export function createRoutes(queryClient: QueryClient): RouteObject[]` |
| `src/app/providers.tsx` | `export function AppProviders({ queryClient, children })` — en az `QueryClientProvider` |
| Sayfalar | `/` → h1 **Kitaplık**; tanımsız her adres → **Sayfa bulunamadı** |

## Önerilen ilk testler

```tsx title="src/app/App.test.tsx"
it('ana sayfada "Kitaplık" başlığını gösterir', () => {
  renderApp('/')
  expect(screen.getByRole('heading', { level: 1, name: 'Kitaplık' })).toBeInTheDocument()
})
```

```ts title="e2e/smoke.spec.ts"
test('ana sayfa açılır', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Kitaplık' })).toBeVisible()
})
```

## Çalıştır

Kendi komutlarınla dene, sonra platformun testlerini çalıştır:

```bash
pnpm typecheck && pnpm lint && pnpm format:check && pnpm test && pnpm test:e2e
```

:::info
Bu görevin testleri projenin araçlarını gerçekten çalıştırır (`vitest run`, `playwright test --list`), bu yüzden 20–60 saniye sürebilir. Kırmızı bir testin mesajı, çalıştırılan aracın son çıktı satırlarını içerir.
:::

Bitince commit’le: `git commit -m "chore(kitaplik): proje iskeleti ve araç zinciri"`.
