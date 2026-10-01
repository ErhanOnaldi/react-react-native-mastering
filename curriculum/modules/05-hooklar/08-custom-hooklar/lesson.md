---
title: "Tekrar kullanılabilir davranış: custom hook"
minutes: 17
kind: concept
---

# Tekrar kullanılabilir davranış: custom hook

Bir film kartı bileşeni `useState` ile küçük bir açık/kapalı tercihi tutabilir. Başka bir bileşen de kendi `useState` çağrısıyla benzer bir tercih tutabilir. Bu kodu tekrar kullanmak için yalnızca görünümü değil, state ve Effect gibi React davranışlarını da bir fonksiyonda toplayabilirsin: bu fonksiyona **custom hook** denir.

Custom hook JSX üretmez; onu çağıran bileşene değer, fonksiyon ya da dış sistemle kurulan bir ilişki verir. Bileşen görünümü çizer, hook tekrar kullanılacak davranışı yürütür.

## Bir state davranışını isimlendirelim

Önce basit bir state hook'u düşün. `useState`'i biliyorsun; aşağıdaki fonksiyon onu tek bir amaca bağlayıp çağıran yere geri veriyor:

```tsx
import { useState } from 'react'

function usePreviewOpen() {
  return useState(false)
}
```

`usePreviewOpen` özel bir React API'si değil; bizim yazdığımız sıradan bir JavaScript fonksiyonu. İçinde `useState` çağrıldığı için adına `use` ile başlıyoruz. Bileşen bunu çağırınca React o bileşen için bir açık/kapalı state'i tutuyor.

Bir sonraki adımda bu tuple'ı kullanıp film önizlemesinin görünümünü bileşende bırakıyoruz:

```tsx
function PreviewButton() {
  const [isOpen, setIsOpen] = usePreviewOpen()

  return (
    <button type="button" onClick={() => setIsOpen(!isOpen)}>
      {isOpen ? 'Önizlemeyi kapat' : 'Önizlemeyi aç'}
    </button>
  )
}
```

Tıklama state'i değiştirir; React bileşeni yeniden çalıştırır ve yeni metin görünür. Bu örnek henüz büyük bir soyutlama kazandırmıyor; önemli olan, custom hook'un bileşen içindeki state gibi React'in render akışına katılmasıdır.

## Aynı davranış, ayrı state

Şimdi Sinema sayfasında iki ayrı film kartının önizleme düğmesi olduğunu düşün. Her kart `usePreviewOpen()` çağırabilir:

```tsx
function MovieCard({ title }: { title: string }) {
  const [isOpen, setIsOpen] = usePreviewOpen()

  return (
    <section>
      <h2>{title}</h2>
      <button type="button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Önizlemeyi kapat' : 'Önizlemeyi aç'}
      </button>
    </section>
  )
}
```

İki `MovieCard` ekranda duruyorsa her birinin kendi `isOpen` değeri vardır. İlk kartı açmak ikinci kartı açmaz; hook'un kodu ortaktır, state'i ise hook'u çağıran bileşen örneğine aittir. İki bileşenin aynı state'i paylaşmasını istiyorsan state'i ortak bir üst bileşene taşıman ya da Context kullanman gerekir.

## Dış sistem davranışını tek yere alalım

Bir hook yalnızca state döndürmek zorunda değildir. Tarayıcı bağlantı durumunu izleme işi de Sinema'nın farklı sayfalarında kullanılabilir. `online` ve `offline`, tarayıcının ağ bağlantısı değiştiğinde gönderdiği olaylardır:

```tsx
import { useEffect, useState } from 'react'

function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  )

  useEffect(() => {
    function handleOnline() { setIsOnline(true) }
    function handleOffline() { setIsOnline(false) }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}
```

Hook tarayıcı olaylarını dinler, bileşene yalnızca `boolean` verir. `MovieGrid` bu değere bakıp bağlantı uyarısı gösterir; uyarının metni ve görünümü bileşenin kararıdır. Böylece iki ayrı sayfa davranışı tekrar kullanabilir ama her biri kendi bağlantı state'ini tutar.

Bu örnekte `useEffect` dış sistemle ilişkiyi kurup bileşen ayrılırken temizliyor. Custom hook'a taşımak bu zamanlamayı değiştirmez; yalnızca sorumluluğu tek yerde toplar. `addEventListener` ve `removeEventListener` aynı handler fonksiyonlarını kullanmalıdır; yoksa tarayıcı eklenen dinleyiciyi bulup kaldıramaz.

React'in hazırladığı görünümü sayfaya uyguladığı adıma **commit** denir. Dinleyiciler ilk render sırasında değil, bu adımdan sonra eklenir:

| Zaman | Ne olur? | Tarayıcıdaki dinleyiciler |
|---|---|---|
| İlk render | Başlangıç bağlantı değeri okunur, görünüm hazırlanır | Henüz eklenmedi |
| İlk commit sonrası | Effect çalışıp iki olayı dinlemeye başlar | `online` ve `offline` birer kez |
| Bağlantı kesilir | `handleOffline` `false` state'i ister | Aynı dinleyiciler durur |
| Yeni render ve commit | Uyarı görünür | Dinleyiciler durur |
| Bileşen kaldırılır | Cleanup iki dinleyiciyi kaldırır | Hiçbiri kalmaz |

Tablo, dinleyicilerin commit sonrasında başladığını ve bileşen kaldırılınca temizlendiğini gösteriyor.

## Parametre değişince Effect yenilenir

Bir custom hook parametre de alabilir. Sekme başlığını film adına göre ayarlayan bu hook, `title` değiştiğinde tarayıcı başlığını günceller:

```tsx
function useMovieTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | Sinema`
  }, [title])
}
```

Hook JSX döndürmez; bileşen yalnızca `useMovieTitle(movie.title)` çağrısını yapar. `title` değişince Effect yeniden çalışır çünkü bu değer Effect'in kullandığı bağımlılıklar arasındadır. Böylece hook güncel film adını kullanır.

Zamanlayıcıda da aynı fikir geçerlidir. Bir **timer**, belirli bir süre sonra çalışan tarayıcı işidir. Sinema'da kapanış bildirimi gösterirken hook timer kurabilir; kullanıcı yeni bir bildirim açarsa önceki timer temizlenir ve yeni süre başlar. `setTimeout` gecikme bitince bir kez çalışan timer kurar; `clearTimeout` bekleyen işi iptal eder.

```tsx
function useHideNoticeAfter(open: boolean, delay: number, hide: () => void) {
  useEffect(() => {
    if (!open) return

    const timerId = window.setTimeout(hide, delay)
    return () => window.clearTimeout(timerId)
  }, [open, delay, hide])
}
```

Burada yeni olan, Effect'in üç değere bağlı olmasıdır. `open` kapanırsa, süre değişirse ya da `hide` fonksiyonunun kimliği değişirse React eski timer'ı temizleyip güncel değerlerle yenisini kurar. Arama girdisini gecikmeli kullanma gibi bir davranış da state ve timer ile kurulabilir; temel nokta, yeni değer geldiğinde önceki bekleyen işi temizlemektir.

Zamanı sırayla izleyince neden cleanup gerektiği daha açık:

| Zaman | Olan | Bekleyen timer |
|---|---|---|
| 0 ms | Bildirim açılır, 800 ms'lik timer kurulur | İlk timer |
| 500 ms | Yeni bildirim gelir; Effect cleanup çalışır | İlk timer iptal edilir |
| 500 ms | Yeni kurulum 800 ms bekler | İkinci timer |
| 1.300 ms | Süre dolar ve `hide` çalışır | Timer kalmaz |

İlk timer'ı iptal etmeseydik ikinci bildirim açıldıktan 300 ms sonra kapanırdı; kullanıcının yeni bildirim için beklemesi gereken süreyi eski timer bozardı. Bir değer ancak bir süre değişmeden kaldıktan sonra kullanılacaksa da aynı temizlik kuralı gerekir.

## Değer saklamak ve ağ verisini sunmak

Custom hook'lar bir değeri React state'iyle senkron tutarken başka bir yere de kaydedebilir. Örneğin tarayıcının `localStorage` alanındaki favori tercihleri sayfa yenilense de kalır. Okuma pahalı ya da hataya açık olabileceğinden başlangıçta bir kez yapılır; `useState(() => readSavedValue())` biçimindeki fonksiyon, ilk state değerini üretir. Saklı metin bozuk JSON ise `JSON.parse` hata fırlatabilir; bu durumda başlangıç değerine dönmek gerekir.

State setter'ı hem yeni bir değer hem de önceki değeri alıp yenisini üreten fonksiyon kabul edebilir. Bu iki biçim, aynı anda gelen güncellemelerde son değeri kaybetmeyi önler; önceki state'e dayalı ekleme/çıkarma için fonksiyon biçimi kullanılır. Güncel state değiştiğinde aynı değeri JSON metnine çevirip storage'a yazarsın. `useLocalStorage` gibi generic bir hook'ta `T`, çağıranın sakladığı değerin tipini taşır: dizi verildiyse okuma ve dönen state de o dizi tipiyle kullanılır.

Ağ isteği de hook'un içine alınabilecek bir davranıştır. URL yokken istek başlatmamak, URL değişince önceki işi temizlemek ve sonucu `idle`, `loading`, `success` ya da `error` gibi ayrı durumlarla sunmak, hook'un API'sini kullanışlı kılar. Örneğin film ayrıntısı için veri isteyen `useMovieDetails(url)` bileşene `data` ve durum bilgisini verir; bileşen yalnızca yükleniyor, hata ya da film görünümünü seçer. Custom hook burada yeni bir fetch kuralı icat etmez; daha önce gördüğün Effect ve istek temizliğini tekrar kullanılabilir sınırda toplar.

![Component, custom hook ve dış sistem arasındaki sınır](diagrams/custom-hook-siniri.svg "Custom hook davranışı toplar; her çağrı kendi state'ine sahiptir.")

## Hook çağrısının sırası sabit kalır

React hook state'lerini fonksiyon adlarına göre bulmaz; her render'da hook çağrılarının sırasını izler. Bu nedenle bileşen bir render'da üç hook, diğerinde iki hook çağırmamalıdır.

```tsx
function MovieDetails({ visible }: { visible: boolean }) {
  const online = useOnlineStatus()
  useMovieTitle(visible ? 'Film ayrıntısı' : 'Sinema')

  return <p>{online ? 'Çevrimiçi' : 'Çevrimdışı'}</p>
}
```

İki çağrı da her render'da aynı sıradadır. `visible` koşulu yalnızca hook'a verilen değeri değiştirir. Bu nedenle hook çağrısı `if` içine değil, bileşenin ya da başka bir custom hook'un en üst seviyesine yazılır.

| Render | 1. hook çağrısı | 2. hook çağrısı |
|---|---|---|
| `visible = true` | `useOnlineStatus` | `useMovieTitle('Film ayrıntısı')` |
| `visible = false` | `useOnlineStatus` | `useMovieTitle('Sinema')` |

Yanlışlıkla `if (visible) useMovieTitle(...)` yazarsan `visible` değiştiğinde çağrı listesi kayar. Belirti olarak React hook sırası hakkında hata verebilir veya state'i yanlış çağrıyla eşleştirebilir. Düzeltme: hook'u her render'da çağırıp koşulu parametrede belirt; hook içinde davranış gerekmiyorsa erken çık.

:::mistake[Hook'u koşulun içine koymak]
**Belirti:** Hook kuralları uyarısı çıkar ya da `visible` değişince beklenmedik state görünür. **Neden:** Bir render'da hook çağrılıyor, diğerinde atlanıyor. **Düzeltme:** Hook'u üst seviyede koşulsuz çağır; koşullu davranışı parametreyle bildir.
:::

## Ne zaman hook, ne zaman bileşen?

Bir parçanın JSX'i ve kendi görsel sınırı varsa bileşen olarak düşün. Tekrar kullanılan state veya Effect davranışı varsa, ekranda kendi başına bir öğe üretmese bile custom hook olabilir. Hook'un dış dünya ile kurduğu ilişkiyi (örneğin event listener, timer, fetch) kendi içinde tamamlaması, onu kullanan bileşeni bu ayrıntılardan uzak tutar.

Hook'un çıktısını ihtiyaca göre küçük ve anlaşılır tut. `useOnlineStatus()` için `boolean` yeterliyse nesne ve seçenekler eklemek çağrı yerini zorlaştırır. Hook'a taşındı diye state paylaşılmaz, Effect'in yaşam döngüsü değişmez ve koşullu hook çağrısı doğru hale gelmez.

:::info[Derinlemesine (isteğe bağlı)]
Hook testlerinde `renderHook`, bir hook'u küçük bir test bileşeninde çalıştırır; fake timers ise beklemeden zamanın ilerletilmesini sağlar. Bu araçlar hook'un nasıl çağrıldığını sınar, Hook çağrı sırası kuralını değiştirmez.
:::

## Özet

- Custom hook, React hook'larını bir davranışta toplayan ve JSX döndürmesi gerekmeyen fonksiyondur.
- Hook kodu paylaşılır; hook içindeki state her çağıran bileşene özeldir.
- Dış sistem bağlantısı kuran Effect, cleanup ile dinleyici ya da timer'ı kaldırır.
- Hook'ları her render'da aynı sırada ve üst seviyede çağır; koşulu parametreye taşı.

**Yeni terimler:**

- **Custom hook:** React hook'ları kullanan ve tekrar kullanılabilir davranış sağlayan fonksiyon.
- **Commit:** React'in hazırladığı görünümü sayfaya uyguladığı adım.
- **Timer:** Belirlenen süre sonunda çalışan tarayıcı işi.

**Kendini yokla:** Aynı custom hook'u iki `MovieCard` çağırırsa açık/kapalı değer ortak mıdır?

*Cevap:* Hayır. Her kart kendi bileşen state'ini tutar; paylaşım için state'i yukarı taşımak veya Context kullanmak gerekir.

**Kendini yokla:** Hook'u yalnızca `visible` doğruyken çağırmak yerine ne yaparsın?

*Cevap:* Hook'u her render'da aynı yerde çağırır, `visible` değerini parametre olarak veririm.
