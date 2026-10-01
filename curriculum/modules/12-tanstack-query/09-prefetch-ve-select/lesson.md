---
title: "Veriyi ihtiyaçtan önce hazırla ve görünümü seç"
minutes: 15
kind: concept
---

# Veriyi ihtiyaçtan önce hazırla ve görünümü seç

Film listesindeki bir karta dokununca detay ekranı açılıyor ve veri beklenirken boş bir alan görüyorsun. Kartın açılacağını önceden kesin olarak bilemezsin, ama kullanıcının bir karta yönelmesi yaklaşan ihtiyaca dair bir ipucu verir. İki ayrı araç bu deneyimin farklı taraflarını çözer: `prefetch` isteği erkene alır, `select` ise gelen cevaptan bir görünüm türetir.

## Detay verisini ihtiyaç yaklaşınca iste

Önce bir filmi açma düğmesinin tıklanınca detayını istemesini düşün. Handler, yani event çalıştığında çağrılan fonksiyon, query client üzerinden cache’i önceden doldurabilir. Query client, uygulamanın Query cache’ine eriştiğin nesnedir; daha önce `QueryClientProvider` üzerinden component’lere verilmiştir.

```tsx
function FilmKartı({ id, title }: { id: number; title: string }) {
  const client = useQueryClient()

  function prepareDetails() {
    void client.prefetchQuery({
      queryKey: ['movies', 'detail', id],
      queryFn: () => getMovie(id),
    })
  }

  return <button onFocus={prepareDetails}>{title}</button>
}
```

Bu örnekte klavye odağı karta geldiğinde detay isteği başlar. `prefetchQuery` cevabı component’e vermez; cache’e yazar. Film açılırken detay component’i aynı key’i kullanırsa cache’teki uygun veriyle başlayabilir. Bu örnekte `onFocus` kullanmamız mouse davranışını çözmüyor; birazdan iki etkileşim türünü birlikte değerlendireceğiz.

![Etkileşimle başlayan prefetch'in cache'e yazılıp aynı key ile ekran tarafından okunmasını gösteren diyagram](diagrams/prefetch-select.svg "Prefetch zamanlamayı, select görünümü değiştirir.")

`prefetch` veri gerekmeden hemen önce cache’e koyma işlemidir. Cache, istek cevaplarının key’lerine göre saklandığı yerdir. Her kartın ayrıntısını liste açılır açılmaz istemek doğru olmaz: kullanıcı açmayacağı filmler için de istek gider. Aşağıdaki adımda aynı fikri fareyle karta gelme durumuna ekleyelim.

```tsx
function FilmKartı({ id, title }: { id: number; title: string }) {
  const client = useQueryClient()
  const prepareDetails = () => {
    void client.prefetchQuery(movieDetailOptions(id))
  }

  return (
    <button onMouseEnter={prepareDetails} onFocus={prepareDetails}>
      {title}
    </button>
  )
}
```

Burada mouse işaretçisi karta girdiğinde ya da klavyeyle karta odaklanıldığında aynı detay tarifi çalışır. İki olay da kullanıcının o filme yönelebileceğini gösterir. Prefetch ve detay ekranı aynı key’i kullanmalıdır; farklı key olursa Query onları iki ayrı veri sanır.

## İstekten ekrana kadar iz sür

Sinema’daki bir yönetmen kartını düşün: kartta adı görünür; kullanıcı ayrıntı sayfasına geçebilir. Aynı detay seçenekleriyle önce prefetch, sonra ekranda `useQuery` kullanılır.

| An | Ne çalışır? | Cache ve ağ | Kullanıcının gördüğü |
|---|---|---|---|
| Kart görünür | Liste query’si | Detay henüz istenmemiş olabilir | Yönetmen adı |
| Kartta niyet oluşur | `prefetchQuery` | Key boşsa detay isteği başlar | Liste değişmez |
| Cevap gelir | Query client | Detay cevabı o key’e yazılır | Kart hâlâ görünür |
| Detay ekranı açılır | `useQuery` aynı key’i okur | Veri tazeyse yeni istek gerekmez | Detay hızlıca görünür |
| Veri eskimiştir | Query günceller | Eski cevap varken yenileme başlayabilir | Detay görünür, veri yenilenir |

Prefetch “bu veri bir daha istenmez” sözü değildir. Daha önce öğrendiğin `staleTime`, verinin ne kadar süre taze sayılacağını belirler; süre dolduğunda ekrana bağlı query yeniden istek yapabilir. Bu yüzden prefetch’in amacı isteği erkene almaktır, bütün sonraki ağ trafiğini yok etmek değil.

:::model[Query options factory]
Query key ve query function’ı ortak bir options factory’den alabilirsin. Bu model burada prefetch’i ve detay ekranını aynı tarifte buluşturur; tarif aynı olsa bile cache’in tazelik süresi davranışı belirlemeye devam eder.
:::

## Her görünüm tam cevaba ihtiyaç duymaz

API film cevabında id, başlık, puan ve açıklama bulunduğunu varsayalım. Küçük bir panel yalnız puanları gösterecekse `select`, query sonucundan sadece gereken kısmı çıkarabilir.

```tsx check
import { useQuery } from '@tanstack/react-query'

type Film = { id: number; title: string; vote_average: number }
type MovieResponse = { results: Film[]; page: number }
declare function getPopularMovies(): Promise<MovieResponse>

function RatingList() {
  const query = useQuery({
    queryKey: ['movies', 'popular'],
    queryFn: getPopularMovies,
    select: (response) => response.results.map((movie) => movie.vote_average),
  })

  if (query.isPending) return <p>Filmler yükleniyor</p>
  if (query.isError) return <p role="alert">Filmler alınamadı</p>
  return <ol>{query.data.map((rating) => <li key={rating}>{rating}</li>)}</ol>
}
```

