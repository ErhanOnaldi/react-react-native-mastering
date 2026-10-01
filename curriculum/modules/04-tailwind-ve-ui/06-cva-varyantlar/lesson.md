---
title: "cva ile tipli varyant matrisi"
minutes: 17
kind: concept
---

# cva ile tipli varyant matrisi

Sinema’da aynı türdeki film etiketleri bazen farklı renkte görünür. `selected ? 'bg-sky-700' : 'bg-slate-100'` diye koşul yazmak işe yarar; ama görünüm ve boyut gibi kararlar eklenince her kullanım yerinde yeni koşullar kurman gerekir. `cva`, yani **Class Variance Authority**, ortak class’lardan ve izin verilen görünüm seçeneklerinden class üreten küçük bir araçtır.

![Varyant ve boyut seçeneklerinin cva matrisindeki birleşimleri](diagrams/varyant-matrisi.svg)

Önce sadece bir renk kararı ekleyelim. cva tablosundaki `tone` adlı **variant**—seçenek ekseni—`quiet` veya `highlight` değerini alabilir:

```ts check
import { cva } from 'class-variance-authority'

const genreTag = cva('inline-flex rounded-md', {
  variants: {
    tone: {
      quiet: 'bg-slate-100 text-slate-900',
      highlight: 'bg-sky-700 text-white',
    },
  },
})

const quietTag = genreTag({ tone: 'quiet' })
```

İki seçenek de `inline-flex rounded-md` ortak class’larını alır; yalnız `tone` değerine göre renkleri değişir. Artık bileşeni kullanan yer `bg-sky-700` gibi serbest class yerine tasarım dilindeki `highlight` kararını seçebilir.

## İki karar birleşince

Bir etiketin renginin yanında ne kadar yer kapladığını da seçmek isteyebilirsin. cva’da her karar ayrı bir variant olur; `defaultVariants` ise çağıran o kararı belirtmediğinde kullanılacak **varsayılan seçeneği** belirler.

```ts check
import { cva } from 'class-variance-authority'

const categoryPill = cva('inline-flex items-center rounded-md', {
  variants: {
    tone: {
      quiet: 'bg-slate-100 text-slate-900',
      highlight: 'bg-sky-700 text-white',
    },
    density: {
      compact: 'px-2 py-1 text-sm',
      spacious: 'px-4 py-2',
    },
  },
  defaultVariants: { tone: 'quiet', density: 'spacious' },
})

const defaultPill = categoryPill()
const compactHighlight = categoryPill({ tone: 'highlight', density: 'compact' })
```

İlk çağrı `quiet` ve `spacious` class’larını, ikinci çağrı `highlight` ve `compact` class’larını seçer. Bu iki ayrı eksen sayesinde her rengin her boyutu için ayrı bir class string’i kopyalamazsın; cva ortak class’ları ve seçtiğin seçeneklerin class’larını birleştirir.

| Seçim sırası | `categoryPill({ tone: 'highlight', density: 'compact' })` ne ekler? |
|---|---|
| Ortak class’lar | `inline-flex items-center rounded-md` |
| `tone: highlight` | `bg-sky-700 text-white` |
| `density: compact` | `px-2 py-1 text-sm` |
| Varsayılanlar | Bu çağrıda kullanılmaz; iki değer de açıkça verildi. |

Küçük ve seçili kategoriye yalnız birlikteyken bir vurgu eklemek istersek `compoundVariants` kullanırız. **Compound variant**, birden fazla eksen aynı anda belirli değerlerdeyken eklenen class kuralıdır:

```ts check
import { cva } from 'class-variance-authority'

const filmFilter = cva('rounded-md', {
  variants: {
    tone: { quiet: 'bg-slate-100', highlight: 'bg-sky-700 text-white' },
    density: { compact: 'px-2 py-1', spacious: 'px-4 py-2' },
  },
  defaultVariants: { tone: 'quiet', density: 'spacious' },
  compoundVariants: [
    { tone: 'highlight', density: 'compact', class: 'ring-2 ring-sky-300' },
  ],
})

const highlightedCompactFilter = filmFilter({ tone: 'highlight', density: 'compact' })
```

Bu çağrıda iki koşul da eşleştiği için halka class’ı eklenir; `spacious` seçilseydi eklenmezdi. Her birleşime ayrı if yazmak yerine yalnızca gerçekten özel olan hücreyi tanımladık. Böylece tablonun hangi durumda neden farklılaştığını okuyabilirsin.

## Tablo seçeneklerini TypeScript’e tanıt

`cva` tabloyu sınırlı tutar ama TypeScript’in seçenekleri bilmesi için `VariantProps<typeof filmFilter>` tipini kullanabilirsin. **Type inference**, mevcut tanımdan tipi çıkarmak demektir; burada seçenek union’ını tabloyla eş zamanlı tutar, elle ikinci kez yazma ihtiyacını azaltır.

```ts check
import { cva, type VariantProps } from 'class-variance-authority'

const posterBadge = cva('rounded px-2 py-1', {
  variants: {
    status: {
      nowShowing: 'bg-emerald-100 text-emerald-900',
      comingSoon: 'bg-amber-100 text-amber-900',
    },
  },
  defaultVariants: { status: 'nowShowing' },
})

type PosterBadgeProps = VariantProps<typeof posterBadge>
const badgeProps: PosterBadgeProps = { status: 'comingSoon' }
```

`status` alanı artık yalnız tabloda yazan değerlerden biri olabilir; `comingSoon` geçerlidir, `soldOut` bu tabloya eklenmediği sürece geçerli değildir. Bu, component’i kullanan TypeScript kodunu korur. Bir API’den gelen herhangi bir string’i çalışma anında doğrulamaz; dış verinin kontrolü başka bir ihtiyaçtır.

