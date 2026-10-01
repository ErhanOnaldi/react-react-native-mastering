---
title: "Class çakışmalarını bilinçli çöz"
minutes: 17
kind: concept
---

# Class çakışmalarını bilinçli çöz

Bir film kartı için şu class dizisini yazdığını düşün: `rounded p-2`. Görünüş güzel, ama bir kullanım yerinde kartın iç boşluğu daha geniş olmalı. `p-4` ekleyince HTML class listesinde ikisi de görünüyor; sağdaki class’ın CSS’te kesin kazanacağı garantisi yok. Burada iki ayrı işe ihtiyacımız var: koşula göre class parçalarını bir string’e toplamak ve Tailwind’in bildiği çakışan kararları ayıklamak.

## Koşullu class’ı string’e dönüştür

Bir etiketi seçili olunca farklı renkte göstermek isteyelim. Basitçe koşullu string ekleyebiliriz:

```ts
function genreLabelClass(selected: boolean): string {
  return 'rounded ' + (selected ? 'bg-sky-700 text-white' : '')
}
```

`selected` doğruysa iki class eklenir, değilse boş string eklenir. Büyüyen koşullarda boşlukları ve birden çok seçeneği elle birleştirmek kolayca karışır. `clsx`, farklı class girdilerini değerlendirip bir string’e dönüştüren küçük bir kütüphanedir.

Önce aynı örneği `clsx` ile yazalım:

```ts check
import { clsx } from 'clsx'

function genreLabelClass(selected: boolean): string {
  return clsx('rounded', selected && 'bg-sky-700 text-white')
}

const unselectedClass = genreLabelClass(false)
```

`selected` false iken `false` girdisi class string’ine eklenmez. Ortak `rounded` kalır, seçili renklere ait class’lar gelmez. Bu örnekte aynı CSS kararını seçen iki utility yok; dolayısıyla çatışma çözmeye gerek yok.

Birden çok koşul ve ortak class olduğunda da aynı kuralı izleyebilirsin:

```ts check
import { clsx } from 'clsx'

function metadataClass(featured: boolean, compact: boolean): string {
  return clsx(
    'inline-flex items-center',
    featured ? 'text-amber-800' : 'text-slate-600',
    compact ? 'gap-1 text-xs' : 'gap-3 text-sm',
  )
}

const featuredCompactClass = metadataClass(true, true)
```

Bu kez ortak class’lar iki durumda da kalır; her boolean yalnız kendi seçeneğini belirler. `clsx` koşullu değerleri birleştirir ama Tailwind class’larının ne anlama geldiğini çözmez. Örneğin her iki seçenek de `text-*` yazı boyu seçerse, ikisi de sonuçta kalabilir.

## Aynı karar iki kez verildiğinde

Tailwind’in `p-2` ve `p-4` gibi utility’leri bir **conflict group** — yani aynı görsel kararı veren class grubu — içinde değerlendirilir. `tailwind-merge` bu grupları tanır ve çakışan bilinen class’ları birleştirilmiş string’den çıkarır. Class’ların HTML’deki sırası tek başına tarayıcıda hangi CSS’in kazanacağını belirlemediği için bu temizleme, component’e öngörülebilir override davranışı verir.

Örnekteki class’lar önce `clsx` ile birleşip sonra `twMerge`’e girsin:

```ts check
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const cardClasses = twMerge(clsx('rounded-xl p-2', 'p-6'))
```

İşlem sırasını izleyelim:

| Adım | İşlem | Sonuç |
|---|---|---|
| 1 | Koşul yok, class parçaları toplanır | `rounded-xl p-2 p-6` |
| 2 | `twMerge` utility gruplarını tanır | `p-2` ile `p-6` ikisi de padding seçiyor |
| 3 | Aynı gruptaki son değer tutulur | `rounded-xl p-6` |

`rounded-xl` köşe biçimini seçer ve padding grubuyla ilgisi yoktur; bu nedenle kalır. `p-2` ile `p-6` aynı genel padding kararını verdiği için son gelen değer sonuçta kalır. Son gelen class’ın kazanması `twMerge`’in bilinen utility gruplarına ilişkin kuralıdır; CSS kurallarının tüm öncelik ilişkisini açıklamaz.

