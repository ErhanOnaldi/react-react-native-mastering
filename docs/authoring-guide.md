# İçerik Yazım Rehberi

Bu rehber, `curriculum/` altına modül yazan herkes (insan ya da AI) için bağlayıcıdır.
Önce şunları oku: `docs/superpowers/specs/2026-09-25-react-mastering-platform-design.md` (§2 pedagoji, §11 müfredat haritası), `docs/curriculum-plan.md` (senin modülünün ders planı ve Sinema hikâyesi) ve **referans modül** `curriculum/modules/00-baslangic/` (her soru tipinin çalışan örneği).
Güncel kütüphane API'leri için: `docs/research/*.md` — eğitim verindeki eski API'leri öğretme.

---

## 1. Pedagojik kurallar (pazarlığa açık değil)

### 1.1 İhtiyaca göre öğretim ("önce kır, sonra düzelt")
Her yeni araç/kavram şu sırayla gelir:
1. **Saf yöntem** — öğrencinin o ana kadar bildikleriyle çözülür.
2. **Görünür bozulma** — sorun gözle görülür: test mesajı (`Beklenen: 1 istek, atılan: 47`), önizlemedeki istek sayacı, yanlış sonuç, çöken sayfa.
3. **Çözüm** — kavram/araç tanıtılır.
4. **Sonraki katman, ihtiyaç anında** — derin ayrıntı (örn. dependency array) ancak ihtiyaç doğduğu bağlamda açılır.

Modül ve ders açılışları `:::pain` kutusuyla somut bir **acı** anlatır; acı mümkünse Sinema'dan gelir.
Bir kavramı ihtiyaç doğmadan önce öğretme. Örn. `useMemo`'yu Hook'lar modülünde "ne zaman GEREKMEZ" olarak an, asıl ihtiyacı Performans modülünde doğur.

### 1.2 Tekrar merdiveni
Her temel kavram için: `tanıt → birebir örnek → biraz farklı → daha farklı bağlam → başka kavramlarla birleşik → sonraki modüllerde spiral tekrar`.
- **Her tekrarda küçük ama gerçek bir yenilik zorunlu.** Aynı sorunun farklı isimle kopyası YASAK.
- Bir ders içinde sorular kolaydan zora: quiz (anlama) → küçük kod → biraz daha büyük kod.
- Önceki modüllerin kavramlarını (özellikle `core: true` olanları) yeni bağlamlarda **bilinçli olarak** tekrar kullan ve `concepts` alanına ekle.

### 1.3 Dil ve üslup
- Türkçe, sade, samimi ("sen" dili). Teknik terimler İngilizce kalır: `props`, `state`, `hook`, `query`, `mutation`, `render`…
- Kısa paragraflar (2–4 cümle), bol ve DOĞRU kod örneği, gerektiğinde tablo.
- "Neden?" sorusunu her zaman cevapla. Kural ezberletme; gerekçeyi göster.
- Ders ~5–10 dk okuma. Uzarsa iki derse böl.
- Yanlış bilgi vermektense konuyu dar tut. Emin olmadığın API'yi `docs/research/`'ten doğrula.

---

## 2. Dosya yapısı

```
curriculum/modules/NN-slug/
  module.ts                 defineModule({...})
  concepts.ts               (ops.) bu modüle özel yeni kavramlar
  NN-ders-slug/
    lesson.md               frontmatter + ders metni
    questions/NN-soru-slug/
      question.ts           defineQuestion({...})
      prompt.md             code/project görev metni (quiz'de yok)
      solution.md           (ops. ama code görevlerinde ŞİDDETLE önerilir) "Neden böyle?"
      starter/ solution/    code görevleri
      *.test.ts(x)          code görevlerinin testleri (soru klasörünün kökünde)
      impl/ mutants/<id>/   test yazma görevleri
      tests/*.test.ts(x)    project görevlerinin testleri
```

- Klasör adları `NN-kebab-case` (iki basamaklı numara, küçük harf, Türkçe karakter YOK: `ş→s, ı→i, ğ→g, ü→u, ö→o, ç→c`).
- Kısa kod numaralardan türetilir: `05-hooks/02-x/03-y` → `5.2.3`. Numaralar 01'den başlar, boşluk bırakma.
- Metinlerde (başlık, açıklama) Türkçe karakter serbest.

