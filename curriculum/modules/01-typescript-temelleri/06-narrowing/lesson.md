---
title: "Narrowing ile güvenli dallanma"
minutes: 16
kind: concept
---

# Narrowing ile güvenli dallanma

:::pain[Problem]
Bir filmde `poster_path` null geldiğinde `.startsWith()` çağrısı uygulamayı durdurabilir. Başka bir kartta puan `0` olduğu halde `if (vote)` dalı çalışmadığı için gerçek veri kaybolur.
:::

## Kontrol, olasılık kümesini küçültür

Union tip, değişkenin alabileceği olasılıkları taşır. Kodda bu olasılıklardan birini sınadığında TypeScript sonraki satırlarda kalan seçenekleri bilir. Bu işleme narrowing denir: kontrol değeri dönüştürmez, yalnızca hangi işlemlerin güvenli olduğunu gösterir.

![Kontrol akışının union tipini dallar içinde daraltmasını gösteren ortak model](diagram:ts-narrowing-akisi)

1. Bir değişken dal öncesinde birden fazla tipte olabilir; örneğin `string | null`.
2. `typeof`, `=== null`, literal eşitliği ve `in` gibi kontroller olasılıkları ayırır.
3. Kontrolün her dalında TypeScript elenen seçenekleri çıkarır.
4. Bir dal `return` ile biterse sonraki kodda yalnızca kalan olasılıklar vardır.
5. Tip kontrolünün kabul etmesi, iş kuralının doğru olduğu anlamına gelmez: `if (vote)` geçerlidir ama 0'ı yok sayabilir.

```ts check
function posterLabel(path: string | null): string {
  if (path === null) return 'Poster yok'
  return path.startsWith('/') ? path : `/${path}`
}
void posterLabel
```

| Sıra | Kontrol | `path` tipi | Sonuç |
| --- | --- | --- | --- |
| Çağrı | fonksiyon başı | `string \| null` | İki olasılık var |
| Koşul | `path === null` | `string \| null` | Null ise ilk return |
| Devam | koşul false | `string` | Null elendi |
| Metot | `startsWith` | `string` | Çağrı güvenli |

Erken dönüş, null dalını fonksiyondan çıkarır. Bu hem gerçek JavaScript kontrolüdür hem de derleyiciye kalan tip bilgisidir.

## Boş değerlerin anlamı farklıdır

Truthy/falsy kontrolü `0`, `''`, `false`, `null` ve `undefined` değerlerini aynı sepete atar. Ürün kuralı yalnızca “puan sıfır mı?” diyorsa `vote === 0` yaz. `if (vote)` sıfır puanı da yok sayar.

`??` yalnızca `null` ve `undefined` için sağdaki varsayılanı seçer. `||` bütün falsy değerlerde seçer. Boş tarih metnini de eksik sayacaksan `??` tek başına yetmez; `date === ''` gibi açık bir koşul gerekir. Optional chaining (`?.`) nullish alıcıda erişimi durdurup `undefined` verir, fakat kullanıcıya ne gösterileceğine karar vermez.

```ts check
const score: number = 0
const voteLabel = score === 0 ? 'Henüz oy yok' : score.toFixed(1)
const date: string = ''
const dateLabel = date === '' ? 'Tarih yok' : date.slice(0, 4)
const optionalName: string | null = null
const name = optionalName ?? 'İsimsiz'
void voteLabel; void dateLabel; void name
```

## Bilinmeyen veriyi sırayla denetle

JSON cevabının şeklini bilmiyorsan `unknown` kullan. Bu değer üzerinde alan okuyamazsın; önce her adımda kanıt toplarsın. Nesne kontrolünde null kontrolü de gerekir, çünkü `typeof null` sonucu `'object'` olur.

```ts check
function titleFrom(value: unknown): string {
  if (typeof value !== 'object' || value === null || !('title' in value)) {
    return 'Başlık yok'
  }
  if (typeof value.title !== 'string') return 'Başlık yok'
  return value.title
}
void titleFrom
```

İzleme sırası: önce nesne mi, sonra null mı, sonra `title` alanı var mı, son olarak alan string mi? `in` yalnızca alanın varlığını kanıtlar; türünü kanıtlamaz. Son kontrol bundan dolayı gereklidir.

## if, else ve erken dönüşte olasılıkları izle

Narrowing, değişkenin değerini dönüştürmez; TypeScript'in o satır için kabul ettiği tip kümesini değiştirir. Her dalı ayrı düşün: koşulun doğru kolunda koşulun kanıtladığı şey, yanlış kolunda ise onun dışladığı şey geçerlidir. `return` ile biten dal artık aşağıdaki satırlara ulaşamayacağı için o dalın olasılığı devam akışından çıkar.

