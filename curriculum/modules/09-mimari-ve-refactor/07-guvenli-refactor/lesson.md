---
title: "Davranışı koruyarak refactor et"
minutes: 17
kind: concept
---

# Davranışı koruyarak refactor et

Sinema'da bir film kartındaki tür adlarını gösteren satırın iki yerde aynı yazıldığını düşün. Kod çalışıyor; amacın kullanıcıya yeni bir şey göstermek değil, ortak kuralı daha anlaşılır bir yere almak. **Refactor**, dışarıdan görülen sonucu koruyup kodun iç düzenini iyileştirmektir. Sonucu değiştirirsen bu artık yalnızca refactor değildir; iki işi aynı anda yapmak, bir şey bozulduğunda nedenini bulmayı zorlaştırır.

## Aynı tür satırını bir yerde üret

Şu iki satır aynı metni üretir:

```ts
const cardLine = `Türler: ${genres.join(', ')}`
const detailLine = `Türler: ${genres.join(', ')}`
```

Ortak işi küçük, adlandırılmış bir fonksiyona alabiliriz. Böyle küçük, yeniden kullanılabilir fonksiyona **helper** denir:

```ts
function genreLine(genres: string[]): string {
  return `Türler: ${genres.join(', ')}`
}

const cardLine = genreLine(['Bilim Kurgu', 'Aksiyon'])
const detailLine = genreLine(['Bilim Kurgu', 'Aksiyon'])
```

İki yerde de aynı `Türler: Bilim Kurgu, Aksiyon` metni çıkar. Değişen şey yalnızca metni kimin ürettiğidir: kural artık iki kopya yerine `genreLine` içinde durur. Bu küçük örnekte bile önce-sonra çıktısını karşılaştırmamızın nedeni, kodu düzenlerken fark etmeden kullanıcıya görünen metni değiştirmemektir.

## Boş tür listesini de koru

İlk örnek boş dizide `Türler: ` üretir. Diyelim ki Sinema kartı zaten boş tür için `Tür bilgisi yok` gösteriyordu. Refactor'dan önce bu ayrımı not etmeliyiz; ortak fonksiyona taşırken aynı çıktıyı koruyalım:

```ts
function genreLine(genres: string[]): string {
  if (genres.length === 0) return 'Tür bilgisi yok'
  return `Türler: ${genres.join(', ')}`
}
```

Bu fonksiyon dolu ve boş girdide iki ayrı eski davranışı sürdürüyor. Boş liste kontrolünü atlayıp yalnızca normal örneği deneseydik, yaygın tür listesi düzgün görünürken boş kartın metnini kaybettiğimizi fark etmeyebilirdik. Refactor öncesi kaydedilen mevcut çıktılara **karakterizasyon testi** denir: testler, henüz değiştirmeden önce uygulamanın nasıl davrandığını kayda alır.

| Girdi | Refactor öncesi | Refactor sonrası beklenen |
| --- | --- | --- |
| `['Bilim Kurgu', 'Aksiyon']` | `Türler: Bilim Kurgu, Aksiyon` | `Türler: Bilim Kurgu, Aksiyon` |
| `[]` | `Tür bilgisi yok` | `Tür bilgisi yok` |

Özellikle beklemediğin bir eski sonuç görürsen onu hemen “düzeltme”. Bu bilinen kullanıcı davranışı olabilir; bug olduğunu düşünüyorsan davranışı değiştiren ayrı bir iş olarak ele al.

## Helper gerçek akışta kullanılsın

Bir sonraki adımda tür satırı film detay özetinin parçası olsun. Burada yalnızca bu satırı helper'a çıkarıyoruz; başlığı ve puanı üretme biçimine dokunmuyoruz:

```ts
function genreLine(genres: string[]): string {
  if (genres.length === 0) return 'Tür bilgisi yok'
  return `Türler: ${genres.join(', ')}`
}

function detailSummary(movie: { title: string; genres: string[] }): string {
  return `${movie.title} — ${genreLine(movie.genres)}`
}
```

`detailSummary` helper'ı gerçekten çağırdığı için ortak kural uygulamanın kullandığı yerdedir. Sadece `genreLine` dosyasını ekleyip eski satırı yerinde bıraksaydık, test çıktısı değişmeyebilirdi ama tekrar da azalmamış olurdu. Bu ayrım, davranışı ve iç yapıyı ayrı ayrı düşünmemizi sağlar.

Her tekrarlanan JSX satırını yeni bir component'e çıkarmak gerekmez. Küçük bir markup parçasına yeni dosya, import ve props eklemek, tekrarın kendisinden daha fazla yük getirebilir. Birlikte değişmesi gereken kuralı ayır; sırf “bir component tek iş yapsın” diye her satırı bölme.

## Her küçük adımda aynı sonucu ara

Şimdi bütün bir ekranı yeniden yazmak yerine izlenecek sıraya bakalım. Önce detay özetinin üç temsilci çıktısını kaydedelim:

![Önce davranışı kaydet, her küçük iç değişiklikten sonra yeniden kontrol et](diagrams/refactor-adimlari.svg "Küçük ve kontrol edilebilir refactor adımları")

| Film | Türler | Başlangıçtaki özet |
| --- | --- | --- |
| Başlangıç | `Bilim Kurgu`, `Aksiyon` | `Başlangıç — Türler: Bilim Kurgu, Aksiyon` |
| Matrix | boş | `Matrix — Tür bilgisi yok` |
| Dövüş Kulübü | `Drama` | `Dövüş Kulübü — Türler: Drama` |

Ardından her satırdaki değişikliği tek tek yapıp önceki çıktıları tekrar karşılaştır:

| Adım | İçeride ne değişiyor? | Dışarıdan neyi kontrol ediyorsun? |
| --- | --- | --- |
| 1 | Üç filmin mevcut özetini kaydet | Dolu ve boş tür örnekleri belli |
| 2 | Tekrarlanan tür satırını `genreLine` fonksiyonuna taşı | Helper iki girdi türünde eski metni üretir |
| 3 | `detailSummary` içindeki kopyayı helper çağrısıyla değiştir | Üç filmin özeti başlangıçla aynı kalır |
| 4 | Eski tür satırı kopyalarını kaldır | Ortak kural artık tek yerde, gerçek akışta kullanılıyor |

Bir kontrol bozulursa son küçük adıma dönüp o değişikliğe bakabilirsin. Aynı anda fonksiyon adını, ekran metnini ve veri şeklini değiştirseydin hangi kararın sonucu bozduğunu ayırman çok daha zor olurdu. Küçük adımların amacı sadece kolay kod yazmak değil, hatanın kaynağını daraltmaktır.

## Test yeşilse ne biliyoruz?

**Davranış testi**, kullanıcının görebildiği sonucu kontrol eden testtir; örneğin boş türde ekranda `Tür bilgisi yok` yazmasını doğrular. Testlerin yeşil olması yalnızca çalıştırılmış kontrollerde beklenen sonucun geldiğini gösterir. Kodun tekrarsız olduğunu, doğru parçaya ayrıldığını ya da tüm olası girdilerin denendiğini kendiliğinden kanıtlamaz.

Bu yüzden iki ayrı soruya bakarız: “Eski sonuçlar hâlâ geliyor mu?” ve “İstenen iç düzen gerçekten kuruldu mu?” İkinci sorudaki maddelere **rubric** denir: kodun yapısını ve okunabilirliğini değerlendirmek için açıkça yazılmış ölçütler. Örneğin helper'ın var olması tek başına yetmez; çağıran kod onu kullanmalı ve eski kopyayı bırakmamalıdır.

Testin kapsamını da yaptığı işe göre seç. Küçük bir metin helper'ında dolu ve boş girdiyi ayrı ayrı kontrol etmek yeterli olabilir. Bir film detay akışında ise başlıkla tür satırının birlikte görünmesi de önem taşıyabilir. Yine de tek bir “bütün uygulama çalışıyor” beklentisi, hangi davranışın bozulduğunu açıklamaz; başarı ve sınır durumlarını ayrı gözlemek hatayı daha hızlı buldurur.

Bu, başlamadan önce her ekran için uzun bir test paketi yazman gerektiği anlamına gelmez. Küçük bir helper'ın girdisi ve çıktısı açıktır; birkaç örnekle kontrol edebilirsin. URL, ağ cevabı ve kullanıcı etkileşimi aynı akışta buluşan detay sayfasında ise otomatik kontroller daha değerli olur, çünkü elle her sırayı tekrar etmek kolayca eksik kalır.

:::mistake[Belirti: ekran aynı ama kopya hâlâ duruyor]
**Belirti →** Testler geçer, iki yerde aynı tür satırı üretilir. **Neden →** Testler çıktıyı kontrol eder; tekrar sayısını ölçmez. **Düzeltme →** Çağıran kodun helper'ı kullandığını ve eski kopyanın kalktığını ayrıca incele.
:::

:::mistake[Belirti: boş türde metin kayboldu]
**Belirti →** Türü olan filmler doğru, Matrix'in tür satırı boş. **Neden →** Helper yalnızca dolu listeyle karşılaştırıldı. **Düzeltme →** Refactor öncesi boş liste davranışını kaydet ve helper'da aynı sonucu koru.
:::

:::mistake[Belirti: düzenleme bitti, metin de değişti]
**Belirti →** `Tür bilgisi yok` yerine yeni bir mesaj görünür. **Neden →** İç düzen ve ürün davranışı tek değişiklikte karıştı. **Düzeltme →** Bu adımda eski metni koru; yeni metin isteğini ayrı ele al.
:::

## Özet

- Refactor, kodun iç düzenini değiştirir; dışarıdan gözlenen sonucu korur.
- Önce mevcut çıktıları, boş ve özel durumlar dahil, kaydet.
- Tek bir sorumluluğu taşı, çağıran kodu yeni helper'a bağla, sonra aynı sonuçları kontrol et.
- Davranış testleri sonucu; rubric ise kodun istenen yapısını değerlendirir.

**Yeni terimler:**

- **Refactor:** Dış davranışı korurken kodun iç düzenini iyileştirme.
- **Helper:** Ortak bir küçük işi adlandırıp yeniden kullanmak için yazılan fonksiyon.
- **Karakterizasyon testi:** Değişiklikten önce mevcut davranışı kayda alan test.
- **Davranış testi:** Kullanıcının görebildiği sonucu doğrulayan test.
- **Rubric:** Kod yapısını değerlendirmek için önceden belirlenmiş açık ölçütler.

**Kendini yokla:** Dolu tür listesi testi geçiyor ama boş liste `Tür bilgisi yok` yerine boş çıkıyor. Neyi kontrol edip düzeltirsin?  
*Cevap:* Boş listeyi mevcut davranışın bir parçası olarak test verisine ekler, helper'ın boş durumda eski metni döndürmesini sağlarım.

**Kendini yokla:** Bütün davranış testleri yeşil. Bu, tür satırının tek bir yerde üretildiğini kanıtlar mı?  
*Cevap:* Hayır. Çıktı doğru olabilir ama kopya kalmış olabilir; helper'ın gerçek çağrıda kullanıldığını ve eski kopyanın kaldırıldığını ayrıca incelerim.
