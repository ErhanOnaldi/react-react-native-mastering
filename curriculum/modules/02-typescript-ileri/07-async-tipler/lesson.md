---
title: "Promise tipleri ve JSON sınırı"
minutes: 16
kind: concept
---

# Promise tipleri ve JSON sınırı

Bir film başlığını bir fonksiyondan hemen alabilirsin. Ama bir iş biraz sonra sonuç verecekse, örneğin film bilgisi hazırlanıyorsa, çağıran kodun beklemesi gerekir. JavaScript bu gelecekteki sonucu bir `Promise` (sonradan tamamlanacak işin temsilcisi) ile taşır.

## Sonuç şimdi değil, biraz sonra gelir

`async`, bir fonksiyonun asenkron çalıştığını belirtir: fonksiyon doğrudan bir değer döndürse bile çağıran bir `Promise` alır. `Promise<T>` içindeki `T`, iş başarılı olduğunda gelecek değerin tipidir.

```ts check
async function featuredTitle(): Promise<string> {
  return 'Geleceğe Dönüş'
}
```

Fonksiyonun içinde string döndürdük; dışarıdan bakınca dönüş tipi `Promise<string>`. Bu sarmalayıcı, çağıranın sonucu beklemesi gerektiğini gösterir. Promise başarısızlık ihtimalinin tipini ayrıca anlatmaz.

Sonucu kullanmak için `await` yazarsın. `await`, o Promise tamamlanana kadar mevcut `async` fonksiyonun devamını bekletir ve başarılı değeri verir:

```ts check
async function featuredTitle(): Promise<string> {
  return 'Geleceğe Dönüş'
}

async function showFeaturedTitle(): Promise<void> {
  const title = await featuredTitle()
  console.log(title)
}
```

`featuredTitle()` çağrısı `Promise<string>` verir; `await` sonrasında `title` bir `string` olur. `await` yalnızca o `async` fonksiyonun devamını bekletir; JavaScript'in geri kalanı eşzamanlı işini yapabilir.

| Sıra | Çalışan bölüm | Değer | Ne olur? |
| --- | --- | --- | --- |
| 1 | `showFeaturedTitle()` başlar | Henüz başlık yok | `async` fonksiyon hemen bir Promise döndürür |
| 2 | `featuredTitle()` çağrılır | `Promise<string>` | Gelecek sonucu temsil eden Promise alınır |
| 3 | `await` noktasına gelinir | Promise henüz tamamlanmadı | Bu fonksiyonun devamı bekler |
| 4 | Promise başarılı olur | `'Geleceğe Dönüş'` | `title` bu string değerini alır |
| 5 | `console.log(title)` çalışır | String | Başlık konsola yazılır |

Promise başarılıysa “resolve oldu”, başarısızsa “reject oldu” denir. Reject olan Promise'i `await` ederken hata fırlatılmış gibi davranır; `try/catch` ile yakalayabilirsin. `Promise<T>` yalnızca başarı değerinin tipini söyler, hata değerinin biçimini söylemez.

## Awaited yalnızca tipteki Promise katmanını açar

`await` çalışan kodda bir Promise'i bekler. `Awaited<T>` ise TypeScript'e bir tipin Promise katmanlarını açıp sonunda hangi değer tipine ulaşıldığını sorar. İsimleri benzer, yaptıkları iş farklıdır.

```ts check
type MovieCard = { title: string; year: number }
type MovieCardsPromise = Promise<MovieCard[]>
type LoadedCards = Awaited<MovieCardsPromise>

const cards: LoadedCards = [{ title: 'Aftersun', year: 2022 }]
```

`LoadedCards`, `MovieCard[]` olur: Promise katmanı kalkar ama dizi ve içindeki film kartları kalır. Bu, fonksiyonun `await` sonrası verdiği değeri ayrıca elle kopyalayıp yazmak yerine dönüş tipiyle bağlı tutar.

`Awaited` çalışma anında hiçbir şey beklemez; yalnızca tip hesabıdır. Gerçek sonucu almak için yine `await` gerekir. Örneğin bir `Promise<MovieCard[]>` değerini `await` edince kartlar dizisi gelir, tek bir `MovieCard` değil.

