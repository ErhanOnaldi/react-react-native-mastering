---
title: "Değerlerden anahtar tipleri çıkar"
minutes: 15
kind: concept
---

# Değerlerden anahtar tipleri çıkar

:::pain[Problem]
Sıralama menüsü `rating`, `popularity` ve `releaseYear` seçeneklerini gösteriyor. Başka bir dosyada elle tutulan union'a `releaseYear` eklenmemiş; kullanıcı seçeneği görüyor ama sıralama fonksiyonunun tipi o alanı kabul etmiyor.
:::

## Tek listeyi iki kez yazma

Bir nesnenin anahtarlarını başka bir yerde tekrar string olarak yazmak, iki listenin zamanla ayrılmasına neden olur. `keyof` bir nesne tipinin anahtarlarından union üretir. İndeksli erişim `T[K]`, belirli anahtarların değer tipini alır. `typeof` ise çalışma zamanında bulunan bir değerin tipini TypeScript'in tip alanına taşır.

Önceki derste utility type'larla tiplerden yeni görünüm türettin. Burada da tek kaynak ilkesi geçerli: isimleri tipten veya sabit diziden çıkar, aynı stringleri ikinci kez elle sıralama. Bu çıkarımlar yalnızca derleme anındaki ilişkilerdir; UI'daki string değerleri doğrulamak gerekiyorsa çalışma anında kontrol gerekir.

![Bir nesne tipinin anahtarlarından ve seçilen anahtarın değerinden iki ayrı tip çıkarılması](diagrams/keyof-akisi.svg)

## Tip alanı ile değer alanı

Kodda iki ayrı dünya olduğunu aklında tut. `typeof` JavaScript değerini görür ve tipini üretir. `keyof` ve köşeli indeksli erişim ise tipler üzerinde çalışır. Bir nesne sabiti üzerinden tip çıkaracaksan önce `typeof` ile o değerin tipini alırsın.

Kesin kurallar:

1. `keyof T`, `T` nesne tipinin geçerli anahtarlarının union'ını verir.
2. `T[K]`, `K` anahtarının değer tipini verir; `K`, `keyof T` ile sınırlandırılabilir.
3. `typeof value`, çalışma zamanında tanımlı `value`'nun çıkarılan tipini alır; bir type alias için kullanılamaz.
4. Normal dizi literal'i çoğunlukla `string[]` gibi genişler; `as const` literal elemanları tuple içinde korur.
5. `(typeof VALUES)[number]`, readonly tuple'ın eleman union'ını çıkarır.
6. Tipten türetilen union, çalışma zamanında geçersiz stringi otomatik reddetmez. Dış stringi ayrıca doğrula.

```ts check
type Trail = { name: string; distanceKm: number; paved: boolean }
type TrailKey = keyof Trail
type Distance = Trail['distanceKm']

function readTrail<K extends keyof Trail>(trail: Trail, key: K): Trail[K] {
  return trail[key]
}

const SORT_KEYS = ['name', 'distanceKm'] as const
type SortKey = (typeof SORT_KEYS)[number]
const key: SortKey = 'name'
const km: number = readTrail({ name: 'Kıyı', distanceKm: 8, paved: false }, 'distanceKm')
```

Burada `TrailKey`, `'name' | 'distanceKm' | 'paved'`; `Distance` ise `number` olur. `readTrail` için `K` hem parametre tipini hem dönüşü birbirine bağlar. `key` değişkeni yalnızca dizide yazılı iki anahtardan biri olabilir.

## Bir fonksiyon çağrısını izle

`readTrail(path, 'distanceKm')` çağrısında `K` parametresi somutlaşana kadar dönüş türü kesinleşmez. Adımlar şöyledir:

| Adım | Çıkarılan tip | Neden |
| --- | --- | --- |
| `trail` argümanı verilir | `Trail` | Fonksiyon imzasındaki `T` burada sabittir |
| `'distanceKm'` anahtarı verilir | `K = 'distanceKm'` | Bu literal, `keyof Trail` üyesidir |
| Dönüş `Trail[K]` olur | `Trail['distanceKm']`, yani `number` | Seçilen anahtarın değer tipi alınır |
| `trail[key]` çalışır | Çalışma anında `8` | JavaScript nesnesinden gerçek değer okunur |

Eğer fonksiyon dönüşü `Trail[keyof Trail]` olsaydı sonuç `string | number | boolean` olurdu. `K` generic'i seçilen alanı dar tutar: `distanceKm` istendiğinde sayı, `name` istendiğinde string. Bu ilişki, yalnızca değeri `unknown` ya da union olarak döndürmekten daha kullanışlıdır.

İndeksli erişimde anahtar kümesi birden fazla üyeyse sonuç, o alanların değer tiplerinin union'ıdır. Örneğin `Trail['name' | 'paved']`, `string | boolean` olur. Bu yüzden generic `K`, tek bir literal olarak çıkarılabiliyorsa daha kesin sonuç verir; kullanıcı kodu anahtarın birden fazla olabileceğini belirtiyorsa union dönüş de doğrudur. Birden çok alanı dinamik seçen tablo görünümünde bu union'ı ele alacak kod gerekir.

`keyof` ayrıca birleşim ve kesişim tiplerinde de tip kurallarına göre davranır. Bir obje modelinin anahtar kümesini büyütmek istiyorsan önce modelin gerçekten hangi alanları paylaştığını netleştir. `keyof` sonucunu her durumda “bütün alt tiplerin tüm alanları” diye yorumlama; union türünde güvenle ortak erişilebilen alanlar belirleyicidir. Bu ayrıntı özellikle birden çok API cevabını tek fonksiyona alan yerde önem kazanır.

## Sabit listeden union üret

Sıralama seçeneklerini kodda sabit bir tuple olarak tanımladığında seçenek listesi hem UI verisi olur hem de izin verilen değerlerin kaynağına dönüşür.

```ts check
const SORT_KEYS = ['name', 'distanceKm', 'difficulty'] as const
type SortKey = (typeof SORT_KEYS)[number]

function isSortKey(value: string): value is SortKey {
  return SORT_KEYS.some((key) => key === value)
}

function labelFor(key: SortKey): string {
  switch (key) {
    case 'name': return 'Rota adı'
    case 'distanceKm': return 'Mesafe'
    case 'difficulty': return 'Zorluk'
  }
}

const key: SortKey = 'difficulty'
const label: string = labelFor(key)
```

`as const` olmasaydı `typeof SORT_KEYS[number]`, geniş `string` olurdu; yazım hataları da geçerli sayılırdı. Guard, URL query gibi derleme zamanı dışında gelen bir stringi runtime'da listeye karşı denetler. `SortKey` tipi tek başına URL değerini doğrulamaz.

## Önce kırık, sonra doğru

Elle tekrar edilen tip çok kolay bayatlar:

```ts
type SortKey = 'name' | 'distanceKm'
const SORT_KEYS = ['name', 'distanceKm', 'difficulty']
```

Menü `difficulty` seçeneğini sunuyor ama `SortKey` bilmiyor. İki kaydı elle eşitlemek yerine tek tanım yap:

```ts check
const SORT_KEYS = ['name', 'distanceKm', 'difficulty'] as const
type SortKey = (typeof SORT_KEYS)[number]
const selected: SortKey = 'difficulty'
```

Bu yaklaşım dizideki her elemanı tipe taşır. Fakat diziye sunucudan gelen değerleri koyuyorsan literal çıkarımı yoktur; orada `unknown` veriyi doğrulamak gerekir.

