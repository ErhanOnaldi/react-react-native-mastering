---
title: "Neden router?"
minutes: 13
kind: concept
---

# Neden router?

Bir film kartına basınca şimdiye kadar `useState` ile başka bir görünüm açtın. Örneğin `selectedId` değerini `550` yapınca Dövüş Kulübü'nün ayrıntısı görünür. Bu, ekrandaki değişiklik için yeterlidir; ama tarayıcı adres çubuğunda hâlâ `/` yazar. Burada eksik olan şey yeni bir React tekniği değil: ekranda gördüğün sayfanın adresle anlatılması.

## Önce aynı filmi adresle düşün

Bir **URL**, web'deki bir kaynağın adresidir. `/movie/550` gibi bir adres, Sinema'daki belirli bir film ayrıntısını tarif edebilir. Kullanıcı bu adresi kopyalayabilir, yer imine ekleyebilir veya doğrudan açabilir.

İlk örnekte film seçimi yalnızca React state'inde duruyor:

```tsx
function FilmEkrani() {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  return selectedId === null
    ? <FilmList onSelect={setSelectedId} />
    : <MovieDetails id={selectedId} />
}
```

Kart seçilince `selectedId` değişir ve React ayrıntıyı gösterir. Adres ise değişmediği için bu seçim başka sekmeye taşınamaz. Sayfayı yenilersen React uygulaması yeniden başlar ve `selectedId` başlangıç değeri olan `null` olur.

Şimdi aynı seçimi adreste taşıdığını varsay:

```text
/movie/550
```

Bu adresi açan uygulama `550` numaralı filmi gösterebilir; hangi tıklamaların önceden yapıldığını bilmesi gerekmez. **Route**, bir URL desenini ekranda gösterilecek içerikle eşleyen kuraldır. Örneğin `/movie/:id` deseni `/movie/550` adresine uyabilir; `:id` kısmı hangi filmi istediğini belirtir.

Bu kez görünüm adresle birlikte değişir. Kullanıcı bağlantıyı yenilediğinde veya başka sekmede açtığında aynı film adresi yine aynı ekranı seçer. Film verisinin kendisi URL'de bulunmaz; adres yalnızca hangi kaynağın istendiğini söyler.

## Geri tuşunun görebildiği şey

Tarayıcı, ziyaret edilen adresleri bir **history kaydı** olarak sırayla tutar. Kullanıcı geri tuşuna bastığında bu kayıtlar arasında geriye gider. React state'ini değiştirmek tek başına tarayıcıya yeni bir adres ziyareti bildirmez.

Şu akışta ekran değişse de history aynı kalır:

| An | Ekran | Adres ve history |
| --- | --- | --- |
| İlk açılış | Film listesi | `/`; tek ziyaret |
| Film seçildi, yalnız state değişti | Film ayrıntısı | Hâlâ `/`; yeni kayıt yok |
| Geri tuşuna basıldı | Tarayıcı önceki adresi arar | Önceki farklı bir kayıt yok |

`setPage('details')` çalışmıştır; belirti, geri tuşunun beklediğin gibi davranmamasıdır. Nedeni state güncellemesinin başarısız olması değil, bu güncellemenin history kaydı oluşturmamasıdır. Sayfa geçişinin geri alınabilmesi isteniyorsa geçişin adresi de değiştirmesi gerekir.

Bir router, URL ile **route** kurallarını eşleştirip o adrese uygun React ekranını seçen araçtır. Böylece ekran seçimi uygulama belleğinde gizli kalmaz; tarayıcının da okuyabildiği bir adrese bağlanır.

## Adres yalnızca kaynak seçimini taşısın

Bir URL'ye ne koyacağını arama ekranıyla adım adım görelim. En basit halde `/search` yalnızca arama ekranını açar:

```text
/search
```

Bu adres ekran türünü anlatır, fakat hangi aramanın yapılacağını henüz söylemez. Bir arama metni eklediğinde `?q=Matrix` bölümü URL'nin **query string** kısmıdır; soru işaretinden sonra gelen küçük değerler ekranın seçimini taşır.

```text
/search?q=Matrix
```

Artık aynı adresi açan başka biri de Matrix aramasını görebilir. Sonuçların ikinci sayfası da görünümün anlamlı bir parçasıysa `page=2` eklenebilir:

```text
/search?q=Matrix&page=2
```

Her UI ayrıntısını buraya koymayız. Arama metni ve sayfa numarası paylaşılabilir; kartın üzerine gelince oluşan gölge veya klavye odağının konumu çoğunlukla geçicidir. Yenileyince ya da bağlantıyı paylaşınca aynı filmleri görmeyi istiyorsan seçim URL'de olmayı hak eder.

Adres herkese açık olabileceği için parola, kişisel not veya büyük veri nesnesi koyma. `/movie/550` film kimliğini taşır; başlık ve açıklama uygulamadaki veriden bulunur. URL hangi görünümü istediğini belirtir, verinin nerede saklandığını değil.

## Yenilemede ne korunur?

Uygulama liste adresinde başladıktan sonra bir filmi seçtiğini varsay. Yerel state ve adres yaklaşımının farkı yenileme anında belirginleşir:

| An | Yalnızca yerel state | URL ile seçilen ekran |
| --- | --- | --- |
| Başlangıç | `/`, `selectedId = null` | `/`, liste route'u |
| Film seçildi | `selectedId = 550`, ayrıntı görünür | Adres `/movie/550`, ayrıntı route'u |
| Yenileme | State başlangıç değerine döner, liste görünür | Uygulama `/movie/550` adresini okuyup ayrıntıyı seçer |
| Adresi paylaşma | Seçim başka sekmeye aktarılmaz | Diğer sekme aynı filmi açabilir |

İkinci yaklaşımda ekranı kurmak için önceden listeye uğrama şartı yoktur. Bunun nedeni, adresin hangi içeriğin açılacağını tarif etmesidir. Film verisini yine yerel listeden veya sunucudan bulursun.

![Yerel görünüm seçimi ile URL'nin eşlediği ekran arasındaki farkı gösteren diyagram](diagrams/state-ve-adres.svg "Adres seçimi yenileme ve paylaşımda korur.")

Bir **SPA** (single-page application), uygulamanın temel HTML belgesini bir kez yükleyip ekran içeriğini JavaScript ile güncellediği uygulamadır. Router kullanıldığında uygulama içindeki adres değişimi yeni bir HTML belgesi yüklemeden yeni ekranı seçebilir. Tarayıcı adresi ve geçmişi yine çalışır; değişen şey bütün sayfayı baştan yüklemek yerine uygulamanın uygun içeriği göstermesidir.

Normal `<a href="/search">` bağlantısı tarayıcıdan yeni belge yüklemesini ister. Uygulama içi router bağlantısı ise adresi güncellerken çalışan uygulamayı korur. Bu fark, kullanıcıya adresi paylaşma ve geri tuşunu kullanma olanağı verir; ortak ekran parçalarının gereksiz yere baştan kurulmasını da önleyebilir.

Burada **React component identity** (bileşen kimliği), React'ın bir ekrandaki bileşenin önceki render'daki aynı bileşen olup olmadığını anlamasıdır. Aynı bileşen ağaçta aynı yerde kalırsa yerel state'i korunabilir; farklı bir ekrana geçildiğinde bazı bileşenler kaldırılıp yenileri eklenebilir. Bu yüzden router geçişi her state'i korur diye düşünme. Şimdilik önemli fark şu: adres hangi ekranın istendiğini, React state'i ise o ekranın içindeki geçici etkileşimleri anlatabilir.

## Öğrencinin düşebileceği hata

Belirtiyi şöyle fark edersin: film ayrıntısı açılır, ama adres `/` kalır; yenileyince listeye dönersin. Genellikle ayrıntıyı yalnızca bir `selectedId` koşuluyla göstermişsindir. Seçilen filmi URL ile eşleyen bir route tanımlayıp geçişi bu adrese bağla; böylece tarayıcı da ekran seçimini görür.

Her state'i URL'ye taşımak da doğru değildir. Örneğin bir menünün o anda açık olup olmadığını paylaşmak gerekmez. Kullanıcı yenilediğinde, yer iminden döndüğünde veya başkasına bağlantı gönderdiğinde aynı görünmesi anlamlı olan seçimler için URL'yi düşün.

## Kısaca hangi seçim URL'ye gider?

Bir seçimin URL'de olmasını, üç soruyla değerlendirebilirsin: Başka birine göndermek ister misin? Yenilemeden sonra aynı seçim geri gelmeli mi? Geri ve ileri tuşları bu seçimler arasında dolaşmalı mı? Bu sorulardan biri evetse adres iyi bir yerdir. Kısa süreli görsel efektler ve odağın yeri component state'inde kalabilir.

URL'yi her değerin deposu gibi düşünme. Arama terimi, sayfa numarası ve film kimliği ekranda ne istendiğini tarif eder. Filmin tam nesnesi, kullanıcı oturumu veya özel bilgiler başka yerde kalır.

## Özet

- Yerel React state'i ekranı değiştirebilir; kendiliğinden adres veya history kaydı oluşturmaz.
- Router, URL'yi route kuralıyla eşleştirip istenen ekranı seçer.
- Yenilenince ya da doğrudan açılınca korunması gereken seçimler URL'de anlatılabilir.
- URL'ye küçük ve paylaşılabilir seçimleri koy; geçici UI ayrıntıları ve özel veriler orada yaşamaz.

**Yeni terimler**

- **History kaydı:** Tarayıcının ziyaret edilen adresler arasında geri ve ileri gitmek için tuttuğu kayıt.
- **Query string:** URL'de `?` sonrasında yer alan, arama veya sayfa gibi küçük seçimleri taşıyan bölüm.
- **Route:** Bir adres desenini gösterilecek ekranla eşleyen kural.
- **SPA:** Sayfa içeriğini yeni belge yüklemeden JavaScript ile değiştiren uygulama biçimi.
- **Component identity:** React'ın bir bileşeni önceki render'daki bileşen olarak tanıyıp tanımamasını belirleyen kimlik.

**Kendini yokla:** `setPage('details')` sonrası geri tuşu neden listeye dönmeyebilir?

**Cevap:** State değişikliği tarayıcı history'sine yeni adres eklemediği için geri tuşunun gideceği yeni bir kayıt oluşmamıştır.

**Kendini yokla:** Film kimliğini URL'ye koymak, tüm film nesnesini oraya koymaktan neden daha uygundur?

**Cevap:** Kimlik istenen kaynağı tarif eder; film başlığı ve diğer veriler uygulamanın veri kaynağından bulunabilir.
