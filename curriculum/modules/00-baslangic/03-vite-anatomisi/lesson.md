---
title: Bir Vite projesinin anatomisi
minutes: 9
---

# Bir Vite projesinin anatomisi

:::pain[Problem]
`pnpm dev` dedin, tarayıcıda bir sayfa açıldı. `index.html`'e bakıyorsun: içinde sadece **boş bir `<div id="root">`** var. Ekrandaki yazılar nereden geliyor?
:::

## İstekten ekrana: 4 adım

```
Tarayıcı ──GET /──▶ index.html ──<script src="/src/main.tsx">──▶ main.tsx ──render──▶ App.tsx
```

**1. `index.html` — giriş kapısı.** Vite'ta HTML dosyası projenin **kök girişidir** (eski araçlarda `public/` içine gömülüydü).

```html title="index.html"
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
```

**2. Vite dönüştürür.** Tarayıcı `.tsx` dosyası anlamaz. Vite, dosya **istendiği anda** TypeScript tiplerini siler ve JSX'i normal JavaScript'e çevirir. Bunu tüm projeyi paketlemeden, dosya dosya yaptığı için geliştirme sunucusu anında açılır.

**3. `main.tsx` — React'i bağlar.**

```tsx title="src/main.tsx"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

`createRoot`, boş `div`'i React'in yönettiği bir alana çevirir. `StrictMode` geliştirme sırasında bazı hataları erken yakalamak için bileşenleri bilinçli olarak iki kez çalıştırır (bunu Hook'lar modülünde göreceğiz).

**4. `App.tsx` — senin kodun.** Ekrandaki her şey buradan ve buradan import edilen bileşenlerden gelir.

## HMR: kaydet, gör

Bir bileşeni kaydettiğinde Vite sayfayı yenilemez; yalnızca değişen modülü tarayıcıya gönderir (**Hot Module Replacement**). React eklentisi (Fast Refresh) sayesinde bileşenin **state'i korunur**: sayaç 5'teyse, rengini değiştirdiğinde 5'te kalır.

## vite.config.ts

```ts title="vite.config.ts"
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()], // JSX + Fast Refresh, Tailwind
  envDir: '../..',                   // .env dosyasını repo kökünden oku
  server: { port: 5174 },
})
```

Vite'ın davranışını değiştiren her şey burada: eklentiler, port, yol takma adları (ileride `@/`), ortam değişkenlerinin konumu.

## Geliştirme ve production

| Komut | Ne yapar |
| --- | --- |
| `pnpm dev` | Geliştirme sunucusu: dosya bazında anlık dönüşüm, HMR. |
| `pnpm build` | Önce `tsc -b` (tip kontrolü), sonra `vite build`: tüm kodu küçültülmüş birkaç dosyaya paketler → `dist/`. |
| `pnpm preview` | `dist/` klasörünü yerelde sunar: "production'da nasıl görünecek?" kontrolü. |

:::info[Vite 8 ve Rolldown]
Vite 8 paketlemeyi Rust ile yazılmış **Rolldown**, TypeScript/JSX dönüşümünü **Oxc** ile yapar. Sen bunu sadece "çok hızlı" olarak hissedersin; config'te eskiden `esbuild` olan ayarların adı artık `oxc`.
:::

## `public/` ve import edilen dosyalar

- `public/favicon.svg` → olduğu gibi kopyalanır, `/favicon.svg` adresinden erişilir.
- `import poster from './poster.png'` → Vite dosyayı işler, adına hash ekler (`poster-a1b2c3.png`): tarayıcı önbelleği güncellemeleri kaçırmaz.

:::sector
Sektörde yeni React projelerinin büyük çoğunluğu artık `pnpm create vite` ile (ya da Next.js gibi bir framework ile) başlar. Eski `create-react-app` artık kullanılmıyor; karşına çıkarsa "eski proje" diye bil.
:::
