# Müfredat v3: akıcılık ve öğrenci-merkezli yeniden düzenleme (2026-09-30)

v2 derinliği artırdı ama öğrencinin gözünden dersleri ağırlaştırdı. Bu plan v2'nin **üstüne** kurulur; yazım kuralları `docs/authoring-guide.md` §1.0–1.4'te güncellendi (çelişkide §1.0 kazanır).

## Öğrencinin geri bildirimi (2. modül ve sonrası)
- Konuya "tepeden iniliyor": ders doğrudan kural listesiyle ya da hiç yaşanmamış bir ekip senaryosuyla açılıyor.
- Açıklanmayan terimler ve kullanılmayacak anahtar kelime yığını ("keyword'e boğuldum").
- "Önce acı" ve sabit ders kalıbı her konuya zorla uygulanmış; doğal anlatım kaybolmuş.
- Görevlerin içi dolu: öğrenciye tek satırlık bir gövde kalıyor, dersin öğrettiği şeyi AI zaten yazmış.

## Ölçülen bulgular
| Bulgu | Kanıt |
|---|---|
| Prompt ↔ starter/test uyumsuzluğu | 3.3.3: prompt `Koltuk: 0`, test `Bilet: 0`. 3.8.3: prompt "Rafı ara" + kitaplar, starter/test "Film ara" + filmler. Kök neden: rehberdeki "ders örneği başka ad/senaryo/veri kullansın" kuralı v2'de prompt'ların başka alanlara taşınmasına yol açtı. |
| Görevlerde yazılan kod çok az | Öğrencinin yazdığı satır medyanı: M1 **2**, M2 **3**, M3 6, M8 3, M16 4, M15 5. M1'de 18 görevin 15'i, M2'de 18'in 11'i ≤3 satır. |
| Dersin asıl becerisi starter'da hazır | 2.4.2 `RemoteData` tipi starter'da; 2.1.3 generic imza starter'da, öğrenciye `items.find` kalıyor. |
| Konu yığma / erken konu | 3.1 (ilk React dersi) commit, effect, cleanup, StrictMode, `useLayoutEffect`, closure, abonelik ve render'ın iptalini anlatıyor; bunlar 5. modülün konuları. |
| Quiz'lerde doğru cevap hep ilk şık | 266 quiz'in 257'sinde tek doğru cevap 1. şık, geri kalanında doğrular baştan sıralı. → Platform şıkları artık her ziyarette ve her "tekrar dene"de karıştırıyor (`apps/platform/src/lib/shuffle.ts`). |

## Durum (2026-10-01): 2–22. modüller tamamlandı
- Her modül iki aşamada yeniden yazıldı. **A aşaması** (modül başına bir Codex işi): ders sırası ve görevler. **B aşaması** (en fazla 3 derslik parçalar): ders metinleri. Her modül için Antigravity'nin salt okunur denetimi girdi oldu, kararlar aşağıdaki modül bölümlerinde.
- Son tur: yeniden yazımda düşen diyagramlar geri yüklendi (28/28 ortak diyagram kullanımda, sahipsiz SVG yok).
- Öğrenilenler (sonraki turlar için):
  - "Uzunluk serbest" kuralı tek başına aşırı sıkıştırmaya yol açtı. Rehberdeki derinlik denetimi (§1.4 "Kısa ≠ sade") bunu önlüyor.
  - Bir işte en fazla 3 ders yazdır.
  - `kind: review` olan ama yeni kavram öğreten dersleri `concept` yap.
  - Diyagramları korumayı açıkça iste.
  - SVG'yi güncellerken her `<text>` düğümünü kontrol et.
- Kapsam dışı kalan: modül 0–1 (öğrenci geçti). M1'de görevlerin çoğu ≤3 satır, ayrı bir turda ele alınabilir.

