---
title: "Utility-first ile tasarım kararı"
minutes: 16
kind: concept
---

# Utility-first ile tasarım kararı

:::pain[Bir değişiklik neden üç yere gidiyor?]
Sinema'da aynı küçük etiket arama sonuçlarında, kaydedilenlerde ve film ayrıntısında görünüyor. Birinin yazısı büyüyünce diğer ikisi küçük kalıyor; üç ayrı CSS kuralı aynı tasarım kararını temsil ediyor.
:::

## Görünüm kararını bileşene yaklaştır

Klasik CSS'te JSX `className="movie-label"` der, başka dosyadaki `.movie-label` kuralı görünüşü tarif eder. Bu ayrım büyük ve ortak stiller için kullanışlıdır; fakat bir öğeye ait birkaç kararın nerede verildiğini bulmak için dosyalar arasında gidip gelirsin. Utility-first yaklaşımında küçük kararlar — boşluk, renk, yazı boyu ve hizalama — JSX üzerinde yan yana durur.

Tailwind CSS utility adlarını tanır ve karşılık gelen CSS'i üretir. React'in render veya state modeline karışmaz. Bir class eklemek DOM öğesinin görsel stilini değiştirir; `disabled`, `aria-pressed` veya event handler gibi davranışları kendiliğinden kurmaz.

