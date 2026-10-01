---
title: "Klavye ve focus döngüsü"
minutes: 18
kind: concept
---

# Klavye ve focus döngüsü

Sinema'da fragman penceresini açtığını düşün. Klavye kullanıcısı Tab'a basınca arkadaki arama alanına geçerse, pencere ekranda açık olsa bile klavye orada değildir. Focus, klavyeden sıradaki etkileşimin nereye gideceğini gösteren tarayıcı konumudur. Dialog açılıp kapanırken bu konumun izini sürmemiz gerekir.

## Açılışta focus'u içeri al

Tarayıcı o anda etkin olan öğeyi `document.activeElement` üzerinden verir. Dialog açılmadan hemen önce bu öğeyi saklayıp, açıldığında ilk anlamlı kontrole focus verebiliriz:

```tsx check
import { useEffect, useRef } from 'react'

export function TrailerPanel({ open }: { open: boolean }) {
  const playRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (open) playRef.current?.focus()
  }, [open])
  return open ? <button ref={playRef}>Fragmanı izle</button> : null
}
```

`open` true olunca React düğmeyi DOM'a koyar, sonra effect çalışır ve focus düğmeye taşınır. `?.` ref henüz boşsa hata vermeden çağrıyı atlar. Burada bir kusur var: dialog kapanınca focus'u açan kontrole döndürmüyoruz. İlk adım açılış konumunu düzeltir; kapanış için önceki öğeyi de saklamamız gerekir.

## Kapanınca geldiğin yere dön

Önceki öğe dialog kapanana kadar sayfada kalmış olabilir. `isConnected`, bir DOM öğesinin hâlâ belgeye bağlı olup olmadığını söyler. Bağlı değilse ona focus vermek işe yaramaz; örneğin liste güncellenince açan film kartı kaldırılmış olabilir.

```tsx check
import { useEffect, useRef } from 'react'

export function TrailerPanel({ open }: { open: boolean }) {
  const returnToRef = useRef<HTMLElement | null>(null)
  const playRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    returnToRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    playRef.current?.focus()
    return () => {
      if (returnToRef.current?.isConnected) returnToRef.current.focus()
    }
  }, [open])
  return open ? <button ref={playRef}>Fragmanı izle</button> : null
}
```

Dialog kapanınca effect'in cleanup'ı önceki öğeyi kontrol edip focus'u geri verir. `isConnected` false ise yeni bir yere zorla focus vermek yerine tarayıcının mevcut akışını koruruz. Gerçek bir dialogda içerideki ilk focus hedefi başlık da olabilir; uzun açıklama varsa başlığı `tabIndex={-1}` yapıp başlangıç hedefi seçebilirsin. Bu başlığı normal Tab sırasına eklemez.

## Tab sınırını yönet

Dialog içindeki etkileşimli öğeleri `querySelectorAll` ile bulduğunda bir **NodeList** alırsın: DOM sorgusunun döndürdüğü öğe koleksiyonu. Bu sorgunun sonucu statiktir; sonradan eklenen düğmeler listeye kendiliğinden girmez. İçerik değişebiliyorsa tuş işlendiği sırada güncel listeyi yeniden bul.

Dialogdaki ilk ve son kontrole yalnızca sınırda müdahale edeceğiz. Bu davranışa **focus trap** denir: Tab ve Shift+Tab ile klavye odağının dialog dışına çıkmasını engelleyen döngü. Bütün Tab sırasını elle kurmayız; aradaki sırayı tarayıcıya bırakırız.

| Tuş / olay | Önceki focus | Sonraki focus | Neden |
| --- | --- | --- | --- |
| Dialog açılır | Fragmanı aç | Oynat | Başlangıç odağı dialog içinde |
| Tab | Oynat | Altyazı dili | Aradaki sırayı tarayıcı yönetir |
| Tab | Altyazı dili | Kapat | Aradaki sırayı tarayıcı yönetir |
| Tab | Kapat | Oynat | Son sınırda ileri hareket sarar |
| Shift+Tab | Oynat | Kapat | İlk sınırda geri hareket sarar |
| Escape | Dialog içi öğe | Fragmanı aç | Kapanışta focus geri döner |

![Fragmanı açan öğeden modal içindeki kontroller boyunca ilerleyen ve kapanınca geri dönen focus akışı](diagrams/focus-dongusu.svg "Açılış, trap ve focus iadesi")

Keydown olayında `event.key === 'Tab'` ve `event.shiftKey` değerlerine bakarsın. Son öğedeyken ileri, ilk öğedeyken geri hareketi durdurup (`preventDefault`) karşı uca focus verirsin. Diğer Tab tuşlarını durdurma; böylece tarayıcı doğal sırayı korur. Tek focusable öğe varsa iki sınır da aynı öğeye döner. Hiç öğe yoksa boş listenin ilk veya son elemanına erişmeye çalışma; dialog başlığını başlangıç hedefi yap.

## Güncel kapatma işleviyle dinleyici kur

Document'a eklenen klavye dinleyicisi, React bileşeninin dışındaki tarayıcıya abone olur. Listener'ı eklediğin fonksiyonun aynısını cleanup'ta kaldırmalısın. `useEffectEvent`, effect içindeki olay fonksiyonunun en güncel prop ve state değerlerini okumasını sağlar; callback prop her render'da yenilense de listener'ı yeniden kurdurmaz.

