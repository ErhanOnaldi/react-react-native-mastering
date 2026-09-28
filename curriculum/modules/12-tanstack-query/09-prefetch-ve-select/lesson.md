---
title: "Veriyi ihtiyaçtan önce hazırla ve görünümü seç"
minutes: 15
kind: concept
---

# Veriyi ihtiyaçtan önce hazırla ve görünümü seç

:::pain[Problem]
Gemi rotası kartında “Detay”a bastığında yeni sayfa boş kalıyor; kullanıcı seyir özetini bekliyor. Kartın üzerinde bir süre duran imleç, kullanıcının detayla ilgilendiğine dair işaret veriyor. Veri ancak navigasyon başladıktan sonra istenmek zorunda değil.
:::

## Zamanlama ile görünümü ayrı düşün

**Prefetch**, muhtemel bir sonraki ekran için veriyi erken alıp Query cache’ine koyar. **`select`** ise ham query cevabından belirli bir component’in kullanacağı görünümü türetir. Prefetch “ne zaman isteyelim?” sorusu; select “bu component cevabın hangi parçasını kullansın?” sorusudur. Birini seçmek diğerini gerektirmez.

:::model[Query options factory]
Query key ile query function aynı tarifte yaşar ve farklı consumer’lar tarafından tekrar kullanılabilir. Bu yeni bağlamda kart pointer’ı gelince tarif önceden çağrılır; detay ekranı aynı tarifi kullanırsa aynı cache girdisini bulur. Tarifi paylaşmak tek başına isteğin taze olmasını sağlamaz; cache zamanı da önemlidir.
:::

![Etkileşimle başlayan prefetch'in cache'e yazılıp aynı key ile ekran tarafından okunmasını gösteren diyagram](diagrams/prefetch-select.svg "Prefetch zamanlamayı, select görünümü değiştirir.")

Prefetch için `useQueryClient()` ile mevcut client’ı alıp olayda `prefetchQuery(options)` çağırabilirsin. `prefetchQuery` cache’i hazırlamayı dener ama component’e veri döndürmez. Sonuç ekranda gösterileceği zaman o key’e `useQuery(options)` ile abone olunur. Aynı key cache’de fresh ise veri doğrudan gösterilebilir. Arada `staleTime` biterse Query yenileme yapabilir; prefetch “bir daha asla istek yok” garantisi değildir.

Zamanlama modelinin kuralları:

1. Prefetch yalnızca kullanıcıya yakın bir ihtimal doğduğunda başlatılır.
2. Prefetch ve ekran aynı options tarifini ve key’i kullanır.
3. Prefetch istek Promise’ini component state’ine yazmaz; sonucu ortak cache’e koyar.
4. Tazelik sona ererse query policy yeniden fetch yapabilir.
5. `select` ham cevap üstünde saf bir görünüm dönüşümüdür; cache data’sını mutate etmez.

## Hover anından ekrana kadar iz sürelim

Kullanıcı tekne rotası kartının üzerine gelir. `onPointerEnter` handler’ı `routeQueries.detail(id)` tarifini client’a verir. Cache boşsa query function çalışır ve response ilgili key’e yazılır. Kullanıcı kartı açar; detay component’i yine `routeQueries.detail(id)` tarifini `useQuery`’ye verir. Cache’de taze data varsa başlık render edilir. Başka id’ye ait cache girdisi kullanılmaz; her route farklı key’e sahiptir.

| An | Kim çağırdı? | Cache / ağ | Kullanıcı ne görür? |
|---|---|---|---|
| Kart listesi görünür | — | Henüz detay istenmemiş olabilir | Kart özeti |
| Pointer karta gelir | Event handler | Boş girdiyse prefetch başlar | Liste değişmeyebilir |
| Cevap gelir | QueryClient | Detay cache’e yazılır | Kart hâlâ açık |
| Kart açılır | `useQuery` | Aynı key okunur | Taze cache ise detay hemen görünür |
| Tazelik süresi aşılmış | `useQuery` | Eski data görünür, refetch olabilir | Hafif yenileme göstergesi |

