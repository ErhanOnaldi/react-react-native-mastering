---
title: "Her başarısız puanı duyur"
minutes: 7
kind: concept
---

# Her başarısız puanı duyur

:::pain[Problem]
Detay kartındaki 500 hatası görünüyor, ama üst çubuktaki “senkronize ediliyor” göstergesi susuyor. Kullanıcı başka route’a geçince hata mesajını hiç görmüyor.
:::

## Yerel ve genel hata sorumluluğu

Yerel `mutation.isError`, ilgili butonun yanında “Puan kaydedilemedi” göstermek içindir. Uygulamanın her yerinde çalışan bildirim için `MutationCache({ onError })` ile tek bir genel callback kurabilirsin. Bu callback’i her bileşende tekrar kurma; `QueryClient` oluştururken kur.

```ts
const client = new QueryClient({
  mutationCache: new MutationCache({
    onError: () => notify('İşlem kaydedilemedi'),
  }),
})
```

Bu kesitte `notify`, uygulamanın bildirim fonksiyonudur. Genel callback log/notification için, yerel callback ise bağlama özel toparlanma (rollback) içindir. İkisi birlikte çalışabilir. Bildirim metninde token veya guest session kimliği gösterme.

:::mistake
`mutateAsync` reject ettiğinde `catch` koymadan event handler’da çağırmak. Global bildirim çalışsa bile yakalanmamış Promise hatası kalır. `mutate` kullan veya `await mutateAsync(...)` çevresinde `try/catch` yap.
:::

:::sector
Global hata akışı kullanıcıya genel sinyal verir; 400 gibi düzeltilebilir bir değer hatasında hangi alanın neden reddedildiğini formun yanında anlatmak gerekir. Bunu bir sonraki form modülünde büyüteceğiz.
:::