```ts check
function describeCount(count: number | null): string {
  if (count === null) return 'Henüz sayım yok'
  if (count === 0) return 'Sıfır kayıt'
  return count.toFixed(0)
}
void describeCount
```

| Satır / akış | `count` için bilinen tip | Sonuç |
| --- | --- | --- |
| Fonksiyon girişi | `number \| null` | İki olasılık var |
| `count === null` doğru kolu | `null` | Metin döner, fonksiyon biter |
| İlk `if` sonrasındaki akış | `number` | `null` dalı erken dönüşle elendi |
| `count === 0` doğru kolu | `number` (değeri 0) | Sıfır özel olarak ele alınır |
| İkinci `if` sonrası | `number` ve bu akışta 0 değil | `toFixed` güvenli |

`else` de aynı bilgiyi dal yapısıyla görünür kılar. `if (x)` truthy/falsy değerleri ayırır; bu sayı için `0` ile diğer sayıları, metin için `''` ile dolu metinleri de birbirinden ayırabilir. Derleyicinin bu testi kabul etmesi, ürün anlamı bakımından doğru test olduğu anlamına gelmez. “Oy yok” yalnızca sıfırsa `vote === 0` niyeti daha açık yazar.

## Nullish operatörlerden sonra tip ve değer

`??`, sol taraf yalnız `null` veya `undefined` olduğunda yedek değeri seçer. `||` ise `0`, `false` ve `''` dahil bütün falsy değerlerde sağ tarafa geçer. Optional chaining (`?.`) alıcı nullish ise erişimi durdurup `undefined` üretir; nullish olmayan dalda gerçek özelliğe erişir. Bunlar farklı runtime davranışlarıdır ve derleyici de sonuç tiplerini buna göre çıkarır.

```ts check
type Entry = { title: string }
function titleLabels(entry: Entry | null): [string | undefined, string] {
  const optionalTitle = entry?.title
  const fallbackTitle = entry?.title ?? 'Başlıksız'
  const blankDate: string | null = ''
  const nullishDate = blankDate ?? 'Tarih yok'
  const orDate = blankDate || 'Tarih yok'
  void nullishDate; void orDate
  return [optionalTitle, fallbackTitle]
}
void titleLabels
```

| İfade | Girdi bilgisi | Değer | Çıkan tip |
| --- | --- | --- | --- |
| `entry` | açık anotasyon | `null` | `Entry \| null` |
| `entry?.title` | nullish alıcıda erişim durur | `undefined` | `string \| undefined` |
| `entry?.title ?? 'Başlıksız'` | `undefined` yedekle değiştirilir | `'Başlıksız'` | `string` |
| `blankDate ?? 'Tarih yok'` | boş string nullish değil | `''` | `string` |
| `blankDate \|\| 'Tarih yok'` | boş string falsy | `'Tarih yok'` | `string` |

Son iki satırın tipi aynı, çalışma zamanı değeri farklıdır. Sadece tip tablosuna bakıp iş kuralını çıkaramazsın; boş string'in anlamını sen açıkça belirlemelisin. Eğer boş metin de “yok” ise `date === ''` kontrolü kullan ya da iş kuralına uygun bir ifade kur.

## `unknown` değerini kontrol zinciriyle daralt

`typeof value === 'object'` kontrolü `null` değerini dışlamaz; JavaScript'te `typeof null` sonucu `'object'` olur. Nesne alanına güvenli erişim için önce nesne ve null durumunu, sonra alan varlığını, sonra alanın türünü denetle. Her kontrol yeni bir kanıt ekler, fakat bir alanın varlığı onun doğru tipte olduğunu tek başına göstermez.

Önce bu erişim derlenmez:

```ts
function titleFrom(value: unknown): string {
  return value.title
}
```

Derleyici hatası: `TS18046: 'value' is of type 'unknown'.` Türkçesi: `unknown` değerinin şeklini kanıtlamadan property okuyamazsın. Kontrollerden sonra doğru örnek şöyle çalışır:

```ts check
function titleFrom(value: unknown): string {
  if (typeof value !== 'object' || value === null || !('title' in value)) {
    return 'Başlık yok'
  }
  if (typeof value.title !== 'string') return 'Başlık yok'
  return value.title
}
void titleFrom
```

