---
title: "tsconfig ve tip kontrolü"
minutes: 15
kind: concept
---

# tsconfig ve tip kontrolü

:::pain[Problem]
Editöründe bir satırın altı parlak kırmızı bir çizgiyle çizili: *"Type 'undefined' is not assignable to type 'string'"*. Ancak tarayıcıya baktığında uygulama hiçbir şey olmamış gibi çalışıyor! "Herhalde önemsiz bir uyarıdır" deyip geliştirmeye devam ediyorsun. Ta ki projeyi canlıya almak için `pnpm build` çalıştırana kadar: derleme aniden kırmızı hata dökümleriyle çöküyor ve tüm yayına alma süreci kilitleniyor.
:::

## İki ayrı dünya: Hızlı Vite ve Kesin tsc

Bu çelişkinin sebebi, modern web geliştirme mimarisinde iki farklı aracın tamamen farklı amaçlarla çalışmasıdır:

1. **Vite (`pnpm dev`):** Tek bir hedefi vardır; anında tarayıcıya cevap vermek. TypeScript tiplerini satır satır denetlemek büyük projelerde saniyeler sürebilir. Bu yüzden Vite, dosyaları tarayıcıya göndermeden önce tipleri **kontrol etmeden doğrudan siler** (strip types). Kod söz dizimsel (syntax) olarak geçerliyse, tip hataları olsa bile tarayıcıda çalıştırılır.
2. **TypeScript Derleyicisi (`tsc`):** Kodun mantıksal güvenliğini garanti altına alan asıl denetçidir. Tüm proje dosyalarını, import ilişkilerini ve tipleri kökten uca tarar.

Bu iki aracın iş bölümü aşağıdaki mimariyle özetlenir:

![Vite ile tsc tip denetimi ayrımı](diagrams/vite-vs-tsc.svg "Vite dosya dönüştürme ve tsc tip denetimi ayrımı")

Modeli şu temel ilkelerle kavra:

1. **Vite hıza odaklanır:** Geliştirme anında bekleme süresini sıfıra indirmek için tip denetimini tamamen atlar.
2. **`tsc` kesinliğe odaklanır:** Kodun canlıda beklenmedik `undefined` veya `null` hatalarıyla patlamayacağını matematiksel olarak doğrular.
3. **Build bariyeri:** Projemizin `package.json` dosyasındaki build komutu `"build": "tsc -b && vite build"` şeklindedir. Aradaki `&&` operatörü bir güvenlik kilididir: `tsc -b` tek bir tip hatası dahi bulursa `exit 1` ile durur; `vite build` paketleyicisi **asla devreye girmez**.
4. **Platform denetimi:** Bu platformda da "Çalıştır" butonuna bastığında Vitest testleriyle birlikte `tsc` tip kontrolü paralel olarak çalıştırılır. Testlerin hepsi yeşil olsa dahi kodunda bir tip hatası varsa görev onaylanmaz.

:::model[Gümrük kapısı ve hızlı geçiş]
Geliştirme sunucusu (`pnpm dev`) acil durumlarda hızlı geçişe izin veren yerel bir yoldur. Ancak canlıya çıkış (`pnpm build`) sıkı bir gümrük kapısıdır. `tsc` gümrük memuru gibidir; evrakında tek bir eksik mühür veya belirsizlik (tip hatası) varsa geçiş izni vermez.
:::

## tsconfig mimarisi: Proje referansları

Modern bir Vite projesini açtığında kök dizinde üç farklı `tsconfig` dosyası görürsün. Bu yapı TypeScript'in **proje referansları** (project references) standardıdır:

```json title="tsconfig.json"
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

Bu ayrımın sebebi, projedeki kodların iki farklı çalışma ortamına ait olmasıdır:
- **`tsconfig.app.json` (Tarayıcı dünyası):** `src/` klasörü altındaki React bileşenlerini kapsar. Bu dosyada `lib: ["ES2020", "DOM", "DOM.Iterable"]` tanımlıdır; yani `window`, `document`, `HTMLElement` gibi tarayıcı tipleri geçerlidir, `process` gibi Node tipleri yasaktır.
- **`tsconfig.node.json` (Node dünyası):** `vite.config.ts` gibi derleme anında Node.js üzerinde koşan dosyaları kapsar. Burada DOM tipleri yoktur; dosya sistemi ve işletim sistemi tipleri geçerlidir.
- **`tsconfig.json` (Çatı):** İki dünyayı birbirine bağlar. `tsc -b` (build modu) komutu verildiğinde her iki projeyi de sırayla ve önbellek desteğiyle denetler.

## Bilmen gereken hayati derleyici ayarları

`tsconfig.app.json` dosyasında yer alan ve modern React projelerinin standardı olan kritik ayarlar:

| Ayar | Görevi ve Önemi |
| --- | --- |
| `strict: true` | En katı tip güvenliği kurallarını açar (`noImplicitAny`, `strictNullChecks` vb.). |
| `noEmit: true` | `tsc`'nin `.js` çıktısı üretmesini engeller. Dosya üretimini Vite yaptığı için `tsc` yalnızca denetim yapar. |
| `verbatimModuleSyntax: true` | Yalnızca tip olan tanımların `import type` ile yazılmasını zorunlu kılar. |
| `erasableSyntaxOnly: true` | JavaScript'e çevrilirken çalışma zamanında nesne üreten eski TypeScript söz dizimlerini (`enum`, `namespace`) yasaklar. |
| `noUnusedLocals` | Tanımlanıp kullanılmayan yerel değişkenleri hata sayarak kod kirliliğini önler. |

## `import type` neden zorunludur?

Vite dosyaları tek tek dönüştürürken diğer dosyaların içeriğine bakmaz. Aşağıdaki örneğe bakalım:

```ts title="types.ts"
export interface CriticReview {
  id: number
  content: string
}
```

Tüketici dosyada iki farklı import şekli yazılabilir:

```ts
// ❌ YANLIŞ: verbatimModuleSyntax hatası verir
import { CriticReview } from './types'

// ✅ DOĞRU: Tip olduğu açıkça belirtilmiş
import type { CriticReview } from './types'
```

Eğer `import type` yazmazsan, Vite `CriticReview` kelimesinin çalışma zamanında yaşayan bir sınıf/fonksiyon mu yoksa derleme anında silinecek bir tip mi olduğunu bilemez. `import type` yazarak derleyiciye kesin bir talimat verirsin: *"Bu import yalnızca tip denetimi içindir; derlenen JavaScript çıktısından bu satırı tamamen sil!"*

## Neden `enum` yerine literal union?

TypeScript'in ilk yıllarında eklenen `enum`, derlendiğinde karmaşık bir JavaScript nesnesine dönüşür:

```ts
// ❌ erasableSyntaxOnly bunu yasaklar
enum MovieRating {
  G = 'GENEL',
  PG = 'REHBERLIK',
}
```

Bu söz dizimi silinerek temizlenemez (erasable değildir). Modern TypeScript ve Vite projeleri bunun yerine hafif, derleme anında tamamen silinen **literal union** tiplerini kullanır:

```ts check
export type ContentRating = 'GENEL' | 'REHBERLIK' | 'YETISKIN'

export function isRestricted(rating: ContentRating): boolean {
  return rating === 'YETISKIN'
}
```

## tsc denetimini adım adım izleyelim

Terminalde `pnpm typecheck` (`tsc -b`) çalıştırdığında gerçekleşen adımları inceleyelim:

| Adım | İşlem | Başarılı Durum | Hata Durumu |
| --- | --- | --- | --- |
| 1. Çatı Analizi | `tsconfig.json` okunur ve referanslar taranır. | İki alt proje tespit edildi. | `tsconfig` JSON söz dizimi hatası. |
| 2. App Kontrolü | `src/` altındaki tüm `.ts` ve `.tsx` dosyaları çözülür. | Tüm değişken tipleri ve importlar uyumlu. | `TS2322: Type X is not assignable to type Y`. |
| 3. Node Kontrolü | `vite.config.ts` ve build yapılandırmaları incelenir. | Eklenti ve config tipleri geçerli. | Config dosyasında tip hatası. |
| 4. Sonuç | Süreç tamamlanır. | `exit 0` (sessiz başarı). | Terminalde hatalar listelenir, `exit 1`. |

## Kırık örnek

Aşağıdaki film eleştirisi biçimlendiricisinde sık yapılan tip hataları yer almaktadır:

```ts
// Kırık: Tip import'u belirtilmemiş ve parametre tipi örtük any bırakılmış
import { CriticReview } from './types'

