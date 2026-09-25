---
title: Kopyalanan davranışı hook’a taşı
minutes: 9
kind: concept
---

# Kopyalanan davranışı hook’a taşı

:::pain[Problem]
Üç bileşende aynı debounce timer’ı, localStorage okuması ve loading/error/fetch akışı kopyalanmış. Bir cleanup düzeltmesini üç yere de taşımak gerekiyor.
:::

## Ne değişiyor?

Custom hook, başka hook’ları çağıran ve `use` ile başlayan yeniden kullanılabilir fonksiyondur. `useDebounce` timer’ı; `useLocalStorage` kalıcılığı; `useFetch<T>` ağ durumunu taşır.

## Sinema'da dene

Hook’lar da bileşenler gibi koşulsuz, üst seviyede çağrılır. `useFetch<T>(null)` idle döner; URL değişince önceki istek iptal edilir.

## Üç kopya, üç farklı dış sistem

`useDebounce` saatle konuşur: timer kurar ve her değişimde eski timer’ı temizler. `useLocalStorage` tarayıcının kalıcı alanından ilk değeri okur, güncellemeleri saklar. `useFetch<T>` ağla konuşur; URL’ye göre loading/success/error üretir ve eski isteği iptal eder.

```ts
const debouncedQuery = useDebounce(query, 300)
const movies = useFetch<MovieListResponse>(
  debouncedQuery ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(debouncedQuery)}` : null
)
```

Bu parça uygulama URL’sinin bağlamına göre uyarlanır; `useFetch` görevi TMDB’nin tam URL’sini ve Bearer başlığını kullanır. `null`, “henüz istek yok” anlamına gelir. Hook’u koşullu çağırmak yerine parametresini koşullu yapman Hook sırasını korur.

Debounce testinde `vi.useFakeTimers()` zamanı ilerletir; gerçek 300 ms beklemek kırılgandır. Kullanıcı etkileşimini fake timers ile birleştirdiğinde `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })` ayarı gerekir. Testlerde MSW ağ cevabını sağlar.

:::mistake[Sık hata]
Hook içinde cache olduğunu varsayma. Bu sürüm her uygun URL değişiminde yeni istek atar; bu acı Modül 7’de yeniden karşına çıkacak.
:::

:::sector
Bu saf yöntemin cache’i yok: 7. modülde tekrar eden istekleri yaşayacak, 12. modülde TanStack Query ihtiyacını göreceksin.
:::
