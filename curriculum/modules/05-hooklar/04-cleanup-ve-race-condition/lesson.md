---
title: "Eski cevap yeniyi ezmesin"
minutes: 19
kind: concept
---

# Eski cevap yeniyi ezmesin

Sinema'da film adına göre oyuncu kadrosu yükleyen bir kartın var. Kullanıcı önce `Alien`, hemen sonra `Arrival` filmini seçiyor. İki ağ isteği de başlıyor; hangisinin önce biteceğini internet ve sunucu belirler. **Race condition** (yarış durumu), işlemlerin tamamlanma sırası önemliyken bu sıranın beklediğinden farklı çıkmasıdır.

## İkinci istek önce bitebilir

Bu iki isteği iki ayrı paket gibi düşün: İlki yola önce çıkabilir ama daha uzun süre yolda kalabilir. Promise cevabının bitiş sırası da başlama sırasını garanti etmez.

| Zaman | İstek | Ne oldu? | State'e yazılan |
| --- | --- | --- | --- |
| 0 ms | `Alien` başladı | İlk seçim için cevap bekleniyor. | — |
| 40 ms | `Arrival` başladı | Yeni seçim için ikinci istek açıldı. | — |
| 90 ms | `Arrival` bitti | İkinci istek hızlı döndü. | `Arrival` kadrosu |
| 400 ms | `Alien` bitti | Eski istek geç döndü ve callback'i hâlâ çalışabilir. | `Alien` kadrosu; ekran artık yanlış |

React yeni film için yeni effect başlatabilir, ama ağda devam eden eski Promise'in sonucunun artık istenmediğini kendiliğinden bilemez. Eski cevap state'e yazılırsa kullanıcı `Arrival` seçili olduğu halde `Alien` bilgisini görür. Yeni isteği başlatmak, önceki cevabı geçersiz kılmaya yetmez.

![Eski yavaş cevabın yeni hızlı cevabı ezdiği yarış koşulu](diagram:yaris-kosulu)

## Önce hangi değerin yazıldığını gör

Aşağıdaki bileşen her `movieId` değişiminde yeni kadro ister. Ancak her cevap geldiğinde koşulsuzca state güncelliyor:

```tsx
import { useEffect, useState } from 'react'

type Cast = { name: string }[]

export function CastPreview({ movieId }: { movieId: number }) {
  const [leadName, setLeadName] = useState('Yükleniyor…')

  useEffect(() => {
    fetch(`/api/movies/${movieId}/cast`)
      .then((response) => response.json() as Promise<Cast>)
      .then((cast) => setLeadName(cast[0]?.name ?? 'Oyuncu bilgisi yok'))
  }, [movieId])

  return <p>{leadName}</p>
}
```

`movieId` değiştiğinde ikinci istek açılır; ama ilk isteğin callback'i de yaşıyor. Eğer ikinci cevap önce gelip `setLeadName('Amy Adams')` der, ilk cevap daha sonra `setLeadName('Sigourney Weaver')` derse son yazan state ekranda kalır. Bitiş sırası kullanıcının son seçimiyle uyuşmak zorunda değildir.

## Cleanup eski cevabın yazma hakkını kapatır

Effect'ten bir fonksiyon döndürürsen React bunu **cleanup** (temizlik) olarak saklar. Dependency değiştiğinde yeni effect'i kurmadan önce eski effect'in cleanup'ını çalıştırır; bileşen sayfadan kaldırıldığında da son cleanup çalışır. Bu küçük sırayı kullanarak eski isteğin cevabı geldiğinde state'e yazmasını önleyebiliriz.

```tsx check
import { useEffect, useState } from 'react'

type Cast = { name: string }[]

export function CastPreview({ movieId }: { movieId: number }) {
  const [leadName, setLeadName] = useState('Yükleniyor…')

  useEffect(() => {
    let ignore = false

    fetch(`/api/movies/${movieId}/cast`)
      .then((response) => response.json() as Promise<Cast>)
      .then((cast) => {
        if (!ignore) setLeadName(cast[0]?.name ?? 'Oyuncu bilgisi yok')
      })

    return () => {
      ignore = true
    }
  }, [movieId])

  return <p>{leadName}</p>
}
```

`ignore` burada her effect kurulumu için ayrı bir boolean bayraktır. Eski kurulumun cleanup'ı kendi bayrağını `true` yapar; geç gelen eski cevap bu işareti görür ve state güncellemesini atlar. İstek ağda bitmeye devam edebilir, ama o cevabın arayüze yazma hakkı kalmaz.

| Sıra | Kullanıcının seçimi | React'in effect işi | Eski isteğin bayrağı |
| --- | --- | --- | --- |
| 1 | `Alien` | Effect A isteği başlatır. | `ignoreA = false` |
| 2 | `Arrival` | Önce A cleanup, sonra Effect B isteği. | `ignoreA = true`, `ignoreB = false` |
| 3 | `Arrival` cevabı gelir | B cevabı state'i günceller. | B hâlâ güncel |
| 4 | Geç `Alien` cevabı gelir | A callback'i bayrağı kontrol edip state'i değiştirmez. | A artık yok sayılır |

