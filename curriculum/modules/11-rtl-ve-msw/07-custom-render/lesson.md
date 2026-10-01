---
title: "Testte Router ve Provider kur"
minutes: 14
kind: concept
---

# Testte Router ve Provider kur

`render(<MovieDetails />)` bir component’i ekranda çalıştırır. Ama component `useParams()` ile URL’den id okuyorsa, tek başına render yeterli değildir: testte URL’i okuyabileceği bir Router da olmalıdır.

`Provider`, altındaki component’lere ortak bir değer veya özellik sunan sarmalayıcı component’tir. Context Provider’ını önceki derslerde gördün; Router da component’lerine route bilgisi veren bir çalışma ortamı sağlar. Testte gereken ortamı bizim kurmamız, `render`’ın hangi koşulda çalıştığını açık ve tekrarlanabilir kılar.

## Önce bir başlangıç adresi ver

En küçük örnekte `/movie/550` adresini bellekte açalım. `createMemoryRouter`, tarayıcı adres çubuğunu değiştirmeden test için adres ve gezinme geçmişi tutar. `RouterProvider` ise bu Router’ı component ağacına sağlar.

```tsx check
import { render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

function MoviePage() {
  return <h1>Film sayfası</h1>
}

const router = createMemoryRouter(
  [{ path: '/movie/550', element: <MoviePage /> }],
  { initialEntries: ['/movie/550'] },
)

render(<RouterProvider router={router} />)
screen.getByRole('heading', { name: 'Film sayfası' })
```

Burada route’un `path` değeri açılabilecek adres biçimini, `initialEntries` ise testin ilk açtığı adresi belirtir. İkisi şimdilik aynı; birazdan kalıp ve gerçek adres arasındaki farkı göreceğiz. Router’ı her test için yeniden üretirsen gezinme geçmişi de teste özel kalır.

## Route kalıbı ile gerçek adresi eşleştir

Bir route kalıbı URL’in hangi parçalarını okuyacağını söyler. `:id`, adresin o bölümünü parametre yapar; parametre, `useParams` ile component’in okuyabileceği metin değeridir.

```tsx check
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, useParams } from 'react-router'
import { RouterProvider } from 'react-router/dom'

function MoviePage() {
  const { id } = useParams()
  return <h1>Film {id}</h1>
}

const router = createMemoryRouter(
  [{ path: '/movie/:id', element: <MoviePage /> }],
  { initialEntries: ['/movie/550'] },
)
render(<RouterProvider router={router} />)
screen.getByRole('heading', { name: 'Film 550' })
```

`/movie/:id` eşleşme kuralıdır; `/movie/550` testin açtığı gerçek adrestir. Router bu adresi kalıpla eşleştirince `id` değeri `'550'` olur ve ekranda “Film 550” görünür. `useParams` sayısal değer döndürmez; gerekirse string’i component içinde sayıya çevirirsin.

Bu akışı sırasıyla izleyelim:

| Sıra | Olan | Component’in gördüğü |
|---|---|---|
| 1 | Route `/movie/:id` olarak tanımlanır | `id` adlı bir parametre beklenir |
| 2 | İlk adres `/movie/550` olur | Henüz component çalışmadı |
| 3 | Router adresi route ile eşleştirir | `id` değeri `'550'` olur |
| 4 | RouterProvider sayfayı render eder | `useParams()` `'550'` verir |
| 5 | Başlık üretilir | Ekranda `Film 550` görünür |

![URL state ile route eşleşmesi ve içerik arasındaki bağ](diagram:url-state)

## Aynı kurulumu helper’da topla

Route ve RouterProvider kurulumu birkaç testte tekrarlandığında, küçük bir **custom render helper** (test render’ını ihtiyaca göre saran yardımcı fonksiyon) kullanabilirsin. Helper’ın girdisi testin hangi route kalıbını ve ilk adresi istediğini göstermeli; ayrıca normal `render` sonucunu ve gerekiyorsa Router nesnesini döndürmelidir.

```tsx check
import { render } from '@testing-library/react'
import { createMemoryRouter, type RouteObject } from 'react-router'
import { RouterProvider } from 'react-router/dom'

export function renderCinemaRoutes(routes: RouteObject[], firstAddress: string) {
  const router = createMemoryRouter(routes, { initialEntries: [firstAddress] })
  const renderResult = render(<RouterProvider router={router} />)
  return { router, ...renderResult }
}
```

