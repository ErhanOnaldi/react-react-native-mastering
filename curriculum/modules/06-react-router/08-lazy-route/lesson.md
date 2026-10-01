---
title: "İhtiyaç anında rota yükleme"
minutes: 12
kind: concept
---

# İhtiyaç anında rota yükleme

Sinema açıldığında çoğu kişi önce ana ekrana bakıyor; bazı kişiler ancak daha sonra listelerini ya da istatistiklerini açıyor. Şu an her route bileşenini baştan normal `import` edersek başlangıçta hepsinin koduna ihtiyaç duyabiliriz. **Lazy route**, route açılana kadar onun bileşen kodunu bekleten React Router özelliğidir; kullanıcı henüz açmadığı ekranın kodunu başta indirmeyebilir.

## Başlangıçta yüklenen ekran

Bir route bileşenini dosyanın başında normal `import` etmek, o modülü uygulamanın kod bağımlılıklarına ekler:

```tsx title="src/router.tsx"
import { HighlightsPage } from './highlights-page'

const routes = [
  { path: '/', element: <h1>Sinema</h1> },
  { path: '/highlights', element: <HighlightsPage /> },
]
```

Bu yapı küçük uygulamalar için gayet uygundur ve okumak kolaydır. Ancak başlangıç ekranı için `HighlightsPage` gerekmese de onun kodu uygulamayla birlikte alınabilir. Başlangıçta indirilen kod grubuna **bundle** denir; build aracı bu kodu bir veya birkaç dosyaya yazar.

## Yalnız route seçilince yükle

Build aracına kodu ayrı bir dosyaya ayırmasını söylemeye **code splitting** denir. Ayrılan JavaScript parçasına **chunk** denir. `import()` ifadesi, modülü hemen değil çağrıldığında indiren **dynamic import**'tır.

`lazy` route'la `path` route haritasında durur, bileşen kodu ise o route gerektiğinde gelir:

```tsx title="src/router.tsx"
const routes = [
  { path: '/', element: <h1>Sinema</h1> },
  {
    path: '/highlights',
    lazy: async () => {
      const page = await import('./highlights-route')
      return { Component: page.HighlightsScreen }
    },
  },
]
```

Router `/highlights` adresine gitmeden önce route'un `path` değerini zaten bilir. O adres eşleşince `import()` başlar; indirilen modülün `HighlightsScreen` bileşeni route'un `Component` alanına bağlanır. Böylece ilk ana sayfa için bu route bileşenini indirmemiz gerekmez.

![Başlangıç ekranı kodu ile ilk route ziyaretinde indirilen ek modül](diagrams/lazy-route-yuklemesi.svg "Öne çıkanlar ekranının kodu ilk ziyarette indirilir.")

Yüklenen modül, Router'ın beklediği bileşeni dışa aktarmalıdır:

```tsx title="src/highlights-route.tsx"
export function HighlightsScreen() {
  return <main><h1>Öne çıkan filmler</h1><p>Bu haftanın seçkisi.</p></main>
}
```

Buradaki `export function` bir **named export**'tur: modül dışarıya `HighlightsScreen` adıyla bileşen sunar. `lazy` callback'inde aynı adı kullanıp `Component` alanını döndürüyoruz. Dosyada yalnız `export default` yazarsak `page.HighlightsScreen` bulunmaz; dinamik import başarılı olsa bile route'a bileşen vermemiş oluruz.

## İlk ve sonraki ziyareti izleyelim

Şimdi aynı route'a önce ana sayfadan, sonra bağlantıyla gittiğini düşün. Kodun ne zaman geldiği önemlidir: ilk adımda ana ekran açılır; ikinci adımda route'un ayrı parçası istenir; indirme bitince route bileşeni görünür.

| Sıra | Olan biten | Görünen / indirilen |
| --- | --- | --- |
| 1 | Sinema `/` adresinde açılır | Ana ekran görünür, öne çıkanlar route'u gerekmez. |
| 2 | Kullanıcı `/highlights` bağlantısını seçer | Router hazır `path` ile route'u eşleştirir. |
| 3 | `lazy` callback'i çalışır | `highlights-route` chunk'ı istenir. |
| 4 | Modül geldikten sonra `Component` hazır olur | Öne çıkan filmler sayfası görünür. |
| 5 | Kullanıcı yeniden bu route'a döner | Çalışma zamanı genellikle indirilmiş modülü tekrar kullanır. |

Demek ki `lazy` ilk açılışta gereken kodu azaltabilir, ama ilk ziyarette bekleme ekleyebilir. Her küçük ekranı ayrı chunk'a çevirmek otomatik hız kazandırmaz: ekstra indirme sayısı da vardır. Büyük veya daha seyrek kullanılan bir route daha iyi aday olabilir.

