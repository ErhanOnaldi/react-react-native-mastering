---
title: "Query tarifini queryOptions ile paylaş"
minutes: 15
kind: concept
---

# Query tarifini queryOptions ile paylaş

:::pain[Problem]
Bir ölçüm kartı kullanıcının üzerine gelince ayrıntı isteği başlıyor. Ayrıntı ekranında aynı veri için ayrı bir key yazılmış; tıklayınca ekranda ikinci GET görüyorsun. İki taraf aynı URL’ye gidiyor olsa da cache bunların aynı cevap olduğunu bilmiyor.
:::

## Kimlik ve işi aynı tarifte tut

Bir query’nin iki temel parçası var: `queryKey` hangi cevabın istendiğini anlatır; `queryFn` o cevabı getirir. Bu iki parça birlikte yaşamalıdır. Ayrı dosyalara veya handler’lara dağılınca bir tarafın key’i değişip diğerinin değişmemesi kolaylaşır. `queryOptions` bir seçenek nesnesini tipli, tekrar kullanılabilir tarife dönüştürür.

Tarif modelinin kesin kuralları:

1. Options factory çağrısı key, query function ve ayarları içeren sıradan bir nesne üretir; kendi başına fetch başlatmaz.
2. `useQuery` aynı tarifi alıp component’i key’e abone eder.
3. `prefetchQuery` ve `fetchQuery` aynı key alanına yazar; farklı tarifler kullanmak ayrı cache kimliği üretebilir.
4. `queryFn` dönüş tipi data tipinin kaynağıdır; başka consumer aynı tarifi kullandığında bu tip korunur.
5. Prefetch tazelik garantisi değildir; fresh süre dolduğunda normal refetch davranışı yeniden geçerli olur.

:::model[Query key]
Key sonuç kimliğidir; cevabı etkileyen parametrelerin tamamı key’e girer. Bu derste değişen şey, key’i nasıl düşündüğümüz değil, aynı kimlik ile aynı fetch işlevini `useQuery`, `prefetchQuery` veya `fetchQuery` arasında nasıl taşıdığımızdır.
:::

![Bir options tarifinin component, prefetch ve fetch tüketicileri tarafından paylaşılması](diagrams/query-tarifi.svg "Aynı key ve query function farklı kullanımlara taşınır.")

Tarif oluşturmak ağ isteği başlatmaz. `queryOptions` yalnızca nesne üretir. Component `useQuery(options)` ile abone olabilir, event handler `queryClient.prefetchQuery(options)` ile önceden doldurabilir veya bir işlem `queryClient.fetchQuery(options)` ile sonucu bekleyebilir. Üç kullanım da aynı key ve query function’dan beslenir.

## QueryOptions nasıl tip taşır?

TanStack Query 5’in `queryOptions` helper’ı TypeScript’in query function dönüş tipini çıkarmasına yardım eder. Fetch fonksiyonu `Promise<Observation>` döndürürse result’ta `data` tipi `Observation` olur. Ayrı ayrı `useQuery<Observation>` gibi type parameter yazman çoğu durumda gerekmez; tarifteki fonksiyon tipi takip edilir.

```ts check title="src/features/weather/queries.ts"
import { queryOptions } from '@tanstack/react-query'

type Observation = { station: string; humidity: number }

async function getObservation(station: string): Promise<Observation> {
  const response = await fetch(`/api/observations/${encodeURIComponent(station)}`)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return (await response.json()) as Observation
}

export const observationQueries = {
  all: ['observations'] as const,
  station: (name: string) =>
    queryOptions({
      queryKey: ['observations', 'station', name] as const,
      queryFn: () => getObservation(name),
      staleTime: 30_000,
    }),
}
```

`observationQueries.all` yalnızca key parçasıdır; o property’nin kendisi `queryOptions` değildir. `station(name)` ise options döndürür. Bu ayrım yararlıdır: `all` alt aileleri kurmak veya cache işlemlerinde kullanmak için, `station` gerçek sorgu tarifi içindir.

