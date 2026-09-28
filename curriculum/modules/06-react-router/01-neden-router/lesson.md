---
title: "Neden router?"
minutes: 13
kind: concept
---

# Neden router?

:::pain[Problem]
Sinema'da `setPage('details')` ile Dövüş Kulübü'nü açtın. Adres hâlâ `/`; yenileyince ana liste geliyor, geri tuşu da detaydan önceki liste durumunu bulamıyor. Arkadaşına aynı filmi açacak bir bağlantı gönderemiyorsun.
:::

## Görünümün adresi neden önemli?

Bir sayfanın görünmesi için React bileşenleri yeterlidir; ama web'de kullanıcı ekrandan fazlasını bekler. Adres çubuğundaki yolu kopyalar, yer imine ekler, yeniler veya tarayıcının geri tuşuna basar. Bu eylemler ekranın hangi bilgiyi temsil ettiğini de korumalıdır.

Şimdiye kadar `useState` ile hangi görünümün açık olduğunu seçtin. Bu state, React ağacının belleğinde yaşar. Kullanıcı tarayıcıda `/movie/550` açtığında React bu state'i bilmez; yalnızca geçerli adresi bilir. Aynı ekranı adresle yeniden kurabilirsen yenileme ve paylaşma doğal hale gelir.

![Yerel görünüm seçimi ile URL'nin eşlediği ekran arasındaki farkı gösteren diyagram](diagrams/state-ve-adres.svg)

Router, URL ile route ağacındaki ekranlar arasında eşleme kurar. URL değiştiğinde uygun route içeriğini seçer; uygulama içi geçişleri tarayıcı geçmişine ekler. Böylece `setPage('details')` gibi uygulamanın belleğine özel bir seçim, `/movie/550` gibi tarayıcının anlayacağı bir adrese dönüşür.

## Adres ile ekran arasındaki dört kural

1. **URL kullanıcıya ait bir giriş noktasıdır.** Kullanıcı bir adresi elle yazabilir, eski yer iminden açabilir veya paylaşılmış bağlantıyı izleyebilir. Bu nedenle URL'den gelen her parçayı güvenilir kabul etme; daha sonraki derslerde parametreleri doğrulayacaksın.
2. **Route, adres desenini ekranla eşler.** `/movie/550` adresinde `movie` bölümü route'u seçer, `550` ise o route'un hangi filmi göstermesi gerektiğini söyler. `/search?q=Matrix` aynı arama ekranını seçer ve arama değerini taşır.
3. **Gezinme geçmişi adres değişikliklerini sıraya koyar.** Uygulama içi bir geçiş yeni bir history kaydı ekler. Geri tuşu bu kayıtlarda önceki adrese döner; yalnızca React state'ini değiştirmek history'ye kayıt eklemez.
4. **Bir görünümün yeniden kurulması adresle mümkün olmalıdır.** Uygulama `/movie/550` adresinden açıldığında, önce ana sayfaya gidip state hazırlamak zorunda kalmamalıdır. Aynı adres yenileme sonrasında da aynı kaynağı anlatmalıdır.

Bu kurallar, her UI değerini URL'ye taşıman gerektiği anlamına gelmez. Kullanıcının paylaşmasını, yenilemede korumasını veya geri/ileri geçmişinde geri çağırmasını istediğin değerler adaydır. Fareyle üzerine gelinen kartın gölge rengi, açık tooltip veya kısa süreli animasyon gibi geçici ayrıntılar genellikle yalnız component içinde kalır.

## URL hangi state'i taşımalı?

Karar vermek için her değere üç soru sor: Bu değeri başka biriyle paylaşmak ister misin? Ekranı yenileyince aynı seçim geri gelmeli mi? Geri tuşuna basınca önceki seçimlere dönmek anlamlı mı? Cevaplardan biri evetse URL iyi adaydır. Örneğin `q=Matrix` arama metnini, `page=2` ikinci sonuç kümesini anlatır. Kullanıcının açık menü animasyonunu veya klavye odağındaki öğeyi paylaşması beklenmez.

URL'ye koymak yalnızca teknik bir saklama tercihi değildir; ürünün gezinme sözleşmesini belirler. Bir arama sayfasında sorguyu URL'ye koyup seçili sıralamayı local state'te bırakırsan link aynı filmleri ama farklı sırayla açabilir. Paylaşılabilir ekran tanımı için hangi seçimlerin görünümün parçası olduğunu ekipçe kararlaştır. Sonraki derste bu seçimleri path ve query parametreleri olarak ayıracaksın.

Adres ayrıca herkese görünen bir alandır. Tarayıcı geçmişine yazılır, kopyalanabilir ve bazı sistem günlüklerine girebilir. Bu yüzden parola, erişim token'ı, kişisel not veya büyük nesne URL'ye taşınmaz. Kaynak kimliğini veya kullanıcıya gösterilecek filtreyi taşımak yeterlidir; verinin kendisi başka bir kaynaktan alınır.

Bir route ekranının aynı adresten açılabilmesi, ekranın tüm bağımlılıklarının URL'de olduğu anlamına gelmez. Örneğin `/movie/550` film kimliğini söyler; film başlığını ve açıklamasını statik veri dosyasından veya API'den bulursun. Favori durumu Context'te veya kalıcı depoda yaşayabilir. URL hangi sayfayı istediğimizi söyler, verinin nerede tutulduğunu değil.

Tarayıcı adresini uygulama içinden güncellemenin iki genel sonucu olabilir. Yeni bir anlamlı ekran açılışı history'ye kayıt ekler; kullanıcının çok küçük bir tercih düzeltmesi için aynı entry'yi değiştirmek daha uygun olabilir. Bu ayrım, geri tuşunun kullanıcıyı kaç adım geriye götüreceğini etkiler. Modülde standart route navigasyonunu kullanacağız; daha ince history kararları ancak ürün akışında ihtiyaç olunca ele alınmalı.

## Anchor ile uygulama içi geçiş arasındaki fark

Normal bir `<a href="/search">` tarayıcıya başka bir belgeye gitmesini söyler. SPA sunucusu aynı `index.html` dosyasını döndürse bile tarayıcı yeni bir document yüklemesi başlatabilir; React ağacı ve bellekteki state yeniden kurulur. Router'ın link bileşeni ise URL'yi history içinde değiştirip eşleşen route içeriğini günceller. Dış siteye giden linkte normal anchor kullanmak doğrudur; uygulamanın kendi route'unda Router bağlantısı gezinme davranışını korur.

Bu farkı yalnızca hız olarak görme. Tam yükleme state'i resetler ve tüm başlangıç işlerini tekrar çalıştırır. Router geçişi uygulama ağacının ortak parçalarını koruyabilir. Buna rağmen state'in korunacağı garanti değildir: hangi route bileşenlerinin ağaçta kaldığı React kimlik kurallarına bağlıdır. URL'yi doğru kullanmak hem history semantiğini hem ortak bileşenlerin yaşam süresini anlamaya zemin hazırlar.

## Aynı ekranı iki yoldan açmayı izleyelim

Sinema'nın film detayını düşün. Yerel state yaklaşımında kullanıcı listede bir karta basar, `selectedMovie` güncellenir ve koşullu render detay bileşenini gösterir. Tarayıcı adresi `/` olarak kalır. Yenileme `selectedMovie` başlangıç değerine döndürür. Dışarıdan gelen kişi bu state'i oluşturacak tıklamayı yapmadığı için detay açılmaz.

| An | Yerel state yaklaşımı | Adres yaklaşımı |
| --- | --- | --- |
| Başlangıç | `/`, `selectedMovie = null` | `/` route'u listeyi açar |
| Film seçildi | State `550` olur, ekran değişir | `/movie/550` adresine gidilir |
| Yenileme | Başlangıç state'i geri gelir | Router aynı film route'unu yeniden eşler |
| Bağlantı paylaşma | State başka sekmeye taşınmaz | `/movie/550` doğrudan açılabilir |
| Geri tuşu | History'de state değişikliği yoktur | Önceki adres açılır |

Bu tablo adresin her şeyi sakladığını söylemez. Kullanıcı oturumu veya büyük veri nesneleri URL'ye konmaz. URL, görünümün kimliğini ve küçük, paylaşılabilir seçimleri taşır; asıl film verisi daha sonra statik listeden veya sunucudan bulunabilir.

## Kırık ekran seçimi ve adresli ekran

Aşağıdaki yaklaşım küçük bir demo içinde çalışır; sorun, uygulamanın ekranını adres ve tarayıcı geçmişinden bağımsız seçmesidir:

```tsx
function FilmUygulamasi() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  return selectedId === null ? <FilmList onSelect={setSelectedId} /> : <MovieDetails id={selectedId} />
}
```

Kullanıcı seçince bileşen tekrar render olur ve detay görünür. Fakat `location.pathname` değişmediğinden bu görünümün dışarıdan bir adresi yoktur. Sorun state güncellemesinin çalışmaması değil; ekran seçiminin tek sahibinin tarayıcının okuyamadığı bellek olmasıdır.

Route tabanlı düşününce ekranlar bir eşleme olarak tanımlanır. Bu derste yalnızca fikri görüyoruz; bir sonraki derste güncel React Router API'siyle çalışır hale getireceksin.

```tsx
const ekranlar = [
  { path: '/', element: <FilmList /> },
  { path: '/movie/:id', element: <MovieDetails /> },
]
```

`/movie/:id` bir desen, `/movie/550` ise onun somut eşleşmesidir. `:id` değeri adresle birlikte gelir; detay bileşeni bu değeri okuyup uygun filmi bulabilir. Eşleşme yoksa ayrı bir 404 ekranı göstermek de route ağacının parçasıdır.

:::mistake[Belirti → neden → düzeltme]
Detay açılıyor ama adres aynı kalıyor → görünüm yalnızca yerel state koşuluyla seçiliyor → adresi temsil eden bir route tanımla ve kullanıcı eylemini o adrese bağla.
:::

:::mistake[Belirti → neden → düzeltme]
Adres değişiyor ama yenileyince sunucu 404 veriyor → uygulama derin URL'yi yalnızca istemcide tanıyor, yayın sunucusu SPA girişini döndürmüyor → yayında bilinmeyen uygulama yollarını `index.html`'e yönlendir. Bu modülde yerel route davranışını kuruyoruz; yayın yapılandırması ayrı konudur.
:::

:::model[Route eşlemesi]
Route, adres desenini doğru React ekranına bağlar. Bu ilk bakışta adresin seçtiği sayfayı anlatır; ortak parent, child route ve filtrelerin URL'den kurulması nested route dersinde tamamlanacak.
:::

:::sector
Ürün ekipleri çoğu zaman hangi state'in URL'de bulunacağını tasarım ve API sözleşmesiyle birlikte kararlaştırır. Destek ekibine gönderilen `/search?q=matrix&page=2` adresi bir hatayı tekrar üretmeye yardım eder; yalnızca bellekte duran seçim ise başka bir kullanıcıya aktarılamaz. Ekipte pratik kural şudur: kullanıcı ekranı yer imine almalı veya geri tuşuyla geri dönmeli diyorsak URL'yi düşün.
:::

## Özet

- Yerel React state'i tek başına tarayıcı geçmişini veya paylaşılabilir adresi değiştirmez.
- Route, bir adres desenini doğru ekranla eşler; dinamik bölüm kaynak kimliğini taşıyabilir.
- Yenileme ve doğrudan açılışta ekranı URL'den yeniden kurabilmelisin.
- Yalnız paylaşılabilir veya geçmişte anlamı olan seçimleri URL'ye koy; geçici görsel ayrıntılar yerel kalabilir.

**Kendini yokla:** Kullanıcı detay ekranını yenileyince neden yalnız `selectedMovie` state'ine güvenmek yetmez?

*Cevap:* Yenileme component belleğini yeniden başlatır; state'in adres karşılığı yoksa hangi detayın açılacağı bilinmez.

**Kendini yokla:** Hover edilen kart rengini URL'de taşımak neden gereksizdir?

*Cevap:* Bu geçici görsel durum paylaşılabilir ekran kimliğinin parçası değildir ve geri/ileri geçmişinde korunması beklenmez.
