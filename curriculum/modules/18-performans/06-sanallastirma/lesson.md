---
title: "500 film, az DOM satırı"
minutes: 16
kind: concept
---

# 500 film, az DOM satırı

:::pain[Problem]
Önceki derslerde gereksiz render'ları durdurdun, pahalı sıralamayı `useMemo` ile sakladın, filtrelemeyi `useDeferredValue` ile erteledin. Ancak arama sonuçlarında 500 film listelendiğinde sayfa hâlâ garip bir şekilde hantal çalışıyor.

Sayfayı fare tekerleğiyle aşağı kaydırmaya (scroll) başladığında ekranın saniyedeki kare hızı (FPS) 60'tan 15'e düşüyor, liste takıla takıla ilerliyor. Mobil cihazda açtığında telefon ısınıyor ve tarayıcı sekmesi aniden çökebiliyor.

Neden? Çünkü kullanıcının telefon ekranında aynı anda sadece 6 ya da 8 tane film kartı sığabilir. Ancak sen DOM'a 500 adet karmaşık kart, 500 resim çerçevesi, 1500 buton ve paragraf yerleştirdin. Kullanıcının henüz görmediği 492 satır için tarayıcının yerleşim (layout) ve boyama (paint) motorunu rehin alıyorsun.
:::

## Sanallaştırma (Virtualization / Windowing) zihinsel modeli

Sanallaştırma tekniğinin arkasındaki fikir son derece basittir: **Yalnızca kullanıcının ekranda o an gördüğü öğeleri DOM'da tut!**

Zihinsel modelini şu temel parçalarla kur:

1. **Görünür Pencere (Viewport):** Kullanıcının ekranda gördüğü sabit yükseklikteki (örneğin 300 piksel) kaydırılabilir dış kutudur (`overflow: auto`).
2. **Toplam Sanal Yükseklik (Total Virtual Height):** Kullanıcıya listenin 500 elemanlı olduğunu hissettiren iç alandır. Her satır 40 pikselse, bu alan `500 * 40 = 20.000 piksel` yüksekliğe ayarlanır. Böylece tarayıcının kaydırma çubuğu (scrollbar) tamamen normal davranır; kullanıcı listenin ne kadar uzun olduğunu anlar.
3. **Pencere Dilimi (Window Slice):** 300 piksellik bir pencereye 40 piksellik satırlardan yaklaşık 8 tanesi sığar. Sanallaştırıcı o anki kaydırma mesafesine (`scrollTop`) bakar ve der ki: *"Kullanıcı şu an 25. ve 33. satırlar arasını görüyor. DOM'a yalnızca bu 8 satırı bas!"*.
4. **Tampon (Overscan):** Kullanıcı sayfayı hızla aşağı kaydırırken boş beyaz alan görmesin diye, görünür aralığın biraz üstünden ve biraz altından fazladan 3–5 satır hazırda tutulur. 500 elemanlık dev bir veri kümesi için DOM'da yaşayan toplam düğüm sayısı asla 20'yi geçmez!

## @tanstack/react-virtual anatomisi

Sektörde en yaygın ve kararlı sanallaştırma aracı `@tanstack/react-virtual` paketidir.

Bir listeyi sanallaştırırken kullanılan temel parametreler şunlardır:

```ts
const virtualizer = useVirtualizer({
  count: items.length, // Toplam eleman sayısı
  getScrollElement: () => parentRef.current, // Dış kaydırma kutusunun DOM referansı
  estimateSize: () => 40, // Her satırın tahmini piksel boyutu
  overscan: 3, // Görünür alanın üstünde/altında hazır tutulacak ekstra satır sayısı
  getItemKey: (index) => items[index].id, // Elemanın kararlı kimliği
})
```

Bu kancanın (hook) ürettiği iki kritik fonksiyon vardır:
- `virtualizer.getTotalSize()`: Tüm listenin kaplayacağı toplam sanal yüksekliği (ör. 20.000 px) piksel olarak döner. İç kapsayıcıya bu yükseklik verilmelidir.
- `virtualizer.getVirtualItems()`: O an DOM'a basılması gereken sanal satırların dizisini döner. Her bir satır nesnesi şunları taşır:
  - `row.index`: Orijinal dizideki elemanın indeksi (`items[row.index]`).
  - `row.start`: Bu satırın listenin en tepesinden itibaren kaçıncı pikselde başlaması gerektiği (`translateY`).
  - `row.size`: Satırın piksel yüksekliği.
  - `row.key`: `getItemKey` tarafından üretilen kimlik.

