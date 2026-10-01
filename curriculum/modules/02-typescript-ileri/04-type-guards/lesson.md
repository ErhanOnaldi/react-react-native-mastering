---
title: "Bilinmeyen veriye kontrol kapısı koy"
minutes: 16
kind: concept
---

# Bilinmeyen veriye kontrol kapısı koy

Sinema'nın film verisini JSON olarak aldığını düşün. TypeScript kaynak kodunu denetler ama ağdan gelen JSON'un gerçekten beklediğin alanlara sahip olduğunu çalıştırmadan bilemez. O yüzden dışarıdan gelen değeri hemen `Movie` diye adlandırmak yerine önce kontrol etmelisin.

Bu kontrolde **runtime**, programın gerçekten çalıştığı an demektir; JSON'un şekli de ancak o sırada incelenebilir. `unknown`, değerin var olduğunu ama tipinin henüz bilinmediğini söyler. Bu tipteki bir değeri kullanmadan önce JavaScript kontrolleriyle şeklini anlamamız gerekir.

:::model[Tipler derleme sırasında vardır]
TypeScript tipi kaynak kodunu denetler ama API'den gelen JSON'u çalışırken doğrulamaz. Dış değeri `unknown` kabul et ve kullanmadan önce gerçek alanlarını kontrol et.
:::

![Derleme zamanı tiplerinin JavaScript çıktısından silinmesi ve dış verinin guard ile kontrol edilmesi](diagram:ts-derleme-ve-calisma)

## Önce tek bir değeri kontrol et

Diyelim ki film yılını bir dış kaynaktan alıyoruz. Önce değerin sayı olup olmadığına bakalım:

```ts check
function releaseYearLabel(value: unknown): string {
  if (typeof value === 'number') return `Vizyon yılı: ${value}`
  return 'Vizyon yılı bilinmiyor'
}

const label = releaseYearLabel(1999)
```

`typeof` kontrolü başarılı olunca TypeScript bu dalda `value` değerini `number` kabul eder. String ya da başka bir tip gelirse güvenli bir yedek metin döner. Tip bildirimi değeri dönüştürmez; yalnızca kontrolün sonucunu TypeScript'e anlatır.

## Kontrolleri tekrar kullanılabilir yap

Bir filmin başlık bilgisini listede göstermek için hem `id` hem `title` bekleyelim. TypeScript’te **type predicate** (tip yüklemi), bir boolean fonksiyonun `true` döndüğünde hangi tipi garanti ettiğini imzada belirtmesidir. `value is FilmHeader` bu sözdür:

```ts check
type FilmHeader = { id: number; title: string }

function isFilmHeader(value: unknown): value is FilmHeader {
  if (typeof value !== 'object' || value === null) return false
  if (!('id' in value) || !('title' in value)) return false
  return typeof value.id === 'number' && typeof value.title === 'string'
}

function cardTitle(value: unknown): string {
  if (isFilmHeader(value)) return value.title
  return 'Film bilgisi eksik'
}

const title = cardTitle({ id: 550, title: 'Dövüş Kulübü' })
```

Önce değerin nesne ve `null` olmadığını kontrol ediyoruz. Sonra iki anahtarın bulunduğunu, ardından değerlerinin beklenen tipte olduğunu inceliyoruz. Bütün kontroller geçerse `true` döner ve çağıran yerde `value.title` güvenle okunur.

TypeScript predicate imzasına güvenir; fonksiyonun içindeki kontrolleri matematiksel olarak kanıtlamaz. Yanlışlıkla her değer için `true` döndüren bir guard yazmak mümkündür. Bu yüzden imza verdiğin söz, gövde de o sözü gerçekten denetleyen kod olmalıdır.

## Kontrol sırasını adım adım izle

Nesnenin alanını okumadan önce nesne olduğunu, anahtarın bulunduğunu ve değerin doğru tipte olduğunu doğrularız. Sıra önemlidir; örneğin `null` üzerinde `'id' in value` çalıştırmak hata fırlatır.

| Sıra | Çalışan kontrol | Geçmezse | Geçerse bildiğimiz |
| --- | --- | --- | --- |
| 1 | `typeof value === 'object'` | `false` dön | Değer nesne türünde |
| 2 | `value !== null` | `false` dön | Nesne `null` değil |
| 3 | `'id' in value` ve `'title' in value` | `false` dön | İki alan da okunabilir |
| 4 | Alanların `typeof` kontrolü | `false` dön | `id` sayı, `title` metin |
| 5 | Guard `true` döner | — | Çağıran taraf `FilmHeader` kullanabilir |

Burada yalnızca anahtarların var olması yetmez. `{ id: '550', title: 'Dövüş Kulübü' }` nesnesinde `id` var ama sayı değil; bu nedenle guard `false` döndürmelidir. Dönüştürme yapmak istiyorsan onu doğrulama ile karıştırma: önce girdinin kabul edilebilir olup olmadığına karar ver, sonra ayrı bir adımda dönüştür.

## Liste içindeki her kaydı denetle

`Array.isArray` değerin dizi olup olmadığını söyler ama elemanların şekli hakkında bilgi vermez. Şimdi oyuncu listesini taşıyan bir cevapta hem liste alanını hem de her oyuncunun adını kontrol edelim:

```ts check
type CastReply = { cast: { name: string }[] }

function isCastReply(value: unknown): value is CastReply {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  if (!('cast' in value) || !Array.isArray(value.cast)) return false

  return value.cast.every((actor) => {
    if (typeof actor !== 'object' || actor === null || Array.isArray(actor)) return false
    return 'name' in actor && typeof actor.name === 'string'
  })
}

function castCount(value: unknown): number | undefined {
  return isCastReply(value) ? value.cast.length : undefined
}

const count = castCount({ cast: [{ name: 'Amy' }, { name: 'Ken' }] })
```

