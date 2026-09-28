---
title: "State’in sahibini seç"
minutes: 13
kind: concept
---

# State’in sahibini seç

:::pain[Sinema’da sorun]
TMDB’den gelen film detayını Redux’a da yazdın. TanStack Query arka planda cevabı yeniledi; film ekranı yeni özeti gösterirken Redux’taki film kartı eski başlığı gösteriyor. Bir kullanıcı eylemiyle iki kopyayı güncellemek zorundasın. Bu, cache kitaplığı seçimi değil; aynı bilginin iki bağımsız sahibi olması sorunu.
:::

## Bir bilgiye tek yaşam döngüsü

State’i “hangi kütüphaneyi kullanıyorum?” diye değil, “bu bilgiyi kim üretiyor ve ne zaman geçerli?” diye sınıflandır. Bir ekranda farklı türden state’ler yan yana durabilir. Örneğin film arama sayfasında arama metni URL’den gelir, istek sonucu sunucudan gelir, favori seçimi kullanıcıdan gelir, yeni liste formunun taslağı formdan gelir.

Bu sınıflandırma soyut bir etiket oyunu değildir. Bilginin nerede kalacağını, nasıl güncelleneceğini ve kimin geçerliliğini belirleyeceğini anlatır. Aynı bilgi iki yerde bağımsız saklanıyorsa birinin diğerini ne zaman güncelleyeceğini de tasarlamak zorunda kalırsın.

![Sunucu, istemci, URL ve form durumlarının sahiplerini gösteren diyagram](diagram:state-kategorileri)

1. **Server state:** Yetkili kaynak bir sunucudur. Veri zamanla başkası tarafından değişebilir; cache, tekrar çekme, loading/error ve geçerlilik yönetimi gerekir. TanStack Query bu yaşam döngüsüne uygundur.
2. **Client state:** Kullanıcının bu uygulamada oluşturduğu ortak tercih veya koleksiyondur. Favori kimlikleri, tema ve uygulama içi izleme listeleri buna örnektir. Redux Toolkit veya daha küçük bir store bu bilgiyi paylaşabilir.
3. **URL state:** Yenileme, paylaşma ve geri/ileri gezinmeyle korunması gereken ekran seçimidir. Arama sorgusu ve sayfa numarası URL’de durunca link aynı görünümü yeniden açabilir.
4. **Form state:** Kullanıcının henüz göndermediği taslak, doğrulama hatası ve dirty/pending gibi form yaşam döngüsü verileridir. React Hook Form bu alanları yönetir.
5. **Yerel UI state:** Yalnız bir bölümün geçici aç/kapa veya hover gibi durumu varsa component state’i genellikle yeterlidir. Her yerel değeri ortak store’a taşımak paylaşım gereksinimi yaratmaz.

## Sahipliği adım adım bul

Örnek olarak bir podcast uygulamasındaki oynatma kuyruğunu ele al. Sunucudan gelen bölüm başlığı ile kullanıcının kuyruğa ekleme tercihi aynı nesne değildir.

| Bilgi | Kaynak | Yenilenme biçimi | Uygun sahip |
| --- | --- | --- | --- |
| Bölüm başlığı ve süre | Katalog API’si | Sunucudan tekrar alınabilir | TanStack Query |
| Bu oturumdaki kuyruk sırası | Kullanıcı eylemi | Oynat/çıkar/sırala | Client store |
| Seçili katalog filtresi | Adres çubuğu | Link ve geri tuşu | URL |
| Yeni liste adı taslağı | Kullanıcı yazımı | Submit/reset | RHF |
| Açık paylaşım penceresi | Tek bileşen | Düğme tıklaması | Yerel state |

İz sürmeyi şu sırayla yap:

1. Bilginin ilk kaynağını bul: API, adres çubuğu, form girdisi, kullanıcı eylemi veya bileşen etkileşimi.
2. Bilgi başka bir yerde değişebilir mi diye sor. Sunucu cevabı evetse eldeki kopya sonsuza kadar doğru kalamaz.
3. Yenileme, geri tuşu ve farklı ekranda kullanım gereksinimlerini yaz.
4. Bu yaşam döngüsünü yöneten tek sahibin kim olacağına karar ver.
5. Diğer verilerle ekranda birleştir; aynı nesneyi kopyalayıp ikinci bir cache oluşturma.

Örneğin bölüm adı Query sonucunda, kuyrukta yalnızca bölüm ID’leri bulunabilir. Görünümde ID ile Query verisini eşlersin. Başlık sunucuda değiştiğinde Query yenilenir; kullanıcının kuyruk sırası kendiliğinden silinmez.

Sahiplik kararı bazen tek cevaba indirgenmez. Bir kullanıcı sunucuda hesabına bağlı favoriler tutuyor olabilir; o zaman sunucu favori listesinin yetkili kaynağıdır, fakat istemci yine Query cache’iyle sonucu okur. UI’de seçili görünme, server state’in istemcideki cache kopyasıdır; Redux’a ek bir authoritative kopya açman gerektiği anlamına gelmez. Çevrimdışı düzenleme veya optimistic update varsa geçici client değişikliği ayrı bir katman olarak ele alınır ve başarısızlıkta rollback kuralı kurulur.

