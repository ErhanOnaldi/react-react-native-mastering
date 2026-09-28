---
title: "Render nedenlerini ayır"
minutes: 18
kind: concept
---

# Render nedenlerini ayır

:::pain[Problem]
Kullanıcı film arama kutusuna tek bir harf yazıyor. Ekranda sadece input kutusundaki metin değişmeli ve belki sonuç listesi filtrelenmelidir. Ancak React DevTools Profiler'ı açıp baktığında dehşete düşüyorsun: sayfanın en üstündeki tema değiştirici buton, yan paneldeki "Bugünün İstatistikleri" kartı, alt kısımdaki sabit telif hakkı yazısı ve henüz hiçbir verisi değişmemiş olan kategori rozetleri... Sayfadaki 24 farklı bileşenin tamamı o tek bir tuş basışıyla baştan sona yeniden çalıştırılmış!

Bir geliştirici bu tabloyu gördüğünde genelde panikle her bileşenin başına `memo()` yazmaya başlar. Fakat kod bir süre sonra okunamaz hale gelir, bazı bileşenler memo'ya rağmen render olmaya devam eder, bazıları ise güncellenmesi gerektiğinde eski veri gösterir. Bir yangını söndürmek için önce ateşin nereden çıktığını bilmelisin.
:::

:::model[Render → commit → effect]
Modül 3'te kurduğumuz render-commit ayrımını hatırla:

![Render ve commit aşamaları](diagram:render-commit)

Bir bileşenin "render edilmesi" demek, doğrudan tarayıcı DOM'unun baştan çizilmesi demek **değildir**. Render, React'in o bileşen fonksiyonunu çağırıp elindeki güncel props ve state ile yeni bir JSX (Virtual DOM) ağacı üretmesidir. Ardından React bu yeni ağacı öncekiyle karşılaştırır (reconciliation). Eğer DOM'da değişen bir şey yoksa, commit aşamasında DOM'a tek bir satır dahi yazılmaz.

Fakat sorun şudur: 50 bileşenin fonksiyonunu her tuşta gereksiz yere çalıştırmak, sanal ağaçlar üretmek ve bunları karşılaştırmak bile başlı başına ciddi bir JavaScript CPU yüküdür.
:::

## Render tetikleyicileri ve memo sınırları

Bir React bileşeni durup dururken render edilmez. Bir bileşenin fonksiyonunun yeniden çağrılmasının arkasında daima **dört kesin nedenden biri** yatar.

Aşağıdaki diyagram, bu dört tetikleyiciyi ve `memo` sınırının bunlara nasıl tepki verdiğini özetler:

![Render tetikleyicileri ve memo sınırları](diagram:render-nedenleri)

Zihinsel modelini şu dört temel kural üzerine kur:

### 1. Kendi State Değişimi (`setState`)
Bir bileşenin içinde tanımlı olan bir `useState` veya `useReducer` güncellendiğinde (`setter` çağrıldığında), React o bileşeni güncelleme kuyruğuna alır.
- **Kural:** Kendi state'i değişen bir bileşen **kesinlikle render edilir**.
- Hiçbir `memo`, `useMemo` veya optimizasyon tekniği bir bileşenin kendi state güncellemesiyle render edilmesini engelleyemez (ve engellememelidir).

### 2. Üst Bileşenin Render Olması (Parent Render)
React'in varsayılan ve en çok yanlış anlaşılan davranışıdır:
- **Kural:** Bir üst (ebeveyn) bileşen render edildiğinde, varsayılan olarak onun altındaki **tüm çocuk bileşenler de yeniden çağrılır**.
- Çocuğun aldığı proplar hiç değişmemiş olsa bile, hatta çocuk bileşen hiç prop almıyor olsa bile bu kural geçerlidir!
- **`memo` sınırı tam burada devreye girer:** Eğer bir çocuk bileşeni `React.memo` ile sarmalamışsan, React üst bileşen render olduğunda çocuğa bakar: *"Eski props ile yeni props yüzeysel olarak (`Object.is`) eşit mi?"*. Eşitse, çocuğun render fonksiyonunu çağırmayı atlar (skip).

:::model[State snapshot]
Modül 3'ten hatırla: Her render kendi props ve state fotoğrafını görür.

![Her render kendi snapshot değerini görür](diagram:state-snapshot)

