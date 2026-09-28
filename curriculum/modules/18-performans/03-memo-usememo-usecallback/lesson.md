---
title: "Memo gerçekten ne zaman gerekir?"
minutes: 17
kind: concept
---

# Memo gerçekten ne zaman gerekir?

:::pain[Problem]
Geliştirdiğin katalog sayfasında 500 ürün listeleniyor. Her ürün için karmaşık bir iskonto ve vergi algoritması çalıştırılıyor. Kullanıcı arayüzün sağ üst köşesindeki "Karanlık Mod" anahtarına dokunuyor. Ekranda sadece arka plan renginin siyah olması gerekirken, tarayıcı 350 milisaniye boyunca kilitleniyor.

Kullanıcı arama yapmadı, ürün listesi değişmedi, fiyatlar aynı kaldı; ancak tema state'i değiştiği için tüm sayfa baştan render oldu ve 500 ürünün ağır matematiksel hesaplaması gereksiz yere tekrar çalıştırıldı. Daha da kötüsü: bir geliştirici "Ben kartları `memo()` ile sarmıştım, neden yine çalıştılar?" diye soruyor. Çünkü kartlara her render'da satır içi yeni bir fonksiyon (`onSelect={() => ...}`) aktarılıyordu.
:::

:::model[Render nedenleri ve memo sınırları]
Önceki derste kurduğumuz modeli hatırla:

![Render tetikleyicileri ve memo sınırları](diagram:render-nedenleri)

Bir üst bileşen render olduğunda, altındaki çocuk bileşenlerin propları değişmemiş olsa bile çocuklar da yeniden çağrılır. `React.memo` bu dalgayı durdurabilir; ancak tek bir şartla: **Çocuğa aktarılan tüm propların referans eşitliği (`Object.is`) korunmalıdır!**
:::

## Üç aracın kesin anatomisi ve zihinsel modeli

React performans optimizasyonunda üç ayrı araç sunar. Bu araçlar birbirinin yerine geçmez; her biri problemin farklı bir halkasını çözer:

### 1. `React.memo(Component)` — Bileşen render'ını atlamak
- **Ne iş yapar:** Bir React bileşenini sarar. Ebeveyn bileşen render olduğunda, çocuğun aldığı proplar öncekiyle yüzeysel olarak eşitse (`prevProps[key] === nextProps[key]`), çocuğun fonksiyonunu tekrar çalıştırmayı atlar (skip).
- **Ne zaman işe yarar:** Çocuk bileşen çok büyük bir alt ağaç içeriyorsa ve ebeveyni sık sık render oluyorsa.
- **Nasıl bozulur:** Ebeveyn çocuğa her render'da yeni bir nesne referansı (`{}`), yeni bir dizi (`[]`) veya yeni bir fonksiyon (`() => {}`) geçirirse `memo` anında çöker; çünkü `{} === {}` her zaman `false`'tur!

### 2. `useMemo(() => value, [deps])` — Hesaplanan değeri saklamak
- **Ne iş yapar:** Bir fonksiyonun ürettiği değeri (sayı, dizi, nesne) belleğe alır (memoize eder). Bağımlılık dizisindeki (`deps`) değerler değişmediği sürece o fonksiyonu bir daha çalıştırmaz; önceki sonucu döndürür.
- **Ne zaman işe yarar:** 
  1. Gerçekten CPU tüketen ağır hesaplamalarda (örneğin binlerce öğelik dizileri sıralama, filtreleme, karmaşık veri dönüştürme).
  2. `memo` ile sarılmış bir alt bileşene aktarılan bir nesne veya dizi prop'unun referansını sabit tutmak gerektiğinde.

### 3. `useCallback(fn, [deps])` — Fonksiyon referansını sabitlemek
- **Ne iş yapar:** Bir fonksiyonun kendisini bellekte tutar. `useMemo(() => fn, [deps])` yazmanın kısa yoludur.
- **Kritik kural:** `useCallback` fonksiyonun çalışma hızını artırmaz! İçindeki kodu hızlandırmaz. Yalnızca o fonksiyonun **bellek adresini (referansını)** render'lar arasında sabit tutar.
- **Ne zaman işe yarar:** `memo` ile sarılmış bir alt bileşene prop olarak bir event handler (örneğin `onSelect`, `onToggle`) verirken, alt bileşenin `memo` kontrolünü kırmamak için kullanılır.

## Bir sayfa etkileşiminde adım adım iz sürelim

Bir ürün kataloğunda kullanıcının tema değiştirmesi ve ardından yeni bir ürün eklemesi durumunda bu üç aracın birlikte nasıl çalıştığını izleyelim:

| Render Döngüsü | Tetikleyici | `products` Değişti mi? | `useMemo(filterProducts)` | `useCallback(onSelect)` | `MemoCard` Davranışı |
|---|---|---|---|---|---|
| **Render 1 (İlk açılış)** | Sayfa yüklendi | Evet (ilk veri) | Hesaplandı (~40 ms) | Fonksiyon üretildi (Ref A) | 500 kart render edildi |
| **Render 2** | `setTheme('dark')` | **HAYIR** | **ATLANDI (0 ms, eski sonuç döndü)** | **ATLANDI (Ref A korundu)** | **500 KART ATLANDI (0 render!)** |
| **Render 3** | Yeni ürün eklendi | **EVET** | Yeniden hesaplandı (~42 ms) | Bağımlılığı yoksa Ref A korundu | Yalnızca verisi değişen kartlar çizildi |

