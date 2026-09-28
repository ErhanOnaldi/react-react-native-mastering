---
title: "Ortak layout ve Outlet"
minutes: 14
kind: concept
---

# Ortak layout ve Outlet

:::pain[Problem]
Sinema'da Ana sayfa, Ara ve Favoriler ekranlarına aynı menüyü üç kez kopyaladın. Menüdeki link değişince dosyaların ikisini düzelttin ama üçüncüsünde eski hedef kaldı. Sayfalar arasında geçerken ortak kabuğun kaybolmamasını istiyorsun.
:::

## URL, route ağacı ve React ağacı

Önce temel modeli bir araya getirelim: URL görünümün paylaşılabilir seçimlerini taşır, router URL'yi route ağacıyla eşleştirir ve eşleşen route'lar React ağacında bileşen olarak görünür. Birden çok sayfada ortak bir alan varsa, route ağacındaki üst düğüm o alanın sahibidir. Alt düğümler sayfaya özgü parçaları verir.

![URL state ile iç içe route ağacı ve Outlet arasındaki ilişki](diagram:url-state)

1. **Adres, eşleşen route zincirini belirler.** `/search` üstteki `/` route'unu ve onun `search` çocuğunu eşleştirir. Eşleşme yalnızca bir son bileşen seçmez; üstten alta route zincirini seçer.
2. **Üst route ortak layout'u render eder.** Menü, marka başlığı ve kalıcı footer bu bileşende durabilir. Çocuk sayfalar bunları tekrar oluşturmak zorunda kalmaz.
3. **`Outlet` seçili çocuğun yeridir.** Parent layout içindeki `Outlet`, geçerli URL'ye uyan çocuk route'unun içeriğini render eder. Bir placeholder gibi davranır; kendi başına yeni bir route seçmez.
4. **Route ağacının hiyerarşisi görünür bileşen ağacını etkiler.** Parent ekranı ve eşleşen child birlikte render olur. URL sibling child'a geçtiğinde ortak parent korunur; outlet'in içindeki eski child kaldırılır ve yeni child eklenir.
5. **React state'i component kimliğine bağlıdır.** Aynı parent route ağacı konumunda kalırsa onun state'i korunabilir. Farklı child bileşeni aynı outlet konumuna girdiğinde eski child'ın state'i yeni child'a aktarılmaz; bileşen türü/konumu değiştiği için önceki child unmount olur.

Bu son kuralı, daha önce gördüğün React `key` ve ağaç kimliği modeliyle birlikte düşün. Router navigasyonu React'in render ve commit sürecini başlatır; React aynı konumda aynı bileşen tipini görüyorsa state'i koruyabilir. Ancak farklı sayfa bileşenleri arasında geçişte her ikisi de `<Outlet />` içinde render ediliyor diye state'leri ortaklaşmaz. Kalıcı olması gereken state'i layout'a veya başka bir ortak sahibine taşıman gerekir.

Nested route, URL yolundaki her parçanın ekranda alt alta görünmesi gerektiği anlamına gelmez. Hiyerarşi daha çok ortak sahipliği anlatır: hangi bölüm hangi layout'u kullanır, hangi ekran hangi navigasyon alanına bağlıdır? Büyük uygulamada hesap, yönetim ve katalog alanlarının ayrı layout'ları olabilir; URL'leri de bu sınırlarla gruplanabilir.

## Menü kopyalamadan child seçmek

Sadece route'ları yan yana tanımlarsan her ekran kendi menüsünü taşımak zorunda kalır. Bu örnek adresleri eşler ama ortak kabuk kurmaz:

```tsx
const routes = [
  { path: '/', element: <><Menu /><HomePage /></> },
  { path: '/search', element: <><Menu /><SearchPage /></> },
]
```

Her route menünün ayrı bir kopyasını render eder. Düzenin değiştiği anda her kopya aynı işi yapmaya devam etmelidir; biri unutulursa görünür tutarsızlık oluşur. Parent route menüyü bir kez render eder, `Outlet` ise uygun sayfa bileşenini seçilen yere koyar.

