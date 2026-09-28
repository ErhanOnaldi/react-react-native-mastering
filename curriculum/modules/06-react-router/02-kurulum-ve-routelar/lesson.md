---
title: "Router kurulumu ve bağlantılar"
minutes: 13
kind: concept
---

# Router kurulumu ve bağlantılar

:::pain[Problem]
Sinema ana sayfasındaki “Ara” düğmesi `setPage('search')` çağırıyor. Arama ekranı açılıyor ama adres `/` kalıyor; yenileyince arama kayboluyor. Kullanıcı gördüğü ekranın bağlantısını kopyalayamıyor.
:::

## Route ağacının işi

Route, adresin hangi React içeriğini açacağını belirleyen eşlemedir. `/` için ana sayfa, `/search` için arama ekranı tanımlarsın; router mevcut adresi bu eşlemelerle karşılaştırır ve doğru içeriği gösterir. Tanımlar bir ağaç veya liste biçiminde tek yerde toplandığı için uygulamanın sayfa haritası okunabilir olur.

Bu modülde React Router 8'in **data mode** API'sini kullanıyoruz. Tarayıcıda `createBrowserRouter` gerçek adres çubuğu ve history ile çalışan router'ı oluşturur; `RouterProvider` React ağacına bu router'ın sonucunu sunar. Bu ayrım önemlidir: route ağacı navigasyon altyapısıdır, `RouterProvider` ise onu uygulama ekranına bağlayan React sınırıdır.

![Data mode içinde rota tanımı, router ve React ekranı arasındaki akış](diagrams/route-akisi.svg)

1. **Route nesnesi adres desenini ve içeriğini tarif eder.** Basit bir route `path` ile eşleşecek adresi, `element` ile render edilecek JSX'i taşır.
2. **Router mevcut adresi route ağacında çözer.** `/search` için eşleşen route bulunur; eşleşme yoksa daha sonra tanımlayacağımız yakalama yolu kullanılabilir.
3. **Provider sonucu React ağacına bağlar.** `RouterProvider` route ağacının dışına konur; uygulamadaki route bileşenleri ancak bu router context'i altında çalışır.
4. **Router'ı render sırasında tekrar oluşturma.** Router'ı modül seviyesinde bir kez kur. Her render'da yeni history/router üretmek uygulamanın navigasyon sürekliliğini bozar ve gereksiz nesneler oluşturur.
5. **Bir adresi kullanıcı bağlantısı olarak göster.** Önceden belli hedefe giden link, düğme görünümü alsa bile bağlantı olmalıdır. Router linki uygulama içi geçiş yaparken tam sayfa yüklemesini önler ve tarayıcıya normal link davranışını korur.

React Router 8'de route tanımları ve bileşenler `react-router` paketinden gelir. DOM sağlayıcısı `RouterProvider` ise `react-router/dom` girişinden import edilir. Eski `react-router-dom` import örneklerini bu projede kullanma. Bu API ayrımı yeni bir davranış değil; doğru entry point'ten tip ve fonksiyon almanı sağlayan paket sözleşmesidir.

## Boş eşlemeden çalışan adrese

Önce sorunlu davranışa bak. Aşağıdaki kod ekranda sayfa seçebilir ama tarayıcı geçmişini güncellemez:

```tsx
function QuickNavigation() {
  const [page, setPage] = useState<'home' | 'search'>('home')
  return <button onClick={() => setPage('search')}>Ara</button>
}
```

`setPage` React bileşenini yeniden render eder. Buna rağmen adres çubuğu, history kayıtları ve doğrudan açılacak `/search` yolu değişmez. Ekranların ayrı adresleri olması için `path` eşlemesini ve kullanıcı linkini kur:

```tsx check
import { createBrowserRouter, Link, type RouteObject } from 'react-router'
import { RouterProvider } from 'react-router/dom'

const libraryRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <main>
        <h1>Kitaplık</h1>
        <Link to="/shelf">Rafı aç</Link>
      </main>
    ),
  },
  { path: '/shelf', element: <h1>Okuma rafı</h1> },
]

const router = createBrowserRouter(libraryRoutes)

export function App() {
  return <RouterProvider router={router} />
}
```

