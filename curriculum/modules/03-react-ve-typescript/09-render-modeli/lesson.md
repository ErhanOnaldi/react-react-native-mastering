---
title: "React ekranı nasıl günceller?"
minutes: 17
kind: concept
---

# React ekranı nasıl günceller?

Az önce input'a yazılan sorgunun state'e gittiğini, sonra kutunun ve film listesinin yeni değeri gösterdiğini gördün. Arada neler oluyor? React önce component'lerini çalıştırıp ekranda ne olması gerektiğini hesaplar, sonra bu hesabın gerektirdiği değişiklikleri DOM'a uygular. Bu ders şimdiye kadarki props, state ve event bilgisini bir araya getiriyor.

![State güncellemesi, render ve commit adımları](diagrams/render-akisi.svg)

![Tetikleme, saf render, commit ve effect sırası](diagram:render-commit "Bir güncellemenin aşamaları")

Ortak şemadaki effect adımını 5. modülde ele alacağız; burada trigger, render ve commit'e odaklanıyoruz.

## Render, JSX hesabıdır

**Render**, bir component fonksiyonunun o anki props ve state'e göre hangi JSX'in gösterilmesi gerektiğini hesaplamasıdır. JSX henüz ekrandaki HTML değişti demek değildir.

```tsx check
function FilmTitle({ title }: { title: string }) {
  return <h2>{title}</h2>
}

const heading = FilmTitle({ title: 'Dune' })
void heading
```

Bu component'e `title` değeri geldiğinde fonksiyon `<h2>Dune</h2>` JSX'ini hesaplar. React uygulamasında component'i React çağırır; örnekte doğrudan çağrı yalnızca hesabı görünür kılmak için. Aynı `title` ile tekrar çalışırsa yine aynı başlığı hesaplar. Bileşen fonksiyonu çalıştı diye ekrandaki DOM'un baştan kurulduğunu varsayma.

## Bir event yeni hesabı başlatır

Render'ı yeniden istemeye yarayan başlangıç noktasına burada **trigger** (tetikleme) diyeceğiz. İlk gösterim, state'i güncelleyen bir event veya parent'tan gelen yeni props yeni render'a yol açabilir. Event handler yalnızca ilgili olay gerçekleştiğinde çalışan fonksiyondur; o fonksiyon state setter'ını çağırabilir.

Bir Sinema kartında izleme sayısını gösterelim. Burada bir önceki derste gördüğün state setter'ını kullanıyoruz:

```tsx check
import { useState } from 'react'

function WatchCount() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>İzlendi: {count}</button>
}

const button = <WatchCount />
void button
```

İlk render `count` değeri `0` olan button JSX'ini hesaplar. Tıklama event'i `setCount` çağırır; React yeni bir render ister ve component bu kez yeni state değerini okur. Setter, eski render içinde `count` değişkenini yerinde değiştirmez. Bu akışta event güncellemeyi başlatır, render yeni arayüzü hesaplar.

## Commit gereken DOM değişikliğini uygular

**Commit**, React'in hesaplanan arayüz için gerçek DOM'a gereken değişiklikleri uyguladığı aşamadır. **DOM**, tarayıcının sayfa elementlerini tuttuğu ağaçtır. Render yeni JSX üretir; commit bu sonuçla ekrandaki mevcut ağaç arasında gereken farkı uygular.

Örneğin film başlığı `Dune` iken yeni props `Arrival` olsun. Yeni render ikinci metni hesaplar, commit görünür başlığı günceller. Değer `Dune` olarak kalırsa render yeniden hesaplanmış olabilir ama DOM metnini değiştirmek gerekmez.

Props değişikliği her zaman çocuğun kendi setter'ından gelmez. Parent yeni bir başlık prop'u ile render edilirse çocuk da yeni prop'u kullanarak JSX hesaplar. Çocuğun state'i aynı kalabilir; yalnız girdilerden biri değişmiştir. Böylece render'ı “ekranı mutlaka değiştiren komut” gibi değil, güncel girdiler için yeni görünümü hesaplama işi gibi düşünmek kolaylaşır.

| Sıra | Ne olur? | Değer / ekranda görünen |
| --- | --- | --- |
| 1. İlk render | `WatchCount` state'i okur, JSX hesaplar | `count = 0`; “İzlendi: 0” |
| 2. İlk commit | İlk arayüz DOM'a uygulanır | “İzlendi: 0” görünür |
| 3. Tıklama | Event handler `setCount(1)` çağırır | Eski ekranda hâlâ “0” vardır |
| 4. Yeni render | Component yeni state'i okur | “İzlendi: 1” JSX'i hesaplanır |
| 5. Yeni commit | Gerekli metin DOM'da güncellenir | “İzlendi: 1” görünür |