![clsx birleştirir, tailwind-merge padding çakışmasında son class'ı tutar](diagrams/class-cakismasi.svg "Koşullu birleştirme ve çakışma çözümü")

Padding’in yön kapsamı değiştiğinde class’lar kısmen kesişebilir: `p-2` dört yönü, `px-4` sağ ve solu etkiler. Bunlar her durumda aynı karar değildir; yatay alan `px-4`’ten, dikey alan `p-2`’den gelebilir. `split(' ')` ile string’i ayırıp isim öneklerini karşılaştırmak bu kapsamlara ve `hover:` gibi koşullara göre güvenilir bir model kurmaz.

## Component kullanan kişinin class’ı

Bir ortak görünüm, çağırana bazı class’ları değiştirme olanağı verebilir. Örneğin kartın temel class’ları bileşende tanımlı, kullanım yerinden ek bir class gelmiş olsun:

```tsx
import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

type FilmPanelProps = { className?: string; children: ReactNode }

export function FilmPanel({ className, children }: FilmPanelProps) {
  const panelClass = twMerge(clsx('rounded-xl border p-3', className))
  return <article className={panelClass}>{children}</article>
}
```

Kullanım yerinden `p-6` geldiğinde birleştirme sırası, bu girdiyi temel `p-3` sonrasına koyar. Böylece aynı Tailwind kararında kullanım yeri override edebilirken `rounded-xl` ve `border` korunur. Component’in padding’ini değiştirmek istenmiyorsa `className` kabul etmek zorunda değilsin; bu, component’in dışarıya açtığı bir API kararıdır.

Şimdi conditional girdinin birleştirme içinden nasıl geçtiğini de görelim:

```ts check
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function panelClassFor(active: boolean, extraClass: string): string {
  const inputs: ClassValue[] = [
    'rounded-xl p-3',
    active && 'border-sky-700',
    extraClass,
  ]
  return twMerge(clsx(inputs))
}

const activePanelClass = panelClassFor(true, 'p-6')
```

İlk olarak `clsx` false olan girdileri atıp class parçalarını toplar. Ardından `twMerge` aynı utility grubundaki bilinen çakışmaları ele alır. Kütüphanelerin sırası önemlidir: yalnız `clsx` kullanırsan class’lar düzgün bir string olur ama padding çakışması hâlâ çözülmez.

:::mistake[False girdiler çıktıda görünüyor]
Belirti: Class string’inde `false` veya gereksiz boşluk var. Neden: Koşullu parçaları array’e koyup doğrudan `join` ile birleştirdin. Düzeltme: Koşullu class girdilerini `clsx`’e ver.
:::

:::mistake[İki padding class’ı da kaldı]
Belirti: `p-2` ve `p-6` birlikte class listesinde. Neden: Birleştirme yalnız `clsx` ile yapıldı. Düzeltme: `clsx` sonucunu `tailwind-merge` ile işle.
:::

:::mistake[Kullanım yerindeki class görünümü değiştirmiyor]
Belirti: Component’in temel padding’i kalıyor. Neden: Tüketiciden gelen class birleştirmede önce verilmiş. Düzeltme: Override desteklenecekse dışarıdan gelen class’ı temel class’lardan sonra işle.
:::

## Sınırı nerede?

`cn` adı verilen yaygın yardımcı fonksiyonlar genellikle `clsx` ile `tailwind-merge`’i bu sırayla bir araya getirir. İsim tek başına bir standart davranış sağlamaz; fonksiyonun girdileri, class sırası ve desteklediği utility’ler önemlidir. Burada kurduğumuz model yalnız class string’leri içindir; DOM’u, state’i veya inline `style` değerlerini yönetmez.

:::info[Derinlemesine (isteğe bağlı)]
`ClassValue`, `clsx`’in kabul ettiği string, boolean, `null`, `undefined`, dizi ve koşul nesnelerinin TypeScript tipidir. `...values` biçimi çağıranın birden çok girdiyi ayrı argümanlar olarak vermesini sağlar. Özel Tailwind utility’leri veya eklenti class’ları `tailwind-merge` tarafından tanınmayabilir; gerekirse merge config’i genişletilir. `hover:p-2` ile `p-4` farklı koşullarda çalıştığından modifier kapsamları da değerlendirilir. Bunlar temel koşullu birleştirme için gerekli değildir.
:::

## Özet

- `clsx` koşullu girdileri güvenle tek class string’inde birleştirir.
- `tailwind-merge` bildiği Tailwind utility gruplarındaki çakışmaları temizler.
- Birleştirme sırası `clsx` sonra `twMerge` olmalıdır.
- Kullanım yerinden gelen class sonradan işlendiğinde aynı utility grubunda override edebilir.
- Bu yardımcı CSS’in tamamını çözmez; yalnızca class string’leri üzerinde çalışır.

**Yeni terimler:**

- **`clsx`:** Koşullu class girdilerini bir string’e dönüştüren kütüphane.
- **Conflict group:** Aynı görsel kararı seçen Tailwind utility class’ları grubu.
- **`tailwind-merge`:** Bilinen Tailwind class çakışmalarını ayıklayan kütüphane.
- **Override:** Kullanım yerinden gelen değerin component’in temel kararını değiştirmesi.
- **`ClassValue`:** `clsx`’in desteklediği farklı girdi türlerini tanımlayan TypeScript tipi.

**Kendini yokla:** `clsx` tek başına padding çakışmasını çözer mi? Hayır; girdileri birleştirir ama utility gruplarını karşılaştırmaz.

**Kendini yokla:** `p-2` ile `px-4` tamamen birbirinin yerine geçer mi? Hayır; ilki dört yönü, ikincisi yatay yönleri kapsar.
