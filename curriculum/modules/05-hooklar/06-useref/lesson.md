---
title: "Odak ve render dışı küçük bellek"
minutes: 15
kind: concept
---

# Odak ve render dışı küçük bellek

Sinema'daki arama alanına tıklamadan yazmaya devam etmek istediğini düşün. Bir düğmeye basınca tarayıcının imlecini arama alanına taşıyabiliriz; bunun için ekranda gösterilecek yeni bir bilgi yok.

## Önce gerçek input'a ulaş

Tarayıcının ekrandaki gerçek HTML elemanlarına **DOM** (Document Object Model) deriz. React normalde bu elemanları bizim için günceller; bazen odak vermek gibi küçük bir iş için elemana doğrudan ulaşmamız gerekir.

`useRef`, render'lar arasında aynı küçük nesneyi saklayan React Hook'udur. Bu nesnenin `.current` alanına bir DOM elemanı bağlayabiliriz. `?.` yazımı alan `null` ise metodu çağırmadan devam eder; eleman hazır olduğunda `focus()` çalışır. İlk örnek bir kupon alanına odak verir:

```tsx check
import { useRef } from 'react'

export function CouponFocus() {
  const couponRef = useRef<HTMLInputElement>(null)

  function focusSearch() {
    couponRef.current?.focus()
  }

  return (
    <div>
      <button type="button" onClick={focusSearch}>Kupon gir</button>
      <input ref={couponRef} aria-label="İndirim kuponu" />
    </div>
  )
}
```

`useRef<HTMLInputElement>(null)` başlangıçta boş olabilecek bir input referansı oluşturur. React gerçek input'u ekrana yerleştirdiğinde onu `couponRef.current` alanına koyar; düğme tıklanınca tarayıcının `focus()` metodunu çağırır.

Odak vermek ekrandaki yazıyı veya düğme sayısını değiştirmez, yalnızca tarayıcıya hangi alana yazılacağını söyler. Bu yüzden ref kullanımı yeni bir render başlatmamalıdır.

## Aynı ref, başka bir DOM işi

Biraz daha farklı kullanımda, kullanıcı oyuncu listesini açmak için düğmeye basar ve sayfa kadro bölümüne kayar. Yeni fikir yalnızca ref'in bağlı olduğu DOM metodudur:

```tsx
import { useRef } from 'react'

export function CastJump() {
  const castRef = useRef<HTMLElement>(null)

  return (
    <>
      <button onClick={() => castRef.current?.scrollIntoView()}>
        Oyunculara git
      </button>
      <section ref={castRef}>
        <h2>Oyuncular</h2>
      </section>
    </>
  )
}
```

`castRef` bu kez input yerine `section` elemanını işaret eder. Tıklama sırasında tarayıcı sayfayı o bölüme kaydırır; arayüz içeriği değişmediği için state güncellemesine ihtiyaç yoktur.

`useState` ile `useRef` arasındaki fark burada görünür: state değişince React yeni bir render planlar; `ref.current` değişince React render etmez. Ekranda yeni bir metin ya da koşullu alan görünmesi gerekiyorsa state seç; DOM düğümüne ulaşmak gerekiyorsa ref düşün.

