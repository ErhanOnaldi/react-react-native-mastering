---
title: "Bilinmeyen veriye kontrol kapısı koy"
minutes: 15
kind: concept
---

# Bilinmeyen veriye kontrol kapısı koy

:::pain[Problem]
Servis hesabı bulunamayınca endpoint `{ code: 404, message: 'Kayıt yok' }` döndürüyor. Ekran bu cevabı `Account` sanıp `account.name.toUpperCase()` çalıştırıyor; hata, kullanıcıya boş panel olarak yansıyor.
:::

## Tip iddiası ile gerçek veri

JSON, local storage, URL ya da JavaScript sınırından gelen değer TypeScript'in kontrol etmediği bir yoldan gelir. Bu değere hemen `Account` demek onu Account yapmaz. `unknown`, “değer var ama şekli henüz bilinmiyor” demenin dürüst yoludur. Değeri kullanmadan önce çalışma zamanında incelemen gerekir.

Önceki modülde `typeof`, `in`, null kontrolü ve kontrol akışının union tipini daralttığını öğrendin. Burada aynı narrowing modeli ağ yanıtına uygulanır: kontrol başarılı oldukça TypeScript bilginin kapsamını daraltır. Type guard bu kontrolleri tekrar kullanılabilir fonksiyona toplar ve sonucu `value is Account` imzasıyla açıklar.

:::model[Tipler çalışma zamanında silinir]
`unknown` sınırında TypeScript'in tipi JSON'u inceleyemez; `as Account` yalnızca derleyiciye iddia verir. Type guard ise önce JavaScript kontrolleri çalıştırır, sonra doğruysa TypeScript'e daraltma sözü verir. Yeni bağlamda eklenen nokta, kontrol sonucunu ortak ve çağrılabilir bir fonksiyona taşımaktır.
:::

