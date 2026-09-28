# Müfredat v2: derinleştirme planı (2026-09-27)

Bu plan, platform değerlendirmesinden sonra kullanıcıyla kararlaştırılan düzeltmeleri modül modül tanımlar. Yazım kuralları `docs/authoring-guide.md` (özellikle §1.4–1.6, §2.2–2.5, §4) içindedir; bu belge **ne** yapılacağını, rehber **nasıl** yapılacağını söyler.

## Kararlar
- **Kapsam dışı:** Next.js / SSR / Server Components (öğrenci backend için ASP.NET çalışacak, Next.js'e sonra bakacak). 22.7 "sonraki adımlar" dersi bunu anar, ayrıca ASP.NET Core API'ye bağlanma yönünü ekler.
- **Önkoşul varsayımı:** HTML, CSS, JavaScript, JSX; component, composition, state, Context API, basit formlar, search params ve route params biliniyor. Dersler bunları sıfırdan anlatmaz; ama üstüne kurulan zihinsel modelleri (render, snapshot, kimlik, effect…) derinlemesine kurar.
- **Görevler LeetCode gibi:** prompt ne istendiğini söyler, yöntemi söylemez; yardımcı ayrıntılar `hints` içindedir (rehber §2.3).
- **Dersler uzar ve derinleşir:** zihinsel modeller dokümantasyon ciddiyetinde anlatılır, sonraki derslerde `:::model` ile hatırlatılır, diyagramlarla desteklenir; makine üslubu temizlenir (rehber §1.4–1.6).
- **Testler erken başlar:** test okuma 0. modülde, küçük test yazma 1. modülde.
- **Yeni konular:** tarayıcıda debug, HTTP/CORS/HTTP cache, güvenlik (XSS, CSP, CSRF/çerez, sırlar, bağımlılıklar, açık yönlendirme), Web Vitals ve görsel/font/bundle performansı, yayına alma ve hata izleme, i18n, animasyon, Storybook.
- **Modül numaraları değişmez.** Yeni dersler ilgili modüle eklenir; gerekirse yalnızca o modülün sondaki pekiştirme/proje/atölye klasörleri kaydırılır. Öğrencinin `workspace/` klasörüne dokunulmaz.

## Durum (2026-09-28): tamamlandı
- 23 modülün hepsi v2 standardında; `pnpm validate:content` (tam) → `✓ İçerik geçerli`, tekrar kuralı uyarısız.
- 234 ders (~258 bin kelime; concept dersleri kod hariç ortalama ~1.190, en kısa ~1.010), 633 soru, 367 code/project görev metninin 365'i LeetCode biçiminde (kalan 2'si bilerek belirti odaklı atölye görevi), 110 diyagram (28 ortak + 82 derse özgü).
- Yeni dersler: 0.7, 0.8, 3.10, 7.1–7.3, 17.8–17.11, 18.9–18.10, 19.8–19.9, 20.4, 21.9–21.11; yeni test yazma görevleri 1.9.4, 2.8.3, 3.10.4, 5.10.3, 6.9.3; yeni Sinema görevleri 17.12.4 (güvenli dönüş adresi), 21.12.3 (yayına hazırlık) ve checkpoint 17–21 güncellemeleri.
- Motor: diyagram desteği ve denetimleri (güvenlik, yerleşim, tanımsız sınıf, kutu kenarı), ders–çözüm çakışması denetimi, tablo `|` denetimi, `:::model`, 4 ipucu.

## Motor değişiklikleri (tamamlandı)
- Diyagram desteği: `![alt](diagram:ad)` ve `![alt](diagrams/x.svg)` → temaya uyan satır içi SVG (`packages/content/src/markdown.ts`), doğrulama (`pnpm validate:content`), önizleme (`pnpm preview:diagram`).
- `:::model` bilgi kutusu ("Zihinsel model").
- `hints` en fazla 4.
- Web platformu bilgi notu: `docs/research/web-platform.md`.

## Ortak diyagramlar
Rehber §2.5 tablosundaki 28 diyagram `curriculum/diagrams/` altında tek seferde üretilir (`render-commit.svg` referans örnektir). Modül ajanları bu dosyaları **değiştirmez**; kendi derslerine özgü diyagramları ders klasörlerinde üretir.

## Modül modül işler