## Kaydırma sırasında adım adım iz sürelim

500 satırlık bir listede (satır boyu 40px, pencere 240px, overscan 2) kullanıcının kaydırma hareketini adım adım izleyelim:

| Kullanıcı Eylemi | `scrollTop` (px) | Görünür İndeksler | `overscan` Dahil DOM'daki İndeksler | DOM'daki Toplam Satır | Toplam Sanal Yükseklik |
|---|---|---|---|---|---|
| **En tepede duruyor** | `0` | 0 – 5 (6 satır) | **0 – 7 (8 satır)** | **8 adet** | 20.000 px |
| **Biraz aşağı kaydırdı** | `800` | 20 – 25 (6 satır) | **18 – 27 (10 satır)** | **10 adet** | 20.000 px |
| **Listenin ortasına uçtu** | `8.000` | 200 – 205 (6 satır) | **198 – 207 (10 satır)** | **10 adet** | 20.000 px |
| **En sona indi** | `19.760` | 494 – 499 (6 satır) | **492 – 499 (8 satır)** | **8 adet** | 20.000 px |

Farkı görüyor musun? İster 500 film olsun, ister 50.000 film olsun; DOM'daki satır sayısı daima 8 ile 12 arasında sabit kalır! Tarayıcı hiçbir zaman binlerce düğümün yerleşimini hesaplamak zorunda kalmaz. Kaydırma yağı gibi 60 FPS akar.

## Kod örneği: Finansal işlem geçmişi

Şimdi bir bankacılık arayüzünde binlerce satırdan oluşan hesap hareketleri dökümünü sanallaştıralım.

### Kırık yaklaşım: 10.000 satırı doğrudan DOM'a dökmek

```tsx
// YANLIŞ: 10.000 DOM elementi tarayıcıyı kilitler!
export function BrokenTransactionFeed({ transactions }: { transactions: Transaction[] }) {
  return (
    <div style={{ height: 300, overflow: 'auto' }}>
      <ul>
        {transactions.map((tx) => (
          // 10.000 tane <li> elementi aynı anda DOM'a basılıyor!
          <li key={tx.id}>
            <span>{tx.date}</span>
            <span>{tx.merchant}</span>
            <strong>{tx.amount} ₺</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

Bu bileşene 5.000 işlem geldiğinde sayfa saniyelerce yanıt veremez hale gelir.

### Doğru yaklaşım: @tanstack/react-virtual ile sanallaştırma

```tsx check
import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

export interface Transaction {
  id: string
  merchant: string
  amount: number
  date: string
}

interface TransactionFeedProps {
  transactions: Transaction[]
}

