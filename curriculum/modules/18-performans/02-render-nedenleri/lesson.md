---
title: "Render nedenlerini ayır"
minutes: 18
kind: concept
---

# Render nedenlerini ayır

Sinema'da favori listene bir film eklediğinde, ilgili butonun yazısı değişir. React state'i günceller ve bileşen fonksiyonlarını yeniden çağırır. Buna **render** denir: React yeni arayüz çıktısını hesaplar; bu, DOM'un tamamının yeniden çizildiği anlamına gelmez. React yeni ağaçla eski ağacı karşılaştırıp gerekli değişiklikleri uygular; bu karşılaştırmalı güncelleme sürecine **reconciliation** denir.

Bir render gördüğünde önce “neden?” diye sor. DevTools'taki her render hata değildir; ama gereksiz hesaplama çok sayıda bileşen çalıştırabilir. Şimdi aynı film sayfasında en basit nedenden başlayıp diğer nedenlere geçelim.

## Önce kendi state'in

Bir bileşen kendi `useState` değerini değiştirdiğinde React o bileşeni yeniden çağırır. Aşağıdaki küçük sayaçta başka bir bileşen yok:

```tsx check
import { useState } from 'react'

export function WatchCount() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount((value) => value + 1)}>İzleme: {count}</button>
}
```

Butona bastığında `count` bir artar ve `WatchCount` yeniden render edilir. Yeni sayı farklı olduğu için React ekrandaki metni günceller. Bu render beklenen davranıştır; kullanıcı eyleminin sonucudur.
Event handler o render'da oluşur ve o render'ın `count` değerini görür.

:::model[State snapshot]
Event handler oluştuğu render’ın state değerlerini görür; state güncellemesi sonraki render’da görünür.

![Her render kendi snapshot değerini görür](diagram:state-snapshot)
:::

:::model[Render → commit → effect]
Render yeni çıktıyı hesaplar; commit gerekli DOM değişikliklerini uygular, effect ise commit sonrasında çalışır. Render görünce DOM'un mutlaka değiştiğini varsayma.

![Render ve commit aşamaları](diagram:render-commit)
:::

Şimdi state'i sayfa düzeyine taşıdığını düşün. Arama kutusundaki her karakter `SinemaPage` state'ini değiştirirse, varsayılan olarak `SinemaPage` ile onun çocukları yeniden çağrılabilir. Çocuk bileşen `props` almıyorsa bile parent'ının render'ı onu yeniden çalıştırabilir. Bu yüzden arama için kullanılan state'i yalnızca arama bölümünün ihtiyacı varsa o bölüme yakın tutmak iyi bir ilk çözümdür.

State'i yalnızca kullandığı en yakın alt bileşende tutmaya **State Colocation** (state'i yerelleştirme) denir. Örneğin film arama metni sadece `SearchBox` ve onun sonuçları için gerekiyorsa tüm sayfaya ait state yapmak zorunda değilsin. State'i yakına almak, ilgisiz kardeşlerin parent render dalgasına katılmasını azaltır.

## Parent render'ı ve memo sınırı

Bazen state'i aşağı taşımak mümkün değildir; aynı state başka alanları da besliyordur. `memo` (`React.memo`), bir bileşeni sararak parent render olduğunda props'u değişmeyen çocuğun fonksiyonunu atlayabilen React aracıdır. Props'ların **referans eşitliği**, iki değerin React'in kullandığı `Object.is` karşılaştırmasına göre aynı olup olmadığını anlatır. Sayılar ve metinlerde aynı değer genellikle eşit çıkar; her render'da yeniden oluşturulan nesne ve fonksiyonlar ise farklı referanslardır.

Sinema sayfasında `MovieSummary` yalnızca toplam film sayısını gösteriyor olsun:

```tsx check
import { memo, useState } from 'react'

const MovieSummary = memo(function MovieSummary({ total }: { total: number }) {
  return <p>Katalogda {total} film var.</p>
})

export function CatalogPage({ total }: { total: number }) {
  const [query, setQuery] = useState('')
  return (
    <main>
      <input value={query} onChange={(event) => setQuery(event.target.value)} />
      <MovieSummary total={total} />
      <p>Aranan: {query}</p>
    </main>
  )
}
```

Input değişince `CatalogPage` render edilir. `MovieSummary` aynı `total` sayısını aldığı için `memo` onun render'ını atlayabilir. Fakat `<MovieSummary options={{ sort: 'title' }} />` yazsaydık, parent'ın her render'ında yeni bir nesne oluşurdu; `Object.is` bu nesneyi öncekinden farklı görürdü ve `memo` çocuğu koruyamazdı. `memo` her render'ı engelleyen bir kalkan değil, parent kaynaklı render'da props karşılaştırmasıdır.

## State'i sırayla izleyelim

Şu etkileşimi takip et: sayfa açılır, ardından arama kutusuna `M` yazılır. `CatalogPage` içindeki input state'i değişiyor, `total` değişmiyor:

| Adım | Olay | `CatalogPage` | `MovieSummary` |
|---|---|---|---|
| 1 | İlk açılış | Render, `query = ''` | Render, `total = 42` |
| 2 | `M` harfi yazılır | State `M` olur, render edilir | Parent render dalgasına girer |
| 3 | `memo` props'u karşılaştırır | Yeni JSX üretir | `total` hâlâ 42; fonksiyon çağrısı atlanır |
| 4 | DOM güncellenir | Input ve “Aranan: M” görünür | Özet metni aynı kalır |

Bu tabloda çocuk bileşenin parent yüzünden render edilmesi ile ekrandaki DOM değişimi ayrı şeylerdir. `memo`, yalnızca aynı props'la gelen `MovieSummary` fonksiyon çağrısını atladı; input'un güncellenmesine engel olmadı.

## Context ve key başka nedenlerdir

Bir bileşen `useContext` ile **Context** değerini okuyorsa, Provider yeni bir değer sağladığında o bileşen yeni değeri göstermek için render edilir. Context, bileşen ağacında ortak bir değeri prop'ları tek tek iletmeden sunar. `memo` parent'tan gelen props'u karşılaştırır; bileşenin kendi okuduğu Context değişimini kapatmaz.

Örneğin `MoviePoster` tema rengini doğrudan `ThemeContext`'ten okuyorsa, tema değiştiğinde `MoviePoster` render olur. Context'teki büyük bir nesnenin küçük bir alanı değişince gereksiz birçok tüketici uyanıyorsa, **Context splitting** (Context'i ayrı değerlere bölme) kullanabilirsin: sık değişen tema tercihini ve nadir değişen kullanıcı bilgisini farklı Context'lerde tutarsın. Böylece her bileşen yalnızca ihtiyaç duyduğu değişimi izler.

:::model[Context yayılımı]
Bir bileşenin okuduğu Provider değeri değişince o bileşen yeniden render olur; `memo` bunu durdurmaz.

![Provider değeri değişince tüm tüketiciler render olur](diagram:context-yayilimi)
:::

`key` de kimliğin parçasıdır. Liste satırının key'i değişirse React eski satırı yeni satırla aynı bileşen saymaz; eski örneği bırakıp yenisini oluşturur. Film satırına `key={Math.random()}` vermek her render'da kimliği değiştirir. Açık olan detay veya yerel seçim state'i sıfırlanabilir. Düzeltme, `key={movie.id}` gibi film değişmediği sürece sabit kalan benzersiz kimlik kullanmaktır.

## Dört nedeni bir tabloda topla

Örneklerden sonra genel resmi kısa tutabiliriz:

| Ne değişti? | Hangi bileşen render olur? | `memo` bunu durdurur mu? |
|---|---|---|
| Bileşenin kendi state'i | O bileşen | Hayır |
| Parent render'ı | Çocuklar varsayılan olarak render olabilir | Props aynıysa atlayabilir |
| Okunan Context değeri | Context'i kullanan bileşen | Hayır |
| Bileşenin `key` değeri | Eski örnek bırakılır, yenisi oluşturulur | Hayır |

Bu nedenle optimizasyona `memo` ekleyerek başlama. Önce Profiler'da hangi bileşenin hangi hareketle render olduğunu gör. Render parent state'indense state'i ihtiyacı olan yere yaklaştır; props aynı kalan pahalı çocuksa `memo` düşünülebilir; Context ya da `key` değişimiyse o değişimin tasarımını incele.

## Gerçek hata: liste satırına rastgele key

Belirti, arama metni değiştikçe film satırındaki açık detayın kapanması ya da satırın animasyonunun baştan başlamasıdır. Sebep, `key` değerinin her render'da değişip React'e “bu başka bir film satırı” demesidir. `memo` da yardımcı olmaz; React aynı örneği korumak yerine yenisini oluşturur. `movie.id` kullanınca arama sırası değişse de aynı film aynı kimlikle tanınır.

## Özet

- Kendi state'inin değişmesi bileşeni render eder; parent render'ı çocuklara da yayılabilir.
- `memo`, parent render'ında props'u aynı kalan çocuğu atlayabilir; Context ve state değişimlerini durdurmaz.
- Context değerini okuyan bileşen, o değer değişince render olur. Ayrı değişim alanlarını ayrı Context'lerde tutmak yayılımı daraltabilir.
- `key` bileşen kimliğini belirler. Kararsız key yeni örnek ve sıfırlanan yerel state demektir.

**Yeni terimler**

- **Reconciliation:** React'in yeni ve önceki arayüz ağacını karşılaştırıp gerekli güncellemeleri seçmesi.
- **Referans eşitliği:** İki nesne/fonksiyonun aynı referans olup olmadığını karşılaştırma; `memo` props kontrolünde kullanır.
- **State Colocation:** State'i onu kullanan en yakın bileşende tutma; ilgisiz parent render'larını azaltabilir.
- **Context splitting:** Farklı sıklıkta değişen ortak verileri ayrı Context'lere koyma; gereksiz tüketici render'larını azaltır.

### Kendini yokla

1. `memo` ile sarılı `MoviePoster` props'u değişmediği halde neden render olabilir?
   **Cevap:** Kendi state'i veya okuduğu Context değeri değişmiş olabilir.
2. Bir film satırının key'i her render'da rastgele değişirse ne görürsün?
   **Cevap:** React eski satırı bırakıp yenisini kurabilir; satırın yerel state'i sıfırlanır.
