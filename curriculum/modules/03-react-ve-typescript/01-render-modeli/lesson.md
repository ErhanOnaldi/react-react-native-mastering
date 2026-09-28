---
title: "Render'ın saf işi ve commit"
minutes: 18
kind: concept
---

# Render'ın saf işi ve commit

:::pain[Problem]
Etkinlik sayfasını açınca konsolda aynı “sayfa görüntülendi” kaydı iki kez beliriyor. Kullanıcı tek kez geldi; üstelik kayıt kodu bileşenin gövdesinde. Render sayısını kullanıcı eylemi sayısı gibi kullanmak, analitik kayıtlarını şişirir ve render sırasında başlatılan isteklerin tekrarını görünmez kılar.
:::

## React'in ekranı güncelleme sırası

React'te bir bileşen çağrısı tek başına ekrana yazmak demek değildir. React önce ekranda ne olması gerektiğini hesaplar, sonra gerçek DOM'a gerekli değişiklikleri uygular. Bu iki işi ayırmak, aynı bileşen birden fazla kez çağrıldığında yan etkilerin neden tehlikeli olduğunu açıklar.

![Tetikleme, saf render, commit ve effect sırası](diagram:render-commit "Bir güncellemenin aşamaları")

Bu akışı dört kuralla oku:

1. **Tetikleme yeni hesap isteğidir.** İlk mount, state güncellemesi, ebeveyn render'ı ve okunan context değerinin değişmesi React'e yeni bir hesaplama başlatabilir. Yeni props da genellikle ebeveynin render'ıyla gelir. Tetikleme, DOM'un kesin değişeceği anlamına gelmez.
2. **Render saf hesaplamadır.** React bileşen fonksiyonunu çağırır; o çağrının props ve state değerlerinden React elementleri üretmesini bekler. Aynı girdiler aynı JSX'i vermeli. Render içinde ağ isteği, DOM mutasyonu, sayaç artırma veya dışarıya kayıt gönderme yapılmaz.
3. **Commit gerçek DOM'u eşitler.** React yeni ağaç ile önceki ağacı karşılaştırır ve gereken DOM değişikliklerini uygular. Çıktı aynıysa render olmuş olabilir ama DOM'a değişiklik yazmak gerekmeyebilir.
4. **Effect commit sonrasındaki dış dünyaya aittir.** `useEffect`, DOM güncellendikten sonra ve çoğu durumda tarayıcı boyadıktan sonra harici sistemle senkronizasyon kurar. Etkileşime bağlı effect'in boyamadan önce çalışabildiği durumlar vardır; kesin yerleşim ölçümü için `useLayoutEffect` ayrı bir araçtır. Her iş effect gerektirmez; tıklamayla başlayan işi event handler'da, ekrandan türetilen değeri render hesabında tut.

Render'ı “arayüzün fotoğrafını hesapla”, commit'i “fotoğrafı DOM'a uygula” diye düşünebilirsin. Bileşenin çağrılması React'in hesaplama adımıdır; ekranda bir şey değişmesi ise commit sonucudur. Tarayıcının boyama zamanı ile React'in bu iki aşaması aynı kavram değildir: önemli sözleşme, effect'in commit edilmiş arayüzle çalışmasıdır.

## Aynı bileşen çağrısında neler olur?

Bir bilet gişesi panelinin başlığını props'tan hesapladığını düşün. Kullanıcı dili değiştirince üst bileşen yeni `locale` verir. Aşağıdaki basit render fonksiyonu iki değer için iki ayrı element ağacı üretir:

```tsx check
type CounterProps = { label: string; value: number }

function CounterPanel({ label, value }: CounterProps) {
  return <section aria-label={label}><strong>{value}</strong></section>
}

const turkishPanel = CounterPanel({ label: 'Bilet sayısı', value: 2 })
const englishPanel = CounterPanel({ label: 'Ticket count', value: 2 })
void turkishPanel
void englishPanel
```

