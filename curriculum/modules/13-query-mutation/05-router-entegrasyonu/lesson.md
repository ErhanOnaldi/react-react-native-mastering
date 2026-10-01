---
title: "Route geçişinde veriyi hazırla"
minutes: 16
kind: concept
---

# Route geçişinde veriyi hazırla

Sinema’da bir film kartına basınca adres `/movie/550` olabilir. Film kimliği bu URL’de zaten duruyor; detay sayfası açıldığında aynı filmi tekrar arayıp beklemek zorunda kalmamak için route geçişi sırasında isteği başlatabilirsin. Önce URL’deki değerin ne olduğunu, sonra geçişi yöneten parçanın ne yapacağını görelim.

## URL’den güvenli bir kimlik çıkar

Route, URL’nin bir biçimine karşılık gelen ekran tanımıdır. Örneğin `/movie/:id`, son parçayı `id` parametresi olarak verir. URL dışarıdan değiştirilebilir; bu nedenle `params.id` değerini güvenilir bir sayı gibi kullanma. Önce sayıya çevir, sonra bunun pozitif bir tam sayı olduğunu doğrula.

İlk örnek yalnızca bu dönüşümü yapıyor. Henüz istek yok; tek yeni fikir URL’den gelen metnin kontrol edilmesi. `Number('abc')`, `NaN` üretir. Bu değeri query key’e veya API yoluna verirsen anlamlı olmayan bir film isteği başlatmış olursun.

```ts check
export function readMovieId(rawId: string | undefined): number {
  const id = Number(rawId)
  if (!Number.isInteger(id) || id <= 0) throw new Error('Geçersiz film adresi')
  return id
}
```

Ne oldu? `/movie/550` için fonksiyon `550` döndürür; `/movie/abc`, boş değer veya sıfır için hata verir. Bu kontrol URL biçiminin doğru olup olmadığını söyler, filmin API’de gerçekten var olduğunu değil. Kaynak yoksa API isteği sonradan 404 döndürebilir. İki soruyu ayırmak, bozuk URL için gereksiz istek atmamanı sağlar.

## Route geçişi sırasında isteği başlat

React Router’ın **Data mode**’u, route tanımlarını `createBrowserRouter` ve `<RouterProvider>` ile kurup geçiş öncesi çalışan `loader` gibi özellikleri ekleyen çalışma biçimidir. `loader`, route’a geçerken çalışan veri hazırlama fonksiyonudur. Kullanıcı linke bastığında router hedef route’u bulur, loader’ı çalıştırır ve loader tamamlanınca yeni route’u gösterir.

Bu sırada TanStack Query’deki `QueryClient` aynı film cevabını cache’te saklayabilir. **Cache**, daha önce alınmış verinin sonraki kullanım için tutulduğu yerdir. `ensureQueryData`, verilen query key için cache’de veri varsa onu döndürür; yoksa queryFn’i çalıştırıp sonucu cache’e koyar. İkinci örnekte loader, film kimliğini kontrol ettikten sonra Query’den filmi hazırlıyor.

```ts check
import { QueryClient } from '@tanstack/react-query'

type Movie = { id: number; title: string }
declare function fetchMovie(id: number): Promise<Movie>

export function makeMovieLoader(client: QueryClient) {
  return async ({ params }: { params: { id?: string } }) => {
    const id = Number(params.id)
    if (!Number.isInteger(id) || id <= 0) throw new Error('Geçersiz film adresi')
    return client.ensureQueryData({
      queryKey: ['movie', id],
      queryFn: () => fetchMovie(id),
    })
  }
}
```

Ne oldu? Geçersiz `id` için loader hata verir ve `fetchMovie` çalışmaz. Geçerli kimlikte `ensureQueryData` film verisini hazırlar; aynı key ile tekrar çağrılırsa cache’deki sonucu kullanabilir. Loader’ın burada veriyi döndürmesi, route geçişini verinin hazır olmasına bağlar. Bu seçim kısa ve sayfa için temel bilgide kullanışlıdır; büyük, yavaş ve ekranın geri kalanı için şart olmayan içerik geç yüklenebilir.

