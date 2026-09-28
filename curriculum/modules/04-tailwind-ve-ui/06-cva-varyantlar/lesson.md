---
title: "cva ile tipli varyant matrisi"
minutes: 17
kind: concept
---

# cva ile tipli varyant matrisi

:::pain[Üç ternary, dokuz görünüm]
Üç buton görünümü ve üç boyut var. Kullanım yerlerinde iç içe koşullar büyüyor; ghost butonun küçük boyutunda gereken ince bir vurgu bazı sayfalarda unutuluyor.
:::

## Serbest class yerine seçenek sözleşmesi

`cn()` birleştirilmiş class string'indeki çakışmaları yönetir. Fakat bir bileşenin hangi görünümleri desteklediğini, her kullanım yerinin doğru class'ı yazmasından bekleyemezsin. Class string'i serbest olduğunda `variant="danger"` gibi yazımlar derlenir ama tasarım tablosunda bulunmayabilir.

Class Variance Authority (`cva`) ortak class'ları ve seçenek eksenlerini tek tanımda toplar. `variant` renk/ton gibi bir eksen, `size` kapladığı alan gibi başka bir eksen olabilir. Her ikiliyi ayrı bir isim olarak yazmak yerine her ekseni bağımsız tanımlarsın; özel kesişimler için compound variant ekleyebilirsin.

:::model[Varyant matrisi dört parçadan oluşur]
1. Base class her geçerli görünümde bulunur.
2. Her varyant ekseni izin verilen seçenekleri ve ek class'ları listeler.
3. Default variant, props verilmediğinde seçilecek hücreyi belirler.
4. Compound variant birden fazla seçenek aynı anda eşleştiğinde özel class ekler.
5. `VariantProps<typeof config>` TypeScript tipini cva tablosundan türetir.
:::

![Varyant ve boyut seçeneklerinin cva matrisindeki birleşimleri](diagrams/varyant-matrisi.svg)

Bu model dokuz görünümü dokuz ayrı class string'ine dönüştürmeden anlatır. Ortak class, varyant class'ı ve boyut class'ı seçilir; yalnız özel kesişim varsa compound class da eklenir.

## Hücre seçimini adım adım izle

Önce kırık modeli görelim: görünüm her kullanım yerinde elle birleştiriliyor ve seçeneğin tipi sınırsız string.

```tsx
type LooseTagProps = { tone: string; compact?: boolean }
function LooseTag({ tone, compact }: LooseTagProps) {
  const color = tone === 'loud' ? 'bg-fuchsia-700' : 'bg-teal-100'
  const space = compact ? 'px-2 py-1' : 'px-4 py-2'
  return <span className={`inline-flex ${color} ${space}`}>Yeni</span>
}
```

`tone="urgent"` de compile olur ve özel kombinasyonlar başka yerde yeniden yazılır. Düzeltilmiş örnek, seçenekleri tek cva tablosunda tutar:

```ts check
import { cva, type VariantProps } from 'class-variance-authority'

const labelStyle = cva('inline-flex items-center rounded-md', {
  variants: {
    tone: {
      calm: 'bg-teal-100 text-teal-900',
      loud: 'bg-fuchsia-700 text-white',
      plain: 'bg-transparent text-slate-900',
    },
    density: {
      tight: 'px-2 py-1 text-sm',
      roomy: 'px-4 py-2 text-base',
    },
  },
  defaultVariants: { tone: 'calm', density: 'roomy' },
  compoundVariants: [{ tone: 'plain', density: 'tight', class: 'underline' }],
})

type LabelStyleProps = VariantProps<typeof labelStyle>
const currentStyle = labelStyle({ tone: 'plain', density: 'tight' })
```

Bu çağrıda sıra şöyledir:

| Aşama | Seçim | Eklenen class |
|---|---|---|
| 1 | base | `inline-flex items-center rounded-md` |
| 2 | `tone: plain` | `bg-transparent text-slate-900` |
| 3 | `density: tight` | `px-2 py-1 text-sm` |
| 4 | compound eşleşmesi | `underline` |

`density: roomy` seçilseydi 4. aşamadaki compound koşulu eşleşmeyecekti. Compound variant'ı ilgili eksenlerin birlikte olması gereken bir istisna gibi düşün. Tabloda her hücre farklıysa bütün 3×2 kombinasyonları component içinde ayrı if dallarıyla kopyalamak gereksizdir.

## TypeScript tabloyu nasıl korur?

