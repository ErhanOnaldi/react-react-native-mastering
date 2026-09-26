---
title: "Klavye ve focus döngüsü"
minutes: 9
kind: concept
---

# Klavye ve focus döngüsü

:::pain[Problem]
Film detayında fragman penceresini açtın. Tab'a bastığında focus pencerenin arkasındaki arama kutusuna kaçıyor; Escape hiçbir şey yapmıyor. Fareyle kapattığında da klavyede nerede kaldığını kaybettin: focus sayfanın en başına düştü.
:::

## Modal dialog sözleşmesi
Klavye kullanıcısı için bir modal dört şey vaat eder:

1. **Açılınca** focus dialogun içindeki ilk anlamlı kontrole gider.
2. **Açıkken** Tab ve Shift+Tab dialogun içinde döner (focus trap).
3. **Escape** dialogu kapatır.
4. **Kapanınca** focus dialogu açan öğeye geri döner.

Dördüncü madde için dialog açılmadan hemen önce `document.activeElement` değerini sakla. Kapanırken o öğe hâlâ sayfadaysa (`isConnected`) ona focus ver.

```tsx title="FocusSketch.tsx"
useEffect(() => {
  if (!open) return
  const previous = document.activeElement // açan düğme
  firstRef.current?.focus()
  // ...keydown dinleyicisi
  return () => {
    // ...dinleyiciyi kaldır
    if (previous instanceof HTMLElement && previous.isConnected) previous.focus()
  }
}, [open])
```

## Focus trap nasıl çalışır?
Tarayıcı Tab'ı zaten sırayla işler; sen yalnızca **sınırları** yönetirsin. Son kontroldeyken Tab'a basılırsa `preventDefault()` ile tarayıcının hareketini durdur ve ilk kontrole focus ver. Shift+Tab ile ilkteysen sonuncuya git. İçerik değişebiliyorsa "ilk" ve "son" kontrolü her tuşta yeniden bul ve `disabled` olanları atla.

## Effect ne zaman yeniden çalışır?
Escape için `onClose` prop'unu çağırman gerekiyor. `onClose`'u dependency array'e koyarsan, üst bileşen her render'da yeni bir `() => setOpen(false)` ürettiğinde effect **yeniden** çalışır: cleanup focus'u açan düğmeye taşır, setup onu tekrar ilk kontrole çeker. Kullanıcı Kapat düğmesindeyken focus kendi kendine zıplar.

`onClose` burada bir **olay**: effect'in senkronize ettiği şey değil. React 19.2'den beri kararlı olan `useEffectEvent` tam bunun için:

```tsx check
import { useEffect, useEffectEvent } from 'react'

export function useEscape(open: boolean, onClose: () => void) {
  const handleClose = useEffectEvent(() => onClose())
  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])
}
```

Effect artık yalnızca `open` değişince kurulur; `handleClose` her çağrıldığında en güncel `onClose`'u kullanır. 5. modülde dediğimiz gibi bu, eksik dependency'yi gizleme aracı değildir: `open` hâlâ dependency'dir.

## Başka bir klavye düzeni
Her bileşenin klavye sözleşmesi aynı değildir. Tabs'te Tab her sekmede durmaz: yalnızca seçili sekme Tab sırasındadır, sekmeler arasında yön tuşlarıyla gezilir. Aynı "focus'u yönet" fikri, farklı kurallarla 4. derste karşına çıkacak.

:::mistake
`keydown` dinleyicisini ekleyip cleanup'ta kaldırmayı unutursan dialog kapandıktan sonra da Escape'i yakalamaya devam eder; sonraki dialogda iki kez `onClose` çağrılır.
:::

:::sector
Üretimde karmaşık dialoglar için test edilmiş primitive'ler (Radix, React Aria, Base UI) kullanılır; iframe, iç içe dialog, dinamik içerik gibi köşe durumları çoktur. Mekaniği bir kez kendin kurmak, o kütüphanelerin ne yaptığını ve hatasını nerede arayacağını anlamanı sağlar.
:::