Başarılı durumda `query.data` artık puan dizisidir; TypeScript bunu `select` fonksiyonunun dönüşünden çıkarır. Cache’te yine `MovieResponse` durur. `select`, ham cevabı mutate etmeden o query’yi kullanan component’in gördüğü şekli değiştirir.

Bir başka panel aynı film query’sinden puan yerine puan ve başlığı birlikte seçebilir. Aynı key’i okuyup farklı bir `select` yazması cache’in içeriğini değiştirmez; yalnızca o panelin kullanacağı sonucu değiştirir.

```tsx
const summaryQuery = useQuery({
  queryKey: ['movies', 'popular'],
  queryFn: getPopularMovies,
  select: (response) =>
    response.results.map((movie) => ({ title: movie.title, rating: movie.vote_average })),
})
```

Bu component’in data tipi `{ title, rating }[]` olurken başka bir component ham cevabın `results` alanına erişebilir. `select` dönüşü yalnızca bu query observer’ının görünümüdür; observer, aynı cache verisini okuyan component’in cache ile kurduğu bağlantı anlamına gelir.

## Birlikte kullan ama görevlerini karıştırma

Sinema’nın ana sayfasında popüler filmler zaten yükleniyor olsun. Kullanıcı bir filmi işaret edince detay cevabını erken almak isteyebilirsin; liste component’i de API cevabının yalnız başlık ve puan alanlarını ekrana çıkarabilir. Bu iki davranış aynı ekranda bulunabilir, ama farklı sorulara cevap verir.

```tsx
function PopularShelf() {
  const movies = useQuery({
    queryKey: ['movies', 'popular'],
    queryFn: getPopularMovies,
    select: (response) => response.results.map(({ id, title, vote_average }) => ({ id, title, vote_average })),
  })

  if (movies.isPending) return <p>Popüler filmler yükleniyor</p>
  if (movies.isError) return <p role="alert">Liste alınamadı</p>

  return (
    <ul>
      {movies.data.map((movie) => (
        <li key={movie.id}><MovieCard movie={movie} /></li>
      ))}
    </ul>
  )
}
```

Buradaki `select` liste görünümünü daraltır; tek başına hiçbir detay isteğini öne çekmez. Kartın etkileşim olayı detay prefetch’ini başlatabilir. İstek için aynı detay key’inin kullanılması, ekran açılırken cache’teki cevabın bulunmasını sağlar.

## Gerçek hata: render sırasında istek başlatmak

Şu kullanım her render’da prefetch çağırır:

```tsx
function FilmKartı({ id, title }: { id: number; title: string }) {
  const client = useQueryClient()
  void client.prefetchQuery(movieDetailOptions(id))
  return <button>{title}</button>
}
```

Belirti, kart listesi görünür görünmez her film için detay isteklerinin çıkmasıdır. Çünkü component render’ı, ekranda ne çizileceğini hesaplar; kullanıcı niyetini bekleyen bir event değildir. İsteği `onMouseEnter` veya `onFocus` gibi etkileşime bağla ve sadece gerçekten ilgili kartın verisini hazırla.

İki yöntemi kısaca ayır: `prefetch` veriyi ne zaman isteyeceğinle, `select` aynı cevaptan component’in hangi görünümü okuyacağıyla ilgilenir. Prefetch yapmıyorsan da select kullanabilirsin; verinin tam halini okuyorsan da prefetch kullanabilirsin.

## Aklında kalsın

- `prefetchQuery` veriyi erken ister ve cache’e yazar; çağıran event handler’a data döndürmez.
- Prefetch ile ekranda okunan query aynı key’i kullanmalıdır.
- `select` cache’teki cevabı değiştirmez; tek component’in gördüğü data’yı dönüştürür.
- Tazelik bittiğinde Query veriyi yeniden alabilir; prefetch kalıcı garanti değildir.
- Render sırasında değil, kullanıcı niyeti belirginleşince prefetch başlat.

**Yeni terimler**

- **Prefetch:** İhtiyaç doğmadan önce query verisini cache’e alma.
- **Query client:** Query cache’ini yöneten ve ona erişim sağlayan nesne.
- **Observer:** Bir query sonucunu izleyip component’e sunan bağlantı.
- **`select`:** Ham query cevabından component’in okuyacağı görünümü türeten fonksiyon.

**Kendini yokla:** Aynı key’de prefetch edilen veri taze değilse detay ekranı ne yapabilir? `select` başlık dizisi üretti diye başka component’in ham `results` cevabı değişir mi?

**Yanıt:** Ekran eski cache verisini gösterirken yenisini isteyebilir. Hayır; select cache cevabını değil, o observer’ın gördüğü değeri dönüştürür.

:::info[Derinlemesine (isteğe bağlı)]
Prefetch her kart için yapılırsa gereksiz istek ve sunucu yükü artar. Hover gecikmesi, gerçek etkileşim ölçümü ve mobilde hover olmaması ürün kararını etkiler. Bir event handler’dan cevabın kendisini kullanman gerekiyorsa `prefetchQuery` yerine `fetchQuery` değerlendir; prefetch’in amacı cache’i hazırlamaktır. `select` içinde pahalı bir dönüşüm yapıyorsan her render’da büyük yeni nesneler üretip üretmediğine bak; maliyetliyse API katmanında dönüştürmeyi ya da kararlı bir selector kullanmayı düşün.
:::
