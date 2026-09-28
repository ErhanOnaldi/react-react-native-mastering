---
title: "Test verisini factory ile kur"
minutes: 14
kind: concept
---

# Test verisini factory ile kur

:::pain[Problem]
Bir kart için testte 16 alanlı `Event` nesnesi kopyaladın. Başka testte sadece `coverUrl: null` sınanacak ama nesnenin tamamını yeniden yazdın. Alanlardan biri unutulunca component çöktü; değişikliği test etmek yerine fixture düzeltmekle uğraşıyorsun.
:::

## Factory varsayılanı ve farkı ayırır

Factory, testte kullanıma hazır geçerli bir veri nesnesi üretir; çağrıdaki override’lar yalnız ilgili alanları değiştirir. Böylece testin ana fikri küçülür: `makeEvent({ coverUrl: null })` satırından hangi sınır durumunun incelendiği okunur. Geri kalan zorunlu alanlar tek bir yerde geçerli varsayılan alır.

Bu veri yaklaşımını API doğrulamasıyla karıştırma. Factory test girdisi oluşturur. Dışarıdan gelen API cevabının doğru şekle sahip olduğunu TypeScript tipi tek başına çalışma anında kontrol etmez; dış veriyi runtime’da doğrulama sorumluluğu 15. modüldeki Zod sınırına aittir. Test factory’si tipli değer üretirken yalnız kendi ürettiği fixture’ın yapısını güvenli tutar.

Kesin kurallar:

1. **Geçerli bir varsayılan nesne üret.** Component’in çalışması için gereken zorunlu alanlar dolu olmalı.
2. **Override tipini `Partial<T>` yap.** Çağıran test yalnız önemli farkı belirtirken TypeScript alan adlarını ve türlerini denetler.
3. **Override’ı en son uygula.** `...overrides` varsayılan nesneden sonra gelirse testin verdiği değer kazanır.
4. **Her çağrıda yeni mutable iç içe değer oluştur.** Dizi, nesne veya `Date` gibi değiştirilebilir referanslar testler arasında paylaşılmamalıdır.
5. **`null` ve boş string’i sözleşmeye göre koru.** “Daha temiz” diye gerçek API’nin boş değerini başka değere dönüştürme.
6. **Factory’yi dev bir test dili yapma.** İşe yaramayan parametreler ve sonsuz seçenekler ekleme; yalnız sık kullanılan geçerli varsayılanı ve gerekli override’ı sun.

![Varsayılanlar ve Partial override’ın yeni fixture üretmesi](diagrams/factory-verisi.svg)

## Override sırasını izle

Bir etkinlik kaydının default `id` değeri 12, title “Göl Kenarı”, `coverUrl` geçerli bir URL olsun. Test cover olmadığını sınamak ister:

| Oluşturma adımı | `id` | `title` | `coverUrl` |
|---|---:|---|---|
| Varsayılan değer | 12 | Göl Kenarı | `/covers/lake.jpg` |
| Override girdisi | — | — | `null` |
| Sonuç | 12 | Göl Kenarı | `null` |

Factory her çağrıda `genreIds: ['drama']` gibi dizi alanı da üretirse, diziyi factory fonksiyonunun gövdesinde oluştur. Dosyanın üstünde tek bir `const defaultEvent` tanımlayıp her testte aynı nested array’i dağıtma. Bir test array’e `push` yaparsa başka testin başlangıcı bozulmamalıdır.

## Mutasyon riski olan kırık factory

Override’ı önce, default’u sonra yaymak çağıranın değerini siler:

```ts
// Kırık: default id override edilen id'yi tekrar ezer.
return { ...overrides, id: 12, title: 'Göl Kenarı' }
```

Varsayılanları kur, yeni dizi üret ve override’ı son yay:

```ts check
type EventRecord = {
  id: number
  title: string
  coverUrl: string | null
  genreIds: string[]
}

function makeEvent(overrides: Partial<EventRecord> = {}): EventRecord {
  return {
    id: 12,
    title: 'Göl Kenarı',
    coverUrl: '/covers/lake.jpg',
    genreIds: ['drama'],
    ...overrides,
  }
}

const noCover = makeEvent({ coverUrl: null })
const first = makeEvent()
const second = makeEvent()
first.genreIds.push('festival')
noCover.coverUrl === null && second.genreIds.length === 1
```

`Partial<EventRecord>` ile verilen `coverUrl: 42` TypeScript hatasıdır. `coverUrl: null` geçerlidir, çünkü alan tipi açıkça `string | null` demiştir. TypeScript alan tipini korur; factory her çağrıda yeni `genreIds` üretir. `structuredClone` gibi genel kopyalama eklemek yerine değerleri doğrudan kurmak sade ve hızlıdır.

## Factory ile testin niyeti okunur

Fabrika olmadan bir test, büyük bir literal içinde tek bir farkı aratır. Factory ile fark çağrı noktasına yaklaşır. Bunu test datasını gizlemek için kullanma: başlık veya id test davranışına önemliyse override’da açıkça belirt. Örneğin sıraya göre eşleşme testi için iki farklı `id` ve `title` vermek niyeti netleştirir.

İyi bir factory çağrısı üç soruyu kolay yanıtlar: hangi veri oluşturuldu, test hangi alanı değiştirdi, değişmeyen alanlar geçerli mi? Çok fazla parametre eklenmişse kullanım belirsizleşir. `makeEvent(title, id, type, date, status, ...)` yerine nesne override’ı isimli alanları görünür kılar ve TypeScript’in kısmi tipini kullanır.

