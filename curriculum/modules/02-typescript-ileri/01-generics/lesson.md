---
title: "Generics: değişen tipi taşı"
minutes: 16
kind: concept
---

# Generics: değişen tipi taşı

:::pain[Problem]
Trend, popüler ve tür listelerinin cevaplarında `page`, `results`, `total_pages` ve `total_results` tekrar ediyor. Bir ekip arkadaşı sayfalama cevabına `total_results` alanını ekliyor; üç tipten yalnızca ikisini güncelliyor. Tür filtresi doğru çalışırken popüler filmler sayfası eski sözleşmede kalıyor.
:::

## Aynı yapının değişen parçası

Bir tipteki her alan aynı hızda değişmez. Sayfalı bir cevabın sayfa numarası ve toplamı sabittir; `results` içindeki öğe ise endpoint'e göre film, tür ya da oyuncu olabilir. Her cevap için ayrı tip yazmak bu ortaklığı gizler. Tek bir generic tanım, ortak kabuğu tutar ve değişken parçanın tipini çağırandan alır.

Generic parametre, tanım anında bilinmeyen ama kullanım anında bilinen bir tipi isimlendirir. Aşağıdaki `T`, JavaScript değeri değildir. Derleyicinin `Paginated<Movie>` örneğinde `Movie`, `Paginated<Genre>` örneğinde `Genre` olarak yerine koyduğu bir tip yer tutucusudur. Çıktı JavaScript'inde `T` diye bir değer bulunmaz.

:::model[Tipler derleme anında kalır]
Önceki modülde gördüğün sınır burada da geçerli: derleyici kaynak kodundaki tip ilişkisini denetler, çalışma anında gelen JSON'u incelemez. Generic, bir cevabın hangi tipte kullanılacağını bağlar; ağ cevabının bu şekle uyduğunu kanıtlamaz. Bu yeni bağlamda değişen, aynı ilişkiyi birden çok cevap tipi arasında taşıyabilmendir.
:::

## Tip parametresinin yolculuğu

Generic'in akışını üç durakla düşün: tanımda parametre açılır, kullanımda somut tipe bağlanır, iç alanların tipi o bağdan çıkarılır.

![Tip parametresinin tanımdan çağrıya ve sonuç alanına taşınması](diagrams/generic-akisi.svg)

Kesin kurallar:

1. Generic parametreyi tanımda `<T>` ile ilan edersin; bu isim yalnızca o tanımın kapsamındadır.
2. Parametreyi kullanan her yerde aynı tip ilişkisi korunur. `T[]`, “bilinmeyen eleman tipi T olan dizi” demektir.
3. Bir kullanım generic'i somutlaştırır: `Paginated<Movie>` içinde `T`, `Movie` olur.
4. TypeScript çoğu fonksiyonda `T` değerini argümandan çıkarabilir. Çıkarım mümkün değilse tipi açıkça yazarsın.
5. `T` hakkında yalnızca garanti edilen işlemleri yapabilirsin. Bir özelliği okumak gerekiyorsa o özelliği bir `extends` kısıtıyla şart koş.
6. Generic tip uyumu sağlar; doğrulama, dönüşüm veya kopyalama yapmaz. Çalışma zamanındaki nesne aynı nesnedir.

```ts check
type Page<T> = {
  page: number
  entries: T[]
  total: number
}

type Author = { penName: string; books: number }
type Category = { slug: string; label: string }

const authors: Page<Author> = {
  page: 1,
  entries: [{ penName: 'A. Yılmaz', books: 4 }],
  total: 1,
}
const categories: Page<Category> = {
  page: 1,
  entries: [{ slug: 'bilim-kurgu', label: 'Bilim kurgu' }],
  total: 1,
}
const firstAuthorName: string = authors.entries[0].penName
const firstCategorySlug: string = categories.entries[0].slug
```

`Page<T>` içindeki `entries` alanı, parametreyi görünür kılar. `Page<Author>` yazınca alan `Author[]` olur; `Page<Category>` yazınca `Category[]` olur. `page` ve `total` iki kullanımda da `number` kalır. Paylaşılan yapı ile değişen içerik birbirine karışmaz.

