---
title: "Render neden istek yeri değil?"
minutes: 17
kind: concept
---

# Render neden istek yeri değil?

:::pain[Problem]
Bileşen gövdesinde doğrudan `fetch` çağrısı yapıldığında, cevap gelince state güncellenir; state güncellenince bileşen yeniden render edilir; yeni render tekrar `fetch` çalıştırır. Tarayıcının Network sekmesi saniyeler içinde yüzlerce aynı istekle dolar ve sayfa kilitlenir.
:::

## Effect yaşam döngüsü

Render aşaması, verilen props ve state değerlerine bakarak ekranda neyin görünmesi gerektiğini (JSX) hesaplayan saf bir fonksiyondur. Ağ isteği atmak, zamanlayıcı (timer) kurmak, `localStorage` ile konuşmak veya doğrudan DOM'a müdahale etmek ise React'in kontrolü dışındaki sistemlerle temas kurmaktır. Bu tür işlemlere yazılımda **yan etki** (side effect) denir.

Yan etki doğrudan render gövdesinde başlatılırsa, React her render hesaplamasında bu dış dünyayla tekrar ve kontrolsüzce temas kurar. `useEffect`, bu dış sistem ilişkisini render anından ayırıp **commit sonrasına** taşır.

![Effect setup, dependency değişimi, cleanup ve yeniden setup akışı](diagram:effect-yasam-dongusu)

Modeli şu temel kurallarla zihninde canlandır:

1. **Render saf bir hesaplamadır:** React bileşeni çağırır ve sanal çıktıyı hesaplar. Bu aşamada dış dünyaya dokunulmamalıdır.
2. **Commit farkı DOM'a yansıtır:** React, render çıktısı ile mevcut DOM arasındaki farkı tarayıcıya uygular.
3. **Effect commit sonrasında çalışır:** Tarayıcı ekranı güncelledikten hemen sonra effect içindeki kurulum (setup) fonksiyonu devreye girer.
4. **Bağımlılık (dependency) değişirse döngü tekrarlanır:** Bir sonraki render'da dependency listesindeki değerlerden biri değişmişse, React önce eski effect'in temizlik (cleanup) fonksiyonunu, ardından yeni setup fonksiyonunu çalıştırır.
5. **Ağaçtan ayrılınca temizlenir:** Bileşen ekrandan kaldırıldığında (unmount) son temizlik fonksiyonu çalıştırılır.

:::model[Render → commit → effect]
Render aşaması "ekranda ne olmalı?" sorusuna yanıt arar. Henüz hiçbir şey ekrana basılmamıştır. Commit aşaması React'in hesaplanan farkı DOM'a uyguladığı andır. Effect ise kullanıcı boyanmış arayüzü gördükten sonra dış sistemlerle güvenle senkronize olabileceğin andır.
:::

## Sonsuz döngüyü zaman çizgisinde izleyelim

Diyelim ki bir filmin yönetmen bilgisini gösteren `DirectorBadge` bileşeni yazıyoruz. Bu bileşenin render gövdesine doğrudan `fetch` koyarsak neler yaşanır?

| Zaman | Aşama | Olay | Durum |
| --- | --- | --- | --- |
| 0 ms | 1. Render | `person === null` → "Yükleniyor..." üretilir | Render sırasında `fetch('/person/5223')` ateşlenir |
| 1 ms | Commit | DOM'a "Yükleniyor..." yazılır | Kullanıcı yüklenme metnini görür |
| 35 ms | Ağ cevabı | JSON çözülür, `setPerson(data)` çağrılır | State değiştiği için React 2. render'ı planlar |
| 36 ms | 2. Render | `person` artık dolu → "Yönetmen: Nolan" hesaplanır | **Render gövdesi tekrar çalışır ve AYNI fetch tekrar ateşlenir!** |
| 37 ms | Commit | DOM'a "Yönetmen: Nolan" yazılır | Kullanıcı yönetmeni görür ama arka plan yanıyor |
| 70 ms | 2. Ağ cevabı | İkinci cevap döner, tekrar `setPerson(data)` | React 3. render'ı planlar |
| 71 ms | 3. Render | Render gövdesi çalışır, 3. fetch ateşlenir | İstek seli katlanarak devam eder |

Görünürde arayüz doğru bilgiyi gösteriyor gibi durabilir. Ancak tarayıcı arka planda sunucuyu istek yağmuruna tutar. Bu durum kısa sürede sunucu tarafından `429 Too Many Requests` (Rate Limit) hatasıyla engellenir veya kullanıcının tarayıcı sekmesi aşırı bellek tüketiminden çöker.

