---
title: "URL stringini güvenli sayıya çevir"
minutes: 13
kind: concept
---

# URL stringini güvenli sayıya çevir

:::pain[Problem]
Arama sayfasına ?page=abc, ?page=0 ve ?archived=false geliyor. Number dönüşümü tek başına hatalı sayfayı durdurmuyor; Boolean dönüşümü de false metnini true yapıyor.
:::

## Dönüştürmek, doğrulamak ve varsayılan vermek

Tarayıcıdan gelen değerlerin çoğu metindir. URLSearchParams sayfa numarasını string olarak verir; bir checkbox veya query flag'i de metin olabilir. Uygulamanın geri kalanı sayı ve boolean bekler. Bu sınırda dönüşüm gerekir, fakat dönüşümün başarılı olması tek başına değerin iş kuralına uygun olduğunu göstermez. "abc" sayı olmaz, "0" sayıya dönüşse de sayfa numarası olarak kabul edilemez.

:::model[Tip derlemede, veri çalışma anında]
Dış değer parse edilene kadar unknown kabul edilir. Bu derste aynı çalışma zamanı sınırına bir adım eklenir: önce girdi biçimini dönüştür, sonra dönüştürülmüş sonucu doğrula. Başarılı çıktı tipi, dönüşümden sonraki değeri anlatır.
:::

![Bilinmeyen dış verinin doğrulamayla tipli veriye ya da hataya ayrıldığını gösteren akış](diagram:zod-sinir)

Coercion ve transform farklı amaçlara hizmet eder:

1. z.coerce.number() JavaScript Number dönüşümüne benzer biçimde girdiyi sayıya çevirmeyi dener. Sonuç NaN dahil olabilir; sonraki kurallar geçerliliği belirler.
2. .int(), .min(1) ve .max(...) dönüşmüş sayının iş kuralına uyup uymadığını denetler.
3. .transform(fn), daha önce parse edilmiş değeri başka bir çıktı şekline dönüştürür. Bu işlem input ve output tiplerini farklılaştırabilir.
4. .default(value), yalnızca girdi undefined ise varsayılanı devreye sokar. Boş stringi veya geçersiz sayıyı kendiliğinden düzeltmez.
5. z.coerce.boolean() Boolean(value) davranışını izler. Dolu "false" stringi truthy olduğu için true olur; metin bayraklarında z.stringbool() kullan.

Bir query parametresi eksik olduğunda URLSearchParams null verir; eksik olmayı şemaya hangi değerle aktaracağına sen karar verirsin. Örneğin sayfa numarası için eksik parametreyi başlangıç sayfası olarak yorumlamak makuldür. Geçersiz kullanıcı URL'sinde tüm ekranı çökertmek yerine safeParse sonucuna göre kontrollü ilk sayfaya düşebilirsin. Bu varsayılan ürün kararını gizlememeli: kullanıcı URL'yi düzenleyebilir, ama uygulama güvenli bir değerle açılmalıdır.

## Bir URL değerini adım adım izle

Kırık yaklaşımda dönüşüm sonucu aralık kontrolü olmadan kullanılır. Sayfa sıfır olur; flag'in dolu metni ise true görünür:

```ts
const page = Number(searchParams.get('page'))
const archived = Boolean(searchParams.get('archived'))
```

Doğru yolda sayıyı şema ile sınar, metin flag'ini kendi anlam kurallarıyla ayrıştırır ve başarısız girdide açık fallback seçersin.

```ts check
import { z } from 'zod'

const pageSchema = z.coerce.number().int().min(1)
const rawPage: string = '3'
const result = pageSchema.safeParse(rawPage)
if (result.success) console.log(result.data + 1)
```

İlk satırda şema hazırlanır, henüz veri dönüştürülmez. Parse çağrısı string "3" değerini Number dönüşümünden geçirir ve 3 elde eder. Sonra int kuralı kesir olmadığını, min kuralı da 1 veya üstünde olduğunu kontrol eder. Sonuç başarılıysa result.data number'dır ve matematiksel işlem yapılabilir. Eğer giriş "1.5" olsaydı dönüşüm yine 1.5 verirdi, fakat int kuralı reddederdi. "abc" NaN üretir ve sayı doğrulamasından kalır; "0" sayı olur ama min sınırında kalır.

| Ham URL | Dönüşüm | İş kuralı | Ekrandaki karar |
| --- | --- | --- | --- |
| page=3 | 3 | pozitif tam sayı | üçüncü sayfayı göster |
| page=1.5 | 1.5 | int koşulu yanlış | güvenli varsayılanı seç |
| page=0 | 0 | min(1) koşulu yanlış | güvenli varsayılanı seç |
| page=abc | NaN | sayı parse'ı başarısız | güvenli varsayılanı seç |
| parametre yok | null / seçilen varsayılan | ilk sayfa | birinci sayfayı göster |

Şemayı uygulama kararıyla birlikte kullan:

```ts
const parsedPage = pageSchema.safeParse(searchParams.get('page') ?? '1')
const page = parsedPage.success ? parsedPage.data : 1
```

Bu örnekte geçersiz girdinin ilk sayfaya düşmesi uygulamanın açık tercihidir. Başka bir üründe URL hatası göstermek daha uygun olabilir. Önemli olan NaN değerini filtreleme matematiğine, sayfa isteğine veya dizi indeksine taşımamaktır.