Bir key factory ile options factory’yi birleştirmek de mümkündür. Ekip büyüdüğünde `observationKeys.station(name)` gibi tek kimlik üreticisi, farklı options tariflerinin aynı aileyi kullanmasını sağlar. Ancak aşırı soyutlama yapma: bir sorgu ve bir kullanım varsa isimli factory zorunlu değildir. Factory’nin değeri tekrar eden key parçalarını, süreleri ve query function’ı bir yerde tutmasıdır.

## Aynı tarifi farklı tüketiciler izlesin

| Kullanım | Ne yapar? | Sonuç döner mi? | Cache ilişkisi |
|---|---|---|---|
| `useQuery(options)` | Component’i cache girdisine abone eder | Render sonucunda query state | Abone varken canlı güncellenir |
| `prefetchQuery(options)` | Gerekirse cache’i arka planda hazırlar | Çağırana veri döndürmez | Aynı key’e veri yazar |
| `fetchQuery(options)` | Gerekirse veriyi alır ve çağırana verir | Promise ile veri | Aynı key’i kullanır |

Örneğin ekran `useQuery` ile istasyon kartını render ederken, liste üzerindeki klavye odağı ayrıntıların yakında açılacağını gösterebilir. Handler aynı options factory’yi prefetch’e geçirir. Ayrıntı ekranı da aynı tarifi `useQuery` ile okur. Key’ler ve `staleTime` örtüştüğü için taze veri yeniden kullanılabilir.

:::model[Type inference]
TypeScript’in fonksiyon dönüşünden tipi çıkarması ve generic’lerle çağırana taşıması önceki modüllerde kurulmuştu. Burada `queryFn` Promise’i tarife tip verir; Query helper’ları da bu veriyi component veya client metoduna taşır. Yeni olan, aynı tipli tanımın farklı tüketicilerce kullanılabilmesidir.
:::

## Bir çağrının izini baştan sona sür

Uygulama `observationQueries.station('North')` tarifini kurar. Bu aşamada yalnızca key, fonksiyon ve ayarların bulunduğu nesne vardır; Network’te istek yoktur. Component bu tarifi `useQuery`’ye verdiği anda hook cache’te `['observations','station','North']` girdisini arar. Veri yoksa query function çalışır. HTTP cevabı başarılıysa Promise çözülür ve `humidity` değeri cache’e yazılır. Sonra observer success state’iyle render eder.

Kullanıcı ayrıntıya giderken event handler `prefetchQuery` çağırırsa client aynı key’i bulur. O sırada istek devam ediyorsa aynı query’nin uçuşuna katılır; cache’de taze veri varsa gereksiz yeni istek başlatmaz. Ayrıntı component’i render edilince aynı cache key’ine abone olur. Böylece iki component’in birbirinden bağımsız `fetch` kodu olmak zorunda kalmaz.

`fetchQuery` ile farkı dikkat et: çağıran kod veriyi kullanmak istiyorsa `await client.fetchQuery(options)` yazar ve sonucu alır. `prefetchQuery` ise “birazdan gerekebilir” demektir; UI’a veri dönmez. Bu nedenle prefetch hatasını doğrudan component’te catch edip metin göstermek çoğu zaman amaç değildir; ekranda hata yönetimini o key’e abone olan query’nin sonucu üstlenir.

### Kırık biçim: tanım kopyaları ayrılıyor

```ts
const cardOptions = {
  queryKey: ['observations', 'station', 'North'],
  queryFn: () => getObservation('North'),
}

const pageOptions = {
  queryKey: ['observation', 'North'],
  queryFn: () => getObservation('North'),
}
```

İki query function aynı endpoint’e gidebilir, fakat farklı key’ler iki ayrı cache girdisidir. Hover ile gelen değer ayrıntı ekranının okuyacağı yere yazılmaz. Bir yerde süreyi değiştirip diğerinde unutman da aynı kopyala-yapıştır sorununun başka biçimidir.

### Düzeltilmiş biçim: tek tarif, farklı çağrı

```ts check
import { queryOptions } from '@tanstack/react-query'

type Ferry = { route: string; minutes: number }
declare function getFerry(route: string): Promise<Ferry>

const ferryQuery = (route: string) =>
  queryOptions({
    queryKey: ['ferries', 'route', route] as const,
    queryFn: () => getFerry(route),
    staleTime: 30_000,
  })
```