Prefetch maliyetlidir: Kullanıcı kartın üzerine geçebilir ama hiç açmayabilir. Her 1000 kartın ayrıntısını liste ilk görünürken getirmek, gecikmeyi azaltmak yerine gereksiz trafik ve sunucu yükü yaratır. Anlamlı niyet işaretinde—pointer, keyboard focus veya açık bir “ön yükle” kararı gibi—prefetch et. Aynı davranış klavye kullanan kişiyi de kapsasın; `onFocus` desteği düşünülebilir.

Prefetch’i query function’ı kopyalayarak yazma. Elle yeni bir key kullanmak, önceden getirilen veriyi ekranın bulamamasına neden olur. Query options factory bu tanımı paylaşır. `queryClient.fetchQuery` ise sonucu event handler içinde gerçekten kullanmak istediğinde uygundur; `prefetchQuery` çağırana data vermez.

## Select cache’in ham verisini bozmaz

Bir query cache’de tam `RouteSummary[]` cevabını tutabilir. Harita marker’ları sadece `id` ve koordinatı ister; menü yalnızca isimleri göstermek isteyebilir. Her consumer kendi `select` dönüşünü tanımlayabilir. Seçilen değer o observer için okunur; cache’deki ham API cevabını kalıcı olarak yeniden biçimlendirmez.

```tsx check
import { useQuery } from '@tanstack/react-query'

type Port = { id: number; name: string; arrivals: number }
type PortResponse = { results: Port[]; page: number }
declare function getPorts(): Promise<PortResponse>

function PortNames() {
  const ports = useQuery({
    queryKey: ['ports', 'arrivals'],
    queryFn: getPorts,
    select: (response) => response.results.map((port) => port.name),
  })

  if (ports.isPending) return <p>Liman adları yükleniyor</p>
  if (ports.isError) return <p role="alert">Liman listesi alınamadı</p>
  return <ul>{ports.data.map((name) => <li key={name}>{name}</li>)}</ul>
}
```

Success dalında `ports.data` artık string array’idir. TanStack Query bunu select callback’in dönüş tipinden çıkarır. Başka component aynı key’i `select` olmadan kullanırsa `PortResponse` okur. Select yalnızca shape değiştirmek için değil, görünümde kullanılmayan alanları tüketiciye taşımamak için de işe yarar.

Select saf ve ucuz kalmalı. Her render’da yeni ve büyük nesneler hesaplamak component’in gereksiz render’larına yol açabilir. Dönüşüm pahalıysa veya başka iş kuralları taşıyorsa API katmanında normalize etmeyi, ya da referansı sabit bir selector kullanmayı değerlendir. `select` içinde fetch başlatma, state değiştirme veya dış sisteme yazma yapma; bu callback veri türetme işidir.

`select` için cache ve gözlenen veri tipini iki ayrı not olarak tut. API cevabı `{ results: Port[], page: number }`; isimler panelinin observer’ı `string[]` görebilir. Başka bir component `Port[]` içindeki koordinatı da okumalıysa ona `select` uygulamak zorunda değilsin. Bir component’in data dönüşümünü tüm API cevabının kalıcı tipi sanmak, selector’ı nerede çalıştırdığını unutmaktır.

Prefetch politikası da ekran görünürlüğüne göre seçilmelidir. Hover anında başlayan bir istek kullanıcı pointer’ı kartta bir an duraklayınca çalışabilir; gecikmesiz hover ise trafik artışına neden olabilir. Pointer ve keyboard focus için ortak bir helper kullanmak davranışı tutarlı yapar. Touch cihazında hover yoktur; ilk tap zaten navigasyon başlatıyorsa prefetch’in ayrıca anlamı olmayabilir. Uygulama bu sinyali ölçüp, en çok kullanılan veya küçük cevaplı detaylarda prefetch yapabilir.

### Kırık örnek: her kart için bütün detayları getir