## Değeri girdi tipinden çıktıya taşı

Generic fonksiyon, verdiğin değerin tipini dönüşte de koruyabilir. Aşağıdaki örnek, kitap rafından ilk kitabı seçer:

```ts check
type Page<T> = { page: number; entries: T[]; total: number }
type Book = { isbn: string; title: string }

function firstEntry<T>(page: Page<T>): T | undefined {
  return page.entries[0]
}

const firstBook = firstEntry<Book>({
  page: 1,
  entries: [{ isbn: '978-1', title: 'Kıyıdaki Ev' }],
  total: 1,
})
const title: string | undefined = firstBook?.title
```

Çağrıda `Book` verildiği için dönüş `Book | undefined` olur. `undefined` önemlidir: boş sayfada ilk eleman yoktur. Dizi indeksi çalışma anında boş olabilir; generic bunu kendiliğinden ortadan kaldırmaz. Çağıran kod bu olasılığı ele almalıdır.

Tür parametresini her seferinde elle yazmak gerekmez. `firstEntry(page)` çağrısında TypeScript, argümanın `Page<Book>` biçiminden `T`'nin `Book` olduğunu çıkarır. Açık yazım, çıkarımın imkânsız ya da niyetin belirsiz olduğu yerde işe yarar; gereksiz tekrar okunabilirliği azaltır.

## Bir özelliği kullanmak için kısıt koy

`T` herhangi bir tip olabilir. Bu nedenle `item.id` gibi bir alanı kısıtsız generic içinde okumak güvenli değildir: metin veya sayı gönderilebilir ve bunlarda `id` bulunmayabilir. `T extends { key: string }` yazarak her geçerli tipin en azından bu alanı taşımasını şart koşarsın.

```ts check
type Author = { penName: string; books: number }
type Category = { slug: string; label: string }
type Page<T> = { page: number; entries: T[]; total: number }

function findByKey<T extends { key: string }>(items: readonly T[], key: string): T | undefined {
  return items.find((item) => item.key === key)
}

const result = findByKey([{ key: 'g-7', title: 'Gece' }], 'g-7')
const resultTitle: string | undefined = result?.title
```

Kısıt, nesneyi yalnızca `{ key: string }` biçimine indirgemez. Dönüş hâlâ tam `T` olur; dolayısıyla `title` bilgisi korunur. `readonly T[]` girdisi de fonksiyonun listeyi değiştirmediğini sözleşmede belirtir ve değişmez dizileri kabul etmesini sağlar.

## Çağrıdan dönüşe kadar iz sürelim

`findByKey([{ key: 'g-7', title: 'Gece' }], 'g-7')` çağrısını sırayla yürüt:

| Adım | TypeScript'in çıkardığı bilgi | Çalışma zamanı sonucu |
| --- | --- | --- |
| Nesne dizisi verilir | `T`, `{ key: string; title: string }` ile uyumludur | Bir dizi ve iki alanlı nesne vardır |
| Kısıt denetlenir | Her öğede `key: string` bulunduğu görülür | Fonksiyon ilk öğenin `key` alanını okur |
| `find` çalışır | Bulunan öğenin tipi hâlâ `T` | Eşleşen nesnenin kendisi döner |
| Sonuç kullanılır | Dönüş tipi `T \| undefined` | Bulunmadıysa `undefined`, bulunduysa nesne gelir |
| `result?.title` okunur | `T` içindeki `title` bilgisi korunmuştur | Başlık veya `undefined` elde edilir |

Tip kontrolü ile çalışma zamanı işi paralel ilerler ama aynı şey değildir. Derleyici “öğede `key` alanı var” sonucunu tip sözleşmesinden bilir; JavaScript ise gerçek dizide karşılaştırma yapar. Dışarıdan gelen veride bu sözleşme doğrulanmamışsa yalnızca generic imzaya güvenmek hatalıdır.

## Önce kırık, sonra doğru

Ayrı cevap tiplerini kopyalamak kısa vadede çalışır, ama sayfalama alanları birbirinden ayrılır:

```ts
type AuthorPage = { page: number; entries: Author[]; total: number }
type CategoryPage = { page: number; entries: Category[]; count: number }
```

