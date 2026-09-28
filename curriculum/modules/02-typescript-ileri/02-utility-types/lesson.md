---
title: "Var olan tipten yeni görünümler türet"
minutes: 16
kind: concept
---

# Var olan tipten yeni görünümler türet

:::pain[Problem]
Film ayrıntısı, kart ve düzenleme formu için üç ayrı nesne tipi yazılmış. TMDB `poster_path` alanını boş olabildiği için `string | null` yapınca kartta bu düzeltme unutulmuş; derleme geçiyor ama ekranda `null` yazısı görünüyor.
:::

## Tek kaynak, amaca göre görünüm

Bir nesne farklı işlerde kullanılırken her alanına ihtiyaç duyulmaz. Liste öğesi, ayrıntı görünümü ve form taslağı aynı bilgilerin alt kümelerini taşır. Her kullanım için alanları elle kopyalamak, isim ve null kurallarının birbirinden ayrılmasına yol açar. Utility type'lar bir temel tipten yeni tip görünümü türetir.

Buradaki önemli sınır şu: `Pick`, `Omit` ve `Partial` TypeScript tipini dönüştürür; JavaScript nesnesini değiştirmez. `Pick<Movie, 'title'>` yazınca nesnedeki diğer alanlar silinmez. Gerçek nesne üzerinde seçme, silme veya kopyalama gerekiyorsa bunu ayrıca JavaScript ile yaparsın.

## Tip merdiveni

Bir temel nesneden farklı sözleşmelere adım adım ilerleyebilirsin. İlk basamak gerekli alanları seçer; sonraki basamak istenmeyen alanları çıkarır; bir sonraki de kalan alanları güncelleme için opsiyonel yapar. `Record` ve `Readonly` bu merdivenden bağımsız ama benzer biçimde toplu sözleşme kurar.

![Bir kaynak tipten Pick, Omit ve Partial görünümlerine ilerleyen utility type merdiveni](diagrams/utility-merdiveni.svg)

Kesin kurallar:

1. `Pick<T, K>` yalnız `K` anahtarlarını seçer; seçilen alanların tipini değiştirmez.
2. `Omit<T, K>` `K` anahtarlarını tip görünümünden çıkarır; nesnenin kendisini silmez.
3. `Partial<T>` içindeki her alanı opsiyonel yapar. Bir alanın `null` olmasına dair mevcut anlamı korur.
4. Yardımcı tipleri iç içe uygulayabilirsin. Sıra önemlidir: önce alan kümesini seç ya da çıkar, sonra kalanları opsiyonel yap.
5. `Record<K, V>` anahtar kümesindeki her anahtar için `V` tipinde değer ister.
6. `Readonly<T>` alanları yeniden atamaya kapatır; iç içe nesneleri kendiliğinden derin dondurmaz.
7. Bu dönüşümlerin tümü derleme zamanındadır; çalışma zamanı nesne davranışı oluşturmaz.

```ts check
type Article = {
  id: number
  title: string
  summary: string | null
  published: boolean
  viewCount: number
}

type ArticleTile = Pick<Article, 'id' | 'title' | 'summary'>
type NewArticle = Omit<Article, 'id' | 'viewCount'>
type ArticlePatch = Partial<NewArticle>
type ArticleStatus = Record<'draft' | 'live', string>
type FrozenTile = Readonly<ArticleTile>

const patch: ArticlePatch = { summary: null }
const statuses: ArticleStatus = { draft: 'Taslak', live: 'Yayında' }
const tile: FrozenTile = { id: 12, title: 'Kıyı', summary: null }
```

`ArticlePatch` içindeki `summary` verilmemiş olabilir; verilirse `string | null` olarak kalır. `null`, “alan var ama bilinçli olarak boş” demektir. Opsiyonellik ise nesnede anahtarın bulunmayabilmesini anlatır. İkisini aynı şey gibi ele alma.

## Form güncellemesini satır satır izle

Bir düzenleme formu sadece değişen alanları gönderebilir. Önce sunucunun verdiği alanları form görünümünden çıkarır, ardından kalan alanları isteğe bağlı yaparsın:

```ts check
type Profile = {
  id: string
  displayName: string
  biography: string | null
  followerCount: number
}

type EditableProfile = Omit<Profile, 'id' | 'followerCount'>
type ProfilePatch = Partial<EditableProfile>

function mergeProfile(current: EditableProfile, patch: ProfilePatch): EditableProfile {
  return { ...current, ...patch }
}

const current = { displayName: 'Deniz', biography: 'Yazar' }
const updated = mergeProfile(current, { biography: null })
```

| Zaman | Tip düzeyinde olan | Çalışma zamanında olan |
| --- | --- | --- |
| `ProfilePatch` tanımlanır | `displayName` ve `biography` opsiyonel görünür | Nesne henüz yaratılmaz |
| `{ biography: null }` çağrılır | `null`, izin verilen değer olduğu için kabul edilir | Patch nesnesi tek alan taşır |
| spread birleştirir | Dönüş tipi `EditableProfile` olur | Yeni nesne oluşturulur, `current` değişmez |
| Sonuç kullanılır | `id` ve `followerCount` görünümde yoktur | Kaynak `current` nesnesinde bu alanlar varsa yerinde dururlar |

Son satır önemli: `EditableProfile` tipi `id` alanını göstermiyor diye gerçek `Profile` nesnesinden `id` silinmez. `mergeProfile` yalnızca iki form görünümünü birleştirir. API'ye gönderilecek gövdeyi seçerken çalışma zamanı nesnesini de açıkça kurmalısın.

## Önce kırık, sonra doğru

Ayrı tipleri elle kopyalamak alan tiplerini kaydırır:

```ts
type ProfileTile = { displayName: string; biography: string }
type ProfileForm = { displayName?: string; biography?: string }
```

Bu kopyalarda `biography: null` olasılığı kayboldu. Bir alanı güncellemek için de iki kaydı elle takip etmek gerekiyor. Temel tipi kaynağa bağlayarak düzelt:

```ts check
type Profile = { id: string; displayName: string; biography: string | null }
type ProfileTile = Pick<Profile, 'displayName' | 'biography'>
type ProfileForm = Partial<Pick<Profile, 'displayName' | 'biography'>>

const tile: ProfileTile = { displayName: 'Deniz', biography: null }
const formChange: ProfileForm = { biography: null }
```

`Pick` burada iki yerde aynı kaynak alanı kullanır. `Partial` alanın varlığını opsiyonel yapar, değer union'ını değiştirmez. Form boş string gönderiyorsa bunun `null` ile aynı iş kuralı olup olmadığını uygulama ayrıca belirlemelidir.

## `Record` ile eksiksiz tablo kur

Bir sabit anahtar kümesinin tümünü kapsayan tablo gerektiğinde `Record` kullanılır. Örneğin iki görünüm modu için metin tablosunda anahtar unutulursa derleyici eksik alanı gösterir. `Record<string, string>` ise her olası string için sözleşmeyi genişletir ve kapalı anahtar kümesinin sağladığı güvenceyi kaybettirir.

```ts check
type View = 'grid' | 'list'
const viewNames: Record<View, string> = {
  grid: 'Kartlar',
  list: 'Satırlar',
}
const label: string = viewNames.grid
```

`Readonly<Record<View, string>>` ile tablo referansını koruyup sonradan alan atamasını yasaklayabilirsin. Ancak `Readonly` sığdır: değerler başka nesnelerse onların iç alanları ayrıca mutable kalabilir.

Bir başka dikkat noktası patch birleştirme sırasıdır. `{ ...current, ...patch }` yazınca patch içindeki alanlar eskilerin üzerine gelir; ters sırada `{ ...patch, ...current }` ise güncellemeleri ezer ve beklediğin sonucu üretmez. Utility type yalnızca patch'in hangi alanları taşıyabileceğini tanımlar. Hangi alanın kazanacağı runtime kodundaki spread sırasıyla belirlenir.

