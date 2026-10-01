---
title: "Sabit tabloları satisfies ile denetle"
minutes: 14
kind: concept
---

# Sabit tabloları `satisfies` ile denetle

Sinema sayfasında filtre düğmelerinin görünen yazıları kaynak kodunda sabit duruyor. İki filtren varsa ikisinin de yazısını tanımlamak istersin; ama tabloyu yalnızca genel bir nesne tipiyle açıklarsan yazım hatalarını fark etmek zorlaşır.

## Önce tabloyu kur, sonra sözleşmesini denetle

Bir **sözleşme**, burada nesnede bulunması gereken alanların ve değer türlerinin tarifidir. `Record<K, V>`, `K` anahtarlarının her birinde `V` türünde değer isteyen böyle bir sözleşmedir. Aşağıdaki örnekte `FilterName` izin verilen anahtarları belirler:

```ts check
type FilterName = 'all' | 'watched'

const FILTER_LABELS = {
  all: 'Tüm filmler',
  watched: 'İzlediklerim',
} satisfies Record<FilterName, string>
```

Bu tablo iki filtre anahtarını da içeriyor ve her yazı string. `satisfies` bu uyumu **derleme zamanında** kontrol eder: derleyici kodu çalıştırmadan önce yazdığın kaynak kodu inceler. Nesneyi `Record<FilterName, string>` tipine çevirmediği için `FILTER_LABELS` değişkeninin kendi çıkarılan yapısı korunur.

![Kaynak tablonun sözleşmeye uyumunun denetlenmesi ve literal tip çıkarımının korunması](diagrams/satisfies-kontrolu.svg "Sözleşmeyi denetle, çıkarılan tipi koru")

Şimdi anahtarı bilerek yanlış yazalım:

```ts
const FILTER_LABELS = {
  all: 'Tüm filmler',
  watced: 'İzlediklerim',
} satisfies Record<'all' | 'watched', string>
```

Derleyici `watched` eksik, `watced` ise izin verilmeyen bir anahtar diye işaretler. `Record<string, string>` yazsaydın her string anahtar kabul edileceği için bu yazım hatasını yakalayamazdı. Kapalı bir anahtar kümesi bu yüzden daha yararlıdır.

## Değerin tipini de gerektiğinde koru

Bazen alanın yalnızca string olduğunu bilmek yetmez; belirli bir sabit değere bağlı kalmasını istersin. Önceki derste gördüğün `as const`, bir literal değerin genel `string` tipine genişlemesini engeller. Aynı filtre tablosuna bunu ekleyelim:

```ts check
type FilterName = 'all' | 'watched'

const FILTER_LABELS = {
  all: 'Tüm filmler',
  watched: 'İzlediklerim',
} as const satisfies Record<FilterName, string>

const watchedLabel: 'İzlediklerim' = FILTER_LABELS.watched
```

Burada iki araç ayrı işler yapıyor: `as const` değerlerin literal tipini koruyor; `satisfies` beklenen iki anahtarın bulunduğunu ve değerlerin string olduğunu denetliyor. Sadece `satisfies` kullansaydın tablo yine denetlenirdi ama bu nesnedeki yazılar genellikle `string` olarak çıkarılırdı. `as const`'ı her nesneye ekleme; ancak kodun o kesin değere gerçekten ihtiyaç duyuyorsa kullan.

Bir Sinema detay ekranında filtrelerden başka, hangi bölümlerin gösterileceğini de sabit bir listede tutabiliriz. Bu kez listedeki değerlerden anahtar tipini çıkarıp ikinci tabloyu aynı sözleşmeye bağlayalım:

```ts check
const DETAIL_SECTIONS = ['overview', 'cast'] as const
type DetailSection = (typeof DETAIL_SECTIONS)[number]

const SECTION_LABELS = {
  overview: 'Genel bakış',
  cast: 'Oyuncular',
} as const satisfies Record<DetailSection, string>

function sectionLabel(section: DetailSection) {
  return SECTION_LABELS[section]
}
```

`DETAIL_SECTIONS` iki geçerli bölüm adını tutuyor; `DetailSection` bu iki değerden oluşan tipi çıkarıyor. Sonra `satisfies` her bölüm için bir başlık yazıldığını denetliyor. Yeni bölüm eklediğinde başlığını da eklemeyi unutursan derleme hatası alırsın; bu ilişkiyi kendin güncellemen gerekir.

Bir başka kaynak tablosu Sinema sayfalarının yollarını tutabilir. `keyof typeof` ile geçerli sayfa adlarını tablodan çıkarınca, fonksiyon yanlış bir sayfa adını kabul etmez:

```ts check
const PATHS = {
  discover: '/discover',
  favorites: '/favorites',
} as const satisfies Record<'discover' | 'favorites', string>

type PageName = keyof typeof PATHS

function pathFor(page: PageName): (typeof PATHS)[PageName] {
  return PATHS[page]
}
```

`pathFor('favorites')` için TypeScript yalnızca tabloda tanımlı yolların tipini verir. `pathFor`'a dışarıdan gelen rastgele bir string aktarırsan bu derleme zamanı güvencesi tek başına o değeri doğrulamaz; çalışma anında ayrıca kontrol gerekir. Bu tablo kaynak koddaki sabitlerle dışarıdan gelen verinin farklı sınırda olduğunu gösterir.

