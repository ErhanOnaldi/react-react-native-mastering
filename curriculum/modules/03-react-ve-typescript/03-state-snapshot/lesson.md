---
title: "State snapshot ve updater"
minutes: 20
kind: concept
---

# State snapshot ve updater

Sinema'da bir puan düğmesine tıkladığında `useState` ile tuttuğun sayı ekranda artar. **Render**, React'in bileşen fonksiyonunu çalıştırıp o anki ekrana uygun JSX'i hesaplamasıdır. `useState`, React'in render'lar arasında sakladığı bir değeri bileşene vermesini sağlar; bu saklanan değere **state** denir. **Setter**, state'i güncellemesini React'ten isteyen fonksiyondur. Ama setter'ı çağırınca o satırdaki değişken anında değişmez; bunu görmek için önce tek bir artışa bakalım.

## Setter çağrısı değişkeni anında değiştirmez

```tsx check
import { useState } from 'react'

function RatingButton() {
  const [score, setScore] = useState(0)

  function addPoint() {
    setScore(score + 1)
    console.log('Handler içindeki score:', score)
  }

  return <button onClick={addPoint}>Puan: {score}</button>
}

const button = <RatingButton />
void button
```

İlk görünümde `score` sıfırdır. Tıklayınca `setScore(1)` çağrılır; hemen ardından çalışan `console.log` yine `0` yazar. Setter, handler'ın elindeki `score` değişkenine yeni değer atamaz. React bu isteği işler ve yeni state ile bileşeni yeniden çalıştırınca düğmede `Puan: 1` görünür.

Bir **snapshot**, tek bir render'ın gördüğü state değeridir. Handler, oluşturulduğu render'ın snapshot'ını kullanır. Setter sonraki render için güncelleme ister; bu nedenle aynı handler içinde eski değişkeni tekrar okumak yeni değeri vermez.

![Bir renderın state fotoğrafı ve sıraya giren güncellemeler](diagram:state-snapshot)

## Uyarı penceresi de aynı render değerini okur

Değerin daha sonra okunması da bu kuralı değiştirmez. Aşağıdaki örnekte `alert` setter çağrısından sonra açılır:

```tsx check
import { useState } from 'react'

function PreviewCount() {
  const [views, setViews] = useState(0)

  function recordView() {
    setViews(views + 1)
    window.alert(`Handler'ın gördüğü değer: ${views}`)
  }

  return <button onClick={recordView}>Önizleme: {views}</button>
}

const preview = <PreviewCount />
void preview
```

Pencere `Handler'ın gördüğü değer: 0` yazar. Bunun nedeni `alert`'in hızlı ya da yavaş olması değil; `views` bu handler'ın render'ından gelir ve handler çalışırken değişmez. Uyarı kapandıktan sonra React güncellemeyi işler, düğmede `Önizleme: 1` görünür.

Bir zamanlayıcı callback'i için de aynı şeyi düşün:

```tsx check
import { useState } from 'react'

function DelayedPreview() {
  const [views, setViews] = useState(0)

  function recordLater() {
    setViews(views + 1)
    setTimeout(() => {
      console.log('Zamanlayıcıdaki değer:', views)
    }, 100)
  }

  return <button onClick={recordLater}>Önizleme: {views}</button>
}

const delayed = <DelayedPreview />
void delayed
```

Tıklama anında handler `views = 0` değerini görür ve zamanlayıcıya da o render'dan gelen değeri kullanacak bir fonksiyon verir. 100 ms sonra konsolda yine `0` görünür; ekrandaki yeni render ise `Önizleme: 1` gösterebilir. “Biraz sonra çalışıyor” olması fonksiyona kendiliğinden yeni snapshot vermez.

İki durumda da sıralama aynı fikri gösterir; timer yalnızca callback'in çalışmasını geciktirir:

| An | Handler veya callback'in gördüğü `views` | Ekran / çıktı |
| --- | ---: | --- |
| Render ve ilk görünüm | 0 | `Önizleme: 0` |
| Tıklama: `setViews(views + 1)` | 0 | Setter yeni render ister; mevcut ekran henüz 0 |
| Aynı handler: `alert(views)` | 0 | Uyarıda 0 görünür |
| Handler tamamlanınca yeni render | Yeni state 1 | Düğmede `Önizleme: 1` |
| Timer callback'i çalışınca | Timer'ın bağlı olduğu değer 0 | Konsolda 0 yazar |

## Üç çağrı neden bir artış eder?

Şimdi bir tıklamada üç puan eklemek istediğini varsay. Her satır `score + 1` ifadesini handler'ın gördüğü değerle hesaplar. Başlangıç `score = 0` iken satırlar şöyle ilerler:

```tsx
setScore(score + 1)
setScore(score + 1)
setScore(score + 1)
```

| Handler'daki satır | Snapshot'taki `score` | Hesaplanan yeni değer | Kuyruktaki istek |
| --- | ---: | ---: | ---: |
| İlk `setScore(score + 1)` | 0 | 1 | 1 değerini kullan |
| İkinci `setScore(score + 1)` | 0 | 1 | 1 değerini kullan |
| Üçüncü `setScore(score + 1)` | 0 | 1 | 1 değerini kullan |
| Handler bittikten sonra | 0 | — | Sonraki state 1 olur |

