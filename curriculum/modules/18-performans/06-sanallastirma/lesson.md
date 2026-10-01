---
title: "500 film, az DOM satırı"
minutes: 14
kind: concept
---

# 500 film, az DOM satırı

React’te listeyi `map` ile ekrana basmayı biliyorsun. 500 film için bunu yaptığında, 500 satırın hepsi DOM’a eklenir; DOM, tarayıcının sayfadaki öğeleri tuttuğu ağaçtır. Kullanıcı ekranda bunların yalnızca birkaçını görebilir, ama tarayıcının yine de geri kalan öğeleri de yerleştirmesi gerekir.

## Ekranda görünen kaç satır var?

Basit bir sayı hesabıyla başlayalım. Film satırlarının her biri 40 piksel, kaydırma kutusunun yüksekliği 240 piksel olsun:

```ts
const rowHeight = 40
const viewportHeight = 240
const visibleRows = Math.ceil(viewportHeight / rowHeight)
// 6
```

Bu pencereye aynı anda yaklaşık altı satır sığar. Ama sıradan `movies.map(...)` 500 satırın hepsini DOM’a ekler. **Sanallaştırma** (virtualization veya windowing), ekranda görünen aralığı ve hemen çevresindeki birkaç satırı DOM’da tutup, geri kalanı için boş bir kaydırma alanı ayırma tekniğidir. Böylece kullanıcı uzun liste içinde normal biçimde kaydırırken tarayıcının o an göstermediği yüzlerce satırı kurması gerekmez.

## Uzun liste hissini boş alanla koru

Yalnızca ilk altı satırı DOM’a koyarsan kaydırma çubuğu da altı satır uzunluğunda olur. Kullanıcı listenin sonuna hemen gelir; 500 film varmış gibi hissettirmez. Bunun yerine tüm listenin yüksekliğini temsil eden bir **sanal alan** bırakır, görünen satırları bu alanın içindeki yerlerine koyar.

500 satır × 40 piksel = 20.000 piksel toplam yükseklik. Kullanıcı en başta dururken 0–5. satırlar görünür. Kaydırma konumu 800 piksel olduğunda, 40 piksellik satırlarda yaklaşık 20. satıra gelmiştir. Bu konumlar değiştikçe DOM’a alınacak aralık da değişir.

| Kaydırma konumu | Yaklaşık görünen satırlar | Tamponla DOM’da tutulabilecek aralık | Toplam alan |
|---:|---:|---:|---:|
| 0 px | 0–5 | 0–8 | 20.000 px |
| 800 px | 20–25 | 17–28 | 20.000 px |
| 8.000 px | 200–205 | 197–208 | 20.000 px |
| 19.760 px | 494–499 | 491–499 | 20.000 px |

Görünen satır sayısı yaklaşık altı kalır; listenin başında ve sonunda tampon satır sayısı daha az olabilir. **Overscan**, görünen aralığın önüne ve arkasına hazırlık için eklenen bu satırlardır. Örneğin `overscan: 3`, aşağı kaydırırken yeni satırlar çizilene kadar boşluk görme olasılığını azaltır; değer büyüdükçe aynı anda çizilen DOM satırları da artar.

## Satırları sanal alana yerleştir

Matematiği DOM düzenine çevirelim. İç kapsayıcı 500 × 40 = 20.000 piksel yüksekliğinde durur. O an gereken birkaç satır bu kapsayıcı içinde mutlak konuma yerleştirilip kendi başlangıç pikseline taşınır:

```tsx
<div style={{ height: 20_000, position: 'relative' }}>
  <div style={{
    position: 'absolute',
    top: 0,
    height: 40,
    transform: 'translateY(800px)',
  }}>
    20. filmin satırı
  </div>
</div>
```

Satır normal akışta değildir; bu yüzden her satır kendi hesaplanan konumuna taşınmalıdır. `position: 'absolute'` satırı iç alanın başına sabitler, `translateY` de onu istenen piksel yerine götürür. Sanallaştırıcı, hangi indekslerin pencereye girdiğini ve her birinin kaçıncı pikselde başladığını hesaplar.

Öğrencinin gerçekten yapacağı bir hata, sadece görünen indeksleri `map` etmek ama bu satırlara konum vermemektir. Belirti olarak satırların hepsi aynı yerde üst üste görünür. Neden her satırın normal akış dışında, aynı başlangıç noktasında durmasıdır; her satıra kendi sanal başlangıç değerini `translateY` ile vermek gerekir.

## Tanıtıcı DOM hesabından TanStack Virtual’a

Yukarıdaki hesabı her scroll olayında elle yapmak yerine `@tanstack/react-virtual` paketinin `useVirtualizer` hook’u pencerenin ölçüsünü ve kaydırma konumunu izler. **Hook**, React bileşeninde state ve benzeri davranışları sağlayan, `use` ile başlayan fonksiyondur. Hook’a toplam öğe sayısını, scroll kapsayıcısını ve satır boyu tahminini verirsin. O da toplam alanı ve şu an DOM’da olması gereken satırları döndürür.

