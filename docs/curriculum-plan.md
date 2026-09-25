# Müfredat Planı (ders ders) ve Sinema Hikâyesi

Bu belge `docs/authoring-guide.md` ile birlikte okunur. Her modülün **ders listesi sözleşmedir**: klasör numaraları, `kind` ve konu sırası buna uymalı. Ders içindeki sorular, örnekler ve ayrıntılar yazara bırakılmıştır (hedef soru sayısı ±%20).

Kısaltmalar: **Q** quiz · **C** code · **P** project · **(kind)** concept varsayılan; `review`, `practice`, `project` belirtilir.

Genel kurallar:
- Modül sonu: sondan bir önceki ders **pekiştirme** (`practice`: birleşik, daha zor code görevleri), son ders **proje görevi** (`project`: Sinema'da P görevleri).
- 5. modülden itibaren modülün ilk dersi çoğunlukla kısa bir **tekrar** (`review`) dersidir: modülün dayandığı eski kavramları YENİ bir bağlamda 2–3 soruyla tazeler.
- Proje görevlerinin testleri Sinema hikâyesindeki (§B) dosya yolu/export sözleşmesine göre yazılır.

---

## A. Modüller

### 0 · Başlangıç ve araç zinciri — ✅ yazıldı (referans modül)

### 1 · TypeScript temelleri (~30) — faz 1
**Acı:** Trend listesinde bazı filmlerin `release_date`'i boş, `poster_path`'i `null`. `movie.poster_path.startsWith(...)` çalışma zamanında çöküyor; `movie.relese_date` yazım hatası sessizce `undefined` dönüyor.
1. `01-neden-typescript` — JS'te sessiz hatalar; TS'in yakaladıkları; tip ≠ çalışma zamanı kontrolü. (Q, C)
2. `02-ilkel-tipler-ve-inference` — ilkel tipler, inference, ne zaman açık tip yazılır, `const`/`let` literal çıkarımı. (Q×2, C×2)
3. `03-nesne-tipleri` — nesne tipleri, opsiyonel/readonly alanlar, `type` vs `interface`; TMDB `Movie` tipini gerçek JSON'dan çıkarmak. (Q, C×2)
4. `04-diziler-ve-tuple` — dizi tipleri, dizi metotlarının dönüş tipleri, tuple (`useState` dönüşünü önceden tanıma). (Q, C×2)
5. `05-union-ve-literal` — union, literal union (enum yerine), `string | null`. (Q, C×2)
6. `06-narrowing` — typeof/truthiness/equality/`in`, erken dönüş, `?.` ve `??` ile null güvenliği. (Q, C×3)
7. `07-fonksiyon-tipleri` — parametre/dönüş tipleri, opsiyonel/varsayılan parametre, callback tipleri. (Q, C×2)
8. `08-unknown-ve-any` — `any`'nin tehlikesi, `res.json()` dönüşü, `unknown` + kontrol, `as`'in riski. (Q×2, C)
9. `09-pekistirme` (practice) — `MovieListResponse` tiplemek + `normalizeMovie` (boş alanlarla baş etme). (C×2)
10. `10-proje-gorevi` (project) — P×2 (§B checkpoint 01).

### 2 · TypeScript ileri (~28) — faz 1
**Acı:** Aynı `Movie` tipi 5 dosyada farklı yazılmış; detay endpoint'i daha fazla alan dönüyor; her liste cevabı için ayrı tip (`MovieListResponse`, `SearchResponse`…) kopyalanıyor.
1. `01-generics` — generic fonksiyon/tip, `Paginated<T>`, kısıtlar (`extends`). (Q, C×3)
2. `02-utility-types` — `Partial`, `Pick`, `Omit` (merdiven başlar), `Record`, `Readonly`; `MovieCard` props'unu `Pick` ile türetmek. (Q, C×3)
3. `03-keyof-typeof` — `keyof`, `typeof`, indeksli erişim (`Movie['genre_ids']`), `as const` dizisinden union. (Q, C×2)
4. `04-discriminated-union` — `RemoteData<T>` (idle/loading/success/error), exhaustive `switch` + `never`. (Q, C×2)
5. `05-type-guards` — `value is T`, `in`, assertion fonksiyonları; `unknown` API verisini elle doğrulamanın zahmeti (Zod'a köprü). (Q, C×2)
6. `06-satisfies-ve-as-const` — config nesneleri (`GENRE_COLORS satisfies Record<…>`), route tablosu. (Q, C)
7. `07-async-tipler` — `Promise<T>`, `async`, `getJson<T>()` ve "bu tip bir yalan" (Zod'a köprü), `Awaited`, `ReturnType`, `Parameters`. (Q, C×2)
8. `08-pekistirme` (practice) — tipli TMDB endpoint haritası + `RemoteData` reducer fonksiyonu. (C×2)
9. `09-proje-gorevi` (project) — P×2 (§B 02).

### 3 · React + TypeScript (~30) — faz 1
**Acı:** "Favorilere ekledim ama ekran güncellenmedi" (dizi mutasyonu); bileşene yanlış props geçip çalışma zamanında patlamak.
1. `01-render-modeli` — render = fonksiyon çağrısı, saf bileşen, StrictMode çift render. (Q×2, C)
2. `02-props-ve-children` — props tipleri, varsayılan props, `children: ReactNode`, `ComponentProps<'button'>` + `Omit` (merdiven). (Q, C×2)
3. `03-state-snapshot` — `useState` tipleri, snapshot (3× `count + 1`), updater fonksiyonu. (Q×2, C)
4. `04-immutability` — nesne/dizi güncelleme (spread/map/filter); mutasyon hatasını önizlemede görmek. (Q, C×2)
5. `05-eventler` — event tipleri (`ChangeEvent<HTMLInputElement>`, `FormEvent`), `preventDefault`. (Q, C×2)
6. `06-listeler-ve-key` — `map` ile liste, index-key hatası (sıralama + input demo). (Q, C×2)
7. `07-kosullu-render` — `&&`/ternary/erken dönüş, `0 &&` tuzağı, `RemoteData` ile durum ekranları. (Q, C×2)
8. `08-controlled-input-ve-lifting-state` — controlled input, arama ile filtreleme, state'i yukarı taşıma. (Q, C×2)
9. `09-composition` — children/slot kalıpları, layout bileşenleri, composition ile prop drilling'i azaltma. (Q, C)
10. `10-pekistirme` (practice) — statik veriyle arama + favori işaretleme yapan `MovieBrowser`. (C×2)
11. `11-proje-gorevi` (project) — P×2 (§B 03).

### 4 · Tailwind ve UI bileşenleri (~20) — faz 1
**Acı:** Aynı buton class dizisi 20 yerde kopyalanmış; `'btn ' + (active ? 'on' : '')` string cehennemi; `p-2` ile `p-4` çakışınca hangisinin kazandığı belirsiz.
1. `01-utility-first` — neden utility-first, v4 kurulumu, class okuma. (Q, C)
2. `02-layout-flex-grid` — flex/grid, responsive poster ızgarası. (Q, C×2)
3. `03-durumlar-ve-dark-mode` — hover/focus-visible/disabled/group, `@custom-variant dark`. (Q, C)
4. `04-tema-tokenlari` — `@theme` ile renk/font token'ları. (Q, C)
5. `05-cn-yardimcisi` — clsx + tailwind-merge, `cn()` yazmak. (Q, C×2)
6. `06-cva-varyantlar` — `cva`, `VariantProps`, compound variant; `Button`. (Q, C×2)
7. `07-pekistirme` (practice) — `Badge`, `Card`, `Skeleton` (erişilebilirlik dahil). (C×2)
8. `08-proje-gorevi` (project) — P×2 (§B 04).

### 5 · Hook'lar derinlemesine (~32) — faz 1
**Acı:** Render içinde fetch → önizlemede istek sayacı tırmanıyor; hızlı yazınca eski arama sonucu yenisinin üstüne yazılıyor; aynı fetch kodu 3 bileşende kopyalanmış.
1. `01-tekrar-ts-ve-state` (review) — union + state snapshot'ı yeni bağlamda. (Q, C)
2. `02-useeffect-neden` — render içinde fetch → sonsuz istek (ÖNİZLEME ile göster) → `useEffect`; effect = dış sistemle senkron. (Q, C×2)
3. `03-dependency-array` — detayda `id` değişince eski film kalıyor → deps; nesne/fonksiyon deps tuzağı. (Q×2, C×2)
4. `04-cleanup-ve-race-condition` — sıra dışı cevaplar; `ignore` bayrağı → `AbortController`. (Q, C×2)
5. `05-effecte-gerek-yok` — türetilmiş state, `key` ile sıfırlama, event handler vs effect. (Q×2, C×2)
6. `06-useref` — DOM ref (focus), mutable değer (önceki değer, timer id), ref as prop (React 19). (Q, C×2)
7. `07-usereducer` — 5 bağlantılı `useState` → discriminated union action'lı reducer. (Q, C×2)
8. `08-custom-hooklar` — kopyala-yapıştır acısı → `useDebounce`, `useLocalStorage`, `useFetch`. (Q, C×3)
9. `09-context` — 4 seviye prop drilling → tipli Context + null kontrollü hook; sınırları (tüm tüketiciler render). (Q, C×2)
10. `10-pekistirme` (practice) — debounced + abortable + reducer tabanlı `useMovieSearch`. (C×2)
11. `11-proje-gorevi` (project) — P×2 (§B 05).

### 6 · React Router (~22) — faz 1
**Acı:** Sayfa `useState` ile değişiyor: geri tuşu çalışmıyor, sayfa yenilenince filtre kayboluyor, link paylaşılamıyor.
1. `01-neden-router` — state ile sayfa değiştirmenin sınırları. (Q×2)
2. `02-kurulum-ve-routelar` — `createBrowserRouter` + `RouterProvider` (`react-router/dom`), `Link`/`NavLink`. (Q, C×2)
3. `03-nested-layout` — layout route + `Outlet`, index route. (Q, C)
4. `04-url-parametreleri` — `/movie/:id`, `useParams` (string | undefined) ve sayıya çevirme. (Q, C×2)
5. `05-searchparams-ile-url-state` — `q`, `page`, `genre` URL'de; URL = tek doğru kaynak. (Q, C×2)
6. `06-navigasyon` — `useNavigate`, aktif link stilleri, göreli linkler. (Q, C)
7. `07-hata-ve-404` — `errorElement`, `useRouteError`, `isRouteErrorResponse`, `*` route. (Q, C)
8. `08-lazy-route` — lazy route modülleri (code splitting'e giriş). (Q, C)
9. `09-pekistirme` (practice) — URL state + sayfalamalı arama sayfası. (C×2)
10. `10-proje-gorevi` (project) — P×2 (§B 06).
Not: React Router 8 **data mode** (`createBrowserRouter`) öğretilir; test için `createMemoryRouter` + `RouterProvider`.

### 7 · Proje v1: Sinema (saf yöntem) (~8) — faz 1
**Acı:** Yok — bu modül acıyı üretir. Öğrenci şimdiye kadar öğrendikleriyle (useEffect/useFetch, router, context) gerçek TMDB'ye bağlanır.
1. `01-tmdb-ile-tanis` — TMDB API: auth başlığı, `language=tr-TR`, görsel URL'leri, sayfalama, hata kodları. (Q, C: `buildTmdbUrl`)
2. `02-proje-gorevi` (project) — P×5 (§B 07): tmdb yardımcı, ana sayfa trend, arama, detay, tür filtresi.
3. `03-aci-gunlugu` (review) — gözlem soruları: tekrar eden istekler, her sayfada aynı loading/error kodu, geri gelince yeniden yükleme… (Q×3, P×1 rubric: `NOTES.md` acı günlüğü)

### 8 · ESLint ve Prettier (~16) — faz 2
**Acı:** v1'de `useEffect` bağımlılığı eksik (detay sayfası eski filmi gösteriyor), kullanılmayan import'lar, herkesin farklı formatı.
1. `01-neden-lint` (Q, C: ESLint Node API ile test edilen "hataları gör")
2. `02-flat-config` — `eslint.config.js`, `defineConfig`, typescript-eslint. (Q, C)
3. `03-react-hooks-kurallari` — rules-of-hooks, exhaustive-deps, compiler kuralları. (Q, C×2)
4. `04-prettier` — format, eslint-config-prettier, prettier-plugin-tailwindcss. (Q, C)
5. `05-editor-ve-git-hooklari` — kaydederken format, lint-staged + husky kavramı. (Q×2)
6. `06-modern-alternatifler` — oxlint/Biome trendi; ne zaman hangisi. (Q)
7. `07-proje-gorevi` (project) — P×2 (§B 08).
ESLint/Prettier görevlerinin testleri ESLint/Prettier Node API'lerini çağırır.

### 9 · Mimari ve refactor (~24) — faz 2
**Acı:** v1'de 300 satırlık sayfa bileşenleri, API token'ı ve URL'ler 5 dosyaya dağılmış, bir değişiklik 4 yeri bozuyor.
1. `01-state-kategorileri` — server / client / URL / form state. (Q×3)
2. `02-feature-klasorleri` — feature bazlı yapı, `shared/`. (Q, C)
3. `03-api-client` — tipli `tmdbClient`, `ApiError`, merkezi hata yönetimi. (Q, C×2)
4. `04-yol-takma-adi` — `@/` (tsconfig `paths` + vite `resolve.alias`; TS 6'da `baseUrl` yok). (Q)
5. `05-ui-ve-mantik` — mantığı custom hook'a, görünümü bileşene. (Q, C×2)
6. `06-component-api` — props adlandırma, config props vs composition, controlled/uncontrolled. (Q, C)
7. `07-guvenli-refactor` — küçük adımlar, davranışı koruma. (Q, C: testleri baştan yeşil spagetti → refactor + rubric)
8. `08-pekistirme` (practice) — büyük refactor (rubric + testler). (C×2)
9. `09-proje-gorevi` (project) — P×3 (§B 09).

### 10 · Vitest (~22) — faz 3
**Acı:** Refactor sırasında sayfalama bozuldu, iki gün sonra fark edildi.
1. `01-neden-test` (Q×2)
2. `02-ilk-test` — describe/it/expect, AAA. (Q, C: test yazma — mutation)
3. `03-matcherlar` — toBe/toEqual/toMatchObject/toThrow, asimetrik matcher'lar. (Q, C)
4. `04-ne-test-edilir` — davranış vs implementasyon. (Q×2)
5. `05-mocklar` — `vi.fn`, `vi.spyOn`, `vi.mock`. (Q, C×2)
6. `06-fake-timers` — debounce testi. (Q, C)
7. `07-it-each` — parametrik testler. (C)
8. `08-pekistirme` (practice) — mutation görevleri. (C×3)
9. `09-proje-gorevi` (project) — P×2 (§B 10).
Bu modülden itibaren test yazma görevleri **mutation testing** ile değerlendirilir.

### 11 · React Testing Library + MSW (~26) — faz 3
**Acı:** Bileşen testinde `fetch`'i elle mock'lamak: her testte 20 satır, sıra değişince kırılıyor.
1. `01-neden-rtl` — kullanıcı gibi test et. (Q×2)
2. `02-sorgular` — `getByRole` önceliği, `name`. (Q, C)
3. `03-user-event` (Q, C)
4. `04-asenkron` — `findBy`, `waitFor`, `waitForElementToBeRemoved`. (Q, C)
5. `05-msw-perdesi` — **perde kalkar**: şimdiye kadarki tüm testlerin kullandığı `curriculum/test-env` setup'ı birlikte okunur. (Q×2)
6. `06-msw-senaryolari` — `server.use` ile hata/boş/yavaş cevap. (Q, C×2)
7. `07-custom-render` — provider'lı render (router: `createMemoryRouter`). (Q, C)
8. `08-renderhook` (C)
9. `09-test-verisi-fabrikalari` (C)
10. `10-pekistirme` (practice) (C×2)
11. `11-proje-gorevi` (project) — P×2 (§B 11).

### 12 · TanStack Query — temeller (~30) — faz 4
**Acı:** (7. modülün acı günlüğü) aynı istek tekrar tekrar, cache yok, 4 sayfada aynı loading/error kodu.
1. `01-tekrar-aci-gunlugu` (review) (Q×2)
2. `02-ilk-usequery` (Q, C×2)
3. `03-query-keyleri` (Q, C×2)
4. `04-queryoptions-factory` (Q, C×2)
5. `05-stale-ve-gc` (Q×2, C)
6. `06-bagimli-sorgular` — `enabled`, `skipToken`. (Q, C)
7. `07-sayfalama` — `placeholderData: keepPreviousData`. (Q, C)
8. `08-sonsuz-kaydirma` — `useInfiniteQuery`. (Q, C)
9. `09-prefetch-ve-select` (Q, C×2)
10. `10-query-testleri` — her testte yeni `QueryClient`, `retry: false`. (C×2)
11. `11-proje-gorevi` (project) — P×3 (§B 12).

### 13 · TanStack Query — mutation ve ileri (~22) — faz 4
**Acı:** Film puanladın (gerçek POST, guest session), "Puanladıklarım" listesi eski kaldı.
1. `01-usemutation` (Q, C×2)
2. `02-invalidation-ve-setquerydata` (Q, C×2)
3. `03-optimistic-update` — `onMutate` + rollback ve `variables` yaklaşımı. (Q, C×2)
4. `04-suspense-ve-error-boundary` — `useSuspenseQuery`. (Q, C)
5. `05-router-entegrasyonu` — loader'da `ensureQueryData`. (Q, C)
6. `06-hata-stratejisi` — global `onError`, kullanıcıya bildirim. (Q, C)
7. `07-pekistirme` (practice) (C×2)
8. `08-proje-gorevi` (project) — P×3 (§B 13).

### 14 · React Hook Form (~22) — faz 4
**Acı:** 8 alanlı "İzleme listesi oluştur" formu: 8 `useState`, her tuşta tüm form render, if-else validasyon yığını.
1. `01-aci-useState-formu` (Q, C: elle form — acıyı yaşat)
2. `02-register-ve-handlesubmit` (Q, C×2)
3. `03-validasyon-ve-hatalar` (Q, C×2)
4. `04-controller` — özel puan/yıldız bileşeni. (Q, C)
5. `05-usefieldarray` — etiketler/film listesi. (Q, C)
6. `06-formstate-ve-reset` — `isDirty`, `isSubmitting`, `reset`, `defaultValues`. (Q, C)
7. `07-mutation-ile-gonderim` (C)
8. `08-react19-form-actions` — `useActionState` karşılaştırması. (Q×2)
9. `09-erisilebilir-formlar` — label, `aria-invalid`, hata ilişkilendirme. (Q, C)
10. `10-proje-gorevi` (project) — P×2 (§B 14).

### 15 · Zod (~24) — faz 4
**Acı:** Form kuralları ve tipler iki ayrı yerde, senkron değil; TMDB bir alanı `null` döndürdü ve detay sayfası çöktü (`getJson<T>` "yalanı").
1. `01-aci` (Q×2)
2. `02-semalar` (Q, C×2)
3. `03-z-infer` (Q, C)
4. `04-refine` (Q, C)
5. `05-transform-ve-coerce` — searchParams'ı parse etmek (`page`). (Q, C)
6. `06-zodresolver` (C×2)
7. `07-api-dogrulama` (Q, C×2)
8. `08-tipli-env` (C) — 0. modüldeki `readConfig`'in Zod'lu hali (spiral).
9. `09-sema-kompozisyonu` — `extend`/`pick`/`omit` (Omit merdiveni). (Q, C)
10. `10-proje-gorevi` (project) — P×3 (§B 15).
Zod 4 API'si: `import { z } from 'zod'`, `z.email()`, `error` parametresi.

### 16 · Redux Toolkit (~26) — faz 4
**Acı:** Favoriler, izleme listeleri, tema, son bakılanlar için 5 iç içe Context; bir değişiklik tüm ağacı render ediyor.
1. `01-aci` (Q×2)
2. `02-server-vs-client-state` (Q×3)
3. `03-store-ve-slice` (Q, C×2)
4. `04-tipli-hooklar` — `withTypes`. (Q, C)
5. `05-selectorler` — `createSelector`. (Q, C×2)
6. `06-immer` (Q, C)
7. `07-listener-middleware` — localStorage'a kalıcılık. (Q, C)
8. `08-async-thunk` (Q, C)
9. `09-redux-testleri` (C×2)
10. `10-alternatifler` — RTK Query, Zustand. (Q×2)
11. `11-proje-gorevi` (project) — P×2 (§B 16).

### 17 · Kimlik doğrulama (~18) — faz 5
**Acı:** Sayfa yenilenince oturum düşüyor; izleme listesi herkese açık; token süresi dolunca her şey sessizce 401.
1. `01-jwt-temelleri` (Q×2)
2. `02-login-akisi` — DummyJSON `/auth/login`, RHF + Zod. (C×2)
3. `03-token-saklama` — bellek/localStorage/cookie ödünleşimleri. (Q×2)
4. `04-yetkili-istekler` — `/auth/me`, başlık ekleme. (C)
5. `05-refresh-token` — 401 → refresh → tekrar dene (tek uçuş). (Q, C×2)
6. `06-korumali-routelar` (Q, C)
7. `07-cikis-ve-temizlik` — query cache + store temizliği. (Q, C)
8. `08-proje-gorevi` (project) — P×3 (§B 17).

### 18 · Performans ve modern React (~24) — faz 5
**Acı:** 500 filmlik listede yazarken input takılıyor.
1. `01-aci-ve-profiler` (Q, C)
2. `02-render-nedenleri` (Q×2, C)
3. `03-memo-usememo-usecallback` (Q, C×2)
4. `04-react-compiler` (Q×2)
5. `05-transition-ve-deferred` (Q, C×2)
6. `06-sanallastirma` — `@tanstack/react-virtual`. (C)
7. `07-code-splitting` (Q, C)
8. `08-react19-actions-useoptimistic-use` (Q, C×2)
9. `09-pekistirme` (practice) (C×2)
10. `10-proje-gorevi` (project) — P×2 (§B 18).

### 19 · İleri pattern'ler ve erişilebilirlik (~20) — faz 5
**Acı:** Kendi yazdığın modal Esc ile kapanmıyor, açılınca focus sayfada kayboluyor, ekran okuyucu hiçbir şey okumuyor.
1. `01-a11y-temelleri` (Q×2, C)
2. `02-klavye-ve-focus` — focus trap/restore. (Q, C)
3. `03-portal` (Q, C)
4. `04-compound-components` — `Tabs`. (Q, C×2)
5. `05-headless-hooklar` — `useDisclosure`. (C)
6. `06-aschild-slot` (Q, C)
7. `07-eski-patternler` — render props, HOC'u tanımak. (Q×2)
8. `08-pekistirme` (practice) (C×2)
9. `09-proje-gorevi` (project) — P×2 (§B 19).

### 20 · shadcn/ui (opsiyonel, ~12) — faz 5
**Acı:** 19. modülde erişilebilir bir dropdown yazmanın ne kadar zor olduğunu gördün.
1. `01-copy-paste-modeli` — Radix vs Base UI (`init -b radix`), neden kütüphane değil. (Q×3)
2. `02-tema` — CSS değişkenleri, OKLCH. (Q, C)
3. `03-form` — RHF + Zod ile shadcn formu. (Q, C)
4. `04-proje-gorevi` (project) — P×2 (§B 20).

### 21 · Playwright ve CI (~18) — faz 5
**Acı:** Birim ve entegrasyon testleri yeşil, ama "giriş yap → listeye ekle" akışı üretimde kırık (router ayarı).
1. `01-neden-e2e` (Q×2)
2. `02-ilk-e2e` — config, `webServer`. (Q, C)
3. `03-locatorlar-ve-assertionlar` (Q, C)
4. `04-fixture-ve-page-object` (Q, C)
5. `05-ag-taklidi` — `page.route`. (Q, C)
6. `06-oturum` — `storageState`. (Q)
7. `07-debug-ve-trace` (Q×2)
8. `08-ci` — GitHub Actions. (Q, C)
9. `09-proje-gorevi` (project) — P×2 (§B 21).
Not: Playwright testlerini çalıştıran runner motoru bu modül yazılmadan önce eklenecek (koordinatör).

### 22 · Bitirme: sıfırdan proje (~8) — faz 6
`projects/kitaplik` — Open Library ile (anahtar yok) yeni bir uygulama. Checkpoint: `checkpoints/kitaplik/22`.
1. `01-gereksinimler` (project, rubric: `REQUIREMENTS.md`)
2. `02-mimari-ve-adr` (project, rubric: `docs/adr/*.md`, state haritası)
3. `03-kurulum` (project, testler: config'ler — Vite, TS, ESLint, Prettier, Tailwind, Vitest, Playwright)
4. `04-arama-ozelligi` (project, testler)
5. `05-detay-ve-okuma-listesi` (project, testler)
6. `06-test-ve-ci` (project, rubric + testler)
7. `07-sonraki-adimlar` (concept: Next.js, React Native, Server Components; Q×2)

---

## B. Sinema hikâyesi (checkpoint sözleşmesi)

`checkpoints/sinema/NN` = NN. modül SONUNDAKİ proje. Her checkpoint bir öncekinin üstüne kurulur; aşağıdaki dosya yolları ve export adları sonraki modüllerin testlerinin dayandığı **sözleşmedir**. Stil (Tailwind class'ları) serbesttir; testler davranışa bakar.

| NN | Eklenen / değişen (yol → export) |
|---|---|
| start | Vite + React + TS + Tailwind iskeleti (`src/App.tsx` default export `App`). |
| 00 | `package.json` `typecheck` script'i; `src/vite-env.d.ts` (VITE_TMDB_TOKEN, VITE_APP_TITLE?); `src/config.ts` → `appTitle`; `App` içinde `<header>` + `h1 {appTitle}` + "Bugün ne izlesek?"; `README.md`. |
| 01 | `src/types/tmdb.ts` → `Movie` (liste öğesi: id, title, original_title, overview, poster_path: string \| null, backdrop_path: string \| null, release_date: string, genre_ids: number[], vote_average, vote_count, popularity, adult, original_language, video), `MovieListResponse` ({ page, results: Movie[], total_pages, total_results }). `src/lib/format.ts` → `formatVote(n)`, `releaseYear(date)` (boşta ''), `formatDate(date)` (tr-TR uzun tarih; boşta 'Tarih yok'). |
| 02 | `src/types/tmdb.ts` genişler → `Genre`, `MovieDetails` (Movie'den türetilmiş + runtime: number \| null, genres: Genre[], tagline, status, budget, revenue, credits?, videos?), `CastMember`, `CrewMember`, `Video`, `Paginated<T>`; `MovieListResponse = Paginated<Movie>`. `src/lib/tmdb-image.ts` → `type ImageSize = 'w185' \| 'w342' \| 'w500' \| 'original'`, `posterUrl(path, size?)` (null → undefined). `src/lib/remote-data.ts` → `RemoteData<T>` (idle/loading/success/error) + `isSuccess` vb. yardımcılar. |
| 03 | `src/data/sample-movies.ts` → `sampleMovies: Movie[]` (fixture'lardan ~12 film). `src/components/MovieCard.tsx` → `MovieCard({ movie, isFavorite, onToggleFavorite })`; `src/components/MovieGrid.tsx` → `MovieGrid({ movies, favoriteIds, onToggleFavorite })`; `src/components/SearchBox.tsx` → controlled `SearchBox({ value, onChange })`; `App` statik listede arama (başlığa göre) + favori işaretleme (state App'te). |
| 04 | `src/lib/cn.ts` → `cn()`; `src/components/ui/button.tsx` → `Button`, `buttonVariants` (variant: primary/secondary/ghost, size: sm/md/lg); `badge.tsx` → `Badge`; `card.tsx` → `Card`; `skeleton.tsx` → `Skeleton`; `input.tsx` → `Input`. `index.css` `@theme` token'ları ve dark tema. MovieCard UI kit'i kullanır. |
| 05 | `src/hooks/useDebounce.ts` → `useDebounce(value, delay)`; `src/hooks/useLocalStorage.ts` → `useLocalStorage(key, initial)`; `src/hooks/useFetch.ts` → `useFetch<T>(url \| null)` → `RemoteData<T>` (abortable); `src/context/FavoritesContext.tsx` → `FavoritesProvider`, `useFavorites()` → `{ favoriteIds, isFavorite(id), toggleFavorite(id) }` (localStorage'da kalıcı); `main.tsx` provider'ı sarar; arama debounce'lu. |
| 06 | `react-router` bağımlılığı; `src/router.tsx` → `router` (createBrowserRouter) ve `routes` (RouteObject[] — testler `createMemoryRouter(routes)` ile kullanır); `src/layouts/RootLayout.tsx` (nav: Ana sayfa, Ara, Favoriler; `Outlet`); sayfalar `src/pages/HomePage.tsx`, `SearchPage.tsx` (`?q=` URL state, statik veri), `MovieDetailsPage.tsx` (`/movie/:id`, statik veriden), `FavoritesPage.tsx`, `NotFoundPage.tsx`; `errorElement`. `main.tsx` → `RouterProvider`. |
| 07 | `src/lib/tmdb.ts` → `TMDB_BASE_URL`, `tmdbFetch<T>(path, params?, init?)` (Bearer token, `language: 'tr-TR'`, `!ok` → Error fırlatır); HomePage: trend filmler (`/trending/movie/week`) + tür filtresi (`?genre=` → `/discover/movie`) + sayfalama (`?page=`); SearchPage: debounced TMDB araması (`?q=`, `?page=`); MovieDetailsPage: `/movie/:id?append_to_response=credits,videos` (kadro listesi); FavoritesPage: favori id'lerin detaylarını çeker. Hepsi `useFetch`/`useEffect` ile; loading/error kodu sayfalarda tekrar ediyor (bilinçli). `NOTES.md` acı günlüğü. |
| 08 | `eslint.config.js` (flat, typescript-eslint, react-hooks, react-refresh, prettier), `.prettierrc.json`, `.prettierignore`; script'ler `lint`, `format`, `format:check`; tüm lint hataları düzeltilmiş (v1'deki eksik deps dahil). |
| 09 | Feature yapısı: `src/features/movies/{api,components,hooks}`, `src/features/search/…`, `src/features/favorites/…`, `src/shared/{ui,lib,api,config}`; `@/` alias (tsconfig `paths` + vite `resolve.alias`); `src/shared/api/tmdb-client.ts` → `tmdbClient.get<T>(path, params?)`, `ApiError` (status, statusCode, message); `src/features/movies/api/movies-api.ts` → `getTrendingMovies(page)`, `discoverMovies({ genreId, page })`, `searchMovies({ query, page })`, `getMovieDetails(id)`, `getGenres()`. (Önceki yolların hepsi taşınır; testler yeni yolları kullanır.) |
| 10 | Vitest kurulumu (vite.config `test`), `test` script'i; `src/shared/lib/format.test.ts`, `src/shared/api/tmdb-client.test.ts` (vi.fn fetch), `src/hooks/useDebounce.test.ts` (fake timers). |
| 11 | `src/test/setup.ts` (jest-dom, MSW), `src/test/msw/handlers.ts`, `src/test/render.tsx` → `renderWithRouter(ui \| routes, { route })`; SearchPage ve MovieDetailsPage bileşen testleri. |
| 12 | `@tanstack/react-query` (+ devtools); `src/shared/api/query-client.ts` → `queryClient`; `src/features/movies/api/movie-queries.ts` → `movieQueries` (`all`, `trending(page)`, `discover(params)`, `search(params)`, `detail(id)`, `genres()` — `queryOptions`); sayfalar `useQuery`; sayfalamada `placeholderData: keepPreviousData`; ana sayfada `useInfiniteQuery` ile sonsuz kaydırma; kartta hover prefetch. |
| 13 | `src/features/rating/api/…` → `getGuestSession()` (localStorage'da saklı), `rateMovie({ movieId, value })`, `deleteRating(movieId)`, `ratedMoviesQuery`; `useRateMovie()` (optimistic); `RatingStars` bileşeni; `/rated` sayfası; detay sayfasında `useSuspenseQuery` + ErrorBoundary; router loader'da `ensureQueryData`. |
| 14 | `react-hook-form`; `src/features/watchlists/` → `WatchlistForm` (ad, açıklama, görünürlük, etiketler: `useFieldArray`), watchlist'ler localStorage'da (`useWatchlists`); `ReviewForm` (puan: `Controller`, metin) → DummyJSON `POST /comments/add` mutation. |
| 15 | `zod`, `@hookform/resolvers`; `src/features/movies/api/schemas.ts` → `movieSchema`, `movieListSchema`, `movieDetailsSchema`; `tmdbClient.get(path, schema)` cevabı doğrular; form şemaları (`watchlistSchema`, `reviewSchema`) + `zodResolver`; `src/shared/config/env.ts` → `env` (Zod ile doğrulanmış). |
| 16 | `@reduxjs/toolkit`, `react-redux`; `src/app/store.ts` → `store`, `RootState`, `AppDispatch`, `useAppDispatch`, `useAppSelector`; slice'lar: `favoritesSlice` (Context'in yerine), `watchlistsSlice`, `uiSlice` (theme), `recentlyViewedSlice`; listener middleware ile localStorage kalıcılığı. |
| 17 | `src/features/auth/` → DummyJSON login (`/auth/login`), `authSlice` (user, accessToken, refreshToken), `authClient` (Bearer + 401'de refresh), `ProtectedRoute` (layout route), `/login`, `/profile`; watchlist sayfaları korumalı; çıkışta `queryClient.clear()` + store sıfırlama. |
| 18 | `@tanstack/react-virtual` ile sanallaştırılmış büyük liste (favoriler/aramada), `useDeferredValue` ile arama, route'lar `lazy`, React Compiler (babel eklentisi) açık, favori butonunda `useOptimistic`. |
| 19 | `src/shared/ui/modal/` (compound: `Modal`, `Modal.Trigger`, `Modal.Content`, focus trap, Esc), `Tabs` compound (detay sayfası: Özet/Oyuncular/Videolar), `useDisclosure`; a11y düzeltmeleri. |
| 20 | shadcn/ui (Radix): `components.json`, `src/components/ui/*` shadcn bileşenleri (button, dialog, dropdown-menu, form alanları); kendi UI kit'in yerini alır. |
| 21 | `@playwright/test`; `playwright.config.ts` (webServer: vite), `e2e/*.spec.ts` (ana sayfa → arama → detay; giriş → izleme listesi), `page.route` ile TMDB/DummyJSON taklidi; repo kökünde `.github/workflows/sinema-ci.yml` (lint, typecheck, test, e2e). |