## Metin boolean'ını okumak

JavaScript'te Boolean('false') sonucu true'dur; çünkü string boştur denemez. URL'deki "false" kelimesi doğal dil anlamında false olsa da JavaScript bunu otomatik bilmez. Zod 4'ün z.stringbool() şeması yaygın metin karşılıklarını boolean'a çevirir. "true", "1", "yes", "on" ve "enabled" doğru; "false", "0", "no", "off" ve "disabled" yanlış kabul edilen biçimler arasındadır.

Stringbool da girişin geçerlilik politikasını seçmeni gerektirir. Kullanıcının elle değiştirdiği query parametresinde bilinmeyen metin hata olabilir. Basit filtrede bilinmeyen bir değeri false'a düşürmek ürün tercihi olabilir. Bunu safeParse ile açıkça uygula; geçersiz her girdiyi sessizce yanlış kabul etmek her güvenlik veya yetki değeri için doğru değildir.

z.input<typeof schema> şemaya gelen ham biçimi, z.output<typeof schema> başarılı parse sonrasındaki biçimi verir. Bu ayrım RHF'de string tutulan number input'un submit'te number olmasını anlatır. URL yardımcılarında da dış girdi string veya null'dır; uygulama içindeki page ise number'dır. Tipi elle ikisine birden string | number yapmak yerine dönüşüm sınırını görünür kıl.

Transform eklediğinde dönüşümün sırası önemlidir. Önce stringi trimleyip sonra boşluğu reddetmek başka, ham stringin uzunluğunu denetleyip sonra normalize etmek başkadır. Şemayı okuyan kişi her adımın hangi değer üzerinde çalıştığını anlayabilmelidir. Dönüşümden sonra bir şart varsa o şartın output aşamasında değerlendirildiğini açıklayan ayrı bir düzen seç.

Eksik parametre, boş parametre ve geçersiz parametreyi ayrı düşün. URL'de page hiç yoksa null okunur; page= ise boş string okunur. Number dönüşümü boş stringi sıfıra çevirebilir; ilk durumda sen varsayılan "1" değerini geçirirsin, ikinci durumda min kuralı fallback'e yönlendirir. Bu davranış çoğu listede kullanışlıdır ama her parametre için doğru değildir. URL hatası göstermek daha iyi bir ürün kararı olabilir.

Stringbool sözlüğünü de sadece beklenen iki kelimeden ibaret sanma. Zod 4, true/false dışında yes/no, on/off, enabled/disabled ve 1/0 biçimlerini de tanır. Sunucu veya bağlantı başka bir sözlük kullanıyorsa bu uyumsuzluğu adapter katmanında açıkça çöz. Stringbool'ın tanıdığı tüm değerler ürün arayüzünde görünmek zorunda değildir; kullanıcı URL'yi doğrudan düzenleyebilir.

Transform sırası gözlemlenebilir çıktıyı etkiler. Önce trim ve sonra min uygulamak, yalnız boşluk içeren girişi reddederken başarılı değerleri temizler. Yalnız min(1) kullanmak boşlukları karakter sayar ve gerçek anlamda boş bir başlığı kabul edebilir. Coercion'ı da mümkün olan en erken noktada yapıp aralık ve bütünlük kurallarını çıkan sayıya uygula. Parse zincirini okurken her aşamadaki değerin türünü sor.

## Sık yanılgılar

:::mistake[Coercion'ı doğrulama sanmak]
Belirti → page=0 ile boş bir sayfa açılır. Neden → String sayıya çevrildi, ama pozitif sınır kontrol edilmedi. Düzeltme → Dönüşümden sonra int ve min gibi iş kuralı kontrollerini ekle.
:::

:::mistake[Boolean ile kelimeyi çevirmek]
Belirti → URL'de archived=false iken arşiv filtresi açılır. Neden → Dolu string truthy'dir. Düzeltme → z.stringbool() ile metinsel boolean sözlüğünü parse et.
:::

:::mistake[Default'ın her hatayı örteceğini sanmak]
Belirti → Boş başlık varsayılan değere dönmez. Neden → default yalnızca undefined için çalışır. Düzeltme → Boş metni trim ve boş kontrolüyle ayrıca ele al.
:::

:::sector
Frontend ekipleri URL state'ini paylaşılabilir bir kullanıcı girdisi gibi ele alır. Parametreleri parse eder, geçersiz sayfa için ürünce belirlenmiş fallback uygular ve URL'yi mümkün olduğunca kararlı tutar. Boolean query değerleri için kabul edilen metin sözlüğünü belgeler; her geliştiricinin kendi Boolean(...) dönüşümünü yazmasına izin vermez.
:::

## Özet

- Coercion dönüştürür; int/min/max gibi kurallar sonucu doğrular.
- stringbool metin boolean'larını JavaScript truthiness kuralından ayrı okur.
- default yalnızca undefined girdide devreye girer.
- input ham biçimi, output parse edilmiş biçimi anlatır.

**Kendini yokla:** "abc" sayıya dönüştükten sonra neden yine reddedilmelidir?  
*Cevap:* Dönüşüm NaN üretir; bu geçerli pozitif tam sayı değildir.

**Kendini yokla:** Boolean("false") neden true verir?  
*Cevap:* Boş olmayan her string JavaScript'te truthy'dir.