Bu örnek Sinema’daki vizyon tarihlerini gösteriyor; satırlar film listesindeki başlık ve kimlik örneğinden farklı olarak tarih bilgisi taşır:

```tsx check
import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

interface Release {
  id: string
  title: string
  date: string
}

export function ReleaseSchedule({ releases }: { releases: Release[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: releases.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 48,
    overscan: 2,
    getItemKey: (index) => releases[index].id,
    initialRect: { width: 320, height: 240 },
  })

  return (
    <div ref={scrollRef} style={{ height: 240, overflow: 'auto' }}>
      <div
        role="list"
        style={{
          height: virtualizer.getTotalSize(),
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((row) => {
          const release = releases[row.index]
          return (
            <div
              role="listitem"
              key={row.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: row.size,
                transform: `translateY(${row.start}px)`,
              }}
            >
              {release.date}: {release.title}
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

`count` toplam satır sayısını; `getScrollElement` scroll edilen dış kutuyu belirtir. `estimateSize` başlangıç için satır yüksekliğini piksel cinsinden söyler. `getTotalSize()` bütün listenin yüksekliğini hesaplar, `getVirtualItems()` ise ekranda ve overscan alanında tutulacak satırları döndürür. Her sanal satırdaki `index`, asıl `releases` dizisindeki kaydı bulur; `start` satırın yukarıdan kaç piksel aşağıya yerleşeceğini söyler.

`getItemKey` için kalıcı film veya kayıt kimliğini kullan. Dizi indeksi sabit kimlik değildir: filtreleme sonrası aynı indeks başka bir filme karşılık gelebilir ve React satırın kimliğini yanlış kayıtla eşleştirebilir.

Kodda `initialRect` ile 320 × 240 başlangıç ölçüsü de verildi. Bu, sanallaştırıcı ilk hesaplamayı yaparken kullanacağı başlangıç dikdörtgenidir. Tarayıcı gerçek kapsayıcı ölçüsünü gözlemleyince onu kullanır; SSR’da ilk görünümü hesaplamak için özellikle yararlıdır. Dış kutunun 240 piksel yüksekliği ve `overflow: 'auto'` ayarı ise tarayıcıya gerçek kaydırma penceresini verir.

## Sık hatalar

:::mistake[Scroll kapsayıcısına yükseklik vermemek]
- **Belirti:** Tüm satırlar görünürmüş gibi sanallaştırıcı çok geniş aralık döndürür.
- **Neden:** Dış kutu içeriği kadar uzar ve sınırlı bir scroll penceresi kalmaz.
- **Düzeltme:** Scroll alanına sabit veya sınırlı bir yükseklik ve `overflow: 'auto'` ver.
:::

:::mistake[Satırları aynı koordinata koymak]
- **Belirti:** Görünen satırlar üst üste yığılır.
- **Neden:** Mutlak konumdaki her satır başlangıçta aynı noktadadır.
- **Düzeltme:** Satır yüksekliğini ve `translateY(row.start)` değerini kullanarak her birini kendi yerine taşı.
:::

:::mistake[Satır kimliği yerine indeksi kullanmak]
- **Belirti:** Liste filtrelenince satıra ait yerel durum başka filme geçmiş gibi görünür.
- **Neden:** Sıralama ya da filtreleme sonrası indeks aynı kalsa da o indeksteki film değişmiştir.
- **Düzeltme:** `getItemKey` fonksiyonundan her filmin kalıcı `id` değerini döndür.
:::

## Özet

- `map` ile normal liste çizmek tüm satırları DOM’a koyar; sanallaştırma yalnız görünen pencereyi ve overscan tamponunu tutar.
- Sanal alan toplam liste yüksekliğini korur; görünen satırlar gerçek piksel konumlarına taşınır.
- `useVirtualizer`, toplam sayıyı, scroll kapsayıcısını ve tahmini satır ölçüsünü kullanarak görünür satırları hesaplar.
- `initialRect` ilk hesapta başlangıç ölçüsü sağlar; tarayıcının gerçek ölçümünün yerini sürekli olarak almaz.
- Satırları gerçek veri kimliğiyle eşleştir ki liste değişince React yanlış satırı yeniden kullanmasın.

**Yeni terimler**

- **DOM:** Tarayıcının sayfadaki HTML öğelerini tuttuğu ve düzenlediği ağaç.
- **Sanallaştırma / windowing:** Büyük listede yalnız pencere çevresindeki satırları DOM’da tutma tekniği.
- **Viewport:** Kaydırılabilir içerikten aynı anda görünen pencere alanı.
- **Overscan:** Kaydırmada boşluk oluşmasını azaltmak için görünür alan çevresinde tutulan ek satırlar.
- **Hook:** React bileşenine state veya başka React davranışları sağlayan `use` ile başlayan fonksiyon.

**Kendini yokla**

1. 500 satır 40 piksel ise sanal alanın yüksekliği yaklaşık kaçtır? **Cevap:** 20.000 piksel.
2. `translateY(row.start)` neden gerekir? **Cevap:** Mutlak konumdaki her satırı kendi sanal dikey konumuna taşır.
