---
title: "Var olan tipten yeni tipler türet"
minutes: 18
kind: concept
---

# Var olan tipten yeni tipler türet

:::pain[Problem]
Sinema'ya arama önerileri ekliyorsun: kutuya "dövüş" yazınca altında `Dövüş Kulübü (1999)` gibi satırlar çıkacak. Satırı üreten fonksiyon parametre olarak `Movie` alıyor. Denemek için üç alanlık küçük bir film nesnesi veriyorsun ve editör satırı kırmızıyla işaretliyor. Fonksiyon yalnızca üç alan okuyor ama TypeScript on dört alanın hepsini istiyor.
:::

Editörde gördüğün hata şu:

```text
Type '{ id: number; title: string; release_date: string; }' is missing the
following properties from type 'Movie': original_title, overview, poster_path,
backdrop_path, and 7 more.
```

TypeScript haklı: fonksiyonun imzası "bana bir `Movie` ver" diyor, `Movie` de on dört alanlı bir tip. Sorun imzanın fonksiyonun gerçekten ihtiyaç duyduğundan fazlasını istemesi.

## Bir film, birçok ekran

Sinema'da aynı film birçok yerde görünecek. Arama önerisinde yalnızca adı ve yılı, film kartında posteri ve puanı, detay sayfasında neredeyse her şeyi göstereceksin. `Movie` tipi TMDB'nin gönderdiği bütün alanları anlatır. Ekranları hazırlayan fonksiyonlar ise bu alanların sadece bir kısmını kullanır.

| Yer | Okuduğu alanlar |
| --- | --- |
| Arama önerisi | `id`, `title`, `release_date` |
| Film kartı | `id`, `title`, `poster_path`, `vote_average` |
| Detay sayfası | neredeyse hepsi |

Frontend'de yaygın bir kural var: **bir fonksiyon ya da bileşen yalnızca kullandığı veriyi istemeli.** Böyle yazılan fonksiyonu denemek kolaydır, çünkü üç alanlık bir nesneyle çağırabilirsin ve yukarıdaki hata kaybolur. Aynı fonksiyonu elinde tam `Movie` olmayan yerlerde de kullanabilirsin; örneğin "Son baktıkların" listesinde yalnızca ad ve yılı saklıyorsan. Üstelik imzaya bakarak neye bağlı olduğunu anlarsın: `poster_path` istemeyen bir fonksiyonun poster göstermediğini, içini açmadan bilirsin.

O halde fonksiyona daha küçük bir tip lazım. Asıl soru, bu tipi nasıl yazacağın.

## Elle kopyalamak: çalışır ama iki kaynak doğar

Bildiğin yöntemle başlayalım: küçük tipi elle yazmak.

```ts
type SuggestionRow = {
  id: number
  title: string
  release_date: string
}
```

Bu kod çalışır. Sorun daha sonra çıkar. Diyelim ki öneri satırına küçük bir poster de eklemek istiyorsun ve alanı ezberden yazıyorsun:

```ts
type SuggestionRow = {
  id: number
  title: string
  release_date: string
  poster_path: string // Movie'de string | null idi, unuttun
}

movies.map(suggestionText) // ← hata burada çıkar
```

Bu sefer hata, kopyayı yazdığın satırda değil, listeyi kullandığın satırda çıkar. Uzun mesajın son satırları şöyle:

```text
Types of property 'poster_path' are incompatible.
  Type 'string | null' is not assignable to type 'string'.
```

Burada hatayı `movie.poster_path ?? ''` gibi bir ekle susturmak cazip gelir. Oysa asıl sorun, kopyanın `Movie`'yle aynı olmaması. Kopya ile asıl tip arasında hiçbir bağ yok: biri değişince diğeri haberdar olmaz. Bu yüzden küçük tipi elle yazmak yerine `Movie`'den **türetmek** gerekir. Böylece `Movie` değişince türetilen tip de kendiliğinden değişir.

## Pick: tipten alan seç