Her modül için ortak iş: **(A) dersleri yeniden yaz** (rehber §1.4–1.6; zihinsel modeller ve diyagramlar), **(B) code/project prompt'larını LeetCode biçimine çevir, ipuçlarını düzenle** (rehber §2.3). Quiz'ler ve testler korunur; yeni ders metniyle çelişen quiz açıklaması düzeltilir. Aşağıda yalnızca **ek** işler yazılıdır.

### 0 · Başlangıç
- Yeni ders `07-testleri-okumak` (concept): test dosyasının anatomisi (`describe`/`it`/`expect`, hazırla-çalıştır-doğrula), platformdaki test sonucunu okumak (beklenen/gelen, tip hatası satırı), "test = çalıştırılabilir gereksinim", bir sonraki görevi testten okumak. Diyagram: `diagram:test-anatomisi`. Sorular: quiz ×3 (test çıktısı okuma), code ×2 (a: yalnızca testlerdeki beklentilere bakarak bir yardımcı fonksiyonu düzelt; b: prompt'ta yazmayan bir sınır durumunu testten keşfet).
- Yeni ders `08-tarayicida-debug` (concept): Console, Sources (breakpoint, conditional breakpoint, logpoint, `debugger`, step over/into/out, Scope/Call Stack/Watch, pause on exceptions), Network (filtre, durum, Headers/Response/Timing, Preserve log, Disable cache, throttling), Application (localStorage), React DevTools (Components, props/state/hook değerleri, Profiler'a giriş); önizleme iframe'inde breakpoint. Sorular: quiz ×4 (senaryo: "şu belirtide hangi panele, hangi araca bakarsın?"), code ×1 (önizlemede tekrar edilebilen bir mantık hatası; prompt belirtiyi ve tekrar adımlarını verir; ipucu 1 breakpoint koyulacak yeri söyler).
- `module.ts`: özet/kazanımlar yeni dersleri kapsasın.

### 1 · TypeScript temelleri
- `09-pekistirme`'ye yeni soru `04-ilk-testini-yaz` (code, test yazma, rehber §4): saf bir yardımcı (ör. `formatRuntime(minutes)` → `"2 sa 19 dk"`, `0`/negatif/`null` sınırları) için `expect` + `toBe`/`toEqual` ile 3–5 test; 3 gerçekçi mutant.

### 2 · TypeScript ileri
- `08-pekistirme`'ye yeni soru `03-remote-data-testi` (code, test yazma): `RemoteData` yardımcıları ya da bir tip korumasının (`isMovie(value: unknown)`) davranış testi; mutantlar gerçek hatalar (null kabul etmek, eksik alan kontrolü…).

### 3 · React + TypeScript
- Yeni ders `10-bileseni-test-etmek` (concept), mevcut `10-pekistirme` → `11-pekistirme`, `11-proje-gorevi` → `12-proje-gorevi`, `12-atolye` → `13-atolye`. İçerik: RTL ile bileşeni kullanıcı gibi görmek (`render`, `screen.getByRole` + `name`, `userEvent.setup()`, `toBeInTheDocument`, `toHaveAttribute`), rol/ad önceliği (neden `getByTestId` son çare), test adının gereksinim cümlesi olması. Ağ yok (MSW 11. modüle kadar perde arkasında). Sorular: quiz ×2, code ×2 (a: verilen testleri geçecek bileşeni yaz; b: `FavoriteButton`/`SearchBox` gibi bir bileşen için test yaz — mutation, 3 mutant).

### 5 · Hook'lar
- `10-pekistirme`'ye yeni soru `03-reducer-testi` (code, test yazma): `movieSearchReducer` gibi saf bir reducer'ın geçişleri; mutantlar: yanlış durum geçişi, eski sonucu koruma, hata mesajını temizlememe.

### 6 · React Router
- `09-pekistirme`'ye yeni soru `03-route-testi` (code, test yazma): `createMemoryRouter` + `RouterProvider` ile statik veriden bir sayfanın URL state davranışı (ör. `?page=` değişince doğru içerik); mutantlar: sayfayı URL'e yazmama, sayı dönüşümü hatası, geçersiz sayfada çökme.

### 7 · Sinema v1
- Yeni dersler, mevcut dersler kaydırılır: `01-http-anatomisi`, `02-cors`, `03-http-onbellegi`, `04-tmdb-ile-tanis` (eski 01), `05-proje-gorevi` (eski 02), `06-aci-gunlugu` (eski 03).
  - `01-http-anatomisi`: istek/cevap, yöntemler, durum kodları, başlıklar; `fetch`'in 4xx/5xx'te reddetmemesi; `response.ok`; gövdeyi bir kez okumak; Network sekmesinde okumak. Diyagram `diagram:http-istek-cevap`. Sorular: quiz ×2, code ×2 (ör. `fetchJson<T>(url, init)` → `!ok`'ta `status` taşıyan `HttpError` fırlatır — MSW 404/500 ile; 204'te gövde okumaz).
  - `02-cors`: origin, same-origin policy, basit istek vs preflight, `Authorization` başlığının preflight tetiklemesi, credentials kuralları, hatanın yalnızca Console'da görünmesi; çözüm yerleri (API'de politika — ASP.NET Core örneği, Vite `server.proxy`, aynı origin). Diyagram `diagram:cors-preflight`. Sorular: quiz ×3 (senaryo), code ×1 (saf fonksiyon: `needsPreflight({ method, headers })`).
  - `03-http-onbellegi`: `Cache-Control` yönergeleri, ETag/304, `Vary`, `fetch` `cache` seçeneği, hash'li dosya + `index.html` politikası, tarayıcı cache'i ile uygulama cache'inin (ileride Query) farkı. Diyagram `diagram:http-onbellek-karari`. Sorular: quiz ×2, code ×1 (`parseCacheControl(header)` ve `isFresh(ageSeconds, directives)`).
- `module.ts`: özet/kazanımlar güncellenir. 7. modülün acı günlüğü dersinde tekrar eden isteklerin HTTP cache ile neden çözülmediği bir soruyla bağlanabilir.

### 9 · Mimari
- 9.1 `state-kategorileri` dersi `diagram:state-kategorileri` modelini kurar (ek iş yok).

### 10 · Vitest ve 11 · RTL + MSW
- Öğrenci artık 0. modülden beri test okuyor ve 1–6'da küçük testler yazdı. 10.1 ve 11.1–11.3 dersleri "ilk kez" değil "derinleşme" olarak yeniden çerçevelenir: önceki deneyime atıf, yeni katman (mock'lar, fake timer, sorgu öncelikleri ayrıntısı, user-event ayrıntısı, asenkron). Ders listesi değişmez.

