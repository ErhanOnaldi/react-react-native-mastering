---
title: "Provider ve Router ile render"
minutes: 8
kind: concept
---

# Provider ve Router ile render

:::pain[Problem]
Detay sayfası tek başına render edilince useParams boş dönüyor, Link router bağlamı bulamıyor. Her testte 15 satır kurulum yazmaya başladın.
:::

## Bileşenin ihtiyaç duyduğu bağlam

Bir component Router, QueryClient veya başka Provider kullandığında onu çıplak render etmek gerçek uygulama koşullarını kurmaz. Custom render helper, testte aynı bağlamları oluşturur ve senaryonun başlangıç adresi gibi değerleri seçmeyi kolaylaştırır. Ortak hazırlık tekrarı azalır; testler hangi kullanıcı davranışını ölçtüğüne odaklanır.

Sinema detayının `useParams` ve `Link` kullanması Router bağlamı gerektirir. Router dersindeki rota ağacı burada test girdisine dönüşür. Testte bellek geçmişi kullanmak, gerçek tarayıcı navigasyonuna ihtiyaç duymadan doğrudan `/movie/550` açmanı sağlar.

## İhtiyaç ve çözüm

`createMemoryRouter` test URL geçmişini bellekte tutar. `RouterProvider`’ı `react-router/dom`’dan al. `renderWithRouter` ortak yardımcıda route ve UI alıp bu ikiliyi kurar; router’ı döndürürse navigation sonrası adresi de sınarsın.

Gerçek Sinema `createBrowserRouter` kullanmayı sürdürür. Sonraki modülde `QueryClientProvider` eklendiğinde sağlayıcıları tek yerde kurmanın değeri artar.

## URL’yi test girdisine çevir

`useParams` bir route eşleşmesine, `Link` de router bağlamına ihtiyaç duyar. `render(<MovieDetailsPage />)` ile bu bağlam kurulmaz. Memory router üretimdeki browser router ile aynı route mantığını kullanır ama adresi bellekte tutar.

```tsx title="src/test/render.tsx"
const router = createMemoryRouter(routes, { initialEntries: ['/movie/550'] })
const result = render(<RouterProvider router={router} />)
return { router, ...result }
```

Burada `RouterProvider` `react-router/dom` paketinden gelir. `routes` `RouteObject[]` olabilir; tek bileşen testinde `{ path: '/movie/:id', element: ui }` dizisini helper oluşturabilir. Böylece test yalnız gereken URL’yi verir. `router.state.location.pathname` ile navigasyon sonucunu da denetleyebilirsin.

Önceki `getByRole` sorguları aynı kalır; yalnız render hazırlığı değişir. SearchPage’de `?q=Matrix` URL state’ini, MovieDetailsPage’de `/movie/550` parametresini farklı bağlamlarda tekrar kullanacaksın.

:::mistake
`window.history.pushState` ile adresi değiştirip router oluşturmadan bileşeni render etmek `useParams` için route eşleşmesi üretmez. Router’ı ve eşleşen route’u birlikte kur.
:::

:::sector[Sektörde]
Ortak render helper, Router ve ileride QueryClient gibi provider kurulumunu tek yerde tutar; testler senaryoya odaklanır.
:::