Önceki derste `Paginated<T>` yazdın: tip argümanı alan ve ondan yeni bir tip üreten bir tip. TypeScript bu türden hazır tiplerle gelir; bunlara **utility type** denir. İlki `Pick`. `Pick<Kaynak, 'alan1' | 'alan2'>`, kaynak tipteki yalnızca bu alanları alır ve tiplerini olduğu gibi korur.

JavaScript'te **destructuring**, bir nesnenin alanlarını ayrı değişkenlere almanın kısa yoludur: `const { id, title } = movie`. `Pick` benzer bir seçimi bir **tip** için yapar.

Örneklerde `Movie`'nin kısaltılmış halini kullanıyoruz:

```ts check
type Movie = {
  id: number
  title: string
  overview: string
  poster_path: string | null
  release_date: string
  vote_average: number
}

type SuggestionRow = Pick<Movie, 'id' | 'title' | 'release_date'>
// TypeScript'in gördüğü: { id: number; title: string; release_date: string }

function suggestionText(movie: SuggestionRow): string {
  return `${movie.title} (${movie.release_date.slice(0, 4)})`
}

const small = suggestionText({ id: 550, title: 'Dövüş Kulübü', release_date: '1999-10-15' })

const fullMovie: Movie = {
  id: 603,
  title: 'Matrix',
  overview: 'Bir bilgisayar korsanı gerçekliğin sırrını öğrenir.',
  poster_path: null,
  release_date: '1999-03-31',
  vote_average: 8.2,
}
const fromFull = suggestionText(fullMovie)
```

İki çağrı da derlenir. Küçük nesne yeterli, çünkü fonksiyon yalnızca üç alan istiyor. Tam `Movie` de kabul edilir, çünkü istenen üç alan onda da var ve fazladan alanlar sorun olmaz.

`// TypeScript'in gördüğü` yorumu burada senin için yazıldı. Egzersiz editöründe bir tipin adının üstüne fareyle gelince aynı açılımı kendin görürsün. Utility type öğrenirken en iyi alışkanlık bu: yazdığın ifadenin açılımına bakmak.

Poster sorununa dönelim. Satıra poster eklemek artık tek kelimelik bir iş: `Pick<Movie, 'id' | 'title' | 'release_date' | 'poster_path'>`. Alanın tipi `Movie`'den geldiği için `string | null` olur; ezberden yanlış yazma ihtimali kalmaz. Alan adını yanlış yazarsan da TypeScript seni durdurur:

```text
Type '"titel"' is not assignable to type 'keyof Movie'. Did you mean '"title"'?
```

`Pick`'in ikinci argümanı yalnızca `Movie`'nin gerçek alan adlarından biri olabilir. Mesajdaki `keyof`'un ne olduğunu bir sonraki derste göreceksin.

![Movie tipinden Pick, Omit ve Partial ile türetilen üç tipin alanları](diagrams/alan-secimi.svg)

## Omit: hepsi, şunlar hariç

Sinema'ya ileride izleme listeleri eklenecek. Kullanıcı bir liste oluşturacak, ad ve açıklama yazacak, listenin herkese açık olup olmayacağını seçecek:

```ts
type Watchlist = {
  id: string
  name: string
  description: string
  isPublic: boolean
  createdAt: string
}
```

Formdan gelen veri bu tipin tamamı değildir. `id`'yi ve `createdAt`'i kullanıcı yazmaz; bunları liste kaydedilirken uygulama üretir. Frontend'de bu ayrımla sık karşılaşırsın: **sistemin verdiği alanlar** ile **kullanıcının doldurduğu alanlar** farklıdır. Formun tipi yalnızca ikincisini anlatmalı.

Burada alanların çoğu lazım, ikisi hariç. `Omit<Kaynak, 'alan'>` tam olarak bunu söyler: "bunlar hariç hepsi".

Bu örnekte `@ts-expect-error`, TypeScript'e hemen altındaki satır için derleme hatası beklediğimizi söyler. Satır hatasız olsaydı TypeScript bu yorumu da hata sayardı.

