---
title: "İhtiyaç anında rota yükleme"
minutes: 13
kind: concept
---

# İhtiyaç anında rota yükleme

:::pain[Problem]
Sinema ilk açıldığında kullanıcı yalnızca ana sayfaya bakıyor. Büyük istatistik panelinin JavaScript'i de başlangıç paketine girmiş; ilk ekran görünmeden önce gereksiz kod indiriliyor. Seyrek kullanılan route'u gerçekten gerekince yüklemek istiyorsun.
:::

## Route sınırı kodu bölmeye yarayabilir

Uygulama modülleri normal `import` ile birbirine bağlandığında build aracı bu bağımlılıkları başlangıçta indirilen JavaScript'e koyabilir. Code splitting, bazı modülleri ayrı parçalara ayırır. Lazy route bu parçayı route gerektiğinde yükletir: kullanıcı Favoriler ekranına gitmiyorsa o ekranın kodunu başlangıçta indirmeyebilir.

![Başlangıç ekranı kodu ile ilk route ziyaretinde indirilen ek modül](diagrams/lazy-route-yuklemesi.svg)

1. **Router eşleşme için gerekli bilgiyi önceden bilmelidir.** `path`, `index` ve `children` route ağacında kalır; router hangi URL'nin o route'a gittiğini modül yüklenmeden çözebilmelidir.
2. **`lazy` ek route alanlarını sonradan getirir.** Route eşleştiğinde import fonksiyonu çalışır, modül yüklenir ve export ettiği `Component`, `loader` veya başka desteklenen route özellikleri çözülür.
3. **Modül sözleşmesi route alanlarının adını kullanır.** Lazy modülde `Component` named export'u route component'ini sağlar. Sadece `default` export etmek, Router'ın bu route alanını bulduğu anlamına gelmez.
4. **İlk ziyaret ek ağ gecikmesi getirebilir.** Ayrı chunk'ın alınması için ek istek gerekir. Kullanıcı bu rotaya hızlı geçerse gecikmeyi hissedebilir; uygulama ölçümü bu maliyetin paketteki kazançtan küçük olup olmadığını göstermelidir.
5. **Her ekranı bölmek otomatik performans kazanımı değildir.** Çok küçük parçalar çok sayıda istek ve daha karmaşık yükleme deneyimi yaratabilir. Büyük veya seyrek açılan route daha iyi adaydır.

Code splitting veri önbelleği değildir. Lazy import JavaScript modülünü indirir; film listesini sunucudan çekmez veya sonuçları cache'lemez. Route modülünde loader olabilir, ama bu iki işin sahibi ve yaşam döngüsü farklıdır. Bu derste yalnızca route kodunun ne zaman yükleneceğine bakıyoruz.

## `default` export neden yetmiyor?

Dinamik import çoğu JavaScript modülünü `{ default: ... }` nesnesi olarak döndürebilir. Fakat data route `lazy` sözleşmesi, modülün içindeki route alanlarını isimleriyle çözümleyip mevcut route'a ekler. Bu nedenle bir React bileşeninin default export edilmesi tek başına Router'ın `Component` alanını vermez.

```tsx
// favorites.tsx
export default function Favorites() {
  return <h1>Favoriler</h1>
}
```

Route bunu yüklediğinde beklenen named alan yoktur. Bir de `path` değerini yalnız lazy modüle taşırsan Router henüz `/favorites` adresini hangi route'la eşleştireceğini bilemez. Eşleşme anahtarı ve yüklenecek implementasyon ayrı tutulur:

```tsx title="src/router.tsx"
const statsRouter = createBrowserRouter([
  { path: '/', element: <h1>Kitaplık</h1> },
  {
    path: '/statistics',
    lazy: async () => {
      const module = await import('./statistics-route')
      return { Component: module.StatisticsScreen }
    },
  },
])
```

```tsx title="src/statistics-route.tsx"
export function StatisticsScreen() {
  return <h1>Okuma istatistikleri</h1>
}
```