Tablodaki önemli kısım, her `ignore` değişkeninin effect callback'inin içinde tanımlı olmasıdır. Değişkeni bileşen dışında paylaşılan tek bir yere koyarsan yeni effect eski effect'in bayrağını da değiştirir; iki isteğin hangisine ait olduğunu ayırt edemezsin.

:::mistake[Bayrak tüm effect'ler için ortak]
Belirti → Yeni film seçilince yeni isteğin cevabı da bazen ekrana yazılmıyor.
Neden → `ignore` bileşen veya dosya seviyesinde tek değişkense eski ve yeni effect aynı bayrağı paylaşır.
Düzeltme → Bayrağı effect callback'inin içinde oluştur; her kurulum kendi cevabını ayrı takip etsin.
:::

## İstek artık gereksizse ağı da durdur

`ignore` cevabın state'e yazılmasını engeller ama tarayıcı yanıt gövdesini indirmeyi sürdürebilir. `fetch` için **`AbortController`**, isteğe bir iptal sinyali vermeni sağlayan tarayıcı aracıdır. Yeni film seçilince cleanup'ta eski controller'ı iptal edebiliriz.

```tsx check
import { useEffect, useState } from 'react'

type Rating = { average: number }

export function RatingPreview({ movieId }: { movieId: number }) {
  const [message, setMessage] = useState('Puan yükleniyor…')

  useEffect(() => {
    const controller = new AbortController()

    fetch(`/api/movies/${movieId}/rating`, { signal: controller.signal })
      .then((response) => response.json() as Promise<Rating>)
      .then((rating) => setMessage(`Puan: ${rating.average}`))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setMessage('Puan alınamadı')
      })

    return () => controller.abort()
  }, [movieId])

  return <p>{message}</p>
}
```

Controller'ın `signal` değerini `fetch` seçeneklerine veriyoruz. Cleanup `abort()` çağırınca tarayıcı bu isteği durdurmayı dener; Promise reddedilir ve iptal hatasının adı **`AbortError`** olur. Bu ad, kullanıcı yeni bir filme geçtiği için isteği bizim durdurduğumuzu anlatır; sunucu arızası gibi ekrana hata yazmamalıyız. Diğer hatalarda örnekteki genel hata metni kullanılabilir.

| Olay | Eski `movieId` isteği | Yeni `movieId` isteği | Ekran |
| --- | --- | --- | --- |
| İlk film seçilir | A başlar | — | Puan yükleniyor… |
| Yeni film seçilir | Cleanup A'yı abort eder | B başlar | Puan yükleniyor… |
| A reddedilir | `AbortError` sessizce geçilir | B sürer | Hata metni çıkmaz |
| B tamamlanır | İptal edilmiş | B sonucu state'e yazılır | Yeni filmin puanı |

Sadece state yazımını önlemek yeterliyse `ignore` kısa ve genel bir çözümdür; o, Promise tabanlı her işte kullanılabilir. `AbortController` özellikle `fetch` gibi sinyali kabul eden bir işi de durdurur. Gerçek arama kutusunda genellikle amaç, artık ekranda olmayan sorgunun cevabını göstermemek ve gereksiz ağ işini azaltmaktır.

:::info[Slow 3G ile sırayı görünür kıl]
Hızlı bağlantıda ilk cevap çoğu kez yeni cevaptan önce gelir ve yarış fark edilmez. Tarayıcı DevTools'un Network panelinden yavaş bir bağlantı profili seçip arka arkaya iki film seçersen, eski isteğin geç dönmesi veya iptal edilmesi daha görünür olur.
:::

## Özet

- Asenkron isteklerin bitiş sırası başlama sırasından farklı olabilir; eski cevap yeni seçimi ezebilir.
- Cleanup, dependency değiştiğinde eski effect için; bileşen kaldırıldığında son effect için çalışır.
- Effect içindeki `ignore` bayrağı eski cevabın state'i değiştirmesini engeller.
- `AbortController` ve `signal`, destekleyen `fetch` isteğini iptal etmeye yarar.
- `AbortError` beklenen iptal sonucudur; kullanıcıya normal hata gibi gösterilmez.

**Yeni terimler**

- **Race condition:** İşlemlerin tamamlanma sırası değişince sonucun yanlış olabildiği durum.
- **Cleanup:** Effect'in eski dış işi kapatmak için döndürdüğü temizlik fonksiyonu.
- **`ignore` bayrağı:** Eski async cevabın state'e yazmasına izin verilip verilmeyeceğini belirten yerel boolean.
- **`AbortController`:** `fetch` gibi API'lere iptal sinyali sağlayan tarayıcı nesnesi.
- **`AbortError`:** İptal edilen `fetch` Promise'inin reddedilme adı.

**Kendini yokla:** Yeni sorgu geldiğinde eski Promise daha sonra biterse neden onu React kendiliğinden susturmaz?
*Cevap:* React ağ isteğinin hâlâ geçerli olup olmadığını bilemez; cleanup ile eski sonucu biz etkisizleştiririz.

**Kendini yokla:** `ignore` ile `AbortController` arasındaki temel fark nedir?
*Cevap:* `ignore` yalnızca eski cevabın state'i güncellemesini engeller; `AbortController` destekleyen ağ isteğini de durdurmayı dener.