`VariantProps<typeof labelStyle>` tipinde `tone` yalnız tanımlı seçeneklerden biri veya opsiyonel olarak `undefined` olabilir. `tone: 'urgent'` yazımı compile-time hatası verir. Tabloyu ve props union'ını ayrıca elle tanımlarsan birini güncelleyip diğerini unutabilirsin.

```ts check
import { cva, type VariantProps } from 'class-variance-authority'

const noticeStyle = cva('rounded px-3 py-2', {
  variants: {
    intent: { info: 'border-sky-400', warning: 'border-amber-500' },
  },
  defaultVariants: { intent: 'info' },
})

type NoticeStyleProps = VariantProps<typeof noticeStyle>
const noticeProps: NoticeStyleProps = { intent: 'warning' }
```

Bu tip geçerli sınırlı görünüm değerlerini korur, fakat runtime dış girdisini doğrulamaz. Bir API'den `intent` string'i geliyorsa TypeScript tipi o JSON'u kontrol etmez; sınırda ayrıca doğrulama gerekir. Component'e prop olarak çağıran kod derleme sırasında kontrol ediliyorsa bu iç kullanım için değerli bir güvence sağlar.

## Class API'sini HTML props'larıyla birleştir

Gerçek `<button>` bileşeni varyant class'ı üretmekle bitmez. `disabled`, `type`, `onClick`, `aria-label` ve `data-*` gibi yerel button props'ları doğal öğeye aktarılmalıdır. `ComponentProps<'button'>` bu props tipini alır. cva'nın `size` ismi native button props tipindeki `size` ile çakışabileceğinden `Omit` ile native alanı ayırabilirsin.

```tsx
import type { ComponentProps } from 'react'
import type { VariantProps } from 'class-variance-authority'

type ActionProps = Omit<ComponentProps<'button'>, 'size'> & VariantProps<typeof labelStyle>
```

Render sırasında `className` varyant çıktısıyla `cn` üzerinden birleşir. Tüketici `px-8` verdiğinde temel `px-4` kaldırılabilir; bunun için tüketici class'ının merge sırasındaki yeri önemlidir. Bu, bir önceki class birleştirme modelinin yeni bağlamıdır: `cva` seçenekleri seçer, `cn` son override'ı temizler.

`variant="primary"` yalnız görünüm adıdır; `disabled` olmak veya form gönderme davranışı değildir. Button varsayılan `type` davranışını form içinde göz önünde tut ve `disabled` state'ini gerçek niteliğe aktar. Görsel sistem semantik HTML sözleşmesini örtmemelidir.

## Matrisin büyümesini yönet

İki eksen de üç seçenekliyse dokuz hücre vardır. Bir compound kural nadirse ve kolay anlatılıyorsa iyi bir istisnadır; pek çok compound kural çıkıyorsa eksenler gereğinden fazla bağımsız olabilir. Örneğin `danger` tonu yalnız bir boyutta destekleniyorsa bu kuralı API'de nasıl temsil edeceğini tasarım ekibiyle belirlemek gerekir.

Her kombinasyona özel font, padding, border, icon ve gölge eklemek tabloyu karar verilemez hale getirir. Varyant sayısını ürünün gerçek tasarım seçeneklerine göre sınırla. Her yeni seçenek yeni bir kombinasyon oluşturur; test ve görsel inceleme maliyeti de artar.

Class üreticisini component'ten ayrı export etmek başka bileşenlerin aynı sınıfları kullanmasına izin verebilir. Ancak bu API'yi public hale getirmek bakım sorumluluğu getirir: daha sonra class yapısını değiştirmen bu tüketicileri etkiler. Sadece gerçekten paylaşılacaksa export et.

Önce kırık modeli görelim: her kullanım yeri kendi class kararını koşullarla kuruyor ve varyant tipi `string` olarak kalıyor.

```tsx
type LooseProps = { tone: string; compact?: boolean }
function LooseTag({ tone, compact }: LooseProps) {
  const color = tone === 'loud' ? 'bg-fuchsia-700' : 'bg-teal-100'
  const space = compact ? 'px-2 py-1' : 'px-4 py-2'
  return <span className={`inline-flex ${color} ${space}`}>Yeni</span>
}
```

Bu yaklaşım `tone="urgent"` değerini reddetmez ve özel kombinasyonları farklı component'lerde tekrarlatır. Düzeltilmiş model cva tablosundan class üretir ve TypeScript'e aynı tablonun seçeneklerini gösterir. Component'in iç yapısı değişse de çağıranlar tanımlı isimlerle kullanım yapar.

