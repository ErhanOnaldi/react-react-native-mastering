---
title: "Promise tipi ile ağ gerçeğini ayır"
minutes: 16
kind: concept
---

# Promise tipi ile ağ gerçeğini ayır

:::pain[Problem]
Bir detay çağrısı `Promise<Show>` dönüyor. Sunucu yanlış yetki anahtarı için `{ status_code: 7, status_message: 'Invalid key' }` yanıtlıyor. Editör hâlâ `show.title` alanını öneriyor; sayfa başlığı okumaya çalışınca uygulama hata veriyor.
:::

## Promise ne söylüyor, ne söylemiyor?

`Promise<T>`, gelecekte başarıyla elde edilecek değerin tipini anlatır. `async` fonksiyonun dışarıya dönüşü her zaman Promise'tir; fonksiyonun içinde doğrudan `T` döndürsen bile çağıran `Promise<T>` alır. `await` başarılı sonucu bekleyip `T` değerine erişmeni sağlar. Ret edilen Promise ise exception akışına geçer.

Bu tip, işlemin hangi zamanda biteceğini veya dış servisin gerçekten `T` biçiminde cevap vereceğini söylemez. Önceki derste sınırdan gelen veriyi `unknown` kabul edip kontrol etmeyi öğrendin. Ağ isteğinde ikisini birlikte düşün: Promise asenkron sonucu taşır; HTTP cevabının başarılı olup olmadığı ve JSON'un şekli ayrı denetlenir.

:::model[Derleme ve çalışma zamanı sınırı]
`getRecord<T>` çağrısındaki `T`, çağıranın beklentisini ifade eder; `response.json()` gövdesini TypeScript denetlemez. Önceki type guard dersi runtime'da alanları kontrol ederek bu iddiaya dayanak oluşturuyordu. Bu yeni bağlamda ek olarak Promise'in çözülmesi ve HTTP başarısının ayrı olaylar olduğunu hesaba kat.
:::

![TypeScript tipinin derlemede silinmesi ve dış JSON'un runtime'da doğrulanması](diagram:ts-derleme-ve-calisma)

## Async dönüş tipi

```ts check
async function fetchNames(): Promise<string[]> {
  return ['Ada', 'Mina']
}

type FetchPromise = ReturnType<typeof fetchNames>
type Names = Awaited<FetchPromise>
type Args = Parameters<typeof fetchNames>

const promise: FetchPromise = fetchNames()
const names: Names = await promise
const args: Args = []
```

Kesin kurallar:

1. `async function f(): Promise<T>` başarılı tamamlandığında `T` değerini çözer.
2. `ReturnType<typeof f>`, fonksiyonun tam dönüş tipini verir; async fonksiyonda bu genellikle `Promise<T>` olur.
3. `Awaited<ReturnType<typeof f>>`, Promise katmanını açıp başarılı değeri verir; dizi gibi iç içe tipleri açıp tek elemana indirmez.
4. `Parameters<typeof f>`, parametreleri tuple olarak çıkarır ve sıralarını korur.
5. Promise tipi rejected olabilecek hatanın tipini burada kodlamaz. Hata davranışını catch veya result union ile ayrı tasarlarsın.
6. `fetch` 4xx/5xx cevabında reject olmaz; yalnızca ağ seviyesinde hata olduğunda Promise reddedilir.
7. JSON gövdesi tek kez okunur. Başarısız HTTP cevabında gövdeyi başarı verisi gibi ele alma; 204 gibi boş cevaplarda JSON parse etmeye çalışma.

Bu tür yardımcılar var olan bir fonksiyonun imzasını tekrar yazmadan başka bir tipe veya adaptöre taşımayı sağlar. `Parameters` ile tuple'ın `[0]` elemanı ilk parametre, `[1]` ikincidir; argüman sırası da sözleşmenin parçasıdır.

## İsteğin zaman çizgisinde iz sür

```ts
async function loadProfile(url: string): Promise<Profile> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const raw: unknown = await response.json()
  return parseProfile(raw)
}
```