Bir loader’ın çalışması, Query’nin bileşendeki işini bitirdiği anlamına gelmez. Loader yalnızca route açılmadan önce cache’i hazırlar. Bileşen aynı query key ile `useQuery` veya `useSuspenseQuery` çağırınca cache’e **abone olur**: cache değiştiğinde yeni sonucu görür, invalidation ve refetch davranışına katılır. Loader sonucunu `useLoaderData` ile yerel state’e kopyalarsan bu canlı bağlantıdan ayrılıp ikinci bir veri kaynağı yaratabilirsin.

## İki taraf aynı query tarifini paylaşsın

Üçüncü örnekte query tanımını `queryOptions` fonksiyonuna alıyoruz. Bu yardımcı, key ve queryFn’i tek bir tarifte bir araya getirir; loader ve bileşen aynı tarifi çağırabilir. Yeni olan ortak tarif; loader’ın cache’i hazırlaması ve component’in cache’e abone olması önceki örnekteki gibi kalır.

```tsx check
import { queryOptions, useSuspenseQuery, QueryClient } from '@tanstack/react-query'

type MovieCredits = { cast: string[] }
declare function fetchCredits(movieId: number): Promise<MovieCredits>

const creditsOptions = (movieId: number) =>
  queryOptions({
    queryKey: ['movie', movieId, 'credits'],
    queryFn: () => fetchCredits(movieId),
  })

export async function creditsLoader(client: QueryClient, movieId: number) {
  await client.ensureQueryData(creditsOptions(movieId))
  return null
}

export function CreditsPanel({ movieId }: { movieId: number }) {
  const { data } = useSuspenseQuery(creditsOptions(movieId))
  return <p>Oyuncu sayısı: {data.cast.length}</p>
}
```

Ne oldu? Loader film oyuncu bilgisini aynı key ile cache’e alır; `CreditsPanel` o veriyi okur ve sonraki cache değişikliklerini izler. Query tanımının iki kopyası olmadığı için key’in bir yerde `credits`, diğer yerde `cast` yazılması gibi ayrışmalar azalır. Uygulamada `QueryClient` tek kez oluşturulup loader’a verilir; her navigasyonda yeni client oluşturmak, önceden dolmuş cache’e erişimi keser.

Geçiş sırasını `/movie/550` için izleyelim. Cache key, Query’de belli bir cevabı bulmak için kullanılan kimliktir. Router loader’ı hedef route’un parçasıdır; React bileşenleri ancak loader tamamlandıktan sonra yeni route’ta render olur.

| Zaman | Router | Query cache | Kullanıcının gördüğü |
| --- | --- | --- | --- |
| t0 | Film linkine basılır, `/movie/550` eşleşir | Değişiklik yok | Önceki route |
| t1 | Loader `id` değerini metinden sayıya çevirip doğrular | Henüz query yok | Navigasyon sürüyor |
| t2 | Loader `ensureQueryData` çağırır | Cache boşsa GET başlar | Router bekleme UI’ı gösterebilir |
| t3 | Loader Promise’i çözülür | Film `['movie', 550]` key’iyle cache’te | Detay route render edilir |
| t4 | Bileşen aynı key’e abone olur | Aynı film verisini okur | Film başlığı görünür |

Cache’de veri varsa t2’de GET gerekmez. Cache’de eski veri olsa bile `ensureQueryData` varsayılan olarak onu hemen döndürebilir; “loader çağrıldı” demek “kesinlikle yeni GET başladı” demek değildir. Cache’in tazelik süresi ve refetch davranışı bu karardan ayrıdır. Loader beklerken görünen route-level pending UI ile bileşenin Suspense fallback’i de farklı beklemelerdir: ilki navigasyon tamamlanmadan, ikincisi render edilen alt içerik veri beklerken görünür.