`Object.keys(value)` da anahtar listesi verir ama dönüş tipi `string[]` olur. Bunun nedeni runtime nesnesinin interface'te yazılandan fazla anahtar taşıyabilmesi ve JavaScript'in nesnelerin şeklini sonradan değiştirebilmesidir. Bu nedenle `Object.keys(value) as (keyof T)[]` iddiasını her nesnede güvenli sayma. Sadece nesnenin tam yapısını kendin kurduğun ve ekstra runtime alan bulunamayacağını bildiğin kapalı bir sınırda böyle bir daraltma savunulabilir; genel yardımcı yazarken açık kontrol tercih et.

Sabit değer üzerinden `typeof` ile tip çıkarmak da runtime listeyi oluşturmaz; sadece compiler'ın gördüğü değerleri tanımla ilişkilendirir. Örneğin `const labels = ['mesafe'] as const` derlenmiş JS'te hâlâ normal bir dizi olur. Tip sisteminde readonly görünmesi, başka JavaScript kodunun diziye dokunamayacağını garanti etmez. Bu derste çıkarılan union ile gerçek listeyi ayrı kavramlar olarak tutmak, daha sonra URL ve form verisini güvenle kontrol etmene yardım eder.

## Sınırlar ve sık hatalar

:::mistake[Belirti: `typeof User` yazınca hata alırsın]
Belirti → `type UserShape = typeof User` derlenmez.  
Neden → `User` type alias'tır; JavaScript çalışma zamanında değer olarak bulunmaz.  
Düzeltme → Tipten anahtar almak için `keyof User` kullan; gerçek bir `user` değeri varsa `typeof user` yaz.
:::

:::mistake[Belirti: Her string `SortKey` olarak kabul edilir]
Belirti → `const key: SortKey = 'releseYear'` derleniyor.  
Neden → Kaynak dizi `as const` olmadan geniş `string[]` tipine çıkarılmıştır.  
Düzeltme → Kaynak kodundaki sabit listeyi `as const` yap ve eleman union'ını ondan türet.
:::

:::mistake[Belirti: URL'deki değer tipi geçtiği için güvenli kabul edilir]
Belirti → `searchParams.get('sort')` doğrudan sıralama anahtarı gibi kullanılır.  
Neden → Query parametresi çalışma zamanı stringidir ve TypeScript annotation'ı doğrulamaz.  
Düzeltme → `null` olasılığını kontrol et, guard veya allowlist ile runtime doğrulaması yap.
:::

:::mistake[Belirti: `keyof` alan değerini veriyor sanırsın]
Belirti → `type Value = keyof Trail` sonucunu `number` olarak kullanamazsın.  
Neden → `keyof` yalnızca anahtar adlarını üretir.  
Düzeltme → Değer tipi için `Trail['distanceKm']` gibi indeksli erişim yaz.
:::

:::sector
Form alanları, sıralama parametreleri ve kolon yapılandırmaları genellikle aynı model alan adlarını kullanır. `keyof` ve `typeof` bu isimleri tek kaynaktan türetir. URL, local storage veya API'den gelen değerler runtime sınırıdır; kaynak koddaki literal union ile karşılaştırılmalıdır.
:::

## Özet

- `keyof T` anahtar union'ını, `T[K]` seçilen alanın değer tipini verir.
- `typeof` yalnızca gerçek bir JavaScript değerini tip alanına taşır.
- `as const` literal diziyi korur; `[number]` eleman union'ını çıkarır.
- Generic `K` parametre ile dönüş tipini ilişkilendirir.
- Runtime stringleri guard veya allowlist olmadan güvenli sayılmaz.

**Kendini yokla:** `type A = keyof Trail` ne üretir, `type B = Trail['paved']` ne üretir?  
*Cevap:* `A` anahtar adlarının union'ı; `B` ise `boolean` olur.

**Kendini yokla:** Neden URL'den gelen `'name'` değerini doğrudan `SortKey` sayamayız?  
*Cevap:* URL değerleri çalışma anında gelir; TypeScript union'ı yalnızca kodu denetler, girdiyi doğrulamaz.