```ts check
type Watchlist = {
  id: string
  name: string
  description: string
  isPublic: boolean
  createdAt: string
}

type WatchlistDraft = Omit<Watchlist, 'id' | 'createdAt'>
// TypeScript'in gördüğü: { name: string; description: string; isPublic: boolean }

function createWatchlist(draft: WatchlistDraft, id: string, now: string): Watchlist {
  return { ...draft, id, createdAt: now }
}

const created = createWatchlist(
  { name: 'Hafta sonu', description: 'Hafif filmler', isPublic: false },
  'w1',
  '2026-09-30',
)
```

Aynı taslağı `Pick<Watchlist, 'name' | 'description' | 'isPublic'>` ile de yazabilirdin; bugün sonuç aynı olurdu. Fark, `Watchlist`'e yeni bir alan eklendiğinde ortaya çıkar. Diyelim ki kullanıcının etiket seçebilmesi için `tags: string[]` ekledin. `Omit` ile yazılmış taslak bu alanı kendiliğinden alır, çünkü hariç tutulanlar arasında değil. `Pick` ile yazılmış taslak ise almaz, çünkü seçilenler arasında değil. Hangisini kullanacağını şu soru belirler: "İleride eklenecek bir alan bu tipte olmalı mı?" Form taslağında cevap genellikle evet olduğu için `Omit` kullanılır. Arama önerisinde ise hayır, çünkü satıra yeni alanlar kendiliğinden eklenmesin; bu yüzden orada `Pick` kullanılır.

## Partial: her alan isteğe bağlı

Liste oluşturulduktan sonra kullanıcı yalnızca adını değiştirmek isteyebilir. Güncelleme fonksiyonuna bütün alanları yeniden göndermek zorunda kalmamalı; sadece değişen alan yeter. Yalnızca değişen alanları taşıyan bu nesneye **patch** (yama) denir.

`Partial<T>`, `T`'nin her alanının sonuna `?` koyar. Önceki modülden hatırla: `?`, "bu anahtar hiç bulunmayabilir" demek.

```ts check
type Watchlist = {
  id: string
  name: string
  description: string
  isPublic: boolean
  createdAt: string
}
type WatchlistDraft = Omit<Watchlist, 'id' | 'createdAt'>

type WatchlistChange = Partial<WatchlistDraft>
// TypeScript'in gördüğü: { name?: string; description?: string; isPublic?: boolean }

function applyChange(current: Watchlist, change: WatchlistChange): Watchlist {
  return { ...current, ...change }
}

const current: Watchlist = {
  id: 'w1',
  name: 'Hafta sonu',
  description: 'Hafif filmler',
  isPublic: false,
  createdAt: '2026-09-30',
}
const renamed = applyChange(current, { name: 'Cuma gecesi' })

// @ts-expect-error — id değişiklik nesnesinde bulunamaz
applyChange(current, { id: 'w2' })
```

![Bir kaynak tipten Pick, Omit ve Partial görünümlerine ilerleyen utility type merdiveni](diagrams/utility-merdiveni.svg "Kaynak tipten daraltılmış ve kısmi görünümlere")

Hata gerçekten oluşuyor: `WatchlistChange`, `Watchlist`'ten değil `WatchlistDraft`'tan türediği için `id` alanını tanımıyor. Kullanıcı listenin kimliğini değiştiremez; bu kuralı tip koruyor.

`applyChange(current, { name: 'Cuma gecesi' })` çağrısını adım adım yürütelim:

| Adım | Ne olur | `name` | `description` |
| --- | --- | --- | --- |
| `{ ...current` | `current`'ın beş alanı yeni nesneye kopyalanır | `'Hafta sonu'` | `'Hafif filmler'` |
| `...change }` | `change`'te yalnızca `name` var; onun üstüne yazar | `'Cuma gecesi'` | `'Hafif filmler'` |
| `return` | Yeni nesne döner; `current` olduğu gibi kalır | `'Cuma gecesi'` | `'Hafif filmler'` |

Sıra önemli: `{ ...change, ...current }` yazsaydın eski değerler yenilerin üstüne yazılırdı ve hiçbir şey değişmezdi. `Partial` yalnızca patch'in şeklini tanımlar; hangi değerin kazanacağını spread sırası belirler.

