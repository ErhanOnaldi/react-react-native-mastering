---
title: "State’in sahibini seç"
minutes: 13
kind: concept
---

# State’in sahibini seç

Sinema’da bir film sayfası birkaç farklı bilgiyi aynı anda gösterebilir: film adı, kullanıcının izleme işareti, arama metni ve açık olan bilgi penceresi. Hepsine sadece “state” deyip aynı yerde saklarsan, hangi bilginin nereden yenileneceği ve kimin kararına uyacağı belirsizleşir. Önce her bilginin kaynağını bulalım.

Bilginin doğru kabul edilen kaynağına **authoritative source** denir. TMDB’deki film başlığı için bu TMDB sunucusudur; tarayıcıdaki kopya ise ekrana hızlıca göstermek için tutulur. Bu ayrım önemli, çünkü sunucu başlığı değiştirebilir ama yerel kopya bunu kendiliğinden bilemez.

## Önce sunucudan gelen bir alan

Bir film detayı API’den geliyorsa bu **server state**’tir: başka bir kullanıcı veya sunucu işlemi bu bilgiyi değiştirebilir. TanStack Query gibi bir araç cevabı cache’te tutar; **cache**, tekrar kullanmak için saklanan geçici kopyadır.

```ts check
type Movie = { id: number; title: string; year: number }
const movieFromServer: Movie = { id: 603, title: 'The Matrix', year: 1999 }
const queryCache = { movie: movieFromServer }
const pageTitle = queryCache.movie.title
void pageTitle
```

`queryCache` ekranda kullanılabilecek kopyayı temsil ediyor, asıl kaynağı değil. Sunucudaki film adı değişirse uygulama bu cache’i yenilemeli; başlığı ayrıca başka bir store’a kopyalamak ikinci bir güncel tutma işi çıkarır. Cache kullanmak normaldir, aynı sunucu cevabına iki bağımsız sahip açmak risklidir.

## Kullanıcının tercihini yanına ekle

Şimdi kullanıcı filmi izleme listesine ekliyor. Bu tercih server’dan gelen film ayrıntısının parçası değil; uygulamada kullanıcının yaptığı bir seçimdir. Buna **client state** deriz: kullanıcı etkileşimiyle değişen ve uygulamanın paylaştığı bilgi.

```ts check
type Movie = { id: number; title: string; year: number }
const queryCache = { movie: { id: 603, title: 'The Matrix', year: 1999 } satisfies Movie }
const watchLaterIds = new Set([603])
const movieCard = {
  title: queryCache.movie.title,
  isSaved: watchLaterIds.has(queryCache.movie.id),
}
void movieCard
```

Görünümde iki kaynağı birleştirdik ama sahiplerini karıştırmadık: başlık cache’ten, izleme işareti kullanıcı tercihinden geliyor. Client state’i birkaç ekranda ortak kullanacaksan Redux Toolkit gibi bir store yardımcı olabilir; tek kartın açık/kapalı görünümü için yerel `useState` daha az iştir.

## URL ve form kendi ömrünü taşır

Üçüncü örnekte kullanıcı tür filtresini bağlantı olarak paylaşmak istiyor, ayrıca yeni liste için henüz göndermediği bir ad yazıyor. Tür filtresi **URL state**’tir; adres çubuğunda bulunduğu için bağlantı, yenileme ve geri tuşuyla korunur. Yazılmakta olan liste adı ise **form state**’tir; henüz kaydedilmiş uygulama tercihi değildir.

```ts check
const searchParams = new URLSearchParams('?genre=drama')
const selectedGenre = searchParams.get('genre')
const unsentListName = 'Hafta sonu filmleri'
const listNameWasEdited = unsentListName.length > 0
void selectedGenre
void listNameWasEdited
```

Burada URL filtresi linki açan herkes için aynı görünümü tarif eder; form alanı ise gönderilene veya sıfırlanana kadar kişinin taslağıdır. Bir taslağın gönderilmesi bekleniyorsa, ekranda “Kaydediliyor…” gösterebilirsin; form kütüphanesindeki `pending` etiketi gönderimin sürdüğünü, `dirty` etiketi ise alanın başlangıç değerinden değiştiğini anlatır. İsimleri ezberlemekten çok hangi ana kadar geçerli olduklarını düşün.

## Sahipliği küçük bir tabloda izle

Bir katalog ekranındaki bilgileri kaynağına göre ayırınca uygun yer daha görünür olur:

| Bilgi | Kaynağı | Uygun yer |
| --- | --- | --- |
| Film adı ve yılı | TMDB sunucusu | TanStack Query cache’i |
| İzleme listesi seçimi | Kullanıcı tercihi | Paylaşılıyorsa client store |
| Seçili film türü | Adres çubuğu | URL |
| Yeni liste adı taslağı | Kullanıcı yazımı | Form state’i |
| Açık fragman penceresi | Tek component’in etkileşimi | Yerel state |

![Sunucu, istemci, URL ve form durumlarının sahiplerini gösteren diyagram](diagram:state-kategorileri)

Bu tablo “her bilgi yalnız bir yerde görünür” demiyor. Ekran, farklı sahiplerin verisini birleştirir. Kaçınmak istediğimiz şey, aynı bilginin iki yerde bağımsız kopyasını tutup ikisini de güncel tutmayı unutmak.

