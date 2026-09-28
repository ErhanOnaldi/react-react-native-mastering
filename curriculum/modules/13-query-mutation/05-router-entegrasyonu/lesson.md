---
title: "Route geçişinde veriyi hazırla"
minutes: 13
kind: concept
---

# Route geçişinde veriyi hazırla

:::pain[Problem]
Harita ekranında bir durağa dokunuyorsun. Adres hemen değişiyor, ardından boş panel ve spinner görünüyor; ancak listedeki durak kartında gerekli isim ve kimlik zaten biliniyordu. Veri yalnızca detay bileşeni render olunca isteniyor.
:::

## URL ile cache’in görevini ayır

React Router’daki `loader`, bir route’a geçerken route verisini hazırlayabilir. TanStack Query’deki `QueryClient`, aynı verinin cache’ini ve yenilenmesini yönetir. Bu iki sistem aynı verinin sahibi olmamalıdır. URL, kullanıcının hangi durağı açtığını söyler; query key de sunucu cevabının hangi kayda ait olduğunu belirler.

:::model[URL state]
URL, paylaşılabilir ve yenilenebilir gezinme state’inin kaynağıdır. Route eşleşmesi URL’den parametreleri çıkarır; loader navigasyon sırasında veri hazırlayabilir. Bu yeni bağlamda loader adresin yerine geçmez ve kendi kopya state’ini oluşturmaz: URL’den kimliği alır, aynı Query cache key’i için veriyi hazırlar.
:::

:::model[Query cache yaşam döngüsü]
`ensureQueryData` aynı key’de veri varsa onu döndürür, yoksa queryFn’i çalıştırır. Tek başına bir observer kurmaz; component aynı query key ile `useSuspenseQuery` veya `useQuery` kullanarak cache’e abone olur. Böylece loader geçişi hızlandırırken cache’in tazelik ve invalidation kuralları component’te yaşamaya devam eder.
:::

## Loader veriyi sahiplenmez, hazırlar

React Router’ın Data mode’unda loader navigasyon sırasında çalışır. `queryClient.ensureQueryData(options)` cache’deki veriyi döndürür veya yoksa bir kez fetch eder. Loader sonucu `useLoaderData` ile component’e kopyalanırsa Query cache’inden ayrılmış ikinci bir veri kaynağı ortaya çıkar. Bunun yerine component aynı key/options ile Query’ye abone olur.

Kurallar:

1. Route parametresi URL’den gelir ve dış girdi gibi doğrulanır. `Number('abc')` değeri `NaN` üretir; bu değeri query key’e koyma.
2. Geçersiz parametre için `loader` açık bir route hatası üretir ve ağ isteğini başlatmaz.
3. Geçerli parametre için loader, component’in kullanacağı aynı `queryOptions` tarifini `ensureQueryData`’ya verir.
4. `ensureQueryData` cache’de veri varsa stale olsa bile varsayılan olarak hemen geri döner; stale veri için `revalidateIfStale` seçeneği ayrıca istenebilir.
5. Component aynı key’e abone olunca cache değişikliklerini, invalidation’ı ve sonraki refetch’leri görür.
6. Loader yalnızca cache’i hazırlıyor; uygulamanın loading ve hata sınırlarını route ağacında ayrıca kurmalısın.

`ensureQueryData` Promise’i route geçişini bekletir. Bu davranış kısa ve kritik veride yararlıdır; büyük ve yavaş bölümler route’u bloke edecekse Suspense ile geç yüklemek daha iyi hissedilebilir. Karar kullanıcı deneyimiyle ilgilidir: başlık olmadan sayfa anlamlı mı, yoksa doğru route’a geçiş için başlık şart mı?

## Navigasyonu zaman sırasıyla izle

`/station/42` adresine geçiyoruz. `stationOptions(42)` hem loader hem component tarafından kullanılır.

| Zaman | Router | Query cache | UI |
| --- | --- | --- | --- |
| t0 | Link tıklanır, `/station/42` eşleşir | Henüz değişiklik yok | Eski route görünür |
| t1 | Loader `id` değerini doğrular | Key `['stations', 42]` aranır | Geçiş sürer |
| t2 | Cache miss ise queryFn başlar | İstek devam eder | Router pending UI gösterebilir |
| t3 | Loader Promise çözülür | Sonuç key’e yazılmıştır | Yeni route render edilir |
| t4 | Component aynı options ile abone olur | Aynı veriyi görür | Durak adı görünür, ikinci GET yok |

Cache hit varsa t2’de ağ gerekmez. `staleTime` 0 ise `ensureQueryData` stale cevabı döndürebilir; component bağlandığında normal refetch kuralları ayrıca çalışabilir. “Aynı key” tek başına bütün ağ davranışını açıklamaz; tazelik ayarını da bil.

## Kırık iki yol ve doğru bağlantı

İlk kırık yol, loader’ın ve component’in farklı key kullanmasıdır. Loader `['stations', id]`, component `['station', id]` kullanırsa cache paylaşılmaz ve ikinci istek gelebilir. İkinci kırık yol, loader’ın sonucu route state’ine kopyalayıp Query subscription’ını atlamaktır; daha sonra mutation invalidation’ı sayfayı güncellemez.

```ts
// Kırık: iki ayrı kaynak ve kimlik
loader: ({ params }) => fetchStation(Number(params.id))
// component: useSuspenseQuery({ queryKey: ['station', id], queryFn: ... })
```

Aşağıdaki örnek farklı bir kaynak kullanır ve `queryOptions` tarifini paylaşır:

