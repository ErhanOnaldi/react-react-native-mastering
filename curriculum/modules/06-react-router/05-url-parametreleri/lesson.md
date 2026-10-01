---
title: "Film kimliği URL’de"
minutes: 14
kind: concept
---

# Film kimliği URL’de

Sinema'da bir karttan filme tıklayınca detay sayfası açılmasını istiyorsun. Film kimliği yalnız component state'indeyse `/movie/550` adresini doğrudan açan biri hangi filmi istediğini uygulamaya anlatamaz. Kimliği adresin içine koyarsan aynı sayfa düzeni farklı filmler için çalışır.

## Bir route, farklı film adresleri

Route path'inde iki nokta üst üste ile başlayan parça değişkendir. Buna path parametresi denir: URL'nin yolundaki değişken değer. Örneğin `/movie/:id`, `/movie/550` ve `/movie/603` adreslerini aynı route'a bağlar; `id` hangi filmin istendiğini belirtir.

İlk örnekte yalnızca route'un neyi eşleştirdiğine bakalım:

```tsx
{ path: '/movie/:id', element: <MovieDetails /> }
```

Burada `:id` route'un adı verdiği değişken bölümdür. `useParams()` ile okununca değeri metindir; Router onu sayıya dönüştürmez. Bu önemlidir, çünkü URL'den gelen metin eksik ya da beklenmeyen biçimde olabilir.

## Metni sayıya çevirirken kontrol et

`useParams` değeri `string | undefined` olabilir. `undefined`, parametrenin bu route bağlamında bulunmayabileceğini belirtir. İkinci örnek, eksik değeri ele alıp metni sayıya dönüştürüyor:

```tsx
import { useParams } from 'react-router'

function MovieNumber() {
  const { id } = useParams()
  if (id === undefined) return <p>Film adresi eksik</p>
  const movieId = Number(id)
  return <p>İstenen id: {movieId}</p>
}
```

`/movie/550` için ekranda 550 görünür. Fakat `Number` dönüşümü tek başına yeterli değil: `Number('abc')` sonucu `NaN`, `Number('')` sonucu 0 olur. Yani sayı üretmek, girilen değerin geçerli bir film kimliği olduğunu kanıtlamaz.

Bir değerin olası tiplerini kontrol ederek kodun güvenle kullanabileceği daha dar bir tipe indirmeye TypeScript narrowing denir. Örneğin `if (id === undefined) return ...` sonrasında `id` kesin olarak string'dir. Aynı fikri rakamlara ve kabul edilen sayı aralığına da uygularız.

## Önce biçim, sonra kayıt

Bu üçüncü örnekte Sinema'nın farklı filmleri olan küçük bir listeyi kullanıyoruz. Film kimliğinin yalnız rakamlardan oluşmasını, pozitif ve güvenli bir tam sayı olmasını istiyoruz:

```tsx check
import { useParams } from 'react-router'

type Film = { id: number; title: string }
const films: Film[] = [
  { id: 81, title: 'Kıyıdaki ev' },
  { id: 94, title: 'Son gösterim' },
]

function parseFilmId(value: string | undefined): number | null {
  if (!value || !/^\d+$/.test(value)) return null
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

export function FilmKartDetayi() {
  const { id: rawId } = useParams<'id'>()
  const id = parseFilmId(rawId)
  if (id === null) return <p>Geçersiz film adresi</p>

  const film = films.find((item) => item.id === id)
  if (!film) return <p>Film bulunamadı</p>
  return <h1>{film.title}</h1>
}
```

Burada iki ayrı soru var. Önce adres parçası kabul edilebilir bir id mi diye bakıyoruz; sonra böyle bir film gerçekten listede var mı diye arıyoruz. `/movie/81` Kıyıdaki ev'i gösterir, `/movie/8x` geçersiz adres der, `/movie/999` ise biçimi doğru ama bulunmayan film der.

![Path parametresinin metin olarak okunup kontrol edilerek film kaydına eşleşmesi](diagrams/parametre-akisi.svg "Önce '81' doğrulanır, sonra Kıyıdaki ev bulunur.")