```tsx check
import { useEffect, useEffectEvent } from 'react'

export function useDismissOnEscape(open: boolean, onDismiss: () => void) {
  const dismiss = useEffectEvent(() => onDismiss())
  useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') dismiss()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])
}
```

`open` false iken listener kurulmaz. Açılınca effect aynı `handleKeyDown` fonksiyonunu ekler; Escape geldiğinde `dismiss` o anki `onDismiss` prop'unu çağırır. Dialog kapanınca ya da bileşen kaldırılınca cleanup aynı fonksiyonu kaldırır. Bu Hook yalnızca Escape dinlemesini gösterir; açılış focus'u, Tab sınırları ve focus iadesi ayrı davranışlardır.

## Bir focus döngüsünü baştan sona izle

Modal klavye akışı dört anı tek bir kullanıcı işi gibi ele alır: açılış, içeride gezinme, kapatma ve geri dönüş. Açılışta `activeElement` saklanır; dialog DOM'a eklendikten sonra başlangıç kontrolü focus alır. Tuş dinleyicisi sınırları yönetir. Kapanınca listener temizlenir ve açan öğe hâlâ bağlıysa focus ona verilir.

:::model[Render → commit → effect]
React önce hangi öğelerin DOM'da olacağını belirler, sonra DOM'u günceller; effect bundan sonra çalışır. Bu yüzden dialog açılış focus'unu, dialog henüz DOM'a eklenmeden vermeye çalışma. Kapanış cleanup'ında da önceki öğenin hâlâ bağlı olup olmadığını denetle.
:::

## Gerçek bir hata ve düzeltmesi

Sadece ilk düğmeye focus vermek yeterli gibi görünür:

```tsx
useEffect(() => {
  if (open) firstButton.current?.focus()
}, [open])
```

Belirti: ilk Tab'dan sonra klavye odağı sayfanın arkasındaki bağlantılara gider; Escape sonrası da açan düğmeye dönmez. Sebep, açılış odağını taşımanın Tab sınırlarını ve focus iadesini kendiliğinden kurmamasıdır. Dialog açıkken uçlarda iki yönlü sarma, Escape/Kapat ile kapanma ve cleanup'ta focus iadesi ekle. Sadece Escape listener'ı yazıyorsan onu da cleanup'ta kaldır; kapalı pencerede eski listener çalışmamalı.

:::mistake[Belirti: dialog kapanınca focus sayfanın başına düşüyor]
Açılıştaki `document.activeElement` saklanmamış ya da saklanan öğe artık DOM'da değildir. Önceki öğeyi ref'te tut ve focus vermeden önce `isConnected` olup olmadığını kontrol et.
:::

:::mistake[Belirti: Escape dialog kapalıyken de çalışıyor]
Document listener'ı cleanup'ta kaldırılmamış veya farklı bir fonksiyon referansı kaldırılmaya çalışılmıştır. Setup ve cleanup'ta aynı handler'ı kullan.
:::

:::mistake[Belirti: Shift+Tab ile focus arkaya kaçıyor]
İleri Tab sınırı sarılmış, fakat geri yöndeki sınır unutulmuştur. İlk kontrolde Shift+Tab'ı yakalayıp son kontrole sar.
:::

:::sector
Üretimde Radix, React Aria ve Base UI gibi erişilebilir UI kütüphaneleri modal davranışının zor köşelerini kapsayan hazır bileşenler sunar. Yine de kullandığın dialogun açılış, iki yönlü Tab dolaşımı, kapatma ve focus iadesi akışını klavyeyle denemek gerekir.
:::

## Özet

- Dialog açılmadan önce aktif öğeyi sakla; dialog DOM'a geldikten sonra focus'u anlamlı başlangıca taşı.
- Tab ve Shift+Tab'ı yalnızca dialogun iki sınırında sar; aradaki sıralamayı tarayıcıya bırak.
- Kapanışta listener'ı kaldır ve önceki öğe hâlâ bağlıysa focus'u ona döndür.
- İçerik değişebiliyorsa focusable öğeleri güncel DOM'dan bul; statik NodeList kendiliğinden güncellenmez.
- `useEffectEvent` olay geldiğinde güncel callback'i çağırır; effect'in gerçek girdisi olan `open` dependency olarak kalır.

**Yeni terimler**

- **Focus trap:** Tab ve Shift+Tab odağının dialog dışına çıkmasını engelleyen sınır döngüsü.
- **`isConnected`:** Bir DOM öğesinin hâlâ belgeye bağlı olup olmadığını gösteren özellik.
- **NodeList:** DOM sorgusunun döndürdüğü öğe koleksiyonu; `querySelectorAll` sonucu statiktir.
- **`useEffectEvent`:** Effect içindeki olay fonksiyonunun en güncel prop ve state'i okumasını sağlayan Hook.

**Kendini yokla:** Son düğmedeyken Tab'a basıldığında neden `preventDefault()` çağırırsın?

*Cevap:* Tarayıcının dialog dışına ilerlemesini durdurup focus'u ilk düğmeye sarabilmek için.

**Kendini yokla:** Cleanup'ta neden `returnToRef.current?.isConnected` kontrol edilir?

*Cevap:* Açan öğe sayfadan kaldırılmış olabilir; artık belgeye bağlı olmayan öğeye focus verilemez.
