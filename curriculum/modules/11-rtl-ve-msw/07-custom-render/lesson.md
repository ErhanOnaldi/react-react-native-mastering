---
title: "Router ve provider ile render"
minutes: 14
kind: concept
---

# Router ve provider ile render

:::pain[Problem]
`useParams()` kullanan etkinlik sayfasını tek başına render edince URL parametresi boş. İkinci testte `<Link>` “router context yok” hatası veriyor. Her testte RouterProvider’ı elle kurunca aynı 15 satırlık düzen kopyalanıyor ve başlangıç URL’ini değiştirmek zahmetli oluyor.
:::

## Bileşenin ihtiyaç duyduğu ortamı testte kur

RTL `render` ile component’i DOM’a koyar; uygulama çevresindeki context’leri kendiliğinden kurmaz. `useParams`, `Link`, `useNavigate` gibi Router’a bağlı bileşenleri sınamak için bir router ve eşleşen route gerekir. Aynı şekilde Context kullanan UI’ın doğru değer alması için ilgili Provider test ağacında bulunmalıdır.

Router yardımcı fonksiyonunun amacı router’ı gizlemek değildir. Her testte tekrarlanan kurulum ayrıntısını tek yere taşır, başlangıç adresini parametre olarak açık bırakır ve gerekirse oluşan router nesnesini döndürür. Böylece test hem DOM’u hem URL state’ini gözleyebilir.

Kesin kurallar:

1. **Yalnız gereken Provider’ı sar.** Component hangi Context veya router API’sine gerçekten ihtiyaç duyuyorsa onu ekle; test ortamını tüm uygulamanın kopyasına dönüştürme.
2. **Router’ı bellekte başlat.** `createMemoryRouter` browser adres çubuğunu değiştirmeden test başlangıç URL’ini ve geçmişini kurar.
3. **Route path ile initial route’u ayır.** `path: '/event/:eventId'`, eşleşme kuralıdır; `initialEntries: ['/event/47']`, testin açtığı adrestir.
4. **Helper’ı uygulama davranışına göre şekillendir.** Testlerin router state’ine ihtiyacı varsa router’ı render sonucuyla birlikte döndür.
5. **RouterProvider’ı DOM uyumlu giriş noktasından render et.** Güncel Router paketindeki DOM provider export’unu kullan; aynı sürüm API’sini araştırma notundan doğrula.
6. **Provider değerini testin kontrolünde tut.** Sabit test değeri ve açık initial URL, testleri birbirinden bağımsız kılar.

Bu ders 6. modüldeki `url-state` modelini tekrar kurmaz. O derste URL’i paylaşılabilir state kaynağı olarak gördün. Burada test, o URL’i memory router’ın başlangıç konumuna çevirir ve component’in URL’le kurduğu ilişkiyi gerçek Router bağlamında çalıştırır.

## Route parametresinden ekrana kadar izle

Bir etkinlik ayrıntı bileşeni `eventId` parametresini başlık olarak gösteriyor olsun. Akış:

| Adım | Router bilgisi | Component sonucu |
|---|---|---|
| 1 | `path: '/events/:eventId'` | `eventId` parametresinin hangi segmentte olduğunu tanımlar |
| 2 | `initialEntries: ['/events/47']` | Bellek router’ı bu URL ile açılır |
| 3 | Router route’u eşleştirir | `eventId` değeri string `'47'` olur |
| 4 | RouterProvider component’i render eder | `useParams()` route bağlamından `'47'` okur |
| 5 | Component `<h1>` üretir | Ekranda `Etkinlik 47` görünür |
| 6 | Test rol/ad sorgular | Görünür başlık ve gerekiyorsa `router.state.location` doğrulanır |

Link testi de yalnızca `href` değerini okumak zorunda değildir. Link’e kullanıcı gibi tıkla ve beklenen sayfanın başlığını veya router state’ini doğrula. Böylece route eşleşmesi, navigasyon ve görünür sonuç aynı sınırda çalışır.

## Tekrarlanan kurulum, sonra helper

Kırık yaklaşımda her test kendisi route, memory history ve provider kurar:

```tsx
// Tekrarı artırır; test URL'i ile route tablosu kolay karışır.
const router = createMemoryRouter(routes, { initialEntries: ['/events/47'] })
render(<RouterProvider router={router} />)
```

Küçük bir helper aynı adımları toplar; testin niyeti route ve initial URL üzerinden okunur:

```tsx check
import type { ReactNode } from 'react'
import { render } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import type { RouteObject } from 'react-router'
import { RouterProvider } from 'react-router/dom'

export function renderWithRoutes(routes: RouteObject[], initialRoute: string) {
  const router = createMemoryRouter(routes, { initialEntries: [initialRoute] })
  const result = render(<RouterProvider router={router} />)
  return { router, ...result }
}

export function renderWithPage(page: ReactNode, initialRoute: string) {
  return renderWithRoutes([{ path: '*', element: page }], initialRoute)
}
```

Bu iki fonksiyon farklı public kullanımları ayırıyor: route tablosu ile parametreli ekran, tek bir sayfa ile router’a ihtiyaç duyan component. Bir projede `renderWithRouter(ui, options)` gibi tek overload da seçilebilir; TypeScript union’ını daraltma ve UI/route ayrımı anlaşılır kalmalıdır. Helper’ı yalnızca gerçekten tekrar eden kurulum varsa ekle. Tek bir test için soyutlama yapmak, davranışı takip etmeyi zorlaştırabilir.

## Provider’ları birlikte kur, ama sırala

Bir sayfa Router, QueryClient ve Theme Provider istiyorsa test helper’ı Provider’ları tek ağaçta kurabilir. Her ek Provider’ın bir amacı olsun. Örneğin QueryClientProvider için test başına yeni client üretmek cache’in testler arasında sızmasını engeller. Router her testte kendi initial route’unu alır. Theme sabitse helper’ın varsayılanı olabilir; değişen değer test parametresidir.

