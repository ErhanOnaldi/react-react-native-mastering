---
title: "Fonksiyon tipleri"
minutes: 14
kind: concept
---

# Fonksiyon tipleri

:::pain[Problem]
Film puanını kartta ve detay sayfasında ayrı ayrı biçimlendirdin. Birinde `7.5`, diğerinde `7.456` görünüyor; iki yerin aynı sözleşmeyi paylaşmasını istiyorsun.
:::

## Fonksiyon imzası çağıranın sözleşmesidir

Parametre tipleri çağıranın ne gönderebileceğini, dönüş tipi de fonksiyonun ne vereceğini söyler. Açık dönüş tipi özellikle başka dosyaların kullandığı fonksiyonlarda niyeti görünür kılar ve her dalın aynı sözleşmeyi karşılamasını sağlar.

```ts check
function labelTemperature(celsius: number): string {
  return `${celsius} °C`
}
const label = labelTemperature(21)
void label
```

Bir fonksiyonun tipi kabaca `(girdi) => çıktı` biçiminde okunur. Buradaki girdi tek sayı; çıktı metindir. Fonksiyon çağrısı `number` bekleyen yere string verirse derleme hatası alırsın. Bu, çalışma zamanında dönüşüm yapmaz; kod yazarken sözleşme uyuşmazlığını yakalar.

## Parametre ve dönüş tipleri nasıl çıkarılır?

Fonksiyon bildirimi iki yönlü bir sözleşme kurar: çağıran argümanları parametre tiplerine atanabilir olmalı, gövdenin döndürdüğü her değer de dönüş tipine atanabilmelidir. Bu ilişki şu kurallarla okunur:

1. Parametre anotasyonu çağrı noktasında hangi girdilerin kabul edildiğini belirler. `number` bekleyen yere string verilemez.
2. Açık dönüş tipi yazıldığında her `return` ifadesi o tipe atanabilir olmalıdır; farklı dallardaki dönüşler de aynı sözleşmeye uymalıdır.
3. Dönüş tipi yazılmadıysa TypeScript gövdedeki `return` ifadelerinden ortak bir tip çıkarır. Anotasyon, özellikle dışarı açılan fonksiyonun niyetini ve hatayı nerede yakalayacağını netleştirir.
4. Tip anotasyonu runtime dönüşümü yapmaz. `: string` yazmak sayıyı metne çevirmediği gibi, yanlış dönen değeri de düzeltmez; uyumsuzluğu derleme sırasında reddeder.

Aşağıdaki fonksiyonun imzasını `(number) => string` olarak okuyabilirsin: tek sayı girdi, metin çıktı. Değerin gerçek dönüşü de bu sözleşmeye uymalıdır.

## Varsayılan değer, gerçek davranıştır

İsteğe bağlı parametreyi yalnızca `digits?: number` diye yazmak, eksik argümanın nasıl kullanılacağını belirlemez. Varsayılanı imzada verdiğinde hem çağıran argümanı atlayabilir hem de gövde belirli bir değerle çalışır.

```ts check
function formatTemperature(celsius: number, digits = 1): string {
  return celsius.toFixed(digits)
}
const a = formatTemperature(21.25)
const b = formatTemperature(21.25, 2)
void a; void b
```

| Çağrı | `digits` değeri | Sonuç |
| --- | --- | --- |
| `formatTemperature(21.25)` | varsayılan `1` | `21.3` |
| `formatTemperature(21.25, 2)` | açıkça `2` | `21.25` |

Varsayılan parametrenin tipi sayı olarak çıkarılır. `digits` atlanırsa gövde `undefined` görmez; varsayılan değer atanır. Bu yüzden `digits?: number` ile `digits = 1` aynı davranış değildir.

## Varsayılan parametre çağrıdan gövdeye
İsteğe bağlı parametre ve union tipini de ayır: `digits?: number`, çağıran için parametrenin atlanabilir olduğunu söyler; gövde içinde parametre `number | undefined` olabilir. `digits = 1` de argümanı atlamaya izin verir, fakat varsayılan uygulanınca gövde değeri `number` olur. Bir varsayılan seçimin yoksa `?` kullanıp `undefined` dalını açıkça ele al; her zaman bir değer gerekiyorsa varsayılanı parametrede belirt.

Parametrelerin sırası da çağrı sözleşmesidir. Varsayılanlı parametreden sonra varsayılanı olmayan zorunlu parametre koymak çağrıyı belirsiz ve kullanışsız hale getirir; opsiyonel girdileri sona yerleştirmek çağıranın argümanları sırayla vermesini kolaylaştırır. Fonksiyon tipini okurken hangi argümanların atlanabildiğini ve hangi dönüşlerin vaat edildiğini ayrı ayrı incele.

