---
title: "State kime ait?"
minutes: 8
kind: concept
---

# State kime ait?

:::pain[Problem]
Arama metni, favoriler, sayfa numarası ve TMDB sonuçları aynı sayfada dört ayrı useState olarak duruyor. Geri tuşu filtreyi geri getirmiyor; veri tekrar çekiliyor.
:::

## İhtiyaçtan karar

Önce her değerin sahibini bul: TMDB cevabı server state, favori tercihi client state, paylaşılabilir arama ve sayfa URL state, henüz gönderilmemiş form alanı form state.

## Sinema’da dene

`?q=matrix&page=2` adresi kopyalanınca aynı arama açılmalı. Favoriler cihazda kalmalı. TMDB sonuçları ise sunucunun verisi; şimdilik useEffect ile gelir, modül 12’de cache için TanStack Query kullanacağız.

## Dört değerin dört sahibi

| Değer | Sahibi | Neden? |
| --- | --- | --- |
| Trend listesi | server | TMDB günceller; yeniden çekme, hata ve cache gerekir. |
| Favori id’leri | client | Bu sürümde kullanıcının cihazındaki tercih. |
| `?q=matrix&page=2` | URL | Bağlantı paylaşılınca ve geri tuşuna basılınca korunur. |
| Yorum kutusundaki metin | form | Gönderilene kadar yalnız taslaktır. |

Önceki modülde `useSearchParams` ile sayfa numarasını URL’ye koydun. Şimdi aynı kararı arama terimine uygula: kullanıcı `?q=matrix&page=2` bağlantısını açtığında input ve liste aynı seçimi göstermeli. Input yazılırken geçici bir taslak state tutabilirsin; arama gönderilince URL’yi güncellemek ayrı bir adımdır. Bu ayrım, her tuşa basışta gezinme geçmişini şişirmeyi önler.

:::mistake[Sık hata]
Arama input’unun yazılan taslağını hemen URL’ye yazmak zorunda değilsin. Kullanıcı gönderince veya debounce süresi dolunca URL’yi güncelle; URL’nin son kararlı değeri gezinmenin kaydıdır.
:::

:::sector[Sektörde]
Tek bir büyük Context’e her şeyi koymak sahipliği çözmez. State’in kime ait olduğunu bilmek, ileride Query, form ve Redux seçimini kolaylaştırır.
:::
