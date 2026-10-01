---
title: "Suspense ve hata sınırı"
minutes: 16
kind: concept
---

# Suspense ve hata sınırı

Film detayında başlığı göstermek için API cevabını bekliyorsun. Bu sırada boş bir başlık basmak istemiyorsun; istek başarısız olursa da kullanıcıya anlaşılır bir mesaj vermen gerekiyor. Önce bu iki durumu ayrı ayrı çözelim, sonra aynı film panelinde birleştirelim.

## Önce bekleyen içeriği sakla

Bir bileşen `useQuery` ile veri isterse sonucu `isPending` ve `isError` dallarıyla kendisi gösterebilir. `Suspense`, altındaki içerik hazır olana kadar onun yerine bekleme arayüzü gösterebilen React sınırıdır. Sınırın içindeki bileşen veriyi beklerken henüz ekrana uygulanmamış JSX üretir; React bu uygulama adımına **commit** der. Bekleyen alt ağaç commit edilmez, en yakın Suspense sınırının `fallback` içeriği görünür.

İlk küçük örnekte bir query filmi getiriyor. `useSuspenseQuery`, veri yokken normal bir sonuç nesnesi döndürmek yerine React’e beklemesi gerektiğini bildirir. Bu yüzden `FilmTitle` içinde `isPending` dalı yazmıyoruz; bekleme görünümünün sahibi onu saran sınır.

```tsx check
import { Suspense } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'

type Movie = { id: number; title: string }
declare function getMovie(id: number): Promise<Movie>

function FilmTitle({ id }: { id: number }) {
  const { data } = useSuspenseQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovie(id),
  })
  return <h1>{data.title}</h1>
}

export function FilmHeading({ id }: { id: number }) {
  return <Suspense fallback={<p>Film hazırlanıyor…</p>}><FilmTitle id={id} /></Suspense>
}
```

Ne oldu? İlk render’da cache boşsa `FilmTitle` başlığı hesaplayamaz; React `fallback` metnini gösterir. İstek tamamlanınca React `FilmTitle` öğesini yeniden render eder ve bu kez `data.title` değerini commit eder. Başarılı render’da `data` tanımlıdır. Bu örnek, yüklemeyi bileşen içindeki koşullardan alıp ağaçtaki bir sınıra taşır.

Sınırın yeri önemlidir. Aynı sınırın altındaki başlık ve oyuncu listesi birlikte bekler: biri veri bekliyorsa ikisi de fallback süresince saklanır. Eğer oyuncu listesi başlıktan bağımsız yüklenebiliyorsa, ikisini ayrı Suspense sınırlarına koyabilirsin. Kullanıcı başlığı erken görür, oyuncular için kendi küçük bekleme metni çıkar. Sınırı yalnız teknik kolaylık için bölme; hangi parçanın tek başına anlamlı olduğunu düşün.

## Başarısız istek için ayrı bir sınır

Suspense yalnız bekleme durumunu karşılar. İstek hata verirse gösterilecek hata arayüzünün sahibi **Error Boundary**’dir: alt ağacın render sırasında verdiği hatayı yakalayıp o ağacın yerine başka bir arayüz gösteren React bileşeni. Error Boundary kendisi bir alt ağaçla çevrilir; bu yüzden hata veren içeriğin dışına yerleştirilir.

İkinci örnekte sınırın içinde poster bilgisi ve film başlığı var. Hata sınırını oluşturmak için React’in sınıf bileşeni API’sini kullanıyoruz. `getDerivedStateFromError` hata geldiğinde state’e `true` yazar; `render` bundan sonra alt içeriğin yerine mesajı döndürür. Bu, 13.4’teki sınır kullanımının gerekli sınıf biçimidir.

```tsx
import { Component, type ReactNode } from 'react'

class MoviePanelBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) return <p role="alert">Film bilgisi açılamadı.</p>
    return this.props.children
  }
}
```