## İlkeler (özet; bağlayıcı metin rehberde)
1. **Tanıdık başlangıç → en basit hal → adım adım büyüt → sonra genelle.** Kural listesi örneklerden sonra gelir.
2. **Her terim ilk geçtiği yerde sade Türkçeyle tanımlanır;** derste en fazla ~5 yeni terim; özet yeni terimleri listeler.
3. **Konu yığma yok:** nadir kullanılan ayrıntı ya ihtiyaç duyulan modüle taşınır ya da isteğe bağlı `:::info[Derinlemesine (isteğe bağlı)]` kutusuna gider; görevlerde sorulmaz.
4. **`:::pain` isteğe bağlı**, yalnızca gerçek bir belirti için. Uydurma ekip hikâyesi yok.
5. **Aynı dünya:** ders, prompt, starter ve test Sinema dünyasında kalır; prompt'taki her ad/metin/veri, starter ve testle harfiyen aynıdır.
6. **Görev iskelesi azalır:** ders içinde quiz (kod okuma/tahmin) → rehberli görev → kendi yazdığın görev. Starter dersin öğrettiği şeyi (tasarlanacak tip, generic imza, hook çağrısı, düzeltilecek satır) **içermez**. Tip görevlerinde testler `expectTypeOf` kullanır.
7. **Tekrar merdiveni korunur**, ama her tekrar gerçek bir yenilik taşır; birbirinin kopyası görevler birleştirilir.

## Süreç
1. **Denetim** (salt okunur, Antigravity `gemini-3.8-flash-high`): her modül için ders ders terim/erken konu/akış/görev uyumsuzluğu/iskele/sıra/kapsam raporu. Önce modül 3 ile deneme; rapor elle yapılan okumayla karşılaştırılır.
2. **Pilot yeniden yazım** (Codex `gpt-6-luna`, effort high): 2.1 generics. Çıktı elle okunur; rehber ve görev şablonu gerekirse düzeltilir; pilot, istenen kaliteye ulaşana kadar tekrarlanır.
3. **Modül yeniden yazımı**: aynı anda **en fazla 3 ajan**, her biri yalnızca kendi modül klasörüne yazar. Sıra: öğrencinin ilerlediği yer önce (3 → 2 → 4 → 5 → …).
4. **Doğrulama kapıları** (her modül için, ajan çıktısına güvenmeden koordinatör çalıştırır):
   - `pnpm validate:content -m N` → `✓ İçerik geçerli`
   - prompt ↔ test tutarlılık taraması + örneklem okuma (her modülden en az 3 görev: prompt/starter/test/çözüm yan yana)
   - en az 2 dersin baştan sona okunması (akış, terim tanımları, konu yığma)
   - `git diff --stat` ile yazma alanı kontrolü (başka modüle, `projects/`, `workspace/`, `progress.json`, motora dokunulmamış)

## Son geçiş (koordinatör, tüm modüller bittikten sonra)
- Ders sırası değişen modüller yüzünden metinlerdeki "3.1'de gördük" gibi numaralı atıflar ve rehber §2.5'teki "ilk kurulduğu ders" tablosu güncellenir (`grep -rnE "[0-9]{1,2}\.[0-9]{1,2}'?(de|da|te|ta|’)"`).
- Tüm müfredat için `pnpm validate:content` (tam) → `✓ İçerik geçerli`.

## Değişmeyenler
- Sinema proje görevlerinin **sözleşmeleri** (dosya yolu, export adı) ve `curriculum/checkpoints/` değişmez; prompt metinleri netleştirilebilir.
- `workspace/`, `progress.json`, `projects/` dokunulmaz. Ders/soru klasörü yeniden adlandırılırsa o sorunun eski ilerleme kaydı ve workspace dosyası yeni soruya bağlanmaz (soru "başlanmamış" görünür).
- Modül 0–1 bu turda kapsam dışı (öğrenci geçti); M1'deki "≤3 satır" sorunu ayrı bir turda ele alınabilir.

## Modül modül işler
Her modül için ortak iş: dersleri §1.0 akışıyla yeniden yaz, görevleri §2.3'e göre düzelt (tutarlılık, iskele, yalnızca öğretileni kullan, kopya görev yok). Aşağıda yalnızca modüle özgü kararlar var. Denetim raporlarındaki öneriler koordinatör tarafından süzüldü; burada yazmayan bir sıra/kapsam değişikliği yapılmaz.

