---
title: "Ortak veriyi Context ile taşı"
minutes: 17
kind: concept
---

# Ortak veriyi Context ile taşı

`props` ile veriyi üst bileşenden alt bileşene gönderdiğini biliyorsun. Sinema uygulamasında seçili dil bir sayfa başlığında, filtre düğmelerinde ve film kartlarında görünebilir. Aradaki her bileşene sadece bu bilgiyi aşağı aktarmak için prop eklemek mümkün; ama o bileşenler dili hiç kullanmıyorsa kodda gereksiz taşıma oluşur.

Bir veriyi aradaki ilgisiz bileşenlerden geçirmeye **prop drilling** denir. React'in **Context** özelliği, üst bileşenin verdiği değeri alt ağaçtaki bileşenlere doğrudan ulaştırır. İlk olarak props ile nasıl göründüğünü görelim.

## Props zincirinde ara bileşenler

Burada `App` dil bilgisini `Page`'e verir; `Page` de yalnızca başka bileşene aktarmak için `Header`'a iletir:

```tsx
function App() {
  return <Page language="tr" />
}

function Page({ language }: { language: string }) {
  return <Header language={language} />
}

function Header({ language }: { language: string }) {
  return <h1>Dil: {language}</h1>
}
```

`Page` dili kullanmıyor ama prop adını ve tipini biliyor. Zincir birkaç kat uzarsa her ara bileşenin imzası da değişir. Birkaç prop geçişi olağandır; sorun, ilgisiz ara bileşenlerin ortak bilgiyi sürekli taşımasıdır.

## Context ile doğrudan okuma

Context'i oluşturan `createContext`, paylaşılacak değerin kanalını tanımlar. Değeri ağaca veren bileşene **Provider** denir; değeri okuyan alt bileşen ise tüketicidir. `useContext` ile tüketici, kendisini saran en yakın Provider'ın değerini alır.

```tsx
import { createContext, useContext } from 'react'

const LanguageContext = createContext<string | null>(null)

function App() {
  return (
    <LanguageContext.Provider value="tr">
      <Page />
    </LanguageContext.Provider>
  )
}

function Page() {
  return <Header />
}

function Header() {
  const language = useContext(LanguageContext)
  return <h1>Dil: {language}</h1>
}
```

`Page` artık dili alıp ileri taşımaz; `Header` ağacın yukarısındaki Provider'dan okur. Bu, bütün prop'ları Context'e çevirmek gerektiği anlamına gelmez: yalnızca bir üst bileşenden bir alt bileşene giden değerde `props` daha açık kalır.

## Değer değişince tüketiciler güncellenir

Context yalnızca sabit ayar vermez; Provider'ın değeri state'ten gelebilir. Örneğin üst bileşen arayüz dilini değiştirirken başlık ve menü aynı seçimi göstermelidir:

```tsx
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

const LanguageContext = createContext<string | null>(null)

function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('tr')

  return (
    <LanguageContext.Provider value={language}>
      <button type="button" onClick={() => setLanguage('en')}>English</button>
      {children}
    </LanguageContext.Provider>
  )
}

function LanguageLabel() {
  const language = useContext(LanguageContext)
  return <p>Seçili dil: {language}</p>
}
```

`LanguageProvider` içindeki düğmeye basınca state `en` olur. Provider'ın değeri değiştiği için `LanguageContext` okuyan tüketiciler yeni dili alıp yeniden render edilir; ara bileşenlere `language` prop'u eklemek gerekmez. Context veri paylaşımını kolaylaştırır, tüketicilerin güncellenmesini engellemez.

Provider altına iki tüketici yerleştirirsen ikisi de aynı seçimi gösterir:

```tsx
function LanguagePanel() {
  return (
    <LanguageProvider>
      <LanguageLabel />
      <LanguageLabel />
    </LanguageProvider>
  )
}
```

| Adım | Değer | Ne görür `LanguageLabel`? |
|---|---|---|
| İlk render | `tr` | `Seçili dil: tr` |
| Düğmeye basıştan sonra | state `en` olur | React Provider'ı yeni değerle işler |
| Güncelleme ekrana uygulanır | Provider değeri `en` | `Seçili dil: en` |

Tabloda tüketici eski değerde takılı kalmaz. Aynı Provider altında iki `LanguageLabel` varsa ikisi de değişikliği görür; çünkü ikisi de aynı Context değerini okur.

![Provider değeri değişince tüketicilere yayılan context güncellemesi](diagram:context-yayilimi)

## Provider sınırını izleyelim

Bir Context'in değeri tüm uygulamaya sihirli biçimde yayılmaz. Tüketici, kendi bulunduğu dalda yukarı doğru bakar ve **en yakın** aynı Context Provider'ını kullanır. İç içe Provider'lar farklı alt alanlar için farklı değerler sunabilir:

```tsx
<LanguageContext.Provider value="tr">
  <Header />
  <LanguageContext.Provider value="en">
    <MovieDetails />
  </LanguageContext.Provider>
  <Footer />
</LanguageContext.Provider>
```

`MovieDetails`, içteki Provider nedeniyle `en` okur; `Header` ve `Footer` dıştaki Provider nedeniyle `tr` okur. Provider yalnızca altındaki ağacı kapsar. Bir bileşen kendi döndürdüğü Provider'ın değerini okuyamaz; kendi hook çağrısı Provider'ın altındaki ağaçta değildir.

