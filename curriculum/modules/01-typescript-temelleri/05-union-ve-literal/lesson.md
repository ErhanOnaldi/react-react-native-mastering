---
title: "Union ve literal tipler"
minutes: 14
kind: concept
---

# Union ve literal tipler

:::pain[Problem]
Bir görsel kaynağı filmde yoksa `null` gelir; görünüm seçici ise yalnızca `grid` veya `list` kabul etmelidir. İkisini de `string` yazarsan hem boş poster gerçeği kaybolur hem de `grdi` yazım hatası kabul edilir.
:::

## Bir tip, birden fazla geçerli değer

Union (`A | B`), değerin belirtilen seçeneklerden birine ait olabileceğini söyler. `string | null` iki farklı türde değeri kabul eder. Literal union ise türün tamamını değil, belli değerleri kabul eder: `'grid' | 'list'` yalnızca bu iki metindir.

![Union seçeneklerinin tür ve belirli değerlerden oluşabildiğini gösteren şema](diagrams/union-secenekleri.svg)

```ts check
type Layout = 'grid' | 'list'
type PosterPath = string | null
const currentLayout: Layout = 'grid'
const poster: PosterPath = null
void currentLayout; void poster
```

Kurallar net:

1. `A | B`, değerin A ya da B olmasına izin verir; iki değerin aynı anda bulunması anlamına gelmez.
2. Literal tipi (`'grid'`) yazınca değer o sabit metin olmalıdır; `string` ise bütün metinleri kapsar.
3. Union'ı değişkene yazdığında her seçeneğin ortak özelliklerini kullanabilir, yalnızca belirli dala ait özellikleri kontrol etmeden okuyamazsın.
4. Union'a eklenen her seçenek, onu kullanan kodun yeni olasılığı nasıl ele alacağını düşünmeni sağlar.

`'grid' | 'list'`, “iki görünümden biri” sözleşmesidir. `string`, “herhangi bir metin” demektir. Değerin kaynağına göre doğru genişliği seç: dış kaynaktan gelen poster metin ya da null olabilir; kullanıcı arayüzündeki görünüm modu ise uygulamanın tanımlı iki tercihinden biridir.

## Derleyicinin union için uyguladığı kurallar

Union bir değerin aynı anda iki şey olduğu anlamına gelmez. Bir değişkenin anlık değeri seçeneklerden bir tanesidir; derleyici ise onu kontrol edene kadar hangi seçenek olduğunu bilmiyor olabilir. Bu yüzden her seçenek için güvenli olan ortak işlemler kullanılabilir, tek bir seçeneğe özgü işlemler için önce koşul gerekir.

1. `A | B`, A veya B tipine atanabilen değerleri kabul eder. Her iki alternatifi birleştirip yeni bir nesne üretmez.
2. Bir değer atanırken hedef tipin izin verdiği seçeneklerden en az birine uyum aranır. `'grid'`, `string` tipine atanabilir; herhangi bir `string`, `'grid' | 'list'` tipine atanamaz.
3. `const` ile doğrudan literal başlatılan yerel değişken genellikle en dar değer tipini korur; değişebilir `let` değişkeninde TypeScript yeni değer atanmasına izin vermek için tipi genişletebilir.
4. Union değişkeninde koşul yapılana kadar yalnız bütün üyelerde geçerli özellikler güvenlidir. Seçeneklerden biri `null` ise string metotları henüz çağrılamaz.
5. Union, runtime doğrulaması değildir. JavaScript çıktısında tip silinir; ağdan gelen metin `'grid' | 'list'` diye doğrulanmaz.

Aşağıdaki fark, anotasyonun neden önemli olduğunu gösterir:

```ts check
const fixedLayout = 'grid'
let chosenLayout: 'grid' | 'list' = fixedLayout
chosenLayout = 'list'
void chosenLayout
```

`fixedLayout` değişmeyeceği için çıkarımı `'grid'` literalinde kalır. `chosenLayout` içinse iki geçerli değerli union açıkça verilmiştir; bu nedenle `'list'` ataması kabul edilir. Anotasyon olmasaydı `let` değişkeninin tipi genellikle `string`'e genişlerdi ve yanlış yazılmış mod da kabul edilirdi.