Birden çok veri çeşidi gerekiyorsa her şeyi tek bir factory’ye boole flag’lerle doldurma. `makeEvent({ startsAt: ... })` gibi anlamlı override, ya da açık `makeCancelledEvent()` gibi ikinci bir preset seçilebilir. Factory gerçek ürün semantiğini uydurmamalı; yalnızca test için geçerli domain verisi üretmelidir.

:::mistake[Belirti: Override çalışmıyor]
Belirti → Test `coverUrl: null` verdiği halde sonuçta URL var.  
Neden → Factory spread sırasıyla önce override’ı, sonra varsayılan nesneyi yazdı.  
Düzeltme → Önce tüm varsayılanları, en sonda `...overrides` kullan.
:::

:::mistake[Belirti: Bir testin dizisi başka testte değişmiş]
Belirti → Bir test kategori ekledikten sonra sonraki test başlangıçta iki kategori görüyor.  
Neden → Factory çağrıları aynı dizi referansını paylaşmış.  
Düzeltme → Dizi ve nested nesneleri factory çağrısı başına oluştur.
:::

:::mistake[Belirti: Factory null vakasını kabul etmiyor]
Belirti → `makeEvent({ coverUrl: null })` TypeScript hatası veriyor veya null otomatik URL’e dönüşüyor.  
Neden → Tipte `null` sözleşmesi unutulmuş ya da factory boş veriyi normalize etmiş.  
Düzeltme → Gerçek veri tipini `string | null` olarak modelle ve override’ı olduğu gibi koru.
:::

## `null`, eksik alan ve boş metin farklıdır

Bir API alanının tipi `string | null` ise `null`, alanın var fakat değerinin bilinçli olarak boş olduğunu anlatabilir. `undefined` ise alanın yokluğu ya da henüz verilmemiş bir değerdir; `''` ise sıfır uzunlukta bir string. Bunları factory’de aynı şeye normalize etme. Component’in `poster_path === null` durumunda placeholder göstermesi, `poster_path === ''` durumunda URL kurmaya çalışmasından farklı olabilir.

Override API’sinde optional parametre de net olmalıdır. `makeMovie()` varsayılanları verir; `makeMovie({ overview: '' })` boş açıklama senaryosudur. Bir alanı hiç vermemek varsayılan açıklamayı korur. Factory’nin içinde `??` ile her boş veya null değeri varsayılanla değiştirmek testin sınırını siler. Yalnız factory çağrısı parametresi bütünüyle `undefined` ise `{}` gibi varsayılan argüman kullanılması beklenir.

Nested veri nesnelerinde shallow spread yalnız üst seviyeyi birleştirir. Eğer `metadata` içinde nested `credits` varsa, `{ ...defaults, ...overrides }` ile `overrides.metadata` tüm metadata objesini değiştirir; alan bazlı derin birleştirme yapılmaz. Factory davranışını açık tut: derin merge gerçekten gerekliyse hangi alt alanların korunacağını tanımla. Aksi halde testte nested nesnenin tamamını override ederek sürprizden kaçın.

Factory ile builder arasındaki sınır da kullanım sıklığına bağlıdır. Factory genellikle her çağrıda geçerli varsayılan nesne verir. Builder, adım adım zorunlu alanlar ekleterek özel fixture kurabilir; her testin başka türlü veri vermesi gerekiyorsa builder daha açıklayıcı olabilir. Bu modülde tek film formatı için factory yeterlidir; ihtiyaç yokken ek abstraction katmanı oluşturma.

Mock API cevabı üretirken factory’nin oluşturduğu tipli nesne doğrudan handler gövdesine eklenebilir. Yine de dış veri runtime’da type assertion ile “garanti” edilmiş olmaz. Factory’nin tipli fixture üretmesi, gerçek JSON’dan gelen `unknown` veriye Zod doğrulaması ekleme ihtiyacını ortadan kaldırmaz. Bu ayrım yanlış test güveni yaratmayı engeller.

:::model[TypeScript derleme ve çalışma zamanı]
TypeScript tipi derlemede vardır, dış JSON çalışma anında ayrıca doğrulanmalıdır. Factory, test içinde tipli başlangıç girdisi üretir; API cevabını doğruladığını varsayma. Bu yeni bağlamda factory’nin işi mock response veya component prop’u için güvenilir fixture hazırlamaktır.
:::

:::sector
Takımlar ortak factory’leri test support klasöründe tutar ve alanların geçerli default’larını tek yerde günceller. Büyük cevap nesneleri fixture dosyasında tutulabilir; varyant üretimi factory ile yapılır. Bu sayede API sözleşmesi değiştiğinde onlarca test literal’i yerine merkezi varsayılan güncellenir.
:::

## Özet

- Factory test için tipli ve geçerli varsayılan veri üretir.
- `Partial<T>` override yalnızca önemli farkı ifade eder.
- Override’ı default’lardan sonra yay; `null` değerini sözleşmeye göre koru.
- Her çağrıda yeni dizi ve mutable nested nesne oluştur.
- Factory runtime API doğrulaması yerine geçmez.

**Kendini yokla:** `...overrides` neden nesnenin sonunda olmalıdır?  
*Cevap:* Çağıranın verdiği alanlar varsayılanları ezsin diye.

**Kendini yokla:** `makeEvent()` iki kez çağrıldığında neden iki ayrı `genreIds` dizisi üretmelidir?  
*Cevap:* Bir testin mutasyonu diğer testin verisini değiştirmesin diye.
