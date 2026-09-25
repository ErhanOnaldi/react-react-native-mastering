---
title: "Davranışı koru, kodu serbest bırak"
minutes: 7
kind: concept
---

# Davranışı koru, kodu serbest bırak

:::pain[Sinema’da ne oldu?]
Arama refactor’unda yardımcı fonksiyonun adı değişti. Eski test private fonksiyonun kaç kez çağrıldığını ölçüyordu; kullanıcı hâlâ aynı yanlış sayfayı görüyordu.
:::

## Sorunu nasıl görürsün?

Testin en değerli sınırı dışarıdan görülen sözleşmedir: `?page=2` ile oluşan URL, dönen film listesi, hata halinde kullanıcıya verilen sonuç. İç değişken ve çağrı sırası ancak gerçek gereksinimse önemlidir.

## Uygulama

Aynı davranış `URLSearchParams` ya da düz string kurma ile sağlanabilir. Test `searchParams.get("page")` değerine bakarsa ikisini de kabul eder.

```ts title="searchMovies.test.ts"
const url = new URL(String(fakeFetch.mock.calls[0][0]))
expect(url.searchParams.get('query')).toBe('matrix')
expect(url.searchParams.get('page')).toBe('2')
```

Bu test, aramanın hangi yardımcı fonksiyonu kaç kez çağırdığıyla ilgilenmez. Ama `page` alanını özellikle ölçer; çünkü yaşanan regresyon tam oradaydı. Dış davranışı seçmek, testi gevşetmek anlamına gelmez: kullanıcı için önemli her parametre görünür olmalı.

## Sık hata

:::mistake
Testi aşırı genel tutmak da tehlikeli: yalnızca “istek atıldı” demek, hangi sayfanın istendiğini kanıtlamaz.
:::

:::sector
Refactor sırasında iyi testler güvenlik ağıdır: iç yapı değişebilir, kullanıcı sözleşmesi korunur.
:::
