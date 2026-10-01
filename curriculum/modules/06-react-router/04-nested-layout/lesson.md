---
title: "Ortak layout ve Outlet"
minutes: 14
kind: concept
---

# Ortak layout ve Outlet

Sinema'da Ana sayfa ve Ara ekranlarında aynı menüyü göstermek istiyorsun. Menü bağlantılarını iki ekrana da kopyalarsan, menü değiştiğinde iki yeri de güncellemen gerekir. React Router'da ortak görünümü bir kez tutup değişen sayfayı onun içine yerleştirebilirsin.

## Bir ekranın içine başka bir ekranı yerleştir

Bir parent route, başka route'ları içinde tutan üst route'tur. Onun altındaki route'lara child route denir. `Outlet`, parent'ın ekranda child içeriğinin görüneceği yerdir; bu fikri önce küçük bir örnekte görelim.

Menüyü iki ayrı route içinde yazmak da mümkün:

```tsx
{ path: '/', element: <><Menu /><Home /></> }
{ path: '/search', element: <><Menu /><Search /></> }
```

Bu kod çalışır ama menüyü iki kez tarif eder. Menüye yeni bir bağlantı eklediğinde iki route'u da güncellemen gerekir; ortak layout bunu tek bir yerde toplar.

```tsx
function SinemaLayout() {
  return <main><Outlet /></main>
}
```

Bu component tek başına hangi child'ın seçileceğine karar vermez. Router, mevcut adrese uyan child'ı bulur ve `Outlet` konumuna yerleştirir. `Outlet` olmadan parent görünebilir ama child'ın içeriği için ekranda yer kalmaz.

## Önce ortak kabuk, sonra sayfalar

Şimdi layout'a sabit bir başlık ekleyelim. İçeride hâlâ aynı `Outlet` var:

```tsx
function SinemaLayout() {
  return (
    <>
      <header><h1>Sinema</h1></header>
      <main><Outlet /></main>
    </>
  )
}
```

Başlık parent'ın parçası olduğu için bütün child sayfalarda görünür; `main` içeriği ise adrese göre değişir. Böylece ortak alanı tek yerde düzenlersin.

Bir child'ı parent'ın kendi adresine bağlamak için `index: true` kullanılır. Diğer child path'leri parent'a göre yazılır; örneğin `search` kök parent altında `/search` olur.

```tsx check
import { Outlet, createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

function SinemaLayout() {
  return <><header><h1>Sinema</h1></header><main><Outlet /></main></>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <SinemaLayout />,
    children: [
      { index: true, element: <h2>Filmler</h2> },
      { path: 'search', element: <h2>Arama sonuçları</h2> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
```

`/` adresinde `SinemaLayout` ile Filmler içeriği birlikte görünür. `/search` adresinde aynı layout içinde Arama sonuçları görünür. Path başında `/` olmadan yazılan `search`, parent route'a eklenir.

## Menü de parent'ın parçası olsun

Bir sonraki küçük değişiklik, ortak başlığın yanına menü eklemek. `NavLink`, route bağlantısı oluşturur ve eşleşen adreste aktif olduğunu gösterebilir:

```tsx
import { NavLink, Outlet } from 'react-router'

function SinemaLayout() {
  return (
    <>
      <nav aria-label="Sinema menüsü">
        <NavLink to="/" end>Ana sayfa</NavLink>
        <NavLink to="/search">Ara</NavLink>
      </nav>
      <main><Outlet /></main>
    </>
  )
}
```

`end` ana sayfa bağlantısının yalnızca `/` adresinde etkin olmasını sağlar. Kök bağlantıda bunu kullanmazsan `/search` de `/` ile başladığı için ana sayfa bağlantısı yanlışlıkla etkin görünebilir.

Child route'lar arasında geçerken aynı parent route eşleşmeye devam eder. Bu yüzden ortak menü yerinde kalırken Outlet içindeki sayfa değişir. `index` route ise yalnız parent'ın kendi adresindeyken görünür; başka bir child seçilince yerini o child'a bırakır.