| Kontrol sırası | Örnek değer `{ title: 'Yol' }` | `value` tipi / kanıt |
| --- | --- | --- |
| Giriş | Nesne | `unknown`; henüz işlem yapılamaz |
| `typeof value !== 'object'` | false | Bu akışta nesne olasılığı kaldı |
| `value === null` | false | `null` elendi; null olmayan nesne |
| `'title' in value` | true | Nesnede `title` alanı var |
| `typeof value.title !== 'string'` | false | Alan string olarak daraldı |
| `return value.title` | `'Yol'` | Dönüş `string` sözleşmesine uyar |

`{ title: 12 }` geldiğinde ilk kontrol grubundan geçilir; son `typeof` testi alanın string olmadığını bulur ve güvenli yedek döner. `5` veya `null` ise nesne koşulunda reddedilir. Koşullar soldan sağa kısa devreyle yürüdüğü için null iken `'title' in value` değerlendirilmez.

## Kırık çağrıyı güvenli hale getir

Null olasılığı elenmeden metot çağırmak hem tip kontrolünde hata verir hem de çalışma zamanında çökebilir.

```ts
function normalizePath(path: string | null): string | null {
  return path.startsWith('/') ? path : `/${path}`
}
```

```ts check
function normalizePath(path: string | null): string | null {
  if (path === null || path === '') return null
  return path.startsWith('/') ? path : `/${path}`
}
void normalizePath
```

