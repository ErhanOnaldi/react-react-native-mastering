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

## Çağıranla yapılan anlaşma
`formatVote(vote: number): string` yazınca kart da detay sayfası da sayı göndermek zorundadır. Fonksiyon içinde her dalın string döndüğünü tip kontrolü izler. Bir dalda yanlışlıkla `return 0` bırakırsan hata aynı dosyada görünür. Bu nedenle özellikle başka dosyaların kullandığı fonksiyonlarda açık dönüş tipi faydalıdır.

Varsayılan parametre bir davranıştır. `digits = 1` demek ikinci değer verilmediğinde gerçekten 1 kullanmak demektir. `digits?: number` yalnızca `undefined` olasılığını bildirir; `.toFixed(undefined)` sıfır basamak kullanır; istenen varsayılanı ayrıca belirlemelisin. İki yazım aynı şey değildir.

## Callback tekrar basamağı
İlk örnekte tek sayı biçimlendirdin. Şimdi `movies.map(movie => ...)` içinde aynı fonksiyonu bir listenin her öğesine uygula. Callback'in `movie` tipi, `movies` dizisinin elemanından çıkarılır. Dış fonksiyonda dizi ve dönüş tipini açık yazarken her küçük değişkene tip eklemene gerek yok.

:::mistake
Bir callback'e `movie: any` yazmak yanlış alan adını yeniden sessiz hale getirir. Tipli bir `Movie[]` üzerinden geliyorsa çıkarımı kullan.
:::

## Sektörde
Ortak biçimlendirme fonksiyonları kart, arama ve detay ekranının aynı kuralı izlemesini sağlar.