Burada `path` baştan bilinir. Router `/statistics` ile eşleşince `import('./statistics-route')` çalıştırır ve callback modülün `StatisticsScreen` export'unu route'un `Component` alanına bağlar. Gerçek projede modül bu alanı named export olarak da sunabilir; bu örnekte alias'ı router tanımında görünür tuttuk. Başka desteklenen route export'larını da aynı modülden döndürebilirsin. Route'un eşleşme ağacını geç yüklenen modülden üretmeye çalışma.

## İlk ve ikinci ziyareti izleyelim

Kullanıcı `/` adresinde uygulamayı açar. Ana bundle router tanımını, layout'u ve ana içeriği getirir. `statistics-route` henüz import edilmez. Kullanıcı İstatistikler linkine tıklayınca adres `/statistics` olur; Router route'u eşleştirir, lazy import başlar, tarayıcı ayrı chunk'ı indirir ve modül değerlendirildikten sonra `Component` render edilir.

| An | Router'ın bildiği bilgi | Kod yükleme |
| --- | --- | --- |
| İlk `/` açılışı | `/` ve `/statistics` route path'leri | Ana ekran chunk'ı yüklenir |
| İstatistikler seçildi | `/statistics` eşleşmesi | Route chunk'ı istenir |
| Import tamamlandı | `Component` route alanı hazır | İstatistik ekranı render edilir |
| Sonraki ziyaret | Aynı route ağacı | Tarayıcı/runtime modülü genellikle yeniden kullanır |

İlk ziyaretin beklemesi kullanıcı deneyiminin parçasıdır. Route'a yükleme geri bildirimi vermek gerekebilir; data router'ın pending state araçları bunun için vardır, ama küçük bir uygulamada her route için özel animasyon kurmak şart değildir. Modül büyüklüğü ve ziyaret sıklığına bakarak karar ver.

Bu yükleme, React component kimliğini rastgele değiştirmez. Modül yüklenince Router'ın `Component` olarak render ettiği bileşen kendi route konumunda görünür. Sibling route'a geçişte parent layout eşleşmede kaldığı sürece ortak layout state'i korunabilir; lazy yükleme yalnız child implementasyonunun ne zaman indirildiğini değiştirir. URL hâlâ route seçiminin kaynağıdır.

## Sınır ve maliyet hesabı

Entry modülünü route ağacında `lazy` olarak yüklemeye çalışma; router yaratılıp ilk adres eşleştirilirken gerekli tanım hazır olmalıdır. Çok sık kullanılan küçük bir ekranı ayırmak da ilk gezinmede ek ağ maliyetine değmeyebilir. Paylaşılan büyük bir kütüphane birkaç route chunk'ında tekrar paketlenebilir; build aracı ortak chunk çıkarabilir ama ölçüm gerekir.

## Hangi ekranı bölmek mantıklı?

Bir adayın başlangıç paketine ne kattığını ve ne sıklıkla açıldığını ölç. Büyük bir grafik kütüphanesi kullanan rapor route'u açılışta kullanıcıların çoğunun ziyaret etmediği bir bölüm olabilir. Ayarlar ekranı ise çok küçük ve neredeyse her oturumda ilk dakikada açılıyorsa ayırmanın getirisi az olabilir. Bundle analyzer ilk transferi, gerçek kullanıcı ölçümü de ekranın ne zaman ve ne kadar kullanıldığını anlamaya yardım eder.

Code splitting toplam kod miktarını azaltmak zorunda değildir. Aynı uygulama modülleri yine indirilebilir; yalnızca hangi zamanda ve hangi chunk'ta geldikleri değişir. Ana ekranın ilk transferi küçülür, ama route ziyaretinde yeni istek ve modül değerlendirme işi eklenir. Cihaz yavaşsa parse/execute maliyeti de önemlidir; ağ boyutu tek ölçüt değildir.

Route modülünde named `Component` export'u olması React component'inin lazy yüklendiği anlamına gelir, ama `Component` bir route nesnesinin `element` alanıyla aynı yazım değildir. Modül export'u Router'ın çözümlediği route alanıdır. Bu küçük sözleşme hatası derleme ile runtime arasında fark yaratabilir: dinamik import başarılı görünür ama beklenen route alanı tanımlı değildir. Modül adlarını ve export biçimini açık tut.