### 17 · Kimlik doğrulama → "Kimlik doğrulama ve güvenlik"
- `module.ts` başlığı ve kazanımları güncellenir.
- Yeni dersler `07-cikis-ve-temizlik`'ten sonra: `08-xss-ve-react`, `09-csp-ve-guvenlik-basliklari`, `10-cerez-ve-csrf`, `11-sirlar-ve-bagimliliklar`; mevcut `08-proje-gorevi` → `12-proje-gorevi`, `09-atolye` → `13-atolye`.
  - `08-xss-ve-react`: React'in metni kaçışlaması, tehlikeli çıkış noktaları (`dangerouslySetInnerHTML`, kullanıcı URL'si `href`'te, `innerHTML`), URL protokol izin listesi, sanitize kavramı. Diyagram `diagram:xss-akisi`. Code ×2 (ör. `safeExternalUrl(value)`; kullanıcı yorumunu güvenle gösteren bileşen — testler `<img onerror>` gibi girdinin çalışmadığını ve metin olarak göründüğünü doğrular).
  - `09-csp-ve-guvenlik-basliklari`: CSP yönergeleri (TMDB/DummyJSON için gerçekçi politika), Report-Only, `frame-ancestors`, diğer güvenlik başlıkları; dev/prod farkı. Quiz ×3, code ×1 (`buildCsp(directives)` ya da verilen politikada bir isteğin engellenip engellenmeyeceğini söyleyen saf fonksiyon).
  - `10-cerez-ve-csrf`: `HttpOnly`/`Secure`/`SameSite`, `credentials: 'include'`, CSRF ve savunmaları, Bearer token ile çerez oturumunun ödünleşimi (17.3 ile bağ; ASP.NET Core antiforgery'den kavram olarak söz edilebilir). Quiz ×3, code ×1.
  - `11-sirlar-ve-bagimliliklar`: `VITE_` değişkenlerinin bundle'a gömülmesi, sır gerektiren çağrıların backend'e ait olması, açık yönlendirme ve `redirect` parametresini doğrulama, lockfile/`pnpm audit`/pnpm 10 kurulum script'i politikası/`minimumReleaseAge`. Quiz ×2, code ×1 (`getSafeRedirect`).
- Proje görevi: `12-proje-gorevi`'ye yeni soru `04-guvenli-donus-adresi` (Sinema): `src/features/auth/safe-redirect.ts` → `getSafeRedirect(value: unknown, fallback?: string): string` (yalnızca `/` ile başlayan, `//` ile başlamayan uygulama içi yollar); giriş sayfası hem `location.state.from` hem `?redirect=` değerini bununla kullanır. Testler hem fonksiyonu hem giriş sonrası yönlendirmeyi sınar. `checkpoints/sinema/17` güncellenir ve **aynı değişiklik 18, 19, 20, 21 checkpoint'lerine de uygulanır** (her checkpoint bir öncekinin üstüne kuruludur). Modül 16 checkpoint'i bu testte kalmalı.

### 18 · Performans
- Öğrenci metnine sızmış iç notlar temizlenir (18.4 ders metni ve 18 proje görevi prompt'u: "koordinatör", "araştırma notu"). Gerekli paketlerin (`@rolldown/plugin-babel`, `@babel/core`, `babel-plugin-react-compiler`) öğrencinin projesine nasıl ekleneceği açıkça yazılır.
- Yeni dersler `08-react19-actions-useoptimistic-use`'dan sonra: `09-web-vitals`, `10-gorseller-fontlar-ve-bundle`; mevcut `09-pekistirme` → `11-pekistirme`, `10-proje-gorevi` → `12-proje-gorevi`, `11-atolye` → `13-atolye`.
  - `09-web-vitals`: LCP/INP/CLS ve eşikleri, field vs lab, `PerformanceObserver`, Lighthouse ve DevTools Performance paneli. Diyagram `diagram:web-vitals`. Quiz ×3, code ×1 (ör. `layout-shift` girdilerinden CLS toplayan saf fonksiyon; `hadRecentInput` olanları saymaz).
  - `10-gorseller-fontlar-ve-bundle`: LCP görseli (`fetchpriority`, lazy yüklememe), ekran dışı görsellere `loading="lazy"`, `width`/`height` ile CLS önleme, `font-display`, bundle analizi ve route bazlı bölme. Quiz ×2, code ×1 (ör. listedeki konumuna göre doğru öznitelikleri veren `MoviePoster`).

### 19 · Pattern'ler ve a11y
- Yeni dersler `07-eski-patternler`'den sonra: `08-uluslararasilastirma`, `09-animasyon-ve-hareket`; mevcut `08-pekistirme` → `10-pekistirme`, `09-proje-gorevi` → `11-proje-gorevi`, `10-atolye` → `12-atolye`.
  - `08-uluslararasilastirma`: `Intl` (NumberFormat, DateTimeFormat, RelativeTimeFormat, PluralRules, Collator), Türkçe büyük/küçük harf ve sıralama tuzakları, tipli mesaj kataloğu deseni, `lang`/`dir`, mantıksal CSS özellikleri, sektör kütüphaneleri (kavram). Quiz ×2, code ×2 (ör. Türkçe doğru sıralayan ve arayan film listesi; tipli `t(key, params)` yardımcı).
  - `09-animasyon-ve-hareket`: ucuz/pahalı özellikler, Tailwind geçişleri, `prefers-reduced-motion` (`motion-safe`/`motion-reduce`, `matchMedia`), View Transitions API ve React `<ViewTransition>` (19.3 stabil). Quiz ×2, code ×1 (ör. `usePrefersReducedMotion` ya da hareketi azaltma tercihine uyan bileşen; testte `matchMedia` taklidi).

### 20 · shadcn/ui (opsiyonel)
- Yeni ders `04-storybook-ve-dokumantasyon` (concept): story/CSF, durum kataloğu, a11y ve görsel regresyon, tasarımcıyla ortak dil; paket kurulu değil → quiz ×3 (story dosyası okuma, karar soruları). Mevcut `04-proje-gorevi` → `05-proje-gorevi`, `05-atolye` → `06-atolye`.

### 21 · Playwright ve CI → "Playwright, CI ve yayına alma"
- `module.ts` başlığı ve kazanımları güncellenir.
- Yeni dersler `08-ci`'dan sonra: `09-build-ve-preview`, `10-yayina-alma`, `11-hata-izleme`; mevcut `09-proje-gorevi` → `12-proje-gorevi`.
  - `09-build-ve-preview`: `vite build` çıktısı, hash'li dosyalar, `vite preview`, build anında çözülen env, `base`, `sourcemap: 'hidden'`. Diyagram `diagram:build-ve-yayin`. Quiz ×3, code ×1.
  - `10-yayina-alma`: statik host (Netlify/Cloudflare Pages `_redirects`/`_headers`, Vercel `vercel.json`, GitHub Pages sınırı), SPA fallback, cache politikası (7.3 ile bağ), ortam başına env, preview deploy, CSP başlığını host'ta vermek (17.9 ile bağ). Quiz ×3, code ×1 (`_headers` / `_redirects` üreten ya da doğrulayan saf fonksiyon).
  - `11-hata-izleme`: `createRoot` `onUncaughtError`/`onCaughtError`, `window` `error`/`unhandledrejection`, `sendBeacon`/`keepalive`, source map, release etiketi, Sentry benzeri servisler (kavram). Quiz ×2, code ×1 (`reportError` — MSW ile gönderilen gövdeyi doğrular).
- Proje görevi: `12-proje-gorevi`'ye yeni soru `03-yayina-hazirlik` (Sinema): `public/_redirects` (SPA fallback), `public/_headers` (hash'li dosyalar için uzun cache, `index.html` için `no-cache`, TMDB ve DummyJSON'a izin veren CSP ve temel güvenlik başlıkları), `src/shared/lib/report-error.ts` → `reportError(error: unknown, context?: Record<string, unknown>)` (`VITE_ERROR_ENDPOINT` tanımlıysa gönderir, değilse `console.error`), `main.tsx` kök hata seçenekleri, `vite.config.ts` `build.sourcemap: 'hidden'`. Testler dosya içeriklerini ve `reportError` davranışını sınar; `main.tsx` bağlantısı rubric'te. `checkpoints/sinema/21` güncellenir; 20 bu testte kalmalı.

### 22 · Bitirme
- `01-gereksinimler` ve ilgili rubric'lere güvenlik (XSS'e açık çıkış yok, güvenli dış bağlantı, sır yok) ve yayına hazırlık (SPA fallback, cache başlıkları, hata raporlama) kriterleri eklenir. `06-test-ve-ci` rubric'ine yayına hazırlık maddesi.
- `07-sonraki-adimlar`: Next.js bölümü kısalır ("ileride"); **ASP.NET Core ile kendi API'n** bölümü eklenir: CORS politikası, çerez ya da Bearer ile kimlik, OpenAPI şemasından tipli istemci üretme fikri, Zod ile sınır doğrulamasının devamı, Vite proxy ile geliştirme.

## Ajan protokolü (her Codex görevi için)
1. Önce oku: `AGENTS.md`, `docs/authoring-guide.md` (tamamı), bu plan (kendi modülün + Kararlar), ilgili `docs/research/*.md`, referans modül `curriculum/modules/00-baslangic/`.
2. Yalnızca görevde izin verilen yerlere yaz. Asla: `projects/`, `workspace/`, `progress.json`, `packages/`, `apps/`, `curriculum/test-env/`, `curriculum/concepts.ts`, `curriculum/diagrams/` (ortak diyagram görevi hariç), başka modüller. Yeni kavram gerekiyorsa modülün kendi `concepts.ts` dosyasına ekle.
3. `pnpm check`, `pnpm dev` çalıştırma; commit atma; bağımlılık ekleme; `tsx` kullanma.
4. Klasör kaydırırken `git mv` kullan ve kaydırdığın dersin içeriğini koru.
5. Her dersi yazmadan önce o dersin sorularını (quiz, prompt, test, çözüm) oku: ders, sorunun gerektirdiği her şeyi öğretmeli; ama sorunun çözümünü birebir vermemeli.
6. Diyagramları `pnpm preview:diagram` ile PNG'ye çevir ve **görüntüleyerek** kontrol et.
7. Bitirirken: `npx prettier --write` (yazdığın TS dosyaları), `pnpm validate:content -m <N>` → `✓ İçerik geçerli`. Checkpoint değiştirdiysen etkilenen tüm modülleri doğrula.
8. Son mesajın kısa bir rapor olsun: değişen/yeni dersler (kelime sayılarıyla), yeni sorular, yeni diyagramlar, son validate satırı, sapmalar, açık sorunlar.