Ne oldu? İçeride render sırasında bir hata oluşursa `hasError` değişir ve başlık yerine `role="alert"` mesajı görünür. Hata sınırı, hangi içeriğin birlikte kaybolacağını da belirler; yalnız oyuncu panelini sardığında sayfanın geri kalanı açık kalır. Bu yüzden hata metni etkilenen parçayı söylemeli ve gereksiz yere bütün sayfayı kapatmamalıdır.

Sıradaki adım, iki sınırı aynı film ağacında kullanmak. Sıra dıştan içe şöyledir: Error Boundary, Suspense, sonra query kullanan içerik. Bekleyen Promise en yakın Suspense sınırına ulaşır; hata ise Suspense tarafından gösterilmez ve hata sınırına kadar çıkar. Error Boundary’nin Suspense’in dışında olması, bu iki farklı sonucu kendi sahibine ulaştırır.

## Film sayfasını adım adım birleştir

Üçüncü örnekte filmin oyuncu bilgisini ayrı bir panelde yüklüyoruz. Bu örnek, önceki `FilmTitle` bileşeninden farklı bir içerik kullanıyor; yeni olan tek şey iki sınırı birlikte yerleştirmek. Query’nin key’i film kimliğini içeriyor, böylece başka film açıldığında başka cache kaydı okunuyor.

```tsx check
import { Suspense, Component, type ReactNode } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'

type Cast = { names: string[] }
declare function getCast(movieId: number): Promise<Cast>

function CastList({ movieId }: { movieId: number }) {
  const { data } = useSuspenseQuery({
    queryKey: ['movie', movieId, 'cast'],
    queryFn: () => getCast(movieId),
  })
  return <ul>{data.names.map((name) => <li key={name}>{name}</li>)}</ul>
}

class CastBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? <p role="alert">Oyuncu listesi açılamadı.</p> : this.props.children
  }
}

export function CastPanel({ movieId }: { movieId: number }) {
  return <CastBoundary><Suspense fallback={<p>Oyuncular yükleniyor…</p>}><CastList movieId={movieId} /></Suspense></CastBoundary>
}
```

Ne oldu? Cache boşken React önce “Oyuncular yükleniyor…” mesajını gösterir. İstek başarıyla dönerse listeyi çizer; reddedilirse `CastBoundary` aynı panelin yerine hata mesajını koyar. Bu panel film başlığının dışında olduğu için oyuncu isteği beklerken veya hata verirken başlık görünmeye devam edebilir. Sınırların tasarımdaki yeri, hangi parçaların beraber bekleyip beraber hata göstereceğine karar verir.

İlk istek ve hata sırasını bir kez izleyelim. “Render” bileşenin JSX hesapladığı adımdır. Aynı sınırın içindeki bir bileşen beklerken React o alt ağacın yarım sonucunu DOM’a uygulamaz; önce fallback’i gösterir. İstek sonucu geldikten sonra yeni render yapılır.

| Zaman | Query ve React’te olan | Kullanıcının gördüğü |
| --- | --- | --- |
| t0 | `CastList` query key’ini okur, cache boş | Oyuncu fallback’i |
| t1 | `getCast` isteği sürerken alt ağaç commit edilmez | “Oyuncular yükleniyor…” |
| t2 | İstek başarılı olur, cevap cache’e yazılır | Fallback kısa süre daha görünür olabilir |
| t3 | React `CastList` bileşenini yeniden render eder | Oyuncu listesi |
| t2-hata | İstek reddedilir ve query hatası render denemesine taşınır | `role="alert"` hata mesajı |

Cache’de daha önce alınmış veri varsa arka plan yenilemesi sırasında eski oyuncu listesi görünmeye devam edebilir. İlk açılıştaki bekleme ile arka plan yenilemesini aynı şey sanma: ilkinde gösterecek veri yoktur; ikincisinde eski ama kullanılabilir cevap vardır. `useSuspenseQuery` arka plan yenilemesindeki her hatayı otomatik olarak Error Boundary’ye taşımayabilir; mevcut veriyi göstermek çoğu zaman daha iyi deneyimdir. Gerekirse yenileme başarısızlığını panel içinde ayrı bir küçük sinyalle anlat.

