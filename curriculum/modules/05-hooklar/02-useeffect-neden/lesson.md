---
title: "Render neden istek yeri değil?"
minutes: 16
kind: concept
---

# Render neden istek yeri değil?

Sinema'da bir film kartı, aldığı `id` ile yönetmen bilgisini gösterebilir. React bileşenini daha önce gördün: props ve state'ten JSX üretir. **Render**, React'in bu JSX'i hesaplamak için bileşeni çağırdığı adımdır. Aynı state güncellendiğinde React bileşeni yeniden çağırır; bu yüzden bileşen gövdesi her çağrıda yeniden çalışabilir.

## Önce ekrandaki metni güncelle

Bir film kartı açıldığında sekme başlığını filmin adına göre değiştirmek istediğini düşün. `useEffect`, React'in yönetmediği bir şeyle (örneğin tarayıcı sekme başlığı veya ağ) bileşen arasında **yan etki** kurar; bunu render hesabının dışına taşımamızı sağlar.

```tsx
import { useEffect } from 'react'

export function FilmTabTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = `${title} | Sinema`
  }, [title])

  return <h1>{title}</h1>
}
```

Burada render, `<h1>` çıktısını hesaplar; effect ise o render ekrana uygulandıktan sonra sekme başlığını günceller. `title` değişince React yeni arayüzü hesaplar ve effect'in sekme başlığını da yeni ada uydurması gerektiğini bilir. Bu örnekte ağ isteği yok; effect'in işi ekrandan ayrı olan tarayıcı başlığını eşitlemek.

React'in hesaplanan değişikliği DOM'a (tarayıcının ekrandaki sayfa ağacına) uygulamasına **commit** denir. `useEffect` içindeki fonksiyon effect'in işi başlatan kısmıdır; aşağıda onu ağ isteği için kullanacağız.

![Render tetikleme, render, commit ve effect sırası](diagram:render-commit)

## İstek render sırasında başlarsa ne olur?

Şimdi aynı filmi API'den alalım. `useState` ile daha önce yaptığın gibi, veri henüz gelmediyse başlık yerine yüklenme metni gösterilebilir. İlk denemede `fetch` yanlışlıkla render gövdesinde duruyor:

```tsx
import { useState } from 'react'

type Movie = { title: string }

export function DirectorCard({ movieId }: { movieId: number }) {
  const [title, setTitle] = useState('Yükleniyor…')

  fetch(`/api/movies/${movieId}`)
    .then((response) => response.json() as Promise<Movie>)
    .then((movie) => setTitle(movie.title))

  return <p>{title}</p>
}
```

İlk render `fetch` başlatıp `Yükleniyor…` üretir. Cevap geldiğinde `setTitle` state'i günceller ve React ikinci kez render eder. İkinci render gövdedeki `fetch` satırına yeniden geldiği için yeni istek açar; istek yine state'i güncellerse döngü sürer. Sorun `fetch`'in kendisi değil, her render'da çalışan yere konmasıdır.

Bu nedenle dış sistemle işi `useEffect` içine alırız:

```tsx check
import { useEffect, useState } from 'react'

type Movie = { title: string }

export function DirectorCard({ movieId }: { movieId: number }) {
  const [title, setTitle] = useState('Yükleniyor…')

  useEffect(() => {
    fetch(`/api/movies/${movieId}`)
      .then((response) => response.json() as Promise<Movie>)
      .then((movie) => setTitle(movie.title))
  }, [movieId])

  return <p>{title}</p>
}
```

`useEffect`'in ikinci değeri, effect'in hangi **dependency**'lere (çalışmasını etkileyen girdilere) bağlı olduğunu söyler; bu örnekte film kimliği. İlk ekranda başlık yükleniyor metnidir. Commit'ten sonra istek başlar; cevap geldiğinde state değişir ve başlıkla yeni render olur. `movieId` aynı kaldığından bu render yeni bir istek başlatmaz.