Literal widening'i görmek tip tasarımını kolaylaştırır. `const` ile saklanan değişmez string değeri çoğu zaman kendi literal tipinde kalır. `let` ise yeniden atanabildiği için daha geniş `string` tipine çıkar; genel bir string daha sonra `'grid' | 'list'` türüne atanamaz, çünkü içeriği bu iki değer dışında da olabilir. İzin verilen seçenekleri çağıranlar arasında taşımak için değişkeni baştan union olarak tanımla.

```ts check
type Panel = 'overview' | 'details'
const initialPanel = 'overview'
let selectedPanel: Panel = initialPanel
selectedPanel = 'details'
void selectedPanel
```

Burada `initialPanel` dar literalini koruduğu için `Panel`'e atanabilir. Benzer biçimde bir koşullu ifadenin iki kolu farklı literal döndürürse TypeScript ortak bir union çıkarabilir. Ama fonksiyon çıktısını `string` diye anotasyonlarsan çağıran, bu seçeneklerin hangileri olduğunu artık bilemez; sözleşme gerçekten kapalı küme ise dönüş tipini union yap.

## Boş değer, geçerli ama farklı bir seçenek

`poster_path: string | null`, posterin hiç olmadığı durumu tipin parçası yapar. `null`, metin değildir; bu yüzden `.startsWith()` gibi string metotları her olasılıkta güvenli olmaz. Sonraki derste kontrolle bu iki dalı ayıracağız.

Boş metin (`''`) ise yine `string` türündedir. `release_date: string` yazmak tarihin dolu olduğunu garanti etmez; yalnızca alanın metin olduğunu söyler. Ürün kuralı boş metni “tarih yok” sayıyorsa bunu çalışma zamanında ayrıca ele alırsın.

## Yanlış kabulü daralt

```ts
type Layout = string
let layout: Layout = 'grid'
layout = 'grdi'
```

Bu kod derlenir, çünkü `string` yazım hatasını da kapsar. Tipi uygulamanın gerçek seçeneklerine göre daraltınca hata atamanın olduğu yerde belirir.

```ts check
type Layout = 'grid' | 'list'
let layout: Layout = 'grid'
layout = 'list'
void layout
```

Literal union'ın erişim kuralını ayrıca düşün: `type Source = string | null` değişkeninde tüm olasılıkların ortak işlemleri dışındaki metotlar kontrol bekler. `string` üyesi `.startsWith()` destekler, `null` desteklemez. Dolayısıyla union hem veri sözleşmesini doğru anlatır hem de sonraki kullanımda daraltma ihtiyacını görünür kılar.

Literal union, değeri çalışma zamanında dönüştürmez. JavaScript'e çevrilince `Layout` gibi tip açıklamaları silinir; `layout` değişkeninin gerçek değeri `'grid'` metnidir. Bu yüzden tip kontrolü kod yazarken yardımcı olur, ama JSON'dan gelen değeri otomatik doğrulamaz.

## Önce hatayı gör, sonra tipi sınırla

Genel `string` kullanan bir değişkene yazım hatası atanabilir:

```ts
let layout: string = 'grid'
layout = 'grdi'
```

Burada hata yok; `grdi` de geçerli bir string. Ancak iş kuralı iki seçenekse bu fazla geniştir. Bir literal union ile derleyiciye kabul edilebilir değer kümesini ver:

```ts check
type Layout = 'grid' | 'list'
let layout: Layout = 'grid'
layout = 'list'
void layout
```

Aşağıdaki atama bu sözleşmeyle derlenmez:

```ts
type Layout = 'grid' | 'list'
const layout: Layout = 'grdi'
```

Derleyici hatası: `TS2322: Type '"grdi"' is not assignable to type 'Layout'.` Türkçesi: verilen literal, izin verilen iki seçenekten biri değil. Böylece hata yanlış değerin yazıldığı satırda bulunur.

## Adım adım tip kontrolü