### İç içe yazılan tipi içten dışa oku

`WatchlistChange` aslında iki adımda türedi: `Partial<Omit<Watchlist, 'id' | 'createdAt'>>`. İç içe fonksiyon çağrısı gibi içten dışa okunur:

| Adım | İfade | Açılım |
| --- | --- | --- |
| 1 | `Watchlist` | `{ id; name; description; isPublic; createdAt }` |
| 2 | `Omit<…, 'id' \| 'createdAt'>` | `{ name; description; isPublic }` |
| 3 | `Partial<…>` | `{ name?; description?; isPublic? }` |

Bir utility ifadesini anlamakta zorlanırsan bu tabloyu kafanda kur: en içteki tipten başla ve her adımda alan listesinin nasıl değiştiğine bak.

`Partial` yalnızca `?` ekler; alanın değer tipine dokunmaz. `?` "bu alan hiç gönderilmeyebilir" demektir, `null` ise "bu alan bilerek boş" demektir. Bir alanın tipi `string | null` ise patch'te iki farklı niyeti anlatabilirsin: `{ note: null }` notu silmek anlamına gelir, `{}` ise notu olduğu gibi bırakmak.

## Record: her anahtar için bir değer

Önceki modülden `Layout = 'grid' | 'list'` tipini hatırla. Görünüm düğmelerinin etiketlerini bir tabloda tutalım:

```ts check
type Layout = 'grid' | 'list'

const layoutLabels: Record<Layout, string> = {
  grid: 'Kartlar',
  list: 'Satırlar',
}
// Record<Layout, string> açılımı: { grid: string; list: string }

const label: string = layoutLabels.list
```

`Record<Anahtarlar, Değer>`, "bu anahtarların **her biri** için bu tipte bir değer" demektir. Asıl faydası, anahtar listesi büyüdüğünde görünür. `Layout`'a `'compact'` eklersen TypeScript tabloyu hemen işaretler ve neyi unuttuğunu söyler:

```text
Property 'compact' is missing in type '{ grid: string; list: string; }'
but required in type 'Record<Layout, string>'.
```

Tabloyu `{ [key: string]: string }` ya da `Record<string, string>` olarak yazsaydın bu kontrolü kaybederdin. İkisi de "herhangi bir metin anahtar olabilir" demek. `lsit: 'Satırlar'` diye yanlış yazsan bile kod derlenirdi, `layoutLabels.list` çalışma anında `undefined` dönerdi ve ekranda boş bir düğme görürdün.

## Readonly: bu değer değişmesin

Önceki modülde tek bir alanın başına `readonly` yazmayı gördün. `Readonly<T>` bunu tüm alanlara birden uygular. Sabit tablolar için uygundur:

```ts check
type Layout = 'grid' | 'list'

const layoutLabels: Readonly<Record<Layout, string>> = {
  grid: 'Kartlar',
  list: 'Satırlar',
}

// @ts-expect-error — Cannot assign to 'grid' because it is a read-only property.
layoutLabels.grid = 'Izgara'
```

Bir kısıt var: `Readonly` yalnızca en üst seviyedeki alanları kilitler. Bir alanın değeri başka bir nesneyse, o nesnenin içindeki alanlar yine değiştirilebilir.

## Hangisi ne zaman?

| İhtiyaç | Araç | Günlük dilde |
| --- | --- | --- |
| Birkaç alan lazım | `Pick<T, 'a' \| 'b'>` | "sadece bunlar" |
| Alanların çoğu lazım, birkaçı hariç | `Omit<T, 'a'>` | "bunlar hariç hepsi" |
| Hiçbir alan zorunlu olmasın | `Partial<T>` | "her alana `?` koy" |
| Sabit bir anahtar listesi için tablo | `Record<K, V>` | "her anahtara bir değer" |
| Değer değiştirilmesin | `Readonly<T>` | "her alana `readonly` koy" |