`parseFilmId` saf bir fonksiyondur: aynı girdi için aynı sonucu verir ve ekran çizmez. Bu kontrolü component'ten ayırmak, adres doğrulaması ile sayfanın gösterimini birbirinden bağımsız okumayı sağlar.

| URL değeri | Biçim kontrolü | Arama | Gösterilen sonuç |
| --- | --- | --- | --- |
| `/movie/81` | Pozitif tam sayı | Film bulundu | Kıyıdaki ev |
| `/movie/8x` | Rakam dışında karakter var | Arama yapılmaz | Geçersiz film adresi |
| Parametre yok | Değer `undefined` | Arama yapılmaz | Geçersiz film adresi |
| `/movie/999` | Pozitif tam sayı | Film bulunamadı | Film bulunamadı |
| Çok uzun sayı | Güvenli sayı aralığında değil | Arama yapılmaz | Geçersiz film adresi |

Bu sıranın nedeni, hatayı doğru yerde açıklayabilmektir. Kullanıcı adresi yanlış yazdıysa adres mesajı; var olmayan bir film istediyse bulunamadı mesajı görür. Biçim kontrolünü ve liste aramasını tek koşulda birleştirirsen bu iki durumu ayırt edemezsin.

## URL değeri React state değildir

`/movie/81`'den `/movie/94`'e gidince aynı detay component'i yeni parametreyle yeniden çalışabilir. `useParams` güncel adresi verir. Eğer `81` değerini bir de local `useState` içine kopyalarsan bu state yeni adresle kendiliğinden eşleşmeyebilir ve yanlış film görünür.

Bu nedenle adresin temsil ettiği kimliği component state'inde ikinci kez saklama. Her render'da URL'den oku, doğrula ve o id ile listeyi ara. Böylece yenileme, doğrudan link açma ve geri tuşu aynı kaynağı kullanır.

:::mistake[Belirti → neden → düzeltme]
`/movie/abc` için boş başlık veya `NaN` görünüyor → metin doğrudan sayıya çevrilmiş ve geçersiz değer ayrılmamış → önce rakam biçimini, sonra pozitif güvenli tam sayı koşulunu kontrol et.
:::

:::mistake[Belirti → neden → düzeltme]
`/movie/999` ve `/movie/abc` aynı açıklamayı gösteriyor → id biçimi ile film kaydının varlığı tek adım sayılmış → önce parametreyi doğrula, ancak sonra filmler içinde ara.
:::

:::info[Derinlemesine (isteğe bağlı)]
Her uygulamanın kimliği sayı değildir. `slug`, URL'de okunabilir ad gibi kullanılan metinsel kimliktir; örneğin `/films/sessiz-liman`. Böyle bir route'ta değeri sayıya çevirmek yerine kabul edilen metin biçimini doğrular ve liste içinde bu metinle ararsın. Benzer şekilde, URL'den gelen `returnTo` hedefini kontrol etmeden kullanmak başka bir siteye yönlendirebilir; bu güvenlik konusu ayrı bir modülde ele alınır.
:::

## Özet

- `/movie/:id` gibi route, değişken path parametresiyle aynı sayfayı farklı kayıtlarda kullanır.
- `useParams()` URL parçasını metin olarak verir; `number` olarak varsayma.
- Önce biçimi doğrula ve dönüştür, ardından id'ye karşılık gelen kaydı ara.
- Geçersiz adres ile bulunamayan film farklı durumlardır ve farklı açıklamalar almalıdır.

**Yeni terimler:**

- **Path parametresi:** URL yolundaki değişken parça; route'a hangi kaynağın istendiğini söyler.
- **Narrowing:** Bir değerin tipini kontrol ederek kodda daha güvenli ve dar bir türe indirme.
- **Saf fonksiyon:** Girdisine göre sonuç veren, dışarıda bir şeyi değiştirmeyen fonksiyon.

**Kendini yokla:** `useParams()` içindeki `'550'` neden doğrudan number sayılamaz?

*Cevap:* URL değeri metindir ve eksik ya da bozuk olabilir; önce kontrol edip sonra dönüştürmek gerekir.

**Kendini yokla:** `/movie/999` ile `/movie/abc` arasında ne fark var?

*Cevap:* `999` geçerli biçimli bir id ama listede kayıt yok; `abc` ise beklenen sayısal id biçiminde değil.
