---
title: Sinema’ya hook’ları taşı
minutes: 7
kind: project
---

# Sinema’ya hook’ları taşı

:::pain[Problem]
Sinema’nın statik araması her tuşta hesaplanıyor; favoriler yenilemede kayboluyor. Ayrı sayfalarda kullanılacak veri akışı için ortak hook’lar da henüz yok.
:::

## Ne değişiyor?

Önce `useDebounce`, `useLocalStorage` ve `useFetch<T>` dosyalarını ekle. Ardından `FavoritesProvider` ile favori durumunu ağaca ver.

## Sinema'da dene

`main.tsx` içinde provider’ı App’in çevresine koy; arama için gecikmiş değeri kullan. Modül 7’de gerçek TMDB sayfaları bu hook’ları kullanacak.

## Dosya sözleşmesi

| Dosya | Export | Davranış |
| --- | --- | --- |
| `src/hooks/useDebounce.ts` | `useDebounce` | Son değer gecikmeyle görünür |
| `src/hooks/useLocalStorage.ts` | `useLocalStorage` | Favori id’leri yenilemede kalır |
| `src/hooks/useFetch.ts` | `useFetch<T>` | `RemoteData<T>`, abortable istek |
| `src/context/FavoritesContext.tsx` | `FavoritesProvider`, `useFavorites` | Ortak favori durumu |

Önceki modülde `src/lib/remote-data.ts` oluşturmuştun. `useFetch` dönüşünde o tipi import et; yeni ve farklı bir `RemoteData` yazma. `main.tsx` provider’ı App çevresine koyar. App’te arama metni ile gecikmiş metni ayır.

Proje görevleri klasöründe testleri oku. Bu testler senin Sinema dosyalarını `@project/src/...` üzerinden açar. Burada gerçek TMDB sayfaları kurulmuyor; Modül 7 bu hook’ları kullanacak. Sonraki Router modülü de provider yerleşiminin önemini gösterecek.

:::mistake[Sık hata]
Hook’ları doğru yazıp `main.tsx` içinde provider’ı bağlamayı unutursan kartlar ortak favori durumunu okuyamaz.
:::

:::sector
Proje testleri dosya yolu ve export adlarını doğrular; sınırsız tasarım seçenekleri yerine bu sözleşmeyi koru.
:::