Karar verirken iki soruyu birlikte sor: Bu ekran başlangıçta ne kadar kod ekliyor, kullanıcıların ne kadarı ilk anda bu ekrana gidiyor? Örneğin büyük görsel galerisi içeren bir film koleksiyonu ayrı route ise ve kullanıcıların çoğu önce ana sayfada kalıyorsa ertelemek işe yarayabilir. Küçük bir “Hakkında” ekranıysa ayrılan kod çok az olabilir; ilk tıklamadaki ek indirme, başlangıçtaki kazançtan daha belirgin hissedilebilir.

Bu yaklaşım toplam JavaScript miktarını kendiliğinden küçültmez. Kullanıcı ayrı route'a gittiğinde onun kodu yine indirilir; fark, bu işin ilk açılışta mı yoksa o route gerektiğinde mi yapıldığıdır. Kod parçalarını gereğinden ufak bölmek de bağlantı başına istek ve bekleme ekler. O yüzden `lazy` her dosyaya eklenecek bir işaret değil, başlangıçta gereken kodu ertelemek için verilen bir karardır.

## Route haritasıyla modülün işi ayrı

Şu örnekte `/reports` adresini bileşen modülünün içine saklamadık:

```tsx
const routes = [
  { path: '/', element: <h1>Sinema</h1> },
  {
    path: '/reports',
    lazy: () => import('./reports-route'),
  },
]
```

Router, adres `/reports` olduğunda hangi route'u seçeceğini `lazy` callback'i çalışmadan önce bilmelidir. Callback'ten dönen modül route'un `Component` gibi alanlarını sağlayabilir; route'un eşleşme desenini sonradan öğrenemez. Bu nedenle `path` route ağacında kalır, geç yüklenecek ekranın gövdesi modülde durur.

Şunları da ayıralım: **lazy route JavaScript kodunu yükler; film verisini getirmez.** Bir route modülü yüklendi diye katalog isteği atılmış veya film listesi cache'lenmiş olmaz. Kod yükleme ve veri alma ayrı işlerdir.

:::mistake[Belirti → neden → düzeltme]
Route geçişinde modül yüklendiği halde beklenen ekran görünmüyor → dosyanın export adı ile callback'te okunan ad farklı ya da `Component` alanı dönmemiş → named export'u ve dönen route alanını aynı adla eşleştir.
:::

:::mistake[Belirti → neden → düzeltme]
Router route'u eşleştiremiyor → `path` yalnızca geç yüklenen dosyanın içine konmuş → URL desenini route ağacında tut, yalnız ekran kodunu lazy yükle.
:::

:::info[Derinlemesine (isteğe bağlı)]
İlk lazy geçişinde kullanıcı bekleyecekse uygulamanın genel navigasyon durumu bir yükleniyor geri bildirimi sunabilir. React'in `lazy` API'si de kodu sonradan yükler; ancak o API React bileşeni seviyesinde çalışır. Buradaki `lazy`, data mode route tanımının alanlarını yükler. Aynı ada sahip olmaları, iki API'nin aynı yerde kullanıldığı anlamına gelmez.
:::

## Özet

- Normal `import`, küçük ve her zaman gereken ekranlar için basit seçimdir.
- Code splitting route kodunu ayrı chunk'a böler; React Router `lazy` bunu route gerektiğinde alabilir.
- `path` route haritasında hazır kalır; modül `Component` gibi route alanlarını named export ile sağlayabilir.
- Lazy route ilk yükü azaltabilir ama ilk ziyarete indirme beklemesi ekler; büyük ve seyrek route'larda düşün.
- JavaScript kodu yüklemek, route verisini almak veya cache'lemek değildir.

**Yeni terimler**

- **Bundle:** Build aracının uygulama için ürettiği JavaScript kod grubu.
- **Code splitting:** Kod grubunu ihtiyaç anında yüklenebilecek ayrı parçalara ayırma.
- **Chunk:** Code splitting sonrası oluşan indirilebilir kod parçası.
- **Dynamic import:** `import()` ile modülü çağrıldığı sırada yükleme.
- **Named export:** Modülden adıyla alınabilen dışa aktarılan değer; burada route bileşenini Router'a verir.

**Kendini yokla:** Router `/reports` adresinin hangi route'a ait olduğunu neden lazy modül inmeden önce bilmelidir?

**Cevap:** Adresi eşleyip seçilecek route'u bulması gerekir; lazy modül yalnız route'un sonradan gelecek alanlarını sağlar.

**Kendini yokla:** Lazy route film listesinin sunucudan da geldiğini garanti eder mi?

**Cevap:** Hayır. Lazy route JavaScript modülünü yükler; veri isteği ayrı bir işlemdir.