## JSON tipi, JSON'un doğru olduğunu kanıtlamaz

Sinema'nın film listesi yerel bir JSON metninden okunuyor olsun. JSON metnini nesneye çevirmek **parse etmek** demektir. `JSON.parse` metnin geçerli JSON olup olmadığına bakar; içindeki alanların beklenen film bilgisi olup olmadığını doğrulamaz.

:::model[Tipler derleme sırasında vardır]
`JSON.parse` metni JavaScript değerine çevirir ama TypeScript tipi o değeri doğrulamaz. Alanları runtime'da kontrol edip yalnız doğruladığın veriyi kullan.
:::

![TypeScript tipinin derlemede silinmesi ve dış JSON'un runtime'da doğrulanması](diagram:ts-derleme-ve-calisma)

```ts check
type Rating = { score: number }

async function readSavedRating(): Promise<number> {
  const text = '{"score": 4.5}'
  const raw: unknown = JSON.parse(text)

  if (typeof raw !== 'object' || raw === null || !('score' in raw)) {
    throw new Error('Puan bilgisi yok')
  }
  if (typeof raw.score !== 'number') throw new Error('Puan sayı değil')
  return raw.score
}
```

`unknown`, değeri kullanmadan önce türünü kontrol etmeni ister. Metin geçerli JSON olsa bile `{ "score": "iyi" }` gelirse sayı kontrolü hata verir. Bu kodda `async` fonksiyon içindeki `throw`, çağırana reject olmuş bir Promise olarak ulaşır.

Şu kısayol cazip gelebilir:

```ts
const rating = JSON.parse(text) as Rating
```

`as Rating`, TypeScript'e “bunu Rating kabul et” der ama alanları kontrol edecek JavaScript kodu üretmez. Sonrasında `rating.score` editörde sayı gibi görünür; gerçek veri string ise hata ancak program çalışırken çıkar. Dış veriyi doğrulamadan ona tip etiketi vermek, hatayı editörden uygulamanın içine taşır.

Bir generic fonksiyonun dönüş tipinde `T` kullanması da aynı ayrımı korumayı gerektirir. `T`, çağıranın beklediği başarı tipini anlatabilir; JSON metnindeki alanları kendiliğinden incelemez. Bu yüzden Promise tipiyle veri doğrulamasını ayrı sorular olarak düşün: “Sonuç geldiğinde tipi ne olmalı?” ve “Gelen verinin gerçekten o tipte olduğunu nasıl anlarım?”

| Sıra | İşlem | Başarılı durumda | Sorun varsa |
| --- | --- | --- | --- |
| 1 | `JSON.parse(text)` | JavaScript değeri üretir | Geçersiz JSON için hata fırlatır |
| 2 | Alanları kontrol et | Beklenen şekil onaylanır | Uygun değilse kendi hatanı fırlatırsın |
| 3 | `async` fonksiyon tamamlanır | `Promise<number>` başarılı olur | Fırlatılan hata Promise'i reject eder |
| 4 | Çağıran `await` eder | Kontrol edilmiş sayı gelir | Hata `try/catch`'e ulaşır |

:::mistake[Belirti: sayı beklerken `toFixed is not a function` hatası]
Belirti → JSON parse ediliyor ve editör `score` alanını sayı gibi gösteriyor, ama ekranda `toFixed is not a function` çıkıyor.
Neden → `as Rating` yalnızca TypeScript'e iddia verir; gelen JSON alanını kontrol etmez.
Düzeltme → Dış veriyi `unknown` kabul et, `score` alanının gerçekten number olduğunu runtime'da kontrol et ve ancak sonra kullan.
:::

:::info[Derinlemesine (isteğe bağlı): HTTP cevabı ve Response gövdesi]
`fetch` bir HTTP isteği yapar; HTTP, tarayıcıyla sunucunun istek ve cevap biçimidir. `fetch` 404 veya 500 durumlarında da bir cevap (`Response`) verir, bu yüzden `response.ok` değerini sen kontrol edersin. Cevabın gövdesi çoğu tarayıcıda stream olarak okunur; yani veri parça parça gelebilir ve aynı gövde genellikle bir kez tüketilir. Bu ayrıntılar Promise'in başarı tipiyle JSON alanlarının doğrulanmasını birbirinden ayırma kuralını değiştirmez.