Üst bileşen render olduğunda çocuklarına yeni JSX elemanları döndürür. `memo` yoksa React bu elemanların içine girip fonksiyonlarını çalıştırmak zorundadır.
:::

### 3. Context Tüketimi (`useContext`)
Bir bileşen bir React Context'e abone ise (`useContext(ThemeContext)` gibi):
- **Kural:** Provider'ın sağladığı `value` referansı değiştiğinde, o Context'i okuyan **tüm tüketici bileşenler render edilir**.
- **Kritik kural:** `React.memo`, Context değişimini **durduramaz!** Bir bileşen `memo` ile sarılmış olsa ve dışarıdan aldığı props hiç değişmemiş olsa dahi, tükettiği Context güncellendiğinde `memo` perdesini deler ve render olur.

:::model[Context yayılımı]
Modül 5'te gördüğümüz model:

![Provider değeri değişince tüm tüketiciler render olur](diagram:context-yayilimi)

Context değeri değiştiğinde aradaki memo sınırları önemsizdir; aboneliği olan her düğüm uyanır.
:::

### 4. `key` Değişimi (Kimlik Sıfırlama)
React'te `key` bir kimlik etiketidir.
- **Kural:** Bir bileşenin `key` değeri değişirse, React o bileşenin konumunu aynı kabul etmez. Eski bileşeni tamamen DOM'dan ve bellekten söker (unmount), sıfırdan yepyeni bir bileşen örneği oluşturur (mount).
- **Kritik kural:** `key` değiştiğinde bileşenin tüm yerel state'i sıfırlanır, efektleri temizlenip baştan çalışır. `memo` burada da tamamen etkisizdir.

:::model[Ağaç ve kimlik]
Modül 3'te kurduğumuz model:

![State ağaçtaki konuma ve key değerine bağlıdır](diagram:agac-ve-kimlik)

Aynı konumda farklı bir key görmek, React için "bu eskiyi at, bana yenisini kur" emridir.
:::

## Dört durumun adım adım iz sürümü

Şimdi bu dört farklı tetikleyicinin sistemde nasıl davrandığını adım adım bir tabloda karşılaştıralım:

| Tetikleyici Olay | Hangi Bileşen Başlatır? | Alt Çocuklar (Varsayılan) | `memo` ile Sarılı Alt Çocuk | Context Tüketen `memo`'lu Çocuk |
|---|---|---|---|---|
| **Yerel State Güncellemesi** | Bileşenin kendisi | Render edilir | Render edilir (eğer propları değiştiyse) | Render edilir |
| **Üst Bileşen Render'ı** | Ebeveyn bileşen | **Render edilir** | **ATLANIR (Render olmaz)** | Proplar aynıysa **ATLANIR** |
| **Context Değeri Değişimi** | Kök Provider | Render edilir | Render edilir | **RENDER EDİLİR (memo durduramaz)** |
| **`key` Değişimi** | Ebeveyn bileşen | Sıfırdan mount edilir | Sıfırdan mount edilir | Sıfırdan mount edilir (state uçar) |

Bu tablodan çıkarılacak en hayati sonuç şudur: Bir optimizasyona başlamadan önce, bileşenin **neden** render olduğunu tam olarak teşhis etmelisin. Eğer bileşen bir Context yüzünden render oluyorsa ona `memo` eklemek hiçbir işe yaramaz. Eğer bileşen üst bileşenin gereksiz state'i yüzünden render oluyorsa, çözüm bazen `memo` bile değil, state'in yerini değiştirmektir.

## Kod örneği: Sipariş paneli filtreleme

Şimdi bir sipariş yönetim panelinde bu sorunu ve iki farklı çözüm yolunu inceleyelim.

### Kırık yaklaşım: State'i gereksiz yere en tepede tutmak

Bir panel düşün: Kullanıcı arama kutusuna müşteri adı yazıyor. Yanında ise sipariş istatistiklerini gösteren bir özet kutusu var (`SummaryBadge`).

