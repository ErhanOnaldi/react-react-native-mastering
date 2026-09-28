---
title: "Görseller, fontlar ve bundle boyutu"
minutes: 17
kind: concept
---

# Görseller, fontlar ve bundle boyutu

:::pain[Problem]
Kullanıcı film arama sayfasını açtığında, sayfanın en üstündeki dev vitrin afişi 3 saniye boyunca boş kalır; afiş aniden indiğinde altındaki tüm film kartları 350 piksel aşağı zıplayarak kullanıcının yanlış bir karta tıklamasına yol açar. Bu sırada başlık metni kullanılan özel web fontu inene kadar tamamen kaybolur (görünmez metin). Üstelik kullanıcı henüz sadece ana sayfadayken, arka plandaki detay, profil ve admin sayfalarının devasa 2 megabaytlık JavaScript paketi aynı anda indirilmeye çalışıldığı için tüm ağ bağlantısı kilitlenir.
:::

:::model[Web Vitals]
Önceki derste gördüğümüz üç temel metriği hatırla: en büyük içerik boyanması (**LCP ≤ 2,5 sn**), etkileşim gecikmesi (**INP ≤ 200 ms**) ve görsel yerleşim kararlılığı (**CLS ≤ 0,1**). Bir React uygulamasında gereksiz render'ları ne kadar optimize edersen et, tarayıcıya gönderdiğin görseller, web fontları ve JavaScript paketleri yanlış sırayla veya boyutsuz teslim ediliyorsa Core Web Vitals eşiklerini geçemezsin.
:::

## Varlıkların sayfa yükleme öncelik kuyruğu