Bu sıra, “state setter çağrıldı, demek ki DOM satırı o anda değişti” düşüncesini düzeltir. Setter güncelleme ister, render sonucu hesaplar, commit sonucu ekrana taşır. React yalnızca değişmesi gereken DOM parçalarını günceller; bütün sayfayı silip yeniden kurmak zorunda değildir.

## Render neden saf kalmalı?

**Saf render**, aynı props ve state girdileriyle aynı JSX'i hesaplayan ve hesap yaparken dışarıda değişiklik başlatmayan render'dır. Render içinde state'i değiştirmek veya tıklama olmuş gibi bir iş yapmak doğru değildir: React aynı hesabı tekrar çalıştırabilir.

Şu component her render'da sayacı artırmaya çalışıyor:

```tsx
function BrokenWatchCount() {
  let count = 0
  count += 1
  return <p>İzlendi: {count}</p>
}
```

Belirti: ekranda kalıcı bir izleme sayacı bekliyorsun ama her render `count` için sıfırdan yeni yerel değişken açar ve tekrar `1` gösterir. Render yeni ekranı hesaplama yeridir; kullanıcı eylemi ise event handler'da işlenmelidir. Önceki `WatchCount` örneğinde artışın click handler'da olması bu yüzden doğru: render yalnız o anki state'i gösterir.

Geliştirme sırasında React'in `StrictMode` özelliği saflık hatalarını fark ettirmek için component'i ilk gösterimde fazladan çağırabilir. Saf component aynı JSX'i hesapladığı için kullanıcı bunu çift tıklama veya çift kayıt olarak görmez. Render içine dışarıya etki yapan kod koyarsan bu fazladan çağrı hatayı görünür kılar. StrictMode denetimi geliştirme davranışıdır; üretimdeki kullanıcı etkileşiminin iki kez gerçekleştiği anlamına gelmez.

Bu yüzden geliştirici araçlarında component fonksiyonunun iki kez çalıştığını görmen tek başına ekranda iki kopya olduğu anlamına gelmez. Önce component'in hangi JSX'i hesapladığına, sonra commit'in DOM'da ne değiştirdiğine bak. Ekranda tek düğme duruyorsa iki hesaplama ile iki DOM düğümünü birbirine karıştırmış olabilirsin.

Bu derste yalnız render ve commit sınırını kuruyoruz. **Effect**, React arayüzü güncelledikten sonra dış bir sistemle eşitleme yapma aracıdır; `useEffect` ve cleanup'ı 5. modülde ele alacaksın.

:::model[Trigger → render → commit]
State setter'ı veya yeni props render'ı tetikleyebilir. Render, o anki girdilerden JSX hesaplar; commit gereken DOM değişikliğini yapar. Render tekrar çalışabileceği için hesabı saf tut.
:::

## Özet

- State güncellemesi, ilk gösterim veya yeni props render'ı tetikleyebilir.
- Render component fonksiyonunu çalıştırıp o anki girdilerden JSX hesaplar.
- Commit gerekli DOM değişikliklerini uygular; her render bütün DOM'u yenilemez.
- Saf render aynı girdilerle aynı JSX'i üretir ve dış etki başlatmaz.
- StrictMode geliştirmede render'ı fazladan çağırıp saflık hatalarını gösterebilir.

**Yeni terimler:**

- **Trigger:** Render'ı yeniden istemeye başlayan olay veya güncelleme.
- **Render:** Props ve state'ten JSX hesaplama aşaması.
- **Commit:** Hesaplanan arayüz için gerekli DOM değişikliklerini uygulama aşaması.
- **Saf render:** Aynı girdilerle aynı JSX'i hesaplayan, hesap sırasında dışarıda değişiklik yapmayan render.

**Kendini yokla:** Bir bileşen aynı props ile yeniden çağrılırsa DOM kesin değişir mi?  
*Cevap:* Hayır. Render yeniden hesaplanabilir ama sonuç aynıysa commit'te DOM değişikliği gerekmeyebilir.

**Kendini yokla:** Bir tıklama sonrası hangi aşama yeni JSX'i hesaplar, hangisi DOM'a uygular?  
*Cevap:* Render JSX'i hesaplar; commit gereken DOM farkını uygular.
