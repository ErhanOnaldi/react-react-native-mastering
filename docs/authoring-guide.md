# İçerik Yazım Rehberi

Bu rehber, `curriculum/` altına modül yazan herkes (insan ya da AI) için bağlayıcıdır.
Önce şunları oku: `docs/superpowers/specs/2026-09-25-react-mastering-platform-design.md` (§2 pedagoji, §11 müfredat haritası), `docs/curriculum-plan.md` (senin modülünün ders planı ve Sinema hikâyesi) ve **referans modül** `curriculum/modules/00-baslangic/` (her soru tipinin çalışan örneği).
Güncel kütüphane API'leri için: `docs/research/*.md` — eğitim verindeki eski API'leri öğretme.

---

## 1. Pedagojik kurallar (pazarlığa açık değil)

### 1.0 Öğrenci kim, ders nereden başlar (v3 — diğer kurallarla çelişirse bu kazanır)
Öğrenci temel JavaScript biliyor ve basit React yazmış (component, props, `useState`, listeyi `map` ile basmak, basit form). TypeScript'te yalnızca 1. modülde öğrendikleri var. `useState` + props'tan derin her React kavramı **yeni**. "Biliyor" diye varsaydığın her şeyi bu listeye göre kontrol et.

Her ders **öğrencinin zaten bildiği bir şeyden** başlar ve üstüne **tek seferde tek yeni fikir** koyar:
1. **Tanıdık başlangıç:** Bildiği bir kod, editörde göreceği gerçek bir hata mesajı, ya da Sinema'da gerçekten yapacağı küçük bir iş. Örnek: generics dersi "`string[]` aslında `Array<string>`; `useState<number>` yazdın, bu da bir generic" diye açılır.
2. **En basit hali:** 10 satırı geçmeyen ilk örnek; yalnızca yeni fikir, başka hiçbir yenilik yok.
3. **Adım adım büyüt:** Her yeni kod bloğu öncekine **en fazla bir** yeni şey ekler ve o şeyin ne olduğu bloktan önce söylenir.
4. **Sonra genelle:** Kural listesi ya da "zihinsel model" özeti, öğrenci örnekleri gördükten **sonra** gelir, önce değil.

**Terim kuralı:** Bu kursta ilk kez geçen her teknik terim (ör. `generic`, `constraint`, `render`, `commit`, `mutation`, `closure`, `narrowing`) **ilk geçtiği cümlede ya da hemen sonrakinde** sade Türkçeyle tanımlanır: ne olduğu + neden umursadığın, tek cümle. Tanımlanmamış terimle cümle kurma. Bir derste **en fazla ~5 yeni terim**; daha fazlası gerekiyorsa ders bölünür ya da terimlerin bir kısmı sonraki derse ertelenir. Ders sonundaki özet, dersin yeni terimlerini tek satırlık tanımlarıyla listeler.