## Liste callback'lerinde tip çıkarımı

Bir dizi `Reading[]` ise `.map()` callback'indeki her `reading` otomatik olarak `Reading` tipindedir. Bu bilgi, callback'i çağıran metodun tipinden çıkar. Her parametreye `any` yazmak bu yardımı kapatır ve yanlış alan adını saklayabilir.

```ts check
type Reading = { station: string; value: number }
function labels(readings: Reading[], unit = '°C'): string[] {
  return readings.map((reading) => `${reading.station}: ${reading.value}${unit}`)
}
const result = labels([{ station: 'Kadıköy', value: 21 }])
void result
```

İz sürme: `readings` parametresi `Reading[]`; `.map` her öğe için `Reading` callback argümanı sağlar; template string her öğe için `string` üretir; dolayısıyla dönüş `string[]` olur. `unit` verilmezse `°C`; verilirse çağıranın birimi kullanılır. Kaynak dizi değiştirilmez.

| Satır / çağrı | `readings` tipi | `reading` tipi | `unit` tipi ve değeri | Sonuç |
| --- | --- | --- | --- | --- |
| Fonksiyon girişi | `Reading[]` | — | `string`, varsayılanı `°C` | — |
| `labels([…])` | Argüman `Reading[]` ile uyumlu | — | Argüman atlandı | Gövde `°C` ile çalışır |
| `.map((reading) => …)` | Eleman tipi `Reading` | `Reading` | `string` | Callback her öğede metin döndürür |
| Fonksiyon dönüşü | Kaynak değişmez | — | — | `string[]` |

Bu bağlamsal çıkarım sayesinde callback'e `reading: Reading` tekrarını eklemek şart değildir. Parametre adını değiştirmek tipi değiştirmez; dizi parametresinin sözleşmesi aynı kaldıkça callback argümanı `Reading` olur. Buna karşılık diziyi `any[]` yaparsan kaynağın sağladığı kanıtı kaybedersin.

## Önce kırık, sonra doğru

Bu örnek çağırana sayı döneceğini ima eder, ama metin biçimlendirir:

```ts
function formatDistance(km: number): number {
  return `${km} km`
}
```

Derleyici hatası: `TS2322: Type 'string' is not assignable to type 'number'.` Türkçesi: fonksiyon string döndürüyor ama imza number vaat ediyor. Çağıranlar sözleşmeye güvenebildiği için bu uyuşmazlık fonksiyon tanımında düzeltilmelidir.

Tip sözleşmesini gerçek çıktıyla eşleştir:

```ts check
function formatDistance(km: number): string {
  return `${km} km`
}
void formatDistance
```

:::mistake[Varsayılanı yalnızca opsiyonel işaretlemek]
Belirti → Parametre atlanınca biçim beklenenden farklı. Neden → `?` sadece argümanın atlanabileceğini söyler; gövdeye kullanılacak değer sağlamaz. Düzeltme → Gövdede varsayılan belirle ya da parametrede `digits = 1` yaz.
:::

