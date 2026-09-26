---
title: "Bekleyen işlemde dürüst UI"
minutes: 10
kind: concept
---

# Bekleyen işlemde dürüst UI

:::pain[Problem]
Favori düğmesine bastın, sunucu cevabı gelene kadar kalp değişmedi. Kullanıcı aynı düğmeye tekrar bastı; sonuç iki isteğe dönüştü.
:::

## Asenkron beklemeyi ekrana yansıt

Bir işlem sunucudan cevap beklerken kullanıcıya sessiz veya yanıltıcı ekran bırakmamak gerekir. React 19'un action ve pending araçları gönderimin durumunu, `useOptimistic` ise onay bekleyen geçici görünümü kurabilir. `use` Promise sonucunu render sırasında okuyup Suspense sınırına bağlar. Bu araçların her biri farklı asenkron ihtiyaca cevap verir.

Mutation modülünde optimistic cache güncellemesi ve geri alma gördün. Sinema favorisi gerçek sunucu yazmasına bağlıysa benzer kullanıcı beklentisi React araçlarıyla da ifade edilebilir. Favori yalnız yerel Redux seçimi ise ağ beklemesi varmış gibi optimistic katman kurmaya gerek yok.

## Action ile durum
React 19 `useActionState(action, initialState)` `[state, formAction, isPending]` döndürür. `<form action={formAction}>` geçişi yönetir. `useOptimistic` bekleme sırasında geçici görünümü üretir; işlem başarısızsa temel state'e geri döner. Bu, Modül 13'teki TanStack Query cache optimistic update'inden farklı bir UI katmanıdır.

`use(promise)` render sırasında promise okur ve `Suspense` sınırına askıya alınır. Promise'i her render'da yeniden oluşturma; sabit bir kaynaktan geçir. `use` context'i koşullu da okuyabilir; diğer Hook'lar için bu serbestlik yok.

React 19.2'de `<Activity>` ve `useEffectEvent`, 19.3'te `<ViewTransition>` kararlı. `cacheSignal()` yalnız Server Components içindir; bu Vite SPA görevinde kullanılmaz. Bu API'ler burada ana performans çözümü değil, ihtiyacın çıktığı yerde kullanılan araçlardır.

:::sector
Favoriye ekleme yerel Redux state'iyse sunucu beklemesi yoktur; optimistic UI ancak gerçek async işlemde anlam kazanır.
:::

## İki durum, bir düğme

Temel state sunucunun onayladığı favoriyi tutar. Optimistic state, kullanıcı tıklar tıklamaz dolu kalbi gösterir. İstek başarısızsa temel state değişmez ve geçici görünüm kaybolur. Hata mesajını ayrıca göstermeyi unutma; geri dönüş tek başına kullanıcıya nedenini anlatmaz.

Form Action'da `isPending` submit düğmesini kapatabilir. Favori düğmesi form değilse async işlemi `startTransition` içinde başlatabilirsin. `useOptimistic` bu bekleyen işlemin görünümünü günceller. `use(promise)` ise başka bir ihtiyaçtır: veriyi render sırasında okumak ve `Suspense` ile beklemek. Promise'i component gövdesinde her seferinde üretme; cache veya üst katmandan sabit referans getir.
