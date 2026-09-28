---
title: "Bir düğme içinde başka düğme"
minutes: 14
kind: concept
---

# Bir düğme içinde başka düğme

:::pain[Belirti]
Mevcut bir kart düğmesini modalın tetikleyicisi içine yerleştiriyorsun. Ekranda tek düğme gibi görünse de DOM'da `<button><button>Fragmanı aç</button></button>` var. Tab sırası şaşıyor; click iki farklı davranışa gidebiliyor.
:::

## Sarmalayıcı yerine aynı DOM öğesi

Bir davranış component'i kendi `<button>` elementini üretirken kullanıcı da child olarak bir `<button>` verirse etkileşimli HTML iç içe geçer. HTML kuralları button içinde başka button'a izin vermez. Tarayıcının bu yapıyı onarması veya event'leri işlemesi beklenmedik hale gelebilir; klavye kullanıcısı iki durak duyabilirken görselde tek kontrol görebilir.

Slot yaklaşımı davranış component'inin kendi DOM kabını üretmemesini sağlar. `asChild` seçeneğinde tek React element child'ı klonlanır ve Trigger'ın davranışları onun props'larına aktarılır. Sonuçta DOM'da child'ın semantiği korunur: button button kalır, link link kalır. Bu, önceki dersteki headless ayrımın daha ileri biçimidir; davranış paylaşılırken HTML etiketini de çağıran seçer.

Kurallar:

1. **Varsayılan öğe erişilebilir olmalı.** Trigger kendi öğesini üretirse doğal `<button type="button">` kullanır.
2. **`asChild` tam bir React elementi ister.** String, null veya birden fazla sibling tek DOM hedefi olamaz; yanlış girdi açık hata vermeli.
3. **Child'ın kimliği ve semantiği korunur.** Slot button'u ikinci bir button ile sarmalamaz; verilen link'in href ve link rolü kaybolmaz.
4. **Props açık bir politikayla birleştirilir.** Trigger `aria-label` getiriyorsa child'ın anlamlı adı varsa ezilmemeli; class değerleri ihtiyaç doğrultusunda birleşmeli.
5. **Event handler sırası tanımlanır.** Child'ın handler'ı önce çalışabilir; `preventDefault()` ortak davranışı iptal edebilir.
6. **Ref tek DOM düğümünü gösterir.** Child ve davranış component'i aynı gerçek öğeye ref almalıdır; object ve callback ref biçimleri düşünülür.

`cloneElement` mevcut React elementini yeni props'larla üretir. Bu işlem derin bir DOM birleştirmesi yapmaz: `className`, `onClick`, `aria-*` ve `ref` gibi her alan için hangi değerin öncelikli olduğu tasarım kararıdır. Props'ları `{...child.props, ...slotProps}` diye yaymak child'ın handler'ını ezer. Ters sıra da Trigger'ın erişilebilir adı gibi değerleri silebilir. Sadece bir spread sırası değiştirerek tüm alanlara aynı birleştirme kuralını uygulamak mümkün değildir.

Bir Slot'ın child'ı yalnızca görsel kabuk değil, çoğu zaman odaklanabilir gerçek kontrol olur. Üst component `disabled`, `type` veya `aria-expanded` gibi bir prop aktarıyorsa child'ın zaten verdiği değerle çakışma politikasını belirle. Örneğin bir linki button gibi devre dışı bırakmak doğal `disabled` ile mümkün değildir; o durumda semantik seçimi yeniden düşünmek gerekir. Slot esnekliği arttıkça doğrulanması gereken kombinasyonların sayısı da artar.

## Click olayını sırayla izle

Child button'ın kendi analitik handler'ı ve Trigger'ın açma handler'ı olsun:

| Sıra | Olay | Sonuç |
| --- | --- | --- |
| 1 | Kullanıcı click eder | Child'ın native button davranışı başlar |
| 2 | Slot handler'ı child callback'ini çağırır | Child ölçüm veya doğrulama yapabilir |
| 3 | `defaultPrevented` kontrol edilir | Child iptal ettiyse açma davranışı atlanır |
| 4 | Event iptal edilmediyse Trigger `open` çağırır | Modal state'i değişir |
| 5 | React günceller | Aynı button DOM öğesi ve ref'i korunur |

`stopPropagation()` ile `preventDefault()` aynı şey değildir. Birincisi olayın üst handler'lara yayılmasını durdurur; ikincisi varsayılan davranışı iptal eder ve event üzerinde `defaultPrevented` işaretini kurar. Slot API'si “child açmayı iptal edebilir” diyorsa `defaultPrevented` kontrol etmelidir. Bu kuralı belirsiz bırakırsan kullanıcı hangi handler'ın önce ve hangi koşulla çalıştığını bilemez.

## Kırık ve düzeltilmiş kullanım

Kırık sarmalayıcı çift button üretir:

```tsx
function Trigger({ children }: { children: React.ReactNode }) {
  return <button type="button" onClick={open}>{children}</button>
}

<Trigger><button>Fragmanı aç</button></Trigger>
```

Daha iyi Slot, `asChild` kapalıyken doğal button döndürür; açıkken tek child'ı kullanır. Aşağıdaki küçük örnek, yalnız handler sırasını gösterir:

```tsx check
import { cloneElement, Children } from 'react'
import type { ReactElement, MouseEvent, ReactNode } from 'react'

type ClickableProps = { onClick?: (event: MouseEvent<HTMLElement>) => void }

export function withOpen<T extends ClickableProps>(child: ReactElement<T>, open: () => void) {
  return cloneElement(child, {
    onClick: (event: MouseEvent<HTMLElement>) => {
      child.props.onClick?.(event)
      if (!event.defaultPrevented) open()
    },
  } as Partial<T>)
}

export function oneChild(value: ReactNode) {
  return Children.only(value)
}
```

Bu örnek tam Slot implementasyonu değildir; class, ARIA ve ref birleştirmesini bilerek kapsamıyor. React 19'da `ref` function component'e prop olarak alınabilir. Yeni kodda her ref aktarımı için `forwardRef` sarmalayıcısı zorunlu değildir; fakat birleştirilen ref'in teardown davranışı ve null değeri de doğru yönetilmelidir. UI kütüphanesi yazarken bu sözleşme için test yaz, çünkü ref bir focus veya ölçüm sınırında kullanılır.

Çocuğun props tipi de önemlidir. Slot `ReactElement` kabul edip child'ın click/ref alanları yoksa, React clone sırasında desteklenmeyen prop'lar için uyarı ya da beklenmeyen davranış çıkarabilir. API'nin hangi child prop'larını desteklediğini sınırla ve type assertion'ı ancak çalışma zamanı sözleşmesiyle örtüşüyorsa kullan. Link'e button davranışı aktarıyorsan Space davranışının doğal linkte bulunmadığını unutma; görsel aynı olsa da klavye semantiği farklıdır. Dialog açmak bir eylemse button, başka sayfaya gitmek bir gezinmeyse link seç.

## Belirti → neden → düzeltme

:::mistake[Belirti: Tıklayınca yalnızca child handler çalışıyor]
Belirti → Çocuk kendi kaydını yapıyor ama dialog açılmıyor.  
Neden → Clone sırasında child `onClick`'i Trigger handler'ı tarafından ezilmiş veya tersi olmuş.  
Düzeltme → Handler'ları açıkça sırayla çağır ve `defaultPrevented` politikasını belirle.
:::

:::mistake[Belirti: Trigger'ın erişilebilir adı kayboluyor]
Belirti → Simge button artık ekran okuyucuda adsız.  
Neden → Prop birleştirme Trigger `aria-label`'ını düşürmüş.  
Düzeltme → Child adı varsa onu koru; yoksa Trigger'ın erişilebilir adını aktar.
:::

:::mistake[Belirti: Focus çağrısı yanlış node'a gidiyor]
Belirti → Açılışta ref `null` veya dış sarmalayıcıyı gösteriyor.  
Neden → Child ref'i ve Trigger ref'i birlikte bağlanmamış.  
Düzeltme → Tek gerçek DOM node'u her iki ref'e de ilet; object ve callback ref'i ele al.
:::

:::mistake[Belirti: Slot içine metin gönderince hata]
Belirti → `asChild` ile yalın text geçildiğinde clone işlemi bozuluyor.  
Neden → API tek React elementi gerektirirken text node kabul etmiş.  
Düzeltme → Tek element sözleşmesini açıkça doğrula ve anlaşılır hata mesajı ver.
:::

:::model[DOM erişilebilirlik ağacı]
Slot yalnızca DOM elementinin üretim şeklini değiştirir. Sonuçta oluşan gerçek child öğenin rolü, adı ve durumu hâlâ ekran okuyucunun gördüğü bilgidir. Bu bağlamda Slot'ın yeni yükümlülüğü, doğru semantiği bozmadan davranış eklemektir.
:::

:::sector
Radix Slot gibi primitive'ler compound API'lere mevcut tasarım sistemi öğelerini yerleştirmeyi sağlar. Ekipler her prop'u otomatik birleştirmek yerine özellikle handler, `className`, `aria-*` ve ref kurallarını dokümante eder. Sadece özel davranışın gerçekten DOM etiketinden bağımsız olduğu durumlarda Slot kullan; basit bir button'u gereksiz abstraction ile sarmalama.
:::

## Özet

- Slot, sarmalayıcı etkileşimli DOM yerine tek child element üzerinde davranış kurar.
- Props'lar alan türüne göre birleşir; tek spread sırası yeterli değildir.
- Event sırası ve `preventDefault()` davranışı API sözleşmesidir.
- Ref'ler aynı DOM öğesine bağlanmalı; React 19'da ref prop olarak alınabilir.
- Görsel benzerlik semantik farkı silmez: eylem button, gezinme link'tir.

**Kendini yokla:** `event.stopPropagation()` ile `event.preventDefault()` hangi açıdan farklıdır?  
*Cevap:* Biri üst handler'lara yayılmayı durdurur; diğeri varsayılan davranışı iptal edip `defaultPrevented` değerini işaretler.

**Kendini yokla:** Slot'a neden tek child element şartı koyulur?  
*Cevap:* Davranışın ve ref'in aktarılacağı tek bir gerçek DOM hedefi olması gerekir.
