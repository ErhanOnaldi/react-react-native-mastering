---
title: "Yazmayı önceliklendir"
minutes: 17
kind: concept
---

# Yazmayı önceliklendir

:::pain[Problem]
Kullanıcı film arama kutusuna hızlıca "Yıldızlararası" yazıyor. Klavyeden 14 tuşa basılıyor. Ancak her bir tuş vuruşunda React, alttaki 500 satırlık tabloyu sıfırdan hesaplayıp çizmeye çalıştığı için tarayıcının ana iş parçacığı tamamen kilitleniyor.

Kullanıcı yazıyor ama kutuda hiçbir harf görünmüyor. İmleç donuyor. İki saniye sonra tarayıcı kendine geliyor ve 14 harf birden bir patlama gibi kutuya dökülüyor. Kullanıcı uygulamanın çöktüğünü düşünüp sayfayı yenilemeye kalkıyor.

Ağır bir listeyi filtrelemek zaman alabilir; ancak bir kullanıcının bastığı tuşun ekranda anında görünmesini engellemek affedilemez bir kullanıcı deneyimi hatasıdır.
:::

## Acil ve ertelenebilir güncellemeler

React 18 öncesinde tüm state güncellemeleri eşit önceliğe sahipti. Bir `setState` çağrıldığında, o güncelleme ister tek bir harfin ekranda gösterilmesi olsun, isterse 5000 satırlık bir tablonun yeniden hesaplanması olsun, araya hiçbir şey giremezdi (blocking render).

React Concurrency (Eşzamanlılık) modeli bu ayrımı kökten değiştirdi:

1. **Acil Güncellemeler (Urgent Updates):** Kullanıcının doğrudan fiziksel etkileşimleridir. Klavyede bir harfe basmak, bir butona tıklamak, bir açılır kutuyu açmak. Kullanıcı bu işlemlerin sıfır gecikmeyle (16 milisaniyenin altında) ekrana yansımasını bekler.
2. **Ertelenebilir Güncellemeler (Transitions / Non-urgent):** Arayüzün bir görünümden diğerine geçişidir. Arama sonuçlarının listelenmesi, bir grafiğin yeniden çizilmesi, sekmeler arasında geçiş yapılması. Kullanıcı bu işlemlerin bir miktar sürebileceğini doğal olarak kabul eder.

React'te bu önceliklendirmeyi yöneten iki temel araç vardır: `useTransition` ve `useDeferredValue`.

## useTransition ve useDeferredValue zihinsel modelleri

### 1. `useTransition()` — State güncellemesini ertelemek
- **Ne yapar:** Sana `[isPending, startTransition]` ikilisini verir.
- **Kullanım yeri:** Doğrudan bir state güncelleme fonksiyonun (`setState`) varsa ve bu güncellemeyi düşük öncelikli olarak işaretlemek istiyorsan kullanılır.
- **Kesin kural:** `startTransition(() => { setTab('detay') })` dediğinde React bu güncellemeyi arka planda hazırlar. Eğer bu sırada kullanıcı başka bir tuşa basarsa, React arka plandaki transition render'ını **anında yarıda keser (interrupt)**, acil olan tuş basışını ekrana basar, ardından transition'a geri döner.
- `isPending` bayrağı, geçiş henüz sürerken kullanıcıya bir yükleniyor göstergesi veya durum mesajı sunmanı sağlar.

### 2. `useDeferredValue(value)` — Tüketilen değeri ertelemek
- **Ne yapar:** Sana bir değerin ertelenmiş bir kopyasını (`deferredValue`) verir.
- **Kullanım yeri:** State güncellemesi senin elinde değilse (örneğin değer üst bileşenden bir prop olarak geliyorsa) ya da kontrollü bir inputun değerini ekranda hemen tutup, ağır alt ağaca gecikmeli bir kopya aktarmak istiyorsan kullanılır.
- **Kesin kural:** Input kutusunun `value` prop'una daima güncel `query` verilir. Ağır liste bileşenine ise `deferredQuery` verilir. React önce inputu günceller ve ekrana boyar. Ana iş parçacığı nefes aldığında `deferredQuery`'yi günceller ve listeyi çizer.