### 2.1 module.ts
```ts
import { defineModule } from '@rm/content/define'

export default defineModule({
  title: 'Hook’lar derinlemesine',
  phase: 1,                    // 1..6 (spec §11)
  summary: '1–2 cümle',
  pain: `Markdown: modülün acı hikâyesi (Sinema bağlamında, somut)`,
  outcomes: ['…yapabilirsin', '…'],   // 4–7 madde, "yapabilirsin" ile biten ölçülebilir kazanımlar
  optional: false,             // sadece shadcn modülünde true
})
```

### 2.2 lesson.md
```md
---
title: Race condition ve AbortController
minutes: 8
kind: concept        # concept | review (tekrar) | practice (pekiştirme) | project (proje görevi)
---

# Başlık

:::pain[Problem]
Somut acı.
:::

## Kavram … ## Örnek … ## Sık hatalar … ## Sektörde
```
Frontmatter YAML'dır: `title` değerini **her zaman çift tırnakla** yaz (`title: "Sinema v2: düzenli yapı"`) — iki nokta, `@`, `#` gibi karakterler tırnaksız YAML'ı bozar.

Önerilen iskelet: **Problem → Kavram → Örnek → Sık hatalar → Sektörde**. Tekrar (`review`) derslerinde kısa bir hatırlatma + yeni bağlam yeterli.

**Bilgi kutuları:** `:::pain`, `:::tip`, `:::warning`, `:::mistake` (sık hata), `:::sector` (sektörde), `:::info`. Başlık opsiyonel: `:::tip[Kısa yol]`.

**Kod blokları:**
- Dosya adı: ` ```tsx title="src/App.tsx" `
- Derlenmesi garanti edilecek bloklar: ` ```ts check ` / ` ```tsx check ` → doğrulama hattı bunları **tek başına bir modül olarak** tsc ile derler. Yani kendi kendine yetmeli (gerekli import'lar ve tipler bloğun içinde). Kütüphaneler (react, zod, @tanstack/react-query…) import edilebilir. Parça kod/sözde kod bloklarına `check` KOYMA.
- Satır vurgulama: satır sonuna `// [!code highlight]`, fark gösterimi: `// [!code ++]` ve `// [!code --]`, odak: `// [!code focus]`.
- Markdown içinde metinde iki nokta üst üste sorun değil ("Not: …"), direktif sanılmaz.

### 2.3 Soru tipleri — question.ts

Ortak alanlar: `title`, `difficulty: 'kolay' | 'orta' | 'zor'`, `concepts: string[]` (en az 1; `curriculum/concepts.ts` veya modül `concepts.ts` içinde tanımlı olmalı).

**quiz**
```ts
defineQuestion({
  type: 'quiz',
  title, difficulty, concepts,
  question: 'Markdown; kod bloğu içerebilir',
  mode: 'single' | 'multiple',   // varsayılan single; single'da TAM 1 doğru
  options: [{ text: 'md', correct: true, explanation: 'md — neden doğru/yanlış' }, ...], // 2–6 şık
  explanation: 'md — cevaptan sonra genel açıklama (ops.)',
})
```
- Her şıkkın açıklaması öğretici olsun ("yanlış" demek yetmez; yanlış modeli düzelt).
- Çeldiriciler gerçek yanlış anlamalardan gelsin.
- Kod okuma soruları değerli: "Bu kod kaç kez render eder?", "Konsola ne yazar?".