```tsx
// YANLIŞ: Her tuş vuruşunda SummaryBadge gereksiz yere çalışır
export function OrderDashboard() {
  const [customerFilter, setCustomerFilter] = useState('')

  return (
    <main>
      <h1>Sipariş Yönetimi</h1>
      
      {/* Bu input her değiştiğinde OrderDashboard render olur */}
      <input
        value={customerFilter}
        onChange={(e) => setCustomerFilter(e.target.value)}
        placeholder="Müşteri ara..."
      />

      {/* SummaryBadge müşteri filtresiyle hiç ilgilenmiyor!
          Ama OrderDashboard render olduğu için SummaryBadge de render edilir! */}
      <SummaryBadge totalOrders={1250} />
      
      <OrderList filter={customerFilter} />
    </main>
  )
}

function SummaryBadge({ totalOrders }: { totalOrders: number }) {
  // Pahalı bir biçimlendirme veya ikon hesaplaması yaptığını varsayalım
  return <div className="badge">Toplam Sipariş: {totalOrders}</div>
}
```

Bu örnekte kullanıcı her harfe bastığında `OrderDashboard` baştan sona render edilir. `SummaryBadge` bileşeni `totalOrders={1250}` prop'unu sabit olarak almasına rağmen, varsayılan kural gereği (Ebeveyn render olduğu için) her tuşta yeniden çalıştırılır.

### Doğru yaklaşım 1: memo ile sınır çekmek

Eğer bileşen yapısını değiştiremiyorsan, `SummaryBadge` bileşenini `memo` ile sararak üst bileşenin render dalgasını durdurabilirsin:

```tsx check
import { memo, useState } from 'react'

interface SummaryBadgeProps {
  totalOrders: number
  onBadgeRender?: () => void
}

// memo: Props değişmediği sürece üst bileşenin render'ını yut!
export const MemoSummaryBadge = memo(function SummaryBadge({
  totalOrders,
  onBadgeRender,
}: SummaryBadgeProps) {
  onBadgeRender?.()
  return <div className="badge">Toplam Sipariş: {totalOrders}</div>
})

export function OrderDashboard() {
  const [customerFilter, setCustomerFilter] = useState('')

  return (
    <main>
      <h1>Sipariş Yönetimi</h1>
      <input
        value={customerFilter}
        onChange={(e) => setCustomerFilter(e.target.value)}
        placeholder="Müşteri ara..."
      />
      {/* totalOrders sabit kaldığı için MemoSummaryBadge render edilmez! */}
      <MemoSummaryBadge totalOrders={1250} />
      <p>Aktif filtre: {customerFilter}</p>
    </main>
  )
}
```

### Doğru yaklaşım 2: State'i aşağı itmek (Push state down)

Sektördeki en usta React geliştiricileri genellikle `memo` yazmadan önce şu soruyu sorar: *"Bu state gerçekten bu kadar yukarıda mı durmalı?"*.

Arama inputunu ve onun yerel state'ini kendi küçük bileşenine taşırsan, üst bileşeni hiç render etmezsin:

```tsx check
import { useState } from 'react'

function SearchInput({ onSearch }: { onSearch: (val: string) => void }) {
  const [query, setQuery] = useState('')

  return (
    <input
      value={query}
      onChange={(e) => {
        setQuery(e.target.value)
        onSearch(e.target.value)
      }}
      placeholder="Müşteri ara..."
    />
  )
}

export function CleanOrderDashboard() {
  // Dashboard'un kendisi artık her harfte render olmaz!
  return (
    <main>
      <h1>Sipariş Yönetimi</h1>
      <SearchInput onSearch={(val) => console.log('Arama:', val)} />
      {/* SummaryBadge artık memo'ya bile ihtiyaç duymaz! Çünkü ebeveyni render olmuyor! */}
      <StaticBadge totalOrders={1250} />
    </main>
  )
}

function StaticBadge({ totalOrders }: { totalOrders: number }) {
  return <div className="badge">Toplam Sipariş: {totalOrders}</div>
}
```

State'i aşağı ittiğinde `CleanOrderDashboard` bileşeni tuş vuruşlarından tamamen yalıtılır. Dolayısıyla ne `StaticBadge` ne de diğer kardeş bileşenler render edilir. Sıfır `memo` maliyetiyle mükemmel bir performans elde edilir.

## Sınır durumları ve sık yapılan hatalar

:::mistake[1. Render ile DOM güncellemesini aynı şey sanmak]
- **Belirti:** "Bileşen render oldu ama sayfadaki DOM hiç değişmedi, o zaman bu render zararsızdır" yanılgısı.
- **Neden:** React diffing algoritması DOM'u koruyabilir; ancak o bileşen fonksiyonunun içindeki döngüler, nesne üretimleri ve JSX ağacı her seferinde CPU ve bellek tüketir. Ağaçta 200 bileşen varsa, DOM değişmese bile 200 fonksiyonun çağrılması arayüzü dondurur.
- **Düzeltme:** Ağır alt ağaçları ya `memo` ile koru ya da state'i sadece ihtiyaç duyan alt düğüme taşı.
:::

