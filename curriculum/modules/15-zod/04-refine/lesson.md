---
title: "Alanlar arası kurallar"
minutes: 13
kind: concept
---

# Alanlar arası kurallar

:::pain[Problem]
Yorum metni dolu ve puan 1–5 aralığında; ama “spoiler var” seçilmiş, açıklama boş. Alanların tek tek kuralları geçiyor ve kullanıcıya gönderilmemesi gereken bir yorum gidiyor.
:::

## İlişkiyi kural olarak ifade et

Bir string'in boş olmaması veya sayının aralıkta kalması tek alanla ilgilidir. Bazı doğruluk koşulları ise nesnenin iki ya da daha fazla alanına birlikte bakar. “Teslim yöntemi kurye ise adres zorunlu” veya “başlangıç tarihi bitiş tarihinden önce olmalı” gibi durumlarda tek başına alan şeması yeterli değildir. Nesne doğrulandıktan sonra refine ile bütün değeri inceleyebilir, koşul tutmazsa bir issue üretebilirsin.

:::model[Tip derlemede, veri çalışma anında]
Dış değer önce şemayla parse edilir; TypeScript başarılı parse sonucunu tipli kullanır. Alanlar arası refine, çalışma anındaki sözleşmenin bir parçasıdır ve yalnızca şema çağrıldığında çalışır. Buradaki yeni karar, hata issue'sunun hangi alan yolunda görünmesi gerektiğidir.
:::

![Bilinmeyen dış verinin doğrulamayla tipli veriye ya da hataya ayrıldığını gösteren akış](diagram:zod-sinir)

Bir ilişki kuralını yazarken aşağıdaki kararlar nettir:

1. Alanların kendi tür ve basit sınır kurallarını önce alan şemalarında tut; nesne kuralı bunların yerine geçmez.
2. refine predicate'ine parse edilen nesnenin tamamı gelir. Predicate true ise ek koşul geçer, false ise Zod hata üretir.
3. options.error kullanıcıya ya da geliştiriciye gösterilecek anlaşılır metni belirler.
4. options.path, hatanın nesne içinde hangi alana bağlanacağını belirtir. RHF alan hatasına dönmesi gereken ilişki kuralında bu yol açıkça verilmelidir.
5. Kural tek bir hata üretmeye uygunsa refine kullan. Aynı parse'ta çok sayıda özel issue veya birden fazla alan yolu gerekiyorsa daha ayrıntılı issue üretme API'sini ayrıca değerlendir.

Bu modelde şema tek bir JSON nesnesi görür; path ise hatanın kullanıcı arayüzündeki konumunu belirler. Yanlış alan yolu, kuralı yanlış yapmaz ama formun mesajı beklenmeyen yere koymasına neden olabilir. Mesajın dili ile yolu farklı sorumluluklardır: biri neyin yanlış olduğunu, diğeri nerede gösterileceğini anlatır.

## Bir taslak yayınını adım adım değerlendir

Bir içerik editöründe gönderinin visibility alanı public ise summary en az 30 karakter olmalı. Taslak gizli kaldığı sürece bu koşul aranmaz. Örnek başka bir alan adı kullanıyor; önemli olan, predicate'in nesneyi beraber değerlendirmesi:

Kırık sürümde her alan yalnız kendi tipini sınar; iki değer arasındaki iş kuralı hiç yazılmadığı için kısa public özet kabul edilir:

```ts
const articleSchema = z.object({
  visibility: z.enum(['private', 'public']),
  summary: z.string(),
})
```

```ts check
import { z } from 'zod'

const articleSchema = z.object({
  visibility: z.enum(['private', 'public']),
  summary: z.string(),
}).refine(
  (article) => article.visibility !== 'public' || article.summary.trim().length >= 30,
  { path: ['summary'], error: 'Yayın için özet en az 30 karakter olmalı' },
)

const result = articleSchema.safeParse({ visibility: 'public', summary: 'Kısa' })
if (!result.success) console.log(result.error.issues[0].path)
```

| Adım | visibility | summary | Karar |
| --- | --- | --- | --- |
| 1 | private | boş metin | İlk koşul true olur; taslak kabul edilir |
| 2 | public | 36 karakter | İkinci koşul true; yayınlanabilir |
| 3 | public | Kısa | Predicate false; issue summary yoluna yazılır |

İlk adımın boş özeti kabul etmesi bu örneğin bilinçli iş kuralıdır. Eğer her makale için özet zorunlu olsaydı summary alanına min(1) gibi ayrı bir kural eklenirdi. İlişki refine'ı, alanın temel biçiminin yerini almaz; yalnızca alanların birlikte anlam kazandığı ek koşulu ekler.

## Baştan sona akış

1. Ham nesne JSON, form submit ya da başka bir kaynaktan gelir ve henüz doğrulanmamıştır.
2. articleSchema.safeParse(raw) çağrısı nesnenin alan türlerini denetler.
3. Alan şemaları geçerse refine, nesneyi alır ve koşulu hesaplar.
4. Predicate true ise başarılı sonuç, dönüştürülmüş/çıktı nesnesiyle döner.
5. Predicate false ise success false olur; issue mesajı ve path form katmanına aktarılır.