Bir varyant ekseni eklemeden önce ürün dilinde gerçekten ayrı bir karar olup olmadığını sor. `tone`, `size`, `weight`, `shape`, `intent`, `density` seçenekleri kısa sürede büyük bir matris çıkarabilir. Her eksen bağımsızsa kombinasyonlar çarpılarak çoğalır: dört tone ve üç size, on iki temel hücre demektir. Tasarımda hiç kullanılmayan hücreleri desteklememek daha sade bir API sağlar.

Varsayılanların anlamı da public sözleşmenin parçasıdır. `defaultVariants` değerini değiştirmek aynı `<Button>` çağrısının her sayfadaki görünümünü değiştirir. Çağıranın varyant vermemesi bir hata mı, yoksa bilinçli varsayılan mı; bu kararı tasarım sistemi belirlemelidir. Bazı seçenekleri zorunlu yapmak istiyorsan tip katmanında `VariantProps` opsiyonelliğini bilinçli biçimde daralt.

Compound kuralları aşırı kullanıldığında gizli karar tablosuna dönüşür. Her kuralı kısa bir cümlede açıklayabiliyor olmalısın: "plain ve tight birlikteyken alt çizgi ekle." Birçok hücreye özel class gerekiyorsa tasarımı eksenleri yeniden düşünerek sadeleştir veya ayrı bir semantik varyant tanımla.

:::mistake[Belirti → neden → düzeltme]
Geçersiz `variant` değeri TypeScript'ten geçiyor → props `string` olarak tanımlanmış → tipi `VariantProps<typeof config>` tablosundan çıkar.
:::

:::mistake[Belirti → neden → düzeltme]
Küçük ghost kombinasyonunda vurgu yok → görünüm ve boyut ayrı tanımlanmış ama kesişim kuralı yazılmamış → yalnız gerekli hücre için compound variant ekle.
:::

:::mistake[Belirti → neden → düzeltme]
Varyant class'ı doğru ama disabled düğme çalışıyor → görünüm tablosu davranış yerine kullanılmış → gerçek `disabled` prop'unu native button'a aktar.
:::

:::sector
Tasarım sisteminde varyant adları tasarımcı ve geliştiricinin ortak dili olur: `primary`, `quiet`, `danger` gibi değerler serbest renk veya class parçalarından daha kolay gözden geçirilir. İzin verilen eksenleri ürün ihtiyacına göre dar tut; API'ye her olası CSS değerini koymak bir tasarım sistemi oluşturmaz.
:::

Varsayılan değer verilmesi ile prop'un zorunlu olması aynı şey değildir. `defaultVariants` class üreticisinin çalışma anındaki seçimini belirler; `VariantProps` alanları çoğunlukla opsiyonel sunar. Ürün API'si mutlaka ton seçilmesini istiyorsa, `VariantProps` tipini birleştirirken ilgili alanı `Required<Pick<...>>` benzeri utility ile zorunlu hale getirebilirsin. Bu tip kararı cva'nın default davranışından ayrıdır.

Bir varyant ekseninde aynı utility class bütün seçeneklerde görünüyorsa onu base class'a taşı. Örneğin tüm tonlarda `border` ortaksa her seçenek içinde tekrarlamak yerine base'e koy. Fakat bir class herhangi bir varyantta görünmüyorsa base'e taşımak görünüm sözleşmesini değiştirir; önce matrisi karşılaştır.

Class tablosu tasarımın çalıştırılabilir kaydıdır, ama tasarımın kendisi değildir. Yeni seçenek eklendiğinde mevcut bileşen kullanımını, disabled ve focus görünümünü, koyu temadaki kontrastı kontrol et. Bir varyant diğer seçeneklerle çakışan renkler üretiyorsa class birleştirici sonucu sadeleştirebilir; bu, tasarım kombinasyonunun iyi olduğu anlamına gelmez.

## Özet

- cva base, varyant, varsayılan ve compound class'ları bir araya getirir.
- Her varyant ekseni izin verilen seçenekleri listeler; birleşimler matris hücreleridir.
- `VariantProps` TypeScript props tipini tablodan türetir.
- `cn` dışarıdan gelen class override'ını varyant sonucu ile birleştirir.
- Görsel varyant, native HTML davranışının yerini tutmaz.

**Kendini yokla:** Varyant tablosunda olmayan bir literal TypeScript'te nasıl yakalanır? `VariantProps<typeof config>` kullanımıyla.

**Kendini yokla:** Compound class ne zaman eklenir? Belirtilen seçenek eksenleri aynı anda eşleştiğinde.
