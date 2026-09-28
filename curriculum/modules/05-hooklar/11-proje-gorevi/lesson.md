---
title: "Sinema’ya hook’ları taşı"
minutes: 6
kind: project
---

# Sinema’ya hook’ları taşı

:::pain[Problem]
Sinema'nın arama ve favori davranışı büyüyor. Debounce, fetch durumu ve kalıcı favoriler dağınık kalırsa Modül 7'de gerçek TMDB sayfalarını eklediğinde aynı loading/error kodu her yere yayılacak.
:::

Bu proje görevi Modül 5'in public sözleşmesini Sinema'ya taşır. Yeni dosya yolları sonraki modüllerde kullanılacak, bu yüzden export adlarını değiştirme.

## Önce hook sözleşmesi

`src/hooks/useDebounce.ts`, `src/hooks/useLocalStorage.ts` ve `src/hooks/useFetch.ts` dosyalarını kur. `useFetch<T>` mevcut `src/lib/remote-data.ts` tipini kullanmalı; yeni ve farklı bir union yazarsan sonraki modüller aynı dili konuşamaz.

:::model[Effect yaşam döngüsü]
`useDebounce` timer setup/cleanup, `useFetch` ağ setup/cleanup taşır. Hook'a taşımak cleanup sorumluluğunu azaltmaz; yalnız tek yerde doğru yazmanı sağlar.
:::

## Sonra favori sınırı

`src/context/FavoritesContext.tsx` içinde `FavoritesProvider` ve `useFavorites()` export et. Provider id listesini kalıcı tutar; hook `{ favoriteIds, isFavorite, toggleFavorite }` döndürür. `main.tsx`, `App`'i provider ile sarar.

:::model[Context yayılımı]
Favori state'i provider altında paylaşılır. Aradaki bileşenler artık favori prop'u taşımak zorunda değildir; context'i okuyan kartlar değer değişince güncellenir.
:::

## Testleri okuma notu

Proje testleri dosyaları `@project/src/...` üzerinden import eder. Bu, "yaklaşık böyle bir dosya" değil, tam yol sözleşmesi demektir. Önce hook testlerinin import ettiği dosyaları oluştur, sonra App ve provider bağlantısını yap. Gerçek TMDB sayfalarını bu modülde kurma; Modül 7 bunun üzerine gelecek.

:::mistake[Sık hata]
Belirti → Hook testleri geçiyor ama favori kartları birlikte güncellenmiyor. Neden → Provider `main.tsx` içinde App'i sarmıyor veya kartlar hâlâ yerel state kullanıyor. Düzeltme → Tek favori kaynağını provider yap.
:::

:::sector
Bu tür proje görevlerinde ekip sözleşmesi dosya yolu ve export adıdır. İçerideki implementation değişebilir; public giriş noktaları sonraki modüllerin üzerine inşa ettiği zemindir.
:::

## Özet

- Hook dosyaları sonraki modüllerin public API'sidir.
- `useFetch<T>` mevcut `RemoteData<T>` dilini kullanır.
- Favoriler provider altında ortak ve kalıcı olur.
- `main.tsx` provider yerleşimi görevin parçasıdır.

Kendini yokla: `useFetch` içinde ayrı bir `RemoteData` tipi yazmak neden sorun çıkarır?  
Cevap: Projenin diğer dosyaları mevcut `src/lib/remote-data.ts` sözleşmesini bekler; iki farklı union aynı kavram için ayrışır.
