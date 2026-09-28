---
title: "Odak ve render dışı küçük bellek"
minutes: 15
kind: concept
---

# Odak ve render dışı küçük bellek

:::pain[Problem]
Kullanıcı film detay sayfasında "Kupon Kodu Gir" butonuna tıklıyor. Panel açılıyor ama klavye odağı hâlâ tıklanan butonda kalıyor. Kullanıcının yazmaya başlamak için bir de gidip fareyle metin kutusuna tıklaması gerekiyor. Bu durum klavye kullanan ya da mobilde olan kullanıcılar için can sıkıcı bir deneyim yaratıyor.
:::

## Ref neyi saklar?

`useRef`, bir bileşenin tüm render ömrü boyunca aynı nesne referansını (`{ current: value }`) koruyan bir React hook'udur.

`useState` ile arasındaki en kritik fark şudur: **`ref.current` değerini değiştirmek React'te yeni bir render tetiklemez.**

Bu özellik `useRef`'i iki ana görev için mükemmel bir araç yapar:
1. **Gerçek DOM düğümlerine doğrudan erişmek** (odaklama, kaydırma, boyut ölçme).
2. **Ekranda doğrudan görünmeyen ama render'lar arasında hatırlanması gereken verileri saklamak** (timer ID'leri, önceki prop değerleri, dış kütüphane örnekleri).

