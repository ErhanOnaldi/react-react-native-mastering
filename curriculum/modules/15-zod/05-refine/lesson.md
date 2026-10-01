---
title: "Alanlar arası kurallar"
minutes: 14
kind: concept
---

# Bir kural iki alana bakıyorsa

Bir film kaydında `isPublished` ve `synopsis` alanları olsun. Özet tek başına metin mi diye bakmak kolay; ama yayınlanmış bir filmin özetinin daha uzun olmasını istiyorsan karar iki alana bağlıdır. Bunu tek alanın kuralına sıkıştırmak yerine, nesnenin tamamına bakan bir kural kurabilirsin.

## İlk ilişki kuralı

Zaten bildiğin nesne şemasına bir koşul ekleyelim. `refine`, şemadan geçen değeri bir koşulla daha denetler. Bu koşula **predicate** denir: doğru veya yanlış sonucu veren küçük bir fonksiyondur.

```ts check
import { z } from 'zod'

const releaseSchema = z.object({
  isPublished: z.boolean(),
  synopsis: z.string(),
}).refine((film) => !film.isPublished || film.synopsis.length >= 20)

const draft = releaseSchema.safeParse({ isPublished: false, synopsis: '' })
const published = releaseSchema.safeParse({ isPublished: true, synopsis: 'Yeterince uzun bir özet.' })
console.log(draft.success, published.success)
```

İki sonuç da `true` olur. İlk girdide film henüz yayımlanmadığı için kısa özet koşulu aranmaz. İkinci girdide özet yeterince uzundur. `||` ifadesi burada “yayımlanmamışsa kabul et, yoksa özet uzun olmalı” diye okunur.

![Bilinmeyen dış verinin doğrulamayla tipli veriye ya da hataya ayrıldığı akış](diagram:zod-sinir)

Alanların temel kontrolleri yine kendi yerinde kalır. `isPublished` boolean, `synopsis` string olmalıdır; nesne kuralı bunları değiştirmez. Ayrıca bu kural her özetin dolu olmasını istemiyor: yalnız yayımlanmış film için uzunluk şartı ekliyor.

## Kural bozulduğunda mesajı doğru yere bağla

Koşulun başarısız olduğunu Zod bir **issue** ile bildirir. Issue, “hangi değer hangi nedenle geçmedi?” bilgisini taşıyan bir hata kaydıdır. Kullanıcıya açıklama göstermek ve hatayı belirli bir alana bağlamak için refine seçeneklerine mesajı ve `path` değerini ver:

```ts check
import { z } from 'zod'

const releaseSchema = z.object({
  isPublished: z.boolean(),
  synopsis: z.string(),
}).refine(
  (film) => !film.isPublished || film.synopsis.trim().length >= 20,
  {
    path: ['synopsis'],
    error: 'Yayın için özet en az 20 karakter olmalı',
  },
)

const result = releaseSchema.safeParse({ isPublished: true, synopsis: 'Kısa' })
if (!result.success) console.log(result.error.issues[0].path)
```

Bu kez `success` değeri `false`, issue yolu ise `['synopsis']` olur. `error` metni neyin yanlış olduğunu söyler; `path` hatanın hangi alana ait olduğunu söyler. Form arayüzü `synopsis` input'unun altında mesaj gösterebilir.

## Önce alanlar, sonra aralarındaki ilişki

Sinema'da yayımlanan bir duyuruda özetin boş olmamasını ve belirli uzunluğa ulaşmasını isteyelim. Şema önce her alanın kendi biçimini kontrol eder; ancak bu kontroller başarılıysa ilişki kuralı çalışır.

```ts check
import { z } from 'zod'

const announcementSchema = z.object({
  status: z.enum(['draft', 'published']),
  synopsis: z.string().trim().min(1, { error: 'Özet gerekli' }),
}).refine(
  (announcement) => announcement.status !== 'published' || announcement.synopsis.length >= 20,
  {
    path: ['synopsis'],
    error: 'Yayınlanan duyurunun özeti en az 20 karakter olmalı',
  },
)

const result = announcementSchema.safeParse({ status: 'published', synopsis: 'Kısa' })
if (!result.success) console.log(result.error.issues[0].message)
```

`trim()` önce baştaki ve sondaki boşlukları kaldırır, `min(1)` boş özeti reddeder; refine ise yalnız yayınlanmış duyuruda 20 karakter ister. Taslak duyuruda kısa ama dolu özet geçebilir. Bir sayı `synopsis` yerine gelirse alanın `string` kontrolü başarısız olur; predicate sayı üzerinde metin işlemi yapmaya çalışmaz.

Bu kuralı bir form gönderiminde de adım adım izleyebilirsin:

| Adım | Girdi | Kontrol | Sonuç |
| --- | --- | --- | --- |
| 1 | `status: 'published'`, `synopsis: 'Kısa'` | Alan tipleri ve `trim().min(1)` | Alanlar geçer |
| 2 | Aynı değer | Predicate: yayınlandı mı veya özet en az 20 mi? | `false` |
| 3 | Aynı değer | Issue oluşturulur | Hata `synopsis` yoluna bağlanır |
| 4 | Aynı değer | Parse sonucu | `success: false`; geçerli çıktı yok |