**code**
```ts
defineQuestion({
  type: 'code',
  title, difficulty, concepts,
  files: ['useDebounce.ts'],          // öğrencinin düzenleyeceği dosyalar (starter/ içinde olmalı)
  hints: ['…', '…', '…'],             // 1–3 kademeli ipucu: yön → yöntem → neredeyse çözüm
  preview: { entry: 'Preview.tsx' },  // (ops.) bileşen görevlerinde canlı önizleme
  rubric: ['…'],                      // (ops.) kod kalitesi için AI review kriterleri
  reviewFiles: ['…'],                 // (ops.) review'a girecek dosyalar (varsayılan: files)
  testWriting: { mutants: [...] },    // (ops.) test yazma görevi — §4
  timeoutMs: 30000,                   // (ops.)
})
```
- `starter/` TÜM dosyaları içerir (düzenlenebilir + salt okunur yardımcılar). `files` dışındakiler salt okunur gösterilir.
- `solution/` yalnızca `files` listesindeki dosyaların çözümünü içerir (doğrulamada starter'ın üstüne kopyalanır).
- `prompt.md` görev metni: bağlam (neden?), net gereksinimler (tablo/örnek girdi-çıktı), gerekirse önizleme talimatı.
- `solution.md` "Neden böyle?": alternatifler, tuzaklar, sektör notu, sonraki modüle köprü.

**project** (VS Code'da, `projects/sinema` içinde)
```ts
defineQuestion({
  type: 'project',
  title, difficulty, concepts,
  project: 'sinema',
  focusFiles: ['src/…'],     // VS Code'da açma linkleri
  reviewFiles: ['src/**/*.tsx'], // rubric varsa review'a girecek dosyalar (glob)
  rubric: ['…'],             // testsiz görevlerde ZORUNLU
  hints: […],
})
```
- Testler `tests/` altında ve `@project/...` üzerinden import eder: `import App from '@project/src/App'`.
- Görev metni **dosya yolunu ve export adını açıkça** söylemeli (testler oraya bakar).
- Testler davranışı test etsin (render çıktısı, fonksiyon sonucu), uygulama detayını değil — öğrencinin geçerli farklı çözümleri de geçmeli.

**Refactor görevleri** (çalışan spagetti → temiz yapı): doğrulama başlangıç kodunun **kalmasını** ister. Bu yüzden testler iki katmanlı olur: (1) davranış testleri — spagetti de geçer, refactor sonrası da geçmeli; (2) yapı testleri — görev metninde açıkça istenen yeni birimler (örn. `useMovieSearch.ts`'ten export edilen hook, `MovieList` bileşeni) import edilip davranışları test edilir; spagetti bunlara sahip olmadığı için kalır. Kalan kalite (isimlendirme, sorumluluk ayrımı) `rubric` ile AI review'a bırakılır.

---

## 3. Test ortamı (egzersiz testleri)

Testler Vitest 5 + jsdom + React Testing Library + jest-dom ile, **ayrı bir süreçte** çalışır.

- Import yolları:
  - `@exercise/<dosya>` → öğrencinin çalışması (doğrulamada starter/ ve starter+solution).
  - `@test-utils` → ortak yardımcılar (aşağıda).
  - `@project/<yol>` → project görevlerinde proje kökü.
  - `@impl/<dosya>` → test yazma görevlerinde implementasyon.
- `import { describe, expect, it, vi } from 'vitest'` — `globals: false`, her şeyi import et.
- RTL cleanup otomatik (setup dosyasında). `@testing-library/user-event` kullanılabilir: `const user = userEvent.setup()`.
- **Test adları Türkçe ve davranışı anlatan cümle**: `it('boş aramada istek atmaz', …)`. Öğrenci testleri gereksinim listesi olarak okur.
- `expect` mesajı eklenebilir: `expect(requests('/3/movie/550'), 'Beklenen: 1 istek').toHaveLength(1)`.
- Vitest 5'te `clearMocks: true` varsayılan (mock çağrı geçmişi her testten önce sıfırlanır).
- Sahte env: `import.meta.env.VITE_TMDB_TOKEN === 'test-token'`, `VITE_APP_TITLE === 'Sinema'`. `vi.stubEnv` kullanılabilir.
- Zaman: `vi.useFakeTimers()` + user-event için `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })`.

### 3.1 Tip kontrolü
Egzersiz dosyaları + test dosyaları `curriculum/test-env/tsconfig.exercise.json` ile tsc'den geçer. Tip hatası = görev kalır.
- `strict`, `verbatimModuleSyntax` (tip import'ları **`import type`**), `erasableSyntaxOnly` (**enum/namespace YOK**), `jsx: react-jsx`, `moduleResolution: bundler`.
- `noUncheckedIndexedAccess` **KAPALI** (dizi erişimi `T` döner, `T | undefined` değil). `noUnusedLocals/Parameters` **KAPALI** (starter'da kullanılmayan parametre sorun değil).
- Starter'da kasıtlı eksik fonksiyon gövdesi yazarken dönüş tipini karşılayan bir yer tutucu döndür (`return 0`, `return []`, `return null`…) ki starter tip hatası yüzünden değil, **testlerden** kalsın (bilinçli "tip hatası bul" görevleri hariç).
- Testlerde tip iddiaları: `expectTypeOf<X>().toEqualTypeOf<Y>()` — tsc hatası o testi "kaldı" yapar (TypeScript modülleri için ideal).

### 3.2 `@test-utils` ve sahte TMDB (MSW)
Tüm testlerde MSW sunucusu açıktır; **tanımsız bir adrese istek atılırsa test hata verir** (gerçek ağa çıkılmaz).

```ts
import { requests, server, http, HttpResponse, delay, catalog, TMDB_BASE } from '@test-utils'

requests()                       // atılan tüm istekler: { method, url, path, search }
requests('/3/movie/550')         // yolu tam eşleşenler
requests(/\/search\/movie/)      // regex (tam URL'ye karşı)
server.use(http.get(`${TMDB_BASE}/movie/:id`, () => HttpResponse.json({...}, { status: 500 })))  // teste özel davranış
```

Sahte TMDB (`curriculum/test-env/msw/tmdb.ts`) gerçek API gibi davranır:
- **Yetkilendirme zorunlu**: `Authorization: Bearer <token>` başlığı (ya da `api_key` query) yoksa **401** `{ status_code: 7, … }`.
- Veriler gerçek TMDB cevaplarıdır, **`language=tr-TR`** ile alınmıştır → başlıklar Türkçe: 550 = **"Dövüş Kulübü"**, 27205 = **"Başlangıç"**, 155 = **"Kara Şövalye"**, 157336 = **"Yıldızlararası"**, 603 = **"Matrix"**, 680 = **"Ucuz Roman"**. Bu altısının tam detayı (credits, videos) var.
- Uç noktalar: `GET /configuration`, `/genre/movie/list`, `/trending/movie/{day|week}`, `/movie/popular`, `/movie/top_rated`, `/discover/movie` (`with_genres`, `sort_by`, `page`), `/search/movie` (`query`, `page`; Türkçe karakter/aksan duyarsız, başlık+orijinal başlıkta arar), `/movie/:id` (`append_to_response=credits,videos`), `/movie/:id/credits|videos|similar`, `/authentication/guest_session/new`, `POST|DELETE /movie/:id/rating?guest_session_id=`, `/guest_session/:id/rated/movies`.
- Liste cevapları: `{ page, results, total_pages, total_results }`, sayfa başı 20; geçersiz sayfa 400.
- Bulunamayan film: **404** `{ status_code: 34, … }`.
- `catalog` (≈100 film) içinde bazı filmlerin `release_date`'i, `poster_path`'i ya da `overview`'u **boş** — gerçek veri kirliliği; öğretimde kullan.
- Handler'lar `await delay()` içerir (Node'da hızlıdır; önizlemede gerçekçi gecikme verir).
- DummyJSON handler'ları (auth vb.) henüz yok; ihtiyaç duyan modül `curriculum/test-env/msw/` altına ekler ve `handlers.ts`'e kaydeder (koordinasyon için bkz. §7).

### 3.3 Kullanılabilir kütüphaneler
Egzersiz kodu ve testler kök `package.json`'daki paketleri import edebilir: `react`, `react-dom`, `react-router`, `@tanstack/react-query`, `react-hook-form`, `@hookform/resolvers`, `zod`, `@reduxjs/toolkit`, `react-redux`, `clsx`, `tailwind-merge`, `class-variance-authority`, `msw`, `@testing-library/*`, `vitest`, `eslint`, `prettier`. Başka paket gerekiyorsa §7.

---

## 4. Test yazma görevleri (mutation testing) — Modül 10'dan itibaren

```ts
defineQuestion({
  type: 'code',
  files: ['useDebounce.test.ts'],        // öğrencinin yazacağı test dosyası
  testWriting: {
    mutants: [
      { id: 'no-delay', label: 'bekleme süresini yok sayan versiyon' },
      { id: 'no-cleanup', label: 'eski zamanlayıcıyı temizlemeyen versiyon' },
    ],
  },
  ...
})
```
- `impl/` doğru implementasyon (öğrenciye salt okunur gösterilir). Öğrencinin testleri `@impl/useDebounce` import eder.
- `mutants/<id>/` yalnızca değişen dosyaları içerir (impl'in üstüne kopyalanır). Her mutant **tek, gerçekçi** bir hata içerir.
- `starter/` test iskeleti (`it.todo(...)` ile yön gösteren başlıklar), `solution/` referans testler.
- Doğrulama: referans testler impl'de geçmeli, **her mutant'ta en az bir test kalmalı**; starter geçmemeli.
- Mutant etiketleri öğrenciye görünür; hatanın **davranışını** anlatır, çözümü ele vermez.

---

## 5. Canlı önizleme (bileşen görevleri)

- `preview: { entry: 'Preview.tsx' }` — entry dosyasının **default export**'u bir bileşen olmalı. Genelde salt okunur bir `Preview.tsx`, öğrencinin bileşenini örnek props ile render eder.
- Önizlemede MSW (tarayıcı) aynı sahte TMDB'yi sunar; `import.meta.env.VITE_TMDB_TOKEN` = `'preview-token'`. Gerçek ağ kullanılmaz.
- Önizleme istekleri sayar ve **100 istekte durdurur** ("Sonsuz istek döngüsü tespit edildi"). Render içinde fetch gibi hataları GÖSTERMEK için mükemmel bir araç — pedagojide bilinçli kullan.
- Tailwind class'ları önizlemede çalışır.

---

## 6. Sinema projesi ve checkpoint'ler

- `curriculum/checkpoints/sinema/start` = öğrencinin başlangıçtaki projesi. `curriculum/checkpoints/sinema/NN` = NN. modülün **sonundaki** tam, doğrulanmış proje (bir önceki checkpoint + o modülün tüm proje görevleri).
- Her checkpoint **tam bir proje kopyasıdır** (node_modules hariç): `tsc -b` hatasız geçmeli.
- Modül NN'deki project testleri `checkpoints/sinema/NN`'e karşı **geçmeli**, bir önceki checkpoint'e karşı **kalmalı**.
- Checkpoint `package.json`'ına yeni bağımlılık eklenirse, sürümü kök `pnpm-workspace.yaml` catalog'undaki sürümle AYNI olmalı ve paket kök `package.json`'da da bulunmalı (doğrulama, checkpoint'i kökteki node_modules ile çalıştırır).
- Sinema'nın modül modül içeriği: `docs/curriculum-plan.md` → "Sinema hikâyesi". Dosya yolları ve export adları oradaki sözleşmeye uymalı; sonraki modüller onlara dayanır.
- Gerçek API: Sinema dev ortamında gerçek TMDB'yi kullanır (`language=tr-TR`). Testlerde MSW.

---

## 7. Koordinasyon kuralları (paralel yazım)

- **Sadece sana atanan modül klasörlerine yaz.** Başka modüllere, `packages/`, `apps/`, `curriculum/test-env/` dosyalarına dokunma — ihtiyaç varsa raporunda belirt (örn. "DummyJSON handler'ı gerekiyor"). İstisna: sana açıkça atanmışsa.
- Yeni kavram → modülün kendi `concepts.ts`'i (id biçimi: `alan.kavram`, küçük harf). Önce merkezi kayıtta benzeri var mı bak; tekrar tanımlama hata verir.
- Kök `package.json`'a paket ekleme; gerekiyorsa raporla.
- Commit atma (koordinatör atar).

---

## 8. Doğrulama ve bitiş kriteri

```bash
pnpm validate:content -m <modül-no>   # şema, kod blokları, çözüm geçer / starter kalır, checkpoint'ler
pnpm validate:content -m <no> --skip-runs  # sadece şema + kod blokları (hızlı)
```
Tek bir soruyu elle denemek: `pnpm check <kısa-kod>` (workspace'e göre), ya da doğrulama çıktısındaki hata mesajları.

Bitti sayılması için:
1. `pnpm validate:content -m N` → **✓ İçerik geçerli**.
2. Aşağıdaki kalite kontrol listesinin tamamı.

### Kalite kontrol listesi
- [ ] Modül ve her ders somut bir **acı** ile açılıyor; araç, acıdan SONRA geliyor.
- [ ] Planlanan soru sayısına yakın (±%20) ve karışım dengeli (~%40 quiz, ~%50 code, ~%10 project).
- [ ] Her ders içinde zorluk artıyor; tekrarlar **yenilik** içeriyor (aynı sorunun kopyası yok).
- [ ] Önceki modüllerin core kavramları yeni bağlamlarda kullanılmış ve `concepts`'e eklenmiş.
- [ ] Her code görevinde: net `prompt.md`, 1–3 kademeli ipucu, `solution.md` ("neden böyle?"), Türkçe açıklayıcı test adları, starter testlerden kalıyor (tip hatasından değil).
- [ ] Kod örnekleri güncel API'lerle (React 19, React Router 8, TanStack Query 5, Zod 4, RHF 7, RTK 2, Vitest 5, MSW 2, Tailwind 4) — `docs/research/` ile kontrol edildi.
- [ ] Quiz şıklarının her birinin açıklaması öğretici.
- [ ] Türkçe sade ve doğru; terimler tutarlı.
- [ ] Sinema görevleri `docs/curriculum-plan.md`'deki sözleşmeye (dosya yolu, export) uyuyor.