**Konu yığma yasağı:** Derste yalnızca o dersin görevlerinin ve sonraki birkaç dersin gerçekten ihtiyaç duyacağı şeyler öğretilir. Sektörde nadir kullanılan ayrıntılar (ör. `useLayoutEffect`, eşzamanlı render'ın iptali, `Awaited` iç yapısı, assertion fonksiyonları) ya **ihtiyaç duyulacağı modüle taşınır** ya da dersin sonunda `:::info[Derinlemesine (isteğe bağlı)]` kutusuna konur. Bu kutudaki bilgi hiçbir görevde ve quiz'de sorulmaz. İleriye atıf tek cümleyi geçmez ("Bunu 5. modülde, effect'lerle göreceğiz.").

**Sıra kuralı:** Bir ders yalnızca kendinden önceki derslerin öğrettiğini kullanabilir. Bir kavram önceki bir derste kullanılıyorsa sıra yanlıştır: ya dersin yeri değişir ya da kullanım çıkarılır.

### 1.1 İhtiyaca göre öğretim ("önce kır, sonra düzelt") — doğal olduğunda
Bir aracın varlık sebebi bir bozulmaysa şu sıra çok iyi çalışır:
1. **Saf yöntem** — öğrencinin o ana kadar bildikleriyle çözülür.
2. **Görünür bozulma** — sorun gözle görülür: test mesajı (`Beklenen: 1 istek, atılan: 47`), önizlemedeki istek sayacı, yanlış sonuç, çöken sayfa.
3. **Çözüm** — kavram/araç tanıtılır.
4. **Sonraki katman, ihtiyaç anında** — derin ayrıntı (örn. dependency array) ancak ihtiyaç doğduğu bağlamda açılır.

Bu bir araçtır, her derse zorla uygulanacak bir kalıp değil. **`:::pain` kutusu isteğe bağlıdır** ve yalnızca öğrencinin gerçekten yaşayacağı ya da ekranda göreceği bir sorunu anlatır. Öğrencinin hiç yaşamadığı, uydurma ekip senaryoları ("bir ekip arkadaşı alanı iki tipte güncellemeyi unuttu") açılış olarak kullanılmaz. Doğal bir acı yoksa ders §1.0'daki tanıdık başlangıçla açılır.
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
- Yanlış bilgi vermektense konuyu dar tut. Emin olmadığın API'yi `docs/research/`'ten doğrula (web platformu konuları: `docs/research/web-platform.md`).

### 1.4 Ders uzunluğu ve derinlik
**Uzunluk zorunluluğu yok.** Ölçü, kavramın doğru ve eksiksiz aktarılmasıdır: öğrenci dersi bitirdiğinde kavramı bir arkadaşına kendi cümleleriyle anlatabilmeli ve görevleri dersten öğrendikleriyle çözebilmeli. Kelime saymak için bölüm ekleme, "derinlik" diye ilgisiz ayrıntı yığma. Bir ders çok uzuyorsa bu genelde iki ayrı fikir anlattığının işaretidir: böl. Çok kısa kaldıysa eksik olan genelde örnek ya da iz sürmedir, soyut metin değil.

**Kısa ≠ sade.** Sadelik, terimleri tanımlamak ve fikirleri sırayla vermektir; açıklamayı kesmek değildir. Zorlanan bir öğrenciye bir kavram 250 kelimeyle öğretilemez. Her concept dersinde şu **derinlik denetimi** geçmelidir (kelime sayısı değil, içerik ölçütü):
- Kavram en az **üç ilerleyen örnekle** kurulur (en basit hal → bir değişiklik → gerçekçi Sinema kullanımı); her örnekten sonra "ne oldu, neden?" düzyazıyla açıklanır.
- Zamanlamanın ya da sıranın önemli olduğu konularda (state, render, event, effect, async, cache) kod **adım adım iz sürülür**: hangi satır ne zaman çalışır, değişken hangi değeri görür, ekranda ne yazar (tablo iyi çalışır).
- Öğrencinin gerçekten yapacağı en az bir yanlış, belirtisiyle gösterilir ve düzeltilir.
- "Neden böyle?" sorusu cevaplanır; kural yalnızca söylenmez, gerekçelendirilir.
- Ders örneği görev çözümünün aynısı değildir (§1.4 aşağıda).
Bir concept dersi bu denetimi geçtiğinde pratikte çoğunlukla 800–1.600 kelime tutar; 500 kelimenin altına düşen bir concept dersi neredeyse her zaman eksiktir, tekrar gözden geçir. **Var olan bir dersi yeniden yazarken** eski metindeki doğru ve değerli açıklamaları, iz tablolarını ve örnekleri **koru ve yeniden düzenle**; yalnızca konu yığmasını, tanımsız terimleri ve zorlama kalıbı çıkar.

`minutes` ≈ kelime / 130 + her büyük kod bloğu için 1 dk (yalnızca öğrenciye tahmini süre göstermek için).

#### Referans aldığımız kurslar ve onlardan aldığımız teknik
| Kaynak | Aldığımız teknik |
|---|---|
| react.dev "Learn" | Tanıdık örnekten başla; her bölüm tek fikir; kavramı önce küçük etkileşimli örnekle göster, sonra kuralı söyle; "Deep dive" bölümleri isteğe bağlı → bizde `:::info[Derinlemesine (isteğe bağlı)]`. |
| Joy of React (Josh Comeau) | Tahmin et → çalıştır → açıkla; metafor ve görsel sezgi; terimi ilk geçtiği yerde tanımla. |
| Epic React (Kent C. Dodds) | Kısa ders → hemen egzersiz; egzersizde asıl işi öğrenci yazar; üstüne "ekstra puan" adımları (kolay taban, yüksek tavan). |
| Total TypeScript (Matt Pocock) | Tipi ihtiyaç anında öğret; önce editörde görülen gerçek hata mesajı, sonra çözüm; ileri tip ayrıntılarını React'ten önce yığma. |
| The Odin Project / freeCodeCamp | Küçük adımlarla ilerleyen proje; her adım bir öncekinin üstüne tek yenilik ekler. |
| Eğitim araştırması: çözümlü örnek → azalan iskele (faded worked examples), bilişsel yük kuramı | Önce tam çözümlü örnek, sonra kısmen boşaltılmış görev, sonra boş görev; aynı anda tek yeni fikir; alakasız bağlam değişikliğinden kaçın. |

**Ders örneği ≠ görev çözümü.** Ders, sorularının cevabını birebir vermez: görevin fonksiyonunu/bileşenini derste yazıp "doğru örnek" yapma. Ama ders **aynı dünyada** kalır: Sinema'nın filmleri, oyuncuları, türleri, favorileri. Kavramı öğretmek için kitap, yazar, otel, etkinlik gibi alakasız alanlara geçme; bağlam değiştirmek öğrenciye ekstra yük bindirir. Ders film listesini sıralıyorsa görev tür listesini filtreleyebilir: aynı dünya, farklı iş.

**Görev metni, starter ve test aynı dünyayı anlatır.** Prompt'ta geçen her ad, veri, UI metni ve erişilebilir ad; starter'daki kodla ve testlerin aradığı değerlerle **harfiyen** aynıdır. Prompt'u başka bir konuya taşıyıp starter/testi eski halinde bırakmak en ağır hatadır: öğrenci prompt'a uyduğu halde testten kalır.

**Ders metni görevlerin iç yapısından söz etmez.** "Bu görevin testi şunu kontrol eder", "MSW ilk isteği 90 ms geciktiriyor", "prompt şunu söyler, ipucu şunu açıklar" gibi cümleler yazılmaz. Test yazmayı öğreten dersler (0.7, 3.10, 10–11. modüller) test tekniklerini genel örneklerle anlatır. Pekiştirme/proje/atölye derslerinin kısa girişleri görevlerin **ne ölçtüğünü** söyleyebilir, testlerin nasıl yazıldığını söylemez.

Bir concept dersinin **iskeleti** §1.0'daki akıştır (tanıdık başlangıç → en basit hal → adım adım büyüt → genelle). Başlıklar konuya özgü olsun, "Kavram"/"Örnek" gibi jenerik başlık yazma. Aşağıdakiler **araç kutusudur**, zorunlu bölüm listesi değildir; konuya yarayanı kullan:
- **Zihinsel model** — kuralları, öğrenci örnekleri gördükten sonra kısa ve kesin biçimde topla. Bir diyagram gerçekten yardım ediyorsa ekle (§2.4); süs için ekleme.
- **Adım adım iz sürme** — zamanlamanın önemli olduğu konularda (state, effect, async) kodu satır satır yürüt; tablo iyi çalışır. Basit konularda gerekmez.
- **Kırık → doğru** — gerçek bir hatadan doğan konularda (§1.1).
- **Sık hatalar** — en fazla 3 `:::mistake`: `belirti → neden → düzeltme`. Öğrencinin gerçekten düşeceği tuzaklar; uydurma değil.
- `:::sector` — sektörde gerçekten farklı bir alışkanlık varsa, 2–3 cümle. Söyleyecek somut bir şey yoksa yazma.
- **Özet** (zorunlu) — 3–5 madde + dersin **yeni terimleri** (her biri tek satır tanım) + 1–2 "kendini yokla" sorusu (cevabı hemen altında).

### 1.5 Zihinsel modeller ve tekrar
Müfredatın taşıyıcı zihinsel modelleri §2.5'teki tabloda listelidir. Her model **bir kez**, tabloda gösterilen derste derinlemesine kurulur (ortak diyagramıyla). Sonraki derslerde bu modele dayanan her yerde `:::model[Model adı]` kutusuyla **hatırlatılır**: 2–5 cümlelik öz, gerekirse aynı ortak diyagram, ardından "bu yeni bağlamda ne değişiyor?" sorusunun cevabı. Hatırlatma, ilk anlatımın kopyası değildir; yeni bağlama uygulanmış halidir.

### 1.6 Üslup: makine metni gibi yazma
Metin, kıdemli bir geliştiricinin yanındaki arkadaşına anlatması gibi okunmalı. Şunlar **yasak**:
- İçeriği olmayan köprü cümleleri: "X burada Y'ye dönüşüyor", "Sinema'daki sorun, aracın hangi problem için düşünüldüğünü gösteriyor", "Bu zihinsel model biraz sonra … anlamanı kolaylaştıracak", "React temellerindeki saflık kuralı burada uygulamaya dönüşüyor". Her paragraf yeni bir bilgi taşımalı; taşımıyorsa sil.
- Aynı fikri iki başlık altında yeniden söylemek (tekrar merdiveni **yeni bağlam** ister, aynı paragrafı değil).
- Soyut isim yığınları ("senkronizasyon ilişkisinin yaşam döngüsü bağlamında…"). Yerine somut ol: sayı, kod satırı, gözlenen çıktı ("ekranda 1 yazar", "Network'te 3 GET görürsün").
- Öğrenciye görünen metinde iç terimler: "koordinatör", "araştırma notu", "yazar", "doğrulama hattı", "checkpoint sözleşmesi", "kök bağımlılıklar değiştirilmez" gibi. Kurulu olmayan bir paket gerekiyorsa öğrenciye ne kuracağını söyle ya da konuyu kavramsal anlat.
- Paragraf yerine madde yığını. Açıklama paragrafla, kural listesi maddeyle yazılır.
- "Bu derste şunu öğreneceksin" tarzı meta anlatım (en fazla bir cümle); görevlerin testlerinden, prompt'larından ya da ipuçlarından söz eden cümleler (§1.4).

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
title: "Race condition ve AbortController"
minutes: 16
kind: concept        # concept | review (tekrar) | practice (pekiştirme) | project (proje görevi)
---

# Race condition ve AbortController

:::pain[Problem]
"Dövüş" yazıp hemen "Matrix" yazınca liste bir an Matrix'i gösteriyor, sonra Dövüş Kulübü'ne geri dönüyor.
:::

## İki istek, bir ekran          ← zihinsel model + diyagram
## Zaman çizelgesinde iz sürelim ← adım adım tablo
## Önce kırık, sonra doğru       ← örnekler
## Sık hatalar                    ← :::mistake kutuları
:::sector … :::
## Özet                           ← maddeler + kendini yokla
```
Frontmatter YAML'dır: `title` değerini **her zaman çift tırnakla** yaz (`title: "Sinema v2: düzenli yapı"`) — iki nokta, `@`, `#` gibi karakterler tırnaksız YAML'ı bozar.

Zorunlu parçalar §1.4'te. Tekrar (`review`) derslerinde ilgili modeller `:::model` ile hatırlatılır ve yeni bağlamda uygulanır.

**Bilgi kutuları:** `:::pain`, `:::model` (zihinsel model hatırlatması), `:::tip`, `:::warning`, `:::mistake` (sık hata), `:::sector` (sektörde), `:::info`. Başlık opsiyonel: `:::tip[Kısa yol]`, `:::model[Render → commit → effect]`.

**Diyagram:** `![Ekran okuyucu açıklaması](diagram:render-commit)` (ortak) ya da `![Açıklama](diagrams/yaris.svg "Görünen altyazı")` (dersin kendi klasörü). Ayrıntılar §2.4.

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
  hints: ['…', '…', '…'],             // 2–4 kademeli ipucu: yön → yöntem → iskelet (→ tuzak)
  preview: { entry: 'Preview.tsx' },  // (ops.) bileşen görevlerinde canlı önizleme
  rubric: ['…'],                      // (ops.) kod kalitesi için AI review kriterleri
  reviewFiles: ['…'],                 // (ops.) review'a girecek dosyalar (varsayılan: files)
  testWriting: { mutants: [...] },    // (ops.) test yazma görevi — §4
  timeoutMs: 30000,                   // (ops.)
})
```
- `starter/` TÜM dosyaları içerir (düzenlenebilir + salt okunur yardımcılar). `files` dışındakiler salt okunur gösterilir.
- **İskele azalır, asıl işi öğrenci yazar (v3):** Bir dersin görevleri kolaydan zora: quiz (kod okuma / "ne olur?" tahmini) → rehberli görev (iskelet var, dersin kavramını öğrenci yazar) → kendi görevi (yalnızca sözleşme; dosyanın gövdesini öğrenci kurar). Starter **dersin öğrettiği şeyi içermez**: tasarlanacak tip, generic imza, `extends` kısıtı, hook çağrısı, doğru state güncellemesi, düzeltilecek satırın yeri. Tip dersi görevlerinde tip davranışı `expectTypeOf` ile test edilir; öğrencinin yazdığı yalnızca düz JavaScript olan bir "tip görevi" yazma. Görevde öğrencinin yazacağı kod çoğu zaman 5–30 satırdır; 1–2 satırlık görev yalnızca ilk rehberli adımda kabul edilir. "Hatayı bul, düzelt" görevi bir derste en fazla bir tanedir ve prompt belirtiyi söyler, yerini söylemez.
- **Görev yalnızca öğretileni kullanır:** Prompt, sözleşme, ipuçları, starter ve beklenen çözüm; yalnızca bu derse kadar (bu ders dahil) öğretilmiş dil özelliklerini, tipleri ve API'leri gerektirir. Ör. `Record` 2.2'de öğretiliyorsa 2.1'in görevi `Record` dönemez; `readonly` dizi öğretilmediyse imzada olmaz.
- **Tekrar ≠ kopya:** Aynı dersteki iki görev aynı imzayı ya da aynı işi farklı isimle istemez (ör. `findById` ve `findOnPage`). Her görev yeni bir şey ekler: yeni bir durum, iki kavramın birleşimi, yeni bir kısıt.
- **Tutarlılık (en ağır hata):** Prompt'taki her ad, export, dosya adı, örnek veri, UI metni ve erişilebilir ad; starter, testler ve çözümle harfiyen aynıdır. Prompt'u değiştirdiysen starter'ı ve testleri de aynı dünyaya getir (ve tersi). Bitirmeden önce her görevi prompt → starter → test → çözüm sırasıyla yan yana oku.
- `solution/` yalnızca `files` listesindeki dosyaların çözümünü içerir (doğrulamada starter'ın üstüne kopyalanır).
- `prompt.md` görev metni **LeetCode gibi** yazılır: ne istendiği net, nasıl yapılacağı yok. Testi geçmek için bilinmesi **zorunlu** olan her şey metinde; yönteme dair her şey ipuçlarında. Biçim:
  ```md
  1–3 cümle: ne yapılacak, iş bağlamında neden gerekli. (Yöntem yok.)

  ## Gereksinimler
  - Gözlenebilir davranışlar (testlerin kontrol ettikleri), madde madde.

  ## Örnek
  Girdi → çıktı tablosu ya da kısa etkileşim senaryosu.

  ## Sözleşme
  - Dosya ve export: `useDebounce.ts` → `useDebounce<T>(value: T, delay: number): T`
  - Arayüz: testlerin aradığı rol/ad/metin (ör. "`Favorilere ekle` adlı düğme, `aria-pressed` ile durumunu gösterir").

  ## Kısıtlar            (opsiyonel)
  - Testlerin zorladığı sert koşullar (ör. "her sorgu için en fazla 1 istek", "`Authorization: Bearer` başlığı gönderilir").
  ```
  Metinde hook, kütüphane API'si, desen ya da teknik adı (`useEffect`, `ignore` bayrağı, `AbortController`, `useReducer`, `queryOptions`, `Controller`…) **geçmez**. Tek istisna: testler o adı import ediyor ya da tipini kontrol ediyorsa Sözleşme'de imza olarak yazılır. Önizleme varsa "Önizlemede nasıl görürsün" tek cümleyle Örnek'e eklenebilir.
- `hints`: **2–4** kademeli ipucu. Sıra: (1) yön — neye bakmalı, hangi soruyu sormalı; (2) yöntem — API/teknik adı; (3) iskelet — neredeyse çözüm, kısa kod parçası; (4) opsiyonel — en sık tuzak. Prompt'tan çıkarılan yardımcı ayrıntılar buraya taşınır.
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
- Görev metni **dosya yolunu ve export adını açıkça** söylemeli (testler oraya bakar). Geri kalanı code görevleriyle aynı LeetCode biçimindedir: davranış ve sözleşme metinde, yöntem ipuçlarında.
- Testler davranışı test etsin (render çıktısı, fonksiyon sonucu), uygulama detayını değil — öğrencinin geçerli farklı çözümleri de geçmeli.

**Refactor görevleri** (çalışan spagetti → temiz yapı): doğrulama başlangıç kodunun **kalmasını** ister. Bu yüzden testler iki katmanlı olur: (1) davranış testleri — spagetti de geçer, refactor sonrası da geçmeli; (2) yapı testleri — görev metninde açıkça istenen yeni birimler (örn. `useMovieSearch.ts`'ten export edilen hook, `MovieList` bileşeni) import edilip davranışları test edilir; spagetti bunlara sahip olmadığı için kalır. Kalan kalite (isimlendirme, sorumluluk ayrımı) `rubric` ile AI review'a bırakılır.

### 2.4 Diyagramlar

Ders metnindeki diyagramlar satır içi SVG olarak gösterilir ve platformun temasına (açık/koyu) uyar. SVG dosyalarını elle yazarsın; stil **yalnızca sınıflarla** verilir.

**Yerleşim:** ortak zihinsel model diyagramları `curriculum/diagrams/<ad>.svg` (markdown'da `diagram:<ad>`); yalnızca bir derse ait olanlar `<ders>/diagrams/<ad>.svg` (markdown'da `diagrams/<ad>.svg`). Diyagram **tek başına bir paragrafta** durur; alt metni (köşeli parantez) ekran okuyucu açıklamasıdır ve boş olamaz; tırnaklı başlık varsa görünen altyazı olur.

**Kurallar:**
- Kök: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 H">` (genişlik 760; yükseklik içeriğe göre, genelde 180–420). `width`/`height` yazma. İlk çocuk `<title>`.
- Yasak: `<style>`, `<script>`, `<foreignObject>`, `on*=` öznitelikleri, dış `href`, sabit renk (`fill="#…"`). Doğrulama hattı bunları reddeder.
- Sınıf sözlüğü (renkler platform CSS'inden gelir):

| Sınıf | Ne için |
|---|---|
| `d-box` | nötr kutu |
| `d-accent`, `d-success`, `d-danger`, `d-warning`, `d-violet` | vurgulu kutu (dolgu yumuşak renk, kenar renk) |
| `d-lane` | arka plan bandı / grup alanı (kesikli) |
| `d-title` | kalın kutu başlığı |
| `d-text` | normal metin (14px) |
| `d-muted` | ikincil küçük metin (12px) |
| `d-code` | kod metni (monospace, 12.5px) |
| `d-text-accent`, `d-text-success`, `d-text-danger`, `d-text-warning` | renkli metin |
| `d-line`, `d-line-accent`, `d-line-danger` | çizgi / ok gövdesi (`fill: none`) |
| `d-dashed` | kesikli çizgi (diğer çizgi sınıfıyla birlikte) |
| `d-arrowhead`, `d-arrowhead-accent`, `d-arrowhead-danger` | ok ucu `marker` içindeki `path` |

- Metin: `text-anchor="middle"` ile kutuya ortala; satır aralığı 22px; bir satırda 14px metin için en fazla ~ (kutu genişliği / 8) karakter. Metin kutudan ve viewBox'tan **taşmamalı**. Satır kırmak için ayrı `<text>` kullan (`<tspan>` da olur).
- Ok ucu: `<defs>` içinde `marker` tanımla (`orient="auto-start-reverse"`), çizgide `marker-end="url(#id)"`. id'ler dosya içinde benzersiz olsun (platform sayfa düzeyinde önek ekler).
- Tek fikir, en fazla ~8 kutu. Renk anlam taşır: `d-danger` hata/bozulma, `d-success` doğru yol, `d-accent` odaktaki adım, `d-violet` dış sistem/yan etki.
- Örnek ve stil referansı: `curriculum/diagrams/render-commit.svg`.

**Diyagramları koru:** Bir dersi yeniden yazarken var olan diyagramları (ortak ve derse özgü) **kaldırma**; yeni metinde anlattıkları fikrin hemen yanına yerleştir. Diyagram artık metinle çelişiyorsa (çıkarılan bir konuyu gösteriyorsa) SVG'yi metne uydur. Bir ortak model diyagramı, §2.5 tablosunda modelin ilk kurulduğu derste **mutlaka** bulunur; sonraki derslerde `:::model` hatırlatmasıyla birlikte tekrar kullanılabilir. Zorlanan bir öğrenci için iyi bir görsel, bir paragraftan daha çok iş görür.

**Kontrol zorunlu:** `pnpm preview:diagram <dosya ya da klasör>` iki şey yapar:
1. **Yerleşim denetimi** (her ortamda çalışır): metnin kutudan ya da çizimden taşması, çizginin metnin üstünden ya da bir kutunun içinden geçmesi, metinlerin/kutuların üst üste binmesi. Sonuç **temiz** olmalı; `pnpm validate:content` derse özgü diyagramlarda bu sorunları hata sayar. Etiketleri çizgiden uzağa (çizginin üstüne/altına 12px+) koy; zaman çizelgesi çizgisini kutuların içinden geçirme, kutuların altından ya da üstünden geçir.
2. **PNG** (yalnızca macOS `qlmanage` çalışabiliyorsa; sandbox'ta çalışmayabilir): iki temada `.cache/diagram-preview/` altına. Üretilebiliyorsa aç ve anlamı kontrol et: ok yönleri doğru mu, diyagram tek başına anlaşılıyor mu. Kendi rasterleştiricini yazma; PNG üretilemiyorsa yerleşim denetimi yeterlidir.

### 2.5 Taşıyıcı zihinsel modeller (ortak diyagramlar)

| Diyagram (`diagram:…`) | Model | İlk kurulduğu ders |
|---|---|---|
| `ts-derleme-ve-calisma` | Tipler derleme anında vardır, çalışma anında silinir; dışarıdan gelen veri doğrulanmalıdır | 1.1 |
| `ts-narrowing-akisi` | Kontrol akışı union tipini daraltır | 1.6 |
| `render-commit` | Tetikleme → render (saf) → commit → effect (effect kısmı 5.2'de) | 3.9 |
| `state-snapshot` | Her render kendi props/state fotoğrafını görür; güncellemeler kuyruğa girer | 3.3 |
| `agac-ve-kimlik` | State ağaçtaki konuma ve `key`'e bağlıdır | 3.5 |
| `veri-akisi` | Props aşağı, olaylar yukarı; state ortak ebeveyne taşınır | 3.7 |
| `test-anatomisi` | Hazırla → çalıştır → doğrula; test = çalıştırılabilir gereksinim; mutant yakalama | 0.7 |
| `effect-yasam-dongusu` | setup → (deps değişti) cleanup → setup … → unmount'ta cleanup | 5.2 |
| `closure-bayat-deger` | Callback, oluştuğu render'ın değerlerini yakalar | 5.3 |
| `yaris-kosulu` | Yavaş eski cevap hızlı yeni cevabı ezer; iptal/yok sayma | 5.4 |
| `context-yayilimi` | Provider değeri değişince tüm tüketiciler render olur | 5.9 |
| `url-state` | URL tek doğru kaynak; iç içe route ağacı → `Outlet` | 6.4 |
| `http-istek-cevap` | İstek/cevap anatomisi; `fetch` 4xx/5xx'te reddetmez | 7.1 |
| `cors-preflight` | Tarayıcı → OPTIONS → izin başlıkları → asıl istek | 7.2 |
| `http-onbellek-karari` | Taze mi? → kullan; bayat → ETag ile sor → 304/200 | 7.3 |
| `state-kategorileri` | Server / client / URL / form state ve her birinin aracı | 9.1 |
| `test-katmanlari` | Birim / entegrasyon / uçtan uca; neyi hangi katmanda test etmeli | 10.1 |
| `msw-perdesi` | Uygulama `fetch` → MSW yakalar → handler → cevap | 11.4 |
| `query-onbellek-yasam-dongusu` | fetching → fresh → stale → inactive → gc | 12.4 |
| `mutation-ve-invalidation` | Mutation → (optimistic) → sunucu → invalidate/rollback → refetch | 13.2 |
| `form-state` | RHF: alanlar kayıtlı, değerler form deposunda, abonelikle render | 14.2 |
| `zod-sinir` | `unknown` → `parse` → tipli veri ya da hata; sınırlar: API, form, env | 15.1 |
| `redux-veri-akisi` | dispatch → middleware → reducer → store → selector → UI | 16.3 |
| `token-yenileme` | 401 → tek uçuşta refresh → bekleyen istekleri tekrar dene | 17.7 |
| `xss-akisi` | Güvenilmeyen girdi → tehlikeli çıkış noktaları → kaçış/doğrulama/CSP | 17.8 |
| `render-nedenleri` | Render tetikleyicileri ve memo sınırları | 18.2 |
| `web-vitals` | LCP / INP / CLS'in sayfa zaman çizelgesindeki yeri | 18.9 |
| `build-ve-yayin` | Kaynak → build (hash'li dosyalar) → host/CDN (cache politikası) → tarayıcı | 21.9 |

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

## 4. Test yazma görevleri (mutation testing) — Modül 1'den itibaren

Test okumak Modül 0'da (0.7), küçük test yazmak Modül 1'de başlar: 1–6. modüllerde saf fonksiyonlar, reducer'lar ve basit bileşenler için kısa test yazma görevleri vardır; bunlar MSW gerektirmez (MSW'nin "perdesi" 11. modülde kalkar). 10–11. modüller aracı derinlemesine öğretir.

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
- 10. modülden itibaren checkpoint'in **kendi test paketi** de doğrulamada çalıştırılır ve geçmelidir. Testler gerçek `.env`'e bağlı olamaz: Vitest ayarında `test.env` ile sahte token verilir, tüm ağ MSW ile taklit edilir.
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
- [ ] Her ders öğrencinin bildiği bir şeyden açılıyor; `:::pain` yalnızca gerçek bir belirti varsa kullanılmış.
- [ ] Planlanan soru sayısına yakın (±%20) ve karışım dengeli (~%40 quiz, ~%50 code, ~%10 project).
- [ ] Her ders içinde zorluk artıyor; tekrarlar **yenilik** içeriyor (aynı sorunun kopyası yok).
- [ ] Önceki modüllerin core kavramları yeni bağlamlarda kullanılmış ve `concepts`'e eklenmiş.
- [ ] Her code görevinde: LeetCode biçiminde `prompt.md` (yöntem adı yok), 2–4 kademeli ipucu, `solution.md` ("neden böyle?"), Türkçe açıklayıcı test adları, starter testlerden kalıyor (tip hatasından değil).
- [ ] Kod örnekleri güncel API'lerle (React 19, React Router 8, TanStack Query 5, Zod 4, RHF 7, RTK 2, Vitest 5, MSW 2, Tailwind 4) — `docs/research/` ile kontrol edildi.
- [ ] Quiz şıklarının her birinin açıklaması öğretici.
- [ ] Türkçe sade ve doğru; terimler tutarlı; §1.6'daki yasak kalıplar yok.
- [ ] Ders örnekleri görevlerin çözümü değil (farklı ad, senaryo, veri); ders metni testlerden/ipuçlarından söz etmiyor.
- [ ] Dersler §1.0 akışında (tanıdık başlangıç → en basit hal → adım adım → genelle); her yeni terim ilk geçtiği yerde tanımlı; nadir ayrıntılar isteğe bağlı kutuda; ilgili zihinsel modeller kurulmuş ya da `:::model` ile hatırlatılmış.
- [ ] Diyagramlar §2.4 kurallarına uyuyor ve `pnpm preview:diagram` çıktısı gözle kontrol edildi.
- [ ] Sinema görevleri `docs/curriculum-plan.md`'deki sözleşmeye (dosya yolu, export) uyuyor.

## 9. Atölye görevleri

Atölye, öğrenciye hangi çözümü seçeceğini giderek daha az söyleyen bağımsız kodlama çalışmasıdır. Görev sözleşmesi ve tekrar sırası `docs/practice-plan.md` içindedir. Her ilgili modülün **sonuna**, proje dersinden sonra `NN-atolye/` ekle; `NN` mevcut son dersin bir sonrasıdır. `lesson.md` için `kind: practice` kullan. Eski dersleri ve soruları yeniden numaralandırma; Sinema checkpoint'lerine dokunma.

Beş biçim kullanılır:

1. **Teşhis et, düzelt** (`code`): Starter çalışır ama hatalıdır. `prompt.md` yalnızca kullanıcının gördüğü belirtiyi ve tekrar adımlarını söyler; nedeni ve çözüm yöntemini söylemez. Test belirtiyi üretir; uygun yerde `requests()`, fake timer veya `server.use(...)` kullan.
2. **Sadece gereksinim** (`code`): İş gereksinimini ve testlerin import edeceği açık giriş noktasını ver. Yöntem ve iç dosya seçimi öğrenciye aittir.
3. **Refactor** (`code`): Çalışan büyük bileşeni ver. Testler mevcut davranışı korur ve ikinci sayfada yeniden kullanım gibi yeni bir gereksinimle starter'ı başarısız kılar. Kod kalitesini somut `rubric` ile değerlendir.
4. **Tasarım karşılaştırma** (`code`): İki uygulanabilir component API'si göster. Öğrenci birini seçer, uygular, gerekçesini yorumda açıklar. Testler iki tasarımın da sağlayabileceği davranışı denetler; seçim gerekçesi ve kalite için `rubric` gerekir.
5. **Mimari** (`project`): `project: 'atolye'` kullan. `tests/` veya başka test dosyası koyma. `reviewFiles: ['src/<task-slug>/**']` ve 5–8 somut, kontrol edilebilir `rubric` maddesi yaz. Öğrenci dosyaları VS Code'da `projects/atolye/src/<task-slug>/` altında kendisi oluşturur; görev metni dosya listesi vermez. Doğrulama yolu görev sayfasındaki **“AI review prompt'unu kopyala”** düğmesidir. İlk mimari görev (modül 9), kurulumu açıkça anlatır: repo kökünde `pnpm setup:projects atolye`, ardından `pnpm install`, ardından `cd projects/atolye && pnpm dev`.

Yönlendirmeyi kademeli azalt: **L1 rehberli (3–6)** dosyayı ve function/export adını verir; yöntem de adlandırılabilir. **L2 yarı açık (9–16)** yalnızca testlerin import ettiği public entry point'i verir; yöntem yalnızca ipuçlarında geçebilir. **L3 açık (17–22)** iş gereksinimini ve gerekiyorsa public entry point'i verir. L3 `prompt.md` metninde hook adı, kütüphane API adı veya iç dosya adı geçmez; bunlar yalnızca ipuçlarında bulunabilir. İpuçları yön → yöntem → neredeyse çözüm sırasıyla azalır.

Kod testleri yalnızca public entry point üzerinden görülen davranışı sınar: RTL role/text sorguları, kullanıcı etkileşimi ve MSW cevapları. Hook'lara spy bağlama, iç dosya adı veya tek bir uygulama yolunu assert etme. Refactor ve tasarım karşılaştırma dahil kalite değerlendirmesi gereken görevlerde `rubric` **4–8 somut, kontrol edilebilir madde** içerir. Mimari görevlerde test yerine bu rubric kullanılır. Diğer code görevlerinde starter davranış testinden kalmalı, solution geçmelidir.
Atölye refactor görevlerinde bu davranış testi kuralı, §2.3'teki yapı testi önerisinin yerini alır: starter'ın kalmasını, public entry üzerinden görülebilen yeni kullanım gereksinimi sağlar.