![Ref ve state'in hangi bilgiler için uygun olduğunu gösteren ayrım](diagrams/ref-state-ayrimi.svg "State görünür veriyi, ref render dışı işaretçiyi taşır.")

Temel kurallar:

1. **Görünür veri state olmalıdır:** Değeri değiştiğinde arayüzdeki JSX'in değişmesi gerekiyorsa, o bilgi bir `useState` olmalıdır.
2. **Görünmeyen reaktif olmayan bilgi ref olabilir:** Değiştiğinde arayüzün yeniden çizilmesine gerek yoksa ref uygundur.
3. **DOM erişimi için standart yoldur:** Bir DOM elemanına referans almak için `<input ref={myRef} />` deseni kullanılır.
4. **Render gövdesinde ref yazma:** Render saf olmalıdır; `ref.current` değerini render sırasında değiştirmek yan etkidir ve öngörülemeyen sonuçlar doğurur. Güncellemeler olay yöneticilerinde (`onClick`) veya `useEffect` içinde yapılmalıdır.
5. **React 19 ref devrimi:** React 19 ile birlikte kendi fonksiyonel bileşenlerine ref geçirmek için artık `forwardRef` sarmalayıcısına gerek yoktur; `ref` doğrudan bir prop gibi alınabilir.

## Odak akışını zaman çizgisinde izleyelim

DOM odaklaması (focus) saf bir tarayıcı eylemidir; ekranda yeni bir DOM düğümü çizdirmez. Bunu bir state (`isFocused`) ile modellemeye çalışmak gereksiz bir dolambaçtır.

| Aşama | Ne Yapılır? | Render Gerekir mi? |
| --- | --- | --- |
| 1. Render | `<input ref={inputRef} />` JSX'i üretilir | Evet |
| 2. Commit | React, gerçek DOM düğümünü `inputRef.current` içine atar | Hayır |
| 3. Tıklama | Kullanıcı butona basar, handler `inputRef.current?.focus()` çağırır | Hayır |
| 4. Tarayıcı | Tarayıcı klavye imlecini input alanına taşır | Hayır |

Bu akışta arayüzün yeniden render edilmesine hiçbir ihtiyaç yoktur. Ref, tarayıcı DOM API'sine doğrudan ulaşan güvenli bir köprüdür.

## Kırık örnek

Aşağıdaki bileşende buton vardır ancak DOM düğümüne erişim kurulmadığı için buton işlevsizdir:

```tsx
export function CouponFocus() {
  return (
    <div>
      <button type="button">Kupon gir</button>
      <input aria-label="İndirim kuponu" />
    </div>
  )
}
```

Kullanıcı butona bastığında odak input'a geçmez; buton hiçbir şey yapmaz.

## Doğru örnek: DOM düğümüne odaklanmak

Ref'i oluşturup input elemanına bağlıyoruz:

```tsx check
import { useRef } from 'react'

export function CouponFocus() {
  // 1. Ref oluştur (başlangıçta null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFocus() {
    // 3. İhtiyaç anında DOM metodunu çağır (optional chaining ile güvenli)
    inputRef.current?.focus()
  }

  return (
    <div>
      <button type="button" onClick={handleFocus}>
        Kupon gir
      </button>
      {/* 2. React'e bu DOM düğümünü ref'e bağlamasını söyle */}
      <input ref={inputRef} aria-label="İndirim kuponu" />
    </div>
  )
}
```

### Neden `inputRef.current?.focus()`?
İlk render tamamlanmadan önce React henüz DOM düğümünü üretmemiştir; dolayısıyla `inputRef.current` ilk anda `null` değerindedir. Optional chaining (`?.`) kullanarak olası çökmeleri önleriz. React commit aşamasında gerçek DOM elemanını ref'e otomatik olarak atar.

## Önceki değeri hatırlamak (Render-dışı bellek)

Ref yalnızca DOM elemanları için değildir. Bileşenin bir önceki render'da hangi değere sahip olduğunu hatırlamak istediğinde de `useRef` kullanılır.

Örneğin kullanıcının değiştirdiği film puanının bir önceki değerini göstermek isteyelim:

```tsx check
import { useEffect, useRef } from 'react'

export function PreviousRating({ rating }: { rating: number }) {
  // 1. Önceki değeri tutacak ref hücresi
  const prevRatingRef = useRef<number | null>(null)

  // 2. Render anında henüz güncellenmemiş olan önceki değeri oku
  const prev = prevRatingRef.current

  // 3. Commit sonrasında yeni değeri ref'e kaydet
  useEffect(() => {
    prevRatingRef.current = rating
  }, [rating])

  return (
    <p>
      Güncel puan: {rating} (Önceki puan: {prev ?? 'Yok'})
    </p>
  )
}
```

### Zamanlamanın büyüsü:
1. **Render 1 (`rating = 8`):** `prevRatingRef.current` henüz `null`'dır. Ekrana "Güncel puan: 8 (Önceki: Yok)" basılır. Commit biter, effect çalışır ve `prevRatingRef.current = 8` yapılır.
2. **Render 2 (`rating = 10`):** Render çalıştığı anda ref hücresinde hâlâ bir önceki değer olan `8` durmaktadır! `prev = 8` olarak okunur. Ekrana "Güncel puan: 10 (Önceki: 8)" basılır. Commit biter, effect çalışır ve hücreye `10` yazılır.

Eğer `prevRatingRef.current = rating` satırını render sırasında yazsaydık, okuma ile yazma aynı anda gerçekleşir ve önceki değer anında silinirdi.

## Zamanlayıcı (Timer ID) yönetimi

`setTimeout` veya `setInterval` gibi tarayıcı sayaçlarının kimlik numaraları (ID) ekranda kullanıcıya gösterilmez. Bu ID'yi bir `useState`'te saklamak her sayaç başlangıcında gereksiz bir render başlatır.

Ref, zamanlayıcı kimliğini saklamak ve temizlemek için en uygun yerdir:

```tsx
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

function scheduleAutoSave() {
  // Varsa önceki zamanlayıcıyı iptal et
  if (timerRef.current) {
    clearTimeout(timerRef.current)
  }

  // Yeni zamanlayıcı kur ve ID'sini ref'e sakla
  timerRef.current = setTimeout(() => {
    saveData()
    timerRef.current = null
  }, 1000)
}
```

Burada `timerRef.current` değiştiğinde React'in haberdar olmasına gerek yoktur; çünkü arayüzde değişen hiçbir şey yoktur.

## React 19: `ref` artık standart bir prop

React 18 ve öncesinde kendi yazdığın bir özel bileşene (`CustomInput`) dışarıdan `ref` aktarmak için `forwardRef` isimli karmaşık bir sarmalayıcı kullanmak zorundaydın.

React 19 bu zorunluluğu ortadan kaldırdı. Artık `ref`, tıpkı `className` ya da `disabled` gibi sıradan bir prop olarak karşılanabilir:

```tsx
import type { Ref } from 'react'

type InputProps = {
  label: string
  ref?: Ref<HTMLInputElement>
}

// React 19'da doğrudan prop olarak alınabilir:
export function CustomInput({ label, ref }: InputProps) {
  return (
    <label>
      {label}
      <input ref={ref} className="border p-2 rounded" />
    </label>
  )
}
```

Bu modern yaklaşım bileşen kompozisyonunu son derece sadeleştirir.

## Sınır durumları ve sık hatalar

:::mistake[Sık hata: ref.current değerini dependency array'e eklemek]
Belirti → `useEffect(() => { ... }, [inputRef.current])` yazıldığında effect'in ref değişimlerine tepki vermemesi.  
Neden → `ref.current` bir nesne alanıdır ve mutasyona uğraması React'e haber vermez. React dependency dizisini sadece render anında kontrol eder. Ref değişimi render tetiklemediği için React değişimi asla fark edemez.  
Düzeltme → Dependency listesine `ref.current` yazma. Bir değişimin effect tetiklemesi gerekiyorsa o değer `state` olmalıdır.
:::

:::mistake[Sık hata: Render gövdesinde ref'e değer atamak]
Belirti → `ref.current = count + 1` satırının doğrudan bileşen fonksiyonunun içinde çalıştırılması.  
Neden → Render saf bir matematiksel fonksiyon gibi davranmalıdır. Render içinde ref değiştirmek eşzamanlı render (concurrent rendering) sırasında öngörülemeyen tutarsızlıklara yol açar.  
Düzeltme → Ref yazma işlemlerini yalnızca event handler'lar veya `useEffect` içinde gerçekleştir.
:::

:::mistake[Sık hata: Arayüz verisini ref'te saklamak]
Belirti → `scoreRef.current += 1` yapılıyor ama ekrandaki skor sayısı güncellenmiyor.  
Neden → Ref render tetiklemez. Ekranda görünmesi gereken her bilgi React state'i olmak zorundadır.  
Düzeltme → Ekrana yansıyan veriler için `useState` kullan.
:::

:::sector
Büyük ölçekli uygulamalarda `useRef`, harici DOM kütüphaneleriyle entegrasyonun omurgasını oluşturur. Video oynatıcılar (Video.js), zengin metin editörleri (Monaco Editor, TipTap), harita kütüphaneleri (Leaflet, Google Maps) veya animasyon motorları (GSAP) doğrudan bir DOM düğümüne bağlanmak zorundadır. React mühendisleri bu kütüphanelerin örneklerini bileşen ref'lerinde tutar ve unmount anında temizliklerini yine bu ref üzerinden yürütür.
:::

## Özet

- `useRef`, render'lar arasında aynı nesneyi (`{ current }`) koruyan kalıcı bir hücredir.
- `ref.current` değerinin değişmesi bileşeni yeniden render etmez.
- DOM düğümlerine erişim (odaklama, kaydırma, boyut alma) için temel araçtır.
- Timer ID'leri ve önceki render değerleri gibi arayüze basılmayan verileri tutmak için idealdir.
- React 19 ile birlikte özel bileşenler `forwardRef` olmaksızın doğrudan `ref` prop'u alabilir.

**Kendini yokla:** `ref.current` değiştiğinde React bileşeni neden yeniden render etmez?  
*Cevap:* Çünkü ref reaktif bir mekanizma değildir; React'in sanal DOM kuyruğuna güncelleme sinyali göndermeyen düz bir JavaScript nesnesidir.

**Kendini yokla:** `useRef` ile oluşturulan bir referansı neden dependency listesine yazmamalıyız?  
*Cevap:* Çünkü ref mutasyonları render tetiklemediğinden, React'in render döngüsünde bu değişimi yakalaması ve effect'i çalıştırması mümkün değildir.
