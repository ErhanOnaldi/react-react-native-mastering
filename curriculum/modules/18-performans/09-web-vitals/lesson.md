---
title: "Web Vitals: LCP, INP ve CLS"
minutes: 16
kind: concept
---

# Web Vitals: LCP, INP ve CLS

:::pain[Problem]
Kendi güçlü geliştirici bilgisayarında `pnpm dev` ile sayfayı açtığında her şey anında yükleniyor gibi görünür. Ancak uygulama canlıya alınıp gerçek bir kullanıcının ucuz telefonunda ve dalgalı 4G mobil bağlantısında açıldığında: en üstteki ana afiş 3 saniye sonra belirir, afiş geldikten sonra altındaki kartlar aşağı zıplayarak kullanıcının yanlış yere tıklamasına sebep olur ve filtre butonuna dokunulduğunda ekran 400 milisaniye boyunca kilitlenip hiçbir tepki vermez.
:::

## Üç temel metrik ve sayfa zaman çizelgesi

Kullanıcılar bir web sayfasını açtıklarında tek bir hız metriği yaşamazlar. Sayfanın ne zaman kullanılabilir hale geldiği, tıklamalara ne kadar çabuk tepki verdiği ve sayfa yüklenirken öğelerin yerinde sabit durup durmadığı birbirinden tamamen farklı deneyimlerdir. Google'ın tanımladığı **Core Web Vitals** (Temel Web Göstergeleri), bu üç deneyim boyutunu nesnel ve sayısallaştırılabilir eşiklerle ölçer.

Aşağıdaki diyagramda bir kullanıcının sayfaya girişinden ayrılışına kadar geçen süreçte bu üç metriğin nerede devreye girdiğini inceleyelim:

![Web Vitals: sayfa ömründe LCP, INP ve CLS](diagram:web-vitals)

Zihinsel modelini şu kesin kurallarla kur:

1. **LCP (Largest Contentful Paint) — Yükleme Hızı:** Kullanıcının sayfaya gitme komutunu (navigation) vermesinden itibaren, ekranın görünür alanındaki (viewport) en büyük görsel veya metin bloğunun tamamen çizildiği ana kadar geçen süredir.
   - **≤ 2,5 saniye:** İyi (Good)
   - **2,5 – 4,0 saniye:** Geliştirilmeli (Needs Improvement)
   - **> 4,0 saniye:** Zayıf (Poor)

2. **INP (Interaction to Next Paint) — Etkileşim Tepkisi:** Kullanıcının sayfa ömrü boyunca yaptığı tüm tıklama, dokunma ve klavye etkileşimlerinin işlenip bir sonraki ekran karesine (next frame) yansıtılmasına kadar geçen sürenin en kötüye yakın değeridir (98. yüzdelik). Mart 2024'te eski FID (First Input Delay) metriğinin yerini almıştır; çünkü FID yalnızca ilk tıklamanın beklemesini ölçerken INP tüm sayfa oturumunu inceler.
   - **≤ 200 milisaniye:** İyi (Good)
   - **200 – 500 milisaniye:** Geliştirilmeli (Needs Improvement)
   - **> 500 milisaniye:** Zayıf (Poor)

3. **CLS (Cumulative Layout Shift) — Görsel Kararlılık:** Sayfa açılırken ve kullanılırken, kullanıcı bir işlem yapmadığı halde içeriğin aniden kaymasından kaynaklanan toplam kararsızlık puanıdır. Piksel sayısı değil; kayan öğenin etkilediği alan ve kayma mesafesinin çarpımıyla hesaplanan birimsiz bir puandır.
   - **≤ 0,1:** İyi (Good)
   - **0,1 – 0,25:** Geliştirilmeli (Needs Improvement)
   - **> 0,25:** Zayıf (Poor)

## Bir sayfa ziyaretinde adım adım iz sürelim

Bir kullanıcının film keşif sayfasına girişinden filtre uygulamasına kadar geçen 4 saniyelik sürede tarayıcının ve metriklerin nasıl davrandığını izleyelim:

| Zaman (ms) | Tarayıcı ve Sayfa Olayı | Etkilenen Metrik | Durum ve Değer |
|---|---|---|---|
| `0` | Kullanıcı bağlantıya tıklar (navigation start). | - | İstek sunucuya gönderildi. |
| `350` | İlk HTML baytları indi (TTFB). | TTFB | 350 ms |
| `800` | İlk metinler belirdi (FCP - First Contentful Paint). | FCP | 800 ms |
| `1.600` | Sayfanın ana başlığı ve vitrin görseli çizildi. | **LCP** | Görünürdeki en büyük içerik boyandı: **1,6 sn (İyi)** |
| `2.100` | Boyutları belirtilmemiş bir reklam bandı aniden DOM'a girdi; vitrin görseli 150px aşağı kaydı (`hadRecentInput: false`). | **CLS** | Beklenmeyen kayma puanı: **+0,08 (Toplam CLS: 0,08 - İyi)** |
| `3.200` | Kullanıcı "Bilim Kurgu" filtre butonuna tıkladı. | - | Girdi anı kaydedildi. |
| `3.280` | React state güncellendi, filtreli liste render edildi ve tarayıcı yeni kareyi ekrana boyadı. Gecikme: 80 ms. | **INP** | Etkileşimden sonraki kareye süre: **80 ms (İyi)** |
| `3.320` | Filtre sonucunda akordeon açıldı ve alt kartlar aşağı itildi (`hadRecentInput: true`). | **CLS** | Tıklamadan sonraki 500 ms içinde olduğu için **CLS'e eklenmedi**. Toplam CLS: 0,08. |

Bu zaman çizelgesinde kritik bir kuralı gördün: kullanıcının kasıtlı tıklamasından hemen sonra (500 ms içinde) oluşan yerleşim değişiklikleri `hadRecentInput: true` bayrağı alır ve CLS puanını bozmaz. Ancak 2.100 ms anında reklam bandının plansızca içeri girmesi kullanıcı girdisi olmadan gerçekleştiği için CLS puanına doğrudan yansımıştır.

## Saha verisi (Field) ile laboratuvar verisi (Lab) farkı

Performans dünyasında geliştiricilerin en sık düştüğü tuzak, yerel Lighthouse testinde 95 puan görünce işin bittiğini varsaymaktır. Ancak performans iki ayrı ortamda iki ayrı dille konuşur:

| Özellik | Laboratuvar Verisi (Lab Data) | Saha Verisi (Field Data / RUM) |
|---|---|---|
| **Araçlar** | Chrome DevTools, Lighthouse, CI botları | CrUX (Chrome User Experience Report), `web-vitals` kütüphanesi, RUM araçları |
| **Koşullar** | Belirlenmiş sabit bir CPU (ör. 4x yavaşlatma) ve sabit ağ profili. | Milyonlarca farklı mobil işlemci, zayıf Wi-Fi, metro tünelleri, arka plan sekmeleri. |
| **Kullanıcı etkileşimi** | Genellikle yoktur. Sayfa açılır, test biter. | Gerçek kullanıcılar gezinir, yazar, filtreler, sepeti günceller. |
| **INP ölçümü** | Ölçülemez; yerine sentetik TBT (Total Blocking Time) kullanılır. | Gerçek sayfa ömründeki tüm tıklamalardan doğrudan hesaplanır. |
| **Karar kuralı** | Tekil çalıştırma puanı (0–100). | Ziyaretlerin **75. yüzdeliği (p75)** iyi sınırında olmalıdır. |

Google bir sitenin Core Web Vitals eşiklerini geçtiğini söylerken yalnızca **saha verisinin 75. yüzdeliğine** bakar. Yani sitene gelen her 100 kullanıcıdan en az 75'i LCP'yi 2,5 saniye ve altında, INP'yi 200 milisaniye ve altında, CLS'i 0,1 ve altında yaşamalıdır.

## PerformanceObserver ile tarayıcıda ölçüm

Tarayıcının `PerformanceObserver` API'si, arka planda meydana gelen performans girdilerini asenkron olarak dinlemeni sağlar.

Şimdi bir içerik platformunda büyük bir makale görselinin LCP anını nasıl yakalayacağımızı kodlayalım:

```ts check
// Tarayıcının performans gözlemcisini kuralım
export function observeLargestPaint(onReport: (metric: { name: string; value: number }) => void): () => void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return () => {}
  }

  let lcpValue = 0

  const observer = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries()
    const lastEntry = entries[entries.length - 1]

    if (lastEntry) {
      // startTime, sayfa açılışından itibaren geçen milisaniyedir
      lcpValue = lastEntry.startTime
    }
  })

  try {
    // buffered: true kritik öneme sahiptir!
    observer.observe({ type: 'largest-contentful-paint', buffered: true })
  } catch {
    // Eski tarayıcılarda desteklenmiyorsa sessizce geç
    return () => {}
  }

  // Sayfa gizlendiğinde veya kapatıldığında en son ölçülen LCP değerini raporlayalım
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden' && lcpValue > 0) {
      onReport({ name: 'LCP', value: lcpValue })
      observer.disconnect()
    }
  }

  window.addEventListener('visibilitychange', handleVisibilityChange, { once: true })

  return () => {
    window.removeEventListener('visibilitychange', handleVisibilityChange)
    observer.disconnect()
  }
}
```

Bu örnekte `buffered: true` parametresine dikkat et: JavaScript dosyan indirilip `observer.observe` çağrılana kadar tarayıcı HTML içindeki ilk büyük başlığı çoktan çizmiş olabilir. `buffered: true` demezsen, observer bağlanmadan önce gerçekleşen LCP olayını tamamen kaçırırsın.

## DevTools Performance paneli ve INP incelemesi

Lighthouse laboratuvarda hızlıca genel fikir verir; ancak etkileşim gecikmesini (INP) teşhis etmek için Chrome DevTools'un **Performance** sekmesi kullanılır.

INP sorununu ortaya çıkarmak için şu adımları izle:

1. DevTools'ta **Performance** sekmesini aç.
2. Sağ üstteki dişli simgesine tıkla: **CPU: 4x slowdown** ve **Network: Fast 4G** seç. Bu ayar, geliştirici makinendeki lüks işlemci gücünü ortalama bir kullanıcının telefon seviyesine indirir.
3. Kayıt düğmesine (Record) bas.
4. Sayfadaki arama inputuna hızlıca bir kelime yaz veya filtre butonuna tıkla.
5. Kaydı durdur.

Analiz ekranında **Main** kanalına bak:
- Süresi **50 ms'yi aşan** görevler kırmızı/gri çizgili bayrakla "Long Task" olarak işaretlenir.
- Bir tıklama olayı Long Task sırasında gerçekleşirse, JavaScript motoru o görevi bitirene kadar tıklama callback'ini çalıştıramaz.
- Callback çalışsa bile, ardından gelen ağır React render'ı ve DOM güncellemesi tamamlanmadan tarayıcı bir sonraki kareyi (paint) ekrana çizemez. İşte bu toplam bekleme süresi INP puanını patlatır.
- Çözüm: Modül 18'in önceki derslerinde öğrendiğin `useTransition` ve `useDeferredValue` araçlarıyla ağır güncellemeyi düşük önceliğe almak veya görevi küçük parçalara bölmektir.

## Sık yapılan hatalar

