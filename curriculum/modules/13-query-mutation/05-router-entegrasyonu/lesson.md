---
title: "Detaya tıklayınca bekleme"
minutes: 7
kind: concept
---

# Detaya tıklayınca bekleme

:::pain[Problem]
Kartta hover prefetch var ama dokunmatik ekranda hover yok. Detaya tıkladığında route değişiyor, ardından detay bileşeni GET’i başlatıyor; kullanıcı önce boş fallback görüyor.
:::

## Gezinme ile veriyi hazırlama

Route değişimi ile yeni sayfanın veri isteği iki ayrı olaydır. Veri yalnız component açıldıktan sonra istenirse kullanıcı yeni adrese geçip boş içerik bekleyebilir. Router loader'ı, navigasyon sırasında gerekli query'yi önceden hazırlar. Query cache'i yine verinin sahibi kalır; loader ile component aynı key'i kullanır.

Router modülünde adres eşleşmesini, Query modülünde cache kimliğini kurdun. Sinema kartından detaya tıklama bu iki sistemin kesişimidir. Hover prefetch bazı cihazlarda çalışmayabilir; loader geçiş anında daha genel bir hazırlık noktası sağlar.

## Data mode loader ile önden yükleme

Sinema router’ı `createBrowserRouter` kullanıyor. Route `loader` içinde aynı `movieQueries.detail(id)` tarifini `queryClient.ensureQueryData(...)` ile çağır. Loader cache’deki veriyi döndürür ya da bir kez fetch eder. Detay bileşeni **yine** `useSuspenseQuery` çağırır; loader verisini component state’ine kopyalamaz. Böylece bileşen query cache’ine abone kalır.

```ts
loader: ({ params }) => queryClient.ensureQueryData(movieQueries.detail(Number(params.id)))
```

Bu kesitte `params.id` doğrulaması ve import’lar çıkarıldı; görevde geçersiz id için hata üret. Loader ile component aynı key’i kullanmazsa iki GET oluşur. `ensureQueryData` mevcut cache verisini döndürür; otomatik tazelik kontrolü için `revalidateIfStale` seçeneğini ayrıca düşünmek gerekir.

:::mistake
Loader sonucunu `useLoaderData` ile bir kez okuyup query’yi kaldırmak. O durumda mutation invalidation sonrası detay ekranı canlı cache güncellemesini izlemez.
:::

:::sector
TanStack Query kullanan SPA’da declarative router da geçerlidir. Data mode’u burada route geçişinden önce aynı query’yi hazırlama ihtiyacı için kullanıyoruz.
:::
