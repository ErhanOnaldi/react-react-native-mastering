---
title: "Görseller, fontlar ve bundle boyutu"
minutes: 15
kind: concept
---

# Görseller, fontlar ve bundle boyutu

Bir film kartında `img` kullanmayı zaten biliyorsun. Görsel ağdan gelene kadar tarayıcı kartın yüksekliğini bilmiyorsa, afiş açıldığında altındaki kartlar aşağı kayabilir. Önce tarayıcıya afişin kaplayacağı alanı söyleyelim.

## Afiş gelmeden yerini ayır

Sinema kataloğunda afişlerin oranı aynıysa, her görselin doğal genişlik ve yüksekliğini HTML'e yazabilirsin:

```tsx
function CatalogCover() {
  return (
    <img
      src="/posters/son-bakis.jpg"
      alt="Son Bakış afişi"
      width={300}
      height={450}
    />
  )
}
```

Bu değerler görselin ekranda mutlaka 300 × 450 piksel olacağını söylemez. Tarayıcıya oranı (burada 2:3) önceden bildirir; CSS görseli daha dar gösterebilir, oranı koruyarak yüksekliğini de hesaplar. Böylece indirme sürerken bile sayfada afiş için yer ayrılır.

Şimdi aynı kartı dar ekranda da kullanalım. `width` ve `height` değerleri oranı bildirirken CSS genişliği ekrana uydurur:

```tsx
function ResponsiveCatalogCover() {
  return (
    <img
      src="/posters/son-bakis.jpg"
      alt="Son Bakış afişi"
      width={300}
      height={450}
      style={{ width: '100%', height: 'auto' }}
    />
  )
}
```

Genişlik kartı doldurur, `height: auto` oranı korur. HTML boyutları ile CSS burada farklı iş yapar: ilki indirme öncesi alanın oranını bildirir, ikincisi mevcut ekrana göre çizim boyutunu ayarlar.

## Hangi görsel önce gelsin?

Bir film detay sayfasında afiş sayfanın aşağısında kalıyorsa, kullanıcı oraya kaydırana kadar indirmeyi erteleyebilirsin. `loading="lazy"`, tarayıcıya bu görseli hemen istemek zorunda olmadığını söyler:

```tsx
function RelatedMovieCover() {
  return (
    <img
      src="/posters/gece-yolu.jpg"
      alt="Gece Yolu afişi"
      width={300}
      height={450}
      loading="lazy"
    />
  )
}
```

Bu görsel ilk ekranda görünmüyorsa ertelemek, henüz görülmeyen içerik için ağ kullanmaktan kaçınır. Boyutları yine yazdık; yüklemeyi ertelemek, görsel geldiğinde kartın yer değiştirmesini önlemez.

Tersini düşün: Sinema ana sayfasındaki büyük vitrin görseli açılır açılmaz görünür ve sayfanın en büyük içeriği olabilir. **LCP** (Largest Contentful Paint), ana içeriğin ekranda görünmesine kadar geçen süreyi ölçer. Bu görseli ertelemek LCP'yi uzatabilir; onu erkenden istemek için `fetchPriority="high"` verebilirsin:

```tsx
function FeaturedFilmCover() {
  return (
    <img
      src="/posters/kuzey.jpg"
      alt="Kuzey afişi"
      width={900}
      height={600}
      loading="eager"
      fetchPriority="high"
      decoding="async"
    />
  )
}
```

`loading="eager"` ertelememeyi, `fetchPriority="high"` ise ağdaki diğer isteklerle kıyaslandığında bu görsele yüksek öncelik vermeyi tarayıcıya bildirir. `decoding="async"`, görseli piksellere çevirme işinin çizimi gereksiz yere bekletmemesini ister; bu da her durumda ana iş parçacığından ayrı çalışacağı garantisi değildir. Bu ipuçları LCP'yi garanti etmez; ağ hızı ve sayfanın geri kalanı da süreyi etkiler.

Üç örneği bir sayfa açılışında sıraya koyalım:

| An | Görsel | Tarayıcıya verdiğimiz ipucu | Beklenen davranış |
|---|---|---|---|
| Sayfa açılır | Vitrin afişi | Boyutlar, `eager`, yüksek `fetchPriority` | Görünür ana görsel erken istenir ve yeri baştan ayrılır. |
| Sayfa açılır | İlk ekranda görünen film kartları | Boyutlar | Kartların yüksekliği oranından hesaplanabilir. |
| Kullanıcı aşağı kaydırır | Alt sıradaki afişler | Boyutlar, `loading="lazy"` | Tarayıcı bunları görünür alana yaklaşınca isteyebilir. |

Gerçek bir hata, sayfadaki bütün görsellere aynı `loading="lazy"` değerini kopyalamaktır. **Belirti:** üstteki büyük afiş geç görünür, LCP kötüleşebilir. **Neden:** kritik görsel de ertelenmiştir. **Düzeltme:** görünür alandaki önemli görseli erteleme; ekran dışında kalanları lazy yükle ve tüm görsellerin oranını önceden bildir.

## Font inerken yazı görünür kalsın

Özel web fontu, uygulamanın kendi dosyasından indirilen fonttur. İndirme sürerken tarayıcının yazıyı nasıl göstereceğini CSS'teki `font-display` seçeneği belirler. Örneğin `swap`, özel font hazır olana kadar metni sistemde bulunan bir yedek fontla hemen gösterir:

```css
@font-face {
  font-family: 'Sinema Sans';
  src: url('/fonts/sinema-sans.woff2') format('woff2');
  font-display: swap;
}
```

Metnin font yüklenene kadar saklanmasına **FOIT** (Flash of Invisible Text), önce yedek fontla görünüp sonra özel fonta geçmesine **FOUT** (Flash of Unstyled Text) denir. `swap`, yazıyı saklamaz; font geldiğinde onu değiştirir. Yedek ve özel fontun harf ölçüleri farklıysa satır sonları veya çevredeki içerik kayabilir. Bu yüzden `swap` görünmez metni önler, ama her font değişiminde sıfır yerleşim kayması vaat etmez.

Sinema başlığı özel font yüklenene kadar boş kalıyorsa `font-display: swap` ile okunur kalır; font geldiğinde görünümü özel fonta geçer. Başlıktaki satırların kayması göze çarpıyorsa kullanılan fontları ve metne ayrılan alanı birlikte incele. Her font ailesini erkenden yüklemek de iyi çözüm değildir: kullanılmayan dosyalar ilk açılışta ağ için yarışır.

## İndirilen JavaScript'i ihtiyaca göre böl

Önceki derste kod bölmeyi gördün: uygulamanın JavaScript'ini ayrı indirilebilir dosyalara ayırıp, ihtiyaç duyulmayan kodu ilk yüklemeden çıkarabilirsin. Bu derste bunu görsellerin yanındaki bir başka ilk açılış maliyeti olarak düşün. **Bundle**, build sırasında uygulamadan üretilen JavaScript dosyalarının bütünüdür. **FCP** (First Contentful Paint), sayfadaki ilk metin veya görselin görünür olduğu ana kadar geçen süredir. Kullanıcı ana sayfayı açarken hiç kullanmayacağı ağır film analiz panelinin kodu da ilk dosyadaysa, tarayıcı bu kodu indirip işler; bu gereksiz iş ilk içeriğin görünmesini geciktirebilir. Gerçek bir SPA'da aynı kod bölme fikrini route'lara uygularsın: her sayfanın bileşenini gerektiğinde `lazy(() => import(...))` ile yükleyip, bekleme anını `Suspense` ile gösterirsin.

```tsx
import { lazy, Suspense } from 'react'

const FilmAnalysisPanel = lazy(() => import('./FilmAnalysisPanel'))

function FilmPage({ showAnalysis }: { showAnalysis: boolean }) {
  return (
    <main>
      <h1>Kuzey</h1>
      {showAnalysis && (
        <Suspense fallback={<p>Analiz hazırlanıyor…</p>}>
          <FilmAnalysisPanel />
        </Suspense>
      )}
    </main>
  )
}
```

Sayfa başlığı hemen gerekli olduğu için burada kalır; analiz paneli yalnızca istendiğinde yüklenebilir. `lazy` ile `import()` daha önce gördüğün bölme desenini uygular, `Suspense` ise panel beklenirken geçici metni gösterir. Bölme her parçayı otomatik olarak daha hızlı yapmaz: küçük ve her ziyarette gereken kodu ayırırsan ek bir indirme beklemesi yaratabilirsin. Hedef, kullanıcının ilk ekranda ihtiyaç duymadığı anlamlı büyüklükteki kodu ilk yüklemeden çıkarmaktır.

## Aklında tut

- Görsellere `width` ve `height` yaz; tarayıcı görsel gelmeden önce oranına göre yer ayırsın.
- İlk ekranda gereken görseli erteleme; alt sıradaki görselleri `loading="lazy"` ile ertelemeyi düşün.
- `font-display: swap` yazıyı hemen yedek fontla gösterir; font değişimi yine küçük kaymalara yol açabilir.
- Bundle'ı bölmek ilk yüklemede gerekmeyen kodu sonrasına bırakabilir; gereksiz bölme de yeni bekleme ekler.

**Yeni terimler**

- **LCP:** Sayfadaki en büyük içeriğin görünme süresini ölçen Web Vital.
- **FCP:** Sayfada ilk metin veya görselin görünme süresi.
- **`fetchPriority`:** Bir kaynağın ağ isteğine göreli öncelik veren HTML ipucu.
- **`font-display`:** Özel font yüklenirken metnin nasıl gösterileceğini belirleyen CSS ayarı.
- **FOIT / FOUT:** Font beklerken metnin görünmemesi / yedek fonttan özel fonta geçiş.

**Kendini yokla**

1. Sayfanın altındaki afişte `loading="lazy"` kullanmak neden işe yarar? Çünkü henüz görünmeyen görselin isteğini erteleyerek ilk ekrandaki içerik için ağ kullanımını azaltabilir.
2. `font-display: swap` metni tamamen görünmez yapar mı? Hayır; özel font gelene kadar yedek fontu gösterir, sonra özel fonta geçer.

:::info[Derinlemesine (isteğe bağlı)]
Kritik font için `<link rel="preload">` kullanmak indirmeyi erken başlatabilir; bunu yalnızca ilk ekranda gerçekten gereken font için seç. Font preload'unda `crossorigin` kullanılması isteğin normal font isteğiyle eşleşmesine yardım eder. Paket boyutunu analiz etmek için build çıktısını veya bundle analyzer aracını inceleyebilirsin; hedef tek bir evrensel KB sayısı değil, ilk ekranda gereken kodu ve cihazlardaki gerçek ölçümü değerlendirmektir.
:::