Önce alan kurallarını çalıştırmak predicate'i sade tutar. İlişki kuralı sadece iş kararını anlatır; tür denetimini tekrar etmez. Ayrıca doğrulama `handleSubmit` içine yazılmazsa aynı şema formda, API sınırında veya başka bir parse çağrısında aynı kararı uygular.

Bir de sonucu değiştirerek izleyelim. `status` değerini `draft` yaparsan alan şemaları yine geçer, ama predicate'in ilk kolu `status !== 'published'` artık true olur. Özet kısa olsa da bütün kural geçer. `status` değerini `published` tutup özeti 25 karakter yaparsan ikinci kol da true olur. Yalnız yayınlanmış ve kısa özetli durumda iki kol da false kalır; işte yalnız o durumda issue oluşur. “Ne zaman hata çıkar?” sorusunu koşulu bu şekilde iki dala ayırarak cevaplayabilirsin.

## `path` hangi alanı seçer?

`path` kuralın doğru olup olmadığını değiştirmez; yalnızca üretilen issue'nun nesnedeki adresini belirtir. Örnekte `['synopsis']`, formun mesajı özet alanıyla ilişkilendirmesine yarar. Kural aslında `status` ile `synopsis` arasında olsa da kullanıcıdan değiştirmesini beklediğimiz alan özettir. İki tarih karşılaştırmasında da erken bitiş tarihini kullanıcı düzeltecekse hata yolunu bitiş tarihine vermek anlaşılır olur.

Alan hatası ile nesne geneli hatayı ayırmak da önemlidir. Kullanıcıya hangi input'u düzelteceğini söyleyebiliyorsan o alanı `path` ile seç. Birden fazla alan aynı anda değişmeli veya tek bir alanı sorumlu tutmak yanıltıcıysa hata nesne seviyesinde kalabilir; form bunu alanların üstünde ortak mesaj olarak gösterebilir. Mesajın metni “neden geçmedi?” sorusuna, yol ise “nerede düzeltmeliyim?” sorusuna cevap verir.

Bu yüzden `path`'i yalnızca formun görünüşünü düzenleyen bir ayrıntı sayma. Aynı issue daha sonra bir API cevabına, log'a veya başka bir arayüze aktarılabilir. Yolun doğru olması hatayı inceleyen kodun da alanı bulmasını sağlar. Ancak `path` yanlış seçilmişse Zod'un kuralı yine aynı biçimde reddeder; sorun reddetme kararında değil, hatanın nereye bağlandığındadır.

Predicate'i yazmadan önce kuralı gündelik bir cümleye çevir: “Yayımlanmış duyurunun özeti en az 20 karakter.” Sonra bu cümledeki istisnayı bul: taslakta uzunluk şartı yok. Kodun iki parçası bu iki durumu ayrı ayrı göstermeli. Bir ay sonra kural değişirse, bu cümle ile koşulu karşılaştırmak hangi kısmın değişmesi gerektiğini görmeyi kolaylaştırır.

## Sık karşılaşılan hata

Yayımlanmamış içerik için şartı atlamak gerektiğinde koşulu ters yazmak kolaydır:

```ts check
import { z } from 'zod'

const brokenReleaseSchema = z.object({
  isPublished: z.boolean(),
  synopsis: z.string(),
}).refine((film) => film.isPublished && film.synopsis.length >= 20)
```

Belirti: kısa taslaklar da reddedilir. Sebep: `&&` ifadesi iki koşulun da doğru olmasını ister; taslakta `isPublished` false'tur. Düzeltme, “taslaksa geçsin, değilse özet uzun olsun” demektir:

```ts check
import { z } from 'zod'

const synopsisRule = z.object({
  isPublished: z.boolean(),
  synopsis: z.string(),
}).refine((film) => !film.isPublished || film.synopsis.length >= 20)

console.log(synopsisRule.safeParse({ isPublished: false, synopsis: '' }).success)
```

Burada taslak kabul edilir. `refine` yalnızca bir koşulu doğrular; metni temizlemek veya başka bir değere çevirmek için kullanma. Dönüşüm gerekiyorsa onu ilgili şema işlemiyle yap.

## Zihinde tut

- Bir alanın türü ve kendi sınırları alan şemasında; birden çok alana bağlı kural nesnenin `refine` bölümünde durur.
- Predicate `true` verirse ek kural geçer; `false` verirse Zod issue üretir.
- `error` mesajı, `path` ise hatanın ilişkilendirildiği alanı belirler.
- Alan şemaları önce çalıştığı için predicate içindeki değerlerin türleri bellidir.

**Yeni terimler:**

- **predicate:** Doğru/yanlış sonucu veren koşul fonksiyonu; `refine` bu sonucu ek kuralın geçip geçmediğine karar vermek için kullanır.
- **issue:** Parse sırasında oluşan hata kaydı; mesajı ve varsa alan yolunu taşır.

**Kendini yokla:** Taslakta özet şartı aranmıyor, ama yayımlanmış içerikte aranıyor. Kuralı nereye koyarsın?  
*Cevap:* İki alanı beraber gören nesne şemasının `refine` koşuluna.

**Kendini yokla:** Mesaj var ama form bunu `synopsis` alanıyla ilişkilendirmiyorsa hangi seçeneği incelersin?  
*Cevap:* `path` değerinin `['synopsis']` olup olmadığını.