| Sıra | Ne çalışır? | Ekran / sonuç |
| --- | --- | --- |
| 1 | İlk render `title = 'Yükleniyor…'` ile JSX üretir. | Yükleniyor… |
| 2 | Commit, JSX'i DOM'a uygular; ardından effect isteği başlatır. | Yükleniyor… |
| 3 | Cevap `setTitle('Kayıp Bilet')` çağırır. | React yeni render planlar. |
| 4 | Yeni render başlığı hesaplar; `movieId` değişmediği için effect yeniden istek açmaz. | Kayıp Bilet |

Bu ayrım önemlidir çünkü render tekrar edebilir; ağ isteği gibi işi her tekrarın başlatmasını istemezsin. Arayüzün ne göstereceği yine render ve state'in sorumluluğudur; effect yalnızca dış sistemle konuşup gelen sonucu state'e aktarır.

## Yeni film geldiğinde isteği de yenile

Bir kart bileşeni açık kalırken başka bir film seçilebilir. Bu durumda `movieId` prop'u değişir. `DirectorCard` örneğinde bu prop dependency listesinde olduğu için effect yeni kimlikle tekrar çalışır. Eski ve yeni isteklerin hangi sırayla tamamlanabileceği ayrı bir meseledir; onu birazdan, cleanup dersinde ele alacağız.

Burada takip edeceğin akış şudur: tanıdık JSX hesabı render sırasında yapılır; commit bunu sayfaya uygular; effect ise dış dünyayla senkronizasyonu başlatır. Bir isteğin cevabı state'i güncelleyebilir, fakat bu effect'in her render'da tekrar çalışacağı anlamına gelmez.

Şemadaki cleanup adımını ilerleyen cleanup dersinde kodla izleyeceğiz.

![Effect setup, dependency değişimi, cleanup ve yeniden setup akışı](diagram:effect-yasam-dongusu)

:::mistake[İstek için ayrı bir dosya açmak tek başına çözüm değil]
Belirti → `loadMovie()` yardımcı fonksiyonuna taşıdığın halde aynı film için Network panelinde istekler artıyor.
Neden → Yardımcıyı hâlâ bileşen gövdesinde çağırıyorsun; çağrı her render'da yapılıyor.
Düzeltme → Yardımcıyı render gövdesinden değil, `useEffect` içinden çağır. Önemli olan fonksiyonun dosyası değil, çağrıldığı adım.
:::

:::info[StrictMode hakkında]
Geliştirme ortamında `StrictMode`, bazı hataları görünür kılmak için ilk bağlanmada effect'i ek bir cleanup ve setup turundan geçirebilir. Bu nedenle geliştirme Network panelinde fazladan bir istek görebilirsin; effect'in güvenli kurulup temizlenebilmesi gerekir. Bu davranış production'da aynı ek deneme olarak yapılmaz.
:::

## Özet

- Render, props ve state'ten ekranda görünecek JSX'i hesaplar; tekrar çağrılabilir.
- Ağ isteği ve tarayıcı sekme başlığını değiştirmek render hesabı değil, yan etkidir.
- `useEffect`, yan etkiyi commit sonrasına alır; state'ten arayüz üretme işi render'da kalır.
- Effect'in okuduğu değişen girdileri dependency listesinde belirtirsin; böylece yeni film kimliği yeni istek başlatır.

**Yeni terimler**

- **Render:** React'in bileşeni çağırıp ekranda gösterilecek JSX'i hesapladığı adım.
- **Yan etki:** React'in doğrudan yönetmediği sistemle yapılan iş; örneğin ağ isteği.
- **Commit:** React'in hesapladığı arayüz değişikliğini DOM'a uygulaması.
- **Effect:** `useEffect` ile kurulan, render dışında dış sistemle senkronizasyon işi.
- **Dependency:** Effect'in sonucunu etkileyen girdi; değişince effect yeniden kurulur.

**Kendini yokla:** Cevap geldiğinde state güncellenirse neden ikinci bir istek açılmaz?
*Cevap:* State yeni render başlatır; ancak `movieId` değişmediği için dependency aynı kalır ve effect tekrar çalışmaz.

**Kendini yokla:** `fetch` satırını `loadMovie()` içine taşımak ne zaman yeterli değildir?
*Cevap:* `loadMovie()` bileşen gövdesinde çağrılıyorsa her render'da istek başlatmaya devam eder.