```tsx check
import { Outlet, NavLink, createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

function SiteLayout() {
  return (
    <>
      <nav aria-label="Kitaplık menüsü">
        <NavLink to="/" end>Raf</NavLink>
        <NavLink to="/authors">Yazarlar</NavLink>
      </nav>
      <main><Outlet /></main>
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <SiteLayout />,
    children: [
      { index: true, element: <h1>Okuma rafı</h1> },
      { path: 'authors', element: <h1>Yazarlar</h1> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
```

`index: true` kök path'in kendi varsayılan child'ını tarif eder. `authors` başında slash olmadan yazıldığı için parent path'ine eklenerek `/authors` olur. `Outlet`'in çevresindeki `<main>` ortak layout'un parçası; h1 ise eşleşen child'dan gelir. Ana sayfa linkindeki `end`, yalnız tam `/` yolunda etkin olmasını sağlar.

## `authors` adresini adım adım izleyelim

Başlangıç `/` olsun. Parent route eşleşir ve layout mount edilir; index child'ı `Okuma rafı` başlığını Outlet içine koyar. Yazarlar linki etkinleşince yeni adres `/authors` olur. Router önce yine `/` parent'ını bulur, sonra `authors` child'ını seçer.

| Adres/işlem | Parent | Outlet içeriği | State beklentisi |
| --- | --- | --- | --- |
| `/` açılır | `SiteLayout` render olur | `Okuma rafı` | Layout ilk kez mount olur |
| `/authors` linki seçilir | Aynı `SiteLayout` route'u eşleşir | `Yazarlar` | Layout state'i korunabilir |
| `/` geri tuşu | Aynı parent tekrar eşleşir | `Okuma rafı` | Yazarlar child'ı kaldırılır |
| Uygulama başka ana route'a geçer | Başka parent seçilebilir | Yeni route zinciri | Eski layout unmount olabilir |

React her navigasyonda bütün uygulamayı sıfırlamaz. Router yeni konum için render planı üretir; commit sırasında değişen child DOM'u güncellenir, parent aynı kimlikte kaldığı için korunur. Layout'ta açık/kapalı menü state'i tutarsan sibling child navigasyonu sırasında kalabilir. Arama sayfasının kendi input state'i ise o sayfadan çıkıp başka child'a gidince, sayfa unmount olursa kaybolur. Aramanın URL'de olması bu kaybı engeller; yeni SearchPage URL'den aynı değeri tekrar okur.

Burada `key` eklemek genel çözüm değildir. `key`, React'in aynı türdeki sibling bileşenleri kimliklendirme kuralıdır; route state'ini saklayan bir depo değildir. Route'un konumu veya key'i değiştiğinde state resetlemek isteyebilirsin. Ama kalması gereken ortak bilgiyi rastgele key kullanarak çözemezsin; doğru component sahibini seç.

Bir bilgiyi hangi seviyede tutacağını seçerken yaşam süresini sor. Menü daraltılmış mı bilgisi bütün route'lar arasında kalmalıysa layout uygun sahip olabilir. Yalnız yazar arama formuna ait geçici yazı, sayfa değişince sıfırlanabilir. Kullanıcının paylaşacağı filtre ise SearchPage unmount olsa da URL'de kalıp yeniden girişte okunabilir. Provider layout'un dışında duruyorsa onun state'i bu parent'ın yaşam süresinden daha uzun olabilir; örneğin uygulamanın tüm sayfalarının kullandığı favori koleksiyonu.

Bu üç sahiplik türünü karıştırma: **route state** adres ve query parametrelerindedir; **ortak client state** layout veya Context gibi React ağacında yaşar; **yerel UI state** tek ekranın etkileşimine aittir. Route geçişi ilkini history ile geri getirebilir, ikincisini ortak owner koruyabilir, üçüncüsünü ise component unmount olduğunda sıfırlayabilir. İstenen davranışı açıkça tarif etmek doğru owner'ı seçmeyi kolaylaştırır.

`index: true` child'ı, parent route'un kendi path'i için içerik sağlar. `/authors` gibi başka bir child açıldığında index child artık eşleşmez ama parent layout eşleşmeye devam eder. `/authors/42` gibi daha derin bir route eklesen de aynı parent altında tutabilirsin; bu durumda navigation ve outlet ilişkisi aynı kalır, sadece bir route seviyesi daha eklenir. İç içe yapı URL'yi zorla derin yapmak için değil, ortak component sahipliğini ifade etmek için kullanılır.