:::mistake[Callback'e any eklemek]
Belirti → Yanlış alan adı sessizce geçiyor. Neden → `any` eleman tipini devre dışı bırakır ve `Reading` sözleşmesini kaybettirir. Düzeltme → Dizinin eleman tipinden çıkarımı kullan.
:::

:::mistake[Her yerde tip tekrarlamak]
Belirti → Kod uzuyor, aynı bilgi iki kez yazılıyor. Neden → Callback'in tipi zaten giriş dizisinden çıkarılıyor. Düzeltme → Sınırdaki fonksiyon imzasını açık tut; yerel callback parametresini çıkarıma bırak.
:::

:::sector
Paylaşılan biçimlendirme fonksiyonları kartların aynı çıktıyı üretmesini sağlar. Açık parametre ve dönüş tipleri, dosyalar arası kullanımı kolaylaştırır; küçük callback'lerde doğru çıkarımı korumak gürültüyü azaltır.
:::

## Fonksiyon satırlarını baştan sona izleyelim

```ts check
function formatDistance(km: number, digits = 0): string {
  if (km < 0) return 'Geçersiz mesafe'
  return `${km.toFixed(digits)} km`
}
const label = formatDistance(12.6)
void label
```

| Sıra | İfade | Tip / değer | Açıklama |
| --- | --- | --- | --- |
| Bildirim | `km: number` | `number` | Çağıran sayı vermeli |
| Bildirim | `digits = 0` | `number`, opsiyonel çağrı argümanı | Varsayılan, parametre tipini sayı olarak çıkarır |
| Çağrı | `formatDistance(12.6)` | `km` değeri `12.6`, `digits` değeri `0` | Atlanan argüman varsayılanı alır |
| Koşul | `km < 0` | `false`, tipi `boolean` | Bu örnekte hata dalı çalışmaz |
| `toFixed(digits)` | `'13'` | `string` | Sayı biçimlendirildiğinde metne dönüşür |
| Dönüş | `'13 km'` | `string` | İmzadaki dönüş tipiyle uyumlu |

Sayı biçimlendirme yuvarlama yaptığı için görüntülenen metin orijinal sayının kendisi değildir. Fonksiyonun `string` döndürmesi bu yüzden doğru sözleşmedir. Eğer çağıran hesaplama yapacaksa sayı saklanmalı; yalnızca arayüz etiketi gerekiyorsa metin döndürülmelidir.

:::mistake[İsteğe bağlı parametreyi varsayılan sanmak]
Belirti → Argüman verilmeden çağrıda gövde `undefined` ile karşılaşıyor veya API'ye `undefined` aktarılıyor. Neden → `digits?: number` çağrıyı opsiyonel yapar ama değer üretmez. Düzeltme → Değer gerektiğinde `digits = 1` kullan ya da gövdede `digits ?? 1` ile seç.
:::

:::mistake[Dönüş tipini gerçek çıktıyla karıştırmak]
Belirti → `TS2322` dönüş satırını işaretliyor. Neden → Açık imza ile `return` ifadesinin tipi atanabilir değil. Düzeltme → Ya doğru çıktıyı üret ya da gerçekten amaçlanan sözleşmeye göre dönüş tipini güncelle.
:::

Fonksiyon gövdesinde birden fazla dönüş kolu varsa her kolun değerini ayrı kontrol et. Bir kol metin, diğeri sayı döndürüyorsa TypeScript anotasyon yokken ortak sonucu `string | number` çıkarabilir; `: string` anotasyonu varsa sayı döndüren kol derleme hatası verir. Bu koruma, çağıran tarafın fonksiyon sonucunu koşulsuz metin gibi kullanabilmesi için önemlidir. `return` yazmayan fonksiyonun sonucu `undefined` olur; yan etkisi olan bildirimlerde dönüş beklentisini buna göre düşün.

Callback'ler de fonksiyon sözleşmesidir. `.map` gibi generic metodlar kaynak eleman tipini callback'in parametresine bağlamış olur, dönüş değerinden de yeni dizi tipini çıkarır. Callback'in parametresine gerekmedikçe anotasyon eklememek tip bilgisini azaltmaz; tersine, doğru kaynak sözleşmesinin kullanılmasını sağlar. Açık fonksiyon imzasını sınırda, çıkarımı ise yerel dönüşümlerde tercih etmek ekip kodunu daha kısa ve tutarlı tutar.

## Fonksiyonların atanabilirliği çağrıda görünür

Derleyici parametreleri çağrı anında karşılaştırır. `labelTemperature(21)` geçerlidir, ama `labelTemperature('21')` değildir; parametrenin beklediği sayı yerine metin verilmiştir. Dönüş tipi ise çağrı ifadesinin tipidir: `const label = labelTemperature(21)` satırında `label` string olur. Fonksiyonun deklarasyonuna dönüş tipi yazsan da yazmasan da çağıran taraf gövdeye değil bu imzaya göre denetlenir.

Fonksiyon imzası, küçük bir ekip API'si gibi davranır. Parametre adı açıklık sağlar ama çağıranın argüman sırasını değiştirmez; parametre tipi ve varsayılan davranış gerçek sözleşmedir. Bir fonksiyon paylaşılacaksa imzayı anlaşılır tut, her `return` kolunun o sözleşmeye uyduğunu doğrula.

## Özet

- Parametre tipi girişi, dönüş tipi çıktıyı tanımlar.
- Varsayılan parametre atlanınca çalışacak değeri belirler.
- Dizi callback'i eleman tipini kaynağından çıkarır.
- `any` eklemek güvenliği azaltır; gerekli olmayan tip tekrarından kaçın.

Kendini yokla: `function f(n: number, digits = 2)` ikinci argüman verilmeden çağrılabilir mi? Cevap: Evet; varsayılan değer kullanılır.

Kendini yokla: `Reading[]` üzerinde map callback'inin elemanı nasıl tiplenir? Cevap: TypeScript `Reading` olarak çıkarır.
