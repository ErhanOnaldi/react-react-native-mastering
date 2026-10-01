---
title: "Router kurulumu ve bağlantılar"
minutes: 15
kind: concept
---

# Router kurulumu ve bağlantılar

Bir React uygulamasında şu ana kadar bir component'i ekranda göstermek için JSX yazdın. Şimdi Sinema'nın `/` adresinde film listesini, `/genres` adresinde türleri göstermesini istiyoruz. Bunun için adres ile JSX'i eşleyen bir route kuracağız.

## İki adres, iki ekran

Bir **route**, bir adres desenini ekranda gösterilecek React içeriğine bağlar. Basit bir route nesnesinde `path` adresi, `element` ise o adres eşleşince gösterilecek JSX'i söyler. Örneğin `/` ana sayfaya, `/films` film listesine karşılık gelebilir.

React Router'ın **data mode** denilen kullanımında route'ları bir nesne listesi olarak tanımlar, sonra bu listeden browser router'ı oluşturursun. Buradaki “data” adı, bu yapının route'lara ait ek yetenekleri desteklediğini anlatır; bu başlangıçta ayrıca veri yükleme yazacağın anlamına gelmez.

Önce route listesini router'a bağla:

```tsx check
import { createBrowserRouter, type RouteObject } from 'react-router'
import { RouterProvider } from 'react-router/dom'
const sinemaRouteMap: RouteObject[] = [
  { path: '/', element: <h1>Sinema</h1> },
  { path: '/films', element: <h1>Filmler</h1> },
]
const router = createBrowserRouter(sinemaRouteMap)
export function App() { return <RouterProvider router={router} /> }
```

`createBrowserRouter` adres çubuğu ve tarayıcı history'siyle çalışan router nesnesini oluşturur. `RouterProvider`, bu router'ı React ağacına bağlar. Kullanıcı `/films` adresini açınca ikinci route eşleşir ve `Filmler` başlığı görünür. Router'ı `App` fonksiyonunun dışında bir kez oluşturuyoruz; böylece her render'da yepyeni bir router ve geçmiş oluşturulmaz.

`react-router` ve `react-router/dom` ifadeleri paketin **entry point**'leridir: paketten hangi dışa aktarımları alacağını belirleyen giriş yolları. Route oluşturma API'leri `react-router` içinden, React DOM için `RouterProvider` ise `react-router/dom` içinden gelir. Import yerini karıştırırsan editor ilgili export'u bulamayabilir.

![Data mode içinde rota tanımı, router ve React ekranı arasındaki akış](diagrams/route-akisi.svg)

## Kullanıcının seçebileceği bir adres ekle

Bir adresi bilmek ile kullanıcıya o adrese gidecek bir kontrol sunmak ayrı işlerdir. Önceden belli bir uygulama içi hedefe giden **link**, tıklanabilir adres olarak gösterilir. Router'ın `Link` bileşeniyle türler ekranına geçiş ekleyelim:

```tsx
import { createBrowserRouter, Link, type RouteObject } from 'react-router'
import { RouterProvider } from 'react-router/dom'

const sinemaRouteMap: RouteObject[] = [
  {
    path: '/',
    element: <main><h1>Sinema</h1><Link to="/genres">Türler</Link></main>,
  },
  { path: '/genres', element: <h1>Film türleri</h1> },
]

const router = createBrowserRouter(sinemaRouteMap)
```

Bu örnekte `Link` hedefi `/genres` olan gerçek bir bağlantıdır. Basınca adres değişir ve Router eşleşen route'un içeriğini gösterir; uygulama içi geçiş tüm belgeyi baştan yüklemez. Link olarak sunulması, kullanıcının adresi kopyalayıp yeni sekmede açabilmesini ve klavyeyle kullanabilmesini de sağlar.

## Hangi menü öğesi etkin?

Bir menüde kullanıcıya hem hedefi vermek hem de bulunduğu sayfayı göstermek isteyebilirsin. `NavLink`, `Link` gibi navigasyon yapar ve adresiyle eşleştiğinde etkin durumunu da bildirir. Şimdi ana sayfa ve türler sayfası için bir menü düşün:

```tsx
import { NavLink } from 'react-router'

function SinemaMenu() {
  return (
    <nav aria-label="Sinema">
      <NavLink to="/" end>Ana sayfa</NavLink>
      <NavLink to="/genres">Türler</NavLink>
    </nav>
  )
}
```

`NavLink` etkin olduğunda `aria-current="page"` niteliğini sağlar; bunu stillerle görünür yapabilirsin. `end`, ana sayfa adresinin tam eşleşmesini ister. Bunu koymazsan `/` ile başlayan `/genres` adresinde de Ana sayfa etkin görünebilir.

Sinema'da ana sayfadan türlere geçtiğini adım adım izleyelim:

| Sıra | Ne olur? | Ekrandaki sonuç |
| --- | --- | --- |
| 1 | Tarayıcı `/` adresindedir | Ana sayfa route'u eşleşir |
| 2 | Kullanıcı `Türler` `NavLink`'ini seçer | Router hedef `/genres` adresini alır |
| 3 | Router yeni adresi history'ye ekler | Geri tuşu `/` adresine dönebilir |
| 4 | `/genres` route'u eşleşir | Film türleri görünür, Türler etkin olur |
| 5 | Kullanıcı sayfayı yeniler | Adres `/genres` kalır ve aynı route seçilir |

Bu akışta tıklama, adres değişimi ve içerik seçimi birbiri ardına gelir. `NavLink` etkinliği mevcut adresten hesaplandığı için ayrıca `isGenresPage` gibi bir state tutman gerekmez. Aynı bilgiyi ikinci kez state'te saklamak, adres değiştiğinde menünün güncel kalmaması riskini yaratır.

## Route eşleşmesi nasıl okunur?

Route listesi bir ekran haritasıdır. Router geçerli adresi bu haritayla karşılaştırır ve uyan içeriği seçer; listenin ilk öğesini körü körüne açmaz. Bir adresin hiçbir route'a uymadığı duruma hazırlık için `*` desenini kullanabilirsin. Bu **wildcard**, geriye kalan ve başka bir route ile eşleşmeyen adresleri yakalayan özel desendir.

```tsx
const sinemaRouteMap: RouteObject[] = [
  { path: '/', element: <h1>Sinema</h1> },
  { path: '/genres', element: <h1>Türler</h1> },
  { path: '*', element: <h1>Bu sayfa bulunamadı</h1> },
]
```

`/genres` ikinci içeriği gösterir; `/unknown` ise bilinen iki yola uymadığı için wildcard içeriğine düşer. Wildcard'ı burada basit bir bulunamadı ekranı olarak kullanıyoruz. Daha sonra 404 ile route çalışırken oluşan hatanın farklı durumlar olduğunu ayıracağız.

Bu örneklerde route'ları dizi olarak yazdık. `RouteObject[]` TypeScript'e her elemanın route tanımına uyması gerektiğini söyler; yanlış bir property adı yazarsan hata editörde görünür. Rota ağacını tek yerde tutmak hem adres haritasını okumayı hem de aynı tanımları farklı ortamlarda kullanmayı kolaylaştırır.

## Takıldığında önce import yoluna bak

Belirti: `RouterProvider` için “export bulunamadı” hatası görüyorsun. Genellikle DOM sağlayıcısını `react-router` içinden almaya çalışmışsındır. `RouterProvider`'ı `react-router/dom`'dan, `createBrowserRouter`, `Link`, `NavLink` ve `RouteObject` gibi route API'lerini `react-router`'dan import et.

Bir başka gerçek belirti, her render sonrası navigasyon geçmişinin sıfırlanmasıdır. Router'ı component içinde oluşturduysan her render'da yeni bir router yaratılıyor olabilir. Router'ı component'in dışında, modül seviyesinde oluştur ve `RouterProvider`'a prop olarak ver.

## Kısa zihinsel model

Route listesi adres haritasıdır, router bu haritayı geçerli adresle karşılaştırır, `RouterProvider` sonucu React uygulamasına verir. Kullanıcının seçebileceği bilinen bir hedefi `Link` ile sunarsın; menüde etkin adres de gerekiyorsa `NavLink` seçersin. Bunların hepsi tarayıcı adresiyle çalışan data mode kurulumunun parçalarıdır.

## Özet

- `RouteObject` içindeki `path` adresi, `element` eşleşince gösterilecek içeriği belirtir.
- `createBrowserRouter` route listesinden router'ı oluşturur; `RouterProvider` onu React ağacına bağlar.
- Route API'leri `react-router`, DOM `RouterProvider` `react-router/dom` entry point'inden gelir.
- `Link` bilinen hedefe gider; `NavLink` buna ek olarak etkin adres durumunu verir.
- `*` wildcard, başka bir route ile eşleşmeyen adresi yakalayabilir.

**Yeni terimler**

- **Data mode:** Route'ları nesne ağacıyla tanımlayıp browser router'a verdiğin React Router kullanımı.
- **Entry point:** Bir paketin belirli dışa aktarımlarını aldığın giriş yolu.
- **Link / NavLink:** Uygulama içi adrese giden bileşenler; `NavLink` ayrıca etkin adresi bildirir.
- **Wildcard:** Diğer desenlerle eşleşmeyen adresleri yakalayan `*` route deseni.

**Kendini yokla:** `/genres` açıkken neden ana sayfa `NavLink`'inde `end` kullanılır?

**Cevap:** `/` adresinin başlangıç öneki olarak alt yollarla da eşleşmesini önleyip ana sayfayı yalnızca tam `/` adresinde etkin tutar.

**Kendini yokla:** Kullanıcı `/unknown` adresini açarsa `*` route'u ne yapabilir?

**Cevap:** Daha belirgin bir route eşleşmediği için bilinmeyen adres için belirlediğin içeriği gösterebilir.
