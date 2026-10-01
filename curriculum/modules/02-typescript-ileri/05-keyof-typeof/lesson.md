---
title: "Değerlerden anahtar tipleri çıkar"
minutes: 16
kind: concept
---

# Değerlerden anahtar tipleri çıkar

Bir Sinema filmi için sıralama menüsünde `title` ve `releaseYear` alanlarını kullanıyorsun. Bu adları hem film tipinde hem menüde ayrı ayrı yazarsan, birine yeni alan ekleyip ötekini güncellemeyi unutabilirsin. TypeScript, bu isimleri var olan bir nesne tipinden veya tek bir sabit listeden çıkarmana yardım eder.

## Anahtar adını tipten al

Film nesnesinin kendisiyle başlayalım:

```ts check
type Movie = { id: number; title: string; releaseYear: number }

type MovieKey = keyof Movie
type TitleValue = Movie['title']

const key: MovieKey = 'title'
const title: TitleValue = 'Arrival'
```

`keyof Movie` bize alan adlarının union tipini verir: `'id' | 'title' | 'releaseYear'`. `Movie['title']` ise anahtar adını değil, o alanda tutulan değerin tipini alır; sonuç `string` olur. Bu ayrım, menü seçenekleri için anahtar adı, alandaki bilgiyi kullanırken de değer tipi gerektiği için önemlidir.

![Bir nesne tipinin anahtarlarından ve seçilen anahtarın değerinden iki ayrı tip çıkarılması](diagrams/keyof-akisi.svg "Anahtar adı ve alan değeri")

Köşeli parantezli tipe **indexed access** (indeksli erişim) denir. `Movie['title']` derken çalışma anında filmden bir değer okumuyoruz; yalnızca tip alanında `title` alanının tipini seçiyoruz. Gerçek bir değeri okumak için JavaScript kodunda `movie.title` yazarsın.

## Değeri gör, tipini çıkar

Şimdi sabit bir değeri ele alalım. `typeof` JavaScript’te gerçek bir değişken veya sabitin tipini TypeScript tarafında kullanmamızı sağlar:

```ts check
const sortLabels = {
  title: 'Film adı',
  releaseYear: 'Vizyon yılı',
}

type SortKey = keyof typeof sortLabels
type SortLabel = (typeof sortLabels)[SortKey]

const selected: SortKey = 'releaseYear'
const label: SortLabel = sortLabels[selected]
```

Burada `typeof sortLabels` önce değişkenin nesne tipini çıkarır; `keyof` da bu tipin anahtarlarını alır. Sonuçta `SortKey`, iki alan adının union'ıdır. Bu yöntem, sabit nesnenin adlarını ikinci kez elle yazma ihtiyacını azaltır.

`typeof` yalnızca JavaScript çalışma zamanında gerçekten bulunan bir değer için kullanılır. `type Movie = ...` gibi bir type alias çalışma zamanında değişken değildir; `typeof Movie` yazamazsın. Type alias’ın anahtarları gerekiyorsa `keyof Movie` dersin.

## Sabit diziden seçenek tipi çıkar

Menü sırasını doğrudan bir dizide tutalım. Böyle bir sıranın tip içindeki adı **tuple**’dır: eleman sayısı ve her konumdaki değerleri bilinen dizi tipi. `as const`, TypeScript’in bu dizideki metinleri genel `string` yerine tek tek literal değer olarak saklamasını sağlar.

```ts check
const MENU_KEYS = ['title', 'releaseYear'] as const
type MenuKey = (typeof MENU_KEYS)[number]

const firstField: MenuKey = 'title'
```

`(typeof SORT_FIELDS)[number]` tuple’ın her konumundaki değer tiplerini alıp bir union yapar. Burada sonuç `'title' | 'releaseYear'`. `as const` olmasaydı dizi tipi `string[]` olur ve `SortField` çok geniş `string` haline gelirdi; `'releseYear'` gibi yazım hatalarını artık yakalayamazdık.

Tipten union çıkarmak derleme zamanı işidir. Bir URL parametresi hâlâ çalışma anında gelen sıradan bir string’dir; onu otomatik olarak `SortField` yapmaz. Dış girdiyi listedeki gerçek değerlere karşı kontrol edelim:

```ts check
const MENU_KEYS = ['title', 'releaseYear'] as const
type MenuKey = (typeof MENU_KEYS)[number]

function isMenuKey(value: string): value is MenuKey {
  return MENU_KEYS.some((field) => field === value)
}

function menuText(field: MenuKey): string {
  switch (field) {
    case 'title': return 'Film adı'
    case 'releaseYear': return 'Vizyon yılı'
  }
}

const queryValue: string = 'releaseYear'
const label = isMenuKey(queryValue) ? menuText(queryValue) : 'Sıralama seçilmedi'
```

Bu dizi bir **allowlist**’tir: yalnızca açıkça listelenmiş değerlere izin veren kabul listesi. Guard (`isMenuKey`) URL gibi dışarıdan gelen değerin listede bulunup bulunmadığını çalışma anında kontrol eder. Guard true döndürdükten sonra metin fonksiyonuna güvenli biçimde verebiliriz.

