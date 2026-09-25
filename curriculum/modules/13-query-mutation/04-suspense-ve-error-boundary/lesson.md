---
title: "Detay yüklenirken sınır çiz"
minutes: 7
kind: concept
---

# Detay yüklenirken sınır çiz

:::pain[Problem]
Detay sayfasında başlık, kadro ve puanlama birlikte. Her alt bileşen ayrı `isPending` koşulu yazıyor; bir GET 500 dönünce yalnızca bir kutu hata gösteriyor, sayfanın geri kalanı eski filmde kalıyor.
:::

## Suspense sınırı

`useSuspenseQuery(movieQueries.detail(id))` ilk veri gelene kadar en yakın `<Suspense fallback={...}>` sınırını bekletir. `data` başarı kolunda tanımlıdır; `enabled` veya `placeholderData` bu hook’un seçenekleri değildir. Film id’sini route parametresinden doğrulayıp query key’e kat. 550’den 27205’e geçiş ayrı cache girdisidir.

```tsx
<Suspense fallback={<p>Film yükleniyor…</p>}>
  <MovieDetailsPage />
</Suspense>
```

Bu blok yerleşimi gösterir; bileşen kendi dosyasında tanımlanır. Hataları `<Suspense>` yakalamaz. Hata için ayrıca ErrorBoundary gerekir. Query’nin hata sınırına ne zaman fırlatıldığını öğren: cache’de gösterilebilir veri varken arka plan refetch hatası eski veriyi koruyabilir. Kesin hata ekranı beklenen testte önce boş cache kullan.

:::mistake
`useSuspenseQuery` ile `if (isPending)` dalı yazmak. Hook veri olmadan bileşeni render etmez; yükleme UI’ı Suspense fallback’indedir.
:::

:::sector
Bir hata sınırını bütün uygulamaya değil, hatanın toparlanabildiği route veya bölüm çevresine koymak diğer ekranları kullanılabilir bırakır.
:::