| Sıra | Çalışan satır | Promise / değer | Önemli sonuç |
| --- | --- | --- | --- |
| 1 | `loadProfile(url)` çağrılır | `Promise<Profile>` hemen döner | Çağıran bekleyebilir veya `.then` kullanabilir |
| 2 | `fetch(url)` çağrılır | `Promise<Response>` beklenir | Bağlantı/CORS/abort hatası reject edebilir |
| 3 | `response.ok` okunur | boolean | 404/500 için fetch yine Response vermiştir; burada sen hata üretirsin |
| 4 | `response.json()` beklenir | `unknown` gövde | Cevap stream'i okunur; ikinci kez okunamaz |
| 5 | `parseProfile(raw)` çalışır | doğrulanmış `Profile` | Guard/şema reddederse fonksiyon hata verir |
| 6 | async fonksiyon tamamlanır | `Promise<Profile>` resolve olur | Başarı tipi yalnız başarılı yolu anlatır |

Her `await`, fonksiyonun devamını Promise tamamlanana kadar erteler; ana thread senkron kodu işlemeye devam edebilir. Hata fırlatılırsa o satırdan sonraki başarı satırları atlanır ve dönen Promise reject olur. `Promise<Profile>` hata cevabının da Profile olduğunu söylemez.

## Önce kırık, sonra doğru

Bu kod, status'a bakmadan her gövdeyi başarı cevabı olarak okur:

```ts
async function loadProfile(url: string): Promise<Profile> {
  const response = await fetch(url)
  return (await response.json()) as Profile
}
```

401 için JSON parse başarılı olabilir; hata HTTP status'udur. Fakat cast, `{ status_code: 7 }` değerini `Profile` olarak gösterir. Önce HTTP durumunu kontrol et, sonra gövdeyi runtime'da doğrula:

```ts check
type Profile = { id: number; displayName: string }
function isProfile(value: unknown): value is Profile {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  if (!('id' in value) || !('displayName' in value)) return false
  return typeof value.id === 'number' && typeof value.displayName === 'string'
}

async function loadProfile(url: string): Promise<Profile> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`İstek başarısız: ${response.status}`)
  const raw: unknown = await response.json()
  if (!isProfile(raw)) throw new Error('Geçersiz profil cevabı')
  return raw
}
```

Bu örnekte status başarısı ve JSON şekli iki ayrı kapıdır. `response.ok`, yalnızca status kodunun 200–299 aralığında olduğunu söyler; başarılı bir status ile bozuk JSON sözleşmesi gelebilir. Guard da yalnızca tanımladığı alanları doğrular.

## Generic `getJson<T>` iddiası

Bir generic JSON yardımcısı, ağ cevabını çağıranın istediği tipe bağlayabilir. Bu kullanım ergonomiktir ama generic parametresi doğrulama değildir:

```ts
const result = await getJson<Profile>('/api/profile')
```

Bu satır, “bu çağrıda başarı gövdesi `Profile` olacak” beklentisini ifade eder. Yardımcı içinde `response.json() as T` varsa kontrol eklenmemiştir. Tüm çağıranlar doğru varsaymak zorunda kalır; hata nesnesi de başarılı modelmiş gibi görünür. Daha güvenli API, sonucu `unknown` tutup validator veya schema alan bir fonksiyondan geçirmek olabilir. Zod modülünde bu sınır için çalışma zamanı şeması kullanacaksın.

HTTP hatasında hata gövdesini kullanıcıya taşımak gerekiyorsa onu da `unknown` olarak parse edip ayrı hata modeline doğrula. Bir 404'ün gövdesi JSON olsa bile `response.ok` false'dur. Hatanın status kodu, mesajı ve retry kararı uygulamanın açık politikası olmalıdır.

TypeScript `Promise<T>` içinde başarısızlık değerinin şeklini taşımadığı için hatayı `catch` içinde çoğu zaman `unknown` kabul etmek gerekir. JavaScript'te `throw` ile string, Error veya başka herhangi bir değer fırlatılabilir. Yakalanan değerde `.message` okumadan önce `instanceof Error` veya kendi hata guard'ını kullan. Bir endpoint hatalarını dönüş değerinde taşımak istiyorsa `{ ok: true; data: T } | { ok: false; error: ApiError }` gibi bir union kurabilir; o zaman çağıran `ok` kontrolüyle iki dalı daraltır.

