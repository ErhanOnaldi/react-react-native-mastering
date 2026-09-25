---
title: "Kodu gerektiğinde yükle"
minutes: 8
kind: concept
---

# Kodu gerektiğinde yükle

:::pain[Problem]
Film detayındaki büyük oyuncu bölümü ana sayfanın ilk indirmesine katıldı. Kullanıcı henüz detaya gitmeden bu kodu taşımak pahalı.
:::

## Bileşen ve route
`React.lazy(() => import('./CastPanel'))` modülü gerektiğinde ister. `Suspense fallback` yüklenme sırasında görünür. React Router 8 data route'unda `lazy: () => import('./routes/movie')` route modülünü böler; modül `Component`, `loader` gibi route anahtarlarını export eder. `path` gibi eşleme alanları statik kalır.

Modül 6'da lazy route'u gördün. Burada ağ paketini küçültmek için kullanıyoruz; çok küçük her bileşeni bölmek fazladan ağ işi yaratır.

:::mistake
`lazy` bileşenini render fonksiyonunun içinde oluşturma; her render yeni bileşen tipi üretir ve state sıfırlanabilir.
:::

## Route sınırı

```tsx title="router.tsx"
const routes = [
  { path: '/movie/:id', lazy: () => import('./routes/movie-details') },
]
```

`./routes/movie-details` modülü `Component` gibi route özelliklerini export eder. `path` eşleme için hemen bilinmelidir; lazy modülüne saklanmaz. `React.lazy` ise route dışındaki büyük oyuncu paneli için uygundur. İki yöntem aynı fikri farklı sınırda uygular: biri route modülünü, diğeri bileşeni geciktirir. Network panelinde ana sayfa açılırken detay chunk'ının inip inmediğini gözle.