```ts check
type Visibility = 'public' | 'private'
type Profile = { name: string; visibility: Visibility }
const profile: Profile = { name: 'Deniz', visibility: 'private' }
const visibilityLabel = profile.visibility === 'public' ? 'Açık' : 'Gizli'
void visibilityLabel
```

| Adım | Bilinen bilgi | Sonuç |
| --- | --- | --- |
| `Visibility` | `'public'` ya da `'private'` | Başka bir metin atanamaz |
| `Profile.visibility` | `Visibility` | Alan yalnızca iki değerden biridir |
| Karşılaştırma | `profile.visibility === 'public'` | `true` ise Açık, değilse Gizli |
| `visibilityLabel` | koşulun her iki kolu string | Sonuç `string`; iki dalın ortak üst tipi |

Koşulun yanlış kolu burada `'private'` demektir; çünkü tip sadece iki seçenek bırakır. Seçenekler çoğalırsa ternary yerine `switch` daha okunur olur. Daha önemlisi, yeni seçenek ekleyince eski kodun varsayımı hâlâ geçerli mi diye kontrol edersin.

:::mistake[Genel string ile seçenekleri kaybetmek]
Belirti → `grdi` derleniyor. Neden → Değişken tipi `string`, izin verilen değerler listesi değil. Düzeltme → Ürün seçenekleri belliyse literal union tanımla; derleyici atamayı bu kümeye göre denetlesin.
:::

:::mistake[Null'ı boş metin sanmak]
Belirti → Poster metodu çağrısı hata veriyor. Neden → `null` ile string'i aynı dalda kabul ettin. Düzeltme → `string | null` gerçeğini koru ve kullanmadan önce null dalını ele al.
:::

:::mistake[Union'ı runtime doğrulaması sanmak]
Belirti → Yanlış şekilli API değeri uygulamaya girebiliyor. Neden → Tipler sadece TypeScript kodunu denetler; JSON üzerinde otomatik kontrol yapmaz. Düzeltme → Sınırda gerçek çalışma zamanı kontrolü kur; ham veriyi tip iddiasıyla güvenli sayma.
:::

:::sector
Ekiplerde literal union, buton modu, durum etiketi ve benzeri kapalı seçenek kümelerini ortak sözleşme yapar. API alanı gerçekten nullable ise bunu da olduğu gibi modellemek, her çağıranın eksik durumu ayrıca tahmin etmesini önler.
:::

## Union seçeneklerini eksiksiz ele alma

Union'a yeni bir seçenek eklemek, mevcut kodun varsayımlarını yeniden gözden geçirme fırsatıdır. `if/else` zincirinin son kolu “geri kalan her şey” kabul ediyorsa yeni literal oraya düşer; bu davranış teknik olarak çalışsa bile yeni seçeneği yanlış etiketleyebilir. Seçenek sayısı arttıkça açık `switch` ve tüm dalların dönüş tipiyle kontrolü okunabilirliği artırır. Union seçeneklerinin derleme anındaki listesi ile API cevabının runtime doğrulaması ayrı işler olarak kalır.

Bir literal union'ı değişkenler ve fonksiyonlar arasında kullanmak için tip adını tekrar kullan. Aynı `'grid' | 'list'` metnini her imzada ayrı ayrı geniş `string` ile değiştirmek hatalı girdilere yeniden kapı açar. Tip alias yeni bir runtime enum nesnesi oluşturmaz; yalnızca kaynak kodda tekrar kullanılan statik sözleşmedir.

## Özet

- Union, bir değerin alabileceği alternatifleri yazar.
- Literal union, geçerli seçenekleri tek tek sınırlar.
- `null`, string değildir; boş string ise string'dir.
- Tip tanımı çalışma zamanında doğrulama yapmaz.

Kendini yokla: `type Tab = 'details' | 'cast'` için `'casts'` atanabilir mi? Cevap: Hayır; seçeneklerden biriyle tam eşleşmiyor.

Kendini yokla: `string | null` olan alan `''` olabilir mi? Cevap: Evet; boş metin bir string değeridir.