| Adres veya işlem | Eşleşen içerik | Ekranda görünen |
| --- | --- | --- |
| `/` açılır | Layout + index child | Menü + Filmler |
| Ara bağlantısı seçilir | Aynı layout + `search` child | Menü + Arama sonuçları |
| Geri tuşu `/`'ye döner | Aynı layout + index child | Menü + Filmler |

Bu tablo, router'ın bütün uygulamayı baştan başlatmadığını gösterir. Aynı layout eşleştiği sürece ortak bölüm kalır; yalnızca seçilen child değişir.

Route ağacındaki iç içelik her zaman URL'de uzun bir yol demek değildir. İç içelik, ortak görünüm ve route sahipliğini anlatır: `/search` kısa bir adres olabilir, yine de kök layout'un child'ı olarak eşleşir. Daha sonra `/search/actors` gibi ayrı bir ekran eklesen, aynı layout ve menüyü kullanmaya devam edebilirsin.

Şemadaki arama parametrelerini sonraki derste adım adım okuyacağız.

![URL state ile iç içe route ağacı ve Outlet arasındaki ilişki](diagram:url-state)

## Child değişince hangi bilgi kalır?

React `state`'i component'e bağlıdır. Menü açık mı gibi ortak bilgi `SinemaLayout` içinde tutulursa child değişirken korunabilir. Sadece arama sayfasında kullanılan geçici bir input değeri ise o sayfadan çıkınca sıfırlanabilir; sayfa kaldırıldığında kendi component'i de ekrandan çıkar.

Paylaşılması ya da geri tuşuyla geri gelmesi gereken arama seçimini URL'de tutabilirsin; sonraki derste arama değerlerini URL'den okuyacağız. Böylece iki farklı ihtiyacı ayırırsın: layout'un paylaştığı React bilgisi ve adresle geri kurulabilen sayfa seçimi.

Bir de tek ekranda kullanılan, sayfadan çıkınca unutulması sorun olmayan bilgi vardır; örneğin Arama ekranındaki açık filtre menüsü. Bu bilgiyi Arama component'inde tutmak uygundur. Menü daraltma tercihi tüm sayfalarda kalsın istiyorsan layout'a; arama sonucu paylaşılabilsin istiyorsan URL'ye koy. Bilginin hangi ekranlar arasında yaşaması gerektiğini sormak, doğru yeri seçmene yardım eder.

:::mistake[Belirti → neden → düzeltme]
Menü görünüyor, adres değişiyor ama child sayfa görünmüyor → layout içinde child için `Outlet` yok → child içeriğinin çıkmasını istediğin yere `Outlet` ekle.
:::

:::mistake[Belirti → neden → düzeltme]
`/search` açıkken Ana sayfa bağlantısı da etkin görünüyor → kök `NavLink` alt yolları da eşleştiriyor → yalnız tam `/` yolunda etkin olması için `end` ekle.
:::

:::model[URL state ve ağaç kimliği]
Adres route zincirini seçer: parent ortak alanı, child değişen sayfayı verir. Aynı parent eşleştiğinde onun state'i korunabilir; URL'de tutulmuş seçimler ise adresle yeniden kurulabilir. Bu derste yeni olan, tek bir adresin ortak layout ile child sayfayı birlikte seçmesidir.
:::

## Özet

- Parent route ortak layout'u taşır; child route adrese göre değişen sayfayı sağlar.
- `Outlet`, eşleşen child içeriğinin layout içindeki yeridir.
- `index: true`, parent'ın kendi adresinde gösterilecek child'ı belirtir.
- Aynı parent altında child değişirken layout kalabilir; child'a ait yerel state sıfırlanabilir.

**Yeni terimler:**

- **Parent route:** Alt route'ları içinde taşıyan üst route.
- **Child route:** Parent route altında eşleşen alt route.
- **`Outlet`:** Seçili child içeriğinin render edildiği layout noktası.

**Kendini yokla:** `/search` açılınca menü neden dururken sayfa içeriği değişebilir?

*Cevap:* İki adres de aynı parent layout ile eşleşir; yalnız Outlet'e yerleşen child değişir.

**Kendini yokla:** Ana sayfa bağlantısının `/search` içinde etkinleşmemesi için ne yaparsın?

*Cevap:* Kök `NavLink`'e `end` eklerim; böylece yalnız tam `/` eşleşir.
