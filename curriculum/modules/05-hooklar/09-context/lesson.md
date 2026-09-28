---
title: "Dört kat aşağı inen veri ve Context"
minutes: 14
kind: concept
---

# Dört kat aşağı inen veri ve Context

:::pain[Problem]
Karanlık/Aydınlık tema seçimi `App` bileşeninde tutuluyor. Sayfanın en derinindeki kullanıcı menüsünde bir tema değiştirme butonu, kartlarda ise tema renkleri gerekiyor. Aradaki dört ara bileşen (`App → Shell → MainLayout → Header → ThemeToggle`) tema bilgisini zerre kadar kullanmadığı halde sırf taşımak için prop zinciri oluşturuyor. Bir prop adı değiştiğinde aradaki tüm bileşenler kırılıyor.
:::

## Context yayılım modeli

Normalde React'te veri akışı yukarıdan aşağıya `props` ile ilerler. Ancak bazı veriler (tema tercihi, kullanıcı oturumu, dil seçimi gibi) uygulamanın hemen her köşesinde gereklidir. Bu verileri aradaki ilgisiz bileşenlerin içinden geçirmeye **prop drilling** denir.

**Context API**, bir ağacın tepesindeki bir sağlayıcıdan (Provider) aşağıdaki tüm tüketicilere (Consumers), aradaki bileşenleri hiç rahatsız etmeden doğrudan veri ulaştırmayı sağlar.

![Provider değeri değişince tüketicilere yayılan context güncellemesi](diagram:context-yayilimi)

Kesin kurallar:

1. **Provider kapsamı belirler:** Bir verinin ağacın hangi dalında geçerli olduğunu Provider bileşeni belirler.
2. **Hook ile tüketim:** Tüketici bileşenler değeri `useContext` veya bunu saran güvenli bir custom hook ile okur.
3. **Sessiz varsayılan değer tuzağıdır:** `createContext`'e sahte bir varsayılan değer vermek, sağlayıcı (provider) unutulduğunda hatayı gizler.
4. **Güvenli sınır: Nullable Context:** Context'i `createContext<T | null>(null)` ile başlatıp, saran custom hook içinde `null` kontrolü yaparak sert hata fırlatmak en iyi endüstri pratiğidir.
5. **Context küresel önbellek değildir:** Sık sık değişen karmaşık veriler veya sunucu önbelleği için Context tek başına yeterli değildir; çünkü provider değeri her değiştiğinde bu context'i okuyan **tüm tüketiciler yeniden render edilir**.
6. **React 19 sözdizimi:** React 19'da `<ThemeContext value={...}>` yazımı doğrudan desteklenir; geleneksel `<ThemeContext.Provider value={...}>` yazımı da tamamen geçerlidir.

:::model[Veri akışı]
Prop'lar hâlâ React'in en şeffaf, en takip edilebilir veri taşıma yoludur. Yalnızca bir alt bileşene buton aktarmak istiyorsan önce component composition (`children`) düşün. Alt ağacın birbirinden bağımsız birçok farklı noktasında aynı ortak duruma anlık ihtiyaç varsa Context'e geç.
:::

## Prop drilling zincirini kıyaslayalım

Geleneksel prop zincirinde ara bileşenler sadece kuryelik yapar:

```text
App (tema burada)
└─ Shell (prop taşır)
   └─ MainLayout (prop taşır)
      └─ Header (prop taşır)
         └─ ThemeToggle (temayı kullanır ve değiştirir)
```

Context Provider kurulduğunda zincir kırılır:

```text
ThemeProvider (Provider sınırı)
└─ App
   └─ Shell
      └─ MainLayout
         └─ Header
            └─ ThemeToggle ───► useTheme() doğrudan okur!
```

`Shell`, `MainLayout` ve `Header` bileşenleri artık tema prop'undan tamamen kurtulur; kodları temizlenir ve bağımsızlaşır.

## Kırık yaklaşım: Sessiz varsayılan değer

```tsx
// TEHLİKE: Sahte varsayılan değer vermek
const ThemeContext = createContext<{ theme: string }>({ theme: 'dark' })

export function useTheme() {
  return useContext(ThemeContext)
}
```

Bu kodda bir geliştirici `ThemeProvider` sarmalamasını unuttuğunda React hiçbir hata fırlatmaz. Butonlar tıklandığında tema değişmez ama uygulama "çalışıyor" gibi görünür. Geliştirici hatanın kaynağını saatlerce aramak zorunda kalır.

