---
title: "Sunucu verisini useQuery ile oku"
minutes: 16
kind: concept
---

# Sunucu verisini useQuery ile oku

:::pain[Problem]
Kıyı kasabalarındaki hava gözlemlerini gösteren iki ekrana gidip geri dönüyorsun. Network panelinde aynı şehir için ikinci GET var; ekran önce boş kalıyor, sonra aynı sıcaklık yeniden beliriyor. Her component kendi `loading`, `error` ve `data` state’ini tuttuğu için hata gösterimi de iki yerde farklılaşmış.
:::

## Cevabın sahibi ile ekranın ömrünü ayır

Bir API cevabı component’e ait yerel bir ayrıntı değildir. Aynı cevap birkaç component’e gerekebilir; component ağaçtan ayrılsa bile kısa süre saklanması ve tekrar açıldığında yenilenmesi yararlıdır. Bu tür veri **server state**’tir: sunucu asıl sahibi, tarayıcıdaki uygulama ise geçici bir kopyanın okuyucusudur.

:::model[State kategorileri]
URL arama ifadesi paylaşılabilir olduğu için URL’de yaşar; modalın açık olması gibi geçici tercih component state’idir; sunucunun verdiği gözlem Query cache’ine aittir. Bu yeni bağlamda değişen şey, server state’in yalnızca saklanması değil, tazeliğinin ve isteğinin de izlenmesidir.
:::

![Server state, URL state, client state ve form state sahiplerini gösteren diyagram](diagram:state-kategorileri)

Bir component’te `useState` ile API cevabını tutabilirsin, ama ikinci ekran geldiğinde kimin verisinin doğru olduğunu sen çözmek zorunda kalırsın. Query cache bu ortak sahipliği sağlar. Component’ler aynı kimlikle aynı girdiyi okur; kimin abone olduğu değişse bile veri cache ömrü boyunca kalabilir.

:::model[Effect yaşam döngüsü]
Effect, commit sonrasında dış sistemle ilişki kurar; dependency değişiminde eski ilişkiyi kapatıp yenisini açar. Ağ isteğini elle kurduğunda loading, hata, iptal ve eski cevabın yazma hakkını da yönetmen gerekir. Query bu veri alma döngüsünü deklaratif olarak sahiplenir; effect yine DOM dışındaki başka sistemleri senkronize etmek için kullanılır.
:::

![Effect setup, dependency değişince cleanup ve yeniden setup sırası](diagram:effect-yasam-dongusu)

:::model[Race condition]
Arama A geç başlayıp arama B’den sonra biterse eski cevap yeni sonucu ezebilir. Query’de her parametre birleşimi ayrı key olduğundan iki cevap ayrı cache girdilerine yazılır; ekrandaki hook geçerli key’i izler. İptal veya yok sayma ayrıntısını elle kurduğun effect’te taşımak zorunda kalmazsın.
:::

![Yavaş eski cevabın yeni sonucu ezmesini ve cleanup ile engellenmesini gösteren diyagram](diagram:yaris-kosulu)

## QueryClient ağaca bir kez girer

`QueryClient`, cache’i ve isteklerin koordinasyonunu yönetir. Uygulama başlarken bir client oluşturup `QueryClientProvider` ile React ağacına verirsin. Client’ı her render’da yeniden kurma: yeni client yeni cache demektir; ekrandaki hook da eski client yerine yenisine bağlanır.

```tsx check title="src/main.tsx"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'

function App() {
  return <main>Gözlem panosu</main>
}

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
)
```

Üretim uygulamasında bu satırlar genellikle entry dosyasında bir kez çalışır. Testte ise her test için ayrı `QueryClient` kurmak gerekir; yoksa bir senaryonun cache’i diğerine sızar. Testin retry davranışını ayrıca kapatmak testin beklemesini kısaltabilir.

## useQuery neyi izler?

