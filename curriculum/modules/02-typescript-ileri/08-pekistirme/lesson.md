---
title: Tipleri birlikte kullan
minutes: 9
kind: practice
---

# Tipleri birlikte kullan

:::pain[Problem]
Arama, trend ve detay endpoint'leri aynı `fetch` fonksiyonuna veriliyor. Serbest `string` yol ve `any` cevap yüzünden `/movie/550` sonucu liste sanılıp `.results` okunuyor.
:::

## Yeni bağlam: endpoint haritası

Şimdi `keyof`, indeksli erişim ve generics'i birleştir. İzin verilen yolları bir haritada tanımla; `K extends keyof EndpointMap` ile yolun cevap tipini ilişkilendir. Yol ile sonuç arasındaki bağ `getJson<T>` çağrısından daha güçlüdür, fakat ağ cevabını yine doğrulamaz.

## Durum geçişi

Ardından `RemoteData<T>` için saf bir reducer yaz. Yükleme eylemi eski `data`yı taşımasın; başarı yalnızca veri, hata yalnızca mesaj içersin. Böylece önceki sayfadan kalan film yeni istekte yanlışlıkla görünmez.

:::mistake
`Omit` ve `Partial` ile türetilen tipler çalışma zamanındaki nesneyi değiştirmez. Reducer'da yeni nesneyi açıkça üret.
:::

:::sector
Bu alıştırma, ileride `useReducer` ve tipli API client yazarken göreceğin iki tasarım kararının küçük bir provasıdır.
:::
