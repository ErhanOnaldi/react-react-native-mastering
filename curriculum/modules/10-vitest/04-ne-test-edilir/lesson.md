---
title: "Davranışı koru, uygulama ayrıntısını değil"
minutes: 16
kind: concept
---

# Davranışı koru, uygulama ayrıntısını değil

:::pain[Sinema’da ne oldu?]
Sinema’da Kayıtlılar bağlantısında `?tab=saved` görünüyor, ama ekran Popüler görünümünü açıyor. Bir test iç değişkeni izlediği için refactor’da kırıldı; görünür sekme seçiminin kendisi ise hiç doğrulanmamıştı.
:::

## Testin sınırını seç

Önceki modüllerde saf fonksiyon, reducer ve küçük bileşen için test yazdın. Bu derinleşme, aynı beceride neyi gözlemleyeceğini seçmeye odaklanır. Davranış testi çağıranın gördüğü girdiyi, çıktıyı veya yan etki sınırını ölçer. Uygulama ayrıntısı ise bir fonksiyonun hangi yerel değişkeni kullandığı, kaç yardımcı çağırdığı ya da query string’i hangi sırayla oluşturduğudur.

Refactor, kodun iç yapısını dış davranışı koruyarak değiştirmektir. Test iç yapıya fazla sıkı bağlanırsa doğru refactor’da kırılır. Test çok genel olursa yanlış sonuçla da yeşil kalır. İyi sınır, çözüme alan bırakır ama önemli davranış farkını yakalar.

:::model[Test anatomisi]
Hazırla, çalıştır, doğrula düzeninde Assert adımı en çok dikkat ister: dışarıdan hangi farkın anlamlı olduğunu seçmelisin. Hazırlık veriyi kurar, çalıştırma gerçek kodu çağırır; doğrulama da çağıranın sözleşmesini ölçer. Burada yeni olan, aynı düzeni tek fonksiyon yerine modül sınırındaki işbirliğine uygulamaktır.
:::

![Testin hazırla, çalıştır, doğrula akışı](diagram:test-anatomisi)

## Davranış mı, iç ayrıntı mı?

1. Kullanıcıya veya çağıran modüle görünen sonucu test et: görünen metin, dönüş değeri, URL parametresi veya saklanan anahtar.
2. Aynı sonuca ulaşabilecek geçerli uygulamalar varsa bunlardan birini testte zorunlu kılma.
3. Dış etki çağıranın sözleşmesiyse sınırda gözlemle; örneğin HTTP client’ın gönderdiği URL ve yetkilendirme başlığı.
4. Testin geçtiği halde bilinen hatanın oluşup oluşmadığını düşün. Oluyorsa beklenti eksiktir.
5. Test iç uygulamaya bağlandıysa, ancak iç ayrıntı gerçekten dış sözleşmeyse tut.

Sekme seçimi URLSearchParams ile veya şablon string ile yazılabilir. Testin önemli olanı `tab=saved` değeridir. Aynı görünümü farklı geçerli kodla üretebilirsin; çağıranın ihtiyaç duyduğu sekmeyi korumak önemlidir.

## Seçili sekmenin izini sür

Kullanıcı Kayıtlılar sekmesine tıklıyor. Test yalnızca fonksiyonun çağrıldığını kontrol ederse:

```ts
expect(makeUrl).toHaveBeenCalled()
```

Act gerçekleşmiş olabilir ama yanlış sekme seçilmiş olabilir. Daha anlamlı gözlem URL’deki tab değeridir:

```ts
const url = new URL('https://sinema.test/?tab=saved')
expect(url.searchParams.get('tab')).toBe('saved')
```

Zaman sırasını izleyelim:

| Adım | İçeride olan | Dışarıdan anlamı |
| --- | --- | --- |
| 1 | kullanıcı `saved` sekmesini seçer | bağlantı bu seçimi taşımalı |
| 2 | URL okunur | query içindeki tab değeri bulunur |
| 3 | ekran görünümü seçilir | kayıtlılar kartları açılır |
| 4 | başlık görünür | Kayıtlılar sekmesi seçili görünür |

URL’de sekme parametresi doğruysa string kurma yöntemi önemli değildir. Parametre yanlışsa event handler’ın çağrılması yeterli olmaz. Entegrasyon testi seçilen sekme başlığını ve görünen listeyi doğrulayabilir; küçük birim testi component’in URL’e bağlandığını tek başına kanıtlamaz. Aynı gereksinime hizmet eden sınırları ayırmak hata mesajını daha kullanışlı kılar.

## Kırık test ve doğru test

Aşağıdaki assertion, saved yerine popular sekmesini seçen uygulamayı da geçirir:

```ts check
const requestedTab: string = 'popular'
if (requestedTab.length === 0) throw new Error('Sekme parametresi eksik')
```

Parametrenin varlığına bakmak, değerinin doğru olduğunu göstermez. Düzeltmede kritik değeri karşılaştır:

```ts check
const requestedTab: string = 'popular'
if (requestedTab !== 'saved') throw new Error('Kayıtlılar sekmesi seçilmeliydi')
```

URL query sırası değişebilir; URLSearchParams içinden tab değerini okumak davranışı kontrol ederken biçim seçimini serbest bırakır. Bu, parametre dizilişi gibi önemsiz farklardan etkilenmez.