:::mistake[Loader ve component ayrı key kullanıyor]
Belirti → Route açılışında aynı film için iki GET görüyorsun. Neden → Loader `['movie', id]`, component `['movies', id]` gibi başka bir key kullanıyor. Query key eşitliği, cache kaydının ortak olup olmadığını belirler. Düzeltme → Ortak bir `queryOptions` fonksiyonu tanımla ve iki tarafta da onu kullan.
:::

:::mistake[Geçersiz id API’ye gidiyor]
Belirti → `/movie/nope` açılınca `NaN` içeren bir istek çıkıyor. Neden → Parametre sayı yapılmış ama tam sayı ve pozitif olma koşulları denetlenmemiş. Düzeltme → Loader içinde query başlamadan önce `Number.isInteger` ve aralık kontrolü yap.
:::

:::mistake[Loader verisini kopyalayıp aboneliği bırakmak]
Belirti → Film puanı değişti, ama route’taki oyuncu sayısı veya detay eski kaldı. Neden → Loader’ın döndürdüğü veri Query cache’inden ayrı tutuluyor. Düzeltme → Loader cache’i hazırlasın; bileşen aynı key/options ile Query hook’una bağlansın.
:::

Loader içindeki hata ile bileşen query’sinin hatası farklı zamanda oluşabilir. Loader reddedilirse React Router’ın route hata UI’ı devreye girer. Component içindeki ilk query yüklemesi Suspense kullanıyorsa bekleme için Suspense, render sırasında yükselen hata için Error Boundary gerekir. Kullanıcı aynı sorun için iki farklı genel mesaj görmesin diye her hata yolunun hangi sınırda gösterileceğini seç.

:::info[Derinlemesine (isteğe bağlı)]
`ensureQueryData` cache’de stale veri bulduğunda varsayılan olarak onu döndürür. Stale iken arka planda yenileme istemek için `revalidateIfStale` seçeneği vardır; route’un her geçişte taze veri beklemesi gerekip gerekmediğine göre seç. Router’ın `LoaderFunctionArgs` tipi, router’dan gelen parametre ve istek bilgilerini ayrıntılı biçimde tipler; burada yalnızca `params.id` alanını kullandık.
:::

## Özet

- URL parametresi metindir ve API isteğinden önce doğrulanmalıdır.
- Data mode loader’ı route geçişinde çalıştırır; TanStack Query veriyi QueryClient cache’inde tutar.
- `ensureQueryData` aynı key’in verisini döndürür veya yoksa getirir; kendi başına bileşeni cache’e abone etmez.
- Loader ve component aynı query key/options tarifini kullanır; hook bileşeni canlı cache güncellemelerine bağlar.
- Route loader’ının beklemesi ile içerikteki Suspense beklemesi ayrı UI sınırlarıdır.

**Yeni terimler**

- **Data mode:** React Router’da loader ve navigasyon verisi gibi özellikleri sağlayan router çalışma biçimi.
- **Loader:** Route gösterilmeden önce geçiş sırasında çalıştırılan veri hazırlama fonksiyonu.
- **Cache:** Önceden alınan veriyi sonraki kullanım için tutan depo.
- **Query key:** Query cache’inde bir veri kaydını tanımlayan değer dizisi.
- **Abone olmak:** Bileşenin cache değişikliklerini izleyip yeni veride yeniden render olması.

**Kendini yokla:** Loader filmi cache’e aldıysa bileşen neden query hook’u çağırır?

Cevap: Aynı cache kaydına abone olup sonraki güncellemeleri ve invalidation’ı görmek için.

**Kendini yokla:** URL’deki `abc` değeri neden query key’e eklenmeden önce kontrol edilir?

Cevap: Sayıya çevrildiğinde `NaN` olur; bu kimlikle anlamsız bir istek başlatmamak için.
