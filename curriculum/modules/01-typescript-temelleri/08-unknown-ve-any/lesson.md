---
title: "unknown ve any"
minutes: 15
kind: concept
---

# unknown ve any

:::pain[Problem]
`res.json()` sonucunu film sanıp doğrudan `raw.title` okudun. Sunucu `{ status_code: 7 }` gibi hata gövdesi döndürdüğünde başlık `undefined` oluyor; derleyici de `any` yüzünden seni uyarmıyor.
:::

## Derleme zamanı ile çalışma zamanını ayır

:::model[Derleme ve çalışma zamanı ayrıdır]
TypeScript tipleri derleyiciye kodu denetletir; JavaScript çıktısında bu tip açıklamaları silinir. Ağdan gelen JSON çalışma zamanında geldiği için yalnızca `as Movie` yazmak veriyi doğrulamaz. Şimdi ilk modelin yeni bağlamı, tipli koddan gelen JSON'un uygulama sınırında yeniden belirsiz kabul edilmesidir.

![TypeScript tiplerinin derleme ve çalışma anındaki ayrımını gösteren ortak model](diagram:ts-derleme-ve-calisma)
:::

`any` derleyiciye “bu değerin her özelliğine güven” der. `unknown` ise “şeklini bilmiyorum; kullanmadan önce kanıtla” der. Dış veri için `unknown` daha güvenlidir, çünkü kontrol yapmadan özelliğe erişmeyi engeller.

## Kontrol zinciriyle güven kazan

:::model[Narrowing ile olasılıkları ayır]
Bir koşul, union içindeki bazı seçenekleri eler ve sonraki satırların tipini daraltır. Önceki derste bu kontrol akışını `string | null` üzerinde kurdun; burada aynı kuralı şekli bilinmeyen bir değerin alanında kullanıyoruz.

![Kontrol akışının unknown ve union değerlerini daraltmasını gösteren ortak model](diagram:ts-narrowing-akisi)
:::

Küçük bir alanı sırayla denetlemek yeterli olabilir. `unknown` yalnızca atama açısından esnektir: başka bir tipe kontrolsüz atayamaz, alan okuyamaz veya fonksiyon gibi çağıramazsın. `any` ise bu kontrolleri atlar, bu nedenle yanlış property adı da denetimden geçebilir.

```ts check
function titleFrom(raw: unknown): string | null {
  if (typeof raw !== 'object' || raw === null || !('title' in raw)) return null
  if (typeof raw.title !== 'string') return null
  return raw.title
}
void titleFrom
```

Kesin sıra önemlidir. Önce nesne olup null olmadığını doğrula; sonra alanın varlığını; ardından alanın türünü. Her kontrol ayrı bir iddiayı kanıtlar. Bu fonksiyon tüm film sözleşmesini değil, yalnızca okuyacağı `title` alanını doğrular.

## Satır satır iz sürelim

Girdi `{ title: 'Yol' }` olsun. Satır satır tip ve değer takibi şöyle ilerler:

| Satır / kontrol | Çalışma zamanı sonucu | `raw` / `raw.title` tipi | Sonraki adım |
| --- | --- | --- | --- |
| Fonksiyon girişi | Nesne alınmış olabilir | `unknown` | Henüz alan okunamaz |
| `typeof raw === 'object'` | true | `object` olasılığı | Null kontrolüne devam |
| `raw === null` | false | null olmayan nesne | Alan araması güvenli |
| `'title' in raw` | true | Alan mevcut, değeri henüz `unknown` | Alan türünü denetle |
| `typeof raw.title === 'string'` | true | `string` | Dönüşe izin ver |
| `return raw.title` | `'Yol'` | `string` | Fonksiyon sözleşmesi karşılanır |

Girdi `{ title: 12 }` olsaydı son kontrol false olur, `null` dönerdi. `{ status_code: 7 }` değerinde `in` kontrolü alanı bulamaz; null veya sayı gibi nesne olmayan değerlerde ise ilk koşul reddeder. Her dalın sonucunu ayrı yazmak, “nesne gibi görünüyor” varsayımından daha güvenlidir.

