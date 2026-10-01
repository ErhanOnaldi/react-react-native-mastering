---
title: "Sunucu verisini useQuery ile oku"
minutes: 17
kind: concept
---

# Sunucu verisini useQuery ile oku

Sinema’da film başlıklarını API’den alıp ekranda listelemeyi biliyorsun. Bir component’in kendi `useState` alanında bekleme, hata ve cevabı tutması mümkün; fakat ekran unmount olunca o kopya da gider. TanStack Query ile aynı cevabı bir cache’te tutup component’ten okuyacağız.

## Bir cevabı ekranda göster

Bir film listesini getiren `getPopularMovies` fonksiyonunun Promise döndürdüğünü varsayalım. **Query function**, Query’nin veriyi almak için çağırdığı bu fonksiyondur. İlk denemede ekranda sadece sonucu okuyalım:

```tsx
const movies = useQuery({
  queryKey: ['movies', 'popular'],
  queryFn: getPopularMovies,
})

return <p>{movies.data?.length ?? 0} film</p>
```

`queryKey`, cache’te bu cevabı bulmak için kullanılan kimliktir; `queryFn` ise cevabı getirir. İlk render’da veri henüz gelmediği için `data` boş olabilir, o yüzden `?.` ile alanı güvenle okuduk. Bu haliyle “0 film” ile “henüz film gelmedi” aynı görünür; birazdan bu iki durumu ayıracağız.

TanStack Query’nin cache’ini tutan nesneye `QueryClient` denir. Component’lerin bu nesneye erişebilmesi için uygulama ağacı `QueryClientProvider` ile sarılır; provider, client’ı alt component’lere ulaştırır. Client’ı uygulama başlarken bir kez oluştur:

```tsx check title="src/main.tsx"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'

function App() {
  return <main>Sinema</main>
}

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
)
```

Client’ı her render’da yeniden kurarsan yeni bir cache oluşturursun. Bu yüzden uygulama ömrü boyunca aynı client kullanılır. Testlerde ise senaryoların birbirinin cache’ini paylaşmaması için yeni client kurmak normaldir.

## Bekleme ile boş sonucu ayır

İstek bitmeden önce `data` yoktur; başarılı bir arama bittiğinde ise sonuç dizisi gerçekten boş olabilir. `useQuery` sonucu bu ayrımı `status` adındaki alanla bildirir. **Ayrımlı union**, bir değerin aynı anda yalnızca belirli durumlardan birinde olduğunu tip düzeyinde anlatan yapı demektir; burada `status` değeri `pending`, `error` veya `success` olur.

```tsx
const movies = useQuery({
  queryKey: ['movies', 'popular'],
  queryFn: getPopularMovies,
})

if (movies.isPending) return <p>Filmler yükleniyor</p>
if (movies.isError) return <p role="alert">Filmler yüklenemedi</p>
return <p>{movies.data.length} film bulundu</p>
```

İlk `if` bekleme ekranını seçer. İkinci `if` başarısız isteği ayırır. Bu dallardan sonra TypeScript `data` alanının başarı dalına ait olduğunu bilir; `data.length` güvenle okunur. Başarılı ama boş arama `0 film bulundu` yazar, bekleyen istek ise “Filmler yükleniyor” yazar.

Bir query sonucunu kullanan component’e **observer** denir: observer, belirli bir key’in cache sonucunu izler ve o sonuç değişince yeniden render olur. Buradaki render, React’in component fonksiyonunu yeniden çalıştırıp ekrana hangi çıktının ait olduğunu hesaplamasıdır. Query aynı key’e bakan birden çok observer varsa cevabı paylaşır; her component’in ayrı API cevabı state’i tutması gerekmez.

## Arka plan isteğini izleyelim

Şimdi query başarıyla sonuçlandıktan sonra kullanıcı başka bir ekrana gitsin ve geri dönsün. Cache cevabı duruyorsa ekran eski başlığı hemen gösterebilir; aynı sırada Query verinin güncel olup olmadığını kontrol etmek için yeni istek başlatabilir. Bu durumda `isPending` false kalırken `isFetching` true olabilir: pending, henüz gösterilecek cevap olmadığını; fetching, ağ isteğinin sürdüğünü söyler.

| An | Cache’te gösterilecek veri | `isPending` | `isFetching` | Ekran |
|---|---|---:|---:|---|
| İlk açılış | Yok | `true` | `true` olabilir | Bekleme görünümü |
| İlk cevap geldi | Film listesi var | `false` | `false` | Liste görünür |
| Aynı query yeniden kontrol ediliyor | Eski liste var | `false` | `true` | Liste kalır, küçük yenileme işareti olabilir |
| Yeni cevap geldi | Güncel liste var | `false` | `false` | Güncel liste görünür |

