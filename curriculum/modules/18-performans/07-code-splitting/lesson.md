---
title: "Kodu gerektiğinde yükle"
minutes: 17
kind: concept
---

# Kodu gerektiğinde yükle

:::pain[Problem]
Kullanıcı film sitesinin ana sayfasına giriyor. DevTools Network sekmesini açıp baktığında, tarayıcının 3.2 megabaytlık devasa bir `index.js` dosyası indirmeye çalıştığını görüyorsun. Kullanıcı yalnızca arama çubuğunu görüp 3 tane popüler filme bakacaktı.

Fakat senin uygulaman; kullanıcının henüz hiç açmadığı film detay sayfasını, bilet satın alma ve koltuk seçimi modülünü, yönetici panelini ve 800 kilobaytlık interaktif grafik kütüphanesini tek bir dev pakete gömmüş! Zayıf bir 4G mobil bağlantısında bu paketin inmesi, ayrıştırılması (parse) ve çalıştırılması 5 saniye sürüyor. Kullanıcı beyaz ekrana bakmaktan sıkılıp sekmeyi kapatıyor.

Kullanıcının o an ihtiyaç duymadığı kodu ona zorla indirtmek, modern web performansının en büyük günahlarından biridir.
:::

## Kod Bölme (Code Splitting) zihinsel modeli

Kod bölme, tek parça (monolithic) devasa bir JavaScript paketini, ihtiyaç duyuldukça parça parça (chunk) indirilebilen küçük dosyalara ayırma tekniğidir.

Zihinsel modelini şu iki temel seviyede kur:

### 1. Route Düzeyinde Bölme (Route-based Splitting)
En büyük performans kazancı burada elde edilir:
- Kullanıcı ana sayfayı (`/`) açtığında yalnızca ana sayfanın 80 KB'lık JavaScript kodu iner.
- Kullanıcı film detayına (`/movie/550`) tıkladığında, React Router arka planda detay sayfasının modülünü (`movie-details-[hash].js`) indirir ve ekrana basar.
- Kullanıcının hiç ziyaret etmediği Yönetici Paneli (`/admin`) kodu ise sıradan bir kullanıcının telefonuna hayatı boyunca tek bir bayt dahi inmez!

### 2. Bileşen Düzeyinde Bölme (Component-based Splitting)
Aynı sayfa içinde yer alan ancak her kullanıcının açmadığı ağır bileşenler için kullanılır:
- Bir detay sayfasındaki ağır oyuncu kadrosu paneli, gelişmiş bir metin editörü veya açılır bir modal diyalog.
- Sayfa açıldığında bu ağır bileşenlerin kodu indirilmez. Kullanıcı örneğin "Tüm Oyuncuları Göster" butonuna bastığında veya sekme açıldığında o bileşenin paketi dinamik olarak talep edilir.

## React.lazy ve Suspense anatomisi

React, bileşen düzeyinde kod bölme için yerleşik iki araç sunar:

```tsx
import { lazy, Suspense } from 'react'

// Modül seviyesinde dinamik import
const HeavyPanel = lazy(() => import('./HeavyPanel'))

export function Page() {
  return (
    <Suspense fallback={<p>Yükleniyor...</p>}>
      <HeavyPanel />
    </Suspense>
  )
}
```

Bu mekanizmanın 3 kesin kuralı vardır:

1. **`React.lazy` default export bekler:** Dinamik `import('./HeavyPanel')` çağrısı yapılan dosyanın varsayılan export'a (`export default`) sahip olması gerekir.
2. **`Suspense` sınırı zorunludur:** `lazy` ile yüklenen bileşen indirilene kadar bir Promise fırlatır (suspend eder). Eğer bu bileşeni bir `<Suspense fallback={...}>` içine sarmazsan, React ne göstereceğini bilemez ve tüm uygulama beyaz ekran vererek çöker.
3. **`lazy` tanımı modül seviyesinde olmalıdır:** `lazy` fonksiyonu **asla** bir bileşenin gövdesinde çağrılmaz! Dosyanın en üst seviyesinde bir kez tanımlanmalıdır.

## Bir sayfa ziyaretinde adım adım iz sürelim

Bir kullanıcının ana sayfaya girip ardından detay sayfasına tıkladığı senaryoda tek parça paket ile bölünmüş paketi karşılaştıralım:

| Adım | Kullanıcı Hareketi | Tek Parça Paket (Bölünmemiş) | Kod Bölmeli Paket (Split) | Ağ ve Süre Kazancı |
|---|---|---|---|---|
| 1 | `site.com/` açıldı | `index.js` indirilir: **3.200 KB** | `main.js` indirilir: **140 KB** | **İlk açılış 4 kat daha hızlı!** |
| 2 | İlk boyama (FCP) | 4.2 saniye sürer | 0.8 saniyede biter | Kullanıcı hemen içeriği görür. |
| 3 | Kullanıcı detay linkine tıklar | Kod zaten bellekteydi; sayfa açılır | Tarayıcı `detail-[hash].js` dosyasını çeker: **90 KB** | Anlık bir istek atılır (~120 ms). |
| 4 | Ağdan dosya inerken | - | `Suspense fallback` ekranda görünür | Kullanıcı sistemin çalıştığını anlar. |
| 5 | Modül indi | Sayfa güncellenir | Detay bileşeni ekrana basılır | Kusursuz akış tamamlanır. |

İlk açılışta 3.2 MB yerine 140 KB indirmek, sitenin LCP (Largest Contentful Paint) metriğini doğrudan yeşil bölgeye (iyi) taşır.

## React Router 8'de Data Route Lazy Yükleme

React Router 8, data route mimarisinde kod bölmeyi mükemmel şekilde destekler. Bir route nesnesinde `lazy` fonksiyonu kullanılır:

```tsx title="src/router.tsx"
import { createBrowserRouter } from 'react-router'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    // path statik olarak ana router dosyasında kalır!
    path: '/invoices/:id',
    // Modül ancak kullanıcı bu yola gittiğinde indirilir
    lazy: () => import('./routes/invoice-detail'),
  },
])
```

Ve `./routes/invoice-detail.tsx` dosyası route bileşenini ve varsa loader'ını export eder:

```tsx title="src/routes/invoice-detail.tsx"
// React Router 8 bu export'ları tanır:
export function Component() {
  return <div>Fatura Detayı</div>
}

export async function loader({ params }: LoaderArgs) {
  return fetchInvoice(params.id)
}
```

> [!IMPORTANT]
> `path` alanı **asla** lazy modülünün içine gizlenemez! Router, kullanıcının girdiği URL ile hangi route'un eşleştiğini anında bilmek zorundadır. Bu yüzden `path: '/invoices/:id'` statik kalır; indirilecek kod ise `lazy` içine konur.

## Kod örneği: Fatura detayında ağır analitik grafiği

Şimdi bir fatura detay sayfasında, her kullanıcının açmadığı devasa bir analitik grafik panelini bileşen düzeyinde nasıl böleceğimizi kodlayalım.

### Kırık yaklaşım: lazy tanımını bileşen gövdesinde yapmak

Geliştiricilerin düştüğü en yaygın ve tehlikeli tuzak:

```tsx
// YANLIŞ: Her render'da yeni bir bileşen tipi üretir!
export function BrokenInvoiceView() {
  // HATA! Her render'da lazy() baştan çağrılır!
  const LazyChart = lazy(() => import('./AnalyticsChart'))

  return (
    <div>
      <h2>Fatura #1042</h2>
      <Suspense fallback={<p>Yükleniyor...</p>}>
        <LazyChart />
      </Suspense>
    </div>
  )
}
```

Bu bileşende herhangi bir state değiştiğinde `BrokenInvoiceView` render edilir. Her render'da `lazy()` yeni bir bileşen referansı üretir; React eski bileşeni unmount edip yenisini mount eder. Sonuç: Grafik sürekli yanıp söner, içindeki tüm yerel state kaybolur ve sonsuz bir yükleniyor titremesi başlar!

### Doğru yaklaşım: Modül seviyesinde lazy ve Suspense

```tsx title="CleanInvoiceView.tsx"
import { lazy, Suspense, useState } from 'react'

export interface InvoiceData {
  id: string
  client: string
  total: number
}

// DOĞRU: lazy tanımı bileşenin DIŞINDA, dosyanın en üstündedir!
const LazyAnalyticsChart = lazy(() => import('./MockAnalyticsChart'))

export function CleanInvoiceView({ invoice }: { invoice: InvoiceData }) {
  const [showAnalytics, setShowAnalytics] = useState(false)

  return (
    <article>
      <header>
        <h2>Fatura: {invoice.id}</h2>
        <p>Müşteri: {invoice.client}</p>
        <strong>Tutar: {invoice.total} ₺</strong>
      </header>

      <section>
        <button onClick={() => setShowAnalytics((prev) => !prev)}>
          {showAnalytics ? 'Grafiği Gizle' : 'Gelişmiş Analitiği Göster'}
        </button>

        {showAnalytics && (
          // Suspense sınırı yükleme sırasında kullanıcıya dürüst bir gösterge verir
          <Suspense fallback={<p className="loading-state">Grafik modülü yükleniyor...</p>}>
            <LazyAnalyticsChart invoiceId={invoice.id} />
          </Suspense>
        )}
      </section>
    </article>
  )
}
```

