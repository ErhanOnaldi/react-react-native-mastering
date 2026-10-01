---
title: "Kodu gerektiğinde yükle"
minutes: 14
kind: concept
---

# Kodu gerektiğinde yükle

Sinema ana sayfasında film başlıkları, arama alanı ve küçük kartlar var. Film trivia paneli ise yalnızca bazı kişiler tarafından açılıyor ve grafik çizim kodu taşıyor. Ana sayfaya giren herkes bu panelin kodunu da indirmek zorunda mı? Önce iki küçük dosya ile bunun ne anlama geldiğine bakalım.

## İki dosya, iki farklı yükleme

`import` ile bağladığın bir modül, uygulamanın ilk yüklenen JavaScript paketine katılabilir. **Kod bölme (code splitting)** bu paketi ayrı indirilebilen dosyalara ayırır. Bu dosyalardan her birine **chunk** denir.

Şimdilik küçük, her zaman gereken başlık bileşenini normal import edelim:

```tsx
import { MovieTitle } from './MovieTitle'

export function MoviePage() {
  return <MovieTitle title="Aşk" />
}
```

Tarayıcı `MoviePage` kodunu istediğinde `MovieTitle` da aynı ilk yükleme yolundadır. Bu iyi bir seçimdir: başlık ekranda hemen görünür ve bileşen küçüktür. Her dosyayı ayrı indirmek de ücretsiz değildir; her istek zaman ve ağ işi getirir.

Şimdi sayfaya yalnızca kullanıcı isterse açacağı trivia panelini ekleyelim. **Dinamik import**, `import()` biçimidir; modülün yüklenmesini ihtiyaç anına erteleyebilir. React'in `lazy` fonksiyonu bu import'u bileşen olarak kullanmamızı sağlar.

```tsx
import { lazy, Suspense, useState } from 'react'

const TriviaPanel = lazy(() => import('./TriviaPanel'))

export function MoviePage() {
  const [showTrivia, setShowTrivia] = useState(false)
  return (
    <main>
      <h1>Aşk</h1>
      <button onClick={() => setShowTrivia(true)}>Trivia'yı göster</button>
      {showTrivia && (
        <Suspense fallback={<p>Trivia yükleniyor…</p>}>
          <TriviaPanel />
        </Suspense>
      )}
    </main>
  )
}
```

İlk açılışta panel henüz istenmediği için onun kodu indirilmez. Düğmeye basınca React bileşeni ister; indirme sürerken `Suspense` içindeki **fallback** yani geçici bekleme içeriği görünür. Modül tamamlanınca panel yerini alır. `lazy` tanımını component'in dışına koyduk; böylece aynı component türü her render'da korunur.

Üçüncü adımda aynı fikri daha gerçekçi bir dosya yapısında düşünelim: film detayının ana bölümü hemen gelir; yalnızca detay içindeki geniş oyuncu bilgisi isteyen kullanıcı için indirilir. Bu, paneli açılışta gizlemenin ötesinde, dosyanın ilk pakette yer almamasını da sağlar.

```tsx
const CastBiography = lazy(() => import('./CastBiography'))

function MovieDetail({ showCast }: { showCast: boolean }) {
  return (
    <article>
      <h1>Bir Zamanlar Anadolu'da</h1>
      {showCast && (
        <Suspense fallback={<p>Oyuncu bilgileri yükleniyor…</p>}>
          <CastBiography />
        </Suspense>
      )}
    </article>
  )
}
```

İlk örnekte hep gereken küçük parçayı aynı yüklemede tuttuk; ikincide isteğe bağlı paneli; üçüncüde ise gerçek bir detay sayfasındaki daha ağır ve koşullu bölümü ayırdık. Ortak karar şu: yalnızca anlamlı büyüklükte ve ilk ekranda gerekmeyen kodu sonrasına bırak.

Bu kararın etkisini iki ölçekte düşün. Kullanıcı trivia'yı hiç açmazsa hem panel kodunu hem onu kullanan grafik paketini ilk ziyaretinde indirmeyebilir. Ancak panel çok küçükse, onu sonradan istemenin ağ gecikmesi birkaç kilobayt tasarruftan daha görünür olabilir. Bu yüzden kodu satır sayısına göre değil, boyutuna ve ne sıklıkta gerektiğine göre değerlendir.

## Bir tıklamayı zaman çizelgesinde izleyelim

Kodu bölünce yeni bir bekleme noktası oluşur. Sırasını izlemek, neden fallback gerektiğini açıklar.