Bir query tanımında üç parça düşün: **key**, **queryFn** ve ekrandaki okuma. Key hangi cevabı istediğini adlandırır; query function Promise ile o cevabı getirir; `useQuery` aynı key’in cache girdisine abone olur ve durum değişince component’i günceller.

```tsx title="src/weather/HarborReading.tsx"
import { useQuery } from '@tanstack/react-query'

type Reading = { harbor: string; celsius: number }

async function getHarborReading(): Promise<Reading> {
  const response = await fetch('/api/harbors/north')
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json() as Promise<Reading>
}

export function HarborReading() {
  const reading = useQuery({
    queryKey: ['harbors', 'north'],
    queryFn: getHarborReading,
  })

  if (reading.isPending) return <p>Gözlem bekleniyor</p>
  if (reading.isError) return <p role="alert">{reading.error.message}</p>
  return <p>{reading.data.harbor}: {reading.data.celsius}°C</p>
}
```

Bu örnekte query function hata durumunda reject olan Promise üretir. `fetch` 404 veya 500’de kendiliğinden reject etmez; `response.ok` kontrolü yoksa Query isteği başarı sanabilir. JSON’un tipini TypeScript assertion’ı yalnızca derleme anında söyler; dış veriyi çalışma anında doğrulama ayrı bir sınır problemidir.

Query akışının kesin kuralları şunlardır:

1. Her query, sonucu belirleyen key ile tanımlanır.
2. Query function başarılı cevabı döndürür, başarısızlığı fırlatır.
3. Component query’ye abone olur; Query sonucu değiştiğinde yeniden render olur.
4. Server data’sı için ikinci bir state kaynağı oluşturulmaz.
5. İlk veri yokken `isPending`; cache data’sı yenilenirken `isFetching` okunur.

Bu kurallar hook’ların çağrı sırasını değiştirmez. Bir component’in farklı render’larında `useQuery` yine aynı yerde çağrılır; query key’in değişmesi başka cache girdisine geçer. Cache’de cevap bulunması da “bu veri hep güncel” demek değildir. Tazelik ve kullanılmayan girdinin bellekte tutulma süresi bir sonraki modelde ayrı ele alınacak. Burada amaç, hangi query sonucunun ekranda olduğunu ve Promise’in nasıl başarı/hata bildirdiğini doğru ayırmaktır.

## Durumu zaman sırasıyla izleyelim

İlk açılışta key cache’de yoksa hook pending olur. Query function çalışır; Promise resolve olunca cevabı aynı key altında saklar ve success dalına geçer. Component `reading.data` içinden alanları okur. Promise reject olursa error dalı görünür. Bu sıra, her component’te üç setter’ı elle birbirine bağlamadan oluşur.

| An | Cache | Sonuçta görülebilen | Ekranın işi |
|---|---|---|---|
| İlk render | Bu key için veri yok | `isPending` | Bekleme metni |
| İstek sürüyor | Veri henüz yok | `isPending`, `isFetching` | İlk yükleme görünümü |
| Başarı | Cevap saklandı | `isSuccess`, `data` tanımlı | Veriyi göster |
| Sonraki yenileme | Eski cevap mevcut | `isFetching` doğru olabilir, `isPending` yanlış | Eski veriyi koru, yenilemeyi belirt |
| Hata, veri yok | Cevap alınamadı | `isError`, `error` | Anlamlı hata göster |

`isPending` “henüz kullanılabilir data yok” demektir; “herhangi bir ağ etkinliği var” demek değildir. `isFetching` daha geniştir ve arka plan yenilemesini de kapsar. Bu fark kullanıcıya önemlidir: ekran zaten veri gösterirken tam sayfa spinner koymak gereksiz sıçrama yaratır. `status` ve boolean alanları aynı durum makinesinin farklı okuma biçimleridir; kodun success dalında TypeScript `data` alanını daraltır.

