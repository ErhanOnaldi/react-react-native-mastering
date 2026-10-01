---
title: "Test verisini factory ile kur"
minutes: 14
kind: concept
---

# Test verisini factory ile kur

Bir film kartı testi için `TmdbListMovie` nesnesi gerekir. Nesnenin bir sürü alanı vardır; ama örneğin testin yalnızca afiş olmayan durumu ilgilendiriyorsa, her testte tüm alanları yeniden yazmak asıl davranışı gözden kaçırır.

Bir **factory**, verilen girdilerden yeni ve kullanıma hazır bir nesne üreten fonksiyondur. Testlerde factory, geçerli varsayılan film verisini bir yerde kurar; test yalnız önemli farkı söyler. Böylece test hem kısa okunur hem de her seferinde eksiksiz bir filmle başlar.

## Önce geçerli bir film oluştur

Factory’nin ilk işi, testin kullanabileceği temel bir film vermektir. `TmdbListMovie` tipi uygulamanın beklediği alanları söyler; factory’nin dönüş tipine bunu yazınca editör eksik veya yanlış türdeki alanları gösterebilir.

```ts check
type Movie = {
  id: number
  title: string
  original_title: string
  poster_path: string | null
  genre_ids: number[]
}

function createTestFilm(): Movie {
  return {
    id: 550,
    title: 'Dövüş Kulübü',
    original_title: 'Fight Club',
    poster_path: '/poster.jpg',
    genre_ids: [18],
  }
}

const movie = createTestFilm()
movie.title
```

Bu çağrı her seferinde yeni bir film nesnesi döndürür. Testte gereken tüm alanlar geçerli olduğundan component, ilgilenmediğimiz eksik bir `title` yüzünden çökmek yerine kendi davranışını gösterebilir.

## Yalnız sınadığın farkı değiştir

Şimdi factory’ye **override** ekleyelim: override, varsayılan nesnedeki belirli bir alanın yerine çağrının verdiği değeri koymaktır. `Partial<Movie>`, Movie alanlarının tamamını değil herhangi bir alt kümesini kabul eden TypeScript tipidir. Böylece afiş durumu testi yalnızca `poster_path` alanını değiştirir.

```ts check
type Movie = {
  id: number
  title: string
  original_title: string
  poster_path: string | null
  genre_ids: number[]
}

function createTestFilm(overrides: Partial<Movie> = {}): Movie {
  return {
    id: 550,
    title: 'Dövüş Kulübü',
    original_title: 'Fight Club',
    poster_path: '/poster.jpg',
    genre_ids: [18],
    ...overrides,
  }
}

const withPoster = createTestFilm()
const withoutPoster = createTestFilm({ poster_path: null })
```

`withoutPoster` için başlığı ve tür kodlarını baştan yazmadık; varsayılanlar onları sağladı, `poster_path: null` ise yalnız testin incelediği alanı değiştirdi. `Partial<Movie>` sayesinde `poster_path: 42` yazarsan TypeScript uyumsuzluğu hemen gösterir. Yani bu tip hem daha az veri yazdırır hem de yazdığın farkların alan adını ve değer türünü denetler.

## Override ve default sırasını izle

JavaScript nesnesinde aynı alan iki kez verilirse sonraki değer öncekinin üzerine yazılır. Bu yüzden varsayılanları önce, `...overrides` ifadesini en sona koyarız.

| Adım | `title` | `poster_path` |
|---|---|---|
| Varsayılan film | Dövüş Kulübü | `/poster.jpg` |
| Override | değişiklik yok | `null` |
| Oluşan film | Dövüş Kulübü | `null` |

![Varsayılan film verisine kısmi override uygulanması](diagrams/factory-verisi.svg "Factory varsayılanları ve override")

Override’ı başa koyarsan varsayılan `poster_path` sonradan gelip `null` değerini ezer. Bu, testte yazdığın sınır durumunun hiç oluşturulmadığı anlamına gelir.

```ts
// Hatalı sıra: default, override değerini sonradan ezer.
const broken = { ...{ poster_path: null }, poster_path: '/poster.jpg' }

// Doğru sıra: son yazılan override kazanır.
const correct = { poster_path: '/poster.jpg', ...{ poster_path: null } }
```

Sonuç olarak `broken.poster_path` URL, `correct.poster_path` ise `null` olur. Testte hata mesajı beklediğin placeholder yerine afişin görünmesi olabilir; nedeni component değil, factory’deki yayma sırasıdır.

## Her çağrı kendi değişebilir verisini alsın

