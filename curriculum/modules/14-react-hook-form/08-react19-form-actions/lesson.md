---
title: "React 19 form actions ile karşılaştır"
minutes: 7
kind: concept
---

# React 19 form actions ile karşılaştır

:::pain[Problem]
Tek alanlı “geri bildirim gönder” formunda RHF kurmadan sunucuya yazmak istiyorsun. React 19'un form action'ı gönderim durumunu yönetebiliyor; peki sekiz alanlı izleme listesinde kurallar ve dinamik alanlar nerede duracak?
:::

## Form için yerleşik alternatif

React 19 form actions, bir `<form>` gönderimini action fonksiyonuna bağlayıp bekleme durumunu yönetmeye yardımcı olur. Native `FormData` basit alanları toplar; `useActionState` işlem sonucundan state üretir. Bu model, alan sayısı az ve özel form davranışı gerekmeyen akışlarda yeterli olabilir. RHF ise alan düzeyinde durum ve karmaşık kontroller sağlar.

Sinema'daki tek alanlı geri bildirim ile izleme listesi formu farklı gereksinim taşır. Bir önceki dersin RHF + mutation birleşimini otomatik kural sayma. Buradaki karşılaştırma, araç seçimini formun ihtiyaçlarından türetmeni sağlar.

## Action'ın işi

React 19'da `<form action={formAction}>`, `FormData`'yı action'a verir. `useActionState(action, initialState)` sonucunda `[state, formAction, isPending]` alırsın. Action'ın ilk argümanı önceki state, ikinci argümanı FormData'dır. `useFormStatus()` alt bileşenden o formun pending durumunu okur; formu oluşturan aynı bileşenden okunmaz.

```tsx
import { useActionState } from 'react'

async function send(previous: string, data: FormData): Promise<string> {
  const body = String(data.get('body') ?? '').trim()
  return body ? 'Gönderildi' : 'Metin gerekli'
}
// const [message, formAction, isPending] = useActionState(send, '')
// <form action={formAction}><input name="body" /><button disabled={isPending}>Gönder</button></form>
```

Bu bir bileşen içi kesittir. Action, asenkron gönderim ve durum için kullanışlıdır; RHF alan bazlı doğrulama, dirty/touched, `Controller` ve `useFieldArray` sağlar. Birlikte kullanım mümkündür ama RHF ile action arasında özel bir resmi entegrasyon API'si yoktur. Bu derste iki yaklaşımın sorumluluğunu ayırman yeterli.

:::mistake
`useActionState`'i RHF'nin yerine her formda birebir koyma. Action, `register` veya dinamik alan yönetimi sağlamaz.
:::

:::sector
Basit native formda tarayıcı ve React özellikleri yeterli olabilir. Karmaşık istemci formunda seçimi gereksinime göre yap.
:::
