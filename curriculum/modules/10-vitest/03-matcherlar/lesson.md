---
title: "Doğru karşılaştırmayı seç"
minutes: 8
kind: concept
---

# Doğru karşılaştırmayı seç

:::pain[Sinema’da ne oldu?]
TMDB listesinden dönen nesnede `results` doğru olsa da `total_pages` yanlış. Bir nesneyi `toBe` ile karşılaştırmak aynı referansı arar; istediğin alanı nasıl sınarsın?
:::

## Sorunu nasıl görürsün?

`toEqual` iç içe yapının değerlerini karşılaştırır. `toMatchObject` yalnızca ilgili alanları denetler. `toThrow` fırlatılan hatayı sınar. `expect.objectContaining` ve `expect.arrayContaining` değişken sıralı veya ek alanlı cevaplarda işe yarar.

## Uygulama

Film kartı için `{ id: 550, title: "Dövüş Kulübü" }` alt kümesini `toMatchObject` ile denetlemek, API’nin başka alanlar eklemesine dayanır. Ancak sayfalama için `page` ve `total_pages` ikisini de açıkça kontrol et.

| İhtiyaç | Matcher | Gerekçe |
| --- | --- | --- |
| `"8.0"` stringi | `toBe` | İlkel değer aynı olmalı |
| Tam id dizisi | `toEqual` | Sıra ve içerik aynı olmalı |
| Büyük response içindeki sayfa alanları | `toMatchObject` | Ek alanlar serbest |
| Kötü sayfa numarasını reddetme | `toThrow` | Hata dışarıdan görülür |

`expect.objectContaining({ id: 550 })` bir dizi beklentisinin içinde kullanılabilir: `expect.arrayContaining([expect.objectContaining({ id: 550 })])`. Bu, sonuç sırası sözleşmenin parçası değilse değerlidir. Sıra önemliyse tam diziyi `toEqual` ile ölç.

Üçüncü görevde `RangeError` fırlatan sayfa doğrulayıcısı yazacaksın. Hata testi `expect(() => requirePage(0)).toThrow(...)` biçimindedir: fonksiyonu assertion içine doğrudan çağırmazsın.

## Sık hata

:::mistake
`toBe({ ... })` ayrı nesne üretildiğinde geçmez. Çok geniş bir `toMatchObject({})` ise hata yakalamaz. Matcher, sözleşmenin tamlığını yansıtmalı.
:::

:::sector
Response nesnesindeki ilgisiz alanlara bağlanmayan testler, veri şekli büyüdüğünde daha az kırılır.
:::