```tsx check
import { queryOptions, useSuspenseQuery, QueryClient } from '@tanstack/react-query'

type Weather = { city: string; degrees: number }
declare function getWeather(cityId: number): Promise<Weather>
const weatherOptions = (cityId: number) =>
  queryOptions({ queryKey: ['weather', cityId], queryFn: () => getWeather(cityId) })

export async function weatherLoader(
  client: QueryClient,
  rawId: string | undefined,
) {
  const cityId = Number(rawId)
  if (!Number.isInteger(cityId) || cityId <= 0) throw new Error('Geçersiz şehir')
  await client.ensureQueryData(weatherOptions(cityId))
  return null
}

export function WeatherPanel({ cityId }: { cityId: number }) {
  const { data } = useSuspenseQuery(weatherOptions(cityId))
  return <p>{data.city}: {data.degrees}°</p>
}
```

Burada `loader` imzasını uygulama router’ı kendi `LoaderFunctionArgs` tipiyle uyarlar. Örnek, doğrulamadan önce query başlatmama ve aynı options nesnesini kullanma fikrini gösterir. Gerçek loader’da `queryClient` tek uygulama istemcisinden gelmelidir; route başına yeni `QueryClient` oluşturmak cache’i böler.

## Sınırlar ve hata yolu

Loader’daki hata ile component query hatası iki farklı anda oluşabilir. Loader Promise’i reddedilirse Router route error element’ine geçebilir. Component’in ilk query yüklemesi Suspense altındaysa, query hatası uygun Error Boundary’ye yükseltilmelidir. Aynı mesajı iki yerde gösterip kullanıcıyı şaşırtmamak için hata sahipliğini belirle.

`ensureQueryData` navigasyon sırasında ağ isteği başlatabilir. Kullanıcı navigasyonu iptal etse bile Query isteğinin yaşamı kendi cancellation sinyaliyle yönetilir; loader’ın kendi `fetch` çağrısı ile queryFn içinde ayrı bir fetch başlatma. Tek bir veri kimliği için tek queryFn tanımı kullanmak cache ve retry davranışını tutarlı yapar.

Loader içinde route parametresini bir kere sayıya çevirmek yetmez; güvenli aralık ve domain kuralını da uygulama belirlemelidir. Bir film id’si pozitif integer olabilir, ama URL’deki her pozitif sayı gerçekten bir film değildir. Bu ikinci hata API’den 404 olarak gelir ve route error UI’ına gider. Parametre kontrolü formatı, query sonucu ise kaynağın varlığını doğrular.

`ensureQueryData` önceden yüklenmiş cache’den hemen dönebilir; bu nedenle loader her navigasyonda loading ekranı gösterecek diye düşünme. Cache boşsa router geçişi bekletebilir. React Router `useNavigation` ile üst seviye pending UI gösterebilir; bu görünüm route loader’ının tamamlanmasını bekleyen navigasyona aittir. Component içindeki Suspense fallback’i ise component query’sinin beklemesine aittir. Ekranda iki farklı bekleme göstergesi görüyorsan hangisinin route, hangisinin alt ağaç sahipliğinde olduğunu belirle.

:::mistake[Aynı veriyi iki kere istemek]
Belirti → Route açılırken iki aynı GET görünüyor. Neden → Loader ve component ayrı key/options kullanıyor veya loader doğrudan fetch yapıp component Query’yi başlatıyor. Düzeltme → İki tarafta aynı queryOptions tarifini ve tek QueryClient’ı kullan.
:::

:::mistake[Geçersiz id ile istek]
Belirti → `/station/nope` için `/api/stations/NaN` isteği gidiyor. Neden → Parametre sayı yapılmış ama integer/pozitif kontrolü yok. Düzeltme → Loader’da doğrula; geçersiz değerde query’yi çağırmadan route hatası üret.
:::

:::mistake[Loader sonucunu kopyalamak]
Belirti → Puan değişince route’taki detay eski kalıyor. Neden → `useLoaderData` verisi React Router state’inde kaldı; Query cache’i izlenmiyor. Düzeltme → Loader cache’i hazırlar, component aynı query’ye abone olur.
:::

:::sector
Ekipler query tarifini `queryOptions` içinde bir kere tanımlayıp component, prefetch ve loader’da paylaşır. Bu, query key’in uygulama genelinde tek sözleşme olmasını sağlar. Loader’ı tüm veriyi route state’ine dönüştürmek için değil, kritik verinin navigasyon zamanını seçmek için kullanırlar.
:::

## Özet

- URL hangi kaydın açıldığını, query key sunucu cevabının kimliğini taşır.
- Loader aynı Query cache’ini hazırlar; verinin ikinci sahibi olmaz.
- Geçersiz route parametresi query çalışmadan reddedilir.
- Loader ve component aynı queryOptions/key tarifini kullanır.
- `ensureQueryData` stale cevabı varsayılan olarak döndürebilir; tazelik politikası ayrıca seçilir.

**Kendini yokla:** Loader aynı veriyi önceden aldıysa component Query hook’u neden yine çağırır?  
Cevap: Query cache’ine abone olup invalidation ve refetch değişikliklerini izlemek için.

**Kendini yokla:** Loader’daki `ensureQueryData` cache’de stale veri bulursa her zaman GET başlatır mı?  
Cevap: Hayır. Varsayılan olarak cache’deki veriyi döndürür; stale iken yenileme istenirse `revalidateIfStale` seçeneği kullanılabilir.
