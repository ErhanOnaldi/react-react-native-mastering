---
title: "İlk test: beklenen ile gelen"
minutes: 8
kind: concept
---

# İlk test: beklenen ile gelen

:::pain[Sinema’da ne oldu?]
`formatVote(8)` ekranda `8.0` yerine `8` gösterirse TypeScript şikâyet etmez. Bu küçük sapmayı otomatik olarak nasıl görürsün?
:::

## Sorunu nasıl görürsün?

`describe` ilgili senaryoları gruplar, `it` davranışı adlandırır, `expect` gerçekleşen değeri alır. `toBe` ilkel değerlerin birebir eşitliğini sınar. Test adı bir gereksinim cümlesi olsun.

## Uygulama

Önce veriyi hazırla (**Arrange**), fonksiyonu çağır (**Act**), sonucu karşılaştır (**Assert**). `formatVote(8)` testi doğrudan basamaktır; sonraki test boş tarih gibi başka bir sınırı ele alır.

```ts title="formatVote.test.ts"
import { describe, expect, it } from 'vitest'
import { formatVote } from './formatVote'

describe('formatVote', () => {
  it('tam sayı puanı tek ondalıklı gösterir', () => {
    const vote = 8 // Arrange
    const label = formatVote(vote) // Act
    expect(label).toBe('8.0') // Assert
  })
})
```

Buradaki `'8.0'` bir görüntüleme sözleşmesi. `8` ile `8.0` sayı olarak eşit olsa da string olarak aynı değildir. Önce testte başarısız sonucu görüp sonra doğru sürümü çalıştırmak, assertion’ın gerçekten koruma sağladığını gösterir.

## Sık hata

:::mistake
`it.todo` gelecekteki niyeti gösterir ama güvence sağlamaz. İçinde gerçek `expect` olmayan testler yeşil görünse bile hatayı yakalamaz.
:::

:::sector
Test yazarken önce bozuk sürümde kırıldığını görmek, assertion’ın gerçekten işe yaradığını kanıtlar.
:::