Önemli sıra şu: cache cevabı varsa onu göstermek için ağın bitmesini beklemeyiz. `isFetching` her zaman spinner demek değildir; arka planda yenileme sürerken içeriği görünür bırakabilirsin. `isPending` ile `isFetching` aynı soruyu yanıtlamaz.

## Gerçek bir film aramasına geç

Örneği biraz büyütelim. Bu kez query function seçilen türe göre film getiriyor. HTTP isteği başarısız olduğunda `fetch` kendiliğinden hata fırlatmaz; `response.ok` false ise hata fırlatmamız gerekir. Query yalnızca reddedilen Promise’i başarısız istek olarak tanır.

```tsx check title="src/movies/GenreMovies.tsx"
import { useQuery } from '@tanstack/react-query'

type Movie = { id: number; title: string }
type MovieList = { results: Movie[] }

async function getGenreMovies(genreId: number): Promise<Movie[]> {
  const response = await fetch(`/api/movies?genre=${genreId}`)
  if (!response.ok) throw new Error('Filmler yüklenemedi')
  const list = (await response.json()) as MovieList
  return list.results
}

export function GenreMovies({ genreId }: { genreId: number }) {
  const movies = useQuery({
    queryKey: ['movies', 'genre', genreId],
    queryFn: () => getGenreMovies(genreId),
  })

  if (movies.isPending) return <p>Tür filmleri yükleniyor</p>
  if (movies.isError) return <p role="alert">Filmler yüklenemedi</p>
  if (movies.data.length === 0) return <p>Bu türde film yok</p>
  return <ul>{movies.data.map((movie) => <li key={movie.id}>{movie.title}</li>)}</ul>
}
```

Burada `genreId` hem isteğe hem key’e gider. Kullanıcı başka bir tür seçince yeni key, yeni cache cevabını seçer. Başarıyla gelen boş dizi hata değildir; boş liste mesajı gösterilir. HTTP 500 ise `response.ok` kontrolü hata fırlatır ve component’in hata dalına ulaşır.

Aynı kural detay sayfasında `id` için geçerli: `['movies', 'detail', movieId]` key’i, seçilen filmin cevabını tanımlar. `movieId` değişince key de değişir; yeni film eski filmin cache cevabını kullanmaz.

:::mistake[Her istekte tam ekranı boşaltmak]
**Belirti:** Arka plan yenilemesinde film listesi kaybolup tekrar belirir. → **Neden:** `isFetching`, “henüz veri yok” gibi ele alınmıştır. → **Düzeltme:** İlk yükleme görünümünü `isPending` ile kur; mevcut veriyi yenilerken içeriği bırakıp küçük bir yenileme işareti göster.
:::

:::mistake[500 cevabını başarı sanmak]
**Belirti:** Hata yerine boş liste görünür ya da başlık okunurken hata çıkar. → **Neden:** `fetch` HTTP 500’de reject olmaz; JSON’u başarıyla okuyabilir. → **Düzeltme:** `response.ok` false olduğunda hata fırlat.
:::

:::info[Derinlemesine (isteğe bağlı)]
Query function içinde dönen JSON’u `as MovieList` diye işaretlemek TypeScript’i ikna eder ama API cevabını çalışma anında doğrulamaz. Sunucudan gelen verinin şeklini kontrol etmeyi daha sonra şema doğrulamasıyla ele alabilirsin.
:::

## Özet

- `queryKey` cache cevabını seçer; `queryFn` o cevabı getirir.
- `QueryClientProvider`, uygulamadaki component’lere ortak QueryClient’ı verir.
- `isPending` henüz veri yok der; `isFetching` ağ isteği sürdüğünü söyler.
- `status` ayrımlı union’dır; pending, error ve success dalları aynı anda doğru olamaz.
- HTTP hatasını Query’ye bildirmek için query function hata fırlatmalıdır.

**Yeni terimler:** query function — cache için veriyi alan fonksiyon; ayrımlı union — değerin olası durumlardan yalnız birinde olduğunu anlatan tip; observer — bir key’in sonucunu izleyen component.

**Kendini yokla:** Cache’te eski film listesi varken yenileme sürüyorsa neden `isPending` false, `isFetching` true olabilir? `fetch` 500 döndürdüğünde Query’nin error durumuna geçmesi için ne yapmalısın?

**Yanıt:** Gösterilecek veri zaten bulunduğu için pending değildir; ağ isteği sürdüğü için fetching doğrudur. `response.ok` değerini kontrol edip başarısız HTTP cevabında hata fırlatmalısın.