Burada `libraryRoutes` ve `router` component gövdesinin dışında durur. Kullanıcı “Rafı aç” bağlantısına basınca `/shelf` geçmişe girer ve eşleşen başlık görünür. Bir route'u doğrudan `/shelf` ile açmak da aynı ekrana ulaşır; daha sonra layout eklediğinde içerik yine route ağacından gelir.

## Geçişi zaman sırasıyla izleyelim

Başlangıç adresinin `/` olduğunu varsayalım. Route listesinde `/` ile eşleşen ilk içerik “Kitaplık” başlığını üretir. Bağlantıya tıklanınca şu olaylar sırayla gerçekleşir:

| Sıra | Olay | Sonuç |
| --- | --- | --- |
| 1 | Kullanıcı gerçek `Link` öğesini etkinleştirir | Router hedef `/shelf` değerini alır |
| 2 | Router history'ye yeni konum ekler | Geri tuşunun dönebileceği önceki `/` kaydı kalır |
| 3 | Yeni konum route listesiyle eşleşir | `/shelf` route'u seçilir |
| 4 | Eşleşen React içeriği render edilir | “Okuma rafı” başlığı görünür |
| 5 | Kullanıcı yeniler | Adres hâlâ `/shelf`; sunucu uygulama girişini veriyorsa aynı route yeniden kurulur |

Son satırın iki tarafı vardır. React Router istemci tarafında route'u eşler; web sunucusu ise derin adresin dosya sistemi yolu olmadığını bilmelidir. Üretim yayını SPA fallback sunmuyorsa yenilemede sunucu 404 döndürebilir. Bu, route ağacındaki bir eşleşme hatası değil, yayın sunucusu yapılandırmasıdır.

## Route tanımının parçaları

Route nesnesi bir path'ten daha fazlası olabilir. `element` render edilecek React ağacını taşır; `children` iç içe route'ları tanımlar; `index` parent path'in kendisi açıldığında gösterilecek varsayılan child'ı belirtir. `lazy` gibi daha sonra kullanacağımız alanlar da route nesnesinin parçasıdır. Her alanı başlangıçta doldurman gerekmez; ekrandaki davranışa ihtiyaç doğduğunda ekle.

Route eşleşmesi string karşılaştırması gibi tek bir `if` değildir. Router, sabit ve dinamik segmentleri, iç içe yolları ve wildcard gibi kapsayıcı desenleri route ağacına göre değerlendirir. `/books/:id` aynı bileşeni birçok kitap için kullanabilir. Birbirine benzeyen path'ler varsa daha belirgin eşleşme seçilir; bu nedenle genel bir `*` route'u belirli route'lardan önce ele alacak şekilde düşünmek yerine route ağacının altındaki yakalama rolünde konumlandır.

Data mode'u burada seçmemizin nedeni `createBrowserRouter` ile bir route nesnesi ağacı kurmasıdır. Data mode `loader`, `action`, `errorElement` ve navigasyon durumu gibi route düzeyinde yetenekler sunar. Ancak bu modüllerde sayfa verisini statik listeden okuyacağız; `loader` yazmak zorunda değilsin. Router'ı data mode'da kurmak, bütün veri çekme işini Router'a taşımak demek değildir.

Uygulama küçük olsa bile route dizisini ayrı bir değişkende tutmak yararlıdır. Aynı rota ağacı daha sonra tarayıcı router'ına ve bellek router'ına verilebilir. Böylece testlerde farklı bir route kopyası oluşturmazsın; ürünün adres sözleşmesi tek kaynaktan okunur. Route array içindeki öğelerin tipi `RouteObject[]` olarak belirtilince yanlış alan adları ve geçersiz şekiller derleme sırasında görünür.

Bir sayfanın başlığını inline JSX olarak route nesnesinde tutmak ilk öğrenme adımı için uygundur. Uygulama büyüdüğünde route modülüne veya kendi dosyasındaki named component'e taşırsın. Önemli olan, route ağacının okunabilir kalması ve her sayfanın doğru path ile eşleşmesidir. Büyük uygulamalarda her ürün sayfası kendi modülünde yaşasa da path'ler ortak bir girişte görünür kalabilir.

## History'de yeni entry ne demek?

Router linki seçilince tarayıcı adresini uygulama içinde değiştirir ve navigasyon kaydı oluşturur. Kullanıcı birden fazla anlamlı sayfa açmışsa geri tuşu önceki konuma döner; ileri tuşu da geri gidilen konumu yeniden açar. Ekrandaki React state'i route bileşenlerinin ağacına göre korunabilir veya yeniden başlatılabilir. History kaydı ile state'in ömrü aynı şey değildir: URL önceki adresi taşır, component identity ise React ağacının hangi parçalarının korunduğunu belirler.