| An | Ne çalışır? | Kullanıcının gördüğü |
|---|---|---|
| Sayfa açılır | Başlık ve ana sayfa kodu yüklenir | Film başlığı |
| Düğmeye basılır | `showTrivia` true olur, React paneli ister | Panel henüz hazır değil |
| Dosya indirilir | Dinamik import tamamlanmayı bekler | “Trivia yükleniyor…” |
| Modül hazır olur | React paneli render eder | Trivia içeriği |

İstek başarısız olursa `Suspense` hata mesajı göstermez; o yalnızca beklemeyi gösterir. İndirme hatası için uygulamanın hata sınırına ayrıca ihtiyaç olabilir. Bu ayrım önemlidir: “henüz gelmedi” ile “yüklenemedi” aynı durum değildir.

Fallback'i de panelin kapladığı yere uygun seç. Kısa bir metin, kullanıcının beklediğini anlatır; koca boş alan ise sayfanın bozulduğu izlenimini verebilir. Bekleme içeriğinin amacı yeni bir yükleme efekti eklemek değil, indirme sürerken arayüzün ne yaptığını anlaşılır kılmaktır.

:::mistake[Her render'da yeni lazy component oluşturmak]
**Belirti:** Panel açıkken başka state değişince içerik titrer veya panelin kendi durumu sıfırlanır. **Neden:** `lazy(() => import(...))` component fonksiyonunun içinde çağrıldığında her render'da yeni bir component türü oluşur. **Düzeltme:** `lazy` tanımını dosyanın en üst seviyesinde bir kez yap.
:::

## Derlemede dosyaların ayrıldığını gör

Kodda `lazy` yazmak niyetimizi anlatır; dağıtıma gidecek dosyaları görmek için production build üretip çıktıya bakarız. Build, uygulamanın dağıtılmaya hazır dosyalarını oluşturur. Geliştirme sunucusundaki hızlı yenileme mesajı bu çıktının kanıtı değildir.

Sinema'da üç seçim yapabilirsin: ufak başlık ve düğmeleri ilk dosyada bırak; ağır trivia veya biyografi panelini ihtiyaç anında yükle; dosyaların gerçekten ayrıldığını build çıktısında ya da tarayıcının Network panelinde kontrol et. Bu nedenle “daha fazla chunk = daha hızlı” diye düşünme. Bölme ilk açılıştaki işi azaltabilir, ancak gereksiz parçalar indirme gecikmesi ve yükleme anı ekler.

Build çıktısındaki dosya adları hash içerebilir ve build aracı bazı modülleri ortak bir chunk'ta birleştirebilir. Bu beklenen bir sonuçtur; ölçmek istediğin şey panelin kodunun ilk ekranı açarken indirilip indirilmediğidir. Network panelinde sayfayı yenileyip panel dosyasının başlangıçta mı, düğmeye bastıktan sonra mı istendiğine bak. Böylece kaynak koddaki `lazy` ifadesini değil, ziyaretçinin gerçekten aldığı dosyaları doğrularsın.

Route düzeyinde de aynı fikir uygulanabilir: her URL'nin ekranı ayrı modüle taşınabilir. React Router'ın data route `lazy` ayarı, bileşen düzeyindeki React `lazy` kullanımından ayrı bir API'dir.

:::info[Derinlemesine (isteğe bağlı)]
React `lazy` ile yüklenen modülün varsayılan export'u gerekir. React Router data route'larında ise route'un eşleşmesi için `path` önceden bilinmeli, route modülünün geri kalanı `lazy` ile gelebilir. Büyük uygulamalarda bundle analyzer ile hangi kütüphanelerin çıktı dosyalarını büyüttüğünü incelemek de yararlıdır.
:::

## Özet

- Kod bölme, ilk yüklemede gerekmeyen kodu ayrı chunk'lara taşır.
- Küçük ve her ekranda gereken parçaları bölmek çoğu zaman bekleme maliyetine değmez.
- `lazy` bileşenini dosya seviyesinde tanımla; yükleme süresini `Suspense` fallback'i ile görünür kıl.
- Production build ve Network paneli, modülün ayrı yüklendiğini görmeye yardım eder.

**Yeni terimler**

- **Kod bölme:** JavaScript'i farklı zamanlarda indirilebilen parçalara ayırma.
- **Chunk:** Build'in ürettiği indirilebilir JavaScript dosyalarından biri.
- **Dinamik import:** `import()` ile modülü ihtiyaç anında isteme.
- **Fallback:** Beklenen içerik hazır olana kadar gösterilen geçici UI.

**Kendini yokla**

1. Trivia paneli açılana kadar neden indirmeyi bekletebiliriz? Çünkü çoğu ziyaretçi paneli açmıyorsa, ilk yüklemeye gereksiz kod eklememiş oluruz.
2. `Suspense` fallback'i hangi durumu bildirir? Bileşenin kodu bekleniyor; yüklemenin başarısız olduğunu tek başına bildirmez.