## Kırık örnek

Bu kod parçası TypeScript açısından hatasız derlenir, ancak çalışma zamanında ölümcül bir döngü üretir:

```tsx
import { useState } from 'react'

type Person = { id: number; name: string }

export function DirectorBadge({ personId }: { personId: number }) {
  const [person, setPerson] = useState<Person | null>(null)

  // TEHLİKE: Render gövdesinde doğrudan ağ isteği!
  fetch(`https://api.themoviedb.org/3/person/${personId}`, {
    headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
  })
    .then((res) => res.json() as Promise<Person>)
    .then((data) => setPerson(data))

  return <div>{person ? `Yönetmen: ${person.name}` : 'Yükleniyor...'}</div>
}
```

Sorunun kaynağı `fetch` fonksiyonunun kendisi değildir. Bu satırı dışarıda başka bir yardımcı fonksiyona (örneğin `loadDirector`) taşısan bile, o yardımcıyı render gövdesinde çağırdığın sürece aynı döngü devam eder. Sorun, dış dünya eyleminin yanlış aşamada başlatılmasıdır.

## Doğru örnek

İlişkiyi render anından çıkarıp commit sonrasına taşıyoruz:

```tsx check
import { useEffect, useState } from 'react'

type Person = { id: number; name: string }

export function DirectorBadge({ personId }: { personId: number }) {
  const [person, setPerson] = useState<Person | null>(null)

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/person/${personId}`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    })
      .then((res) => res.json() as Promise<Person>)
      .then((data) => setPerson(data))
  }, [personId])

  return <div>{person ? `Yönetmen: ${person.name}` : 'Yükleniyor...'}</div>
}
```

Burada `useEffect`, React'e şu sözleşmeyi verir:
- Bu fonksiyonu ilk render tamamlanıp DOM boyandıktan sonra bir kez çalıştır.
- İleride bileşen tekrar render edilirse, `personId` prop'u değişmediği sürece bu kodu bir daha asla çalıştırma.

Böylece `setPerson` çalıştığında bileşen 2. kez render edilir, ancak `personId` hâlâ aynı kaldığı için effect tekrar tetiklenmez. İstek sayısı tam olarak 1'de kalır ve döngü güvenle kırılır.

## Bu hatayı gerçek dünyada nasıl fark edersin?

Geliştirme yaparken sonsuz istek döngüleri her zaman anında çökmeyle sonuçlanmayabilir. Bu hatayı erken yakalamak için şu araçlara ve belirtilere dikkat et:

1. **DevTools Network sekmesi:** Sayfa açılır açılmaz Network sekmesinde istek sayacının sürekli arttığını (50, 100, 200...) ve aynı URL'nin ardı ardına sıralandığını görüyorsan, render içinde kontrolsüz bir tetikleyici vardır.
2. **DevTools Console paneli:** `console.log('Bileşen render oldu')` satırı eklediğinde konsol saniyede onlarca satırla akıyorsa, render tetikleyen bir state döngüsü vardır.
3. **HTTP 429 Hataları:** Sunucu hız sınırına takılıp istekleri reddetmeye başladığında Network panelinde kırmızı renkli 429 yanıtları belirir.
4. **Tarayıcı donması:** CPU kullanımı %100'e fırlar, fanlar hızlanır ve sayfadaki butonlar tıklamalara yanıt veremez hale gelir.

## Loading durumu nereye ait?

İstek `useEffect` içinde başlatılsa bile, kullanıcının o sırada ne göreceği render'ın ve state'in sorumluluğundadır. İlk render gerçekleştiğinde elimizde henüz veri yoktur (`person === null`). Bu nedenle ekrana dürüstçe yüklenme durumunu yansıtırız.

İki dünyanın sorumluluk paylaşımını şu tabloyla netleştir:

| Aşama | Render'ın Sorumluluğu | Effect'in Sorumluluğu |
| --- | --- | --- |
| İlk render | `person === null` → "Yükleniyor..." JSX'i üretir | Henüz çalışmadı, sıra onda değil |
| Commit ve boyama | Tarayıcı DOM'u günceller, kullanıcı metni görür | Effect setup başlar, `fetch` ateşlenir |
| Yanıt geldiğinde | `setPerson` ile yeni render başlar | İşini tamamladı, bekliyor |
| İkinci render | `person` dolu → "Yönetmen: Nolan" üretir | `personId` değişmediyse çalışmaz |

Effect arayüz üretmez. Effect yalnızca dış dünyadan veriyi getirir ve state'i günceller; arayüzü üretmek her zaman saf render fonksiyonunun görevidir.

## StrictMode neden iki kez çalıştırır?

Geliştirme ortamında React `StrictMode` etkinleştirildiğinde, bileşenlerinin render ve effect adımlarının ikişer kez çalıştığını görebilirsin. Bu bir hata değildir ve canlı (production) ortamda gerçekleşmez.

StrictMode'un amacı şudur: Yazdığın effect geride yetim kalmış bir işlem (açık bir timer, iptal edilmemiş bir bağlantı, temizlenmemiş bir dinleyici) bırakıyor mu? Bunu anlamak için React geliştirme modunda kasıtlı olarak şu sırayı işletir:

```text
Setup → Cleanup → Setup
```

Eğer effect'in temizlik fonksiyonunu doğru yazdıysan, bu iki deneme sorunsuz tamamlanır. İki kez istek gittiğini görüp panikle `useEffect`'i kaldırmaya veya hack'ler üretmeye çalışma; bu davranış seni ileride karşılaşacağın bellek sızıntılarından korumak için tasarlanmıştır.

## Sınır durumları ve sık hatalar

:::mistake[Sık hata: Async effect callback]
Belirti → `useEffect(async () => { ... })` yazınca TypeScript veya React hata veriyor.  
Neden → `async` fonksiyonlar her zaman bir `Promise` döndürür. Oysa React, `useEffect`'in dönüş değerinin yalnızca temizlik (cleanup) fonksiyonu ya da `undefined` olmasını bekler.  
Düzeltme → Async işi effect gövdesinde tanımladığın bir iç fonksiyonda yürüt ya da Promise `.then` zinciri kullan:
```tsx check
import { useEffect } from 'react'

export function AsyncExample({ id }: { id: number }) {
  useEffect(() => {
    async function loadData() {
      const res = await fetch(`/api/items/${id}`)
      await res.json()
    }
    void loadData()
  }, [id])

  return null
}
```
:::

:::mistake[Sık hata: Render'da state güncellemek]
Belirti → "Too many re-renders. React limits the number of renders to prevent an infinite loop." hatası.  
Neden → Render gövdesinde koşulsuz olarak `setCount(...)` gibi bir setter çağrılmıştır.  
Düzeltme → State güncellemeleri yalnızca olay yöneticileri (event handlers) veya `useEffect` içinde yapılmalıdır.
:::

:::mistake[Sık hata: Helper fonksiyona taşındığında sorunun çözüldüğünü sanmak]
Belirti → Ağ isteği harici bir `fetchHelper` dosyasına alındı ama istek sayacı yine 100'e vurdu.  
Neden → Helper fonksiyonun nerede durduğu değil, **nereden çağrıldığı** önemlidir. Fonksiyon render sırasında çağrılıyorsa yan etki kuralı yine çiğnenmiştir.  
Düzeltme → Helper çağrısını `useEffect` callback'i içine al.
:::

:::sector
Endüstri standartlarında ve kurumsal ekiplerde "render gövdesi saf olmalıdır" kuralı en katı code review kriterlerinden biridir. Render anında fırlatılan bir analitik (analytics) olayı bile raporlama panellerini çökertebilir veya sahte verilerle doldurabilir. Modern React projelerinde veri çekme için çoğunlukla TanStack Query gibi kütüphaneler kullanılsa da, bu kütüphanelerin temeli de aynı zihinsel modele, yani render ve commit ayrımına dayanır.
:::

## Özet

- Render aşaması yalnızca saf arayüz hesaplamalıdır; dış sistemlerle konuşamaz.
- `useEffect`, yan etkileri tarayıcı ekranı boyadıktan (commit sonrası) sonraya erteler.
- Dependency listesi değişmediği sürece aynı effect gereksiz yere tekrar çalıştırılmaz.
- Render içinde `setState` veya ağ isteği başlatmak sonsuz döngü üretir.
- `StrictMode`, effect temizliğinin sağlamlığını denetlemek için geliştirme ortamında çift çalıştırma yapar.

**Kendini yokla:** Render içinde doğrudan `fetch().then(setData)` yazıldığında sonsuz döngü nasıl başlar?  
*Cevap:* İlk render fetch başlatır; fetch tamamlanınca `setData` çağrılır; state değişimi yeni bir render tetikler; bu yeni render tekrar fetch başlatır ve süreç kısır döngüye girer.

**Kendini yokla:** `useEffect` callback'i neden `async` yapılamaz?  
*Cevap:* Çünkü async fonksiyonlar otomatik olarak bir `Promise` döndürür; oysa React effect'ten dönüş değeri olarak yalnızca temizlik (cleanup) fonksiyonu veya `undefined` bekler.
