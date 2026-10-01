---
title: "Ölç, düzelt, yeniden ölç"
minutes: 12
kind: practice
---

# Ölç, düzelt, yeniden ölç

Bu iki alıştırmada aynı katalogda iki ayrı şeyi izleyeceksin: arama hesabının kaç kez çalıştığını ve kaç satırın DOM'da (tarayıcının sayfa öğeleri ağacında) bulunduğunu. Birincisi hesaplama işini, ikincisi ekrana kurulan öğe sayısını anlatır. Birini azaltmak ötekini kendiliğinden azaltmaz.

:::model[Render tetikleyicileri ve memo sınırları]
State değişince bileşen yeniden render olur. `useMemo`, hesaplamayı yalnızca girdileri değiştiğinde yeniden yapar; doğru girdileri dışarıda bırakırsan sonuç eski kalır. Aşağıdaki alıştırmalarda sayaç state'i hesaplamanın girdisi değil, arama ise girdidir.
:::

![Render nedenlerini ve memo sınırlarını gösteren akış](diagram:render-nedenleri)

## Önce küçük hesabı ayır

Bir film listesindeki eşleşme sayısını düşün. `useMemo`, sonucu başlıklara ve sorguya bağlar:

```tsx check
import { useMemo, useState } from 'react'

export function MatchCount({ titles }: { titles: string[] }) {
  const [query, setQuery] = useState('')
  const [clicks, setClicks] = useState(0)
  const matches = useMemo(
    () => titles.filter((title) => title.toLowerCase().includes(query.toLowerCase())),
    [titles, query],
  )

  return (
    <section>
      <input aria-label="Film ara" value={query} onChange={(event) => setQuery(event.target.value)} />
      <button onClick={() => setClicks((n) => n + 1)}>Sayaç: {clicks}</button>
      <p>{matches.length} eşleşme</p>
    </section>
  )
}
```

Sayaç tıklanınca bileşen render edilir ama `titles` ve `query` aynı kaldığı için filtre tekrar çalışmaz. Sorgu değişince filtre yeniden hesaplanır; sayaçla arama farklı işlerdir.

Türkçe film adlarında büyük-küçük harf karşılaştırması yaparken `toLocaleLowerCase('tr')` kullan; böylece `I`, `İ`, `ı` ve `i` Türkçe kurallarına göre eşleşir.

## Arama yazarken sırayı izle

`useDeferredValue`, değerin güncel halini korurken o değere bağlı ağır ekran güncellemesini sonraki bir render'a bırakır. Mesela input hemen yazılan harfi gösterir, büyük film listesi yeni sorguya yetişirken React başka işleri tamamlayabilir:

```tsx check
import { useDeferredValue, useState } from 'react'

export function SearchPreview() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  return (
    <section>
      <input aria-label="Film ara" value={query} onChange={(event) => setQuery(event.target.value)} />
      <p>Yazılan: {query} / Liste sorgusu: {deferredQuery}</p>
    </section>
  )
}
```

`M` yazarken iki değer ilk anda kısa süre farklı olabilir. `deferredQuery` daha sonra `M` olur; ertelenen şey input değeri değil, ona bağlı daha ağır güncellemedir.

| Adım | Olay | Input state'i | Ertelenen sorgu | Ne görürsün? |
|---|---|---|---|---|
| 1 | Sayfa açılır | `''` | `''` | Boş arama |
| 2 | `M` yazılır | `M` | Bir an `''` kalabilir | Input hemen `M` gösterir |
| 3 | Liste güncellenir | `M` | `M` | Sonuçlar `M` ile eşleşir |

Bu fark neden var? Input'un her tuşta yanıt vermesi gerekir; büyük listenin her ara çizimi aynı öncelikte olmak zorunda değildir. Ertelenen sorguyu filtre hesabının girdisi yaparsan sonuç yine güncel sorguya göre hesaplanır.

## Sonra DOM'daki işi say

Bir listeyi sıradan `map` ile çizmek her eşleşen filmi DOM'a ekler. Sanallaştırma (virtualization), uzun listenin yalnızca ekranda görünen aralığını ve yakınındaki birkaç satırı DOM'da tutar. 500 film ve 40 piksellik satır için tüm kaydırma alanı yaklaşık 20.000 piksel olabilir; aynı anda yalnızca küçük bir pencere çizilir.

```ts check
const rowHeight = 40
const viewportHeight = 240
const visibleRows = Math.ceil(viewportHeight / rowHeight)
const totalHeight = 500 * rowHeight
// visibleRows: 6, totalHeight: 20000
```

Altı satır ekranda görünür; küçük bir tampon kaydırma sırasında boşluk oluşmasını azaltır. Listenin toplam yüksekliği korunur, ama yüzlerce görünmeyen satır gerçek DOM öğesi olarak durmaz. Bu hesap filtre hesabından ayrıdır: doğru sonuç dizisi üretmek yetmez, o dizinin tamamını DOM'a çizmemek de gerekir.

Alıştırmaları sırayla yap: önce ilgisiz sayaç hareketinde filtre çağrılarını karşılaştır; sonra arama sonucunun değiştiğini doğrula. Ardından sanal listede hem satır sayısını hem tek eşleşme ve boş eşleşme durumlarını gözle.

:::mistake[Az çağrı, eski sonuç]
Filtre daha az çağrılır ama sorgu değişince sonuç değişmezse, gerçek bir girdi bağımlılıklardan çıkarılmıştır. Başlıkları ve güncel liste sorgusunu hesaplamaya bağla; yalnızca ilgisiz sayaç state'ini dışarıda tut.
:::

:::mistake[Doğru sonuç, çok DOM satırı]
Arama doğru başlıkları bulduğu halde yüzlerce `listitem` varsa filtreleme çalışıyordur, fakat liste sanallaştırılmıyordur. DOM satır sayısını ayrı ölç ve sanal pencerenin sayısını filtrelenmiş sonuçtan üret.
:::

## Özet

- Filtre çağrı sayısı ile DOM satır sayısı iki ayrı ölçüdür.
- `useMemo` hesabı gerçek girdilerine bağlar; sayaç gibi ilgisiz state'i dahil etmezsin.
- `useDeferredValue` inputu anında güncel tutup ağır liste güncellemesini erteleyebilir.
- Sanallaştırma toplam kaydırma alanını korurken ekranda olmayan satırları DOM'dan çıkarır.

**Terimler**

- **DOM:** Tarayıcının sayfa öğelerini tuttuğu ağaç.
- **Sanallaştırma:** Uzun listenin yalnızca görünen çevresini DOM'da tutma tekniği.
- **Ertelenen değer (`deferred value`):** Önceliği daha düşük bir ekranda kullanılan, güncel değerin gerisinden gelebilen değer.

**Kendini yokla**

1. Sayaç artınca filtre sayısı değişmemeli, ama arama değişince neden değişmeli? **Cevap:** Sayaç filtre girdisi değildir; sorgu ise eşleşmeleri belirler.
2. 500 sonuç doğru hesaplandığı halde listede yüzlerce satır görüyorsan neyi ölçersin? **Cevap:** DOM'daki satır sayısını; hesaplama optimizasyonu listeyi sanallaştırmaz.
