---
title: "Diziler ve tuple"
minutes: 17
kind: concept
---

# Diziler ve tuple

:::pain[Problem]
Bir API cevabındaki filmleri ekrana taşırken `results` yanlışlıkla tek bir `Movie` gibi modellenirse `.map()` kullanamazsın. Başka bir yerde `[number, number]` yerine `number[]` döndürüp bunun tam iki sayı olduğunu varsayarsan eksik eleman çalışma zamanında `undefined` çıkarabilir.
:::

## Koleksiyon tipi elemanların sözleşmesini taşır

`Movie[]` ve `Array<Movie>` aynı şeyi söyler: uzunluğu değişebilen, her elemanı `Movie` olan bir dizi. Köşeli parantez dış koleksiyonu, içindeki tip ise her konumda hangi değerin bulunabileceğini anlatır. Tip, dizinin kaç elemanlı olacağını söylemez; boş dizi de bir `Movie[]` olabilir.

Bir tip açıklaması JavaScript dizisini dönüştürmez ve eleman eklemez. Derleyici, yazdığın işlemlerin tip sözleşmesine uyup uymadığını denetler. Diziye yalnızca uygun elemanları eklediğini ve okurken eleman tipinin ne olduğunu denetlemesi için bu bilgi yeterlidir.

```ts check
type Performer = { name: string; role: string }
const cast: Performer[] = [
  { name: 'Ada Yılmaz', role: 'Yönetmen' },
  { name: 'Bora Demir', role: 'Oyuncu' },
]
cast.push({ name: 'Cem Kaya', role: 'Oyuncu' })
const names: string[] = cast.map((person) => person.name)
void names
```

Kuralları adım adım okuyalım:

1. `Performer[]`, eleman sayısını sabitlemez; sıfır eleman da, çok eleman da geçerlidir.
2. Her eleman `Performer` sözleşmesini karşılamalıdır. `role` alanı eksikse atama reddedilir.
3. Dizi metodları yeni dizi döndürdüklerinde eleman tipini kullandıkları işleme göre belirler.
4. TypeScript dizi uzunluğunu genel olarak sabit tutmaz; belirli indeksin her zaman dolu olduğunu sırf `T[]` tipinden çıkarmaz.

Bir dizi literalini ayrıca incele. `const` değişkeninin kendisi yeniden atanmadığı için derleyici başlangıç değerini bilebilir; ama bu, içindeki elemanların değiştirilemeyeceği anlamına gelmez. Bir fonksiyon parametresi `Performer[]` ise çağıran farklı uzunlukta dizi verebilir. Fonksiyon içinde “kesin üç kişi var” varsayımını uzunluk garantisi olmadan kurma.

```ts check
const genres = ['dram', 'komedi']
const firstGenre = genres[0]
genres.push('belgesel')
void firstGenre
```

Bu örnekte `genres` bir string dizisidir ve `push` ile büyüyebilir. `const` yalnızca `genres` değişkeninin başka diziye atanmasını engeller; dizi içeriğini dondurmaz. Elemanların yazılmasını da yasaklamak gerekiyorsa ayrı bir readonly sözleşme seçilir; burada öğreneceğin temel fark, değişken sabitliğiyle koleksiyon uzunluğunu karıştırmamaktır.

## map dönüştürür, filter seçer

`map` her eleman için callback çalıştırır ve callback sonucundan yeni bir dizi kurar. Kaynak elemanın şeklini korumak zorunda değildir: nesneden metin, sayıdan nesne üretebilirsin. `filter` ise koşulu sağlayan asıl elemanları seçer. Bu yüzden `filter` sonrası eleman tipi değişmez; sadece çalışma zamanındaki eleman sayısı azalabilir.

```ts check
type Episode = { title: string; minutes: number; published: boolean }
const episodes: Episode[] = [
  { title: 'Başlangıç', minutes: 12, published: true },
  { title: 'Taslak', minutes: 8, published: false },
]
const published = episodes.filter((episode) => episode.published)
const labels = published.map((episode) => `${episode.title} · ${episode.minutes} dk`)
void labels
```