:::model[Kontrol akışı union'ı daraltır]
Önceki narrowing modelinde her kontrol olası tipleri azaltıyordu. Burada `typeof`, null kontrolü ve `'field' in value` sırayla `unknown` değere dair bilgiyi artırır. Yeni bağlam, aynı daraltmayı bir type guard fonksiyonunun dönüş sözüne bağlamaktır.
:::

![Derleme zamanı tiplerinin JavaScript çıktısından silinmesi ve dış verinin guard ile kontrol edilmesi](diagram:ts-derleme-ve-calisma)

## Kontrol sırası önemlidir

Bir dış nesneyi güvenli incelemek için en ucuz ve temel sorulardan başla. `null` için `typeof` sonucu da `'object'` olduğundan nesne kontrolü tek başına yeterli değildir. Alan var mı bakmadan alan değerini okumaya çalışma. Dizi gibi nesneleri düz nesne olarak yanlış kabul edip etmediğini de belirle.

Kesin kurallar:

1. Dış değeri `unknown` olarak al; `any` kontrol zorunluluğunu kaldırır.
2. Nesne bekliyorsan `typeof value === 'object'` kontrolünü `value !== null` ile tamamla.
3. Düz nesne bekleniyorsa `Array.isArray(value)` ile dizileri reddet.
4. Özelliği okumadan önce `'field' in value` ile varlığını kontrol et.
5. Alanın değeri için ayrı tip kontrolü yap; anahtarın bulunması değer tipini garanti etmez.
6. Null olabilir alan için null ve beklenen türü iki ayrı seçenek olarak kabul et.
7. `value is T` imzası çağıran koda söz verir; gövde bu sözü gerçek kontrollerle desteklemelidir.

```ts check
type Venue = { id: number; name: string; address: string | null }

function isVenue(value: unknown): value is Venue {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  if (!('id' in value) || !('name' in value) || !('address' in value)) return false

  return (
    typeof value.id === 'number' &&
    typeof value.name === 'string' &&
    (typeof value.address === 'string' || value.address === null)
  )
}

function venueLabel(value: unknown): string {
  return isVenue(value) ? value.name : 'Mekan bilgisi kullanılamıyor'
}

const label = venueLabel({ id: 8, name: 'Sahil', address: null })
```

Burada `in` kontrolünden sonra TypeScript `value.id` erişimine izin verir; fakat o değerin sayı olduğunu `typeof` ile ayrıca doğrularız. `address` için `null` geçerli bir veri değeri olduğu için onu eksik anahtarla karıştırmayız.

## Guard çağrısında iz sür

`venueLabel(raw)` çağrısında `raw` başlangıçta `unknown` kabul edilir. Satır sırası hem JavaScript'in ne yaptığını hem derleyicinin ne bildiğini belirler:

| Adım | Runtime kontrolü | Daralan bilgi |
| --- | --- | --- |
| `typeof value` | değer nesne mi | nesne değilse hemen false |
| `value !== null` | null referans değil mi | nesne üzerinde kontrol güvenli |
| `Array.isArray` | düz dizi mi | liste nesnesi reddedilir |
| `'id' in value` vb. | üç anahtar var mı | özellik okumaları mümkün |
| `typeof value.id` | id sayı mı | id'nin runtime tipi doğrulanır |
| Guard true döner | kontrollerin tamamı geçti | çağıranda `value` tipi `Venue` olur |

Guard true döndürdükten sonra `value.name` okumak derlenir. Çünkü TypeScript fonksiyonun predicate imzasına güvenir; fonksiyon gövdesinin mantığını matematiksel olarak kanıtlamaz. Yanlış guard, `value is Venue` yazılı olsa bile çalışma anında yanlış `true` verebilir.

## Assertion fonksiyonu ne zaman uygun?

Type guard yanlış biçimde false döner; çağıran geçersiz değere alternatif sunabilir. Assertion fonksiyonu ise geçersiz veriyle devam edilmesini istemediğinde hata fırlatır. İmzası `asserts value is Venue` olur. Doğru veri verildiğinde normal döner; yanlışta anlamlı bir hata üretir.

Bu iki biçim aynı iş kuralı değildir. UI'da opsiyonel panel göstereceksen guard ile fallback kullanmak daha uygundur. Programın çalışması için kesin sözleşme gereken bir sınırda assertion, hatalı girdiyi erken ve açıklayıcı biçimde durdurabilir. Assertion yazdıysan başarısızlık dalının gerçekten `throw` ettiğini denetle.

İç içe veri geldiğinde her katmanı sırayla kontrol et. Önce üst nesne, sonra sayfa numarası, sonra `items` dizisi, son olarak her öğe. `Array.isArray` yalnızca diziyi doğrular; içindeki her elemanı değil. `every` gibi bir yöntemle her elemanın şeklini denetlemek gerekir.

## Önce kırık, sonra doğru

Bu cast derlenir ama hiçbir alanı kontrol etmez:

```ts
type Venue = { id: number; name: string }
function readVenue(json: string): Venue {
  return JSON.parse(json) as Venue
}
```

`JSON.parse` sonucu `{ message: 'Kayıt yok' }` ise fonksiyon yine bunu `Venue` diye döndürür. Dış veriyi `unknown` olarak tut ve guard'dan geçir:

```ts check
type Venue = { id: number; name: string }
function isVenue(value: unknown): value is Venue {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  if (!('id' in value) || !('name' in value)) return false
  return typeof value.id === 'number' && typeof value.name === 'string'
}

function parseVenue(json: string): Venue | undefined {
  const raw: unknown = JSON.parse(json)
  return isVenue(raw) ? raw : undefined
}

const venue = parseVenue('{"id":8,"name":"Sahil"}')
```

`JSON.parse` sözdizimi hatasında ayrıca exception fırlatabilir; bu guard yalnızca parse edilmiş değerin şeklini denetler. Gerçek kod, JSON parse hatasının kullanıcıya nasıl iletileceğini de kararlaştırmalıdır.

## Elle guard'ın sınırı

Yukarıdaki `Venue` kontrolü yalnızca üç alanı denetledi. API'nin her nested nesnesi, tarih formatı, sayı aralığı ve enum değerini kontrol etmek istersen el yazısı guard hızla uzar. Bu derste güvenilir şekil kontrolünün ilkesini kuruyoruz; büyük şemaları tekrar tekrar elle doğrulamak sürdürülebilir değildir. İleride Zod ile aynı sınırı şema olarak ifade edip runtime parse edeceksin.

Bir guard'ın kabul ettiği ekstra alanlar da karardır. Yapısal tip sistemi genellikle ek alanları sorun etmez; API cevabının ileride yeni alanlar eklemesi bu nedenle kırıcı olmayabilir. Fakat yalnızca `id` ile `name` doğrulamak, diğer alanların da doğru olduğu anlamına gelmez. Guard'ın adını ve kullanım yerini doğruladığı kapsamla uyumlu tut.

## Sınırlar ve sık hatalar

:::mistake[Belirti: `null` gelince guard içinde çökme olur]
Belirti → `'id' in value` satırı TypeError verir.  
Neden → `typeof null === 'object'` ve null üzerinde `in` kullanılamaz.  
Düzeltme → Önce nesne kontrolü, sonra `value !== null`, daha sonra `in` kontrolü yap.
:::

:::mistake[Belirti: `{ id: '8', name: 'Sahil' }` kabul edilir]
Belirti → Sayısal olması beklenen alan string olarak geliyor.  
Neden → Yalnızca anahtarın varlığı test edilmiş.  
Düzeltme → Her alanın değer tipini ayrı kontrol et; dönüştüreceksen bu doğrulamadan farklı bir normalizasyon adımı yap.
:::

:::mistake[Belirti: Boş dizi bir nesne gibi kabul edilir]
Belirti → Guard, beklenen kaydı taşıyan düz nesne yerine `[]` için true döner.  
Neden → JavaScript dizileri de object'tir.  
Düzeltme → Dizi dışı obje sözleşmesinde `Array.isArray` ile reddet.
:::

:::mistake[Belirti: Herhangi bir JSON `T` olarak dönüyor]
Belirti → `as T` sonrası beklenmeyen cevapta `undefined` alan okunuyor.  
Neden → Type assertion çalışma zamanı denetimi değildir.  
Düzeltme → `unknown` tut, gerçek guard veya runtime schema çalıştır, sadece başarıdan sonra kullan.
:::

:::sector
Type guard'lar API client, URL parametresi, browser storage ve mesajlaşma kanallarındaki dar doğrulamalarda işe yarar. Küçük ve açık sözleşmelerde kolay okunur; büyük cevap modellerinde şema tabanlı doğrulama tercih edilir. Takımda guard adı, denetlenen alanların kapsamını dürüstçe anlatmalıdır.
:::

## Özet

- Sınırdan gelen değeri `unknown` tut.
- Kontrolleri null, nesne, anahtar varlığı ve alan değeri sırasıyla yap.
- Type guard imzası daraltma sözü verir; bu sözü gövde kanıtlamalıdır.
- Assertion geçersiz veride exception ile durur.
- Dizi doğrulaması elemanların iç yapısını doğrulamaz.

**Kendini yokla:** `'id' in value` kontrolünden önce `value !== null` neden gerekir?  
*Cevap:* Çünkü `typeof null` sonucu `'object'` olsa da null üzerinde `in` kullanılamaz.

**Kendini yokla:** `Array.isArray(value)` neden film listesindeki her filmi doğrulamaz?  
*Cevap:* Yalnızca üst değerin dizi olduğunu söyler; elemanların alanlarını tek tek kontrol etmez.
