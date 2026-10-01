---
title: "Slot ile tek DOM öğesini koru"
minutes: 16
kind: concept
---

# Slot ile tek DOM öğesini koru

Film kartında zaten bir “Fragmanı aç” button'ı var. Bunu dialog tetikleyicisinin içine koyarsan iki kez button üretmek kolaydır; önce neden bunun sorun olduğunu, sonra davranışı child öğeye nasıl ekleyeceğini görelim.

## Button'ı button içine koyma

```tsx check
function Trigger({ children }: { children: React.ReactNode }) {
  return <button type="button">{children}</button>
}

<Trigger><button type="button">Fragmanı aç</button></Trigger>
```

Bu kod bir button'ı diğerinin içine koymaya çalışıyor. HTML'de etkileşimli button'ları iç içe kullanmak geçerli değildir; tarayıcı yapıyı onarabilir ve klavyeyle gezinirken beklenmedik duraklar görebilirsin. İstediğimiz, davranışı eklerken child'ın gerçek DOM öğesini korumak.

## Child elementini kullan

Bir **Slot**, kendi sarmalayıcı DOM öğesini eklemeden davranışı child öğeye aktaran component yaklaşımıdır. `asChild` seçeneği açıkken Trigger kendi button'ını üretmek yerine child elementini kullanır. Bu durumda child button ise button, link ise link olarak kalır.

Slot tek bir React elementini hedeflemelidir. `Children.only` React'ın `children` değerinin tam olarak bir element olup olmadığını doğrular; metin, `null` veya kardeş elementler gelirse erken ve açık bir hata verir. `cloneElement`, var olan bir React elementini yeni props'larla kopyalar; DOM'u derinlemesine birleştirmez, yalnızca verilen props'ları elemente ekler ya da değiştirir.

```tsx check
import { Children, cloneElement } from 'react'
import type { ReactElement } from 'react'

function withFilmHint(children: ReactElement<{ 'aria-describedby'?: string }>) {
  const child = Children.only(children)
  return cloneElement(child, { 'aria-describedby': 'film-hint' })
}
```

Burada child'ın elementi kalır, ama dialogla ilgili açıklama id'si ona eklenir. Bu örnek click, class ve ref kurallarını henüz birleştirmiyor; `cloneElement` otomatik ve evrensel bir merge yapmaz. Hangi prop'un korunacağı ya da ekleneceği Slot API'sinin açık kararı olmalıdır.

## İki click handler'ını sırayla çalıştır

Child'ın click handler'ı analitik kaydı veya kendi kontrolünü yapıyor olabilir; Trigger'ın da dialogu açması gerekir. Event üzerinde `preventDefault()` çağrısı yapıldığında `defaultPrevented` true olur. Slot child handler'ını önce çalıştırıp bu işareti kontrol ederek açılışı iptal edilebilir kılabilir.

```tsx check
import { cloneElement } from 'react'
import type { MouseEvent, ReactElement } from 'react'

function addOpenAction(child: ReactElement<{ onClick?: (event: MouseEvent<HTMLButtonElement>) => void }>, open: () => void) {
  return cloneElement(child, {
    onClick: (event: MouseEvent<HTMLButtonElement>) => {
      child.props.onClick?.(event)
      if (!event.defaultPrevented) open()
    },
  })
}
```

İlk olarak child'ın handler'ı çalışır; iptal işareti yoksa `open` çağrılır. İki davranış da tek button üzerinde kalır. `stopPropagation()` üst component'lere event'in yayılmasını durdurur, ama `defaultPrevented` işaretini kurmaz; açılışı iptal etme sözleşmesi için doğru kontrol `defaultPrevented`'dır.

Bir event sırası kararı dışarıdan küçük görünebilir ama component API'sinin anlamını belirler. Child önce çalışırsa doğrulama veya iptal davranışını uygulayabilir. Ters sıra açılışı önce yapar ve child'ın kararını geçersiz bırakır.

## Props'ları türüne göre birleştir

Props'ları tek spread ile sıraya koymak kolaydır; fakat bütün alanların kuralı aynı değildir. `className` değerlerini birlikte tutmak gerekir. `aria-label` child'da zaten varsa onun anlamlı adı korunmalı; yoksa Trigger kendi adını verebilir. `onClick` iki fonksiyonu sırayla çağırır. `ref` ise aynı gerçek DOM node'una iki kullanıcının da erişmesini sağlamalıdır.

```tsx check
import { useCallback, useRef } from 'react'

function PosterButton() {
  const childNode = useRef<HTMLButtonElement>(null)
  const logNode = useCallback((node: HTMLButtonElement | null) => {
    console.log('Button DOM öğesi:', node)
  }, [])
  const setBothRefs = useCallback((node: HTMLButtonElement | null) => {
    childNode.current = node
    logNode(node)
  }, [logNode])

  return <button ref={setBothRefs}>Fragmanı aç</button>
}
```

