---
title: unknown ve any
minutes: 8
kind: concept
---

# unknown ve any

:::pain[Problem]
`res.json()` sonucunu film sanıp doğrudan `.title` okudun. Sunucu hata gövdesi döndürürse başlık `undefined` oluyor.
:::

## Bilmediğini dürüstçe söyle
`any` tip denetimini kapatır. `unknown` da değerin şeklini bilmediğini söyler ama okumadan önce kontrol ister. Bu ders yalnızca küçük bir elle kontrol örneği kurar; tüm API şemasını elle doğrulamak zahmetlidir.

```ts check
function titleOf(value: unknown): string {
  if (typeof value !== 'object' || value === null || !('title' in value)) return 'Başlık yok'
  return typeof value.title === 'string' ? value.title : 'Başlık yok'
}
void titleOf
```

`as Movie` bir kanıt değildir; derleyiciye güvenmesini söylersin. Yanlış veri aynı şekilde çalışma zamanında kırılır. Daha sonra Zod ile çalışma zamanı doğrulamasını öğreneceksin.

:::mistake
`unknown` değerine hemen `as` eklemek kontrolü atlar. Önce `typeof`, null ve alan denetimi yap.
:::

## Sektörde
API sınırında veri belirsizdir. Tip notasyonu ile gerçek veri kontrolünün görevlerini ayrı düşün.