:::mistake[0'ı eksik değer saymak]
Belirti → Puan 0 iken yanlış etiket görünür. Neden → Truthy kontrolü sıfırı falsy sayar; tip açısından geçerli kontrol iş açısından yanlış olabilir. Düzeltme → `score === 0` gibi açık koşul yaz.
:::

:::mistake[Null'dan önce metoda erişmek]
Belirti → `Cannot read properties of null` hatası. Neden → Union'ın null olasılığı elenmedi. Düzeltme → Erken null dönüşü veya uygun nullish kontrolü ekle.
:::

:::mistake[Boş metin için `??` kullanmak]
Belirti → Tarih boş olduğu halde boş etiket kalır. Neden → `''` nullish değildir. Düzeltme → Boş metni ayrıca denetle; yalnızca null ve undefined için yedek seçmek istiyorsan `??` kullan.
:::

:::mistake[Object kontrolünde null'ı unutmak]
Belirti → `value.title` erişimi çöker. Neden → `typeof null === 'object'`. Düzeltme → `value !== null` koşulunu ekle.
:::

:::sector
API ve form sınırlarında ekipler boş, null ve sıfır değerlerini ayrı sözleşmelerle ele alır. Açık kontroller kod incelemesinde bu farkı gösterir; daraltılmış tipler de her dalda güvenli işlemleri sınırlar.
:::

## Kontrol akışı derleyicinin sınırları

Daraltma, TypeScript’in kontrol akışını takip edebildiği noktalarda oluşur. Yerel bir değişken için doğrudan yapılan `typeof`, null karşılaştırması, literal eşitliği veya `in` kontrolü çoğunlukla net kanıt sağlar. Bu kanıt belirli bir kod yolunda geçerlidir; koşul dışındaki bütün program için değerin tipi değişmiş sayılmaz. Dolayısıyla bir koşuldan sonra farklı dala geçerken hangi kontrolün hâlâ doğru olduğunu yeniden oku.

TypeScript her runtime gerçeğini bilemez. Bir nesnenin property’sinin bulunması, getter’ın sorunsuz çalışacağını veya içerideki verinin iş kuralına uyduğunu garanti etmez. `in` yalnızca property varlığı için statik kanıt sağlar; değer türünü ayrıca kontrol etmek gerekir. Aynı şekilde `typeof value === 'object'` tarih, dizi ve başka nesneleri tek başına ayırmaz. Beklenen yapı daha karmaşıksa alan alan kontrol ya da şema doğrulaması gerekir.

`?.` ve `??` de TypeScript'in tipini daraltıp bir sonuç üretir, fakat orijinal değişkeni kalıcı olarak daraltmaz. `const name = person?.name` sonucunun tipi `string | undefined` olabilir; bu, `person` değişkeninin sonraki satırda null olamayacağını göstermez. `name ?? 'İsimsiz'` ise yeni ifadenin tipini `string` yapar, çünkü undefined olasılığını yedekle kapatmıştır. Bu ifadeleri yeni değer üretimi olarak düşünmek, değişkenin tipi neden önceki haliyle kaldı sorusunu açıklar.

Aşağıdaki birleşik akışta eşitlik dalları ve kalan değer birlikte görünür: `status: 'ready' | 'loading' | null`. `status === 'ready'` dalında değer kesin `'ready'`; `else if (status === 'loading')` dalında ikinci koşuldan sonra kesin `'loading'`; son `else` dalında ise kalan tek olasılık `null` olur. Derleyici dalları sırayla çıkardığı için son kolda ayrıca null kontrolü gerekmez. Bu çıkarım ancak union'ın seçenekleri gerçekten eksiksiz yazılmışsa geçerlidir.

Atanabilirlik de narrowing ile birlikte çalışır. Daraltılmış `string` değeri string bekleyen fonksiyona verilebilir; union'ın daraltılmamış `string | null` hali aynı yere verilemez, çünkü olası null üyesi hedef sözleşmeyi karşılamaz. TypeScript, kaynağın mümkün değer kümesinin hedef tip tarafından kapsandığını arar. Kontrol, kaynağın mümkün kümesini küçültür ve böylece atamayı güvenli hale getirir.

Bir iddiayı zorla kabul ettirmek (`as string`) bu akışta kanıt oluşturmaz. `as`, derleyiciye sorumluluğu senin aldığını bildirir ve JavaScript çıktısında kontrol eklemez. Daraltma ise `typeof` veya eşitlik gibi gerçek koşullara dayanır; koşul çalışır, yanlış veri dalı runtime'da da ayrılır. Kod incelemesinde bu yüzden önce kontrolün hangi olasılığı elediğini sor, ardından kalan tipin hedef işlem için yeterli olup olmadığını denetle.

Truthy kontrolünün derleyiciye verdiği bilgiyle iş kuralına verdiği anlamı ayırmak özellikle sayı ve metinde önemlidir. `if (score)` dalında TypeScript `0` olasılığını dışlayabilir; fakat bu koşul `null`, `undefined`, sıfır ve `NaN` gibi falsy değerleri aynı dala toplar. Uygulama yalnızca sıfırı ayırmak istiyorsa `score === 0` yaz; nullish değerleri ayırıyorsa `score == null` (null ve undefined için) veya ayrı kontroller kullan. Okuyucu koşulun ürün anlamını doğrudan görebilmelidir.

Benzer ayrım `||` ve `??` için geçerlidir. `count || 10`, `count` sıfırken on değerini verir; bu belki sayfalama varsayılanında istenmez. `count ?? 10` sıfırı korur, yalnızca `null` ve `undefined` için yedeği seçer. Her iki ifadenin sonucu sayı olabilir; farklı olan, gerçek değeri seçen runtime koşuludur. Bir tipin aynı çıkması ifadelerin davranışlarının aynı olduğu anlamına gelmez.

Bir `if` dalından sonra değişkenin tipi her zaman tek bir üye olmayabilir. Örneğin `typeof value === 'string'` kontrolü `unknown` değeri string yapar; bir `string | number | null` union'ında ise number ve null üyelerini eler. Koşulun öncül tipi ve kontrolün mantıksal sonucu birlikte hesaplanır. Kontrol akışı analizi, satırlar boyunca bu bilgiyi izler; bir değişkene yeni değer atanırsa önceki daraltma artık geçerli olmayabilir.

Narrowing'in önemli sınırı, verinin gerçek içeriğini çalışma anında kontrol eden kodun var olmasıdır. `value as { title: string }` derleyiciye güvence iddiası verir ama program çalışırken hiçbir koşul yürütmez; `typeof value.title === 'string'` ise gerçekten değer okur ve yanlış dalı ayırır. Güvenli kod incelemesinde bir satırın derleyiciyi susturup susturmadığına değil, runtime'da hangi kontrolün yapıldığına bak.

Kontrolün gösterdiği runtime değeri ile derleyicinin kabul ettiği statik tip farklı katmanlardır. Gerçek koşul yanlışsa yanlış dala gidilir; doğru koşuldan sonra ise yalnız o dalın işlemleri için daraltılmış tip bilgisi geçerlidir.

## Özet

- Narrowing kontrol akışında olasılıkları eler; değeri dönüştürmez.
- Erken dönüşten sonra kalan dal daha dar tipte çalışır.
- `0`, `''`, `null` ve `undefined` aynı iş anlamına gelmez.
- `??` yalnız nullish değerleri, `||` tüm falsy değerleri ele alır.
- `unknown` alan okunmadan önce gerçek kontrol ister.

Kendini yokla: `if (value)` puan 0 için çalışır mı? Cevap: Hayır, 0 falsy'dir.

Kendini yokla: `'title' in value` başlığın metin olduğunu kanıtlar mı? Cevap: Hayır; yalnızca alanın bulunduğunu söyler.