Bu sıralamayı bilmek, temel alan hatası ile ilişki hatasını ayırmana yardım eder. Örneğin summary sayı gönderildiyse z.string() önce başarısız olur; refine'ın string varsayımına dayanması güvenlidir. İlişki kuralını handleSubmit içinde tekrar yazmak ise aynı iş kararını şemadan çıkarır ve başka bir parse çağrısında uygulanmamasına yol açar.

path bir kullanıcı arayüzü ayrıntısı gibi görünse de veri sözleşmesinin pratik parçasıdır. Alan hatası gösteren form kütüphanesi, nesnenin genel hatasını otomatik olarak doğru input'a bağlayamaz. ['summary'] gibi yol, hata nesnesindeki alanı açıkça bildirir. İç içe yapı olsaydı yol da iç içe segmentlerden oluşurdu.

refine, değer dönüştürmek için değil doğru/yanlış koşulunu ifade etmek için kullanılır. Normalizasyon ihtiyacı varsa trim veya transform gibi şema işlemlerini seç. İki işi birbirine karıştırırsan predicate içinde yeni nesne üretmeye veya form değerlerini elle değiştirmeye başlayabilirsin. Koşulu okunur bir boolean ifadesi olarak tutmak bakımı kolaylaştırır.

İlişki kuralı her zaman tek bir yanlış değeri göstermez. Örneğin iki tarih sırası, iki sayının toplamı veya ödeme türü ile adres alanının birlikte geçerliliği değerlendirilebilir. Böyle bir kuralı kurarken önce domain dilinde cümle kur: “public ise özet gerekir.” Sonra bu cümlenin her dalını boolean olarak yaz. Ters koşulu erken true döndüren biçim genellikle daha okunur olur, çünkü istisna durumu ilk bakışta görünür.

Kuralın doğru çalışması için temel alan şemaları da sağlam olmalıdır. summary number geldiğinde trim çağrısı yapmaya çalışmamalısın; önce string şeması türü doğrular. Birden fazla refine koşulu varsa her biri tek bir iş kuralını açıklasın. Büyük bir predicate içinde tarih, rol ve durum kontrolünü birleştirmek, hangi koşulun hataya yol açtığını anlamayı zorlaştırır.

Error path'i issue'yu form kütüphanesine taşır. Bir kural iki alanı etkiliyorsa kullanıcıya hangi alanı düzeltmesi gerektiğini seç. Başlangıç ve bitiş tarihinde hatayı bitişe vermek çoğu kez mantıklıdır; çünkü kullanıcı erken bitiş değerini değiştirebilir. Ürün davranışı farklıysa path'i o karara göre belirle, kök hatayı yanlışlıkla alan hatası gibi göstermeye çalışma.

## Sık yanılgılar

:::mistake[Koşulu tek alanın özelliği yapmak]
Belirti → Özet, görünürlük private iken de zorunlu olur. Neden → Kural yalnız summary alanına min uzunluk olarak yazıldı. Düzeltme → Alanın temel kurallarını koru, görünürlükle ilişkili şartı nesnenin refine kuralında ifade et.
:::

:::mistake[Hata yolunu unutmak]
Belirti → Mesaj formun sonunda görünür ama ilgili input yanında görünmez. Neden → Refine hatası nesne kökünde kaldı. Düzeltme → RHF'de alan hatası isteniyorsa path'i ilgili alan olarak ver.
:::

:::mistake[Refine içinde tip kontrolünü yeniden yapmak]
Belirti → Predicate birden çok typeof kontrolüyle okunmaz hâle gelir. Neden → Öncesinde alan şemalarının çalıştığı göz ardı edildi. Düzeltme → Önce alan tiplerini şemada doğrula; ilişki predicate'inde yalnız iş kuralını anlat.
:::

:::sector
Ürün ekipleri çapraz alan kurallarını backend sözleşmesinde de tanımlar ve aynı kuralı frontend şemasında kullanıcıya erken geri bildirim olarak uygular. Hata yolu alanla ilişkilendirildiğinde klavye ve ekran okuyucu kullanan kişi sorunun nerede olduğunu öğrenir. Frontend kontrolü güvenlik sınırı değildir; sunucu da kendi verisini doğrular.
:::

## Özet

- Tek alan kuralları alan şemasında, alanlar arası koşullar nesne refine'ında durur.
- Predicate bütün nesneyi değerlendirir ve başarısızsa issue üretir.
- error açıklamayı, path hatanın ilişkilendirildiği alanı belirler.
- Refine doğrular; değeri dönüştürmez.

**Kendini yokla:** Bir alan yalnız başka alanın değerine bağlı olarak zorunluysa koşulu nereye koyarsın?  
*Cevap:* Nesnenin refine kuralına.

**Kendini yokla:** RHF hatası belirli input altında görünmüyorsa hangi refine seçeneğini kontrol edersin?  
*Cevap:* path değerinin o alanı gösterip göstermediğini.
