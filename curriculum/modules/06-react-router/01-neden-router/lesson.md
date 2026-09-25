---
title: "Neden router?"
minutes: 7
kind: concept
---

# Neden router?

:::pain[Problem]
Sinema'da `const [page, setPage] = useState('home')` ile görünümü değiştiriyorsun. Detaydayken tarayıcının geri tuşu seni listeye götürmüyor; `/` adresi hem listeyi hem detayı gösteriyor. Aynı filmi açacak bağlantıyı gönderemiyorsun.
:::

## State ile sayfa seçmeyi dene

```tsx title="src/App.tsx"
function App() {
  const [page, setPage] = useState<'home' | 'search'>('home')
  return <>{page === 'home' ? <Home /> : <Search />}</>
}
```

Bu kod yalnızca React state'ini değiştirir. Tarayıcı geçmişi ve adres çubuğu değişmez. Yenileme `useState` başlangıcına döndürür. Aynı nedenle filtreyi yalnızca state'te tutarsan `?q=Matrix` gibi paylaşılabilir bir sonuç elde edemezsin.

## İhtiyaç: adresin anlam taşıması

`/` ana sayfayı, `/search?q=Matrix&page=2` arama sonucunu, `/movie/550` tek filmi anlatsın. Tarayıcı geri/ileri tuşları bu adreslerin geçmişinde çalışır. React Router, adrese göre doğru bileşeni seçer. Bu modülde **data mode** kullanacağız: rota ağacını `createBrowserRouter` ile kurup `RouterProvider` ile render edeceğiz.

:::mistake[Sık hata]
Her değeri URL'ye taşıma. Açık/kapalı bir tooltip gibi geçici UI state'i yerel kalabilir. Paylaşılmasını, yenilemede korunmasını veya geri tuşuyla değişmesini istediğin filtre ve sayfa URL'dedir.
:::

:::sector
Adres, ürünün bir parçasıdır: destek ekibine aynı arama sonucunu göndermek ve analitikte hangi sayfanın açıldığını görmek için tutarlı route'lar gerekir.
:::