:::model[Utility-first'in üç kuralı]
1. Her utility tek bir görsel kararı adlandırır; birkaç utility birlikte bir öğenin görünümünü oluşturur.
2. Tailwind kaynakta tam class adlarını bulup CSS üretir; çalışma zamanında class string'ini tahmin edip CSS üretmez.
3. Tekrarlanan karar, ancak kullanım yerlerinde gerçekten aynı kaldığında ortak token'a veya bileşene taşınır.
:::

![JSX'te utility kararlarının tek öğede birikmesini gösteren diyagram](diagrams/utility-karari.svg)

Bir class adının biçimi, kararın yönünü okumaya yardım eder. `px-4` yatay padding, `py-2` dikey padding, `text-sm` yazı boyu, `font-semibold` ağırlık seçer. Ölçek değerleri Tailwind'in tasarım ölçeğidir; `4` değerini doğrudan dört piksel diye yorumlama. Utility'leri ezberlemek yerine önekin hangi CSS alanını seçtiğini sor.

## Değişikliği JSX üzerinden izleyelim

Bir başlık ve alt metin içeren küçük bir panel düşün. İlk render'da şu kararlar uygulanır:

| Sıra | Kaynaktaki class | Görsel kararı | Değişken |
|---|---|---|---|
| 1 | `rounded-xl` | köşeleri yuvarlar | radius |
| 2 | `border` | ince sınır çizer | border width |
| 3 | `p-4` | dört yönde iç boşluk verir | padding |
| 4 | `font-semibold` | başlığı kalınlaştırır | font weight |
| 5 | `text-sm` | alt metni küçültür | font size |

Bu satırlar farklı CSS özelliklerine dokunduğu için birlikte çalışır. Aynı özellik üzerinde iki class varsa yalnızca JSX'te hangisinin önce yazıldığına bakarak CSS kazananını çıkaramazsın. Bunun için ayrı bir class birleştirme modeli kullanılır; burada class'ların sorumluluğunu ve kaynakta görünmesini kuruyoruz.

Bir metin başlığı panel genişliğini aşıyorsa `truncate` görünür taşmayı keser, ama tek başına bir tasarım kararı değildir. Başlığın daralmasına izin veren bir kapsayıcı ve uygun genişlik koşulu gerekir. Utility-first kodu da CSS gibi düşünülmelidir: class eklemek, çevresindeki düzen kurallarından bağımsız olarak doğru sonucu garanti etmez.

## Önce kırık, sonra tam class

Bir API'den sayı geldiğini varsayalım. Bu biçim Tailwind'in kaynak taramasında tamamlanmış bir class adı değildir:

```tsx
function Score({ level }: { level: number }) {
  return <span className={`text-${level}xl`}>Puan</span>
}
```

`level` değeri tarayıcıda `2` olsa bile Tailwind derleme anında uygulamayı çalıştırıp bütün olası değerleri denemez. Sonuçta `text-2xl` CSS'i üretilmemiş olabilir. Görülen belirti, öğenin beklenen boyutu almaması; nedeni class'ın parça parça kurulmasıdır.

Sınırlı seçenek varsa tam class string'lerini kaynakta tut:

```ts check
const titleSize = {
  compact: 'text-lg',
  featured: 'text-2xl',
} as const

function getTitleClass(size: keyof typeof titleSize): string {
  return titleSize[size]
}

const className = getTitleClass('featured')
```

Tailwind iki string'i de görebilir; React ise uygun seçimi çalışma anında yapar. Bu ayrım önemlidir: React hangi görünümün gerektiğini seçer, Tailwind seçilebilecek class'ların CSS'ini önceden üretir. Çok geniş ve gerçek veriyle gelen değer aralığında arbitrary value kullanılabilir, ancak sınırlı tasarım seçenekleri için rastgele sayıdan class üretmek doğru model değildir.

## Varyantlar yeni durum ekler

`hover:bg-sky-800` veya `focus-visible:outline-2` gibi önekler, utility'nin hangi CSS koşulunda çalışacağını bildirir. `sm:` ve `lg:` de belirli cihaz adları değil, viewport eşiklerinden itibaren geçerli olan responsive koşullardır. Örneğin `text-sm md:text-base` dar görünümde küçük, orta eşikten itibaren normal metin kullanır.

Tailwind mobile-first ilerler: öneksiz class temel kuraldır; responsive class o eşiğe ulaşıldığında eklenir veya aynı özelliğin değerini değiştirir. `grid-cols-2 md:grid-cols-4` küçük ekranda iki, `md` ve üzerinde dört sütun seçer. `md:` sınıfını yazmak kendiliğinden başka class'ı silmez; hangi CSS özelliğine dokunduğuna bak.

Varyantları rastgele çoğaltmak okunabilirliği düşürür. Örneğin aynı öğede `hover:`, `focus-visible:`, `disabled:` ve `dark:` olması kabul edilebilir; ancak aynı tasarım kararını farklı renk tonlarıyla her ekranda kopyalamak ortak tasarım dilini dağıtır. Bu nedenle önce tek kullanımlı öğeyi utility'lerle kur, sonra gerçek tekrar oluştuğunda kararı ortaklaştır.

## Kurulumun yeri ve sınırı

Bu repoda Tailwind v4, Vite eklentisiyle çalışır. Uygulamanın ana CSS dosyasında `@import "tailwindcss";` bulunur; Vite yapılandırması Tailwind eklentisini yükler. V4'te tema ve özel utility kararları CSS tarafında tanımlanır. Eski üç `@tailwind` direktifi ve JS config örneklerini v4 kurulumu gibi kopyalama.

```css title="src/styles.css"
@import "tailwindcss";

@theme {
  --color-label: oklch(0.48 0.12 245);
}
```

Bu token'dan `text-label` veya `bg-label` gibi utility adları üretilebilir. Bir rengi yalnız bu panelde bir kere kullanıyorsan hazır renk utility'si yeterli olabilir; aynı marka kararı birkaç bileşende görünüyorsa anlamlı token adı bakım maliyetini azaltır. Token'ları ve dark tema değerlerini ayrı derste kuracağız.

:::mistake[Belirti → neden → düzeltme]
Önizlemede dinamik başlık boyu class'ı etkisiz kalıyor → class adı kaynakta tam görünmüyor → sınırlı class seçeneklerini tam string'ler olarak yaz ve seçimi bu listeden yap.
:::

:::mistake[Belirti → neden → düzeltme]
Bir class ekleyince düğme davranışının da değiştiğini sanıyorsun → utility yalnız CSS'i etkiler → `disabled`, state, erişilebilir ad ve event'leri HTML/React sözleşmesinde ayrıca kur.
:::

:::mistake[Belirti → neden → düzeltme]
Her öğeye ayrı CSS sınıfı açıp aynı kararları tekrar ediyorsun → görsel kararlar farklı dosyalarda çoğalıyor → birkaç utility ile öğeye yakın başla; tekrar gerçek olduğunda ortak bileşen veya token çıkar.
:::

:::sector
Takımlar genellikle utility-first'i küçük ve orta ölçekli görsel kararları bileşen kullanımının yanında tutmak için seçer. Kod incelemesinde class satırının uzunluğuna tek başına bakmak yerine kararların anlamlı adlandırılıp adlandırılmadığını, tekrarın gerçekten ortak olup olmadığını ve HTML davranışının görünümden ayrı kurulup kurulmadığını kontrol et.
:::

## Class listesi nerede büyür?

Utility yaklaşımında uzun bir class string'i her zaman tasarım hatası değildir. Bir düğmenin normal, hover, focus, dark ve disabled hallerini yan yana tanımlamak satırı uzatır; her class'ın hangi koşulda devreye girdiği de görünür olur. Aynı string farklı component'lerde kopyalanmaya başladığında, görünüm kararı artık paylaşılmıyordur. Bu noktada ortak bileşen veya varyant tablosu daha iyi bir sınır olabilir.

Class listesini yalnız kısaltmak amacıyla `const classes = '...'` değişkenine taşımak tekrar sorununu çözmez. İsimlendirilmiş helper, koşulları veya tasarım rolünü gerçekten açıklıyorsa değer katar. Aksi durumda JSX'teki görünüm kararını dosyanın başka yerine taşımış olursun.

Tarayıcı DevTools'ta öğeyi seçip computed styles bölümüne bakmak, iki utility aynı CSS özelliğine dokunuyorsa ne olduğunu anlamaya yardım eder. Source'taki utility class'ı ile son computed değeri ayrı şeylerdir: media query, cascade layer, selector specificity ve `!important` sonucu etkileyebilir. Tailwind class adlarını bilmek CSS'in çalışma modelini ortadan kaldırmaz.

Monorepo'da class'ın JSX'te görünmesine rağmen stil üretilmemesi, kaynak tarama kapsamıyla da ilgili olabilir. Tailwind bazı dosyaları `.gitignore` veya varsayılan sezgileri nedeniyle taramayabilir; dış paketteki kaynak gerektiğinde `@source` ile tanıtılır. Bu yüzden class etkisiz görünüyorsa yazımı, CSS build çıktısını ve dosyanın tarama kapsamını ayrı ayrı kontrol et.

## Özet

- Utility class'ları küçük görsel kararları JSX yanında tutar; React davranışını kurmaz.
- Tailwind CSS'i kaynakta bulduğu tam class adlarından üretir.
- Öneksiz class temel görünümü, `hover:` ve `md:` gibi varyantlar koşullu görünümü tanımlar.
- Aynı kararı birkaç yerde tekrarladığında ortaklaştır; tek kullanımda erken soyutlama yapma.
- V4 kurulumu CSS `@import` ve Vite eklentisiyle çalışır.

**Kendini yokla:** `text-${size}xl` neden güvenilir değil? Kaynak taramasında tam class görünmez.

**Kendini yokla:** `disabled:opacity-50` düğmeyi gerçekten devre dışı bırakır mı? Hayır; görünüm değişir, HTML `disabled` niteliği ayrıca gerekir.