Callback ref, DOM öğesi oluştuğunda node'u alan fonksiyondur; kaldırıldığında `null` alır. Burada tek callback hem button'un kendi ref ihtiyacını hem başka davranışın node ihtiyacını karşılıyor. React 19'da `ref` function component'e normal prop olarak gelebilir; dolayısıyla yeni component'lerde her ref için `forwardRef` sarmalayıcısı gerekmez.

Bir Slot bu parçaları bir araya getirirken child'ın `href`, `type` veya erişilebilir adını gelişigüzel ezmemeli. Link başka sayfaya götürme anlamı taşır; modal açma gibi bir eylem için button daha uygundur. Aynı renkte görünmeleri bu iki anlamı eşitlemez.

## Bir click olayını sırayla izle

Child button ölçüm yapıyor, Trigger ise dialogu açıyor olsun. Kullanıcı click ettiğinde beklenen sıra şöyledir:

| Sıra | Ne çalışır? | Ne olur? |
| --- | --- | --- |
| 1 | Child button'ın click olayı başlar | Olay tek gerçek DOM button'ında gerçekleşir |
| 2 | Child handler'ı çalışır | Kayıt tutabilir veya `preventDefault()` çağırabilir |
| 3 | Slot `defaultPrevented` değerine bakar | İptal varsa açılış atlanır |
| 4 | İptal yoksa Trigger'ın davranışı çalışır | Dialog açılır |
| 5 | React günceller | Aynı öğenin props ve ref'i korunur |

Sıra değişirse davranış da değişir: Trigger önce açarsa child sonradan iptal etse bile dialog açılmış olur. Bu nedenle event handler'larını birleştirmek, yalnızca iki fonksiyonu saklamak değil; önce-sonra politikasını açıkça seçmektir.

**Gerçek bir yanlış:** `{...child.props, ...triggerProps}` yazınca Trigger'ın `onClick`'i child'ın handler'ını silebilir; ters sıra da Trigger davranışını silebilir. Belirti, child'ın kaydı ya da dialog açılışından birinin hiç çalışmamasıdır. Alanları türüne göre birleştir: event'leri sırala, class'ları ekle, erişilebilir adı koru ve ref'leri aynı node'a bağla.

:::mistake[Belirti: Child çalışıyor ama dialog açılmıyor]
Belirti → Kart düğmesinin kendi handler'ı çalışıyor, Trigger'ın davranışı kayboluyor.\
Neden → Props kopyalanırken bir `onClick` diğerinin üstüne yazılmış.\
Düzeltme → Child handler'ını ve Trigger davranışını tanımlı sırada birlikte çağır.
:::

:::mistake[Belirti: Simge düğmesi adsız hale geliyor]
Belirti → Ekran okuyucu button için ad duymuyor.\
Neden → Slot `aria-label` değerini ezmiş ya da child'ın adını korumamış.\
Düzeltme → Child erişilebilir ad vermişse onu kullan; vermemişse Trigger'ın adını aktar.
:::

Slot'ın işi “her prop'u kopyala” değildir. Tek child'ın semantiğini ve DOM kimliğini koruyup yalnızca gereken davranışları açık kurallarla eklemektir. Props çakışması arttıkça Slot yerine davranış ve görünüm API'sini ayrı tasarlamak daha anlaşılır olabilir.

:::info[Derinlemesine (isteğe bağlı)]
Callback ref'ler React 19'da temizleme fonksiyonu da döndürebilir. Gerçek bir Slot kütüphanesi bu yeni biçimi ve eski `forwardRef` kullanan component'leri ayrıca sınamalıdır; burada temel fikir, ilgili ref'lerin aynı node'u almasıdır.
:::

## Özet

- Slot child'ı sarmalamaz; etkileşimli öğe sayısını ve child'ın semantiğini korur.
- `Children.only` tek element sınırını doğrular; `cloneElement` yalnızca belirtilen props'ları ekler veya değiştirir.
- Click handler'larının sırası ve `preventDefault()` politikası davranışı belirler.
- Class, erişilebilir ad, handler ve ref alanları aynı şekilde birleştirilmez.
- Callback ref node'u alır; birden çok ref aynı gerçek node'a bağlanabilir.

**Yeni terimler:**

- **Slot:** Sarmalayıcı eklemeden child element üzerinde davranış sağlayan component yaklaşımı.
- **`Children.only`:** `children` içinde tam bir React elementi bulunduğunu doğrulayan API.
- **`cloneElement`:** Var olan React elementini ek props'larla yeniden oluşturan API.
- **Callback ref:** DOM node'u bağlandığında veya kaldırıldığında node'u alan fonksiyon.

**Kendini yokla:** Child handler `preventDefault()` çağırırsa Trigger ne yapmalı? *Cevap:* Child handler'ından sonra `defaultPrevented` kontrol edilmeli ve açma davranışı atlanmalı.

**Kendini yokla:** Slot neden child button'ın üstüne ikinci button koymamalı? *Cevap:* İç içe etkileşimli öğeler geçersiz ve klavyede kafa karıştırıcı davranış doğurur.
