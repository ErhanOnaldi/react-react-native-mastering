---
title: "Beklemeden göster, hata olursa geri al"
minutes: 7
kind: concept
---

# Beklemeden göster, hata olursa geri al

:::pain[Problem]
Mobil ağ yavaş. Puan verdikten sonra liste yeni GET’i bekleyerek boş kalıyor. Bu kez 8,5’i hemen göstermek istiyorsun; fakat sunucu 500 dönerse ekrandaki sahte başarı nasıl silinecek?
:::

## Sonucu beklemeden gösterme

Optimistic update, sunucu yanıtı gelmeden olası başarılı sonucu kullanıcıya göstermektir. Ağ hızlı algılanır, fakat yazma başarısız olursa geçici görünüm geri alınmalıdır. Bu nedenle işlem öncesi durum, bekleyen istekler ve nihai sunucu cevabı birlikte düşünülür. Her etkileşim için ortak cache'i değiştirmek şart değildir.

Önceki derste başarıdan sonra cache'i yeniledin. Burada zamanlamayı öne alıyorsun. Sinema puan düğmesinde yalnız yerel bekleme değeri yeterli olabilir; aynı puanı birkaç ekran eşzamanlı okuyorsa cache güncellemesi gerekir. Hata testi geri dönüşü de doğrulamalı.

## En küçük optimistic UI: variables

Yalnızca butonun yanında “8,5 gönderiliyor” göstereceksen cache’e dokunma. `mutation.isPending` iken `mutation.variables.value` değerini göster; hata geldiğinde pending durum biter ve geçici değer kaybolur. Başka bir bileşenin pending değişkenlerini okuması gerekiyorsa aynı `mutationKey` ile `useMutationState({ filters: { mutationKey, status: 'pending' }, select })` kullan.

```tsx
const pendingRatings = useMutationState<number>({
  filters: { mutationKey: ['rate-movie'], status: 'pending' },
  select: (mutation) => (mutation.state.variables as { value: number }).value,
})
// Üst çubuk: `${pendingRatings.length} puan gönderiliyor`
```

Bu kesit üst çubuk bileşeninin içindendir. Puan butonundaki mutation aynı `mutationKey: ['rate-movie']` değerini kullanmalıdır; aksi halde sayaç onu bulamaz. Birden fazla istek bekliyorsa dizi her birinin değerini taşır.

## Paylaşılan listeyi de hemen değiştirmek

Puanladıklarım query’sini birden fazla ekran okuyorsa `onMutate` içinde cache patch’i gerekebilir. Sıra önemlidir:

1. `cancelQueries` ile eski GET’in optimistic veriyi ezmesini önle.
2. `getQueryData` ile önceki değerin **snapshot**’ını al.
3. `setQueryData` ile yeni, immutable listeyi yaz.
4. `onError` içinde snapshot’ı geri koy.
5. `onSettled` içinde invalidation yap; sunucudaki gerçek sonucu yeniden oku.

`onMutate`’ın döndürdüğü context, `onError` ve `onSettled` callback’lerine aktarılır. Testte `server.use` ile POST’a 500 döndür; optimistic değerin önce görünüp sonra kaybolduğunu izle.

:::warning
Aynı listeye eşzamanlı birden çok mutation varsa tek snapshot’ı körlemesine geri koymak diğer başarılı değişikliği silebilir. Kapsamı dar tut veya eşzamanlı işlemleri ayrıca tasarla.
:::

:::sector
Tek butondaki geçici metin için `variables` daha az kodla yeterli. Cache patch’i ancak başka ekranların da aynı geçici sonucu görmesi gerektiğinde seç.
:::