:::mistake[Lighthouse'ta 100 puan aldım, demek ki INP sorunum olamaz]
**Belirti:** Lighthouse performans skoru 98 çıkmasına rağmen Search Console'da INP uyarısı alınır.
**Neden:** Lighthouse sentetik bir testtir; sayfayı açıp kapatır, gerçek bir insan gibi form doldurmaz, karmaşık bir filtre kombinasyonuna basmaz.
**Düzeltme:** INP sorunlarını teşhis etmek için gerçek kullanıcı verisini (`web-vitals` kütüphanesi) izle ve DevTools Performance panelinde 4x CPU yavaşlatma ile manuel tıklama kayıtları al.
:::

:::mistake[Kullanıcının her buton tıklaması CLS skorunu yükseltir]
**Belirti:** Sayfaya yeni bir açılır panel (dropdown) eklendiğinde CLS'in bozulacağından korkulur.
**Neden:** CLS'in formülünde `hadRecentInput` filtresi vardır. Kullanıcının tıklamasından veya tuş basışından sonraki 500 milisaniye içinde meydana gelen yerleşim hareketleri beklenmedik sayılmaz ve CLS'e katılmaz.
**Düzeltme:** Kullanıcı eylemiyle doğrudan tetiklenen animasyon ve yerleşim değişikliklerinden çekinme; ancak kullanıcının haberi olmadan asenkron gelen görsellerin veya verilerin sonradan DOM'u itmesini engelle.
:::

:::mistake[PerformanceObserver'ı buffered bayrağı olmadan başlatmak]
**Belirti:** Kod canlıya çıktığında LCP değeri çoğu zaman `0` veya tanımsız olarak analitik servisine gider.
**Neden:** React bileşeni render edilip `useEffect` içinde observer'ı kaydettiğinde, sayfanın ana görseli milisaniyeler önce çoktan boyanmış olabilir.
**Düzeltme:** Observer'ı başlatırken her zaman `{ type: 'largest-contentful-paint', buffered: true }` seçeneğini ver.
:::

:::sector[Sektörde nasıl uygulanır?]
Gerçek projelerde geliştiriciler `PerformanceObserver` API'sini sıfırdan elle yazmak yerine Google Chrome ekibinin açık kaynaklı **`web-vitals`** paketini (`onLCP`, `onINP`, `onCLS`) kullanırlar. Toplanan metrikler Datadog RUM, Sentry Performance veya Google Analytics uç noktalarına `navigator.sendBeacon` ile fırlatılır.

Kurumsal ekipler CI/CD hattına ve canlı izlemeye iki katı kural koyar:
1. **Lighthouse CI (Lab):** Her Pull Request'te LCP > 2,8s veya TBT > 250ms ise build başarısız sayılır (regresyon önleme).
2. **Saha SLO (Field):** Canlı kullanıcıların 75. yüzdeliğinde (p75) LCP ≤ 2,5 sn, INP ≤ 200 ms ve CLS ≤ 0,1 kalmalıdır. Aksi halde performans hatası (P1 bug) açılır.
:::

## Özet

- Core Web Vitals kullanıcı deneyimini üç eksende ölçer: yükleme (**LCP ≤ 2,5 sn**), etkileşim gecikmesi (**INP ≤ 200 ms**) ve görsel kararlılık (**CLS ≤ 0,1**).
- FID (First Input Delay) emekliye ayrılmıştır; güncel etkileşim standardı sayfa boyunca tüm tıklamaları kapsayan **INP**'dir.
- Laboratuvar ölçümü (Lighthouse) kontrollü hata ayıklama aracıdır; Google'ın değerlendirdiği resmi başarı kriteri ise gerçek kullanıcı verisinin **75. yüzdeliğidir (p75)**.
- `PerformanceObserver` ile tarayıcı içi ölçüm yaparken eski olayları kaçırmamak için `{ buffered: true }` zorunludur.
- Kullanıcı etkileşimini takip eden 500 ms içindeki kaymalar `hadRecentInput: true` taşır ve CLS skoruna dahil edilmez.

---

### Kendini yokla

1. **Soru:** Bir e-ticaret sitesinde arama kutusuna bir harf yazıldığında ekran 350 milisaniye boyunca donuyor. Bu darboğaz hangi Web Vitals metriğini doğrudan olumsuz etkiler?
   *Cevap:* **INP (Interaction to Next Paint)**. Tuş vuruşundan sonraki boyamaya kadar geçen süre 200 ms eşiğini aştığı için INP zayıflar.

2. **Soru:** Sayfa açıldıktan 3 saniye sonra `width` ve `height` değeri olmayan bir kampanya görseli yüklendiğinde altındaki ürün listesi 200 piksel aşağı kayıyor. Bu kayma neden CLS puanına eklenir?
   *Cevap:* Kullanıcı herhangi bir tıklama veya tuş girdisinde bulunmadığı için olay `hadRecentInput: false` olarak işaretlenir; bu da beklenmeyen bir yerleşim kayması sayılarak CLS'e doğrudan eklenir.