## Doğru yaklaşım: Tipli Context ve sert hata sınırı

Context'i `null` ile başlatıp özel bir custom hook ile sarmalıyoruz:

```tsx check
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  toggleTheme: () => void
}

// 1. Context'i null başlatarak tipini kilitliyoruz:
const ThemeContext = createContext<ThemeContextValue | null>(null)

// 2. Provider bileşeni:
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// 3. Güvenli Tüketici Hook'u:
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
```

### Neden bu desen bu kadar güçlüdür?
- **TypeScript güvencesi:** `useTheme()` fonksiyonunun dönüş tipi `ThemeContextValue | null` değil, kesin olarak `ThemeContextValue`'dur. Tüketici bileşende asla `context?.theme` şeklinde null kontrolü yapmak zorunda kalmazsın.
- **Erken uyarı sistemi:** Eğer bir bileşen `ThemeProvider` ağacının dışında çağrılırsa uygulama o anda açık ve net bir hata fırlatır: `"useTheme must be used within a ThemeProvider"`. Hatanın nerede olduğu anında anlaşılır.

## Tüketici bileşende kullanım

Artık ağacın neresinde olursa olsun bir buton temayı tek satırda değiştirebilir:

```tsx
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button type="button" onClick={toggleTheme}>
      Mevcut tema: {theme === 'dark' ? 'Karanlık' : 'Aydınlık'}
    </button>
  )
}
```

## Context ne zaman gereksizdir? (Composition alternatifi)

Context güçlü bir araçtır ancak her prop geçişinde Context'e sarılmak mimariyi hantallaştırır. Yalnızca tek bir bileşeni birkaç kat aşağı indirmek istiyorsan, **bileşen kompozisyonu** (`children` veya slot) çoğunlukla daha temizdir:

```tsx
// Context yerine Composition:
function PageLayout({ userMenu }: { userMenu: ReactNode }) {
  return (
    <div className="layout">
      <header>{userMenu}</header>
      <main>İçerik</main>
    </div>
  )
}

// App seviyesinde doğrudan vermek:
function App() {
  return <PageLayout userMenu={<UserMenu user={currentUser} />} />
}
```

Burada `PageLayout` aradaki bir kurye olmaktan çıkar; `UserMenu`'ye prop doğrudan en tepeden aktarılır.

## Context yayılımının performans maliyeti

Bir Context'in `value` değeri değiştiğinde, o Context'i okuyan (`useTheme` çağıran) tüm bileşenler istisnasız yeniden render edilir.

Bu yüzden:
- **İlgisiz verileri aynı Context'te birleştirme:** Örneğin `UserAuthContext` ile `ThemeContext`'i tek bir devasa context yaparsan; kullanıcı tema değiştirdiğinde oturumla ilgili tüm bileşenler gereksiz yere render edilir.
- **Provider değerini stabil tut:** Provider içinde nesne oluştururken gereksiz referans değişimlerinden kaçın.

## Provider sınırında değerin izini sürelim

Context bir değişkenin uygulamanın her yerine sihirli biçimde kopyalanması değildir. React tüketici bileşenin bulunduğu ağaç dalında en yakın üst Provider'ı bulur. Aynı Context için iç içe iki Provider varsa, içteki Provider altındaki tüketiciler iç değeri okur; kardeş dal ise dış değeri okumaya devam eder.

| Ağaç noktası | En yakın Provider | useContext sonucu |
|---|---|---|
| Header, üst Provider altında | App | App'in değeri |
| Preview, iç Provider altında | Preview | Preview'in değeri |
| Footer, iç Provider'ın dışında | App | App'in değeri |
| Provider ağacının dışı | yok | createContext varsayılanı |

Son satırdaki varsayılan yalnızca hiçbir eşleşen Provider bulunamadığında kullanılır. Bu nedenle null başlangıç değeri ve açık hata veren hook, yanlış ağacı sessizce çalıştırmak yerine sorunu ilk tüketimde gösterir. Provider'ı tüketicinin kendisiyle aynı seviyeye koyarsan o bileşen kendi Provider değerini okuyamaz; Provider yalnızca altındaki render ağacını kapsar.

