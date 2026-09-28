# React Mastering — Etkileşimli Öğrenme Platformu (Tasarım)

- Tarih: 2026-09-25
- Durum: Onaylandı (sohbet içinde bölüm bölüm onaylandı; kullanıcı uygulamaya geçilmesini istedi)
- Dil: İçerik Türkçe, teknik terimler İngilizce (`useQuery`, `props`, `mutation` …)

## 1. Amaç

Temel React bilen (HTML/CSS/JS, JSX, state, component, React Router, params/searchParams, basit form, biraz Tailwind) bir geliştiriciyi, **sektör standardında bir React geliştiricisine** dönüştüren, yerelde çalışan, LeetCode tarzı etkileşimli bir öğrenme platformu.

Öğretilecek stack: React (güncel mimari ve pattern'ler), TypeScript, Tailwind CSS, React Router, TanStack Query, React Hook Form, Zod, Redux Toolkit, Vitest, React Testing Library, MSW, Playwright, ESLint, Prettier; opsiyonel shadcn/ui.

Kapsam dışı: React Native, Next.js (bitirme modülünde "sıradaki adımlar" notu olarak geçer).

Başarı ölçütü: Kullanıcı müfredatı bitirdiğinde sıfırdan, sektör pratiklerine uygun (mimari, test, tooling, CI dahil) bir React uygulamasını tasarlayıp kurabilir.

## 2. Pedagojik ilkeler (tüm içerik için bağlayıcı)

### 2.1 İhtiyaca göre öğrenme — "önce kır, sonra düzelt"
Her yeni araç/kavram şu sırayla gelir:
1. **Saf yöntem**: Öğrencinin o ana kadar bildikleriyle çözülür (örn. fetch'i render içinde, `useState` ile çağırmak).
2. **Görünür bozulma**: Sorun gözle görülür hale getirilir — test mesajı ("Beklenen: 1 istek. Atılan: 847 istek."), canlı önizlemedeki istek sayacı, Network sekmesi, profiler.
3. **Çözüm**: Aracın/kavramın tanıtımı (örn. `useEffect`).
4. **Sonraki katman, ihtiyaç anında**: Kavramın derin katmanı ancak ihtiyaç doğduğunda açılır (örn. detay sayfasında `id` değişince film güncellenmiyor → dependency array).

Modüller de aynı mantıkla sıralanır: her modül, Sinema uygulamasında yaşanan bir **acı noktasıyla** açılır.

### 2.2 Tekrar merdiveni
Her temel kavram için: `tanıt → birebir örnek → biraz farklı → daha farklı bağlam → başka kavramlarla birleşik → sonraki modüllerde spiral tekrar`.
**Her basamakta küçük ama gerçek bir yenilik zorunludur**; aynı sorunun kopyası yasaktır.
Örnek (`Omit`): `Omit<Movie,'id'>` → birden çok alan → `Omit` + `Partial` ile form tipi → `Omit<ComponentProps<'button'>,'type'>` → Zod'da `schema.omit()`.

### 2.3 Kavram etiketleri
Her soru kullandığı kavramlarla etiketlenir (`concepts: ['ts.omit', 'react.useEffect.deps']`). Kavramlar merkezi bir kayıtta (`curriculum/concepts.ts`) tanımlıdır; `core: true` işaretli kavramlar için doğrulama hattı **en az 5 tekrar ve en az 2 farklı modül** şartını raporlar.

### 2.4 Ders metni yapısı
Concept dersleri 12–20 dk okuma, başvurulacak kaynak ciddiyetinde: **Problem → zihinsel model (diyagramlı) → adım adım iz sürme → örnekler → sık hatalar → sektörde → özet**. Taşıyıcı zihinsel modeller bir kez derinlemesine kurulur, sonraki derslerde `:::model` ile hatırlatılır. Sade Türkçe, bol ve doğru (derlenen) kod örneği. Ayrıntı: `docs/authoring-guide.md` §1.4–1.6 (2026-09-27 v2 güncellemesi, `docs/curriculum-v2-plan.md`).

## 3. Mimari

pnpm monorepo, tek komut (`pnpm dev`) ile ayağa kalkar.

```
react_mastering/
  apps/platform/      LeetCode tarzı arayüz (Vite + React + TS + Tailwind + React Router + TanStack Query + Monaco)
  apps/server/        Yerel API (Hono, yalnızca 127.0.0.1)
  packages/content/   Zod şemaları, define* yardımcıları, içerik yükleyici, markdown renderer, kavram raporu
  packages/runner/    Test çalıştırıcı (Vitest + tsc, alt süreçte), workspace yönetimi, ilerleme deposu, review prompt
  packages/cli/       `pnpm check`, `pnpm checkpoint`, `pnpm validate:content`
  curriculum/         Tüm içerik (modüller, fixture'lar, test ortamı, checkpoint'ler)
  workspace/          Öğrencinin çözümleri (başlangıç kodunun kopyaları)
  projects/sinema/    VS Code'da büyütülen gerçek uygulama (workspace paketi)
  docs/               Spec, planlar, araştırma notları, içerik yazım rehberi
```

### 3.1 Veri akışı
1. Soru ilk açıldığında `starter/` → `workspace/<soru-yolu>/` kopyalanır (orijinal değişmez; "Sıfırla" yeniden kopyalar).
2. Editör değişiklikleri ~500 ms debounce ile diske yazılır. Dosya VS Code'da değişirse sunucu dosya izleyicisi (SSE) platform editörünü günceller (sunucunun kendi yazdığı içerik hash ile ayırt edilir).
3. "Çalıştır" → sunucu → runner → ayrı süreçte Vitest + tsc → normalize `RunResult` → arayüz.
4. Başarılıysa `progress.json` güncellenir, sonraki soru önerilir.

### 3.2 Teknoloji ve sürüm notları (2026-09 itibarıyla doğrulandı)
React 19.3, React Router 8, TanStack Query 5.10x, Tailwind 4.3, Vite 8 (Rolldown/Oxc), Vitest 5, TypeScript 6.0 (typescript-eslint uyumu ve resmi create-vite şablonu nedeniyle; TS 7 native sürüm müfredatta anlatılır), ESLint 10 + typescript-eslint 8, Prettier 3, MSW 2, RTL 16, Playwright 1.6x, Zod 4, RHF 7, RTK 2, Hono 4, Monaco 0.57.
Ayrıntılı sürüm araştırması: `docs/research/*.md`. İçerik bu notlara göre güncel API'leri öğretir.

Sürüm tutarlılığı: pnpm **catalog** ile tüm paketlerde aynı sürümler kullanılır (tek React kopyası).

### 3.3 Güvenlik
Sunucu yalnızca `127.0.0.1` üzerinde dinler. Öğrencinin kodu yalnızca kendi makinesinde çalışır. `.env` asla commit'lenmez.

## 4. İçerik modeli

### 4.1 Hiyerarşi
**Modül → Ders → Soru.**
- Modül: bir konu; `module.ts` içinde başlık, faz, özet, acı noktası (markdown), kazanımlar.
- Ders: tek kavram; `lesson.md` (frontmatter: `title`, `minutes`) + `questions/`.
- Modül sonu: **Pekiştirme** (birleşik kod görevi) + **Proje görevi** (Sinema'da).
- Tekrar dersleri: `kind: 'review'` işaretli dersler; önceki kavramları yeni bağlamda tekrarlar.

Sıralama dizin önekleriyle (`05-hooks`, `01-...`) belirlenir. Kısa kod bu öneklerden türetilir: `05-hooks/01-x/02-y` → **5.1.2**.

### 4.2 Soru tipleri

| Tip | Nerede | Kontrol | Tamamlanma |
|---|---|---|---|
| `quiz` (single / multiple) | Platform | Sunucuda; her şıkkın açıklaması gösterilir | Doğru cevap |
| `code` | Platform editörü (Monaco) | Vitest (+RTL, MSW) + tsc; test yazma görevlerinde mutation testing | Tüm testler geçer + tip hatası yok |
| `project` | VS Code (`projects/<proje>`) | Vitest testleri proje dosyalarına karşı; ya da yalnızca değerlendirme listesi | Testler geçer; test yoksa kullanıcı "Tamamladım" der |

Her `code`/`project` görevine opsiyonel **değerlendirme listesi** (`rubric`) eklenebilir → "AI review prompt'unu kopyala" butonu.
Görev varyantları tip değil, kurgu olarak: **bug'ı bul** (hatalı başlangıç kodu), **refactor et** (çalışan spagetti; testler baştan geçer, rubric kaliteye bakar), **test yaz** (mutation testing).

### 4.3 Dosya yapısı
```
curriculum/
  concepts.ts                         Kavram kaydı (id, başlık, core?)
  fixtures/tmdb/*.json                Gerçek TMDB cevaplarından örneklenmiş sahte veriler
  test-env/                           Ortak test kurulumu (jest-dom, MSW server, istek log'u, test-utils)
  checkpoints/sinema/NN/              Sinema'nın modül NN sonundaki doğrulanmış hali (00 = iskelet)
  modules/NN-slug/
    module.ts
    NN-ders-slug/
      lesson.md
      questions/NN-soru-slug/
        question.ts                   defineQuestion({...}) — Zod ile doğrulanır
        prompt.md                     Görev metni (quiz'de soru metni question.ts içinde olabilir)
        starter/  solution/           code görevleri
        *.test.ts(x)                  Testler; kodu `@exercise/...` üzerinden import eder
        solution.md                   (ops.) "Neden böyle?" notları
        impl/  mutants/<ad>/          (test yazma görevleri) doğru implementasyon + hatalı versiyonlar
        tests/                        (project görevleri) proje dosyalarına karşı testler (`@project/...`)
```

### 4.4 Tek test dosyası, üç kullanım
Testler kodu takma yoldan (`@exercise/...`) import eder; runner bu yolu duruma göre yönlendirir:
- Normal çalıştırma → `workspace/...`
- Doğrulama → `solution/` (geçmeli) ve `starter/` (kalmalı)

Project görevlerinde `@project/...` → `projects/<proje>/` (doğrulamada ilgili checkpoint).
Test yazma görevlerinde öğrencinin testleri `@impl/...` import eder → `impl/` (geçmeli) ve her `mutants/<ad>/` (kalmalı).

### 4.5 İpucu ve çözüm politikası
- 2–4 kademeli ipucu (yön → yöntem → iskelet); istendikçe açılır, sayısı kaydedilir. Görev metni LeetCode gibi yalnızca ne istendiğini söyler; yöntem ipuçlarındadır.
- Çözüme erken bakmak onay ister ve ilerlemede "çözüme bakıldı" olarak işaretlenir.
- Testler geçince referans çözüm + `solution.md` ("neden böyle") açılır.

## 5. Runner ve değerlendirme

- Her çalıştırma **ayrı süreçte** (process group); süre aşımında (code: 30 sn, project: 90 sn) öldürülür → "Zaman aşımı: sonsuz döngü ya da sonsuz render olabilir."
- Test ortamı: Vitest + jsdom + jest-dom + MSW (`onUnhandledRequest: 'error'`; testler gerçek ağa çıkmaz).
- **İstek log'u**: test-env, MSW olaylarından istek sayısını tutar; testler "Beklenen 1 istek, atılan 847" gibi açık mesajlar üretebilir.
- **Tip kontrolü zorunlu**: `tsc --noEmit` öğrencinin dosyaları + testlerle birlikte çalışır. Tip hatası varsa görev geçmez. Testlerdeki `expectTypeOf` tip iddiaları tsc ile kontrol edilir ve hata satırı, ait olduğu teste eşlenir (o test "kaldı" sayılır).
- ESLint/Prettier görevleri: testler ESLint/Prettier Node API'lerini çağıran normal Vitest testleridir.
- Playwright görevleri (Modül 21): runner Playwright'ı çalıştırır, sonucu aynı formata çevirir.
- **Gizli MSW kurgusu**: İlk modüllerde veri çeken testler arka planda MSW kullanır; MSW modülünde "perde kalkar" ve setup dosyası birlikte okunur.
- **Mutation testing** (test yazma görevleri): öğrenci testleri doğru implementasyonda geçmeli, her hatalı versiyonda kalmalı. Sonuç: "Testlerin 3/4 hatalı versiyonu yakaladı. Kaçan: '…'".

Normalize sonuç:
```ts
type RunResult = {
  status: 'passed' | 'failed' | 'error' | 'timeout'
  tests: { name: string; status: 'passed' | 'failed' | 'skipped'; message?: string; location?: string }[]
  typeErrors: { file: string; line: number; column: number; code: string; message: string }[]
  mutants?: { label: string; caught: boolean }[]
  durationMs: number
  output?: string // derleme hatası vb. ham çıktı
}
```

## 6. Canlı önizleme

`preview` tanımlı `code` görevlerinde (component görevleri) sağ panelde önizleme sekmesi:
- Platformun Vite sunucusu `workspace/` dosyalarını `/@fs/` üzerinden iframe'de çalıştırır; kaydedince anında güncellenir (HMR).
- Önizlemede MSW (tarayıcı) TMDB şeklinde sahte veri döner; gerçek TMDB'ye istek atılmaz.
- Köşede canlı **istek sayacı** ve açılabilir ağ log'u; tarayıcı destekliyorsa JS heap göstergesi.
- **100 istekte otomatik durdurma**: "Sonsuz istek döngüsü tespit edildi" — dersin "aha!" anı.
- Render hataları (örn. "Too many re-renders") önizleme içinde yakalanıp gösterilir.

## 7. Arayüz

- `/` Pano: genel ilerleme, "kaldığın yerden devam et", fazlar → modüller (ilerleme çubuklarıyla).
- `/m/:module` Modül sayfası: acı noktası, dersler ve sorular (durum rozetleriyle).
- `/m/:module/:lesson` Ders sayfası: açıklama + soru listesi.
- `/q/:questionId` Soru sayfası:
  - `quiz`: ortalanmış kart, şık açıklamaları.
  - `code`: sol panel sekmeler (Açıklama | İpuçları | Test dosyası | Çözüm), sağda dosya sekmeli Monaco editör; altta sonuç paneli / önizleme sekmesi. `⌘/Ctrl+Enter` çalıştırır.
  - `project`: sol açıklama; sağda "VS Code'da aç" (`vscode://file/...`), ilgili dosyalar, terminal komutu (`pnpm check 7.2.1`), "Testleri çalıştır", sonuçlar, review prompt butonu.
- Kenar çubuğu: modül/ders ağacı ve ilerleme. Koyu tema varsayılan, açık tema seçeneği.
- Monaco: TS tanıları ve hover tip bilgisi için React ve kullanılan kütüphanelerin tip tanımları sunucudan yüklenir.

## 8. İlerleme

Kök dizinde `progress.json` (atomik yazım). Soru başına: `status` (`not-started|in-progress|passed`), `attempts`, `hintsUsed`, `solutionViewed`, `firstPassedAt`, `updatedAt`; ayrıca `lastVisited`. Sunucu her istekte dosyadan okur (CLI ile tutarlılık). Gezinme serbesttir; kilit yoktur.

## 9. AI review prompt'u

Butona basınca panoya Markdown kopyalanır: rol ("kıdemli React/TypeScript geliştiricisi, junior'ın kodunu inceliyor"), Görev, Değerlendirme listesi, Kodum (görevin `reviewFiles` glob'larına uyan dosyalar, yollarıyla), Test sonuçları (son çalıştırma), Cevap formatı (kriter başına ✅/⚠️/❌ + gerekçe; en önemli 3 iyileştirme ve sektör örneği; tam çözüm yazma, önce ipucu; Türkçe). Belirli boyutun üstünde uyarı verir. Araçtan bağımsızdır (Claude, ChatGPT …).

## 10. CLI

- `pnpm check [kısa-kod]` — soruyu terminalde çalıştırır (argümansız: son ziyaret edilen); `--watch` ile dosya değişince yeniden çalıştırır; ilerlemeyi günceller.
- `pnpm checkpoint <modül>` — Sinema'nın o modül başındaki doğrulanmış halini `projects/sinema@<modül>/` klasörüne açar.
- `pnpm validate:content [--module N]` — içerik doğrulama hattı (bkz. §13).

## 11. Müfredat haritası

Ana eksen: adım adım büyüyen **Sinema** uygulaması. Önce saf yöntemle kurulur, sonra her araç bir acı noktasına çözüm olarak gelir.

| # | Modül | Acı noktası | Ana dersler | ~Soru |
|---|---|---|---|---|
| **Faz 1 — Temeller** |||||
| 0 | Başlangıç ve araç zinciri | "Bir React projesi aslında nelerden oluşuyor?" | Platform kullanımı, pnpm, package.json ve script'ler, Vite projesinin yapısı, tsconfig'e ilk bakış, `.env`, Git akışı | 14 |
| 1 | TypeScript temelleri | TMDB `release_date` bazen boş → çalışma zamanında çökme | inference, object tipleri, type/interface, union/literal, narrowing, fonksiyonlar, any/unknown | 30 |
| 2 | TypeScript ileri | Aynı `Movie` tipini 5 yerde farklı yazmak | generics, utility types, keyof/typeof, discriminated unions, type guard, as const/satisfies, API response tipleme | 28 |
| 3 | React + TypeScript | "State'i değiştirdim ama ekran güncellenmedi" | render modeli, state snapshot, immutability, props/children/event tipleri, controlled input, lifting state, composition | 30 |
| 4 | Tailwind ve UI bileşenleri | Aynı buton class'ı 20 yerde, koşullu class cehennemi | Tailwind v4, @theme, layout, dark mode, cn(), cva, kendi UI kitin | 20 |
| 5 | Hook'lar derinlemesine | Race condition, sonsuz render, kopyalanmış fetch kodu | effect/cleanup, AbortController, "effect'e gerek yok", useRef, useReducer, custom hook, Context | 32 |
| 6 | React Router | Yenileyince filtre kayboluyor, link paylaşılamıyor | URL = state, nested layout, errorElement/404, lazy route | 22 |
| 7 | Proje v1: Sinema (saf yöntem) | Acıyı bizzat yaşamak | trend, arama, detay, tür filtresi + sayfalama, useEffect ile fetch; acı günlüğü | 6 |
| **Faz 2 — Profesyonel kod tabanı** |||||
| 8 | ESLint ve Prettier | Gizli hook bug'ları, tutarsız format | flat config, typescript-eslint, react-hooks, Prettier + Tailwind sıralama, husky/lint-staged; oxlint/Biome trendi notu | 16 |
| 9 | Mimari ve refactor | 400 satırlık dosyalar, dağınık API anahtarı | state kategorileri, feature bazlı yapı, tipli API client + ApiError, `@/` alias, component API tasarımı; v1 → v2 | 24 |
| **Faz 3 — Test** |||||
| 10 | Vitest | Refactor'da bozulanı iki gün sonra fark etmek | AAA, matcher'lar, vi.fn/vi.mock, fake timers, it.each; mutation tabanlı görevler başlar | 22 |
| 11 | RTL + MSW | Elle fetch mock'lamak kırılgan | getByRole önceliği, user-event, findBy/waitFor, custom render, renderHook; **MSW perdesi kalkar** | 26 |
| **Faz 4 — Veri, formlar, state** |||||
| 12 | TanStack Query — temeller | Aynı istek tekrar tekrar, 4 yerde loading/error kodu | useQuery, queryOptions/key factory, staleTime/gcTime, dependent, sayfalama, infinite, prefetch, test | 30 |
| 13 | TanStack Query — mutation ve ileri | Puan verdim, liste güncellenmedi (TMDB guest session) | useMutation, invalidation, optimistic + rollback, Suspense + ErrorBoundary, router entegrasyonu | 22 |
| 14 | React Hook Form | 8 alan = 8 useState, her tuşta render | register, Controller, useFieldArray, formState, reset, mutation entegrasyonu, React 19 form actions karşılaştırması | 22 |
| 15 | Zod | Validasyon ve tipler senkron değil; API `null` döndü | şemalar, refine/transform, z.infer, zodResolver, API response doğrulama, tipli env | 24 |
| 16 | Redux Toolkit | 5 Context provider, gereksiz render | server vs client state, createSlice, tipli hook'lar, createSelector, listener middleware ile kalıcılık, test; RTK Query ve Zustand notu | 26 |
| **Faz 5 — İleri React ve kalite** |||||
| 17 | Kimlik doğrulama | Yenileyince oturum düşüyor, liste korumasız | DummyJSON JWT, refresh, korumalı route, çıkışta cache temizliği | 18 |
| 18 | Performans ve modern React | 500 filmlik listede input takılıyor | Profiler, memo/useMemo/useCallback, React Compiler, useTransition/useDeferredValue, virtualization, React 19 Actions/useOptimistic/use | 24 |
| 19 | İleri component pattern'leri ve a11y | Modal Esc ile kapanmıyor, focus kayboluyor | compound, asChild/Slot, headless hook, portal, focus yönetimi, a11y; render props/HOC tanıma | 20 |
| 20 | shadcn/ui (opsiyonel) | Erişilebilir dropdown yazmak zor | Radix, copy-paste modeli, tema, RHF+Zod form | 12 |
| 21 | Playwright ve CI | Testler yeşil ama gerçek akış kırık | locator, auto-waiting, fixture/POM, page.route, storageState, trace viewer, GitHub Actions | 18 |
| **Faz 6 — Bitirme** |||||
| 22 | Sıfırdan proje tasarımı | — | Open Library ile yeni uygulama: gereksinim, state haritası, ADR, sıfırdan config, feature'lar, test, CI | 8 |

Toplam: ~23 modül, ~140 ders, ~490+ soru/görev (%40 quiz, %50 kod, %10 proje/review). Tekrar dersleri 5. modülden itibaren modül başlarında yer alır. Tekrar merdiveni kuralı nedeniyle hacim artabilir.

## 12. Sinema projesi ve API'ler

- `projects/sinema/`: workspace içinde ayrı Vite uygulaması. Başlangıç = `checkpoints/sinema/00` (Vite + React + TS + Tailwind hazır; Router ve diğer her şeyi öğrenci ekler). Sıfırdan tüm config kurulumu Modül 22'nin işi.
- Büyüme: v1 (M7) → lint (M8) → v2 refactor (M9) → testler (M10–11) → Query (M12–13) → formlar (M14–15) → Redux: izleme listesi, tema, son bakılanlar (M16) → giriş (M17) → performans (M18) → pattern'ler/shadcn (M19–20) → E2E + CI (M21).
- Checkpoint'ler: her modül sonunun doğrulanmış hali; o modülün proje testleri checkpoint'e karşı geçmek zorundadır. `pnpm checkpoint 12` ile ayrı klasöre açılır; önceki bir hata sonraki modülleri engellemez.
- Kök dizinde tek `.env` (`VITE_TMDB_TOKEN`); Sinema `envDir` ile okur. Token yoksa platform 7. modülde uyarır.

| API | Anahtar | Nerede | Ne için |
|---|---|---|---|
| TMDB | `VITE_TMDB_TOKEN` (v4 Read Access Token) | Sinema | trending, discover, search, detay (`append_to_response`), türler; guest session ile gerçek puanlama mutation'ı |
| DummyJSON | Yok | M14, M17 | JWT login, `/auth/me`, refresh |
| Open Library | Yok | M22 | Arama, eser detayı, kapaklar |

Testler ve önizleme gerçek API'ye çıkmaz (fixture'lar). Ders içi sektör notu: token'ın istemciye gömülmesi yerel öğrenmede sorun değil; üretimde proxy/BFF kullanılır.

## 13. Kalite güvencesi

**Platform kodu**: TS strict, ESLint + Prettier, feature bazlı yapı. Testler: Vitest (runner, sunucu route'ları, içerik şemaları, review prompt), RTL (quiz, sonuç paneli, ipucu/çözüm akışı), bir Playwright duman testi (ders aç → quiz çöz → kod yaz → çalıştır → yeşil).

**İçerik doğrulama hattı** (`pnpm validate:content`):
1. Tüm metadata Zod şemasından geçer; kavram id'leri kayıtta tanımlı olmalı.
2. Her `code`/`project` görevinde çözüm geçer (tip kontrolü dahil), başlangıç kodu kalır.
3. Test yazma görevlerinde referans testler `impl`'de geçer, her mutant'ta kalır.
4. Quiz: single modda tam bir doğru şık; her şıkkın açıklaması var.
5. Ders metinlerinde ` ```ts check ` / ` ```tsx check ` işaretli kod blokları derlenir.
6. Kavram tekrar raporu (core kavramlar: ≥5 tekrar, ≥2 modül).
7. Her checkpoint, kendi modülünün proje testlerini geçer.

Otomasyonun ötesinde: her modül üretildikten sonra ayrı bir **pedagojik inceleme turu** (acıyla açılış, tekrar merdiveni, her tekrarda yenilik, sade Türkçe).

## 14. Üretim sırası

| Aşama | İçerik | Bitti ölçütü |
|---|---|---|
| 1 | Platform motoru + Modül 0 (pilot, her soru tipini kullanır) + Sinema iskeleti (checkpoint 00) | Platform testleri yeşil; Modül 0 uçtan uca çalışır |
| 2 | Faz 1 içeriği (M1–M7) + checkpoint'ler | validate:content yeşil + pedagojik inceleme |
| 3 | Faz 2–3 (M8–M11) | aynı |
| 4 | Faz 4 (M12–M16) | aynı |
| 5 | Faz 5–6 (M17–M22) + Playwright runner motoru | aynı + son uçtan uca kontrol |

İçerik yazım kuralları ve dosya formatlarının kesin hali Aşama 1 sonunda `docs/authoring-guide.md` olarak yazılır.

## 15. Riskler

- **Monaco tip çözümlemesi**: Kütüphane tiplerinin Monaco'ya yüklenmesi sorunlu olursa "Cannot find module" tanıları filtrelenir; asıl otorite sunucu tarafı tsc'dir.
- **jsdom + fetch/AbortSignal + MSW** uyumsuzlukları: Aşama 1'de entegrasyon testiyle erken doğrulanır.
- **Tek React kopyası** (workspace, curriculum, sinema): pnpm catalog + runner'da dedupe/alias.
- **İçerik hacmi**: doğrulama hattı + pedagojik inceleme ile kalite kapısı; modüller paralel üretilebilir.