Gerçek uygulamada bu fonksiyonu React çağırır; örnek, aynı girdinin nasıl JSX'e dönüştüğünü göstermek için doğrudan çağrı yapıyor. Hiçbir dış değer değiştirilmedi. Render sırasında `value++` yapılsaydı aynı fonksiyon çağrısının sonucu gizlice değişirdi. `console.log` bile dışarıya etkidir: geliştirme kontrolü render'ı yeniden çağırdığında kayıt sayısı artar.

Şimdi bir güncellemenin zaman sırasını izleyelim. Başlangıçta `status` değeri `ready`, başlık “Seanslar” olsun. Kullanıcı yenile düğmesine basınca event handler `setStatus('loading')` çağırır:

| Sıra | Ne çalışır? | Görülen değer / etki |
| --- | --- | --- |
| 1 | Kullanıcı event handler'ı çağırır | `setStatus('loading')` güncellemeyi kuyruğa koyar |
| 2 | React yeni render ister | Bileşen bu render'da `status === 'loading'` görür |
| 3 | Bileşen JSX hesaplar | “Yükleniyor…” mesajını içeren ağaç çıkar |
| 4 | React commit eder | Önceki içerik gerekiyorsa yenisiyle değiştirilir |
| 5 | Varsa effect çalışır | DOM güncelken ağ gibi harici kaynakla senkronizasyon kurulur |

Bu sırada event handler, render hesabı ve effect farklı sorumluluk taşır. “Yenile düğmesine basıldı” bilgisi event handler'da bilinir. “Hangi mesaj görünmeli?” sorusu render hesabında yanıtlanır. “Bu ekrana ait harici aboneliği nasıl kurup temizlerim?” sorusu effect'e aittir.

## Yan etkiyi render'dan çıkar

Bir sayaçta her render'da ziyaret sayısını artırmak şu tür bir hataya yol açar:

```tsx
function VisitCount() {
  let visits = 0
  visits += 1
  sendAnalytics('page-view')
  return <p>{visits}</p>
}
```

Her çağrı `visits` için yeni bir yerel değişken oluşturur; ekranda kalıcı sayaç elde etmezsin. Analitik çağrısı ise gerçekten dış sisteme gider ve render tekrarlandıkça tekrarlanır. Saflık yalnız “DOM'a dokunmamak” değildir; render'ın gözlemlenebilir dış etki üretmemesidir.

Eğer kayıt belirli bir tıklamayı anlatıyorsa o kayıt tıklama handler'ında olmalı. Ekran bir dış kaynağa bağlanıyorsa effect ve uygun cleanup gerekir. Başlık gibi JSX'ten hesaplanabilen bir metin için üçüncü bir state oluşturma; aynı girdiden her render'da türet.

```tsx check
import { useState } from 'react'

function VisitCounter() {
  const [visits, setVisits] = useState(0)
  return (
    <button onClick={() => setVisits((current) => current + 1)}>
      Ziyaret: {visits}
    </button>
  )
}

const panel = <VisitCounter />
void panel
```

Bu örnekte state değişikliği kullanıcı eyleminden doğar. Render yalnız o anki değeri gösterir; sayacı artırma kararı ise handler'dadır. Bir sonraki render aynı state için aynı düğme ağacını hesaplar.

### StrictMode neden fazladan çağrı yapar?

Geliştirme modunda `StrictMode`, saflık sorunlarını ortaya çıkarmak için bileşen fonksiyonunu ve bazı saf olması gereken hesapları fazladan çağırır. Effect için de ilk mount'ta ek bir setup → cleanup → setup denemesi yapar; böylece eksik cleanup görünür olur. `StrictMode` yalnız ağacın bir bölümünü sarıyorsa ilk mount'taki ek effect denemesi uygulanmaz. Production'da bu geliştirme denemeleri yoktur. Render'ın iki çağrısı iki DOM commit'i veya iki kullanıcı eylemi demek değildir.

Konsol kaydı saymak yerine ekrandaki davranışı ve dış sistemde oluşan eylemi ayrı izle. Saf bir render'ı iki kez çalıştırmak aynı UI ağacını hesaplar; yan etkili bir render ise iki e-posta, iki istek veya iki analitik olayı başlatabilir. Production'da geliştirme kontrolü olmayabilir ama render'ın tekrar çağrılması hâlâ geçerli bir olasılıktır.