Kalıcı olması da tek başına Redux gerekçesi değildir. Bir tercih tarayıcı yenilemesinde kalmalı fakat başka ekranların ortak state’i olmamalıysa local storage veya URL uygun olabilir. “Kalıcı” sözcüğü veri sahipliğini tanımlamaz: verinin kaynağı, paylaşım alanı ve güncellenme biçimi hâlâ sorulmalıdır. Mesela arama sorgusunu localStorage’a koymak geri tuşuyla gezinme geçmişinin yerini tutmaz.

Geçiş sırasında mevcut verinin kaynağını da not et. Aynı değer API’den geliyor mu, formda düzenleniyor mu, kullanıcı seçimi olarak saklanıyor mu? Bir alanın adı `movie` diye onun tek bir state türü olduğu sonucu çıkmaz: API’den gelen `movie` server state, “daha sonra izle” işareti client state, düzenlenen başlık form state olabilir. Alanları davranışlarına göre ayırmak sınırları daha sağlam kurar.

## İki cache’in izini sür

Kırık düzen, bütün API cevabını hem Query’de hem Redux’ta saklar:

```ts title="Aynı sunucu nesnesinin iki kopyası"
const query = useQuery({ queryKey: ['episode', id], queryFn: loadEpisode })
const episode = useAppSelector((state) => state.library.episodes[id])
```

Burada sorun kodun derlenmesi değil. Query `staleTime` sonunda yenilenebilir; Redux kopyası bu yenilemeyi otomatik bilmez. İki veri kaynağından hangisinin ekrana gideceği de belirsizleşir.

Daha doğru ayrım, API cevabını Query’de bırakıp kullanıcı tercihini ID ile tutmaktır:

```tsx title="Sunucu verisi ile kişisel seçimi birleştir"
const { data: episode } = useQuery({ queryKey: ['episode', id], queryFn: loadEpisode })
const queued = useAppSelector((state) => state.player.queueIds.includes(id))

return episode ? <p aria-label={queued ? 'Sırada' : 'Sırada değil'}>{episode.title}</p> : null
```

Kod, Query ve store’un önceden kurulmuş olduğunu varsayar. Önemli karar, API nesnesini client store’a taşımamaktır. Query loading, hata, cache ve yeniden doğrulamayı yönetir; store ise kullanıcının seçimini taşır.

## Sınırlar ve sık karışan durumlar

:::mistake[Belirti → sunucu güncel ama ekranda eski kopya var]
Belirti → Yenilenen katalog kartında yeni başlık, başka bir yerde eski başlık görünür.  
Neden → API nesnesi ikinci bir client cache’ine kopyalanmıştır.  
Düzeltme → Sunucu cevabını tek cache’te tut; ortak client state’te gerekiyorsa yalnız kimlik veya kullanıcı seçimini sakla.
:::

:::mistake[Belirti → Arama linkini arkadaşına gönderince aynı sonuç açılmıyor]
Belirti → Arama metni component state’inde kaldığı için yenilemede siliniyor.  
Neden → Paylaşılabilir ekran seçimi URL yerine geçici state’e konmuş.  
Düzeltme → Sorgu ve sayfa gibi navigasyonun parçası olan değerleri URL parametrelerinde tut.
:::

:::mistake[Belirti → Form yazarken her harf global store’u güncelliyor]
Belirti → Taslak başka ekranlara yayıldı, iptal/dirty davranışı zorlaştı.  
Neden → Formun kendi yaşam döngüsü ortak client state gibi ele alınmış.  
Düzeltme → Gönderilmemiş alanları form state’inde tut; submit sonrası kalıcı bir iş kuralı varsa sonucu uygun sahibine aktar.
:::

:::mistake[Belirti → Küçük açılır pencere için uygulama store’u büyüyor]
Belirti → Tek bileşenlik bir açık/kapalı değeri her yerde erişilebilir hale getirilmiş.  
Neden → Paylaşım ihtiyacı olmayan geçici state gereksiz yere yukarı taşınmış.  
Düzeltme → Bilgi yalnız bir bileşen ağacında kullanılıyorsa yerel state bırak.
:::

:::sector
Ekiplerin veri sahipliği tabloları, teknolojiden bağımsız bakım maliyetini görünür yapar. Bir API endpoint’ini iki cache’te yaşatmak için geçerli bir migration veya entegrasyon nedeni olabilir; böyle bir durumda invalidation ve hata senaryoları da açıkça tasarlanır. Sadece “Redux kullanıyoruz” demek sunucu cache’ini tekrar kurmak için yeterli gerekçe değildir.
:::

## Özet

- State sahibini verinin kaynağı ve yaşam döngüsü belirler.
- Server state için Query; ortak client tercihleri için store; paylaşılabilir gezinme için URL; form taslağı için RHF uygundur.
- Aynı API nesnesini Query ve Redux’ta ayrı ayrı tutmak senkronizasyon sorunu çıkarır.
- Bir ekranda farklı sahiplerin verilerini görünüm için birleştirebilirsin; sahipleri birleştirmek zorunda değilsin.

**Kendini yokla:** API’den gelen kitap başlığı ile “daha sonra oku” işareti aynı state sahibine mi ait?  
*Cevap:* Başlık server cache’indedir; işaret kullanıcıya ait client state’tir.

**Kendini yokla:** Tarayıcı geri tuşuyla değişmesi beklenen kategori seçimini nereye koyarsın?  
*Cevap:* URL’ye; böylece gezinme geçmişinin parçası olur.