Önce dış değerin dizi olmayan bir nesne, sonra `cast` alanının dizi olduğunu kontrol ettik. `every` listedeki her eleman için callback’i çalıştırır; bir oyuncu nesnesinin bile `name` alanı metin değilse sonuç `false` olur. Bu örnek, en dış şeklin doğrulanmasının iç içe veriyi otomatik olarak doğrulamadığını gösterir.

Bu yaklaşım **yapısal tip sistemi** ile uyumludur: TypeScript, bir değeri belirli bir tipe sahip saymak için ona istenen alanların ve alan tiplerinin bulunup bulunmadığına bakar. Nesnenin belirli bir sınıftan üretilmiş olması gerekmez; `{ id, title }` şeklini taşıması yeterlidir. Bu esneklik yararlıdır, ama guard'ın hangi alanları kontrol ettiğini açıkça yazma sorumluluğu sende kalır.

## Hata nerede, düzeltme ne?

Şu kısa yol güvenli görünür ama gerçek kontrol yapmaz:

```ts
type PosterInfo = { path: string }

function readPoster(json: string): PosterInfo {
  return JSON.parse(json) as PosterInfo
}
```

`as PosterInfo`, TypeScript'e “buna güven” der; JSON'u incelemez. İçerik `{ "message": "Film yok" }` ise fonksiyon bunu yine `PosterInfo` diye döndürür. Üstelik `JSON.parse` hatalı JSON metninde ayrıca exception fırlatabilir.

Değeri `unknown` olarak alıp guard kullan:

```ts check
type PosterInfo = { path: string }

function isPosterInfo(value: unknown): value is PosterInfo {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  return 'path' in value && typeof value.path === 'string'
}

function posterPath(value: unknown): string | undefined {
  return isPosterInfo(value) ? value.path : undefined
}

const path = posterPath({ path: '/posters/arrival.jpg' })
```

Şimdi kabul kararı, çalışma anında gerçek alanı kontrol eden koda dayanıyor. `path` eksik ya da sayıysa fonksiyon `undefined` verir. Bu küçük guard yalnızca `path` alanının şeklini doğrular; URL'nin geçerli veya görselin erişilebilir olduğunu doğrulamaz. Kontrolün kapsamını adı ve dönüş tipiyle aynı tutmak, yanlış güven vermemek için önemlidir.

:::mistake[Belirti: `null` gelince guard çöker]
`typeof null` sonucu `'object'` olduğu için nesne kontrolü tek başına yetmez. `'id' in value` öncesinde `value !== null` koşulunu koy; gerekirse dizileri de `Array.isArray` ile reddet.
:::

:::mistake[Belirti: yanlış tipte alan kabul edilir]
Yalnızca `'id' in value` kontrol edilmiştir; bu anahtarın varlığını söyler, değerinin sayı olduğunu değil. Her alanın değerini ayrıca `typeof` ile kontrol et.
:::

:::info[Derinlemesine (isteğe bağlı): Assertion fonksiyonu]
Type guard geçersiz değerde `false` döndürür; çağıran bu durumda bir yedek davranış seçebilir. Assertion fonksiyonu ise geçersiz girdide hata fırlatır ve imzasında `asserts value is FilmHeader` yazar. Beklenmeyen veride devam etmek yerine işlemi durdurman gereken durumlarda kullanılır; gövdenin hata dalında gerçekten `throw` etmesi gerekir.
:::

Zod gibi bir runtime doğrulama kütüphanesi, büyük ve iç içe cevapların alanlarını tek tek elle denetlemek yerine bir şema olarak tarif etmene yardım eder.

## Özet

- Dışarıdan gelen değeri önce `unknown` kabul et; tip bildirimi veriyi çalışma anında doğrulamaz.
- `value is T` predicate’i, `true` dalında kullanılabilecek tipi bildirir; guard gövdesi bu sözü kontrollerle desteklemelidir.
- `null`, nesne, anahtar ve alan değerini güvenli sırayla kontrol et.
- Dizi kontrolü elemanları doğrulamaz; iç içe listedeki her öğeyi ayrıca denetle.
- TypeScript yapısal olarak alan şekline bakar; guard hangi alanları doğruladığını dürüstçe belirtmelidir.

**Yeni terimler:**

- **Runtime:** Programın gerçekten çalıştığı an; dış verinin şekli o sırada incelenir.
- **Type predicate:** Boolean fonksiyonun `true` durumunda hangi tipi garanti ettiğini belirten `value is T` imzası.
- **Yapısal tip sistemi:** Değerleri sınıf adına göre değil, sahip oldukları alanlara ve alan tiplerine göre uyumlu sayan sistem.
- **Narrowing:** Kontrol akışıyla bir değerin mümkün tiplerini daraltma.

**Kendini yokla:** `'id' in value` kontrolü `id` alanının sayı olduğunu kanıtlar mı?  
*Cevap:* Hayır. Yalnızca anahtarın varlığını söyler; değer için ayrıca `typeof value.id === 'number'` gerekir.

**Kendini yokla:** `Array.isArray(value.cast)` listedeki her oyuncuyu doğrular mı?  
*Cevap:* Hayır. Yalnızca `cast` alanının dizi olduğunu söyler; her elemanı ayrıca kontrol etmelisin.
