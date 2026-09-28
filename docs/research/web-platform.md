# Web Platformu Notları — Eylül 2026

HTTP, CORS, HTTP cache, güvenlik, yayına alma, Web Vitals, i18n, animasyon ve tarayıcı araçları için müfredatın dayandığı bilgiler. Bunlar kütüphane sürümüne değil web standartlarına (Fetch, HTTP Caching RFC 9111, CSP 3, Intl) bağlıdır; yine de burada olmayan, sürüme ya da tarayıcıya özgü bir iddiayı derse yazma. Emin değilsen konuyu dar tut.

## 1. HTTP temelleri
- İstek: yöntem (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`), URL, başlıklar, gövde. Cevap: durum kodu, başlıklar, gövde.
- Durum aileleri: 2xx başarı (200, 201 Created, 204 No Content), 3xx yönlendirme ve 304 Not Modified, 4xx istemci hatası (400, 401 kimlik yok/geçersiz, 403 yetki yok, 404, 409, 422, 429), 5xx sunucu hatası.
- `fetch` yalnızca **ağ hatasında** (DNS, bağlantı, CORS engeli, abort) reddeder. 404 ve 500 cevapları **resolve** olur; `response.ok` (200–299) kontrolü senin işindir.
- `response.json()` gövdeyi bir kez okur; ikinci okuma hata verir. Gövdesiz 204'te `json()` çağırma.
- Idempotent yöntemler: `GET`, `PUT`, `DELETE` (tekrarlamak sonucu değiştirmez); `POST` değildir. Otomatik yeniden deneme bu yüzden genelde okuma isteklerine uygulanır.

## 2. Same-origin policy ve CORS
- Origin = şema + host + port. `http://localhost:5173` ile `http://localhost:5000` **farklı** origin'dir.
- Tarayıcı, başka origin'e giden isteğin cevabını JavaScript'e ancak sunucu izin verirse açar. CORS bir **tarayıcı** kuralıdır; `curl`, Postman veya sunucudan sunucuya istekler CORS'a takılmaz. CORS bir güvenlik duvarı değil, tarayıcının okuma izni mekanizmasıdır.
- Basit istek: `GET`/`HEAD`/`POST`, yalnızca CORS-safelisted başlıklar ve `Content-Type` şu üçünden biri: `application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain`. Diğer her şey (ör. `Authorization` başlığı, `Content-Type: application/json`, `PUT`/`DELETE`) önce **preflight** (`OPTIONS`) ister.
- Preflight isteğinde `Origin`, `Access-Control-Request-Method`, `Access-Control-Request-Headers` gider. Sunucu `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`, isteğe bağlı `Access-Control-Max-Age` ile cevaplar.
- Çerez/kimlik bilgisi: istemcide `fetch(url, { credentials: 'include' })`; sunucuda `Access-Control-Allow-Credentials: true` **ve** `*` olmayan, açık bir `Access-Control-Allow-Origin` gerekir. `*` ile credentials birlikte çalışmaz.
- JavaScript'in okuyabileceği cevap başlıkları sınırlıdır; özel başlıklar için sunucu `Access-Control-Expose-Headers` göndermelidir.
- CORS hatasında JavaScript ayrıntı görmez: `fetch` `TypeError` ile reddeder, ayrıntı yalnızca Console'da görünür.
- Çözüm yerleri: (a) API sunucusunda CORS politikası; (b) geliştirmede Vite `server.proxy` ile aynı origin'e taşımak (`/api` → `http://localhost:5000`); (c) prod'da API'yi aynı origin arkasına koymak (reverse proxy).
- ASP.NET Core örneği (kavramsal; öğrenci ileride backend'i orada yazacak):
  ```csharp
  builder.Services.AddCors(o => o.AddPolicy("frontend", p =>
      p.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod()));
  app.UseCors("frontend");
  ```
  Kimlik çerezi gerekiyorsa `.AllowCredentials()` eklenir ve `AllowAnyOrigin()` ile birlikte kullanılamaz.

## 3. HTTP cache (RFC 9111)
- Tarayıcı cache'i HTTP cevaplarını başlıklara göre saklar; uygulama içi cache (TanStack Query) ise JavaScript belleğindeki veridir. İkisi ayrı katmandır.
- `Cache-Control` yönergeleri: `max-age=N` (N saniye taze), `s-maxage` (paylaşılan cache/CDN için), `no-cache` (saklanabilir ama her kullanımdan önce **doğrulanmalı**), `no-store` (hiç saklama), `private` (yalnızca tarayıcı), `public`, `immutable` (taze süresince yeniden doğrulama yok), `stale-while-revalidate=N` (bayat cevabı gösterip arka planda yenile), `must-revalidate`.
- Doğrulama: sunucu `ETag` (veya `Last-Modified`) gönderir; bayatlayınca tarayıcı `If-None-Match` (veya `If-Modified-Since`) ile sorar; değişmediyse **304 Not Modified** (gövdesiz) gelir ve saklı gövde kullanılır.
- `Vary` başlığı cache anahtarına hangi istek başlıklarının gireceğini söyler (ör. `Vary: Accept-Language`).
- `fetch` `cache` seçeneği: `default`, `no-store`, `reload`, `no-cache`, `force-cache`, `only-if-cached`.
- SPA yayını için standart politika: hash'li dosyalar (`/assets/index-3f9a1c.js`) → `Cache-Control: public, max-age=31536000, immutable`; `index.html` → `Cache-Control: no-cache`. Yeni sürümde dosya adı değiştiği için eski dosyayı uzun süre cache'lemek güvenlidir; `index.html` ise her seferinde doğrulanmalıdır.
- DevTools Network sekmesinde "Disable cache" yalnızca DevTools açıkken geçerlidir; `(disk cache)`/`(memory cache)` ve 304 satırları cache'in çalıştığını gösterir.

## 4. Güvenlik
- **XSS**: React, JSX içindeki metni HTML olarak değil metin olarak ekler (kaçışlar). Riskli yerler: `dangerouslySetInnerHTML`, kullanıcıdan gelen URL'nin `href`/`src`'e konması (`javascript:` şeması), `eval`/`new Function`, DOM'a doğrudan `innerHTML` yazmak, üçüncü parti script'ler. URL'leri `new URL(value, location.origin)` ile ayrıştırıp protokolü izin listesine (`http:`, `https:`, gerekirse `mailto:`) göre kontrol et. HTML göstermek zorundaysan sanitize kütüphanesi (ör. DOMPurify) kullanılır; bu repoda kurulu değildir, derste kavram olarak anlatılır.
- React 19 Trusted Types'ı destekler (CSP `require-trusted-types-for 'script'` ile ilgili; ayrıntı `react-ecosystem.md`).
- **CSP**: `Content-Security-Policy` cevap başlığı. Örnek: `default-src 'self'; script-src 'self'; img-src 'self' https://image.tmdb.org data:; connect-src 'self' https://api.themoviedb.org; frame-ancestors 'none'; object-src 'none'; base-uri 'self'`. Satır içi script'i engeller; gerekiyorsa nonce/hash. `frame-ancestors` clickjacking'e karşıdır (eski yöntem `X-Frame-Options: DENY`). `Content-Security-Policy-Report-Only` ile önce kırmadan ölçülür. Vite dev sunucusu HMR için satır içi stil/script kullanır; sıkı CSP genelde prod yayınında (host başlıkları) uygulanır.
- Diğer başlıklar: `Strict-Transport-Security` (HTTPS zorunlu), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`.
- **Çerezler**: `HttpOnly` (JS okuyamaz → XSS token çalamaz), `Secure` (yalnızca HTTPS), `SameSite=Lax|Strict|None` (`None` için `Secure` şart). Modern tarayıcılarda `SameSite` belirtilmezse `Lax` varsayılır.
- **CSRF**: tarayıcı çerezleri otomatik gönderdiği için çerezle kimlik doğrulayan API'lerde başka siteden tetiklenen istek risklidir. Savunmalar: `SameSite`, CSRF token (ASP.NET Core'da antiforgery), durum değiştiren işlemlerin `GET` olmaması. `Authorization: Bearer` başlığıyla çalışan API'ler CSRF'e karşı doğal olarak daha dirençlidir ama token'ı XSS'e açık bir yerde tutma riski doğar (bkz. 17. modül token saklama).
- **Sırlar**: Vite yalnızca `VITE_` önekli değişkenleri istemciye açar ve bunlar build sırasında koda **gömülür**; bundle'ı açan herkes görür. `VITE_` değişkenine gerçek sır (ödeme anahtarı, veritabanı parolası) koyma; sır gerektiren çağrı backend'den yapılır. TMDB okuma token'ı gibi herkese açık kullanım için tasarlanmış anahtarlar bile kota/kötüye kullanım riski taşır.
- **Açık yönlendirme (open redirect)**: `?redirect=` gibi parametreyi doğrulamadan `navigate` etmek saldırganın kullanıcıyı başka siteye göndermesine yol açar. Yalnızca `/` ile başlayan ve `//` ile başlamayan uygulama içi yolları kabul et.
- **Bağımlılık güvenliği**: lockfile commit'lenir; CI'da `pnpm install --frozen-lockfile`; `pnpm audit` bilinen açıkları listeler. pnpm 10 bağımlılıkların kurulum script'lerini varsayılan olarak çalıştırmaz (izin `onlyBuiltDependencies` ile verilir); `minimumReleaseAge` ayarı çok yeni yayınlanmış sürümleri bekletir (tedarik zinciri saldırılarına karşı).

## 5. Yayına alma (statik SPA)
- `vite build` → `dist/` (ör. `dist/index.html`, `dist/assets/index-<hash>.js`, `-<hash>.css`). `vite preview` bu çıktıyı yerelde prod gibi sunar (dev sunucusu değildir).
- Ortam değişkenleri build anında çözülür: `.env`, `.env.production`, `import.meta.env.MODE`, `import.meta.env.PROD`/`DEV`. Farklı ortam için farklı build gerekir (ya da çalışma zamanında `/config.json` okumak gibi bir desen).
- `base` seçeneği uygulama alt yolda yayınlanacaksa (`/sinema/`) gerekir.
- **SPA fallback**: `/movie/550` gibi derin bir URL yenilendiğinde sunucuda böyle bir dosya yoktur; host tüm bilinmeyen yolları `index.html`'e yönlendirmelidir. Netlify ve Cloudflare Pages aynı biçimi destekler:
  - `public/_redirects` → `/*  /index.html  200`
  - `public/_headers` →
    ```
    /assets/*
      Cache-Control: public, max-age=31536000, immutable
    /index.html
      Cache-Control: no-cache
    ```
  `public/` içindeki dosyalar build'de `dist/` köküne kopyalanır. Vercel aynı işi `vercel.json` içinde `rewrites`/`headers` ile yapar; GitHub Pages SPA fallback'i desteklemez (`404.html` hilesi gerekir).
- Preview deploy: her PR için ayrı geçici URL (Netlify/Vercel/Cloudflare özelliği); E2E testleri bu URL'e karşı koşturulabilir.
- Source map: `build.sourcemap: 'hidden'` map dosyası üretir ama bundle'da referans vermez; hata izleme servisine yüklenir, kullanıcıya açılmaz.

## 6. Hata izleme
- React 19 kök seçenekleri: `createRoot(container, { onUncaughtError, onCaughtError, onRecoverableError })`. `onCaughtError` bir Error Boundary'nin yakaladığı hatalar, `onUncaughtError` yakalanmayanlar için çağrılır; ikisi de `(error, errorInfo)` alır ve `errorInfo.componentStack` içerir.
- React dışı hatalar: `window.addEventListener('error', …)` ve `window.addEventListener('unhandledrejection', …)`.
- Raporu göndermek: sayfa kapanırken de gitsin diye `navigator.sendBeacon(url, body)`; olmazsa `fetch(url, { method: 'POST', keepalive: true })`.
- Sentry, Datadog RUM gibi servisler bunları hazır yapar (release etiketi, source map, kullanıcı bağlamı, örnekleme). Bu repoda kurulu değil; kavram olarak anlatılır, kendi küçük `reportError` yardımcısı yazılır.

## 7. Web Vitals
- **LCP** (Largest Contentful Paint): en büyük içerik öğesinin boyanma süresi. İyi ≤ 2,5 sn, kötü > 4 sn.
- **INP** (Interaction to Next Paint): sayfa ömrü boyunca etkileşimlerden bir sonraki boyamaya kadar geçen sürenin (en kötüye yakın) değeri. İyi ≤ 200 ms, kötü > 500 ms. Mart 2024'te FID'in yerini aldı.
- **CLS** (Cumulative Layout Shift): beklenmeyen yerleşim kaymalarının skoru. İyi ≤ 0,1, kötü > 0,25. Kullanıcı girdisinden hemen sonraki kaymalar (`hadRecentInput`) sayılmaz.
- Değerlendirme gerçek kullanıcı verisinin 75. yüzdeliğine göre yapılır (field data). Lighthouse ve DevTools Performance paneli laboratuvar ölçümüdür (lab data); ikisi farklı sayılar verebilir.
- Tarayıcı API'si: `new PerformanceObserver(cb).observe({ type: 'largest-contentful-paint', buffered: true })`, `'layout-shift'`, `'event'`. Sektörde genelde `web-vitals` paketi (`onLCP`, `onINP`, `onCLS`) kullanılır; bu repoda kurulu değil.
- İyileştirme örnekleri: LCP görseline `fetchpriority="high"` ve lazy yüklememek; ekran dışı görsellere `loading="lazy"`; görsellere `width`/`height` (veya `aspect-ratio`) vererek CLS'i önlemek; fontta `font-display: swap`; uzun görevleri bölmek, `useTransition`/`useDeferredValue` ile INP'yi korumak; bundle'ı route bazlı bölmek.

## 8. Uluslararasılaştırma (Intl)
- `Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' })`, `{ notation: 'compact' }`, `{ style: 'percent' }`.
- `Intl.DateTimeFormat('tr-TR', { dateStyle: 'long' })`, `Intl.RelativeTimeFormat('tr-TR', { numeric: 'auto' })` (`dün`, `3 gün önce`).
- `Intl.PluralRules('tr-TR')` kategorileri `one` (yalnızca 1) ve `other`'dır (Node 24 ile doğrulandı). Türkçede sayıdan sonra isim çoğul çekilmediği için iki kategoride de metin çoğu zaman aynıdır ("1 film", "3 film"); İngilizcede farklıdır ("1 movie", "3 movies"). Arapça gibi dillerde 6 kategori vardır; mesaj seçimini `if (n === 1)` ile koda gömmek yerine kurallara bırak.
- Doğrulanmış çıktılar (Node 24): `new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(1234.5)` → `₺1.234,50`; `{ notation: 'compact' }` ile `1234567` → `1,2 Mn`; `new Intl.RelativeTimeFormat('tr-TR', { numeric: 'auto' }).format(-1, 'day')` → `dün`.
- `Intl.Collator('tr')` / `a.localeCompare(b, 'tr')` Türkçe alfabe sırasını doğru uygular; varsayılan `sort()` UTF-16 kod birimine göre sıralar. Doğrulanmış: `['şeker','çay','zeytin','ıhlamur','ilaç'].sort()` → `['ilaç','zeytin','çay','ıhlamur','şeker']`; `Collator('tr')` ile → `['çay','ıhlamur','ilaç','şeker','zeytin']`.
- Türkçe büyük/küçük harf: `'i'.toUpperCase()` → `'I'`, ama `'i'.toLocaleUpperCase('tr-TR')` → `'İ'`; `'I'.toLocaleLowerCase('tr-TR')` → `'ı'`. Arama/karşılaştırmada dil duyarlı dönüşüm kullan.
- `Intl.ListFormat`, `Intl.DisplayNames`, `Intl.Segmenter` da vardır.
- Mesaj katalogları: `{ tr: { 'movie.count': ... }, en: {...} }` biçiminde, anahtarları tipli (`keyof typeof messages.tr`). Sektörde react-i18next, FormatJS (react-intl), Lingui kullanılır; bu repoda kurulu değil.
- `<html lang="tr">` ve sağdan sola diller için `dir="rtl"`; CSS'te `margin-inline-start` gibi mantıksal özellikler (Tailwind `ms-*`, `me-*`, `ps-*`).

## 9. Animasyon ve hareket
- CSS geçişleri: Tailwind `transition`, `duration-200`, `ease-out`, `hover:scale-105`; `transform` ve `opacity` animasyonları yerleşim hesaplatmadığı için ucuzdur, `width`/`top` gibi özellikler pahalıdır.
- `prefers-reduced-motion`: Tailwind `motion-safe:` ve `motion-reduce:` varyantları; JS'te `matchMedia('(prefers-reduced-motion: reduce)')`.
- View Transitions API: `document.startViewTransition(() => updateDom())`; destek yoksa doğrudan güncelle. React 19.3'te `<ViewTransition>` stabil (bkz. `react-ecosystem.md` §1).
- Sektörde Motion (eski adıyla Framer Motion) yaygındır; bu repoda kurulu değil.

## 10. Tarayıcı araçları (Chrome DevTools)
- **Console**: `console.log/warn/error/table/group`; `$0` seçili DOM öğesi; hata satırındaki bağlantı kaynağa götürür.
- **Sources**: satıra tıklayarak breakpoint; sağ tık → conditional breakpoint (`id === 550`) ve logpoint (kodu değiştirmeden log); koddaki `debugger;` ifadesi DevTools açıkken durdurur. Durunca: Resume (F8), Step over (F10), Step into (F11), Step out (Shift+F11); Scope paneli o anki değişkenleri, Call Stack çağrı zincirini, Watch seçilen ifadeleri gösterir. "Pause on exceptions" hatanın fırlatıldığı yerde durdurur. Vite source map'leri sayesinde TSX kaynağında durulur.
- **Network**: filtre (Fetch/XHR), durum kodu, Headers/Preview/Response/Timing sekmeleri, "Preserve log", "Disable cache", throttling (Slow 4G), sağ tık → "Copy as fetch/cURL".
- **Elements**: DOM ve hesaplanmış stiller; erişilebilirlik ağacı.
- **Application**: localStorage, cookies (HttpOnly sütunu), cache.
- **Performance**: kayıt, uzun görevler (long tasks), Web Vitals işaretleri.
- **React Developer Tools** eklentisi: Components (props/state/hook değerleri, "neden render oldu" bilgisi, kaynağa git), Profiler (commit'ler, render süreleri, "Highlight updates when components render").
- Platformun canlı önizlemesi bir iframe'dir; DevTools'ta Sources içinde önizleme dosyaları da görünür ve breakpoint konabilir.

## 11. Storybook ve bileşen dokümantasyonu
- Storybook, bileşenleri uygulamadan bağımsız "story"lerle geliştirip belgeleme aracıdır. Story dosyası CSF (Component Story Format) kullanır: `default export` bir `meta` (`component`, `args`, `argTypes`), her `named export` bir story (`export const Primary: Story = { args: { variant: 'primary' } }`). Tipler `Meta<typeof Button>` ve `StoryObj<typeof meta>` ile yazılır.
- Kullanım alanları: durumları (loading/empty/error) izole göstermek, tasarımcıyla ortak katalog, erişilebilirlik eklentisi, görsel regresyon ve etkileşim testleri.
- Bu repoda kurulu değil; derste kavram, dosya okuma ve karar soruları olarak anlatılır. Sürüm numarası verme.