React açısından geçişi şöyle düşünebilirsin: Router yeni location için eşleşen route öğelerini üretir; React render sırasında eski ve yeni component ağacını karşılaştırır; commit'te değişen child yerini alır. `SiteLayout` her iki ağaçta aynı tür ve konumda kaldığından state'i korunabilir. `OkumaRafı` ile `Yazarlar` farklı component olduğundan eski child kaldırılıp diğeri kurulur. Aynı component türünü iki kardeş path'te kullanmak ise state'i koruyabilir; route ağacının component kimliği sabitse bu beklenen davranıştır. Özel reset gerekiyorsa kimlik sınırını bilinçli belirle.

## Boş outlet ve layout hataları

`Outlet` koymadan da route eşleşebilir. URL değişir ve parent menü görünmeye devam eder ama çocuk sayfanın yeri olmadığından içerik render edilmez. Bu durumda sorun route path'inin eşleşmemesi değildir; eşleşen child'ı ekranda yerleştirecek noktayı layout'ta unutmuşsundur.

Diğer sınır, çocuk path'lerinin parent'a göre yazımıdır. `path: 'authors'`, `/` parent'ının altında `/authors` olur. Slash'lı mutlak child route'lar belirli hiyerarşi koşullarına bağlıdır ve başlangıçta gereksiz sürpriz çıkarabilir; parent altında relative path kullanmak URL ağacını okunur tutar.

:::mistake[Belirti → neden → düzeltme]
Menü görünüyor, adres değişiyor ama sayfa içeriği boş → parent layout'ta `Outlet` yok veya yanlış route ağacına yerleştirilmiş → çocuk içeriğinin görünmesi gereken noktaya `Outlet` koy.
:::

:::mistake[Belirti → neden → düzeltme]
Ana sayfa linki `/search` altında da etkin → kök `NavLink` alt yollarla prefix eşleşmesi yapıyor → kök linke `end` ekle.
:::

:::mistake[Belirti → neden → düzeltme]
Arama input'u başka sayfaya gidip dönünce sıfırlanıyor → input state'i unmount olan SearchPage içinde yaşıyor, URL'de değil → paylaşılması veya geriyle korunması gereken sorguyu URL'den oku.
:::

:::model[URL state ve ağaç kimliği]
URL route zincirini seçer; aynı parent altında child değişince ortak layout component'i korunabilir, outlet içindeki sayfa ise değişir. Bu, React'in ağaç konumu ve component kimliği kuralıyla uyumludur: kalması gereken state'i kalıcı layout'ta, adresle yeniden kurulması gereken state'i URL'de tut. Yeni olan, URL'nin yalnızca tek sayfa seçmemesi; nested route zincirinin ortak ve değişen parçalarını birlikte belirlemesidir.
:::

:::sector
Uygulamalarda navigation, breadcrumb, hesap başlığı ve alt menü gibi ortak alanlar route layout'larında yaşar. Takımlar route ağacını ürün bölümünün sahiplik haritası olarak kullanır: hangi çocuk ekranın hangi kabukla açılacağı oradan görünür. State incelemesinde de “Bu bilgi hangi route değişiminde korunmalı?” sorusu, state'i hangi bileşende tutacağına karar verir.
:::

## Özet

- Nested route, parent layout ile URL'ye uyan child içeriğini birlikte render eder.
- `Outlet`, child içeriğinin parent layout içindeki yeridir; tanımın kendisi değil.
- Sibling route değişiminde eşleşen parent korunabilir; değişen child unmount olup yeni child mount olabilir.
- State'in korunması React component kimliğine bağlıdır; route state'i için `key` bir depolama aracı değildir.
- Paylaşılabilir filtreyi URL'de tutmak, sayfa unmount olduktan sonra aynı görünümün kurulmasını sağlar.

**Kendini yokla:** `/authors` açıldığında neden hem `SiteLayout` hem `Yazarlar` render edilir?

*Cevap:* `/` parent route ve onun `authors` child'ı birlikte eşleşir; Outlet child'ı layout içine yerleştirir.

**Kendini yokla:** Arama sayfası unmount olduktan sonra input'un geri gelmesini istiyorsan hangi bilgiyi korumalısın?

*Cevap:* Sorguyu URL'de tutup yeni sayfanın bu adresten okumasını sağlamalısın.