## Native button props’larını koru

Gerçek bir eylem bileşeni sadece class üretmez. `disabled`, `type`, `onClick` ve `aria-*` gibi yerel `<button>` props’ları butona aktarılmalı. Daha önce gördüğün `ComponentProps<'button'>`, React’in button props tipini verir; `Omit<..., 'size'>` ise HTML button tipindeki `size` alanını çıkarır, çünkü burada aynı adı cva’nın boyut seçeneği kullanacak.

```tsx check
import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

const screeningActionStyle = cva('inline-flex items-center rounded-lg font-semibold', {
  variants: {
    variant: {
      strong: 'bg-indigo-700 text-white',
      quiet: 'border border-indigo-700 text-indigo-700',
    },
    size: {
      compact: 'px-2 py-1 text-sm',
      roomy: 'px-5 py-3',
    },
  },
  defaultVariants: { variant: 'strong', size: 'roomy' },
  compoundVariants: [{ variant: 'quiet', size: 'compact', class: 'underline' }],
})

type ScreeningActionProps = Omit<ComponentProps<'button'>, 'size'> & VariantProps<typeof screeningActionStyle>

export function ScreeningAction({ variant, size, className, ...props }: ScreeningActionProps) {
  return (
    <button
      className={cn(screeningActionStyle({ variant, size }), className)}
      {...props}
    />
  )
}
```

Çağıran kod varyant seçebilir ama `disabled` ve `onClick` hâlâ gerçek `<button>` öğesine ulaşır. cva görünümü seçer; native prop’lar HTML davranışını taşır. `className` de varyant class’larıyla `cn` üzerinden birleştirilir, böylece çağıranın verdiği `px-8` gibi class aynı padding kararını geçersiz kılabilir. Bir class birleştiricinin burada olması önemli: sırf string’in sonuna eklemek, HTML’de son yazılan class’ın CSS’te kazanacağını garanti etmez.

## Bir yanlış tipi ve belirtisi

Props’u `tone: string` diye tanımlarsan, `tone="urgent"` gibi tabloda bulunmayan bir değer de TypeScript’ten geçer. Ekranda beklemediğin class’lar eksik kalabilir; nedenini aramak zorlaşır. Seçenek tipini tablodan türetince bu yazım editörde hata olur ve geçerli seçeneklerin listesi görünür.

Bir başka hata `disabled:opacity-50` class’ını gerçek disabled davranışı sanmaktır. Bu class yalnız görünümü soluklaştırır; `disabled` native prop’unu `<button>` üzerine yaymadıysan düğme çalışır. Görünüm tablosuyla HTML davranışını ayrı tut.

:::mistake[Belirti → neden → düzeltme]
Yazım hatalı `variant` değeri derleniyor → prop tipi serbest `string` → `VariantProps<typeof style>` ile tipi cva tablosundan al.
:::

:::mistake[Belirti → neden → düzeltme]
Özel küçük görünümde ek işaret yok → tek tek varyant class’ları var ama kesişim tanımlı değil → yalnız bu birleşim için compound variant ekle.
:::

:::mistake[Belirti → neden → düzeltme]
Class doğru ama düğme tıklanabiliyor → varyant tablosu native `disabled` prop’unu aktarmıyor → davranış prop’unu gerçek `<button>` öğesine ilet.
:::

Her yeni eksen tabloyu büyütür. İki seçenekli `tone` ve üç seçenekli `size` toplam altı birleşim sunar; ürün tasarımında gerekmeyen birleşimleri eklemek API’yi ve incelemen gereken görünümleri çoğaltır. Compound kurallar çoğalıyorsa her hücreye istisna eklemek yerine seçeneklerin gerçekten ayrı kararlar olup olmadığını tekrar düşün.

:::info[Derinlemesine (isteğe bağlı)]
`defaultVariants` çalışma anında seçim yapılmadığında class üreticisinin kullanacağı değeri söyler; varyant prop’unun çağıran için zorunlu olmasını tek başına sağlamaz. Bazı API’lerde belirli seçeneği zorunlu kılmak için `VariantProps` tipini ayrıca daraltabilirsin. Uygulama dışından gelen string değerleri de TypeScript’in runtime kontrolü değildir; sınırda doğrulanmalıdır.
:::

## Özet

- cva ortak class’ları ve izin verilen varyant seçeneklerini tek tabloda toplar.
- `defaultVariants` çağrı değer vermediğinde seçilir; `compoundVariants` birden fazla seçim kesişince eklenir.
- `VariantProps<typeof config>` seçenek tiplerini tablodan çıkarır.
- `ComponentProps<'button'>` native davranışı taşır; `Omit` aynı adlı `size` alanı çakışmasını çözer.
- `cn` çağıranın class’ını varyant görünümüyle güvenle birleştirir.

**Yeni terimler**

- **cva:** Varyant seçeneklerine göre Tailwind class’ı üreten araç.
- **Variant:** Görünüm tablosundaki tek karar ekseni ve onun seçenekleri.
- **Default variant:** Seçim verilmediğinde cva’nın kullandığı seçenek.
- **Compound variant:** Birkaç seçim aynı anda eşleştiğinde eklenen kural.
- **Type inference:** TypeScript’in var olan tanımdan tipi çıkarması.

**Kendini yokla:** Bir class yalnız `quiet` ve `compact` birlikteyken gerekiyorsa nereye koyarsın? İki koşullu compound variant’a.

**Kendini yokla:** `VariantProps` cva tablosunda olmayan bir seçeneği kabul eder mi? Hayır; çağıranın tipini tanımlı seçeneklerle sınırlar.