## Cache yenilenirken ne olur?

TanStack Query’de `staleTime`, bir cevabın ne kadar süre taze kabul edildiğini belirler. Süre dolunca veri hemen silinmez; Query onu eski kabul edip uygun durumda yeniden isteyebilir. Bir değişiklikten sonra **invalidation**, ilgili cache kaydını “yeniden kontrol et” diye işaretlemektir.

| Sıra | Olay | Film adı nereden okunur? |
| --- | --- | --- |
| 1 | Film detayı ilk kez gelir | Query cache’indeki cevap |
| 2 | Sunucuda başlık güncellenir | Ekrandaki cache henüz eski olabilir |
| 3 | İlgili kayıt invalidation ile eski işaretlenir | Query yeniden kontrol eder |
| 4 | Yeni cevap gelir | Query cache’i yeni başlığı gösterir |

Eğer aynı başlığı client store’da da sakladıysan, Query’nin yenilenmesi o ikinci kopyayı otomatik güncellemez. Film adı bir yerde yenilenip başka kartta eski kalabilir; her iki kaynağı eşitleyen ek kod yazman gerekir.

Bazı ekranlar sunucuya kaydetmeden önce yeni değeri hemen gösterir. Bu **optimistic update**’tir: sunucu cevabını beklerken arayüzde olası sonucu geçici olarak gösterirsin. İstek başarısız olursa eski görünümü geri koymaya **rollback** denir. Bu geçici gösterim, sunucunun yetkili kaynak olmasını değiştirmez; yalnızca bekleme sırasında kullanıcıya hızlı yanıt verir.

:::info[Derinlemesine (isteğe bağlı)]
Çevrimdışı düzenleme veya aynı kaydın eşzamanlı güncellenmesi varsa optimistic update için hangi eski değerin geri konacağını ve hangi isteğin son sözü söyleyeceğini ayrıca tasarlaman gerekir. Bu ayrıntı her ekran için gerekmez; yalnızca gecikme kullanıcı deneyimini bozuyorsa bu yolu seç.
:::

## Sık karışan seçimler

:::mistake[Belirti → Aynı film iki farklı başlıkla görünüyor]
Belirti → Detay sayfası yeni adı, başka kart eski adı gösteriyor.
Neden → Sunucu cevabı hem Query cache’inde hem client state’te ayrı kopya olarak tutulmuş.
Düzeltme → Film ayrıntısını Query’den oku; ortak tercihte gerekiyorsa film ID’sini tut.
:::

:::mistake[Belirti → Paylaşılan arama linki aynı sonucu açmıyor]
Belirti → Sayfayı yenileyince veya geri tuşuna basınca arama kayboluyor.
Neden → Paylaşılması gereken seçim yalnız component’in yerel state’indeydi.
Düzeltme → Arama metni ve sayfa gibi navigasyon seçimlerini URL’de tut.
:::

:::mistake[Belirti → Her harfte uygulama store’u güncelleniyor]
Belirti → Kullanıcı formu iptal etse bile yarım yazılmış ad ortaklaşa görünür.
Neden → Henüz gönderilmemiş form taslağı paylaşılan tercih gibi ele alınmış.
Düzeltme → Taslağı formda tut; yalnız başarılı gönderimden sonra kalıcı sonucu uygun sahibine aktar.
:::

## Özet

- Önce bilginin kaynağını ve ne zaman değişebileceğini bul; sonra yerini seç.
- Server state’in kaynağı sunucudur; Query cache’i yenileme ve geçerlilik sürecinde yardımcı olur.
- Client tercihi, URL seçimi ve form taslağı farklı ömürlere sahiptir; ekranda birleştirilebilirler.
- Aynı sunucu bilgisini iki bağımsız cache’te tutmak eski kopya riski ve eşitleme işi çıkarır.
- Optimistic update hızlı geçici görünüm, rollback başarısız istekten sonra eski görünüme dönüştür.

**Yeni terimler:**

- **Authoritative source:** Bilginin doğru kabul edilen asıl kaynağı.
- **Server state:** Sunucunun ürettiği ve değiştirebildiği veri.
- **Cache:** Tekrar kullanmak için tutulan geçici veri kopyası.
- **Client state:** Kullanıcının uygulamada yaptığı ortak seçim veya tercih.
- **URL state / form state:** Sırasıyla bağlantıyla taşınan seçim ve henüz gönderilmemiş form taslağı.
- **Invalidation:** Cache kaydını yeniden kontrol edilmesi gereken eski veri olarak işaretleme.
- **Optimistic update / rollback:** Sunucu cevabından önce olası sonucu gösterme / başarısızlıkta eski değere dönme.

**Kendini yokla:** TMDB film başlığı ve kullanıcının izleme işareti aynı kaynağa mı ait?
*Cevap:* Hayır. Başlığın kaynağı TMDB’dir; işaret kullanıcının client state tercihidir.

**Kendini yokla:** Tür filtresi neden URL’de daha kullanışlı olabilir?
*Cevap:* Link paylaşımı, yenileme ve geri/ileri gezinme aynı seçimi koruyabilir.
