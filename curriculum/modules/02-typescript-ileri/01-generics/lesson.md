---
title: "Generics: tipi taşıyan yer tutucu"
minutes: 14
kind: concept
---

# Generics: tipi taşıyan yer tutucu

`string[]` yazdığında aslında `Array<string>` yazmış oluyorsun: “içinde metinler olan bir dizi.” React'te de `useState<number>(0)` ve `useState<Movie | null>(null)` kullandın. `<number>` ve `<Movie | null>`, React'in state tipini bilmesini sağlıyor. Yani generic kullandın; şimdi bir tane kendin yazacaksın.

Bir **generic**, bir fonksiyonun veya tipin başka bir tip bilgisini alıp onu giriş ve çıkış arasında korumasını sağlayan yapıdır. İlk olarak, listedeki ilk filmi veren küçük bir fonksiyona bakalım.

## İlk filmi alırken tipi kaybetme

Sinema'da film başlığı ekranda görünecek. `first` fonksiyonuna film dizisi verip ilk filmi almak istiyorsun. Elindeki tipi koruyarak yazmak yerine her şeyi `any` yaparsan, TypeScript sonucu denetleyemez:

```ts check
function first(items: any[]): any {
  return items[0]
}

type Movie = { id: number; title: string }
const movie = first([{ id: 550, title: 'Dövüş Kulübü' }])
const title: string = movie.titel
```

`titel` yanlış yazılmış olsa da bu kod derlenir. Çünkü `any`, “bu değerin tipini denetleme” demenin kısa yoludur. `any` yerine `Movie` yazarsan yazım hatası yakalanır; ama bu kez fonksiyon yalnızca filmleri kabul eder:

```ts check
type Movie = { id: number; title: string }

function firstMovie(items: Movie[]): Movie | undefined {
  return items[0]
}
```

Tür listesi verirsen bu fonksiyona uymaz. Aynı işi hem filmle hem türle yapacak bir fonksiyon istiyorsun; sonuç da hangi listeyi verdiysen o listenin öğe tipini korumalı.

Bu ilişkiyi kurmak için fonksiyonun yanına bir **tip parametresi** (type parameter) koyarsın. Tip parametresi, çağıranın getirdiği tipi fonksiyonun içinde kullanmana yarayan bir isimdir; burada bu isim `T` olacak.

```ts check
type Movie = { id: number; title: string }

function first<T>(items: T[]): T | undefined {
  return items[0]
}

const movie = first([{ id: 550, title: 'Dövüş Kulübü' }])
const title: string | undefined = movie?.title
```

`T[]`, “T tipindeki değerlerin dizisi” demektir. İlk çağrıda `T`, `{ id: number; title: string }` olur. Dizi boşsa ilk öğe bulunmadığı için `undefined` gelir; bu yüzden dönüş tipi `T | undefined`. `any` kullanmadık, o nedenle `movie.titel` yazsaydın TypeScript hata verirdi.

`first` çağrısında `<Movie>` yazmadık. TypeScript argümandaki nesnelerin alanlarına bakıp `T`'nin ne olduğunu kendisi buldu. Bu bulmaya **çıkarım** (inference) denir; çıkarım, TypeScript'in verilen değerlerden tipi belirlemesidir. Bir fonksiyonun parametresinden tipi anlayabiliyorsa genellikle ayrıca yazman gerekmez.

## Aynı sayfa kabuğu, farklı sonuçlar

TMDB listelerinde sayfa bilgileri ortaktır: `page`, `total_pages` ve `total_results`. Değişen bölüm `results` içindeki öğelerdir. Popüler filmler için öğe `Movie`, tür listesindeyse `Genre`, oyuncu aramasındaysa `Person` olabilir. Her biri için sayfalama alanlarını baştan yazmak yerine bu kez bir generic type tanımlayalım.

```ts check
type Movie = { id: number; title: string }
type Genre = { id: number; name: string }
type Person = { id: number; name: string; known_for: string[] }

type Paginated<T> = {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

const movies: Paginated<Movie> = {
  page: 1, results: [{ id: 550, title: 'Dövüş Kulübü' }], total_pages: 4, total_results: 61,
}
```