export function formatReviewSummary(review: CriticReview, score) {
  // noImplicitAny hatası: score parametresi tip almamış
  // strictNullChecks: review.content undefined olabilir ama kontrolsüz erişilmiş
  const firstSentence = review.content.split('.')[0]
  return `${firstSentence} (Puan: ${score})`
}
```

Bu kod `tsc -b` ile derlendiğinde üç ayrı hata patlar:
1. `CriticReview is a type and must be imported using a type-only import`.
2. `Parameter 'score' implicitly has an 'any' type`.
3. `Object is possibly 'undefined'`.

## Doğru örnek

Tüm tsconfig kurallarına tam uyumlu hale getirilmiş implementasyon:

```ts check
export interface CriticReview {
  id: number
  content?: string
}

export function formatReviewSummary(review: CriticReview, score: number): string {
  const content = review.content ?? 'Yorum bulunamadı'
  const firstSentence = content.split('.')[0] ?? content
  return `${firstSentence} (Puan: ${score})`
}
```

Burada hem `score` parametresi açıkça `number` olarak tiplenmiş, hem opsiyonel olabilecek `review.content` alanı nullish coalescing (`??`) operatörüyle güvenceye alınmıştır.

## Sınır durumları ve sık hatalar

:::mistake[Sık hata: any kullanarak tip kontrolünü susturmak]
Belirti → Kod `tsc`'den hatasız geçiyor ama tarayıcıda `Cannot read properties of undefined` ile çöküyor.  
Neden → Tip hatasını çözmek yerine değişkene `as any` yazarak derleyicinin gözünü bağlamak.  
Düzeltme → `any` kullanma; tip uyarısını gerçek bir kontrolle (`if (item != null)`) gider.
:::

:::mistake[Sık hata: Kullanılmayan import veya değişken bırakmak]
Belirti → Build komutu `TS6133: 'x' is declared but its value is never read` hatasıyla duruyor.  
Neden → `noUnusedLocals` ayarı açıkken dosyada unutulan ölü kod parçaları.  
Düzeltme → İhtiyaç kalmayan import ve değişkenleri temizle.
:::

:::sector
Kurumsal yazılım dünyasında Pull Request (PR) kontrollerinde tip denetimi ilk kapıdır. "Kırmızı çizgiyi editörde gördüm ama umursamadım" mazereti kabul edilmez. Tip hatalarını anında düzeltmek, çalışma zamanında oluşabilecek yüzlerce gizli hatayı üretim ortamına (production) ulaşmadan önce yok eder.
:::

## Özet

- Vite geliştirme sırasında hızlı olmak için tipleri denetlemez, doğrudan siler.
- `tsc -b` komutu projedeki tüm tipleri derinlemesine denetler; build script'i tip hatası varken paketleme yapmaz.
- `verbatimModuleSyntax` nedeniyle yalnızca tip olan varlıklar `import type` ile çağrılmalıdır.
- `erasableSyntaxOnly` çalışma zamanında nesne üreten `enum` söz dizimini yasaklar; yerine literal union tipleri kullanılır.
- Proje referansları sayesinde tarayıcı kodları (`tsconfig.app.json`) ile Node kodları (`tsconfig.node.json`) izole denetlenir.

**Kendini yokla:** `App.tsx` dosyasında tip hatası varken `pnpm dev` ile tarayıcıda sayfa açılabilir mi?  
*Cevap:* Evet açılabilir; çünkü Vite geliştirme sunucusu tipleri denetlemeden siler. Ancak `pnpm build` çalıştırıldığında `tsc -b` derlemeyi durdurur.

**Kendini yokla:** `import { Movie } from './types'` satırı `verbatimModuleSyntax` açıkken neden derleme hatası verir?  
*Cevap:* Çünkü `Movie` yalnızca bir tiptir (interface/type); derleyicinin bu import'u derleme anında silebilmesi için `import type { Movie }` şeklinde yazılması şarttır.