Birden fazla link aynı adrese gidiyorsa, bu linklerin her biri yeni kayıt ekleyebilir. Aynı arama input'unda her harfi route navigasyonu yaparak yazmak geri tuşunu kullanışsız hale getirebilir; arama için history davranışını ürünün ihtiyacına göre seçmek gerekir. Şimdilik önemli ilke şu: Router navigasyonu browser history'ye gerçek bir konum verir; yerel state güncellemesi vermez.

## Menü bağlantısı ve etkin durum

Bir sayfa kullanıcıya navigasyon içinde gösteriliyorsa `NavLink`, etkin adres bilgisini de sağlar. `/search` açıkken Ara linki etkin olur; ana sayfa linkinde `end` kullanmak `/search` yolunu yanlışlıkla `/` ile başlayan bir ana sayfa gibi saymayı önler. Görsel sınıfı bu etkinliği gösterebilir; erişilebilirlik ağacında `aria-current="page"` da belirtilir.

`Link` genel navigasyon için, `NavLink` ise aktif durumu da gereken menü öğeleri için kullanılır. İkisinin semantiği linktir: sağ tıklayıp yeni sekmede açma, bağlantı adresini kopyalama ve klavyeyle etkinleştirme tarayıcıda çalışır. Bir işlem tamamlandıktan sonra yönlendirme gerektiğinde kodla navigasyon yapmayı daha sonra ele alacağız.

:::mistake[Belirti → neden → düzeltme]
`RouterProvider` import edilemiyor → DOM sağlayıcısı ana `react-router` entry point'inde aranıyor → `RouterProvider`'ı `react-router/dom`'dan, diğer route API'lerini `react-router`'dan al.
:::

:::mistake[Belirti → neden → düzeltme]
`useParams` veya `Link` router context'i dışında hataya düşüyor → bu bileşenler `RouterProvider` tarafından kurulan context altında render edilmiyor → sağlayıcıyı uygulama ağacının üstüne koy ve route bileşenlerini o ağaca bağla.
:::

:::mistake[Belirti → neden → düzeltme]
Link tıklanınca sayfa baştan yükleniyor → uygulama içi hedef için normal `<a>` kullanılmış → bilinen uygulama içi adresi Router'ın link bileşeniyle temsil et; dış site linkinde normal anchor kullanmaya devam et.
:::

:::model[Router'ın görevi]
Router mevcut adresi route desenleriyle eşleyip doğru içeriği seçer. Bu derste her adres tek route'a bağlandı; nested route geldiğinde eşleşen parent layout ile child içeriği birlikte seçilecek.
:::

:::sector
Ekiplerde route tanımı çoğunlukla uygulamanın girişinde tek bir router modülünde tutulur. Böylece ürün alanları hangi adreslerin var olduğunu, hangi layout'a bağlandığını ve 404'ün nerede ele alındığını koddan görür. Link kullanımı da tasarım sisteminde standartlaştırılır; navigasyon öğeleri klavye ve tarayıcı özelliklerini kaybetmez.
:::

## Özet

- Route nesnesi adres desenini React içeriğine eşler.
- Data mode'da `createBrowserRouter` router'ı, `RouterProvider` ise React bağlantısını kurar.
- Route API'leri `react-router`, DOM `RouterProvider` `react-router/dom` içinden gelir.
- Router'ı component render'ı dışında bir kez oluştur; route navigasyonunda `Link` veya aktif menü için `NavLink` kullan.
- Yenilemede derin URL'nin çalışması istemci route ağacına ek olarak yayın sunucusunun SPA fallback ayarına bağlıdır.

**Kendini yokla:** `/shelf` adresine doğrudan gidildiğinde neden önce ana sayfayı açmak gerekmemeli?

*Cevap:* Adresin route ile doğrudan eşleşmesi ekranı yeniden kurmaya yeterli olmalıdır.

**Kendini yokla:** `RouterProvider` neden `react-router/dom` girişinden gelir?

*Cevap:* Bu export React DOM ortamına özgü sağlayıcıdır; route oluşturma API'leri ana `react-router` paketindedir.