## Debounce ile Scheduling arasındaki hayati fark

Geliştiricilerin en çok karıştırdığı iki kavram debounce ve concurrency scheduling'dir:

| Özellik | Debounce (`setTimeout`) | React Transition / Deferred |
|---|---|---|
| **Mekanizma** | İşlemi sabit bir süre (ör. 300 ms) **zamana yayarak bekletir**. | Bir zamanlayıcı değildir! İşlemci boşsa **0 ms'de anında çalışır**. |
| **Gecikme** | Güçlü bir bilgisayarda da 300 ms bekler. | Yalnızca CPU sıkışıksa ertelenir; boşta gecikme sıfırdır. |
| **Ağ istekleri** | Ağ isteklerinin sayısını azaltmak için birebirdir. | **Ağ isteklerini otomatik azaltmaz!** Ağ için debounce hâlâ gerekir. |
| **Arayüz duyarlılığı** | Tuş basışlarını durdurmaz ama sonucu geciktirir. | Tuş vuruşlarının anında boyanmasını garanti eder (INP'yi korur). |

:::mistake[Deferred değeri debounce sanmak]
- **Belirti:** `useDeferredValue` ekledim ama kullanıcının her harfinde TMDB API'sine istek gidiyor!
- **Neden:** `useDeferredValue` bir ağ sınırlayıcısı (rate limiter) değildir; render önceliği düzenleyicisidir.
- **Düzeltme:** Ağ isteklerini kısmak için TanStack Query veya Modül 5'te öğrendiğimiz debounce desenini kullan; `useDeferredValue`'yu ise eldeki veriyi ekrana basarken arayüzün donmaması için kullan.
:::

## Bir tuş vuruşunda adım adım iz sürelim

Kullanıcının inputa "A" yazıp hemen arkasından "B" harfine bastığı bir senaryoda `useDeferredValue` akışını adım adım izleyelim:

| Adım | Kullanıcı Eylemi | `query` (Acil State) | `deferredQuery` (Ertelenen) | Ekranda Ne Görünür? | `query !== deferredQuery` |
|---|---|---|---|---|---|
| 1 | Boş sayfa açıldı | `""` | `""` | Boş input, tüm liste | `false` |
| 2 | 'A' tuşuna bastı | `"A"` | `""` (eski değer korunur!) | Inputta "A" belirdi, liste henüz filtrelenmedi | **`true` ("Güncelleniyor..." yazısı çıkar)** |
| 3 | React listeyi süzmeye başladı | `"A"` | `"A"` hazırlığı | Arka planda CPU hesaplama yapıyor | `true` |
| 4 | Kullanıcı HEMEN 'B' tuşuna bastı! | `"AB"` | `""` | **React 3. adımı çöpe attı!** Inputta anında "AB" yazdı | **`true`** |
| 5 | Kullanıcı durdu (işlemci boşaldı) | `"AB"` | `"AB"` | Liste "AB" sonuçlarına filtrelendi, "Güncelleniyor" kalktı | `false` |

4. adıma çok dikkat et: Geleneksel React'te 'A' harfinin 500 satırlık render'ı bitmeden 'B' harfi asla ekranda görünemezdi. Eşzamanlı React'te ise 'B' tuşu geldiği anda yarım kalan 'A' render'ı iptal edildi; input derhal "AB" oldu ve ardından liste doğrudan "AB" sonuçlarına göre güncellendi.

## Kod örneği: Sunucu log kayıtlarında önceliklendirme

Şimdi bir DevOps panelinde sunucu log kayıtlarının filtrelenmesini ve sekmeler arası geçişi inceleyelim.

### Kırık yaklaşım: Inputun kendisini ertelemek

En ölümcül hata, inputun kendi `value` prop'una deferred değeri bağlamaktır:

```tsx
// YANLIŞ: Inputun kendisini geciktirirsen klavye yine takılır!
export function BrokenLogViewer({ logs }: { logs: string[] }) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  return (
    <div>
      {/* HATA: value={deferredQuery} yazarsan yazdığın harf kutuda gecikmeli görünür! */}
      <input
        value={deferredQuery}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Log filtrele..."
      />
      <LogList logs={logs} filter={deferredQuery} />
    </div>
  )
}
```

Bu kodda input, güncel `query` yerine ertelenmiş `deferredQuery`'ye bağlandığı için kullanıcının yazdığı harf ekranda gecikerek çıkar. Amacın tam tersi gerçekleşir!

### Doğru yaklaşım: useDeferredValue ve useTransition uyumu

```tsx check
import { useState, useTransition, useDeferredValue } from 'react'

export interface ServerLogEntry {
  id: string
  message: string
  level: 'info' | 'error' | 'warn'
}

interface LogViewerProps {
  logs: ServerLogEntry[]
}

export function CleanLogViewer({ logs }: LogViewerProps) {
  // 1. Arama için useDeferredValue
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  // 2. Ağır sekme geçişi için useTransition
  const [activeTab, setActiveTab] = useState<'all' | 'errors'>('all')
  const [isPending, startTransition] = useTransition()

  // Liste süzme işlemi ertelenmiş sorguyu kullanır
  const isStale = query !== deferredQuery

  const visibleLogs = logs.filter((log) => {
    const matchesTab = activeTab === 'all' || log.level === 'error'
    const matchesQuery = log.message.toLowerCase().includes(deferredQuery.toLowerCase())
    return matchesTab && matchesQuery
  })

  function handleTabChange(nextTab: 'all' | 'errors') {
    // Sekme geçişini düşük öncelikli yapıyoruz; arayüz kilitlenmez
    startTransition(() => {
      setActiveTab(nextTab)
    })
  }

  return (
    <section>
      <header>
        {/* Input daima GÜNCEL query'ye bağlıdır */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Log filtrele..."
        />
        {isStale && <span className="badge">Liste güncelleniyor...</span>}

        <nav>
          <button onClick={() => handleTabChange('all')}>Tümü</button>
          <button onClick={() => handleTabChange('errors')}>Yalnızca Hatalar</button>
        </nav>
        <p role="status">{isPending ? 'Sekme yükleniyor...' : ''}</p>
      </header>

      <ul>
        {visibleLogs.map((log) => (
          <li key={log.id} className={log.level}>
            {log.message}
          </li>
        ))}
      </ul>
    </section>
  )
}
```

Bu doğru yapıda:
- Kullanıcı arama kutusuna yazdığında `query` anında değişir; input milisaniye kaybetmeden yeni harfi gösterir.
- Liste `deferredQuery` ile beslendiği için arka planda süzülür; liste yetişene kadar `isStale` sayesinde kullanıcıya "Liste güncelleniyor..." bilgisi dürüstçe verilir.
- Sekme butonuna tıklandığında `startTransition` sayesinde arayüz donmaz, durum mesajı gösterilir ve yeni sekme hazır olunca ekrana boyanır.

## Sınır durumları ve sık yapılan hatalar

:::mistake[1. useTransition içinde input state'ini güncellemek]
- **Belirti:** `onChange={(e) => startTransition(() => setQuery(e.target.value))}` yazdın; arama kutusu tuhaf bir şekilde takılıyor ve harfler sırayla değil rastgele gecikmelerle geliyor.
- **Neden:** Inputun kendi yazma eylemi acil bir güncellemedir. Bir controlled inputun state'ini `startTransition` içine alırsan, React kullanıcının yazdığı harfi geciktirilebilir bir eylem sayar.
- **Düzeltme:** Controlled input'un `setQuery` çağrısını asla transition içine alma. Bırak o acil kalsın; onun türettiği liste işini `useDeferredValue` ile ertele.
:::

:::mistake[2. isPending durumunu koşullu olarak DOM'dan tamamen silmek]
- **Belirti:** Ekran okuyucu (screen reader) veya otomatik testler yükleniyor mesajını kaçırıyor ya da bulamıyor.
- **Neden:** `{isPending && <p role="status">Yükleniyor</p>}` şeklinde elementi tamamen DOM'dan kaldırdığında, yardımcı teknolojiler yeni eklenen canlı bölgeyi (live region) algılamakta gecikebilir.
- **Düzeltme:** Elementi DOM'da sabit tut: `<p role="status">{isPending ? 'Yükleniyor...' : ''}</p>`. İçerik boşken de elementin orada olması erişilebilirlik açısından çok daha kararlıdır.
:::

:::mistake[3. Testlerde geçişleri fake timer ile beklemeye çalışmak]
- **Belirti:** `vi.advanceTimersByTime(500)` çalıştırıyorsun ama transition bir türlü tamamlanmıyor.
- **Neden:** React transitions bir `setTimeout` değildir. React'in kendi mikro-görev tabanlı Scheduler motoruyla çalışır.
- **Düzeltme:** Testlerde zamanlayıcı ilerletmek yerine React Testing Library'nin asenkron yardımcılarını (`await waitFor(...)` veya `await screen.findByText(...)`) kullan.
:::

:::sector[Sektörde nasıl kullanılır?]
Google'ın Core Web Vitals metrikleri arasında yer alan **INP (Interaction to Next Paint)**, kullanıcının bir tıklamadan veya tuş basışından sonra ekranın bir sonraki boyamaya ne kadar sürede geçtiğini ölçer:

- Eğer bir tuş basışında 500 satırlık tabloyu senkron olarak render edersen, INP skoru 300–400 ms'ye fırlar ve Google siteni "Yavaş" olarak etiketler.
- `useDeferredValue` veya `useTransition` kullandığında ise tuş basışının boyanması 16 ms'de tamamlanır (INP yeşilde kalır); ağır liste ise bir sonraki karede ekrana gelir. Sektörde modern e-ticaret siteleri filtre panellerinde INP eşiklerini geçmek için istisnasız bu teknikleri kullanır.
:::

## Özet

- Kullanıcı etkileşimleri acil (urgent) ve ertelenebilir (transitions) olarak ikiye ayrılır.
- Bir kontrollü inputun güncellenmesi daima acildir; ağır listelerin veya grafiklerin çizilmesi ertelenebilir.
- `useTransition`, elindeki bir `setState` çağrısını düşük öncelikli yapmak ve `isPending` durumunu izlemek için kullanılır.
- `useDeferredValue`, bir değerin gecikmeli kopyasını üreterek ağır alt bileşenlere nefes aldırmak için kullanılır.
- Bu araçlar ağ debounce'u değildir; arayüzün kilitlenmesini önleyen eşzamanlı render planlayıcılarıdır (scheduler).

### Kendini yokla

1. **Soru:** Bir kontrollü arama inputunun `onChange` olayında `startTransition(() => setQuery(e.target.value))` kullanmak neden önerilmez?
   - **Cevap:** Çünkü inputun içinde harfin görünmesi acil bir kullanıcı etkileşimidir. Bu state'i transition'a almak harfin kutuda gecikmeli ve takılarak çıkmasına yol açar.

2. **Soru:** `query !== deferredQuery` kontrolü kullanıcıya neyi göstermek için kullanılır?
   - **Cevap:** Kullanıcının yeni bir şey yazdığını ancak alttaki listenin henüz son sorguya göre filtrelenme aşamasında olduğunu (eski verinin gösterildiğini) belirten bir "Güncelleniyor..." durumu sunmak için kullanılır.