:::mistake[2. Context tüketen bileşeni korumak için memo eklemek]
- **Belirti:** `const UserAvatar = memo(...)` yazdın; ancak auth context'inde alakasız bir alan (örneğin son oturum süresi) güncellendiğinde avatar bileşeni yine de render oluyor.
- **Neden:** `memo` sadece ebeveynden gelen props değişimlerini engeller. Bir bileşen `useContext` ile bir depoya bağlıysa, o deponun `value` değeri değiştiğinde `memo` filtresi tamamen devre dışı kalır.
- **Düzeltme:** Context değerini böl (Context splitting) veya bileşeni ikiye ayır: veriyi üstte oku, yalnızca gereken alanı prop olarak memo'lu çocuğa aktar.
:::

:::mistake[3. Kararsız key kullanarak bileşeni sürekli sıfırlamak]
- **Belirti:** Arama yaparken liste elemanlarının animasyonları bozuluyor, içlerindeki açık/kapalı durumları (yerel state) sıfırlanıyor.
- **Neden:** `<ListItem key={Math.random()} />` veya dizi indeksi (`key={index}`) kullanıldığında, liste filtrelendikçe elemanların key değerleri değişir.
- **Düzeltme:** Key olarak daima verinin benzersiz ve değişmeyen kimliğini (`item.id`) kullan. Key kimliktir; kimlik değişirse React nesneyi baştan yaratır.
:::

:::sector[Sektörde nasıl kullanılır?]
Büyük ölçekli kurumsal React projelerinde mimarlar şu altın kuralı uygular:

1. **State Colocation (State'i yerelleştirme):** Bir state verisi yalnızca bir alt formda veya inputta kullanılıyorsa, asla sayfa seviyesine veya küresel store'a kaldırılmaz. State olabildiğince ağacın en alt yaprağına yakın tutulur.
2. **Component Composition ile Render Kurtarma:** Bir üst bileşenin içinde state değişiyorsa ama bazı alt çocukların render olması istenmiyorsa, o çocuklar üst bileşene `children` prop'u olarak dışarıdan verilir:
   ```tsx
   <ScrollContainer>
     <ExpensiveChart /> {/* ScrollContainer render olsa bile ExpensiveChart render olmaz! */}
   </ScrollContainer>
   ```
   Çünkü `ExpensiveChart` ebeveynin JSX'inde bir kez oluşturulmuştur ve referansı aynı kalır.
:::

## Özet

- Bir bileşenin render olması için 4 kesin neden vardır: (1) Kendi state'inin değişmesi, (2) Üst bileşeninin render olması, (3) Tükettiği Context değerinin değişmesi, (4) `key` değerinin değişmesi.
- Varsayılan olarak ebeveyn render olduğunda tüm çocuklar da çağrılır. `React.memo` yalnızca bu ebeveyn-çocuk render dalgasını durdurabilir.
- `React.memo`, Context değişimlerini veya `key` değişikliklerini durduramaz.
- `memo` eklemeden önce daima state'in yerini sorgula: State'i aşağı itmek (push state down), genellikle `memo` yazmaktan daha temiz ve kesin bir çözümdür.

### Kendini yokla

1. **Soru:** `const Card = memo(function Card() { ... })` tanımlı bir bileşen var. Bu bileşenin hiçbir prop'u değişmediği halde bir kullanıcı tıklamasında render olduğunu gördün. Olası iki nedeni nedir?
   - **Cevap:** (1) Bileşenin kendi içinde bir `useState` güncellemesi tetiklenmiştir, ya da (2) Bileşen içinde `useContext` ile okunan bir Context değeri değişmiştir.

2. **Soru:** Bir listedeki elemanlara `key={Math.random()}` verilirse `React.memo` bu elemanların gereksiz render olmasını engelleyebilir mi?
   - **Cevap:** Hayır, engelleyemez. Her render'da yeni bir rastgele key üretileceği için React eski bileşen örneğini tamamen yok eder (unmount) ve sıfırdan yeni bir bileşen üretir (mount).