Her component kendi data kopyasını saklamak yerine doğru key’e abone olur. Query aynı anda cache saklama, refetch ve component bildirimi gibi işleri organize eder; yine de API sınırındaki doğrulamayı veya hata metninin ürün dilini sen seçersin. Bir component’e yalnızca özelleştirilmiş görünüm lazımsa bu data’yı ayrı state’e kopyalamadan render sırasında türetebilirsin.

### Bozuk örnek: hata 500’ü başarıya çevirir

```ts
async function getReading(): Promise<Reading> {
  const response = await fetch('/api/harbors/north')
  return response.json() as Promise<Reading>
}
```

Sunucu `{ message: 'bakım' }` ile 500 döndürse bile `response.json()` resolve olur. Ekran `isSuccess` dalına geçer ve olmayan `celsius` alanını okumaya çalışır. Hatanın görünür olmayışı, cevabın geçerli olduğunu kanıtlamaz.

### Düzeltilmiş örnek: başarısız HTTP cevabını reject et

```ts check
type Reading = { harbor: string; celsius: number }

async function getReading(): Promise<Reading> {
  const response = await fetch('/api/harbors/north')
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return (await response.json()) as Reading
}
```

## Sınır durumları ve sık hatalar

:::mistake[Provider yok]
**Belirti:** `No QueryClient set` hatası render sırasında çıkar. → **Neden:** Hook’un üst ağacında provider yoktur ya da başka bir client oluşturup onu sarmamıştır. → **Düzeltme:** Uygulama kökünü tek bir `QueryClientProvider` ile sar ve `client` prop’una aynı istemciyi ver.
:::

:::mistake[Retry yüzünden uzun bekleme]
**Belirti:** Başarısız yerel isteğin hata metni gecikerek görünür. → **Neden:** QueryClient varsayılan olarak sorgu hatalarında retry yapabilir. → **Düzeltme:** Kullanıcı deneyimine uygun retry politikasını belirle; test client’ında `retry: false` kullan.
:::

:::mistake[Veriyi ikinci state’e kopyalamak]
**Belirti:** Cache yenilenirken component eski başlığı göstermeye devam eder. → **Neden:** `useEffect` ile gelen data başka bir `useState` kaynağına kopyalanmıştır. → **Düzeltme:** Okuma görünümünü doğrudan query sonucundan üret; kullanıcı düzenlemesi gerekiyorsa taslak state’ini ayrı tut.
:::

:::mistake[Her fetching’de ekranı boşaltmak]
**Belirti:** Arka plan yenilemesinde içerik kaybolur. → **Neden:** `isFetching` ilk yükleme sanılmıştır. → **Düzeltme:** Veri yokken `isPending`, mevcut veri yenilenirken `isFetching` için daha küçük bir gösterge kullan.
:::

:::sector
Ekiplerde API verisi için ortak bir query client ve görünür hata sözleşmesi tutulur. Fetch işlevleri HTTP hatasında reject etmeli, query function ise parametresiz ya da parametreli Promise döndürmelidir. Bu ayrım ekranların aynı hata davranışını paylaşmasını kolaylaştırır.
:::

## Özet

- Server state’in sahibi sunucudur; Query cache component ömründen uzun bir okuma katmanı sağlar.
- `QueryClient` uygulama ağacında bir kez kurulur, testlerde senaryo başına yenilenir.
- Query key cevabın kimliğidir; query function Promise döndürür.
- İlk veri yokluğu `isPending`, arka plan isteği `isFetching` ile anlaşılır.
- `fetch` için `response.ok` kontrolü gerekir; TypeScript assertion runtime doğrulaması değildir.

**Kendini yokla:** Cache’de veri varken yenileme sürüyorsa hangi iki alan farklı şey söyler? `fetch` 500 döndürdüğünde Query’nin error dalına geçmesi için ne gerekir?

**Yanıt:** `isFetching` yenilemeyi, `isPending` kullanılabilir veri yokluğunu anlatır. Query function 500 cevabında hata fırlatmalıdır.