| Ağaçtaki bileşen | En yakın Provider | Okuduğu değer |
|---|---|---|
| `Header` | Dıştaki | `tr` |
| `MovieDetails` | İçteki | `en` |
| `Footer` | Dıştaki | `tr` |
| Hiçbir Provider altında olmayan bileşen | Yok | Context'in varsayılanı |

Son satırdaki varsayılan değer, eşleşen Provider yokken kullanılır. Başlangıçta gerçek bir değer verilirse Provider'ı unutmak sessizce yanlış görünüm üretebilir. Bu nedenle ortak veride `null` kullanıp eksik Provider'ı açıkça bildirmek çoğu zaman daha güvenlidir.

## Eksik Provider'ı erken yakala

`null` başlangıç değerinin tipi, Context'in henüz bir gerçek değer almadığını söyler. Özel bir hook içine kontrol koyunca bütün tüketiciler aynı açık hatayı alır:

```tsx check
import { createContext, useContext } from 'react'

type Locale = 'tr' | 'en'
const LocaleContext = createContext<Locale | null>(null)

function useLocale(): Locale {
  const locale = useContext(LocaleContext)
  if (locale === null) {
    throw new Error('useLocale must be used inside LocaleContext.Provider')
  }
  return locale
}
```

Provider'ın dışında `useLocale()` çağırınca hata hemen o noktada anlaşılır. Kontrolden sonra TypeScript de `locale` değerinin `null` olamayacağını bilir; tüketen bileşen her kullanımda ayrı null kontrolü yapmak zorunda kalmaz.

:::mistake[Yanlış varsayılanı gerçekmiş gibi göstermek]
**Belirti:** Bir tüketici Provider'ın dışında da çalışıyor görünür ama beklenen değer değişmez. **Neden:** Sahte varsayılan, eksik Provider hatasını gizlemiştir. **Düzeltme:** `null` başlangıç değeri kullan; özel hook'ta Provider yoksa anlamlı hata fırlat.
:::

## Her prop için Context gerekmez

Yalnızca tek bir alt bileşene içerik taşımak istiyorsan **composition** (bileşenleri içerik olarak birleştirme) kullanabilirsin. Örneğin `PageLayout` hangi kullanıcı menüsünün çizileceğini bilmek zorunda değildir; üst bileşen hazır menüyü `children` ya da bir prop olarak verebilir.

```tsx
function PageLayout({ menu }: { menu: React.ReactNode }) {
  return <header>{menu}</header>
}

function App() {
  return <PageLayout menu={<UserMenu />} />
}
```

Bu örnekte `PageLayout` menünün iç yapısını ya da verisini taşımaz; yalnızca aldığı içeriği gösterir. Context'i, aynı ortak değeri ağaçta birbirinden ayrı birçok noktanın okuması gerektiğinde seçmek daha uygundur.

Context değerini değiştiğinde, o Context'i okuyan tüketiciler yeniden render olur. Bu yüzden tema gibi seyrek değişen ortak ayarlar için doğal bir araçtır. Saniyede defalarca değişen her veri için otomatik çözüm değildir; böyle bir durumda state'in nerede tutulması gerektiğini ve gerçekten hangi bileşenlerin güncellenmesi gerektiğini ayrıca düşün.

:::info[Derinlemesine (isteğe bağlı)]
React 19'da `<LanguageContext value="tr">` yazabilirsin; `<LanguageContext.Provider value="tr">` biçimi de geçerlidir. Provider her render'da yeni bir nesne üretirse değer kimliği değişebilir ve tüketiciler güncellenebilir; önce bu maliyeti ölç, sonra gerekirse değeri stabilize et veya farklı sıklıkta değişen verileri ayrı Context'lere ayır.
:::

## Özet

- Context, ortak değeri aradaki ilgisiz bileşenlere prop olarak taşıma gereğini azaltır.
- Provider altındaki tüketici değeri `useContext` ile okur; en yakın Provider kazanır.
- Provider değeri değişince o Context'i okuyan tüketiciler güncellenir.
- Birkaç prop geçişi veya tek bir alt bileşene içerik verme için props ve composition daha açık olabilir.
- `null` varsayılanı ve kontrol yapan özel hook, eksik Provider'ı sessiz hata yerine görünür hale getirir.

**Yeni terimler:**

- **Prop drilling:** Kullanmadığı halde ortak değeri alt bileşene geçirmek zorunda kalan ara bileşenler zinciri.
- **Context:** React ağacındaki alt bileşenlere ortak değer ulaştırma kanalı.
- **Provider:** Context'in değerini altındaki bileşenlere veren bileşen.
- **Composition:** Bileşenleri hazır içerik veya `children` vererek bir araya getirme.

**Kendini yokla:** İç içe iki `LanguageContext.Provider` varsa `MovieDetails` hangisini okur?

*Cevap:* Kendi dalındaki en yakın, yani içteki Provider'ın değerini.

**Kendini yokla:** Bir Context tüketicisi Provider dışında çalışıyorsa neden varsayılan olarak boş değer vermek yerine hata fırlatmak yararlı olabilir?

*Cevap:* Yanlış ağaç kurulumunu erken ve açık gösterir; sahte veriyle sessizce hatalı arayüz üretmesini önler.