İlk koşulda `typeof raw === 'object'` true, `raw === null` false, `'title' in raw` true olur; `||` koşulunun tamamı false olduğundan devam eder. İkinci koşul `typeof raw.title === 'string'` true bulur. Son satırda dönüş tipi artık `string` olduğundan başlık güvenle döner.

Girdi `{ status_code: 7 }` ise nesne ve null kontrollerinden geçer, ancak `'title' in raw` false olur. İlk `if` true olur ve `null` döner. `{ title: 123 }` ise alan bulunur ama ikinci kontrol başarısız olur. Hiçbir dal `as` ile zorlanmadığı için hatalı veri güvenli kabul edilmez.

## Önce derleyici hatası, sonra güvenli kontrol

Kontrolsüz property erişimi reddedilir:

```ts
function unsafeRead(raw: unknown): string {
  return raw.title
}
```

Derleyici hatası: `TS18046: 'raw' is of type 'unknown'.` Türkçesi: değerin şeklini henüz bilmiyorsun; `title` alanının varlığını varsayamazsın. Derleme hatasını `any` ya da `as` ile susturmak sorunu çalışma zamanına taşır.

`any` ile `unknown` arasındaki farkı bir atama zincirinde de görebilirsin. `any` bir kere içeri girdikten sonra erişimler ve dönüş değerleri tip denetiminden kaçabilir; `unknown` ise kontrol yapılana kadar kapalı kalır. Bu nedenle `any` kısa vadede kolay görünse de belirsizliği çağıran dosyalara taşır.

```ts check
const loose: any = { titel: 'Yanlış alan adı' }
const uncheckedTitle: string = loose.title
const cautious: unknown = { title: 'Yol' }
let safeTitle: string = 'Başlık yok'
if (typeof cautious === 'object' && cautious !== null && 'title' in cautious) {
  if (typeof cautious.title === 'string') safeTitle = cautious.title
}
void uncheckedTitle; void safeTitle
```

`uncheckedTitle` için derleyici itiraz etmez; çalışma zamanında değeri `undefined` olabilir. `cautious` üzerindeki kontroller ise `safeTitle` atamasından önce string kanıtı ister. `unknown` belirsizliği bir noktada çözmeye zorlar; `any` belirsizliği görünmez yapar.

## Tip iddiası kontrol değildir

```ts
type Film = { title: string }
function unsafeTitle(raw: unknown): string {
  const film = raw as Film
  return film.title
}
```

Bu örnek derlenebilir, fakat `{ status_code: 7 }` girdisini değiştirmez. `as Film`, eksik `title` alanı eklemez; yalnızca TypeScript denetimini susturur. Doğru yaklaşım, sınırda gerekli alanı gerçek kontrollerle ayırmaktır.

:::mistake[`any` ile hatayı gizlemek]
Belirti → API hata nesnesinden `undefined` başlık ekrana taşınıyor. Neden → `any` her erişimi kabul ettirdi. Düzeltme → Ham cevabı `unknown` olarak ele al ve gerekli alanları denetle.
:::

:::mistake[`as` ifadesini doğrulama saymak]
Belirti → Eksik alanlı cevap uygulamanın sonraki satırında çöküyor. Neden → Tip iddiası runtime'da veri incelemedi. Düzeltme → Koşul veya şema ile gerçek doğrulama yap.
:::

:::mistake[Alan varlığını alan tipine eşitlemek]
Belirti → `title` sayı geldiğinde metot çağrısı hata veriyor. Neden → `in` yalnızca property'nin varlığını kanıtlar. Düzeltme → `typeof raw.title === 'string'` gibi değer kontrolü ekle.
:::

## Alan kontrolünden şema doğrulamaya

Tek bir alanı okumak için açık `typeof`, null ve `in` kontrolleri yeterli olabilir. Gerçek API cevabında alanlar çoğalınca eksik kontrol bırakmak kolaylaşır: başlık doğru olsa bile `id`, tarih veya nested nesneler yanlış biçimde gelebilir. Zod gibi bir schema validation aracı, beklenen runtime şeklini tek bir şema olarak tanımlar ve gelen değeri gerçekten parse eder.

```ts check
import { z } from 'zod'

const titleSchema = z.object({ title: z.string() })
const raw: unknown = { title: 'Yol' }
const result = titleSchema.safeParse(raw)
const title = result.success ? result.data.title : null
void title
```