:::mistake[Loading dalı çalışmıyor]
Belirti → `useSuspenseQuery` sonucu için `isPending` kontrol ediyorsun ama TypeScript bu alanı sunmuyor ya da kodun bekleme dalına hiç girmiyor. Neden → Suspense kullanımında veri yokken bileşen bu sonuca ulaşmaz; beklemeyi dış sınır karşılar. Düzeltme → Yükleme metnini en yakın `<Suspense fallback={...}>` içine koy.
:::

:::mistake[500 hatasında fallback beklemek]
Belirti → Film isteği hata verdiğinde yükleme mesajı kayboluyor, ama hata mesajı da görünmüyor. Neden → Suspense hata yakalayıcısı değildir. Düzeltme → İçeriği bir Error Boundary ile sar ve kullanıcının göreceği mesajı o sınırda belirle.
:::

Bir sınır hata gösterdikten sonra state’i hata durumunda kalır; kendi başına yeniden deneme düğmesi sunmaz. Ürünün yeniden deneme davranışına ihtiyacı varsa hem sınırın hata state’ini hem de Query’nin hata durumunu temizleyen bir akış kurmak gerekir. Bu dersin örneklerinde yeniden deneme eklemiyoruz; önce bekleme ve hata sahiplerini doğru yere koymak önemli.

Hata sınırları event handler içinde fırlatılan hataları veya her türlü reddedilmiş Promise’i otomatik yakalamaz. Query’nin render sırasında yükselttiği hata bu sınır modeline katılabilir; örneğin tıklama callback’inde başlayan bir `mutateAsync` hatası ise mutation state’i veya callback’lerle gösterilir. Bir hata mesajının kaybolduğu yerde, hatanın nerede oluştuğunu ve o kodun render sırasında mı çalıştığını kontrol et.

:::info[Derinlemesine (isteğe bağlı)]
`useSuspenseQuery` seçenekleri `useQuery` ile bire bir aynı değildir; örneğin `enabled`, `placeholderData`, `throwOnError` ve `skipToken` burada kullanılamaz. Koşullu veri için çoğunlukla bileşeni koşullu render etmek veya uygun yerde `useQuery` seçmek gerekir. Query ile hata sınırını yeniden denemeye hazırlayan `QueryErrorResetBoundary` gibi ayrıntılar, gerçek bir retry arayüzü kurarken ayrıca ele alınabilir.
:::

## Özet

- Suspense veri beklerken alt içeriğin yerine `fallback` gösterir; Error Boundary render hatasında alt içeriğin yerine hata arayüzü koyar.
- `useSuspenseQuery` başarı render’ında tanımlı `data` verir; yükleme dalını bileşen içinde yazmazsın.
- Dıştaki Error Boundary hatayı, içteki Suspense beklemeyi karşılar; sınırın yeri hangi panelin beraber etkileneceğini belirler.
- İlk yükleme ve arka plan yenilemesi farklıdır: ikinci durumda eski cache verisi görünür kalabilir.

**Yeni terimler**

- **Suspense:** Alt içerik hazır değilken fallback gösteren React sınırı.
- **Error Boundary:** Alt ağacın render hatasını yakalayıp hata arayüzü gösteren bileşen.
- **Commit:** Render’da hesaplanan JSX’in ekrana/DOM’a uygulanması.
- **Alt ağaç:** Bir bileşen ile onun altında render edilen bileşenlerin bütünü.

**Kendini yokla:** Query ilk kez beklerken başlığı gösterecek bileşen hangi sınırın içine konur?

Cevap: `<Suspense>` içine; fallback’i o sınır gösterir.

**Kendini yokla:** `<Suspense>` bir 500 hatası için `role="alert"` mesajı üretir mi?

Cevap: Hayır. Bu mesajı içeriği saran Error Boundary üretir.