### Bir güncellemenin görünür ve görünmez sınırları

Başlangıç ekranında `status = 'ready'` ve “Seanslar” yazdığını varsay. Aşağıdaki tabloda iki ayrı bilgiyi izle: bileşen fonksiyonunun hesapladığı metin ve kullanıcının DOM'da gördüğü metin. Render devam ederken eski DOM ekranda kalır; React'in hesapladığı JSX henüz görünür değildir.

| An | Handler / render değeri | Hesaplanan JSX | DOM'da görünen | Dış iş |
| --- | --- | --- | --- | --- |
| İlk render ve commit | `status = 'ready'` | “Seanslar” | “Seanslar” | İlk effect kurulabilir |
| Tıklama handler'ı | Eski closure: `ready` | Henüz yeni hesap yok | “Seanslar” | `setStatus('loading')` kuyruğa girer |
| İkinci render | `status = 'loading'` | “Yükleniyor…” | Hâlâ “Seanslar” | Render dış sisteme dokunmaz |
| İkinci commit | Yeni değer hazır | “Yükleniyor…” | “Yükleniyor…” | Gereken DOM metni değiştirilir |
| Effect aşaması | Yeni render'ın closure'ı | Aynı | “Yükleniyor…” | Bağımlılık değiştiyse eski ilişki temizlenir, yenisi kurulur |

React render çalışmasını durdurup yeniden deneyebilir. Örneğin daha öncelikli bir kullanıcı etkileşimi gelirse hazırlanmış bir ağaç commit edilmeden bırakılabilir. Bu yüzden render içindeki analitik çağrısını “nasıl olsa sonra commit olur” diye savunamazsın: kullanıcı hiç görmediği bir arayüz için kayıt göndermiş olursun. Event handler'daki işin gerekçesi doğrudan kullanıcı eylemidir; effect'teki işin gerekçesi commit edilmiş bileşenin dış sistemle ilişkisidir.

Bir başka sınır da aynı çıktının tekrar hesaplanmasıdır. Ebeveynin tema state'i değişip çocuk yine `value = 2` alabilir. Çocuk fonksiyonu yeniden çağrılsa bile `<strong>2</strong>` düğümü aynı kalır; React'in DOM metnini yeniden yazmasına gerek yoktur. Böyle bir render'ı DevTools'ta görüp “React tüm sayfayı silip tekrar yaptı” sonucuna varma. Render çağrısı, DOM mutasyonu ve tarayıcının boyaması ayrı gözlemlerdir.

Hata ayıklarken bu üç gözlemi ayrı kaydet: bileşen fonksiyonuna girildi mi, DOM düğümünün metni değişti mi, dış abonelik temizlenip yeniden kuruldu mu? İlk sorunun cevabı evetken diğer ikisi hayır olabilir. Bu ayrım, gereksiz render ile bozuk effect yaşam döngüsünü birbirine karıştırmanı önler.

### Effect'in cleanup sırasını oku

Bir panel `roomId = 'a'` iken bildirim kanalına abone olsun. Sonraki commit'te `roomId = 'b'` olursa önce eski kanalın aboneliği kaldırılır, ardından yeni kanala abone olunur. Cleanup, bileşen tamamen kalkarken de çalışır. Aboneliği render içinde kurarsan React'in iptal ettiği render için bile bağlantı açılabilir; cleanup döndürecek bir yerin de kalmaz.

```tsx check
import { useEffect } from 'react'

function ChannelStatus({ roomId }: { roomId: string }) {
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data === roomId) console.info('Etkin kanal', roomId)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [roomId])

  return <p>Kanal: {roomId}</p>
}

void ChannelStatus
```

| An | `roomId` | DOM | Abonelik |
| --- | --- | --- | --- |
| İlk commit sonrası | `a` | “Kanal: a” | `a` için handler kurulur |
| Prop değişimi, render | `b` | Hâlâ “Kanal: a” | Eski handler henüz bağlıdır |
| Yeni commit ve effect | `b` | “Kanal: b” | `a` temizlenir, `b` kurulur |
| Unmount | Bileşen yok | Paragraf kaldırılır | `b` temizlenir |