Burada `total` ve `count` aynı kavramı farklı isimle anlatmaya başladı. Bir alan güncellendiğinde ikinci tipin unutulması kolaydır. Ortak kabuk doğru sözleşmeyi tek yerde tutar:

```ts check
type Author = { penName: string; books: number }
type Category = { slug: string; label: string }
type EntryPage<T> = { page: number; entries: T[]; total: number }
type AuthorPage = EntryPage<Author>
type CategoryPage = EntryPage<Category>
```

Derleyici şimdi her iki cevabın da aynı alan adlarını kullanmasını denetler. Buna rağmen dış JSON'u bu tiplerden biri olarak cast etmek, veri doğrulaması yapmış olmaz; yalnızca derleyiciye iddia sunar.

## Sınırlar ve sık hatalar

:::mistake[Belirti: Her alanı okuyabiliyormuşsun gibi kod yazarsın]
Belirti → `T` üzerinde `item.id` yazınca derleyici hata verir.  
Neden → Generic parametre henüz bir nesne tipi ya da `id` alanı taşıyan tip olarak sınırlandırılmamıştır.  
Düzeltme → Gereken en küçük yapıyı `T extends { id: number }` gibi bir kısıtla belirt; nesneyi baştan sona belirli bir tipe sabitleme.
:::

:::mistake[Belirti: Bulunamayan kayıt tipi yokmuş gibi ele alınır]
Belirti → `find` sonucu kullanılınca “olası undefined” uyarısı alırsın.  
Neden → Aranan kayıt listede bulunmayabilir.  
Düzeltme → `T | undefined` dönüşünü koru ve çağıran yerde sonucu kontrol et; varsayılan nesne uydurma.
:::

:::mistake[Belirti: `T` her değeri kabul ediyor]
Belirti → `any` ile alan yazım hatası da derlenir.  
Neden → `any`, generic ilişkinin denetimini devre dışı bırakır.  
Düzeltme → Bilinmeyen dış veriyi `unknown` tut, runtime kontrolü uygula ve doğrulanmış değeri generic tipe aktar.
:::

:::mistake[Belirti: Generic yazınca JSON güvenli sanılır]
Belirti → İstek kodunda `getData<Book>()` var ama sunucu hata nesnesi döndürünce `title` okunurken uygulama çöker.  
Neden → Generic yalnızca compile time bilgisidir; JSON gövdesini incelemez.  
Düzeltme → HTTP başarısını kontrol et, gövdeyi `unknown` kabul et ve sınırda doğrula. Bu farkı bu modülün async dersinde tekrar kullanacağız.
:::

:::sector
Frontend ekipleri sayfalama, sonuç zarfı ve API istemcisi tiplerini generic tanımlayarak ortak alanları tek yerde tutar. Kısıtı yalnızca fonksiyonun gerçekten kullandığı alanlarla sınırlı tutmak, aynı yardımcıyı film, kullanıcı ve içerik listelerinde kullanırken her modele ait ek alanları kaybetmemeni sağlar. API cevabının doğrulanması ise istemci tipinden ayrı bir adımdır.
:::

## Özet

- Generic parametre, tanımda bilinmeyen tipi çağrıda somutlaştırır.
- Aynı kabuğun sabit alanları ve değişken içeriği ayrı ifade edilir.
- Fonksiyon generic'i argümanın tipini dönüşe taşıyabilir.
- `extends` yalnızca gereken özelliklere erişim izni verir; tam `T` korunur.
- Generic derleme zamanı sözleşmesidir, dış veri doğrulaması değildir.

**Kendini yokla:** `T extends { key: string }` kısıtı dönüş değerini neden yalnızca `{ key: string }` yapmaz?  
*Cevap:* Kısıt, `T`'nin en az hangi özellikleri taşıması gerektiğini söyler; `T`'nin diğer alanları da korunur.

**Kendini yokla:** `Page<Book>` içinde `entries` hangi tiptedir, boş dizide ilk öğe ne olabilir?  
*Cevap:* `Book[]`; ilk öğe bulunmadığında `undefined` olabilir.