`safeParse` bir başarı/hata sonucu üretir; `result.success` kontrolünden sonra TypeScript başarı dalındaki veriyi şemadan çıkarılmış `{ title: string }` tipiyle tanır. `parse` da doğrular, ancak geçersiz veride exception fırlatır. Bu örnekte yalnızca başlık denetleniyor; ürünün tüm API sözleşmesini temsil ettiği iddia edilmiyor. Bir schema alanı zorunlu kılar; `.optional()` ile eksik alanı, `.nullable()` ile `null` değerini ayrıca kabul edebilirsin. Bu iki seçenek farklı JSON şekilleridir. Daha ileride Zod ile nested alanlar ve form girdileri de aynı sınır yaklaşımıyla ele alınacak.

:::sector
Takımlar dış sınırdan gelen gövdeyi içerideki tipli modele doğrudan eşitlemez. Küçük ve elle yazılmış kontrol tek alanı kullanmak için yeterli olabilir; geniş API sözleşmelerinde aynı kontroller çoğalınca çalışma zamanı şeması daha güvenilir olur.
:::

Doğrulama kararını verinin uygulamaya nereden girdiğine göre ver. `JSON.parse` ve `Response.json()` gibi işlemler çalışma zamanında JavaScript değeri üretir; sunucunun TypeScript tiplerini bilmesi mümkün değildir. Bu nedenle cevabı doğrudan uygulama tipine eşitlemek yerine, taşıma katmanının hemen yanında doğrulamak yararlıdır. Doğrulanan değeri sonra uygulama içinde tipli biçimde taşımak, aynı kontrolü her bileşende tekrarlamayı önler.

Şema kütüphanesi doğrulamayı kendiliğinden her yerde çalıştırmaz; `safeParse(raw)` veya `parse(raw)` çağrısını sınır kodunda yapman gerekir. Şema başarılıysa çıkan veri hem runtime kontrolünden geçmiş hem de TypeScript tarafından çıkarılmış tipe sahiptir. Hata sonucu kullanıcıya ham teknik ayrıntıyı göstermek yerine uygulamanın hata politikasına dönüştürülebilir. Böylece UI, bozuk veriyle çalışmaya zorlanmaz.

JSON'da olmayan alanla `undefined` almak da başarısız doğrulama sayılmalıdır. `unknown` yaklaşımı alanı okumadan önce varlığını kanıtlamayı ister; ama uygulamanın iş kuralını tek başına bilemez. Örneğin başlığın boş string olmaması gerekiyorsa `typeof raw.title === 'string'` kontrolü teknik türü kanıtlar, doluluk kuralı için `raw.title.length > 0` gibi ayrı kontrol gerekir. Tür doğrulama ile iş kuralı doğrulamayı birbirinin yerine koyma.

Şema doğrulaması genellikle veriyi dönüştürmekle de karıştırılır. Buradaki Zod şeması `title` metnini kabul eder ve tipini çıkarır; `as` gibi kör bir iddia değildir. Dönüşüm veya normalizasyon istiyorsan şemada bunu ayrıca tanımlarsın. Her sınırda tek bir soruyu cevapla: ham değer uygulamanın ihtiyaç duyduğu sözleşmeyi gerçekten karşılıyor mu?

Dış veriyi doğrulama kapsamını ihtiyaca göre seç: bileşen yalnızca başlığı gösterecekse bu alanı doğrula; tam bir film kartı oluşturacaksa kullanılan tüm alanları kapsayan şema kur. Gereksiz alanları zorunlu kılmak da hatalı cevapları doğru cevap gibi ele almak kadar kırılgandır.

## Özet

- TypeScript tipleri derleme zamanı içindir; ağ verisini değiştirmez.
- `any` denetimi kapatır; `unknown` kullanım öncesi kanıt ister.
- Nesne, null, alan varlığı ve alan tipi ayrı kontrollerdir.
- `as` bir tip iddiasıdır, runtime doğrulaması değildir.

Kendini yokla: `unknown` değerde `raw.title` kontrolsüz okunabilir mi? Cevap: Hayır; önce şekli ve alanı daraltmalısın.

Kendini yokla: `as Film` eksik alanı ekler mi? Cevap: Hayır; JavaScript çıktısında tip iddiası yoktur.