Render 2 anına dikkat et: Tema değiştiğinde `useMemo` sayesinde 40 ms'lik ağır filtreleme atlandı. `useCallback` sayesinde kartlara iletilen fonksiyonun referansı değişmedi. Kartlar da `memo` ile korunduğu için 500 kartın hiçbiri render edilmedi! Ekran anında karanlık moda geçti.

:::model[Closure ve bayat değer]
Modül 5'te kurduğumuz tehlikeli tuzağı hatırla:

![Callback fonksiyonu oluştuğu render'ın değerlerini yakalar](diagram:closure-bayat-deger)

`useCallback` kullanırken bağımlılık dizisini eksik bırakırsan (`[]`), fonksiyon ilk render'ın değişkenlerini closure içine hapseder. Kullanıcı arama filtresini değiştirse bile callback hâlâ eski filtre değeriyle işlem yapar (stale closure).
:::

## Kod örneği: Cihaz listesi ve ping sıralaması

Şimdi bir sistem izleme panelinde sunucu cihazlarının gecikme sürelerine (ping) göre sıralanmasını inceleyelim.

### Kırık yaklaşım: Referans eşitliğini her render'da bozan kod

```tsx
// YANLIŞ: memo hiçbir işe yaramaz, hesaplama her tuşta tekrarlanır
export function DeviceMonitor({ devices }: { devices: Device[] }) {
  const [filterText, setFilterText] = useState('')
  const [refreshCount, setRefreshCount] = useState(0)

  // 1. Ağır sıralama her sayaç artışında boş yere baştan çalışır!
  const sorted = devices.sort((a, b) => a.ping - b.ping) // Üstelik giriş dizisini mutasyona uğratıyor!

  return (
    <div>
      <button onClick={() => setRefreshCount((c) => c + 1)}>Yenile {refreshCount}</button>
      <input value={filterText} onChange={(e) => setFilterText(e.target.value)} />

      {sorted.map((device) => (
        // 2. Her render'da yeni inline ok fonksiyonu aktarılıyor!
        // DeviceCard memo ile sarılmış olsa bile props değişti sanacak!
        <DeviceCard
          key={device.id}
          device={device}
          onPing={() => console.log('Ping:', device.id)}
        />
      ))}
    </div>
  )
}
```

Bu kodda `refreshCount` arttığında:
1. `devices.sort` gereksiz yere çalışır ve orijinal diziyi bozar.
2. `onPing` prop'una her döngüde `() => ...` ile yeni bir fonksiyon referansı oluşturulur.
3. `DeviceCard` bileşeni `memo` ile sarılmış olsa dahi, `onPing !== prevProps.onPing` olduğu için tüm kartlar tekrar render edilir.

### Doğru yaklaşım: useMemo, useCallback ve memo uyumu

```tsx check
import { memo, useCallback, useMemo, useState } from 'react'

export interface Device {
  id: string
  name: string
  ping: number
}

interface DeviceCardProps {
  device: Device
  onSelect: (id: string) => void
  onCardRender?: () => void
}

// 1. memo: Props (device ve onSelect) değişmediği sürece render olma!
export const DeviceCard = memo(function DeviceCard({
  device,
  onSelect,
  onCardRender,
}: DeviceCardProps) {
  onCardRender?.()
  return (
    <div className="device-card">
      <span>{device.name}</span>
      <strong>{device.ping} ms</strong>
      <button onClick={() => onSelect(device.id)}>İncele</button>
    </div>
  )
})

export function CleanDeviceMonitor({
  devices,
  onCardRender,
}: {
  devices: Device[]
  onCardRender?: () => void
}) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [counter, setCounter] = useState(0)

  // 2. useMemo: Yalnızca devices dizisi değiştiğinde sırala!
  // Orijinal diziyi bozmamak için [...devices] ile kopya alıyoruz.
  const sortedDevices = useMemo(() => {
    return [...devices].sort((a, b) => a.ping - b.ping)
  }, [devices])

  // 3. useCallback: onSelect fonksiyonunun referansını sabit tut!
  // Fonksiyon bileşen gövdesinde her render'da yeniden üretilmez.
  const handleSelect = useCallback((id: string) => {
    setActiveId(id)
  }, [])

  return (
    <section>
      <button onClick={() => setCounter((c) => c + 1)}>Sayaç: {counter}</button>
      <p>Seçili Cihaz: {activeId ?? 'Yok'}</p>

      <div className="device-list">
        {sortedDevices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            onSelect={handleSelect}
            onCardRender={onCardRender}
          />
        ))}
      </div>
    </section>
  )
}
```

Bu doğru kurguda:
- Kullanıcı sayaca bastığında `CleanDeviceMonitor` render edilir.
- `sortedDevices` referansı `useMemo` sayesinde aynı kalır.
- `handleSelect` referansı `useCallback` sayesinde aynı kalır.
- `DeviceCard` bileşenleri proplarının hiç değişmediğini görür ve tek bir kart dahi render edilmez!

## Sınır durumları ve sık yapılan hatalar

:::mistake[1. Her fonksiyona ve değişkene ezbere useMemo/useCallback eklemek]
- **Belirti:** Kodun her satırında `useCallback` ve `useMemo` var; ancak uygulama daha hızlı değil, aksine daha yavaş ve kod okunamaz.
- **Neden:** `useMemo` ve `useCallback` bedava değildir. React bu hook'lar için bellekte yer ayırır, her render'da bağımlılık dizisindeki öğeleri tek tek karşılaştırır. `const fullName = useMemo(() => first + ' ' + last, [first, last])` gibi ucuz string birleştirmelerde hook'un maliyeti işlemin kendi maliyetinden daha büyüktür!
- **Düzeltme:** Yalnızca ölçülmüş pahalı hesaplamalarda (`>5 ms`) ya da `memo` ile sarılmış çocuklara referans sağlarken kullan.
:::

:::mistake[2. memo'lu bileşene inline nesne veya stil aktarmak]
- **Belirti:** Kartı `memo` ile sardın, fonksiyonu `useCallback` yaptın; ama kart yine de her tuşta render oluyor.
- **Neden:** Karta `<DeviceCard style={{ margin: 8 }} />` veya `options={['aktif', 'pasif']}` şeklinde inline nesne geçiyorsun. Her render'da yeni bir nesne referansı üretilir ve `memo`'nun sığ karşılaştırması (`Object.is`) başarısız olur.
- **Düzeltme:** Sabit nesneleri bileşenin dışına çıkar (`const CARD_STYLE = { margin: 8 }`) ya da `useMemo` ile sar.
:::

:::mistake[3. useCallback içinde eksik bağımlılık ve bayat closure]
- **Belirti:** `const onSave = useCallback(() => api.save(query), [])` yazdın. Kullanıcı inputa yeni bir şey yazıp kaydet butonuna bastığında, sunucuya ilk açılıştaki boş metin gidiyor.
- **Neden:** Bağımlılık dizisi boş (`[]`) olduğu için fonksiyon oluşturulduğu ilk render'ın `query` değişkenini closure içine hapsetti. `query` güncellense bile fonksiyon eski değeri görüyor.
- **Düzeltme:** Fonksiyonun içinde okunan her reaktif değişkeni (props, state) mutlaka bağımlılık dizisine ekle: `[query]`.
:::

:::sector[Sektörde nasıl kullanılır?]
Modern React ekiplerinde performans kuralları şöyledir:

1. **Önce ölç, sonra sar:** Ekip içinde "profiler kanıtı olmadan `useMemo` eklenemez" kuralı konur. 100 elemanlı basit bir dizi filtresi modern tarayıcılarda 0.1 milisaniyedir; `useMemo` gerektirmez.
2. **React Compiler geçişi:** Bir sonraki derste göreceğimiz React Compiler, bu manuel `useMemo`, `useCallback` ve `memo` yazma hamallığını derleme anında otomatik hale getirmektedir. Ancak derleyicinin çalışabilmesi için de saflık ve bağımlılık kurallarını tam olarak anlamış olman gerekir.
:::

## Özet

- `React.memo`, ebeveyn render olduğunda değişmeyen props alan çocuğun render'ını atlar.
- `useMemo`, ağır bir hesaplama sonucunu bağımlılıkları değişene kadar önbelleğe alır.
- `useCallback`, bir fonksiyonu hızlandırmaz; fonksiyon referansını kararlı tutarak `memo`'lu çocukların gereksiz çalışmasını önler.
- `memo`'nun çalışabilmesi için çocuğa iletilen tüm nesne, dizi ve fonksiyon referanslarının kararlı olması zorunludur.
- Bağımlılık dizilerini eksik bırakmak bayat closure (stale value) hatalarına yol açar.

### Kendini yokla

1. **Soru:** `const handleClick = useCallback(() => setCount(count + 1), [])` fonksiyonunda kullanıcı butona 3 kez bastığında sayaç kaç olur? Neden?
   - **Cevap:** Sayaç `1` kalır. Çünkü bağımlılık dizisi boştur; fonksiyon ilk render'daki `count = 0` değerini closure içinde hapsetmiştir ve her tıklamada `setCount(0 + 1)` çağrılır. Çözüm: `setCount((c) => c + 1)` updater fonksiyonu kullanmaktır.

2. **Soru:** `useCallback` tek başına bir fonksiyonun çalışma süresini milisaniye olarak kısaltır mı?
   - **Cevap:** Hayır, kısaltmaz. Fonksiyon çalıştığında yine aynı sürede biter. `useCallback`'in tek görevi fonksiyonun referansını koruyarak `memo` ile sarılmış alt bileşenlerin gereksiz tetiklenmesini engellemektir.