```tsx
function RouteCard({ route }: { route: { id: number; title: string } }) {
  const client = useQueryClient()
  void client.prefetchQuery(routeQueries.detail(route.id))
  return <button>{route.title}</button>
}
```

Bu kod component render’ında prefetch’i çağırır. Her render query method’una yeniden ulaşır, React render’ını yan etkiyle karıştırır ve bütün görünür kartların ayrıntılarını başlatabilir. Prefetch kullanıcı etkileşimi gibi olayda olmalıdır.

### Doğru biçim: niyet olayına bağla

```tsx
function RouteCard({ route }: { route: { id: number; title: string } }) {
  const client = useQueryClient()
  const prepareDetails = () => {
    void client.prefetchQuery(routeQueries.detail(route.id))
  }

  return (
    <button onPointerEnter={prepareDetails} onFocus={prepareDetails}>
      {route.title}
    </button>
  )
}
```

Bu örnekte `routeQueries` options factory’sinin önceden kurulduğunu varsayıyoruz. Gerçek component’te prefetch işlevini aynı query tarifiyle çağır; event handler promise’i UI’a vermiyorsa `void` dönüşü açık biçimde işaretler.

## Sınır durumları ve sık hatalar

:::mistake[Hover tek giriş yöntemi]
**Belirti:** Mouse kullanıcısında detay hazır, Tab kullanan kişide gecikmeli. → **Neden:** Yalnız pointer event’ine prefetch bağlanmıştır. → **Düzeltme:** Klavye focus gibi eşdeğer niyet olayını da işle; performans kazanımı erişilebilir etkileşimi atlamasın.
:::

:::mistake[Her kartı liste açılışında prefetch etmek]
**Belirti:** Kartlar görünür görünmez onlarca detay GET’i çıkar. → **Neden:** Kullanıcının açma olasılığı olmayan her öğe için veri istenmiştir. → **Düzeltme:** Niyet belirginleşince seçilmiş kartı hazırla; kullanılmayan ağı izle.
:::

:::mistake[Select’in cache’i değiştirdiğini sanmak]
**Belirti:** Bir selector başlık dizisine döndükten sonra başka consumer `results` alanını bulamıyor sanırsın. → **Neden:** Observer dönüşü ile cache’deki ham data karıştırılmıştır. → **Düzeltme:** API cevabını cache’de ayrı düşün, her consumer’ın `select` sonucunu kendi görünümü olarak oku.
:::

:::mistake[Prefetch ile fetchQuery’yi eşitlemek]
**Belirti:** Event handler’dan response’a erişmeye çalışırsın. → **Neden:** `prefetchQuery` bir sonucu UI’a döndürmek üzere tasarlanmamıştır. → **Düzeltme:** Yalnız cache’i önceden dolduracaksan prefetch, çağıran kod sonucu kullanacaksa fetchQuery seç.
:::

:::sector
Ürün ekipleri prefetch’i gerçek etkileşim ölçümleriyle değerlendirir. Her hover’da istek atmak kullanıcının niyetini fazla geniş yorumlayabilir; keyboard focus’u da kapsayan ama trafik bütçesine uyan eşik seç. `select` ise component sınırında minimum okuma modelini kurar.
:::

## Özet

- Prefetch verinin istek zamanını erkene alır; select component’in okuduğu görünümü üretir.
- Aynı query options tarifi hover/focus prefetch ile ekran aboneliğini bağlar.
- Prefetch cache’i doldurur fakat UI’a data döndürmez; stale veri yine yenilenebilir.
- `select` cache’deki ham cevabı kalıcı olarak değiştirmez.
- Prefetch’i render sırasında değil, anlamlı kullanıcı niyetinde başlat.

**Kendini yokla:** Prefetch yapılmış ama tazelik süresi dolmuşsa detay ekranında ne beklenebilir? Bir component başlık dizisi seçtiğinde diğer consumer ham cevap alabilir mi?

**Yanıt:** Eski cache verisi anında gösterilip arka planda yenilenebilir. Evet, select her observer’ın görünümünü türetir; cache ham cevabı korur.