Test yazarken beklenen hatayı önce cümle olarak kur. “Sekme açılmalı” çok geniştir. “Kayıtlılar bağlantısı Kayıtlılar görünümünü açmalı” ölçülebilir bir gereksinimdir. Bu ifade test başlığı ve assertion’ın kapsamını belirler.

## Fazla içeri girmenin maliyeti

Private fonksiyonun kaç kez çalıştığını izlemek tek başına kullanıcı sonucunu garanti etmez. Aynı işi tek geçişte yapmak veya memoize etmek gibi geçerli değişiklikler sayıyı değiştirebilir. Fakat performans bütçesi ya da ödeme gönderiminin tam bir kez yapılması açık gereksinimse çağrı sayısı dış sözleşmenin parçası olabilir. Ayrıntıların her zaman kötü olduğunu söylemiyoruz; gereksinimin onları neden önemli kıldığını netleştir.

İç fonksiyonları export edip sırf test kolaylığı için dış API’ye eklemek de sınırı genişletir. Test birim sınırına ulaşamıyorsa public davranıştan test etmeyi, saf mantığı küçük bir modüle ayırmayı veya entegrasyon katmanında gerçek parçaları bağlamayı değerlendir. Bir mock, bağımlılığın davranışını değiştirir; çok geniş mock testin gerçek sistemi temsil etmesini engeller.

Testin adında davranış bulunsun. “Sekme açılır” yerine “Kayıtlılar sekmesi seçildiğinde kayıtlılar görünümü açılır” hangi girdide ne beklendiğini anlatır. Böyle bir ad başarısız olduğunda sorunu kodu açmadan teşhis etmeyi kolaylaştırır. Aynı testin içine birbirinden bağımsız beklentileri yığma; bir test başlığıyla ilgisiz hata sonuçlarını ayıklamak daha güçtür. Eğer birden fazla assertion aynı sözleşmenin parçalarıysa bir arada durabilir.

:::mistake[Çağrıldı demekle yetinmek]
**Belirti:** URL değişir ama yanlış görünüm açılır. → **Neden:** Test yalnız handler’ın varlığını ölçüyordur. → **Düzeltme:** Seçilen sekme query’sini veya ekrandaki başlığı karşılaştır.
:::

:::mistake[Private değişkene bağlanmak]
**Belirti:** Davranış doğru kalmasına rağmen refactor sonrası test bozulur. → **Neden:** Assertion geçici iç isim veya çağrı sırasını zorunlu kılmıştır. → **Düzeltme:** Çağıranın gözlediği sonucu veya kararlı dış sınırı test et.
:::

:::mistake[Her iç ayrıntıyı asla test etmemek]
**Belirti:** Authorization başlığının kaybolması testlerden kaçar. → **Neden:** Protokol şartı implementation detayı sanılmıştır. → **Düzeltme:** Sözleşme gereği olan dış etkileri ilgili sınırda ölç.
:::

:::sector
Kod incelemesinde “hangi gerçek regresyon bu assertion’ı kırar?” sorusu testin gücünü gösterir. Test belirli bir iç yöntemi zorunlu kılıyorsa bu yöntemin ürün veya operasyon gereksinimi olup olmadığını açıklamak gerekir.
:::

Test sınırı seçerken bağımlılık grafiğine bak. Saf dönüştürücü giriş alıp sonuç verir; burada mock eklemek yalnızca dikkati dağıtır. API client URL kurar ve HTTP sınırına çıkar; ağ sonucunu fake edince client kodu yine gerçek çalışır. React ekranında kullanıcı girdisinin state ve görünür içeriğe etkisi önemliyse test gerçek component’i render etmelidir. Her durumda en küçük parçayı izole etmek değil, amaca uygun en küçük gerçek akışı çalıştırmak gerekir.

Test double kararında önce bağımlılık deterministic ve hızlı mı diye sor. Öyleyse gerçek kullan. Değişken veya dış dünyaya bağlıysa kontrol edilecek noktada değiştir. Test edilen davranışı yanlışlıkla devre dışı bırakacak genişlikte mock kurma. jsdom içindeki localStorage gerçek ve hızlı çalışıyorsa depolama içeriğini okuyabilirsin. Yazım anahtarı da gereksinimse spy ekle ama metodu çalışır bırak.

Testi kontrol ettiğin şey kadar kontrol etmediğin şey açısından da oku. Fake fetch’in ürettiği 404, uzak sunucunun gerçekten bu cevabı gönderdiğini ispatlamaz. Buna rağmen client’ın bu cevabı nasıl yorumladığını doğrudan ölçer. Bu sınırı doğru anlamak testin kapsamını netleştirir.

## Özet

- Testin merkezine çağıranın gördüğü davranışı koy.
- Bir çağrının yapılmasını değil, kritik argüman ve sonucu denetle.
- Refactor’da değişebilecek yerel yapı ve yardımcı sayısını ancak sözleşmeyse sabitle.
- Ağ başlığı gibi gerçek dış sınır sözleşmeleri açık assertion gerektirebilir.
- Bilinen hatayı testin üretebilip üretemediğini sorgula.

**Kendini yokla:** Kayıtlılar sekmesi için yalnız tıklama handler’ını beklemek neden yetersiz? Handler yanlış görünümü seçebilir; URL değerini veya başlığı ölç.

**Kendini yokla:** Authorization başlığını test etmek her zaman iç ayrıntı mıdır? Hayır; client’ın uyması gereken protokol sözleşmesi olabilir.

