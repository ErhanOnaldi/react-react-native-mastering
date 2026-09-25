---
title: "Aynı kural, birden çok veri"
minutes: 7
kind: concept
---

# Aynı kural, birden çok veri

:::pain[Sinema’da ne oldu?]
`releaseYear` boş tarihte doğru, ama geçerli tarihlerin yalnızca birinde doğru. Her sınır için ayrı test yazmak aynı gövdeyi tekrar ettiriyor.
:::

## Sorunu nasıl görürsün?

`it.each` veri tablosundaki her satırı ayrı test yapar. Başlıkta `%s` ile girdiyi göster; kırılan satır doğrudan görünür. Bu, aynı kuralın farklı örnekleri içindir; farklı davranışlar için ayrı adlandırılmış test kullan.

## Uygulama

Boş tarih, `1999-10-15` ve `2024-01-01` satırları hem eksik veri hem normal durumları kapsar. Sonraki görevde sayfalama sınırını da veri tablosuyla yoklayacaksın.

```ts title="releaseYear.test.ts"
import { expect, it } from 'vitest'
import { releaseYear } from './releaseYear'

it.each([
  ['', ''],
  ['1999-10-15', '1999'],
  ['2024-01-01', '2024'],
])('%s tarihi için %s döner', (date, expected) => {
  expect(releaseYear(date)).toBe(expected)
})
```

İlk görevde test tablosunu sen yazacaksın. İkinci görevde hazır tabloya bakarak film kartı etiketini tamamlayacaksın: boş tarih bu kez yalnız yıl stringini değil, ekranda görünen parantezi de etkiliyor.

## Sık hata

:::mistake
Yalnızca tek veri satırı `it.each` kullanmayı haklı çıkarmaz. Çok farklı kuralları tek tabloda toplamak hata mesajlarını anlamsızlaştırır.
:::

:::sector
Veri tabloları, parse/format gibi saf fonksiyonların örnek uzayını küçük ve okunur tutar.
:::