İlk callback'te `episode` tipi `Episode` olarak çıkarılır; çünkü `.filter` bu dizinin metodudur. İkinci callback de `Episode` alır. Fakat onun gövdesi template string döndürdüğü için `labels` tipi `string[]` olur. Çıkarım, çağıran metodun imzası ve callback'in dönüş ifadesi üzerinden yapılır.

## Tuple konumların tipini ve sayısını sabitler

Dizi, her yerde aynı tipte eleman beklendiğinde uygundur. Tuple ise kısa bir sonucun konumlarına ayrı anlam verip gereken uzunluğu sabitler: `[string, number]` tam iki elemandır. İlk konuma metin, ikinciye sayı yazılır. İsimli elemanlar `pair.title` gibi erişim sağlamaz; çalışma zamanında tuple yine sıradan bir JavaScript dizisidir.

![Tuple'ın sabit konumları ile dizi elemanlarının aynı tipte oluşunu karşılaştıran şema](diagrams/array-tuple.svg)

1. `[A, B]` yazımı iki zorunlu konumu ve sıralarını belirtir.
2. `[A, B]` değerine yalnızca `A` türündeki ilk ve `B` türündeki ikinci eleman atanabilir.
3. `A[]` aynı tipte sıfır ya da daha fazla eleman kabul eder; `A` türündeki ikinci indeksin varlığını garanti etmez.
4. Anlamı alan adıyla daha açık anlatılacaksa nesne seç. `[id, title, poster]` yerine `{ id, title, poster }` okumak çoğu çağıran için daha nettir.
5. Değişkeni `number[]` diye yazmak tuple'ın uzunluk sözleşmesini kaybettirir; iki konum şartsa tuple tipini koru.

## Dönüşümü satır satır izleyelim

```ts check
type Track = { title: string; seconds: number }
const tracks: Track[] = [
  { title: 'Açılış', seconds: 80 },
  { title: 'Final', seconds: 125 },
]
const longTracks = tracks.filter((track) => track.seconds >= 100)
const durations: [string, number][] = longTracks.map((track) => [track.title, track.seconds])
void durations
```

| Satır / adım | Çalışma zamanı değeri | Değişken veya ifade tipi | Derleyicinin gerekçesi |
| --- | --- | --- | --- |
| `tracks` | İki nesne | `Track[]` | Açık anotasyon eleman sözleşmesini verir |
| `track` callback'i | Önce Açılış, sonra Final | `Track` | Parametre dizi metodundan bağlamı alır |
| `track.seconds >= 100` | `false`, sonra `true` | `boolean` | Karşılaştırma boolean üretir |
| `longTracks` | Yalnız Final | `Track[]` | `filter` aynı eleman tipinde dizi döndürür |
| `map` callback sonucu | `['Final', 125]` | `[string, number]` | Açık bağlam tuple'ın iki yerini tanımlar |
| `durations` | Bir çift içeren dizi | `[string, number][]` | Dış uzunluk değişken, her iç tuple sabit çift |

Çıkarımın bazen beklediğin kadar dar olmaması da normaldir. `const pair = ['Açılış', 80]` gibi değişken bir dizi literalinde TypeScript bunu `[string, number]` tuple'ı değil, genellikle `(string | number)[]` gibi bir dizi olarak çıkarır; çünkü sırayı ve uzunluğu sonradan değiştirmek mümkün olabilir. Tuple'ı başka tuple gerektiren yere vereceksen tipi açıkça belirt veya bağlama uygun `as const` kullan. İkinci seçenek değerleri readonly yapar; mutable tuple bekleyen API ile birebir aynı değildir.

`[string, number][]` ile `[string[], number[]]` gözle benzer görünse de farklı sözleşmelerdir. İlki çok sayıda ikili çift tutar; ikincisi iki konumlu tek tuple tutar ve bu konumların kendileri dizidir. Tip açıklamalarını dıştan içe okumak karışıklığı önler.

## Önce hata, sonra sözleşmeye uygun kod

Bir elemanı tek başına tuttuğun halde dizi metodu çağırırsan derleyici bunu yakalar:

```ts
 type Track = { title: string }
 const track: Track = { title: 'Açılış' }
 track.map((item) => item.title)
```

Derleyici hatası: `TS2339: Property 'map' does not exist on type 'Track'.` Türkçesi: `track` bir Track nesnesi; bu tipte `map` metodu yok. Gerçekten koleksiyon istiyorsan değerin de tipin de dizi olmalı.

```ts check
type Track = { title: string }
const tracks: Track[] = [{ title: 'Açılış' }]
const titles = tracks.map((track) => track.title)
const pair: [string, number] = ['Açılış', 80]
void titles; void pair
```

Bir diğer hata, tuple'a eksik eleman vermektir:

```ts
type Range = [number, number]
const range: Range = [4]
```

Derleyici hatası: `TS2322: Type '[number]' is not assignable to type 'Range'. Source has 1 element(s) but target requires 2.` Türkçesi: bir elemanlı dizi, iki zorunlu konumu olan tuple'a atanamaz.

:::mistake[Dizi tipini tek elemana vermek]
Belirti → `TS2339` ile `map` bulunamadığı söylenir. Neden → Değişken tipi `Track`; değer tek nesnedir. Düzeltme → Koleksiyon amaçlandıysa `Track[]` kullan ve başlangıç değerini de dizi yap.
:::

:::mistake[Tuple'ı genel dizi diye genişletmek]
Belirti → İkinci indeksin kesin dolu olduğu varsayımı tipten anlaşılamaz. Neden → `number[]` uzunluğu sabitlemez. Düzeltme → İki konumlu sonuç için `[number, number]` yaz.
:::

:::mistake[map'i yalnızca yan etki için kullanmak]
Belirti → Koddan dönen dizi kullanılmıyor, asıl liste değişmiş. Neden → `map` dönüştürme için yeni dizi üretir; callback içindeki mutasyon bu amacı saklar. Düzeltme → Yeni değer döndür; yalnızca yan etki gerekiyorsa açıkça uygun döngü kullan ve React state dizisini yerinde değiştirme.
:::

:::sector
Ekiplerde API koleksiyonları `Movie[]` gibi açık yazılır; okuyucu eleman sözleşmesini tek bakışta bulur. Tuple kısa ve sırası değişmeyecek sonuçlarda yararlıdır; indekslerin anlamı açıklama gerektiriyorsa adlandırılmış alanları olan nesne kod incelemesinde daha kolay okunur.
:::

## Uzunluk bilgisi nerede kaybolur?

Bir API dizisi çoğu zaman boş da olabilir; dolayısıyla `items[0]` erişimi verinin gerçekten bulunduğunu garanti etmez. `noUncheckedIndexedAccess` açıksa TypeScript bunu `T | undefined` olarak gösterir. Bayrak kapalı olsa bile uygulamanın veri sözleşmesi ilk elemanın varlığını garanti etmiyorsa sınırda kontrol etmen gerekir. `find` de eleman bulamayabileceği için sonuç olarak `T | undefined` verir; `filter` ise her zaman dizi döndürür ve sonucu boş olabilir. Bu üç işlemin dönüş tipleri, “yok” olasılığının nerede bulunduğunu anlatır.

Dizilerde sıra önemlidir ama indeks tek başına anlam taşımaz. `tracks[0]` ilk parçayı verir; `tracks[1]` ikinci parçayı verir. Tuple kullanımı ancak bu indekslerin sabit anlamı varsa yararlıdır. Uzun bir koleksiyonda “1. konum başlık, 2. konum yıl” sözleşmesi kurmak yerine her elemanı nesne yapmak, çağıranın yanlış indeks kullanmasını önler.

## Özet

- `T[]` değişken uzunlukta bir koleksiyondur; her eleman `T` sözleşmesine uyar.
- `map` callback dönüşlerinden yeni eleman tipi çıkarır; `filter` aynı eleman tipini koruyarak seçim yapar.
- `[A, B]` tuple'ı uzunluğu, her konumun tipini ve sırasını sabitler.
- Bir `T[]` tipi belirli bir indeksin dolu olduğunu garanti etmez.
- Konumların adı önemliyse tuple yerine nesne seç.

**Kendini yokla:** `[{ name: 'Ada', score: 4 }].map((x) => x.name)` hangi tiptedir?

*Cevap:* `string[]`; her nesneden bir string üretilir.

**Kendini yokla:** `[number, number][]` neyi anlatır?

*Cevap:* Uzunluğu değişebilen bir dizi; her elemanı tam iki sayıdan oluşan tuple'dır.
