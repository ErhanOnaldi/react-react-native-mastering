---
title: "Utility-first ile tasarım kararı"
minutes: 16
kind: concept
---

# Utility-first ile tasarım kararı

Sinema’da küçük bir film etiketi düşün: zemini renkli, yazısı küçük, çevresinde de biraz boşluk var. Bildiğin CSS’te JSX’e `className="film-label"` yazıp görünümü `.film-label` kuralında tanımlayabilirsin. **Utility-first**, her küçük görünüm kararını adlandıran class’ları doğrudan öğenin yanında yazma yaklaşımıdır. Tailwind CSS bu class adlarından CSS üretir; React’in state’ini veya düğmenin davranışını değiştirmez.

İlk örnekte etikete yalnızca yatay ve dikey iç boşluk verelim:

```tsx
function FilmTag() {
  return <span className="px-3 py-1">Bilim kurgu</span>
}
```

`px-3` sağa ve sola, `py-1` yukarı ve aşağı iç boşluk verir. Her class ayrı bir görsel karar olduğu için JSX’e bakınca etiketin nasıl kurulduğunu görebilirsin. Sayılar Tailwind’in aralık ölçeğinden gelir; `3` sayısını “üç piksel” diye okumak doğru değildir.

Şimdi etikete sınır ve yuvarlak köşe ekleyelim; bu, önceki örneğe tek bir yeni karar ekler:

```tsx
function FilmTag() {
  return <span className="rounded-full border px-3 py-1">Bilim kurgu</span>
}
```

`rounded-full` köşeleri yuvarlar, `border` sınır çizer. Önceki boşluk class’ları yerinde kaldı. Farklı CSS özelliklerine dokunan class’lar birlikte çalışabilir; her class’ın hangi kararı verdiğini adından ve CSS karşılığından okuyabilirsin.

Son olarak yazının boyunu ve kalınlığını belirleyelim:

```tsx
function FilmTag() {
  return (
    <span className="rounded-full border px-3 py-1 text-sm font-medium">
      Bilim kurgu
    </span>
  )
}
```

`text-sm` yazıyı küçültür, `font-medium` ağırlığını artırır. Böylece küçük bir görünüm, birkaç açık karardan oluştu. Aynı class dizisini başka bir bileşende aynen tekrarlamaya başladığında ortaklaştırmayı düşünebilirsin; tek kullanım için hemen yeni CSS katmanı veya component açmak zorunda değilsin.

## Bir class değişince neyi değiştiriyorsun?

Bir class dizisini okurken hangi CSS kararlarının birlikte bulunduğunu izleyelim:

| Sıra | Class | Karar | Birlikte çalıştığı şey |
|---|---|---|---|
| 1 | `rounded-xl` | köşeleri yuvarla | sınır ve boşluk |
| 2 | `border` | ince sınır çiz | köşe biçimi |
| 3 | `p-4` | dört yönde iç boşluk | yazı biçimi |
| 4 | `font-semibold` | yazıyı kalınlaştır | boyut |
| 5 | `text-sm` | yazıyı küçült | ağırlık |

Bu kararlar farklı alanlara dokunduğu için bir arada durur. İki class aynı alanı etkiliyorsa ikisinin birlikte yazılması, HTML’de sağdaki class kesin kazanır anlamına gelmez. Bu ayrıntıyı birazdan class birleştirme konusuna bırakacağız; şimdilik class adlarını görsel kararlar olarak okumak yeterli.

Bir başlık satıra sığmadığında `truncate` taşan kısmı tek satırda üç noktayla gösterir. Fakat uzun yazının sığacağı alanı düzenin de sağlaması gerekir. Yani class eklemek, çevresindeki öğelerin nasıl yerleştiğine bakma ihtiyacını ortadan kaldırmaz.