Bir profil yükleyicinin akışı buna örnek olur. HTTP status kontrolü, JSON'u okuma ve alanları doğrulama farklı adımlardır:

| Sıra | İşlem | Sonuç |
| --- | --- | --- |
| 1 | `fetch(url)` çağrılır | `Promise<Response>` beklenir; bağlantı veya iptal hatası Promise'i reddedebilir |
| 2 | `response.ok` okunur | 404/500 de bir `Response` verir; hata üretmek uygulamanın sorumluluğudur |
| 3 | `response.json()` beklenir | Gövde okunur; JSON metni geçerliyse JavaScript değeri gelir |
| 4 | `unknown` değer profil alanları için denetlenir | Uygunsa `Profile`, değilse doğrulama hatası |
| 5 | `async` fonksiyon tamamlanır | Başarıda `Promise<Profile>` çözülür; fırlatılan hata Promise'i reddeder |

Önce HTTP status'unu, sonra gövdenin şeklini denetlemek gerekir: başarılı bir status bozuk JSON içerebilir; geçerli JSON da HTTP hatasının gövdesi olabilir. `response.json()` gövdeyi okur ve aynı gövde ikinci kez okunamaz. 204 No Content cevabında JSON metni bulunmayabileceği için endpoint'in sözleşmesine göre parse etmeyi atlamak gerekir.

Generic `getJson<Profile>(url)` çağrısı da tek başına cevabın profil olduğunu kanıtlamaz. Generic parametresi çağıranın beklentisini taşır; içeride `response.json() as T` kullanmak alanları denetlemez. Hata gövdesi gerekiyorsa onu da dış veri kabul edip ayrı ele al. Promise tipi hata değerlerinin şeklini kodlamadığı için `catch` içindeki değeri `unknown` sayıp `Error` olup olmadığını kontrol etmek güvenlidir. Beklenen API hatalarını dönüş değerinde modellemek istersen `{ ok: true; data: T } | { ok: false; error: ApiError }` gibi bir union kullanabilirsin.
:::

:::info[Derinlemesine (isteğe bağlı): Fonksiyonlardan tip çıkarma]
`ReturnType<typeof f>` bir fonksiyonun dönüş tipini, `Parameters<typeof f>` ise parametrelerinin tuple tipini çıkarır. Bunlar imzaları tekrar kullanırken işe yarar; bu dersteki Promise ve `Awaited` fikrini anlamak için gerekmez.
:::

## Özet

- `async` fonksiyonun başarılı dönüşü `Promise<T>` olur; `await` başarılı olduğunda `T` değerini verir.
- `Awaited<Promise<T>>`, tip düzeyinde Promise katmanını açar; dizi gibi diğer katmanları korur.
- Promise başarı değerini türlendirir, ama başarısızlığın biçimini veya dış verinin doğruluğunu garanti etmez.
- JSON parse etmek metni okur; beklenen alan ve türleri runtime'da ayrıca doğrulamak gerekir.

**Yeni terimler**

- **Promise:** Henüz tamamlanmamış bir işin gelecekteki sonucunu temsil eden JavaScript değeri.
- **`async` / `await`:** Asenkron fonksiyon tanımlama ve o fonksiyonun devamını Promise sonucu gelene kadar bekletme sözdizimi.
- **`Awaited<T>`:** Bir tipteki Promise katmanını açıp başarılı sonuç tipini çıkaran TypeScript aracı.
- **Runtime doğrulama:** Program çalışırken gelen değerin beklenen şekil ve türde olduğunu kontrol etme.

**Kendini yokla:** `Awaited<Promise<MovieCard[]>>` ne olur?
*Cevap:* `MovieCard[]`; Promise kalkar, dizi kalır.

**Kendini yokla:** Geçerli JSON metninden çıkan değerin film tipinde olduğunu `Promise<Movie>` kanıtlar mı?
*Cevap:* Hayır. Promise başarıyla gelince hangi tipin beklendiğini söyler; JSON alanları ayrıca doğrulanmalıdır.
