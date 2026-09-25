---
title: "Sinema’ya gerçek adresler ekle"
minutes: 9
kind: project
---

# Sinema’ya gerçek adresler ekle

:::pain[Problem]
Sinema'da favorilere tıklayınca React state'i değişiyor ama adres değişmiyor. `/movie/550` linkini alan biri detaya ulaşamıyor; `/search?q=Matrix` yenilenince arama kayboluyor.
:::

## Görev akışı

Önce rota ağacını, ortak layout'u ve sayfa dosyalarını ekle. Ardından `main.tsx` içinde `RouterProvider` kullan. Favoriler provider'ını router'ın çevresinde tut ki bütün sayfalar aynı favorileri görsün.

| Adres | Sayfa |
| --- | --- |
| `/` | `HomePage` — statik filmler |
| `/search?q=...` | `SearchPage` — URL'den arama, statik liste |
| `/movie/:id` | `MovieDetailsPage` — id ile statik film |
| `/favorites` | `FavoritesPage` — mevcut Context'teki favoriler |
| eşleşmeyen | `NotFoundPage` |

`src/router.tsx` hem `router` hem `routes` export eder. Testler aynı `routes` dizisini `createMemoryRouter` ile açar. Bir `errorElement` ekle. Dosya yolları ve export beklentileri iki proje görevinin metninde açık.

:::mistake[Sık hata]
`RouterProvider` bağlayıp eski `<App />` ağacını da yanında render etme: iki ayrı sayfa ağacı ve tutarsız state oluşur.
:::

:::sector
Bu aşamada veri statik kalıyor. Sonraki modül, bu route'lara gerçek TMDB isteğini bağlayacak.
:::