`as const` dizilerde sabit uzunluklu bir **tuple** (eleman sayısı ve sırası tipe yazılmış dizi) çıkarır. Önceki derste gördüğün tekniği Sinema sekme adlarında kullanırsan, elemanlardan izin verilen adları türetebilirsin:

```ts check
const DETAIL_TABS = ['overview', 'cast'] as const
type DetailTab = (typeof DETAIL_TABS)[number]
```

`DetailTab`, `'overview' | 'cast'` olur. Böylece liste hem ekranda kullanılacak değerleri tutar hem de başka fonksiyonların kabul edeceği adları sağlar. Tuple fikrini burada tekrar kullanıyoruz; `as const`'ın çalışma anında nesneyi dondurmadığı kuralı değişmiyor.

## Derleyicinin yaptığı işi sırayla izle

| Aşama | Derleyicinin gördüğü | Sonuç |
| --- | --- | --- |
| `DetailSection` tanımlanır | `'overview' \| 'cast'` | İzin verilen anahtarlar belli |
| `SECTION_LABELS` yazılır | İki gerçek alan ve iki string değer | Nesnenin kendi tipi çıkarılır |
| `as const` değerlendirilir | Literal değerler ve readonly alanlar | Başlıkların kesin metinleri korunur |
| `satisfies Record<...>` kontrol eder | Her zorunlu anahtar var mı, değerler string mi? | Eksik veya beklenmeyen anahtar hata verir |
| Sayfa çalışır | Normal JavaScript nesnesi okunur | `satisfies` kaynak koda ek davranış katmaz |

Son satır önemli: `satisfies` çalışma anında (kod çalışırken) veri denetlemez. API'den gelen JSON'u veya kullanıcı girişini güvenilir hâle getirmez. Bu araç, yalnızca TypeScript'in görebildiği kaynak kod tanımını kontrol eder.

## Gerçek bir karışıklık: “readonly” nesneyi dondurmaz

`as const` sonrasında TypeScript bir alanı değiştirmeye çalıştığında hata gösterir. Bu, JavaScript nesnesinin her koşulda değiştirilemez olduğu anlamına gelmez. `as const` derleyicinin gördüğü tipi daraltır; JavaScript'te nesneyi gerçekten dondurmaz.

:::mistake[Belirti: tabloyu başka bir yerde değiştiren kod hata veriyor]
Belirti → `as const` ekledikten sonra `SECTION_LABELS.cast = 'Kadrosu'` satırı TypeScript hatası veriyor.
Neden → Kaynak tablonun bu yerde sabit kalması istendi ve alan readonly tipinde.
Düzeltme → Başlıkları sonradan değiştirmek gerekiyorsa bu sabit tabloyu kullanma; değişebilir veriyi uygun bir tipte tut. Runtime'da JavaScript tarafından da değişiklik engellensin istiyorsan `Object.freeze` kullan.
:::

```ts check
const sectionLabels = Object.freeze({
  overview: 'Genel bakış',
  cast: 'Oyuncular',
})

// TypeScript alanı readonly görür; çalışma anında da nesne dondurulmuştur.
```

`Object.freeze`, nesneyi çalışma anında donduran JavaScript aracıdır. Bu örnekte alanlara yeni değer atamak engellenir. `Object.freeze` sığ dondurma yapar: iç içe nesneler varsa onları ayrıca dondurmaz. Çoğu sabit kaynak kod tablosunda derleme zamanı kontrolü yeterlidir; runtime'da da değişmesini engellemek gerçekten gerekiyorsa `Object.freeze` düşün.

:::info[Derinlemesine (isteğe bağlı): Dış veriyi doğrulamak]
`Object.freeze` iç içe nesneleri kendiliğinden dondurmaz. Ayrıca `satisfies` bir API cevabını kontrol etmez. Dışarıdan gelen verinin şeklini çalışma anında doğrulamak için `unknown` değer üzerinde guard veya şema kullanırsın; bunu type guard ve Zod konularında göreceksin.
:::

## Özet

- `satisfies Shape`, kaynak kodundaki bir değerin beklenen yapıya uyup uymadığını kontrol eder ve değişkenin çıkarılan tipini korur.
- `Record<Keys, Value>` kapalı bir anahtar kümesindeki bütün alanları zorunlu kılabilir.
- `as const` literal ve readonly tip görünümünü korur; `satisfies` ile farklı işleri tamamlar.
- `satisfies` ve `as const` çalışma anındaki veriyi doğrulamaz veya nesneyi dondurmaz; `Object.freeze` çalışma anında dondurur.

**Yeni terimler**

- **Sözleşme:** Bir değerde bulunması beklenen alanların ve türlerin tarifi.
- **Derleme zamanı:** TypeScript'in kodu çalıştırmadan önce kontrol ettiği aşama.
- **Runtime (çalışma anı):** Program çalışırken gerçekleşen aşama.

**Kendini yokla:** Bir tabloya `satisfies Record<'overview' | 'cast', string>` eklemek neyi yakalar?
*Cevap:* İki anahtardan biri eksikse veya tabloda izin verilmeyen bir anahtar varsa derleme hatası verir.

**Kendini yokla:** `as const` kaynak kodu tablosunu JavaScript'te gerçekten dondurur mu?
*Cevap:* Hayır. Tip görünümünü readonly yapar; çalışma anında dondurmak için `Object.freeze` gerekir.