Lazy child yüklendiğinde parent layout normal route ağacında kalabilir. Kullanıcının açık menüsü veya Context içindeki favori seçimi parent/provider hala aynı React konumunda ise korunur; child route'un kendi yerel state'i ilk mount sırasında başlar. Kodun geç gelmesi, bu state ömrünü değiştiren bir reset mekanizması değildir. State'i koruma veya sıfırlama kararı hâlâ route kimliği ve component ağacına bağlıdır.

Ertelemenin kullanıcıya görünen bir maliyeti varsa bekleme deneyimini de tasarla. Kullanıcı linke bastığında adres güncellenebilir; route chunk'ı gelirken eski child, boş alan veya bekleme mesajı görünebilir. Data mode'un navigasyon durumu bu tür beklemeyi ifade etmek için kullanılabilir. Hata durumunda modül yüklenememesi için genel route hata yüzeyinin bulunması da önemlidir. Bu modülde özellikle route modülünün normal yüklenme sözleşmesine odaklanıyoruz.

Lazy route kullanımı React `lazy` ile aynı API değildir. `React.lazy` component'i Suspense ile yükler; data mode route `lazy` ise route modülünün alanlarını dinamik import ile alır. İkisi code splitting'e hizmet eder, fakat modül sözleşmeleri ve Router'la ilişkileri farklıdır. Bu modülde yalnız Router'ın route modülü mekanizmasını kullanıyoruz.

:::mistake[Belirti → neden → düzeltme]
Lazy route modülü yükleniyor ama ekran görünmüyor → dosya yalnız `default` export sunmuş veya Router'ın beklediği `Component` alanı yok → modülden `Component` named export et.
:::

:::mistake[Belirti → neden → düzeltme]
Router lazy modüle gitmeden adresi eşleyemiyor → `path` yalnız geç yüklenen modüle konmuş → path ve child eşleşme bilgilerini route ağacında tut, implementation alanlarını lazy modüle bırak.
:::

:::mistake[Belirti → neden → düzeltme]
İlk route geçişi daha yavaş hissediliyor → kullanıcıya sık gereken ekran ayrı chunk'a alınmış ve indirme ilk ziyarete kalmış → ziyaret sıklığını ve chunk boyutunu ölç; code splitting'i büyük, seyrek route'larda kullan.
:::

:::model[URL state ve route kimliği]
URL aynı route zincirini seçmeye devam eder; lazy loading yalnızca eşleşen route'un kodunun ne zaman indirileceğini değiştirir. Parent layout'ın kimliği sibling navigasyonda korunabilir, lazy child hazır olduğunda kendi bileşeni Outlet içinde görünür. Yeni bağlam, adres state'inden bağımsız bir performans kararıdır: kodu bölmek URL'yi veya veriyi cache'lemez.
:::

:::sector
Ürün ekipleri bundle analizini kullanarak büyük editör, raporlama veya yönetim ekranlarını ayrı route chunk'larına böler. Karar kullanıcı analitiği, ilk yükleme bütçesi ve navigasyonun bekleme davranışına dayanır. Code splitting küçük dosyaları çoğaltma yarışı değildir; kullanıcının başlangıçta gerçekten ihtiyaç duymadığı kodu ölçerek ertelemektir.
:::

## Özet

- Lazy route, eşleşme bilgisi hazırken route modülünün kodunu ilk ziyaret anına erteleyebilir.
- `path` route ağacında kalır; lazy modül `Component` gibi implementasyon alanlarını export eder.
- Data mode route `lazy` sözleşmesini React `lazy` ile karıştırma.
- İlk ziyaret ek indirme gecikmesi getirebilir; büyük ve seyrek route'ları ölçerek seç.
- JavaScript chunk'ını yüklemek, route verisini çekmek veya cache'lemek değildir.

**Kendini yokla:** Router `path` değerini lazy modül yüklenmeden önce neden bilmelidir?

*Cevap:* Geçerli URL'nin hangi route'a eşleştiğini modül import edilmeden çözmesi gerekir.

**Kendini yokla:** Lazy import tamamlandıktan sonra route bileşeni hangi export alanından alınır?

*Cevap:* Modülün `Component` named export'undan.
