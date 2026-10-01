---
title: "Sinema verisini ortak cache'e taşı"
minutes: 7
kind: project
---

# Sinema verisini ortak cache'e taşı

Bu projede Sinema’nın Home, Search, Details ve Favorites ekranlarındaki sunucu verisini ortak Query cache’ine taşıyacaksın. `QueryClient`, sorgu cache’ini yöneten nesnedir; uygulamanın aynı nesneyi paylaşması ekranların da aynı cache’i kullanmasını sağlar. Üç adım var: uygulama için tek `QueryClient` ve film sorgu tarifleri kur; sayfaları bu tariflere geçir; trend akışına sayfa biriktirme ve karttan detay verisini önceden hazırlama ekle.

:::model[State kategorileri]
Arama, tür ve sayfa URL’deki seçimlerdir; TMDB’den gelen filmler server state’tir; favori id’leri client state olarak kalır. Her query key, cevabı belirleyen seçimleri içermeli; böylece başka tür ya da sayfa yanlış cache sonucunu göstermez.
:::

:::model[Query options factory]
Query tarifi key’i ve veriyi getiren function’ı birlikte tutar. Detay ekranı ve `fetchQuery` ile önceden yükleme aynı detay tarifini kullanabilir; böylece film kartından detaya geçerken aynı cache kimliği korunur.
:::

Her aşamadan sonra uygulamayı kullan: aynı aramadan detaya gidip geri dön, sayfa veya tür değiştir, ardından trend kartını aç. Network’te hangi seçim için istek gittiğini ve taze dönüşte tekrar istek çıkıp çıkmadığını gözle. Önceki derslerden `useQuery`, query key, `staleTime`, sayfalama, sonsuz sorgu ve prefetch modellerini hatırla.

## Çalışma sırası

- Önce Query altyapısını ve ortak film tariflerini kur.
- Sonra dört ekranda sunucu verisiyle kullanıcıya ait favori seçimini ayrı tut.
- Son olarak trend sayfalarını biriktir ve karttan detay verisini hazırla.

**Terimler:** `query key` bir cevabın cache’teki kimliği; `query options` key ile veri getirme işlevini bir arada tutan sorgu tarifi; `prefetch` ekran açılmadan veriyi cache’e hazırlama.

**Kendini yokla:** Favori id’leri neden Query cache’ine taşınmıyor?

**Yanıt:** Favori bir sunucu cevabı değil, kullanıcının seçimi. Ortak cache TMDB verisini paylaşır; favori seçimi client state’te kalır.
