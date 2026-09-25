# Aşama 1 — Platform Motoru + Modül 0 (Plan)

Spec: `docs/superpowers/specs/2026-09-25-react-mastering-platform-design.md`
Yöntem: Motor inline (TDD, kritik parçalarda); içerik aşamaları alt ajanlarla paralel. Kullanıcı yöntem seçimini bize bıraktı.

## Kararlar (uygulama sırasında netleşenler)
- TypeScript 6.0 (typescript-eslint `<6.1` uyumu; resmi create-vite şablonu da ~6.0). TS 7 müfredatta anlatılır.
- İçerik metadata'sı (`module.ts`, `question.ts`) **jiti** ile (önbelleksiz) yüklenir.
- Markdown sunucuda HTML'e çevrilir (unified + remark-gfm + remark-directive + Shiki), önbelleğe alınır.
- Runner: Vitest CLI alt süreçte (`--reporter=json`), ayar dosyası env değişkenlerinden hedefi okur; tsc ayrı alt süreçte, geçici tsconfig ile. Tip hataları test gövdesi satır aralıklarına (TS parser) eşlenir.
- Test yazma görevleri: Vitest `projects` (impl + her mutant ayrı proje, farklı alias) tek süreçte.
- Kısa kod: dizin öneklerinden (`05-x/01-y/02-z` → `5.1.2`).

## Görevler
- [x] T1 Monorepo iskeleti: pnpm workspace + catalog, root scripts, tsconfig.base, ESLint/Prettier, kurulum
- [x] T2 `packages/content`: şemalar, define*, kavram kaydı tipi, yükleyici/indeks, markdown renderer, testler (fixture müfredat)
- [x] T3 `curriculum/test-env`: setup (jest-dom, MSW server, istek log'u, cleanup), TMDB fixture'ları; jsdom+fetch+AbortController+MSW entegrasyon testi
- [x] T4 `packages/runner`: workspace yönetimi, ilerleme deposu, Vitest+tsc çalıştırma, sonuç normalizasyonu, tip hatası→test eşleme, timeout, mutation modu, project modu, review prompt; entegrasyon testleri
- [x] T5 `apps/server`: Hono route'ları (müfredat, ders, soru, dosyalar, run, answer, hint, solution, reset, review-prompt, progress, monaco types, SSE), testler
- [x] T6 `packages/cli`: check (+watch), checkpoint, validate:content (+kavram raporu, ```check blokları)
- [x] T7 `apps/platform`: kabuk, router, pano, modül/ders sayfaları, quiz/code/project soru sayfaları, sonuç paneli, ipucu/çözüm, review prompt, tema; RTL testleri
- [x] T8 Monaco: yerel paket, worker'lar, tip tanımları yükleme, çoklu dosya
- [x] T9 Canlı önizleme: preview.html, MSW tarayıcı, istek sayacı, 200'de durdurma, hata yakalama, postMessage köprüsü
- [x] T10 Sinema iskeleti (checkpoint 00) + `projects/sinema` kurulumu
- [x] T11 Modül 0 içeriği (pilot; tüm soru tiplerini kullanır)
- [x] T12 Playwright duman testi; lint + typecheck + test yeşil; `docs/authoring-guide.md`; kod incelemesi

## Notlar
- Codex (gpt-6-sol) içerik yazarı olarak kullanılıyor; CLI `node` ile çalışıyor (tsx IPC'si Codex sandbox'ında engelli).
- Playwright duman testi `pnpm test:e2e` (fixture müfredat, ayrı portlar, `.cache/e2e-state`).

## Bitti ölçütü
`pnpm dev` ile platform açılır; Modül 0'ın her sorusu çözülebilir; `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm validate:content` yeşil; duman testi geçer.
