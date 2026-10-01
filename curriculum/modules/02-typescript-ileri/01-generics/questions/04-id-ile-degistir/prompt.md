Sinema'da film bilgisi güncellendiğinde listedeki eski filmi yeni nesneyle değiştiren `replaceById` fonksiyonunu yaz. Fonksiyon yeni bir dizi döndürmeli; gelen diziyi değiştirmemeli.

## Gereksinimler

- `replaceById(items, next)`, `items` içindeki `id` değeri `next.id` olan öğeyi `next` ile değiştirmeli.
- Diğer öğeler aynı sırada ve değişmeden kalmalı.
- Hiçbir öğenin `id` değeri `next.id` değilse yeni bir dizi içinde aynı öğeler dönmeli.
- Her öğenin `id` alanı sayı olmalı; `next` de listedeki öğelerle aynı tipte olmalı.
- Sonuç dizisi, öğelerin tam tipini korumalı; örneğin film için `{ id: number; title: string }[]` olmalı, `any` olmamalı.
- Fonksiyon gelen `items` dizisini değiştirmemeli.

## Örnek

Girdi:

```ts
[
  { id: 550, title: 'Dövüş Kulübü' },
  { id: 603, title: 'Matrix' },
]
```

`next` değeri `{ id: 550, title: 'Dövüş Kulübü: Yeni Kurgu' }` ise sonuç:

```ts
[
  { id: 550, title: 'Dövüş Kulübü: Yeni Kurgu' },
  { id: 603, title: 'Matrix' },
]
```

## Sözleşme

- Dosya: `task.ts`
- Dışa aktarılan fonksiyon: `replaceById`
- Parametreler: `items` film listesi, `next` listedeki filmi değiştirecek güncel film.
- Film şekli: `{ id: number; title: string }`