export function CleanTransactionFeed({ transactions }: TransactionFeedProps) {
  // 1. Dış kaydırma kapsayıcısının DOM referansı
  const parentRef = useRef<HTMLDivElement>(null)

  // 2. Sanallaştırıcıyı yapılandırıyoruz
  const virtualizer = useVirtualizer({
    count: transactions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48, // Her satır 48 piksel
    overscan: 3, // Görünür alanın dışındaki 3 satırı önceden hazırla
    getItemKey: (index) => transactions[index].id, // Kararlı kimlik
  })

  return (
    <section>
      <h2>İşlem Geçmişi ({transactions.length} Kayıt)</h2>

      {/* Dış Kutu: Sabit yükseklik ve overflow: auto zorunludur! */}
      <div
        ref={parentRef}
        style={{
          height: 300,
          overflow: 'auto',
          border: '1px solid #ccc',
        }}
      >
        {/* İç Kutu: Toplam sanal yükseklik ve relative konumlandırma zorunludur! */}
        <div
          role="list"
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {/* Yalnızca görünür sanal satırlar üzerinde dönüyoruz */}
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const tx = transactions[virtualRow.index]
            return (
              <div
                key={virtualRow.key}
                role="listitem"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`, // Fiziksel piksel konumu
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{tx.merchant}</span>
                <time>{tx.date}</time>
                <strong>{tx.amount} ₺</strong>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

Bu yapıda:
1. `parentRef` kaydırma penceresinin neresi olduğunu sanallaştırıcıya bildirir.
2. `getTotalSize()` iç div'i binlerce piksel büyüterek doğal bir kaydırma çubuğu oluşturur.
3. `getVirtualItems()` yalnızca o anda pencereye giren 8-10 satırı döndürür.
4. `transform: translateY(...)` her satırı sanal listedeki gerçek fiziksel yerine iğneler.

## Sınır durumları ve sık yapılan hatalar

:::mistake[1. Dış kapsayıcıya yükseklik ve overflow vermemek]
- **Belirti:** Sanallaştırıcı çalışmıyor gibi görünüyor; 500 satırın tamamı yine DOM'a basılıyor.
- **Neden:** Eğer dış `div` elemanına sabit bir `height` ve `overflow: auto` vermezsen, div tüm içeriği kadar uzar. Pencere sonsuz olduğu için sanallaştırıcı tüm satırları "görünür alanda" kabul eder.
- **Düzeltme:** Dış kapsayıcıya mutlaka `height: 240px` (veya `h-80` gibi) ve `overflow: 'auto'` ver.
:::

:::mistake[2. Satırlara absolute ve translateY vermeyi unutmak]
- **Belirti:** Sayfayı kaydırdığında satırlar birbirinin üzerine biniyor, siyah bir metin lekesi oluşuyor.
- **Neden:** `virtualRow.start` bir piksel mesafesidir. Satırlara `position: 'absolute'`, `top: 0` ve `transform: translateY(${virtualRow.start}px)` vermezsen, satırlar normal akışta peş peşe dizilir ve listenin en tepesinde birbirlerini ezerler.
- **Düzeltme:** Her sanal satıra mutlaka `position: 'absolute'`, `top: 0`, `left: 0`, `height: virtualRow.size` ve `transform: translateY(...)` uygula.
:::

:::mistake[3. getItemKey fonksiyonunda index kullanmak]
- **Belirti:** Kullanıcı listeyi arama kutusuyla filtrelediğinde, satırlardaki onay kutuları veya açık akordeonlar yanlış filmlere atlıyor.
- **Neden:** `getItemKey` verilmediğinde varsayılan olarak dizi indeksi kullanılır. Liste filtrelendiğinde 0. indekse bambaşka bir film gelir; React eski bileşeni geri dönüştürür (reuse) ve yerel state karışır.
- **Düzeltme:** Daima `getItemKey: (index) => items[index].id` ile verinin gerçek kimliğini bağla.
:::

:::sector[Sektörde nasıl kullanılır?]
Modern web uygulamalarında sanallaştırma olmazsa olmazdır:

- **Sosyal Medya Akışları:** Twitter/X, Bluesky ve Facebook sonsuz akışlarında milyonlarca gönderi yerine ekrandaki 5-6 kartı sanallaştırarak tutar.
- **Büyük Tablolar:** Finansal işlem ekranlarında ve e-tablolarda (Google Sheets, Notion veritabanları) 50.000 satırlık veriler sanallaştırma olmadan tarayıcıda açılamaz bile.
:::

## Özet

- Liste sanallaştırma, binlerce satırlık bir veri kümesinde yalnızca ekranda o an görünen satırları ve küçük bir tamponu DOM'a basma tekniğidir.
- Sanallaştırma ağ isteğini veya veri getirme süresini değiştirmez; tarayıcının DOM, yerleşim ve boyama yükünü sıfıra indirir.
- Dış kapsayıcıda sabit `height` ve `overflow: auto`, iç kapsayıcıda `getTotalSize()` sanal yüksekliği, satırlarda ise `position: absolute` ve `translateY` koordinatı şarttır.
- Satırların kimliğini korumak için `getItemKey` içine mutlaka verinin kalıcı `id` değeri verilmelidir.

### Kendini yokla

1. **Soru:** 1.000 satırlık bir liste sanallaştırıldığında, toplam kaydırma alanının yüksekliğini belirleyen fonksiyon hangisidir?
   - **Cevap:** `virtualizer.getTotalSize()` fonksiyonudur. Her satırın yüksekliğini toplayarak iç kapsayıcıya bu piksel değerini verir.

2. **Soru:** Sanallaştırılmış bir listede satır elementlerine neden `transform: translateY(${row.start}px)` verilir?
   - **Cevap:** Çünkü satırlar `position: absolute` ile en tepeye sabitlenmiştir; `translateY` ile her satır sanal listedeki gerçek dikey piksel konumuna ötelenir.