Bu araçlar yeni tipi kaynakla bağlı tutar. `Pick` ve `Omit` alan seçer, `Partial` alanları isteğe bağlı yapar, `Record` sabit anahtarların hepsini ister, `Readonly` ise en üst seviyedeki alanlara yeniden değer atanmasını engeller. Hiçbiri çalışma anındaki nesneyi değiştirmez.

## Sınırlar ve sık hatalar

:::mistake[Belirti: Hata, tipi kullandığın satırda çıkıyor]
Belirti → `movies.map(...)` satırında `'string | null' is not assignable to 'string'` hatası alıyorsun.  
Neden → Kullandığın küçük tip elle kopyalanmış ve `Movie`'den farklı yazılmış.  
Düzeltme → Hatayı `?? ''` ile susturma. Küçük tipi `Pick` ile `Movie`'den türet; alanın tipi kaynaktan gelsin.
:::

:::mistake[Belirti: Tipten çıkardığın alan nesnede duruyor]
Belirti → `WatchlistDraft` tipindeki değişkeni `JSON.stringify` ile yazdırınca çıktıda `id` görünüyor.  
Neden → Değişkene tam bir `Watchlist` nesnesi atanmış. `Omit` yalnızca TypeScript'in o değişkende neyi göreceğini değiştirir; nesneden alan silmez.  
Düzeltme → Alanı gerçekten çıkarmak istiyorsan yeni nesne kur: `const { id, createdAt, ...draft } = watchlist`.
:::

:::mistake[Belirti: `Partial` kullandığın halde `null` kabul edilmiyor]
Belirti → `{ description: null }` gönderince hata alıyorsun.  
Neden → `Partial` yalnızca `?` ekler; kaynakta `description: string` ise `null` hâlâ geçersizdir.  
Düzeltme → Açıklamanın silinebilmesi bir iş kuralıysa bunu kaynak tipte `description: string | null` olarak yaz.
:::

:::mistake[Belirti: Tabloda yanlış yazılmış anahtar derleniyor]
Belirti → `lsit: 'Satırlar'` hata vermiyor ama ekranda düğme boş.  
Neden → Tablonun tipi `Record<string, string>`; her metin geçerli bir anahtar sayılıyor.  
Düzeltme → Anahtarları kapalı bir union ile ver: `Record<Layout, string>`.
:::

:::sector
Ekiplerde genellikle tek bir kaynak tip olur; çoğunlukla bu, API'nin cevabını anlatan tiptir. Ekran, form ve güncelleme tipleri bu kaynaktan türetilir. Code review'da elle kopyalanmış bir tip görüldüğünde ilk sorulan soru şudur: "Bunu `Pick` ya da `Omit` ile türetebilir miyiz?" React modülünde bileşen props'larını da aynı şekilde türeteceksin.
:::

## Özet

- Fonksiyonlar ve bileşenler yalnızca kullandıkları alanları istemeli; bunun için küçük tipler gerekir.
- Küçük tipi elle kopyalama, kaynaktan türet: `Pick` birkaç alanı seçer, `Omit` birkaçını dışarıda bırakır.
- `Partial` her alanı isteğe bağlı yapar; patch tiplerinde kullanılır. `null` eklemez.
- `Record<K, V>` her anahtar için değer ister; anahtar listesi büyüyünce eksik olanı gösterir. `Readonly` üst seviyedeki alanları kilitler.
- İç içe yazılan tipleri içten dışa oku; açılımı görmek için editörde tipin üstüne gel.

**Kendini yokla:** `Watchlist`'e `tags: string[]` eklendi. `Omit<Watchlist, 'id' | 'createdAt'>` ile yazılmış taslak bu alanı alır mı? Aynı taslak `Pick` ile yazılmış olsaydı ne olurdu?  
*Cevap:* `Omit`'li taslak alır, çünkü `tags` hariç tutulanlar arasında değil. `Pick`'li taslak almaz, çünkü `tags` seçilenler arasında değil.

**Kendini yokla:** `Partial<{ note: string | null }>` neye açılır, `{}` ile `{ note: null }` arasındaki fark ne?  
*Cevap:* `{ note?: string | null }`. `{}` notu olduğu gibi bırakır, `{ note: null }` notu bilerek siler.