Bu doğru kurguda:
1. `LazyAnalyticsChart` modül ilk yüklendiğinde bir kez tanımlanır.
2. Kullanıcı "Gelişmiş Analitiği Göster" butonuna basana kadar grafik kütüphanesinin tek bir satırı dahi indirilmez.
3. Butona basıldığı anda tarayıcı arka plandan dosyayı çeker, bu sırada ekranda `"Grafik modülü yükleniyor..."` görünür.
4. Dosya indiğinde grafik kusursuzca ekrana boyanır.

## Sınır durumları ve sık yapılan hatalar

:::mistake[1. Her küçük butonu ve kartı lazy yapmak]
- **Belirti:** Sayfa açılırken ekranda yüzlerce küçük yükleniyor spinner'ı beliriyor, sayfa yamalı bir bohça gibi parça parça açılıyor.
- **Neden:** Her `lazy` modülü ayrı bir HTTP isteğidir. 10 satırlık basit bir butonu lazy yapmak, tasarruf ettiğin 200 bayttan çok daha fazla ağ gecikmesi (network round-trip) üretir.
- **Düzeltme:** Yalnızca sayfa düzeyindeki route'ları (route-based) veya ağır harici kütüphane içeren büyük alt panelleri (charts, rich text editors, 3D viewers) böl.
:::

:::mistake[2. Suspense sınırını unutup uygulamayı patlatmak]
- **Belirti:** `lazy` ile böldüğün sayfayı açtığında konsolda `A component suspended while rendering, but no fallback UI was specified` hatası çıkar ve tüm sayfa çöker.
- **Neden:** `lazy` bileşeni indirilene kadar bir Promise fırlatır. En yakın ebeveynde bir `<Suspense fallback={...}>` yoksa React ne göstereceğini bilemez.
- **Düzeltme:** `lazy` bileşenini mutlaka anlamlı bir fallback (spinner, iskelet ekran) taşıyan `Suspense` ile sarmala.
:::

:::mistake[3. Route eşleşme yolunu lazy modülün içine yazmak]
- **Belirti:** React Router URL'ye gidildiğinde 404 verir ya da route'u bulamaz.
- **Neden:** Router URL'ye baktığında hangi dosyayı indireceğini bilmek için `path` bilgisine önceden ihtiyaç duyar.
- **Düzeltme:** `path` daima statik konfigürasyonda kalmalıdır: `{ path: '/detay', lazy: () => import(...) }`.
:::

:::sector[Sektörde nasıl kullanılır?]
Kurumsal projelerde bundle yönetimi için şu standartlar uygulanır:

1. **Bundle Bütçeleri (Bundle Budgets):** CI/CD boru hattına kurallar konur. Örneğin: "İlk giriş paketi (`main.js`) gzip sonrası 150 KB'ı geçerse build başarısız sayılsın!".
2. **Rollup Visualizer:** `pnpm build` çalıştırıldığında projedeki hangi kütüphanenin ne kadar yer kapladığını gösteren interaktif haritalar (treemap) üretilir. Böylece istemeden pakete giren devasa paketler hemen tespit edilip lazy yüklemeye alınır.
:::

## Özet

- Kod bölme, uygulamanın devasa JavaScript paketini ihtiyaç anında indirilen parçalara ayırarak ilk yükleme süresini (FCP/LCP) dramatik şekilde düşürür.
- En yüksek kazanç Route düzeyinde kod bölmeyle (React Router `lazy`) elde edilir.
- Bileşen düzeyinde kod bölme için `React.lazy(() => import('./Component'))` ve `<Suspense fallback={...}>` ikilisi kullanılır.
- `lazy()` tanımı asla bileşen gövdesinde yapılmaz; modül seviyesinde olmalıdır.
- Her şeyi bölmek gereksiz ağ trafiği yaratır; yalnızca büyük rotalar ve ağır bileşenler bölünmelidir.

### Kendini yokla

1. **Soru:** Bir bileşeni `const Panel = lazy(() => import('./Panel'))` şeklinde böldün; ancak `<Suspense>` kullanmadın. Sayfayı açtığında ne olur?
   - **Cevap:** React çalışma anında bir hata fırlatır (`A component suspended while rendering...`) ve en yakın Error Boundary yoksa tüm sayfa beyaz ekrana düşerek çöker.

2. **Soru:** React Router 8'de `lazy` kullanılırken neden `path` bilgisi lazy modülün içine konamaz?
   - **Cevap:** Çünkü tarayıcı adresi değiştiğinde Router'ın hangi modülü indireceğine karar verebilmesi için URL eşleşmesini (`path`) henüz o modülü indirmeden önce bilmesi şarttır.