`Partial<T>` boş nesneye de izin verir. `{}` geçerli olabilir; uygulamanın boş güncellemeyi reddetmesi gerekiyorsa bunu form veya API katmanında ayrıca kontrol et. Bir alanı sadece `undefined` göndermek ile hiç göndermemek de serialize edilen JSON'da farklı davranabilir: `JSON.stringify` nesnedeki `undefined` alanı çıkarır, `null` ise açıkça taşır. Patch sözleşmesini tasarlarken istemcinin bu değerleri nasıl ürettiğini ve sunucunun nasıl yorumladığını birlikte düşün.

Nested alanlarda `Partial` yalnızca üst katmanı opsiyonel yapar. `Partial<{ preferences: { theme: string } }>` içinde `preferences` verildiyse içindeki `theme` hâlâ zorunludur. Bu davranış çoğu API patch'i için iyi bir varsayılandır; derin kısmi güncelleme isteniyorsa ayrıca birleştirme semantiği tanımlamak gerekir. Derin merge'i otomatik varsaymak, array ve null gibi değerlerde belirsizlik yaratır.

## Sınırlar ve sık hatalar

:::mistake[Belirti: Tipten alanı çıkardın ama ekranda hâlâ görünüyor]
Belirti → `Omit<User, 'token'>` sonrasında JSON'a çevrilen gerçek nesne hâlâ `token` içeriyor.  
Neden → `Omit` derleme zamanı görünümünü değiştirir, nesneyi çalışma zamanında kopyalamaz.  
Düzeltme → İzin verilen alanları yeni nesneye açıkça seç veya API'ye gönderirken ayrı bir DTO oluştur.
:::

:::mistake[Belirti: Alanı vermeden `null` göndermek istiyorsun]
Belirti → `Partial<T>` kullanmana rağmen `null` değerini kabul etmiyor.  
Neden → Alan temel tipte `null` olamıyorsa `Partial` bunu eklemez.  
Düzeltme → İş kuralı gerçekten boş değere izin veriyorsa kaynak alana `| null` ekle; yalnızca güncellemede alan atlanabilsin istiyorsan `Partial` kullan.
:::

:::mistake[Belirti: Yeni form alanları eklenince iki tip farklılaşıyor]
Belirti → Formdan gelen isim temel modelde yok veya yanlış yazılmış.  
Neden → Tipler elle kopyalanmış ve alan listeleri ayrı büyümüş.  
Düzeltme → `Pick` / `Omit` ile temel tipi tek kaynak yap; `Record<Union, Value>` ile sabit tablonun her anahtarını zorunlu tut.
:::

:::mistake[Belirti: `Readonly` ile iç içe her şeyin kilitlendiğini sanıyorsun]
Belirti → Üst alanı değiştiremiyorsun ama `settings.theme` değişiyor.  
Neden → `Readonly<T>` yalnızca doğrudan özellikleri readonly yapar.  
Düzeltme → Derin değişmezlik gerçekten gerekiyorsa ayrı ve bilinçli bir tip tasarla; her model için otomatik derin readonly varsayma.
:::

:::sector
API ekipleri oluşturma girdisi, güncelleme girdisi ve okuma cevabını ayırır. `Omit` ve `Partial` bu sözleşmeleri temel modelden türetip alan kaymasını azaltır; fakat güvenlik sınırı değildir. Sunucuya giden gerçek nesnede hassas alanların bulunmadığını çalışma zamanı koduyla da sağlamalısın.
:::

## Özet

- `Pick` seçer, `Omit` tip görünümünden çıkarır.
- `Partial` alanı opsiyonel yapar ama `null` anlamını değiştirmez.
- `Record` kapalı anahtar kümesindeki tüm değerleri zorunlu kılar.
- `Readonly` sığ bir atama kısıtıdır.
- Utility type'lar gerçek JavaScript nesnesini değiştirmez.

**Kendini yokla:** `summary?: string | null` ile `summary: string | null` arasındaki fark nedir?  
*Cevap:* İlki anahtarın hiç bulunmamasına da izin verir; ikincisi anahtarı zorunlu kılar ama değeri `null` olabilir.

**Kendini yokla:** `Omit<Account, 'secret'>` yaptığında `JSON.stringify(account)` secret alanını siler mi?  
*Cevap:* Hayır. Nesneyi çalışma zamanında ayrıca seçip kopyalaman gerekir.