Tarifi `useQuery(ferryQuery(route))`, `client.prefetchQuery(ferryQuery(route))` ve `client.fetchQuery(ferryQuery(route))` çağrılarına verebilirsin. Aynı route string’ini her çağrıda kullanmak gerekir; başka değer gelirse başka cache girdisi olur.

Tarif kurma ile tüketme arasındaki zaman farkını izleyelim:

| Zaman | Çağrı | Beklenen sonuç | Cache etkisi |
|---|---|---|---|
| Event öncesi | Factory kurulur | Henüz istek yok | Key ve function hazır |
| Kart etkileşimi | `prefetchQuery(options)` | Handler data beklemez | Boş girdiye cevap yazılabilir |
| Ayrıntı görünümü açılır | `useQuery(options)` | Component query state okur | Aynı key’e abone olur |
| Başka işlem data ister | `fetchQuery(options)` | Promise data verir | Taze data varsa yeniden kullanır |

Bu tablo options tarifinin kendisiyle onu tüketen çağrı arasındaki sınırı gösterir. Bu sınır olmasaydı bir factory module import edildiği anda ağ çağrısı yapmak zorunda kalırdı; bu da kodu test etmeyi ve uygulamanın yüklenme sırasını yönetmeyi zorlaştırır. Tarifi fonksiyon olarak dışa aktarmak, ihtiyaç anında parametre alıp key’i kurmayı da sağlar. Her çağrıda aynı `route` verilirse aynı key oluşur; değer değişirse başka key çıkar.

## Sınır durumları ve sık hatalar

:::mistake[Tarifin istek yaptığını sanmak]
**Belirti:** Options nesnesini oluşturunca Network’te GET bekleniyor ama görünmüyor. → **Neden:** `queryOptions` tarif üretir, çalıştırmaz. → **Düzeltme:** Abonelik için `useQuery`, arka plan hazırlığı için `prefetchQuery`, sonucu beklemek için `fetchQuery` kullan.
:::

:::mistake[Key’i factory içinde, fetch parametresini dışarıda unutmak]
**Belirti:** URL North verisini istiyor ama cache girdisi South olarak görünüyor. → **Neden:** Key ve closure farklı değişkenlerden kurulmuş. → **Düzeltme:** Tek parametreyi factory’ye alıp hem key’e hem query function’a oradan ver.
:::

:::mistake[Prefetch sonrası iki GET görmek]
**Belirti:** Hover bir isteği, ekrana geçiş ikinci isteği başlatıyor. → **Neden:** Key’ler farklıdır veya prefetch verisi ekrana gelene kadar stale olmuştur. → **Düzeltme:** Aynı tarifi paylaş; `staleTime`’ı veri yenilenme hızına göre belirle.
:::

:::sector
Takımlar query option factory’lerini endpoint fonksiyonlarının yanında tutar. Böylece cache kimliği, fetch işlevi ve veri tipi aynı yerde değişir. Router loader, hover davranışı ve component aboneliği aynı tarifi paylaşabilir; hangi çağrının ne zaman çalıştığı yine çağıranın kararında kalır.
:::

## Özet

- `queryKey` cache kimliğini, `queryFn` cevabı getirme işini taşır.
- `queryOptions` aynı key, function ve politikaları tipli bir tarifte birleştirir; ağ çağrısı başlatmaz.
- `useQuery` abone olur, `prefetchQuery` cache’i hazırlar, `fetchQuery` sonucu döndürür.
- TypeScript query function dönüşünden veri tipini çıkarır.
- Tek factory farklı tüketicilerin aynı cache girdisine bakmasına yardım eder.

**Kendini yokla:** Tarif üretmek neden GET başlatmaz? `prefetchQuery` ile `fetchQuery` arasındaki kullanım farkı nedir?

**Yanıt:** Tarif yalnızca seçenek nesnesidir; onu tüketen bir client metodu isteği başlatır. Prefetch cache’i hazırlar ve veri döndürmeyi amaçlamaz; fetchQuery sonucu Promise ile verir.