![Ref ve state'in hangi bilgiler için uygun olduğunu gösteren ayrım](diagrams/ref-state-ayrimi.svg "State görünür veriyi, ref render dışı işaretçiyi taşır.")

## Render'dan sonra DOM hazır olur

React, bileşen fonksiyonunu çalıştırıp JSX'i hesapladığında buna **render** deriz. Hesaplanan değişikliği gerçek DOM'a uyguladığı adıma **commit** denir. Render sırasında ref henüz `null` olabilir; commit'ten sonra React bağlı elemanı `.current` alanına yazar.

| Adım | Ne olur? | Ref değeri / sonuç |
| --- | --- | --- |
| 1. Render | `<input ref={searchRef} />` hesaplanır | `searchRef.current` henüz `null` olabilir |
| 2. Commit | React input'u DOM'a koyar ve ref'i bağlar | `searchRef.current` input'u gösterir |
| 3. Tıklama | Handler `searchRef.current?.focus()` çağırır | Tarayıcı input'a odak verir |
| 4. Sonuç | Kullanıcı yazabilir | Yeni render gerekmez |

Bu sıra, optional chaining'in neden yararlı olduğunu açıklar: bileşenin ilk hesaplanması ile gerçek DOM elemanının hazır olması aynı an değildir.

## Ref, önceki render'dan bir değeri de saklar

DOM dışında da ref kullanabiliriz. Örneğin film puanı değişince ekranda güncel puanla birlikte bir önceki puanı göstermek isteyelim. Puanı gösteren asıl değer prop'tur; ref yalnızca önceki puanı hatırlar.

```tsx check
import { useEffect, useRef } from 'react'

export function RatingHistory({ rating }: { rating: number }) {
  const previousRef = useRef<number | null>(null)
  const previousRating = previousRef.current

  useEffect(() => {
    previousRef.current = rating
  }, [rating])

  return <p>Şimdi: {rating} · Önce: {previousRating ?? 'yok'}</p>
}
```

İlk render'da önceki değer henüz yoktur. Ekran commit olduktan sonra effect ref'e o render'ın puanını yazar; sonraki render onu önceki değer olarak okuyabilir. Ref yazımı render'ın içinde değil, effect'te yapılır; böylece render yalnızca okur.

| An | Prop `rating` | `previousRef.current` | Ekran |
| --- | ---: | ---: | --- |
| İlk render | `8` | `null` | Şimdi: 8 · Önce: yok |
| Commit ve effect | `8` | `8` olur | Ekran değişmez |
| Yeni prop ile render | `10` | `8` | Şimdi: 10 · Önce: 8 |
| Commit ve effect | `10` | `10` olur | Ekran değişmez |

Puan `10` geldiği render'da ref hâlâ `8` taşır, bu nedenle bir önceki puanı doğru görürüz. Effect'te ref'i güncel puana çevirince bu değişiklik tek başına render üretmez; ekrandaki `10` zaten yeni prop'tan gelmiştir.

:::mistake[Ref'i ekranda görünen sayacın yerine kullanmak]
**Belirti:** `countRef.current += 1` çalışır ama ekrandaki sayı aynı kalır. **Neden:** Ref değişikliği React'e yeni render gerektiğini bildirmez. **Düzeltme:** Görünen sayaç için `useState` kullan; ref'i ekranda gösterilmeyen önceki değer veya DOM işaretçisi gibi bilgiler için ayır.
:::

Başka bir tuzak da `ref.current` değerini dependency array'e koyup ref değişimini izlemeye çalışmaktır. Ref mutasyonu render başlatmadığından React'in kontrol edeceği yeni bir render olmaz. Bir değişiklik effect'i tetiklemeli veya ekrana yansımalıysa, o değişiklik state olarak modellenmelidir.

:::info[Derinlemesine (isteğe bağlı)]
`setTimeout` ve `setInterval` gibi zamanlayıcıların ID'leri ekranda görünmez; bu ID'leri `useRef` içinde saklayıp gerektiğinde iptal edebilirsin. React 19'da function component `ref` değerini doğrudan prop olarak alabilir; `forwardRef` eski sürümlerde kullanılan sarmalayıcıdır.
:::

## Özet

- `useRef` render'lar arasında `.current` alanı olan aynı nesneyi korur; bu alanı değiştirmek render başlatmaz.
- DOM düğümüne odak vermek veya sayfayı kaydırmak gibi küçük tarayıcı işleri için ref'i JSX'e bağla.
- React commit sırasında DOM ref'ini doldurur; event handler bu referansı güvenle kullanabilir.
- Önceki render değerini saklayabilirsin; render'da oku, yeni değeri effect sonrasında yaz.

**Yeni terimler:**

- **Ref:** Render başlatmadan `.current` alanında bir değeri hatırlayan nesne.
- **DOM:** Tarayıcıdaki HTML elemanlarının temsil edildiği ağaç.
- **Commit:** React'in hesapladığı arayüz değişikliklerini gerçek DOM'a uyguladığı adım.
- **Optional chaining (`?.`):** Değer `null` veya `undefined` ise özellik/metot erişimini güvenle atlayan yazım.

**Kendini yokla:** `ref.current` değişince neden ekrandaki metin kendiliğinden değişmez?

*Cevap:* Ref değişikliği React'e render isteği göndermez; görünür metin için state gerekir.

**Kendini yokla:** `rating` ilk kez `8`, sonra `10` olursa ikinci render'da önceki puan kaçtır?

*Cevap:* `8`; effect, ilk render commit edildikten sonra bu değeri ref'e kaydetmiştir.