`Paginated<Movie>` yazınca yalnızca `results` içindeki öğelerin tipi `Movie[]` olur; sayfa alanları hep sayı kalır. `Paginated<Genre>` ve `Paginated<Person>` de aynı kabuğu kendi öğe tipleriyle kullanır. Sonraki derslerde TMDB sayfalarını bu `Paginated<T>` şekliyle düşünebilirsin.

![Tip parametresinin tanımdan çağrıya ve sonuç alanına taşınması](diagrams/generic-akisi.svg "Generic tipi girişten sonuca taşır")

## `id` alanını okumak için gereken bilgi

`first` fonksiyonuna ne verirsen `T` o olabilir: film, tür, metin ya da sayı. Bu nedenle fonksiyon içinde `item.id` yazmak güvenli değildir. Mesela sayıların `id` alanı yok. TypeScript böyle bir satırda şuna benzer bir hata verir:

```text
Property 'id' does not exist on type 'T'.
```

Bu aramada her öğeden yalnızca bir şey istiyorsun: sayısal `id`. Bir **kısıt** (constraint), tip parametresine “şu özelliği taşımalı” şartı koyar; `extends { id: number }` bu şartı ifade eder.

```ts check
function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find((item) => item.id === id)
}

type Movie = { id: number; title: string }
const found = findById([{ id: 550, title: 'Dövüş Kulübü' }], 550)
const title: string | undefined = found?.title
```

Kısıt, filmi yalnızca `{ id: number }` haline getirmez. `findById` eşleşen nesnenin kendisini döndürür; `title` bilgisi de durur. Aradığın ID listede olmayabileceği için `undefined` olasılığı da durur.

:::mistake[Her şeyi any yapmak]
Belirti → `movie.titel` yazım hatası derlenir. Neden → `any`, tip denetimini kapatır. Düzeltme → Girişteki tipi sonuçta da koruyan generic kullan.
:::

:::mistake[Sonucun hep bulunduğunu varsaymak]
Belirti → `first(items).title` boş liste ihtimali yüzünden hata verir. Neden → Dizi boş olabilir. Düzeltme → `undefined` durumunu `?.` veya bir koşulla ele al.
:::

:::model[Tipler derleme sırasında vardır]
TypeScript tipleri ve generics yalnızca kod yazarken hata bulmaya yarar; TMDB'den gelen JSON'u çalışırken incelemez veya doğrulamaz. Dış veriyi güvenle kullanmak için ayrıca kontrol etmek gerekir.
:::

## Özet

- Generic, `T` tip parametresiyle verilen öğenin tipini sonuçta korur; TypeScript bu tipi argümandan çıkarabiliyorsa `<Movie>` gibi ayrıca yazman gerekmez.
- `Paginated<T>` sayfa alanlarını sabit tutar, `results` öğe tipini değiştirir. `any` kullanmak yanlış alan adlarını gizler.
- Bir generic fonksiyonda `id` gibi bir alanı okumak için `extends { id: number }` kısıtını koyarsın; diğer alanlar `T` içinde korunur.

**Yeni terimler:**
- **Generic:** Girişteki tipi başka bir fonksiyon ya da tipe taşıyan yapı.
- **Tip parametresi:** Generic içinde gelen tipi temsil eden ad; örneğin `T`.
- **Çıkarım:** TypeScript'in verilen değerlerden tipi bulması.
- **Kısıt:** Tip parametresinin taşıması gereken özelliği belirten şart.

**Kendini yokla:** `first([{ id: 18, name: 'Dram' }])` sonucunun tipi nedir?  
*Cevap:* `{ id: number; name: string } | undefined`.

**Kendini yokla:** `T extends { id: number }` diğer alanları siler mi?  
*Cevap:* Hayır. Her öğede sayısal `id` olmasını şart koşar; `T`'nin diğer alanları sonuçta korunur.