### 2 · TypeScript ileri
- **Bitti (pilot):** 2.1 generics, 2.2 utility types (2.2'de küçük düzeltme: "destructuring" ve `@ts-expect-error` ilk geçtiği yerde tanımlanmalı; sondaki 7 maddelik kural listesi kısa bir özete dönmeli).
- **Yeni sıra:** 01 generics, 02 utility-types, **03 discriminated-union** (eski 04), **04 type-guards** (eski 05), **05 keyof-typeof** (eski 03), 06 satisfies-ve-as-const, 07 async-tipler, 08 pekiştirme, 09 proje. Gerekçe: `value is T` eski 03 ve 04'te, öğretildiği 05'ten önce kullanılıyordu.
- 03 DU: `RemoteData<T>` birliğini öğrenci yazar (starter'da olmaz); görevde `is` yüklemi gerekmez (bir sonraki derste gelir).
- 04 guards: `asserts value is T` → isteğe bağlı derinlemesine kutusu; Zod'a atıf tek cümle.
- 05 keyof/typeof: `as const` burada tanıtılır; `K extends keyof T` imzasını öğrenci yazar.
- 06: `as const` artık biliniyor; ders `satisfies`'a odaklanır; starter'da `satisfies` hazır olmaz.
- 07: `Parameters`/`ReturnType` → derinlemesine kutusu; görev `Awaited`/`Promise<T>` ile ilgili öğrencinin yazdığı bir tip içerir.
- 08: "mutant" terimi 0.7'ye atıfla tek cümlede hatırlatılır; 8.1'de `EndpointMap`/`readEndpoint` imzası starter'da hazır olmaz.
- 09 proje: sözleşme değişmez.

### 3 · React + TypeScript (öğrenci burada: 3.5)
- **Yeni sıra:** 01 props-ve-children, 02 eventler, 03 state-snapshot, 04 immutability, 05 listeler-ve-key, 06 kosullu-render, 07 controlled-input-ve-lifting-state, 08 composition, **09 render-modeli** (eski 01), 10 bileseni-test-etmek, 11 pekiştirme, 12 proje, 13 atölye.
- 09 render modeli: "React ekranı nasıl günceller?" sorusunu o ana kadar görülenlerle toplar (tetikleme → render → commit, saf render, StrictMode'un çift render'ı). `useEffect`, cleanup, `useLayoutEffect`, abonelik, render'ın iptali bu dersten çıkar (5. modülde `effect-yasam-dongusu` zaten kurar). "Render saftır" fikri 01'de tek paragraf olarak tanıtılabilir.
- 01 props: `ComponentProps<'button'>` + `Omit` → 08 composition'a taşınır.
- 03 snapshot: batching kısa, `Object.is` ve Promise continuation → derinlemesine.
- 06 koşullu render: M2'de öğrenilen discriminated union ile durum ekranı iyi bir spiral tekrar; `assertNever` derinlemesine.
- Bilinen uyumsuzluklar (mutlaka): 3.3.3 prompt `Koltuk` ↔ test `Bilet`; 3.8.3 prompt kitap/"Rafı ara" ↔ starter/test film/"Film ara"; 3.2.2 prompt `CoverFrame`/"Bir kitap" ↔ sözleşme `PosterFrame`; 3.6.1 quiz klasöründe başka görevden kalma `prompt.md`/`solution.md`; 3.5.3 çözümde `type="submit"` yok (ders istiyor).
- İskele: 3.2.3 (`Omit<ComponentProps>` hazır), 3.5.2 (`ChangeEvent` tipi hazır), 3.6.3 (tek kelimelik `key` düzeltmesi), 3.8.2 (`readOnly` → `onChange`), 3.9.2 (tek satır) görevleri öğrencinin kavramı yazacağı biçime getirilir.

### 4 · Tailwind ve UI
- **Yeni sıra:** 01 utility-first, 02 layout-flex-grid, **03 cn-yardimcisi** (eski 05), **04 tema-tokenlari**, **05 durumlar-ve-dark-mode**, 06 cva-varyantlar, 07 pekiştirme, 08 proje. Gerekçe: eski 04'teki görev `cn` öğretilmeden `${className ?? ''}` birleştirmesine zorluyordu; dark mode tema değişkenlerine dayanır.
- 01'de `@theme` erken; 04'e bırak. `@source`, `oklch(...)`, keyfi grid ifadeleri → derinlemesine.
- 06 cva: `Omit<ComponentProps<'button'>, 'size'> & VariantProps<…>` M3.08'de öğretilen `ComponentProps`'a dayanır; tipi öğrenci yazsın ama derste adım adım kurulsun.
- Uyumsuzluk: 4.2.3 prompt müzik parçası/süre ↔ kod/test film/puan; 4.3.2 ve 4.6.3 çözümlerde prompt'ta olmayan sınıflar (testler bunları istemiyorsa sorun değil; istiyorsa prompt'a yaz).

### 5 · Hook'lar
- Sıra korunur. 03 dependency-array'den `ignore`/`AbortController` çıkarılır (04'ün konusu). 04'te önce `ignore` bayrağı, sonra `AbortController` (sektör standardı, kalır).
- `useEffectEvent` stabil (React 19.2+); isteğe bağlı derinlemesine kutusunda kalabilir. `forwardRef` tarihçesi → tek cümle. Zustand/XState/RTK Query ad sayımı çıkar.
- İskele: 5.3 `[]`→`[id]`, 5.5 `key={id}`, 5.5 hazır filtre, 5.2 hazır fetch, 5.6 hazır ref görevleri öğrencinin kavramı yazacağı biçime getirilir.