Filmdeki `genre_ids` bir dizi. Dizi **mutable**, yani oluşturulduktan sonra içeriği değiştirilebilir. Factory bütün filmlere aynı dışarıda tanımlı diziyi verseydi, bir testin diziye eklediği tür sonraki testin başlangıcında da görünürdü.

```ts check
type Movie = {
  id: number
  title: string
  original_title: string
  poster_path: string | null
  genre_ids: number[]
}

function createTestFilm(overrides: Partial<Movie> = {}): Movie {
  return {
    id: 550,
    title: 'Dövüş Kulübü',
    original_title: 'Fight Club',
    poster_path: '/poster.jpg',
    genre_ids: [18],
    ...overrides,
  }
}

const first = createTestFilm()
const second = createTestFilm()
first.genre_ids.push(35)
second.genre_ids.length === 1
```

`genre_ids: [18]` nesne factory fonksiyonunun içinde kurulduğu için iki çağrı iki ayrı dizi alır. İlk filmi değiştirmek ikincisini etkilemez; testlerin başlangıç verisi birbirinden bağımsız kalır.

:::mistake[Belirti: override sonucu değişmiyor]
Belirti → `createTestFilm({ poster_path: null })` sonucu hâlâ `/poster.jpg`.  
Neden → Varsayılan alanlar override’dan sonra yayıldı.  
Düzeltme → Varsayılanları önce oluştur, `...overrides` ifadesini en son yaz.
:::

:::mistake[Belirti: bir test diğerinin tür listesini değiştiriyor]
Belirti → Film A’ya tür ekledikten sonra Film B’de de tür sayısı artmış.  
Neden → Factory çağrıları aynı `genre_ids` dizisini paylaşıyor.  
Düzeltme → Diziyi factory fonksiyonunun içinde, her çağrıda yeniden oluştur.
:::

## `null`, boş metin ve varsayılanı ayır

Film API’sinde `poster_path: null`, filmin poster yolunun bulunmadığını açıkça anlatır. `release_date: ''` boş bir metindir; alanın değeri vardır ama içerik yoktur. Alanı override’da hiç vermezsen factory varsayılanını korur. Bunlar farklı girdiler olduğu için factory’de `null` veya `''` değerini sessizce varsayılanla değiştirme.

Örneğin `createTestFilm({ poster_path: null, release_date: '' })` çağrısı iki özel değeri de aynen sonuçta bırakmalıdır. Test böylece component’in bu gerçek durumlara nasıl tepki verdiğini görebilir; factory veriyi “düzeltip” sınanan durumu saklamaz.

İyi bir factory test verisini gizlemez. Bir test sıralamayı film başlığına göre inceliyorsa farklı başlıkları override’da açıkça yaz; başlık bu senaryoda önemli değilse ortak varsayılan yeterlidir. Factory’nin işi gerçek film davranışı uydurmak değil, test için geçerli veriyi zahmetsiz kurmaktır.

:::info[Derinlemesine (isteğe bağlı)]
Object spread yalnızca üst seviyedeki alanları birleştirir; buna **shallow merge** (sığ birleştirme) denir. Nested bir nesneyi override edersen, içindeki tek alanı değil tüm nested nesneyi değiştirirsin. Builder ise factory’den farklı olarak veriyi adım adım kurduran bir arayüzdür; tek bir film biçimi için çoğu zaman gerekmez. Factory’nin tipli nesne üretmesi de dış API JSON’unu çalışma anında doğrulamaz; bunu ayrı bir doğrulama katmanı yapar.
:::

## Özet

- Factory, test için geçerli varsayılan film nesnesi üretir.
- `Partial<T>` ile test yalnızca değiştirmek istediği alanları verir.
- Varsayılanlardan sonra yayılan `...overrides` değerleri korur; `null` ve `''` aynen kalır.
- Her factory çağrısı yeni nesne ve yeni mutable dizi üretmelidir.
- Testin önemli kıldığı veri factory çağrısında görünür olmalıdır.

**Yeni terimler**

- **Factory:** Girdilerden yeni, kullanıma hazır test verisi üreten fonksiyon.
- **Override:** Varsayılan nesnedeki bir alanın yerine verilen değeri koyma.
- **`Partial<T>`:** `T` tipindeki alanların herhangi bir alt kümesini kabul eden TypeScript tipi.
- **Mutable:** Oluşturulduktan sonra içeriği değiştirilebilen değer.

**Kendini yokla:** `...overrides` neden varsayılan alanlardan sonra gelir?  
*Cevap:* Çağrının verdiği alanın varsayılanı ezmesi için.

**Kendini yokla:** İki factory çağrısı neden ayrı `genre_ids` dizileri üretmeli?  
*Cevap:* Bir testin dizi değişikliği başka testin başlangıç verisini etkilemesin diye.