Tarayıcı bir HTML belgesini aldığında yüzlerce farklı istek (CSS, fontlar, script'ler, görseller) oluşturabilir. Tarayıcının ağ motoru her isteğe bir dahili öncelik (Highest, High, Medium, Low, Lowest) atar.

Aşağıdaki tabloda tipik bir SPA açılışında varlıkların yüklenme sırasını ve doğru/yanlış kararların metrikleri nasıl etkilediğini inceleyelim:

| Zaman (ms) | İstek ve Varlık Türü | Yanlış Yaklaşım | Doğru Yaklaşım | Etkilenen Metrik |
|---|---|---|---|---|
| `0–400` | `index.html` ve kritik CSS | Devasa satır içi stiller, yavaş TTFB | Küçük HTML, HTTP cache ile sıkıştırılmış CSS | TTFB / FCP |
| `400–900` | JavaScript ana paketi | Tüm uygulamanın tek devasa 2 MB bundle'ı (`index.js`) | Route bazlı bölünmüş küçük giriş paketi (120 KB) | FCP / LCP |
| `900–1.400` | Web fontu (`.woff2`) | `font-display: block` (metin font inene kadar gizlenir) | `font-display: swap` + kritik font için `<link rel="preload">` | FCP / CLS |
| `1.400–2.000` | Ekranın en üstündeki hero görseli | Yanlışlıkla `loading="lazy"` verilmiş (tarayıcı indirmeyi erteler) | `loading="eager"` + `fetchpriority="high"` | **LCP** |
| `2.000+` | Ekran dışındaki alt görseller | Hepsini hemen indirmeye çalışmak (bant genişliğini tüketir) | `loading="lazy"` + `decoding="async"` | Ağ trafiği / INP |
| Yükleme anı | Görsel DOM'a yerleşti | `width` ve `height` yok (görsel inince sayfa 300px kayar) | Doğal `width`, `height` veya CSS `aspect-ratio` tanımlı | **CLS** |

Bu akış, varlık optimizasyonunun üç temel ayağını gösterir: görseller, fontlar ve bundle boyutu. Şimdi her birini derinlemesine inceleyelim.

## Görsel optimizasyonu: LCP ve CLS'i korumak

Web sayfalarında LCP öğesi %70'ten fazla oranda bir görseldir (`<img>` veya CSS arka plan görseli). Bir görselin hem LCP'yi hem de CLS'i koruması için üç kesin kural vardır:

### 1. LCP adayına asla lazy loading verme
Modern web geliştirmede `loading="lazy"` özniteliği harika bir araçtır; ancak **yalnızca ekranın altında kalan (below-the-fold)** görseller için!

İlk ekran açıldığında görünür alanda duran en büyük görsel (hero görseli veya ilk vitrin kartı) asla `loading="lazy"` almamalıdır. Eğer eklersen, tarayıcı bu görselin görünür alanda olduğunu hesaplayana kadar indirme isteğini bekletir. Bu da LCP sürene 1–2 saniyelik gereksiz bir gecikme ekler.

LCP görseli için doğru yaklaşım:
- `loading="eager"` (veya varsayılan davranış)
- `fetchpriority="high"` (tarayıcının ağ kuyruğunda diğer isteklerin önüne geçmesini söyler)

### 2. Ekran dışı görselleri ertele
İlk ekranın altında kalan, kullanıcının sayfayı kaydırmadan göremediği tüm görsellere `loading="lazy"` ve `decoding="async"` verilmelidir. Böylece kullanıcı sayfayı aşağı kaydırana kadar bu görseller için ağ isteği atılmaz; bant genişliği ve CPU gücü ilk açılış için korunur.

`decoding="async"` ise görsel indiğinde piksellere dönüştürme (image decoding) işleminin ana iş parçacığını kilitlemesini önler. Bu da görsel açılırken kullanıcının yapacağı tıklamaların takılmasını (INP) engeller.

### 3. Mutlaka width ve height belirt
Bir `<img>` etiketine sayısal `width` ve `height` öznitelikleri verildiğinde:
```html
<img src="/banner.webp" width="800" height="400" alt="Kampanya" />
```
Tarayıcı görselin en-boy oranını (aspect ratio: 2/1) hemen hesaplar. Görsel henüz tek bir bayt bile indirilmemişken sayfada 800×400 piksellik boş bir alan rezerve eder. Görsel indirildiğinde bu alana sessizce yerleşir; alttaki hiçbir metin veya düğme 1 piksel dahi yer değiştirmez. CLS sıfırda kalır.

## Web fontları: FOIT, FOUT ve font-display

Özel web fontları indirilirken iki tipik görsel bozulma yaşanabilir:

1. **FOIT (Flash of Invisible Text):** Tarayıcı özel font inene kadar metni ekranda tamamen şeffaf (görünmez) kılar. Kullanıcı boş kutulara bakar; LCP gecikir.
2. **FOUT (Flash of Unstyled Text):** Tarayıcı metni hemen bir sistem fontuyla (ör. Arial) gösterir; özel font indiğinde metin yeni fonta geçer.

CSS `@font-face` kuralındaki `font-display` özelliği bu davranışı belirler:

- **`font-display: swap`**: Tarayıcıya "özel font inene kadar metni derhal sistem fontuyla göster, font indiğinde takas (swap) et" der. Metin hemen okunabilir olduğu için LCP'yi ve ilk okuma deneyimini kurtarır. Ancak sistem fontu ile web fontunun harf genişlikleri çok farklıysa font takas edildiğinde satırlar kayabilir (küçük bir CLS riski).
- **`font-display: optional`**: Tarayıcıya "font ilk 100 ms içinde gelirse kullan, gelmezse bu oturumda hiç kullanma; sistem fontuyla devam et ve özel fontu arka planda bir sonraki ziyaret için önbelleğe al" der. Sıfır CLS ve sıfır LCP gecikmesi sağlar.

Kritik başlık fontlarını daha HTML ayrıştırılırken erkenden başlatmak için `index.html` içine `preload` bağlantısı konabilir:

```html
<link
  rel="preload"
  href="/fonts/inter-variable.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```
> [!IMPORTANT]
> Font preload bağlantılarında `crossorigin` özniteliği **zorunludur**. Font dosyaları aynı sunucuda olsa bile web standartlarına göre anonim CORS isteğiyle çekilir; `crossorigin` yazılmazsa tarayıcı fontu iki kez indirir!

## Bundle boyutu ve Route bazlı kod bölme

Tek sayfa uygulamalarında (SPA) tüm sayfalar, formlar, diyaloglar ve kütüphaneler varsayılan olarak tek bir `index.js` dosyasına paketlenir. Bir kullanıcı sitene sadece ana sayfadaki 3 filmi görmek için girdiğinde; henüz hiç açmadığı bilet satın alma, profil yönetimi ve admin raporlama sayfalarının megabaytlarca kodunu da indirmek zorunda kalır.

Bu sorun **Route-based Code Splitting** (Route bazlı kod bölme) ile çözülür:

```tsx title="src/App.tsx"
import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'

// Ağır sayfaları dinamik import ile tembel (lazy) yüklüyoruz
const CatalogPage = lazy(() => import('./CatalogPageMock'))
const UserProfilePage = lazy(() => import('./UserProfilePageMock'))

interface ShellProps {
  children?: ReactNode
}

function PageFallback() {
  return <div className="p-8 text-center text-sm text-gray-500">Sayfa yükleniyor...</div>
}

export function AppShell({ children }: ShellProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="p-4 border-b border-slate-800">
        <h1 className="text-xl font-bold">Film Kulübü</h1>
      </header>
      <main>
        <Suspense fallback={<PageFallback />}>
          {children ?? <CatalogPage />}
        </Suspense>
      </main>
    </div>
  )
}
```

Vite bu kodu derlediğinde:
- `AppShell` ve ortak parçalar `index-[hash].js` içine girer (ör. 90 KB).
- `CatalogPage` ayrı bir `CatalogPage-[hash].js` dosyası olur.
- `UserProfilePage` ayrı bir `UserProfilePage-[hash].js` dosyası olur.

Kullanıcı ana sayfayı açtığında sadece 90 KB indirir ve sayfa saniyeler içinde etkileşime hazır hale gelir. Kullanıcı profil sayfasına tıkladığı an tarayıcı arka planda ilgili küçük JS parçasını çeker ve `<Suspense>` içindeki geçici görünümden gerçek sayfaya geçer.

## Önce kırık, sonra doğru görsel yönetimi

Şimdi bir ürün vitrini üzerinden kırık ve optimize edilmiş görsel desenlerini karşılaştıralım:

### Kırık yaklaşım: LCP gecikmesi ve CLS patlaması
```tsx
// ✗ KIRIK: LCP görseli ertelenmiş, boyutlar verilmemiş
function BrokenHero() {
  return (
    <div className="hero-banner">
      {/* Boyut yok -> CLS patlar. lazy verilmiş -> LCP gecikir. */}
      <img
        src="/hero-cover.jpg"
        alt="Öne Çıkanlar"
        loading="lazy"
      />
    </div>
  )
}
```

### Doğru yaklaşım: Öncelikli LCP ve yer tutucu boyutlar
Şimdi bir makale ya da vitrin görseli bileşenini doğru özniteliklerle derlenebilir biçimde yazalım:

```tsx check
import type { CSSProperties } from 'react'

export interface ShowcaseImageProps {
  src: string
  alt: string
  width: number
  height: number
  isHero?: boolean
  className?: string
  style?: CSSProperties
}

export function ShowcaseImage({
  src,
  alt,
  width,
  height,
  isHero = false,
  className,
  style,
}: ShowcaseImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      // LCP adayı ise hemen indir, değilse kullanıcı yaklaşana kadar ertele
      loading={isHero ? 'eager' : 'lazy'}
      // Tarayıcının ağ önceliğini en tepeye taşı
      fetchPriority={isHero ? 'high' : undefined}
      // Görsel çözme işlemini ana iş parçacığından ayır
      decoding="async"
      className={className}
      style={{
        maxWidth: '100%',
        height: 'auto',
        aspectRatio: `${width} / ${height}`,
        ...style,
      }}
    />
  )
}
```

## Sık yapılan hatalar

:::mistake[Tüm görsellere otomatik olarak loading="lazy" basmak]
**Belirti:** Web sitesine lazy loading eklendikten sonra Lighthouse'ta LCP süresi 1,8 saniyeden 3,9 saniyeye fırlar.
**Neden:** En üstte kullanıcının ilk gördüğü vitrin görseli de lazy yapılmıştır. Tarayıcı görselin ekranda olduğunu hesaplayana kadar indirme emrini erteler.
**Düzeltme:** İlk ekrandaki (above-the-fold) 1–2 kritik görsele `loading="eager"` ve `fetchpriority="high"` ver; ekran dışındakilere `loading="lazy"` uygula.
:::

:::mistake[Görsele sadece CSS ile width: 100% verip HTML height özniteliğini atlamak]
**Belirti:** Görsel yüklendiğinde altındaki metinler aniden onlarca piksel aşağı kayar; CLS 0,25'in üzerine çıkar.
**Neden:** Tarayıcı görsel inmeden önce görselin yüksekliğini `0px` kabul eder. Görsel inince aniden yer açar.
**Düzeltme:** HTML `width` ve `height` özniteliklerini sayı olarak her zaman ver. CSS tarafında `height: auto` ve `aspect-ratio` ile responsive uyumu sağla.
:::

:::mistake[Font preload bağlantısına crossorigin eklemeyi unutmak]
**Belirti:** Tarayıcının Network sekmesinde aynı `.woff2` font dosyasının iki kez indirildiği görülür.
**Neden:** Web fontları W3C kuralı gereği kimliksiz CORS (anonymous CORS) ile istenir. Preload etiketinde `crossorigin` yoksa tarayıcı ilk indirilen fontu CORS isteğinde kullanamaz ve ikinci kez indirir.
**Düzeltme:** `<link rel="preload" as="font" type="font/woff2" crossorigin href="...">` şeklinde `crossorigin` özniteliğini mutlaka ekle.
:::

:::sector[Sektörde nasıl uygulanır?]
Üretim ortamlarında profesyonel ekipler görselleri doğrudan ham JPEG/PNG olarak barındırmazlar. Cloudinary, Imgix veya Next.js Image Optimization gibi CDN servisleri kullanarak kullanıcının ekran genişliğine göre dinamik boyutlandırma ve modern format (AVIF/WebP) dönüşümü sağlarlar.

Paket analizi için `rollup-plugin-visualizer` benzeri araçlarla her build sonrası bir "bundle treemap" haritası çıkarılır. Projeye gereksiz büyük bir kütüphane (örneğin tüm `lodash` veya kullanılmayan bir ikon seti) girdiğinde CI hattı uyarı verir. Genel sektör hedefi: ilk açılışta indirilen sıkıştırılmış (gzipped) JavaScript boyutunu 150 KB'ın altında tutmaktır.
:::

## Özet

- İlk ekrandaki (above-the-fold) ana görsel **LCP adayıdır**: asla `loading="lazy"` verilmemeli, `fetchpriority="high"` ile erkenden indirilmelidir.
- Ekran dışındaki görsellere `loading="lazy"` ve `decoding="async"` verilerek gereksiz veri transferi ve ana iş parçacığı kilitlenmeleri önlenir.
- Görsellere doğal `width` ve `height` (veya `aspect-ratio`) tanımlamak, yer tutucu boşluk ayırarak **CLS kaymasını tamamen önler**.
- `font-display: swap` metnin gizlenmesini (FOIT) engeller; kritik fontlar `<link rel="preload" crossorigin>` ile erkenden çağrılabilir.
- Büyük SPA uygulamalarında route bazlı kod bölme (`React.lazy` + `Suspense`), ilk açılışta indirilen JavaScript paketini küçülterek LCP süresini korur.

---

### Kendini yokla

1. **Soru:** Bir film detay sayfasında afiş görseli için hem `loading="lazy"` hem de `fetchpriority="high"` yazılmıştır. Bu yapılandırmadaki temel çelişki nedir?
   *Cevap:* `loading="lazy"` tarayıcıya "bu görseli kullanıcı yaklaşana kadar indirmeyi ertele" derken, `fetchpriority="high"` "bu görseli ağ kuyruğunda en öne al" der. İki zıt sinyal tarayıcının indirme sırasını bozar; LCP adayı bir görsel asla lazy yüklenmemelidir.

2. **Soru:** Bir web sayfasında kullanılan özel font için `font-display: optional` seçildiğinde kullanıcı deneyiminde ne değişir?
   *Cevap:* Tarayıcı font dosyasını ilk 100 ms içinde indiremezse o sayfa ziyareti boyunca sistem fontunu kullanır; font inse bile sayfayı sonradan değiştirmeye çalışmaz. Böylece hiçbir metin kayması (CLS) veya bekleme (FOIT) yaşanmaz; özel font sonraki ziyaret için arka planda önbelleğe alınır.
