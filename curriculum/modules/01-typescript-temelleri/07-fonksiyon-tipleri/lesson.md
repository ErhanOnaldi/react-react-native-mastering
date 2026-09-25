---
title: Fonksiyon tipleri
minutes: 8
kind: concept
---

# Fonksiyon tipleri

:::pain[Problem]
Sinema'daki aynı puan biçimlendirmesini kartta ve detayda kopyaladın. Birinde sayı, diğerinde metin gönderilince çıktılar ayrıştı.
:::

## Sözleşme yaz
Parametre ve dönüş tipi fonksiyonun dışarıya verdiği sözdür. Varsayılan parametre hem davranışı hem çıkarılan tipi belirler; callback parametreleri de çağrıldığı bağlamdan çıkarılabilir.

```ts check
function formatVote(vote: number, digits = 1): string {
  return vote === 0 ? 'Henüz oy yok' : vote.toFixed(digits)
}
const values = [7.456, 8]
const labels = values.map((value) => formatVote(value))
void labels
```

`digits?: number` yerine `digits = 1` yazmak varsayılanı gerçekten uygular. Açık dönüş tipi yanlışlıkla sayı döndürmeyi erken yakalar.

:::mistake
Callback'e gereksiz `any` yazma. `Movie[]` üzerinden `map` kullanırken `movie` tipi zaten bilinir.
:::

## Sektörde
Ortak biçimlendirme fonksiyonları kart, arama ve detay ekranının aynı kuralı izlemesini sağlar.