Provider yığını, testin görünür arayüzüne etki etmelidir. `renderWithProviders` helper’ına her gelecek kütüphaneyi şimdiden eklemek gereksiz bakım yaratır. Yeni bir provider’a ihtiyaç çıktığında, birden çok testin kurulum tekrarını görüp eklemek daha anlaşılırdır. Test helper’ı uygulama bileşenlerinin davranışını yeniden yazmamalı; yalnız test ortamını kurmalıdır.

:::model[URL state]
URL, paylaşılabilir ve yenilemeden sonra korunabilir state’in kaynağıdır. Testte `initialEntries` ile URL’i kurarsın; route eşleşmesi parametre veya search paramı component’e verir. Burada değişen yalnızca URL state’in gerçek browser yerine memory router’da tutulmasıdır.
:::

![URL state ile route eşleşmesi ve içerik arasındaki bağ](diagram:url-state)

:::mistake[Belirti: `useParams` undefined]
Belirti → Başlıkta `undefined` görünür.  
Neden → Route path parametre tanımlamıyor, initial URL eşleşmiyor ya da component provider dışında render edildi.  
Düzeltme → `:eventId` path segmentini ve `/events/47` girişini eşleştir; component’i RouterProvider içinde render et.
:::

:::mistake[Belirti: Link testi context hatası veriyor]
Belirti → “useNavigate may be used only in a Router” benzeri hata.  
Neden → Link veya kullandığı hook router context’siz çalışıyor.  
Düzeltme → Memory router kur ve `RouterProvider` ile component’i sar.
:::

:::mistake[Belirti: Testler bir öncekinin URL’ini kullanıyor]
Belirti → Route testi tek başına geçiyor, tüm suite’de başka sayfada başlıyor.  
Neden → Router örneği testler arasında paylaşılıyor.  
Düzeltme → Her render’da yeni memory router oluştur; stateful router nesnesini testler arasında saklama.
:::

## Tek component mi, gerçek route tablosu mu?

Bir component `useParams` kullanıyorsa, yalnız `path` ve `route` değerlerini bilmek yetmez; bu component’i içeren route kaydını da kurmak gerekir. Helper tek bir path kabul ediyorsa bunu component’in route’u olarak `element` alanına bağlar. Bir Link’in başka sayfaya gittiğini test edeceksen yalnız hedef route’u da eklemelisin; aksi halde memory router hedefi bulamaz ve test route error ekranını gösterir. Bu durumda bir route tablosu alanı alan helper daha kullanışlıdır.

`renderWithRouter(ui, options)` gibi tek bir arayüz iki ayrı biçim alıyorsa TypeScript union’ını açık yaz. Örneğin `ui: ReactNode | RouteObject[]` kabul edilir; `Array.isArray(ui)` ile dizi yolu ayrılır. Bu tasarımda dizi, eksiksiz route tablosudur; React element ise wildcard route içine konur. İki şeklin anlamını örtük bırakma. Çağrı yerinde `{ path, route }` gibi gereksiz ikinci kaynaklar kabul edilirse çelişkili başlangıçlar oluşabilir.

Router nesnesi döndürmek her testte zorunlu değildir. Test yalnız DOM’daki heading’i doğrulayacaksa render sonucu yeterli olur. Navigasyon sonrası `router.state.location.pathname` gibi URL davranışı ürün gereksinimiyse router’ı döndürmek bu gözlemi sağlar. Fakat yalnız DOM’da “Arama” başlığı görünüyorsa çoğu zaman bu yeterli bir davranış kanıtıdır; implementation detayını ayrıca assert ederek testi fazla daraltma.

Wrapper’ların yeniden kullanılabilirliği de sınır ister. `renderWithProviders` içine tüm uygulama setup’ını koyarsan basit bir component testi bile router, Query, theme ve auth context’i almak zorunda kalabilir. İsteğe bağlı `route` ya da `queryClient` parametresi yararlı olabilir, fakat default’ları deterministik olmalı. Testin gerçekten farklı değere ihtiyacı yoksa her senaryoda konfigürasyon gürültüsü ekleme.

Bir helper’a testlerde kullanılan varsayılan query string’i, server state’i veya özel bir rol adı sabitlemek doğru değildir. Bunlar her senaryoda açıkça belirtilmelidir. Helper çevreyi kurar; test verisini ve kullanıcının açtığı sayfayı değil.

:::sector
Uygulama ekipleri router/provider render helper’larını ortak test altyapısında tutar. Helper, varsayılan başlangıç URL’ini ve gerekiyorsa `router` nesnesini sunar; özel route senaryoları testte açık kalır. Bu denge kurulum tekrarını azaltırken testin hangi sayfayı açtığını görünür bırakır.
:::

## Özet

- RTL component’i render eder; Router ve Context Provider’larını sen kurarsın.
- Memory router URL state’i tarayıcı adres çubuğu olmadan sınar.
- Route path eşleşme kalıbı, initial route test girdisidir.
- Helper tekrarı azaltmalı; gerçek davranışı veya uygulama mantığını gizlememelidir.
- Router örneğini test başına yenile, gerekiyorsa sonucu dışarı döndür.

**Kendini yokla:** `/events/:eventId` ve `/events/47` arasındaki fark nedir?  
*Cevap:* İlki route kalıbı, ikincisi testte açılan gerçek başlangıç URL’idir.

**Kendini yokla:** Router helper’ı neden router nesnesini de döndürebilir?  
*Cevap:* Navigasyon sonrası location state’i DOM sonucuna ek olarak doğrulanabilir.