Örneğin helper’a film ayrıntı route’unu, arama route’unu ve ilk adres olarak `/movie/550` verirsin. Route listesi sayfaların nerede açılacağını, ilk adres ise bu testin hangi sayfadan başlayacağını söyler. `{ router, ...renderResult }` döndürmek DOM sorgularını kullanmaya devam ederken `router.state.location` ile gezinme adresini de inceleme imkânı verir. Her testte Router kurulumunu baştan yazmak yerine aynı küçük, anlaşılır adımları çağırırsın.

## Tıklamadan sonra ne değiştiğini gör

Bir Router testi başlangıç ekranında kalmak zorunda değil. `Link` tıklanınca yeni route’u da aynı bellekteki route listesine eklersin. `Link`, tam sayfa yüklemek yerine uygulama içi gezinme başlatan erişilebilir bağlantıdır.

```tsx
const router = createMemoryRouter(
  [
    { path: '/movie/:id', element: <MovieDetails /> },
    { path: '/search', element: <h1>Arama</h1> },
  ],
  { initialEntries: ['/movie/550'] },
)
render(<RouterProvider router={router} />)
await user.click(screen.getByRole('link', { name: 'Aramaya dön' }))
screen.getByRole('heading', { name: 'Arama' })
```

Tıklama sonrası hem yeni başlığı görmek hem gerekirse `router.state.location.pathname` değerinin `/search` olduğunu doğrulamak mümkündür. Ekrandaki başlık, kullanıcının gördüğü sonucu kanıtlar; URL kontrolü de adres değişiminin kendisi gereksinimse anlamlıdır. Testte kullanacağın her sayfa için route tanımlamayı unutma.

:::mistake[Belirti: başlıkta `undefined` görünüyor]
Neden → Component Router içinde olsa bile eşleşen route `:id` parametresi tanımlamıyor ya da ilk adres `/movie/550` gibi o kalıpla eşleşmiyor.  
Düzeltme → Route kalıbını ve ilk adresi yan yana kontrol et: `/movie/:id` ile `/movie/550` eşleşir.
:::

:::mistake[Belirti: “Router context yok” hatası]
Neden → `useParams` veya `Link`, `RouterProvider` dışında render ediliyor.  
Düzeltme → Component’i memory Router’ın `RouterProvider` ağacında render et.
:::

## Birden çok Provider gerektiğinde

Bir component gerçekten Context kullanıyorsa test ağacına ilgili Context Provider’ını da ekleyebilirsin. Yalnız ihtiyaç duyulan Provider’ları kur: bütün uygulamanın tema, oturum ve veri altyapısını her küçük testte başlatmak, testin neden başarısız olduğunu anlamayı zorlaştırır. Yeni bir Provider’ı helper’a, ancak testlerde gerçekten tekrarlanan ihtiyaç ortaya çıktığında ekle.

:::info[Derinlemesine (isteğe bağlı)]
Tek bir component’i wildcard route altında çalıştırmak için `path: '*'` kullanılabilir. `*` kalan adres parçalarıyla eşleşir; bu route’un hangi adresleri yakaladığı çağrı yerinde açık değilse parametreli sayfa veya birden fazla hedef içeren testlerde eksiksiz route listesi daha anlaşılırdır.
:::

## Özet

- RTL `render`, Router veya Context Provider’larını kendiliğinden kurmaz.
- Memory Router test için başlangıç adresi ve gezinme geçmişi sağlar.
- Route kalıbı (`/movie/:id`) ile ilk adres (`/movie/550`) farklı bilgilerdir.
- Custom render helper tekrarlanan test kurulumunu toplar; test girdilerini görünür bırakır.
- Navigasyon testi tıklama sonrasında yeni ekranı, gerekiyorsa URL’i doğrular.

**Yeni terimler**

- **Provider:** Altındaki component’lere ortak değer veya özellik sağlayan sarmalayıcı component.
- **Memory Router:** Tarayıcı adres çubuğu yerine bellekte test adresleri ve gezinme geçmişi tutan Router.
- **Route parametresi:** Route kalıbındaki `:id` gibi, eşleşen adres bölümünden okunan string değer.
- **Custom render helper:** Testte tekrarlanan render kurulumunu saran yardımcı fonksiyon.

**Kendini yokla:** `/movie/:id` ile `/movie/550` neyi anlatır?  
*Cevap:* İlki eşleşme kalıbı, ikincisi testin başlangıç adresidir.

**Kendini yokla:** Testte `useParams` kullanan component’e ne sağlamalısın?  
*Cevap:* Eşleşen bir route ve bu route’u component ağacına veren RouterProvider.