## Alan değerinin tipini seçilen anahtara bağla

Bir alanın değerini okuyan genel bir yardımcı yazarken seçilen anahtar ile dönüş tipini bağlı tutmak isteriz. **Generic** fonksiyonlarda kullandığımız `K`, bu örnekte `keyof T` ile sınırlandırılır; `T[K]` de seçilen alanın tipini ifade eder. Farklı anahtarlar farklı sonuç tipleri verdiği için bu bağ, genel `string | number` sonucundan daha kesindir.

Film satırındaki alanı, o alana uygun biçimlendiriciyle metne çevirelim:

```ts check
type FilmRow = { title: string; voteAverage: number }

function describeFilmField<T, K extends keyof T>(
  movie: T,
  key: K,
  format: (value: T[K]) => string,
): string {
  return format(movie[key])
}

const titleText = describeFilmField(
  { title: 'Arrival', voteAverage: 7.9 },
  'title',
  (title) => title.toUpperCase(),
)
const scoreText = describeFilmField(
  { title: 'Arrival', voteAverage: 7.9 },
  'voteAverage',
  (score) => `${score}/10`,
)
```

İlk çağrıda `K` değeri `'title'` olur, bu yüzden biçimlendirici string alır. İkinci çağrıda `K`, `'voteAverage'` olur ve biçimlendirici sayı alır. `key` parametresini herhangi bir string bıraksaydık hem olmayan alan adları kabul edilirdi hem de biçimlendiricinin alacağı tip belirsizleşirdi.

## Bir yazım hatasını erkenden yakala

Şu iki kaydı ayrı ayrı tuttuğunu varsay:

```ts
type MenuKey = 'title' | 'releaseYear'
const visibleFields = ['title', 'releaseYear', 'voteAverage']
```

Menü `voteAverage` seçeneğini gösterir ama `MenuKey` tipi bunu kabul etmez. Tersinde, tipe bir seçenek ekleyip menüyü güncellemeyi unutabilirsin. Tek sabit tuple kullanıp tipi ondan türetmek iki kaydı aynı kaynağa bağlar.

:::mistake[Belirti: `typeof Movie` derlenmiyor]
`Movie` bir type alias’tır, çalışma zamanında değeri yoktur. Tipten anahtar alacaksan `keyof Movie`; gerçek `movie` değişkeninin tipini çıkaracaksan `typeof movie` kullan.
:::

:::mistake[Belirti: yazım hatalı URL değeri geçerli görünüyor]
`MenuKey` derleme zamanı tipidir; URL stringini doğrulamaz. Stringi önce sabit listedeki değerlerle karşılaştıran guard’dan geçir.
:::

:::info[Derinlemesine (isteğe bağlı): `Object.keys`]
`Object.keys(movie)` çalışma anında anahtar dizisi verir ve genellikle `string[]` olarak tiplidir. Nesnenin runtime halinde tipte yazandan fazla anahtarı bulunabileceği için bunu her durumda `(keyof T)[]` diye kabul etmek güvenli değildir. Kapalı ve kontrolü sende olan veri için özel bir karar verebilirsin; genel bir yardımcıda varsayım yapma.

Union nesnelerinde `keyof` güvenle ortak kullanılabilen anahtarları verir. Örneğin `{ kind: 'film'; title: string } | { kind: 'oyuncu'; name: string }` tipi için ortak anahtar yalnızca `kind` olur; iki dalın tüm özel alanlarını tek tek birleştirmez.
:::

## Özet

- `keyof T` anahtar adlarını, `T[K]` seçilen anahtarın değer tipini verir.
- `typeof value` gerçek bir JavaScript değerinin tipini çıkarır; type alias üzerinde kullanılamaz.
- `as const` sabit dizi değerlerini korur; `[number]` tuple elemanlarının union’ını çıkarır.
- `K extends keyof T` yalnızca nesnede var olan alan adlarını kabul eder ve `T[K]` ile alanın değer tipini taşır.
- Türetilen tip çalışma zamanı girdisini doğrulamaz; allowlist guard’ı dış stringi kontrol eder.

**Yeni terimler:**

- **Indexed access:** `T[K]` biçiminde, bir anahtarın değer tipini seçme.
- **Tuple:** Eleman sayısı ve konumları bilinen dizi tipi.
- **Allowlist:** Kabul edilmesine izin verilen değerlerin açık listesi.

**Kendini yokla:** `keyof Movie` ile `Movie['title']` ne farkla sonuçlanır?  
*Cevap:* İlki anahtar adlarının union’ı; ikincisi `title` alanının değer tipi olan `string`.

**Kendini yokla:** `as const` yazmazsak `SortField` neden `string` olabilir?  
*Cevap:* Dizi geniş `string[]` tipine çıkar; tek tek literal alan adları korunmaz.
