---
title: "Props ve children için tip yaz"
minutes: 13
kind: concept
---

# Props ve children için tip yaz

Daha önce bir bileşeni `<MovieTitle title="Matrix" />` diye kullandın. Bu satırda `title` bileşene dışarıdan verilen bilgidir. TypeScript ile bileşenin hangi bilgiyi beklediğini yazabilir, yanlış türde bir değer verildiğinde hatayı kodu çalıştırmadan görebilirsin.

## Bir başlığın türünü açıkla

İlk adımda bileşen yalnızca bir film başlığı alsın. Bir **props tipi**, bileşenin dışarıdan kabul ettiği alanları ve bu alanların türlerini tarif eder.

```tsx check
 type MovieTitleProps = { title: string }

function MovieTitle({ title }: MovieTitleProps) {
  return <h2>{title}</h2>
}

const title = <MovieTitle title="Matrix" />
void title
```

`MovieTitleProps`, `title` alanının yazı olmasını şart koşar. `<MovieTitle title={1999} />` yazarsan TypeScript hata verir; çünkü sayı, burada istenen `string` türünde değildir. Bu kontrol, ekranda yanlış içeriğin görünmesini beklemeden sorunu çağrı satırında bulmana yardım eder.

Bileşen fonksiyonundaki `{ title }` yazımı, props nesnesinden `title` alanını alır. Bileşen başlığı üretirken bu değeri kullanır; props'u değiştirmek zorunda değildir.

## Her filmde bulunmayan bilgiyi işaretle

Afişlerin bazısında çıkış yılı da olsun. Bu alan her afişte bulunmayabileceği için `?` ekleyeceğiz. **İsteğe bağlı alan**, çağrıda verilebilen ama verilmesi zorunlu olmayan alandır.

```tsx check
 type MovieLabelProps = { title: string; year?: number }

function MovieLabel({ title, year }: MovieLabelProps) {
  return <p>{title}{year !== undefined ? ` (${year})` : ''}</p>
}

const label = <MovieLabel title="Arrival" year={2016} />
const olderLabel = <MovieLabel title="Metropolis" />
void label
void olderLabel
```

`title` iki kullanımda da vardır; `year` ise yalnız ilkinde verilmiştir. Kontrolü `year !== undefined` diye yazdık, çünkü `0` da bir sayı değeridir ve her isteğe bağlı sayıyı doğruluk kontrolüyle ele almak doğru olmaz. TypeScript, `year` verilmişse sayı olmasını da denetler.

Bir alanı isteğe bağlı yapmak, bileşenin o bilgi yokken ne göstereceğine karar vermez. Burada yıl yoksa parantezli bölüm çizilmiyor. Başka bir bileşen “Yılı bilinmiyor” yazabilir; bu görünüm tercihi bileşenin koduna aittir.

## İçeriği çağırandan al

Bir film afişinde başlık dışında görsel veya biçimlendirilmiş içerik göstermek isteyebilirsin. Bu içeriği bileşenin açılış ve kapanış etiketi arasına yazarsın: React bu alana **`children`** der. `children` tipi olarak **`ReactNode`**, ekranda gösterilebilen metin, sayı veya JSX içeriğini kabul eder.

```tsx check
import type { ReactNode } from 'react'

type FilmFigureProps = { title: string; children: ReactNode }

function FilmFigure({ title, children }: FilmFigureProps) {
  return <figure><h2>{title}</h2>{children}</figure>
}

const poster = <FilmFigure title="Spirited Away">
  <strong>Gösterim afişi</strong>
</FilmFigure>
void poster
```

Çağıran `<strong>` içeriğini seçti; `FilmFigure` ise onu başlığın altına yerleştirdi. Aynı yere düz metin de verebilirsin: `<FilmFigure title="Spirited Away">Özel gösterim</FilmFigure>`. `ReactNode` seçmemizin nedeni yalnız JSX elementi değil, gösterilebilir farklı içerik türlerini de kabul etmek istememizdir.

`figure`, kendi başına anlamlı bir görsel veya örnek içeriği gruplamak için kullanılan HTML elementidir. `figcaption` bu grubun açıklamasını taşır. Şimdi film yılına bağlı bir açıklama ekleyelim:

```tsx check
import type { ReactNode } from 'react'

type FilmPosterProps = { title: string; children: ReactNode; caption?: string }

function FilmPoster({ title, children, caption }: FilmPosterProps) {
  return (
    <figure>
      <h2>{title}</h2>
      {children}
      {caption !== undefined && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

const poster = <FilmPoster title="Dune" caption="2021 gösterimi">
  <span aria-hidden="true">▰</span>
</FilmPoster>
void poster
```

Bu örnekte başlık ve `children` her kullanımda gerekli; `caption` yoksa açıklama satırı oluşmuyor. Böylece tip, çağırana gerçekten sağlaması gereken bilgiyi söylerken görünüm kodu da eksik bilgiyle ne yapılacağını belirliyor. Başlık olmadan afiş tanınmayacağı için onu zorunlu tuttuk; açıklama ise yararlı ama şart değil.

![Çağıranın props sözleşmesini tip kontrolünden geçirip bileşene vermesi](diagrams/props-sozlesmesi.svg "Props sözleşmesi")

## Çağrı satırındaki hatayı bul

Şu kullanımda sorun, bileşenin gövdesinde değil çağıranın verdiği değerdedir:

```tsx
// MovieTitleProps içindeki title: string alanı sayı kabul etmez.
<MovieTitle title={1999} />
```

Ekranda film yılı göstermek istiyorsan `title` alanına sayı vermek yerine `year` gibi ayrı bir alan tanımla. Alanları ayırmak, bileşenin hangi değeri nerede kullanacağını açık tutar. Her prop'u `any` yapmak hatayı sustururdu ama bu kez geçersiz değerleri TypeScript yakalayamazdı.

:::mistake[JSX'i yalnız yazı sanmak]
Belirti → Bileşene `<strong>Özel gösterim</strong>` verdiğinde TypeScript, JSX'in `string` olmadığını söyler.
Neden → Prop yalnız düz yazı kabul edecek biçimde tanımlanmıştır.
Düzeltme → Çağıranın metin veya JSX seçmesi gerekiyorsa `children: ReactNode` kullan; gerçekten yalnız yazı gerekiyorsa `string` tipini koru.
:::

## Aklında tut

- Props tipi, bileşene hangi alanların hangi türde verilebileceğini anlatır.
- `?` bir alanı isteğe bağlı yapar; bileşen bu alan yokken ne göstereceğine yine karar verir.
- `children`, bileşen etiketlerinin arasındaki içeriktir; `ReactNode` farklı gösterilebilir içerikleri kabul eder.
- Gerekli bilgiyle isteğe bağlı bilgiyi ayırmak hem çağrıyı hem bileşen gövdesini anlaşılır yapar.

**Yeni terimler:** Props tipi, bileşenin kabul ettiği alanları tarif eder; isteğe bağlı alan, çağrıda atlanabilen alandır; `children`, JSX etiketleri arasına verilen içeriktir; `ReactNode`, gösterilebilir React içeriğinin tipidir; `figure` içerik grubunu, `figcaption` bu grubun açıklamasını belirtir.

**Kendini yokla:** Başlık her afişte zorunlu, yıl bazen yoksa hangi alana `?` eklersin?
*Cevap:* Yıla; başlık zorunlu kalır.

**Kendini yokla:** Bileşene bazen yazı bazen JSX verilecekse `children` için neden `string` dar kalır?
*Cevap:* JSX elementi yazı türünde değildir; `ReactNode` ikisini de kabul eder.