Bu karar Promise'in tipiyle değil uygulama API'siyle ilgilidir. Promise reject olduğunda `await` exception gibi davranır; `Promise<T>` başarılı değerin `T` olduğunu söyler ama hangi hataların çıkabileceğini imzaya eklemez. Bir fonksiyon hem beklenen HTTP hatalarını hem beklenmeyen programlama hatalarını tek bir string'e indirirse çağıran retry, kullanıcı mesajı ve log kararlarını ayıramaz. Hata sözleşmesinin de başarı verisi kadar açık olması gerekir.

## Sınırlar ve sık hatalar

:::mistake[Belirti: 404'te `catch` çalışmıyor]
Belirti → `fetch` tamamlanıyor ve `response.status` 404 gösteriyor.  
Neden → `fetch` HTTP 4xx/5xx'i ağ hatası saymaz; Response döndürür.  
Düzeltme → `response.ok` veya status aralığını kendin kontrol et ve uygun hata üret.
:::

:::mistake[Belirti: `Awaited` sonucu hâlâ dizi sanılmıyor]
Belirti → `Awaited<ReturnType<typeof load>>` için `Movie` bekliyorsun, ama cevap `Movie[]`.  
Neden → `Awaited` Promise katmanını açar; dizinin eleman katmanını kaldırmaz.  
Düzeltme → Fonksiyon gerçekten `Promise<Movie[]>` ise sonuç `Movie[]` olur.
:::

:::mistake[Belirti: Aynı Response gövdesini ikinci kez okuyunca hata]
Belirti → `json()` ikinci çağrıda body stream consumed hatası verir.  
Neden → Fetch response gövdesi tek kullanımlıktır.  
Düzeltme → Bir kez oku ve sonucu değişkende tut; hem log hem parse için gerekiyorsa okumadan önce uygun kopyalama stratejisi seç.
:::

:::mistake[Belirti: 204 yanıtında JSON parse hata verir]
Belirti → Sunucu gövde göndermediği için `response.json()` reject olur.  
Neden → No Content cevabında JSON metni yoktur.  
Düzeltme → Endpoint'in gövde sözleşmesini bil ve 204'ü parse etmeye çalışma.
:::

:::mistake[Belirti: Generic dönüş tipi hatalı gövdeye güven verir]
Belirti → Editör `profile.displayName` önerirken runtime'da alan yoktur.  
Neden → `T` yalnızca çağıranın iddiasıdır; JSON doğrulanmamıştır.  
Düzeltme → Başarı durumunu denetle ve `unknown` cevabı runtime guard ya da schema ile doğrula.
:::

:::sector
Üretim API client'ları genellikle status kodlarını merkezi biçimde ele alır, endpoint cevabını doğrular ve async fonksiyonların dönüşlerini tekrar kullanılabilir tiplerden türetir. `ReturnType` ve `Awaited`, imza kopyalarını azaltır; çalışma zamanı doğrulama ihtiyacını ortadan kaldırmaz.
:::

## Özet

- Async fonksiyon başarılı değeri `Promise<T>` içine sarar.
- `ReturnType`, `Parameters` ve `Awaited` fonksiyon imzasını türetir.
- `fetch` HTTP hata durumunda resolve olur; `response.ok` kontrolü sana aittir.
- Response gövdesi bir kez okunur; 204'te JSON yoktur.
- Generic `getJson<T>` çağıran beklentisidir, runtime doğrulaması değildir.

**Kendini yokla:** `Promise<Movie[]>` için `Awaited<...>` nedir?  
*Cevap:* `Movie[]`; Promise katmanı kalkar, dizi kalır.

**Kendini yokla:** `getJson<Movie>` çağrısı neden sunucudan Movie geldiğini kanıtlamaz?  
*Cevap:* Generic yalnızca derleme zamanı tip iddiasıdır; cevabın alanları runtime'da kontrol edilmemiştir.