Effect'in cleanup'ı yalnız “sayfa kapanınca” çalışan bir son işlem değildir; bağımlılık değişiminde de önceki kurulumun eşidir. Bu eşleştirmeyi korursan StrictMode'un geliştirmedeki ek denemesi dış sistemde kalıcı ikinci abonelik bırakmaz.

### Sonraki modüllerde bu ayrım

Effect dersinde bir aboneliğin neden render'da kurulamayacağını ve cleanup'ın hangi commit'ten sonra gerektiğini bu sırayla açıklayacaksın. TanStack Query'de `queryKey` değişince cache'in hangi veriyi gösterdiğini incelerken render edilen veri ile ağ isteğinin tamamlanmasını ayıracaksın. Formlarda input'un yazdığı değer handler'dan state kuyruğuna, sonra commit ile DOM'a gider. Performans ölçerken de “bileşen çağrıldı” ile “DOM değişti”yi ayrı sayman, yanlış optimizasyon yapmanı önler.

## Sık hatalar

:::mistake[Render içinde istek başlatmak]
Belirti → Sayfa yüklenirken aynı kaynak için istek sayısı artıyor veya önizleme sonsuz istek uyarısı veriyor.  
Neden → Bileşen her render edildiğinde gövde yeniden çalışıyor; gövdedeki `fetch` de yeniden başlıyor.  
Düzeltme → İsteğin hangi olaydan veya dış kaynak eşitlemesinden doğduğunu belirle; event handler ya da effect kullan, mümkünse sonraki veri katmanında uygun cache aracına geç.
:::

:::mistake[Render sayısını kullanıcı eylemi saymak]
Belirti → Bir sayfa görüntüleme metriği geliştirmede iki artıyor.  
Neden → Render, kullanıcı eylemi değildir; React hesaplamayı tekrar deneyebilir veya üst bileşenin güncellemesi alt bileşeni yeniden çağırabilir.  
Düzeltme → Tıklama metriğini ilgili event handler'da, görüntüleme metriğini ise uygulamanın açık sayfa yaşam döngüsü politikasına göre tek bir yerde kaydet.
:::

:::mistake[Effect'i her hesaplanan değer için kullanmak]
Belirti → Birbirine bağlı state alanları bir render gecikmeli görünür veya gereksiz iki güncelleme oluşur.  
Neden → JSX'ten türetilebilecek bilgi ikinci state'e kopyalanmıştır.  
Düzeltme → Değer yalnız mevcut props/state'e bağlıysa render sırasında hesapla; effect'i dış sistemle senkronizasyon için sakla.
:::

:::sector
Ekiplerde code review kuralı genellikle basittir: render gövdesi tekrar çalışsa da ağ, analitik veya DOM üzerinde yinelenen işlem başlatmamalı. Bir yan etkinin sahibi açıkça belirlenir; kullanıcı eylemi handler'a, abonelik effect'e, gösterilecek değer saf render'a bırakılır. Böyle bir ayrım hata ayıklarken “hangi satır dışarıya ne zaman dokundu?” sorusuna yanıt verir.
:::

## Özet

- Render, o anki props ve state'ten JSX hesaplar; dış etki üretmez.
- Commit gerekli DOM farklarını uygular; her render DOM'u baştan yaratmaz.
- Effect commit'ten sonra dış sistemle senkronizasyon kurar; event kaynaklı iş handler'da kalır.
- StrictMode geliştirmede saflık ve cleanup kusurlarını görünür kılabilir.

**Kendini yokla:** Aynı props ile bir bileşenin yeniden çağrılması, DOM'un kesin değişeceği anlamına gelir mi?  
*Cevap:* Hayır. Render yeni ağaç hesaplar; React fark bulmazsa commit'te DOM değişikliği yapmayabilir.

**Kendini yokla:** Kullanıcı yıldız düğmesine basınca favoriyi kaydetmek hangi aşamada başlamalı?  
*Cevap:* Bu kullanıcı eyleminden doğduğu için düğmenin event handler'ında.