Value karşılaştırması referans üzerinden yapılır. Provider her render'da yeni bir nesne üretirse, alanlar aynı görünse bile referans değişebilir ve tüketiciler güncellenir. Önce gerçek güncelleme sıklığını ölç; sonra value nesnesini gerekli olduğunda stabilize et veya sık değişen state ile seyrek değişen komutları ayrı Context'lere böl. Bu, yeniden render'ı sihirli biçimde yok etmez; hangi tüketicinin hangi değişikliği dinlediğini sınırlar.

:::mistake[Provider'ı tüketen bileşenin içine koymak]
**Belirti:** Bileşen Provider eklediği halde varsayılan değeri okumaya devam ediyor. **Neden:** Bileşenin kendi hook çağrısı, döndürdüğü Provider'ın alt ağacında değildir. **Düzeltme:** Provider'ı tüketici bileşenin üst ebeveynine taşı; tüketici yalnızca altındaki değeri okuyabilir.
:::

## Sınır durumları ve sık hatalar

:::mistake[Sık hata: Provider dışında hook çağrıldığında sessizce null dönmek]
Belirti → Bileşen içinde `const theme = useTheme()` yazıldığında `theme.toggleTheme` undefined hatasıyla patlıyor.  
Neden → Custom hook içinde hata fırlatılmamış, `null` döndürülmüş.  
Düzeltme → `if (context === null) throw new Error(...)` yazarak geliştiriciyi doğrudan eksik Provider konusunda bilgilendir.
:::

:::mistake[Sık hata: Provider'ı ağacın çok aşağısına koymak]
Belirti → Header içindeki bileşen Provider'ı bulamıyor ve hata veriyor.  
Neden → Provider yalnızca `Main` alanını sarmalamış, `Header` dışarıda kalmış.  
Düzeltme → Ortak veriyi tüketecek tüm bileşenleri kapsayan en yakın ortak üst ebeveyne (genelde `App` veya `RootLayout`) Provider'ı yerleştir.
:::

:::mistake[Sık hata: Yüksek frekanslı verileri Context ile yönetmek]
Belirti → Fare hareketi veya klavye girişi sırasında tüm sayfanın donması.  
Neden → Saniyede 60 kez değişen fare koordinatları bir Context'e yazılmış; her koordinat değişiminde yüzlerce bileşen render oluyor.  
Düzeltme → Yüksek frekanslı veri akışları için yerel state, ref veya özel state yönetim kütüphaneleri (Zustand, Redux) tercih edilmelidir.
:::

:::sector
Endüstriyel React projelerinde Context API'nin en yaygın kullanım alanları şunlardır:
1. **Tema sağlayıcıları** (Aydınlık / Karanlık mod).
2. **Kimlik doğrulama oturumu** (Giriş yapmış kullanıcı bilgileri).
3. **Uluslararasılaştırma ve Dil (i18n)** (Aktif dil ve çeviri sözlüğü).
4. **Toast / Bildirim sistemleri** (Ekranın köşesinde açılan geçici bildirim kuyruğu).
Bunun dışındaki karmaşık sunucu verileri için modern ekipler TanStack Query gibi araçları tercih eder.
:::

## Özet

- Context, prop drilling acısını ortadan kaldırarak ağacın derinliklerine doğrudan veri ulaştırır.
- `createContext<T | null>(null)` ve null kontrolü yapan özel hook deseni tip güvenliği ve erken hata tespiti sağlar.
- Yalnızca tek bir bileşeni derine taşımak için Context yerine `children` (composition) tercih edilmelidir.
- Provider değeri her değiştiğinde o context'i dinleyen tüm tüketiciler yeniden render olur; bu nedenle farklı alanlar için ayrı bağımsız context'ler açılmalıdır.
- React 19 ile birlikte `<Context value={...}>` sözdizimi doğrudan kullanılabilir.

**Kendini yokla:** `createContext`'e sahte bir varsayılan değer vermek neden önerilmez?  
*Cevap:* Çünkü Provider bileşeni ağaçta unutulduğunda uygulama hata vermez; sahte değerle sessizce yanlış davranarak hatanın tespit edilmesini zorlaştırır.

**Kendini yokla:** Tema Context'i ile Oturum (Auth) Context'i neden aynı Provider'da birleştirilmemelidir?  
*Cevap:* Çünkü kullanıcı tema değiştirdiğinde, aynı context içindeki oturum verisini dinleyen tüm ilgisiz bileşenler de gereksiz yere yeniden render edilir.