Üç çağrı da çalıştı; ama her biri aynı snapshot'tan `1` hesapladı. React aynı kullanıcı olayı sırasında gelen state güncellemelerini **batching** ile gruplar: her setter arasında ekranı yeniden çizmek yerine, güncellemeleri işler ve ardından yeni görünümü hazırlar. Burada aynı hazır değer üç kez istendiği için sonraki state `1` olur.

## Updater sıradaki değeri alır

Önceki state'e göre bir değer hesaplaman gerekiyorsa setter'a bir fonksiyon verebilirsin. Bu fonksiyona **updater** denir; React onu sıradaki state değeriyle çağırır.

```tsx check
import { useState } from 'react'

function RatingButton() {
  const [score, setScore] = useState(0)

  function addThreePoints() {
    setScore((previous) => previous + 1)
    setScore((previous) => previous + 1)
    setScore((previous) => previous + 1)
  }

  return <button onClick={addThreePoints}>Puan: {score}</button>
}

const button = <RatingButton />
void button
```

Bu kez kuyruğa üç sayı değil, üç küçük hesaplama girer. React her updater'a bir öncekinin ürettiği değeri verir:

| Kuyruktaki adım | Updater'ın aldığı `previous` | Updater'ın ürettiği değer |
| --- | ---: | ---: |
| İlk updater | 0 | 1 |
| İkinci updater | 1 | 2 |
| Üçüncü updater | 2 | 3 |

Sonraki render'da düğme `Puan: 3` gösterir. Fonksiyon biçimi burada gerekli, çünkü her artış bir öncekinin sonucuna bağlı. Tek artışta `setScore(score + 1)` de anlaşılırdır; artışları biriktirirken `setScore(previous => previous + 1)` doğru bağı kurar.

React bu istekleri grupladığı için tek handler içindeki üç çağrı arasında üç ayrı ara ekran görmezsin. Kullanıcı tek tıklamada eski görünümden yeni görünüme geçer. Batching, handler'daki değişkenleri canlı ve değişken hale getirmez; yalnızca ekran güncellemesini toplu işler.

## Zamanlayıcıda güncel değerden artış

Önceki örnekteki zamanlayıcı yalnızca eski değeri yazdırıyordu. Eğer gecikmeli iş mevcut sayıya artış eklemeli ise, zamanlayıcının tuttuğu `views` değerinden toplama yapmak yerine updater kullan:

```tsx check
import { useState } from 'react'

function DelayedPreview() {
  const [views, setViews] = useState(0)

  function recordLater() {
    setTimeout(() => {
      setViews((previous) => previous + 1)
    }, 100)
  }

  return <button onClick={recordLater}>Önizleme: {views}</button>
}

const delayed = <DelayedPreview />
void delayed
```

Zamanlayıcı çalıştığında updater'a state'in sıradaki güncel değeri verilir. Böylece artış eski `views` değişkeninden hesaplanmaz. Updater içinde yalnızca yeni değeri hesapla; `console.log`, uyarı gösterme veya başka bir işlem başlatma. React hesabı tekrar kontrol edebileceğinden updater'ın aynı girdide aynı sonucu vermesi gerekir.

## Sık rastlanan iki belirti

:::mistake[Setter'dan sonra eski sayıyı görmek]
Belirti → `setScore(score + 1)` sonrasındaki log veya uyarı eski sayıyı gösterir.
Neden → Setter mevcut handler'ın snapshot'ını değiştirmez; sonraki render için güncelleme kuyruğa koyar.
Düzeltme → Yeni değere aynı handler'da ihtiyacın varsa onu kendin hesapla; yeni state'in ekranda görünmesini istiyorsan sonraki render'ı kullan.
:::

:::mistake[Biriken artışı değerle tekrar etmek]
Belirti → Üç artış isteyen düğme yalnız bir puan ekler.
Neden → Üç `setScore(score + 1)` ifadesi aynı snapshot'tan aynı `1` değerini hesaplar.
Düzeltme → Her artışı `setScore(previous => previous + 1)` olarak sıraya koy.
:::

## Aklında tut

- Her render kendi state snapshot'ını verir; o render'dan gelen handler içindeki değişken sabit kalır.
- Setter çağrısı mevcut değişkeni atama gibi değiştirmez; React'ten sonraki render için güncelleme ister.
- `setValue(value + 1)` hazır bir değer hesaplar; updater biçimi sıradaki state'i alıp üzerine hesap yapar.
- Batching aynı kullanıcı eylemindeki güncellemeleri birlikte işler; updater'lar birbirinin sonucunu sırayla görebilir.

**Yeni terimler:** Render, bileşen fonksiyonunun o anki JSX'i hesaplamasıdır; snapshot, tek bir render'ın gördüğü state değeridir; updater, sıradaki state'i alarak yeni değeri hesaplayan fonksiyondur; batching, aynı eylemdeki state güncellemelerini birlikte işleme yöntemidir.

**Kendini yokla:** `score` sıfırken aynı handler'da üç kez `setScore(score + 1)` çağrılırsa sonraki değer kaç olur?
*Cevap:* `1`; üç satır da snapshot'taki `0` değerinden `1` hesaplar.

**Kendini yokla:** Üç `setScore(previous => previous + 1)` çağrısında updater'lar hangi değerleri alır?
*Cevap:* Sırayla `0`, `1`, `2`; sonuç `3` olur.