![JSX'te utility kararlarının tek öğede birikmesini gösteren diyagram](diagrams/utility-karari.svg "Utility kararları öğenin yanında")

## Koşullu görünüm: class adı kaynakta tam görünsün

Sinema’daki koleksiyon kartında film türüne göre etiket rengi seçmek isteyebilirsin. İlk deneme class adını parçalar hâlinde kuruyor:

```tsx
function GenreLabel({ level }: { level: number }) {
  return <span className={`text-${level}xl`}>Bilim kurgu</span>
}
```

Tarayıcıda `level` değeri `2` olduğunda `text-2xl` oluşmasını beklersin. Ancak Tailwind’in kaynak taraması uygulamayı çalıştırıp `level` için olası sayıları denemez. Kaynakta tam class adı görünmediği için gerekli CSS üretilmeyebilir; belirti, yazının beklenen boyuta gelmemesidir.

Seçenekler sınırlıysa class adlarını eksiksiz string’ler olarak kaynakta tut:

```ts check
const titleSizes = {
  compact: 'text-lg',
  featured: 'text-2xl',
} as const

function titleSizeFor(kind: keyof typeof titleSizes): string {
  return titleSizes[kind]
}

const featuredTitleClass = titleSizeFor('featured')
```

Bu kez iki tam class adı dosyada görünür. Tailwind bu seçeneklerin CSS’ini üretir, React ise kullanım anında hangisinin seçileceğine karar verir. Bu ayrım, sınırlı görünüm seçeneklerinde sonucu güvenilir kılar.

Üçüncü örnekte class’a bir koşul ekleyelim:

```tsx
function RatingLabel({ highlighted }: { highlighted: boolean }) {
  const colorClass = highlighted ? 'text-amber-700' : 'text-slate-600'
  return <span className={`text-sm ${colorClass}`}>8.4</span>
}
```

Her iki tam class da kodda bulunduğu için Tailwind ikisinin CSS’ini hazırlayabilir; React `highlighted` değerine göre yalnızca birini seçer. Class seçmek görünüşü değiştirir. Bir düğmeyi gerçekten devre dışı bırakmak gibi davranışlar için ayrıca `disabled`, state ve event gibi HTML/React araçlarını kullanırsın.

## Ekran genişledikçe değişen görünüm

Bir **variant**, class’ın hangi durumda uygulanacağını belirten önektir. Örneğin `hover:bg-sky-800` arka plan rengini hover sırasında değiştirir. `md:` gibi responsive variant’lar ise **viewport** denilen tarayıcı içerik alanının genişliği belirli bir eşiğe ulaştığında devreye girer. Bunlar telefon veya tablet adları değildir.

Film türü etiketini dar ekranda küçük, orta genişlikten sonra biraz büyük göstermek için:

```tsx
function GenreLabel() {
  return <span className="text-sm md:text-base">Bilim kurgu</span>
}
```

Öneksiz `text-sm` temel kuraldır. `md:` eşiğinde `text-base` aynı yazı boyu kararını günceller; eşik gelmeden yeni class etkili olmaz. Tailwind’in responsive yaklaşımı mobile-first’tür: önce dar görünümde gerekeni yazarsın, sonra genişlik geldikçe değişiklik eklersin.

| Viewport genişliği | Etkin class | Yazı boyu kararı |
|---|---|---|
| 390 px | `text-sm` | küçük |
| 900 px | `md:text-base` | normal |

İkinci satırdaki kural ilkini her koşulda silmez; yalnızca kendi eşiğinde aynı CSS kararını değiştirir. Benzer biçimde `grid-cols-2 md:grid-cols-4` dar alanda iki, eşik sonrasında dört sütun seçer. Düzenin ayrıntısını bir sonraki derste kuracağız.

## Nerede ortaklaştırmalı?

Başta öğenin görünümünü class’larla yanında tut. Aynı tasarım kararı gerçekten birkaç yerde tekrarlanıp değiştikçe birbirinden ayrılıyorsa ortak bir component veya tasarım token’ı düşün. Class satırını yalnızca kısaltmak için başka değişkene taşımak tek başına tekrar sorununu çözmez. İsimlendirilmiş bir değişken, tasarım rolünü ya da koşulu açıklıyorsa fayda sağlar.

Tarayıcının DevTools aracında **computed styles**, yani öğeye sonunda uygulanan CSS değerlerini görebilirsin. Kaynaktaki class listesi ile ekrandaki son değer aynı şey değildir: CSS kuralları, responsive koşullar ve başka stiller sonucu etkileyebilir. Utility class’ları CSS’in çalışma modelini ortadan kaldırmaz; yalnızca küçük kararları JSX’e yaklaştırır.

:::mistake[Başlık boyu değişmiyor]
Belirti: Önizlemede dinamik boy class’ı etkisiz. Neden: Class adı kaynakta tam görünmüyor. Düzeltme: Sınırlı seçenekleri tam string’lerle tanımla, aralarından seçim yap.
:::

:::mistake[Class ekledim, davranış da değişti sanıyorum]
Utility class yalnız görünümü değiştirir. Düğmede `disabled` niteliği, erişilebilir ad ve event handler gibi davranışları ayrıca kur.
:::

:::info[Derinlemesine (isteğe bağlı)]
Tailwind v4’te uygulamanın CSS dosyası genellikle `@import "tailwindcss";` ile başlar ve Vite projesi Tailwind eklentisini yapılandırır. `@theme` tekrar kullanılabilir renk gibi tasarım token’ları tanımlamak içindir; bunu tema token’ları dersinde kuracağız. Tailwind’in bir monorepo’da hangi ek kaynak dosyalarını taradığını `@source` ile belirtmek, özel renkleri `oklch(...)` ile yazmak ve arbitrary value kullanmak bu dersin temel akışı için gerekmez.
:::

## Özet

- Utility-first, küçük görünüm kararlarını class adlarıyla öğenin yanında tutar.
- Tailwind class’lardan CSS üretir; React hangi tam class’ın seçileceğine karar verir.
- Variant’lar `hover:` gibi durumlarda veya `md:` gibi viewport eşiklerinde görünümü değiştirir.
- Görünüm class’ları düğmenin işlevini ya da erişilebilir davranışını kendiliğinden kurmaz.

**Yeni terimler:**

- **Utility:** Tek bir görsel kararı adlandıran class.
- **Utility-first:** Görünüm kararlarını öğenin yanında utility class’larla yazma yaklaşımı.
- **Variant:** Bir class’ın hangi durum veya genişlik koşulunda geçerli olduğunu belirten önek.
- **Viewport:** Tarayıcıda sayfanın görünen içerik alanı.
- **Computed styles:** Tarayıcının bir öğeye sonunda uyguladığı CSS değerleri.

**Kendini yokla:** `text-${level}xl` neden güvenilir bir seçim değil? Tailwind kaynakta tam class adını göremeyebilir.

**Kendini yokla:** `disabled:opacity-50` tek başına düğmeyi devre dışı bırakır mı? Hayır; yalnız görünüm değişir, HTML `disabled` niteliği ayrıca gerekir.