### 6 · React Router
- **Yeni sıra:** 01 neden-router, 02 kurulum-ve-routelar, **03 navigasyon** (eski 06), 04 nested-layout, 05 url-parametreleri, 06 searchparams, 07 hata-ve-404, 08 lazy-route, 09 pekiştirme, 10 proje, 11 atölye. Gerekçe: `Link`/`NavLink` eski 02–03'te, öğretildiği 06'dan önce kullanılıyordu.
- Uyumsuzluk: 6.9.3 prompt "Gece treni" ↔ test "Kayıp harita"; 6.2.x ipucunda olmayan "Favoriler" linki.
- 08 lazy-route kısa tutulur; atölye 6.11 yerinde kalır (useEffect M5'te öğretildi).

### 7 · Sinema v1
- Sıra korunur. ASP.NET Core CORS örneği kod olarak değil kısa kavram notu olarak kalır (öğrenci backend'de ASP.NET kullanacak).
- Uyumsuzluk: 7.3 görevi `s-maxage` istiyor, ders öğretmiyor (ya derse ekle ya görevden çıkar); 7.6 rubric'inde prompt'ta olmayan StrictMode maddesi.
- 7.5 proje ipuçları 3–4 çözümü birebir veriyor: iskelet düzeyine indir.

### 8 · ESLint ve Prettier
- Sıra korunur. 06 modern alternatifler kısalır (derinlemesine). Husky/lint-staged kalır ama sadeleşir.
- Uyumsuzluk: 8.1.2 prompt `title` prop'u istiyor, starter/çözümde prop yok.
- 8.3.2 (iki karakterlik `[id]` düzeltmesi) yeniden tasarlanır; 8.4'teki programatik `prettier.format` görevi gerçek bir `.prettierrc` kararına dönüşebilir.

### 9 · Mimari ve refactor
- **Yeni sıra:** 01 state-kategorileri, 02 feature-klasorleri, **03 yol-takma-adi** (eski 04), **04 api-client** (eski 03), 05 ui-ve-mantik, 06 component-api, 07 guvenli-refactor, 08 pekiştirme, 09 proje, 10 atölye. Gerekçe: klasörleme bozulan göreli import'ları hemen alias ile çözer.
- İskele: 9.3.3, 9.7.3, 9.8.1, 9.8.2 (hazır `ApiError` sınıfı, testten geçen starter).
- 06 component-api: controlled/uncontrolled hibrit → derinlemesine.

### 10 · Vitest
- **Yeni sıra:** 01, 02, 03 matcherlar, **04 it-each** (eski 07), 05 ne-test-edilir, 06 mocklar, 07 fake-timers, 08 pekiştirme, 09 proje.
- 07 fake-timers: `renderHook`/`act` 11.8'de öğretiliyor; burada zamanlayıcılar düz fonksiyonlarla test edilir.
- Uyumsuzluk: 10.3.x prompt "ayrı assertion" ↔ çözüm tek; 10.6.x ve 10.9.2 prompt 499/500 ms istiyor, testler sınamıyor; starter `it.todo` sayısı ↔ çözüm test sayısı.
- 10.3 ve 10.7'deki "öğrenci implementasyon yazar, test hazır" görevleri test yazma görevine çevrilir (modülün konusu test yazmak).

### 11 · RTL ve MSW
- **Yeni sıra:** 01, 02, 03 user-event, **04 msw-perdesi** (eski 05), **05 asenkron** (eski 04), 06 msw-senaryolari, 07 custom-render, 08 renderhook, 09 fabrikalar, 10–12. Gerekçe: eski 04'ün görevi MSW handler'ı yazdırıyordu.
- Uyumsuzluk: 11.8.1 prompt `toggle('Mavi')` ↔ impl `toggle(id: number)`.
- 11.3.2, 11.4.2, 11.7.3: test modülünde bileşen yazdıran görevler test yazma görevine çevrilir. 11.7.2 hazır helper.

### 12 · TanStack Query
- **Yeni sıra:** 01, 02, 03 query-keyleri, **04 stale-ve-gc** (eski 05), **05 queryoptions-factory** (eski 04), 06 bagimli-sorgular, 07–12. Gerekçe: eski 04 `staleTime`'ı öğretilmeden kullanıyordu.
- 06: önce `enabled`, sonra TypeScript dostu alternatif olarak `skipToken`.
- 05'teki ETag/304 tekrarı → 7.3'e tek cümle atıf. v4 karşılaştırmaları ve Redux atıfları çıkar.
- Uyumsuzluk: 12.7.2 prompt "cevap sayısı" ↔ çözüm/test yok; 12.9.2 prompt "pointer" ↔ test `mouseEnter`.

### 13 · Query mutation
- Sıra korunur. 13.7.2, 13.2.2'nin kopyası: yeni bir durum ekleyerek farklılaştır. 13.4.2 Suspense/ErrorBoundary'ye dokundurmayan görev yeniden tasarlanır.
- 13.1.2 ve 13.7.1'de mutation dersinde yalnızca `fetch`/`localStorage` yazdıran görevler `useMutation` odaklı olur.
- Uyumsuzluk: 13.3.3 prompt `rate` fonksiyonunu parametre gibi anlatıyor ↔ starter `useOptimisticRating(sessionId)`; 13.8.1 `deleteRating` imzası 13.7.1 ile çelişiyor (hangisi doğruysa prompt açıkça söyler). 13.9.2 atölye "belirti → teşhis" biçiminde kalır ama prompt'taki UI metinleri testlerle birebir olur.
- `idempotency`, `MutationCache`, `correlation id` gibi terimler ya tanımlanır ya derinlemesine kutusuna gider.

### 14 · React Hook Form
- **Yeni sıra:** 01, 02, 03 validasyon-ve-hatalar, **04 formstate-ve-reset** (eski 06), **05 controller** (eski 04), **06 usefieldarray** (eski 05), 07 mutation-ile-gonderim, 08 react19-form-actions, 09 erisilebilir-formlar, 10 proje, 11 atölye. Gerekçe: controller görevi `fieldState`/`defaultValues`'ı öğretilmeden kullanıyordu.
- Erişilebilir hata gösterimi (`aria-invalid`, `aria-describedby`, `role="alert"`) 03'te kısa ve uygulamalı öğretilir, çünkü görevler 03'ten itibaren test ediyor; 09 derinleşme olarak kalır.
- Uyumsuzluk: 14.5.2 (eski 04.2) prompt "Yorum gerekli" ↔ çözümde kural yok; 14.10.1 "Liste kaydedildi" test edilmiyor; 14.11 solution.md `useEffect` ile `reset` öneriyor (ders bunu yasaklıyor) → `key` ile sıfırlama ya da `values` seçeneği.
- 14.1.2: 8 alanlı form starter'da hazır; acıyı öğrenci yaşamalı (en azından alanların yarısını kendisi yazar).

### 15 · Zod
- **Yeni sıra:** 01 aci, 02 semalar, 03 z-infer (yalnızca `z.infer`), **04 sema-kompozisyonu** (eski 09), 05 refine, 06 transform-ve-coerce (`z.input`/`z.output` burada), 07 zodresolver, 08 api-dogrulama, 09 tipli-env, 10 proje, 11 atölye. Gerekçe: `z.input`/`z.output` dönüşümden önce anlatılıyordu; türetilmiş şemalar formlarda gerekiyor.
- İskele: 15.3.2 hazır `z.infer`, zodresolver görevinde hazır `useForm<z.input…>` ve `resolver`.
- Uyumsuzluk: 15.8.3 (api-dogrulama) prompt "results ve title yolu" ↔ test yalnız `title`; 15.10.1 `types.ts` türetmesi test edilmiyor (prompt'ta kalacaksa rubric'e); 15.10.3 `role="alert"` test edilmiyor.

### 16 · Redux Toolkit
- **Yeni sıra:** 01 aci, 02 server-vs-client-state (Redux kodu çıkar, kavram kalır), 03 store-ve-slice, **04 immer** (eski 06), **05 tipli-hooklar**, **06 selectorler**, **07 async-thunk** (eski 08), **08 listener-middleware** (eski 07), 09 redux-testleri, 10 alternatifler, 11 proje, 12 atölye. Gerekçe: Immer taslak mutasyonu 03'ten beri kullanılıyordu.
- 09 redux-testleri: öğrenci test yazar (mutant'lı test yazma görevi, rehber §4).
- 12 atölye: çözümü Redux'suz görevler ya Redux'a dayanacak biçimde düzeltilir ya da prompt açıkça "Redux gerekli mi, karar ver" görevi olur ve `concepts` buna göre düzeltilir.
- 16.7 (thunk): `buildCreateSlice`, `asyncThunkCreator`, `meta.requestId` → derinlemesine. İskele: 16.3 (`, ui`), 16.5 hazır tipli hook'lar, thunk görevinde hazır `extraReducers`.

### 17 · Kimlik doğrulama ve güvenlik
- **Yeni sıra:** 01 jwt-temelleri, 02 login-akisi, 03 token-saklama, 04 yetkili-istekler, **05 korumali-routelar** (eski 06), **06 cikis-ve-temizlik** (eski 07), **07 refresh-token** (eski 05), 08–13. Gerekçe: en zor akış (tek uçuşta refresh) kullanıcı yolculuğu tamamlandıktan sonra.
- Uyumsuzluk: görev prompt'larında DummyJSON uç noktaları (`/auth/login`, `/auth/me`, `/auth/refresh`, taban adres) yalnızca ipuçlarında; Sözleşme'ye yazılır. 17.2.x `onLogin` imzası prompt ↔ starter farklı.
- 01'deki elle Base64URL dolgu → küçük hazır yardımcı + derinlemesine kutusu. 03'teki XSS/CSRF ileri atıfları tek cümle.
- Sinema proje görevi (17.12) sözleşmesi ve checkpoint'ler değişmez.

### 18 · Performans
- Sıra korunur (önce ölç, sonra nedenleri). 08 actions/useOptimistic yerinde kalır.
- Uyumsuzluk: 18.2.3 "Film sonuçları hazır" metni; 18.3.2 "girdiyi mutasyona uğratma" ↔ çözüm kopya almıyor; 18.5.3 `role="status"`; 18.8.3 `aria-pressed`; 18.6.1 `initialRect` prompt'ta yok.
- 04 React Compiler: yapılandırma bilgi yarışması yerine önce/sonra davranış karşılaştırması.

### 19 · Pattern'ler ve a11y
- Sıra korunur. `useEffectEvent` ve `<ViewTransition>` React 19.2/19.3'te stabil (`docs/research/react-ecosystem.md`), kalır.
- İskele: 19.3.2 (body portal), 19.4.2 (tabs temeli). 19.8 tipli mesaj kataloğu tip jimnastiği sadeleşir; 19.7 declaration merging quiz'i → HOC/render props karar sorusu.

### 20 · shadcn/ui (isteğe bağlı)
- **Yeni sıra:** 01, 02 tema, 03 form, **04 proje-gorevi** (eski 05), **05 atölye** (eski 06), **06 storybook** (eski 04, isteğe bağlı okuma). Proje görevi checkpoint'e bağlı: klasör adı değişince validate'in checkpoint eşlemesi bozuluyorsa sıra korunur ve bu not raporlanır.
- 02.3 OKLCH regex görevi → gerçek bir tema görevi; 03.3 form iç yapısını yeniden yazdıran görev → shadcn Form'u kullanan kompozisyon görevi. 20.6 atölye çözümleri shadcn parçalarını kullanır.
- Uyumsuzluk: 20.5.1 tetikleyici düğme adı `Fragmanı aç` prompt'ta yazmıyor.

### 21 · Playwright, CI ve yayına alma
- **Yeni sıra:** 01 neden-e2e, **02 locatorlar-ve-assertionlar** (eski 03), **03 ilk-e2e** (eski 02), 04–12. Gerekçe: ilk e2e görevi locator/assertion'ları öğretilmeden kullanıyordu.
- Uyumsuzluk: 21.3.3 (eski 2.3) prompt `sinema-config.ts` ↔ dosya `sinemaConfig.ts`.
- 04 fixture/page object: `erasableSyntaxOnly`/parameter property uyarısı → tek cümle; worker scope → derinlemesine.

### 22 · Bitirme (Kitaplık)
- Sıra korunur; "kitap" dünyası bilerek seçildi (bitirme projesi Kitaplık). 22.7'deki ASP.NET Core bölümü kalır (öğrenci kararı).
- Uyumsuzluk: boş arama metni 22.1 "Kitap bulunamadı" ↔ 22.4 "sonuç bulunamadı"; ADR 0003 adı 22.2 ↔ 22.6 çakışması; 22.5 "detaydan çıkarma" test edilmiyor; 22.6 "üç test" ↔ test "üç dosya" sayıyor; 22.3 kurulum testinin beklediği paketler prompt'ta listelenmeli.
