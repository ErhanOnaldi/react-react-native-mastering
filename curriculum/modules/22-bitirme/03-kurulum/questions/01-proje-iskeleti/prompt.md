Kitaplık uygulamasının temel araç zincirini (Vite, TypeScript, Tailwind, ESLint, Prettier, Vitest ve Playwright) sıfırdan kurup yapılandırman ve tüm kontrol komutlarının başarıyla çalıştığını kanıtlayan temiz bir uygulama iskeleti oluşturman gerekiyor.

## Gereksinimler

`projects/kitaplik/` dizininde şu yapılandırmaları ve iskeleti eksiksiz kur:

- **Paketler ve Script'ler (`package.json`):**
  - `"type": "module"` ve `"private": true` alanları.
  - Çalışma zamanı paketleri (`dependencies`): `react`, `react-dom`, `react-router`, `@tanstack/react-query`, `react-hook-form`, `@hookform/resolvers`, `zod`.
  - Geliştirme ve test paketleri (`devDependencies`): `typescript`, `vite`, `@vitejs/plugin-react`, `tailwindcss`, `@tailwindcss/vite`, `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `msw`, `eslint`, `typescript-eslint`, `eslint-plugin-react-hooks`, `prettier`, `@playwright/test`.
  - Script'ler: `dev`, `build` (`tsc -b && vite build`), `preview`, `typecheck` (`tsc -b`), `lint` (`eslint .`), `format` (`prettier --write .`), `format:check` (`prettier --check .`), `test` (`vitest run`), `test:e2e` (`playwright test`).
  - Çalışma zamanı paketleri `dependencies`, geliştirme ve test araçları `devDependencies` grubunda yer almalıdır.
- **TypeScript ve Vite Yapılandırması:**
  - `tsconfig.json` ve ilgili referans dosyaları strict modda, `jsx: react-jsx`, `@/*` → `./src/*` yol takma adıyla derlenmelidir (`tsc -b` hatasız olmalıdır).
  - `vite.config.ts`: React ve Tailwind eklentileri devrede olmalı, `@` takma adı çözülmelidir. Test yapılandırması bu dosyaya gömülmemelidir.
- **Biçimlendirme ve Kod Standartları:**
  - `eslint.config.js`: Proje kökünde flat config; TypeScript, React Hooks ve React Refresh kuralları açık olmalı; `eslint-config-prettier` en sonda yer almalıdır.
  - Prettier ayarları: Proje kökünde biçimlendirici yapılandırması bulunmalı; `src` dosyaları hatasız taranmalıdır.
- **Stil Altyapısı:**
  - `index.html` içinde `<html lang="tr">` ve `<title>Kitaplık</title>` tanımları bulunmalıdır.
  - Global CSS içinde `@import 'tailwindcss'` direktifi kullanılmalıdır (Tailwind v4 standardı; eski `@tailwind` direktifleri veya `tailwind.config.js` dosyası bulunmamalıdır).
- **Test Altyapısı:**
  - `vitest.config.ts`: `environment: 'jsdom'`, test setup dosyası referansı içermeli; `e2e/**` dizinini hariç tutmalıdır.
  - `src/test/setup.ts`: RTL `cleanup()`, `@testing-library/jest-dom/vitest` ve MSW sunucusunu dinleyen (`onUnhandledRequest: 'error'`) temizlik kancaları içermelidir.
  - `playwright.config.ts`: `testDir: 'e2e'`, `webServer` yapılandırması içermelidir.
  - En az bir Vitest duman testi (`src/**/*.test.tsx`) ve en az bir Playwright duman testi (`e2e/**/*.spec.ts`) yeşil çalışmalıdır.
- **Uygulama İskeleti:**
  - `src/app/routes.tsx`: `export function createRoutes(queryClient: QueryClient): RouteObject[]` export'u. Rota ağacında `/` ana sayfası (`h1` "Kitaplık") ve tanımsız rotalar için "Sayfa bulunamadı" çıktısı bulunmalıdır.
  - `src/app/providers.tsx`: `export function AppProviders({ queryClient, children }: ...)` export'u.
  - Şablon artığı dosyalar (`App.css`, demo sayaç kodu, logolar) temizlenmiş olmalıdır.

## Örnek

Bir duman testi senaryosu:

```tsx
it('ana sayfada "Kitaplık" başlığını gösterir', () => {
  renderApp('/')
  expect(screen.getByRole('heading', { level: 1, name: 'Kitaplık' })).toBeInTheDocument()
})
```

## Sözleşme

- Dışa aktarılan bileşen ve fonksiyon imzaları:
  - `src/app/routes.tsx` → `createRoutes(queryClient: QueryClient): RouteObject[]`
  - `src/app/providers.tsx` → `AppProviders({ queryClient, children }: { queryClient: QueryClient; children: React.ReactNode }): React.JSX.Element`
- Arayüz metinleri:
  - `/` yolunda seviye 1 başlık: `Kitaplık`
  - Tanımsız adreslerde: `Sayfa bulunamadı`
- Komut sözleşmesi:
  - `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, `pnpm test` ve `pnpm test:e2e` komutları başarıyla (sıfır hata) sonuçlanmalıdır.

## Kısıtlar

- `react-router-dom` paketi doğrudan kurulmamalıdır; React Router 8 standardında `react-router` paketi kullanılmalıdır.
- Vite test yapılandırması ayrı bir `vitest.config.ts` dosyasında tutulmalıdır.
