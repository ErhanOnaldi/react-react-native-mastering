---
title: "Suspense ve hata sınırı"
minutes: 14
kind: concept
---

# Suspense ve hata sınırı

:::pain[Problem]
Bir podcast bölümünün sayfasında açıklama, konuşmacılar ve yorumlar ayrı ayrı yükleniyor. Ağ yokken üç kutudan biri boş, biri eski bölümün adıyla kalıyor, diğeri kendi hata metnini gösteriyor. Kullanıcıya tek ve anlaşılır bir sayfa durumu sunamıyorsun.
:::

## Bekleme ile başarısızlığı ayrı sınırlara koy

React’te daha önce render → commit → effect sırasını kurdun. Suspense bu sırayı değiştirmez; bir alt ağaç henüz render edilecek veriye sahip değilse React o alt ağacı commit etmez ve en yakın `<Suspense>` fallback’ini gösterebilir. Error Boundary ise render sırasında fırlatılan hatayı yakalayıp o alt ağacın yerine hata arayüzü koyar. Birincisi “henüz hazır değil”, ikincisi “bu ağaç render edilemiyor” durumudur.

TanStack Query’nin `useSuspenseQuery` hook’u veriye ihtiyaç duyduğu anda Promise’i React’e bildirir. Veri gelince ağaç yeniden render edilir; hata sınırına yükseltilen query hatası da Error Boundary tarafından gösterilebilir. Bu model `useQuery` içindeki `isPending` koşullarından farklıdır: bileşen içindeki loading dalı yerine React ağacındaki bir sınır bekleme UI’ına sahip olur.

:::model[Render → commit → effect]
Render, props ve state’ten JSX hesaplar; commit bu hesabı DOM’a uygular; effect commit sonrasında çalışır. Suspense, veri hazır olana kadar alt ağacın commit edilmesini erteler. Error Boundary hata veren alt ağacı değiştirir. Bu yeni bağlamda sınırın yeri, hangi içeriklerin birlikte bekleyeceğini veya birlikte hata göstereceğini belirler.
:::

## Ağacın hangi kısmı bekleyecek?

`useSuspenseQuery` başarılı render’da `data` değerinin tanımlı olduğunu garanti eder. Bu nedenle `if (!data)` gibi loading dalları gerekmez. Ancak hook’un seçenekleri bilerek daha sınırlıdır: `enabled`, `placeholderData` ve `throwOnError` kullanılamaz; queryFn için `skipToken` desteklenmez. Koşullu sorguda bileşeni koşullu olarak render etmek ya da `useQuery` kullanmak gerekir.

Bir detay sayfasındaki başlık ve görsel beraber anlam taşıyorsa ikisini aynı Suspense sınırında tutabilirsin. Yorum paneli bağımsız yüklenebiliyorsa daha küçük bir sınır koy; ana içerik paneli beklerken yorumların fallback’i ayrı kalır. Sınır çok genişse tek yavaş bölüm bütün sayfayı saklar. Çok küçük ve gelişigüzel sınırlar ise ekranı parçalı hale getirir.

```tsx
<ErrorBoundary fallback={<p>Bölüm bilgisi açılamadı.</p>}>
  <Suspense fallback={<p>Bölüm yükleniyor…</p>}>
    <EpisodeHeader />
    <SpeakerList />
  </Suspense>
</ErrorBoundary>
```

Bu ağaçta iki bileşen aynı sınır içindeyse ikisinden biri beklerken fallback görünür. `ErrorBoundary` dışarıda olduğu için içeride yükseltilen hata onu bulur. Error Boundary’ler kendilerini saran hata sınırını yakalayamaz; fallback bile hata verecekse bir üst sınır gerekebilir.

## Bir ilk yüklemeyi ve arka plan yenilemesini izleyelim

`useSuspenseQuery` ilk kez boş cache ile çağrıldığında sıra şöyledir:

| Zaman | Query/React | Görünen UI |
| --- | --- | --- |
| t0 | Bileşen query’yi okur, veri yoktur | Suspense fallback |
| t1 | GET sürer; alt ağaç commit edilmez | “Bölüm yükleniyor…” |
| t2 | GET başarılı; query cache’e yazılır | React alt ağacı tekrar render eder |
| t3 | `data` tanımlıdır, DOM commit edilir | Başlık ve konuşmacılar |

Arka plan refetch’inde cache’de kullanılabilir veri varsa `useSuspenseQuery` eski veriyi göstermeye devam edebilir. Her refetch hatası otomatik olarak sınırı devreye sokmaz; varsayılan davranış mevcut veriyi korumaya yöneliktir. İlk yüklemenin hatasında gösterilen Error Boundary ile arka plan yenileme başarısızlığını aynı sanma. Arka plan hatası için sayfada “son güncelleme başarısız” gibi ayrı bir sinyal gerekebilir.

## Önce yerel dallar, sonra sınırlar

Kırık olmayan ama bakımı zor bir örnek, her bileşenin kendi bekleme ve hata UI’ını tekrar etmesidir:

```tsx
if (query.isPending) return <p>Yükleniyor…</p>
if (query.isError) return <p>Yüklenemedi.</p>
return <h1>{query.data.title}</h1>
```

Bileşen sayısı arttıkça bu dallar tutarsızlaşır. Farklı bir içerik alanıyla sınırları kullanalım:

```tsx check
import { Suspense } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Component, type ReactNode } from 'react'

type Station = { id: number; name: string }
declare function fetchStation(id: number): Promise<Station>

function StationCard({ id }: { id: number }) {
  const { data } = useSuspenseQuery({
    queryKey: ['stations', id],
    queryFn: () => fetchStation(id),
  })
  return <h2>{data.name}</h2>
}

class StationErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? <p role="alert">Durak bilgisi açılamadı.</p> : this.props.children
  }
}

export function StationPanel({ id }: { id: number }) {
  return (
    <StationErrorBoundary>
      <Suspense fallback={<p>Durak yükleniyor…</p>}>
        <StationCard id={id} />
      </Suspense>
    </StationErrorBoundary>
  )
}
```

Buradaki `react-error-boundary` kütüphanesi uygulama paketlerinde bulunmuyorsa aynı yerleşim React’in bir Error Boundary sınıf bileşeniyle kurulabilir. Doğrulama için test ortamındaki paket kullanımını ayrıca kontrol et; dersin ana fikri sınırların ağaçtaki konumudur. Component dışarıda olduğundan hook kuralı korunur. `data` başarı kolunda doğrudan kullanılır.

Bir Error Boundary hata gösterdikten sonra tekrar deneme sunmak istiyorsan boundary state’ini sıfırlayacak bir etkileşim kur. TanStack Query ile `QueryErrorResetBoundary` birlikte kullanıldığında retry düğmesi query hata durumunu resetleyip yeniden render denemesine izin verir. Boundary resetlenmeden aynı hata fallback’inde kalabilirsin.

Suspense fallback’i bileşen ağacında en yakın üst sınırdan bulunur. Bir child Promise fırlattığında React o sınırın fallback’ini commit eder; kardeş bileşenler aynı sınır içindeyse onlar da geçici olarak gizlenir. Bu, React’in render/commit modelinin devamıdır: henüz tamamlanmamış alt ağacın yarım DOM’u commit edilmez. Fallback’in içinde de başka bir async child varsa daha üst bir Suspense sınırı gerekebilir.

Hata sınırı yalnız React render ağacındaki hataları yakalar. Click handler içinde reject olan sıradan bir Promise’i veya event handler’ın fırlattığı hatayı Error Boundary yakalamaz. Mutation hataları bu nedenle mutation state’i, callback veya uygulamanın ortak hata bildirimiyle ele alınır. Query’nin boundary’ye yükselttiği hata ise render denemesi sırasında sınırı bulabilir. “Hata sınırı var” demek bütün async hatalar artık yakalanıyor anlamına gelmez.

Sınırın fallback’inde kullanılan metin, hatanın hangi bölümü etkilediğini söylemelidir. Sayfanın tamamı yerine yalnız konuşmacı paneli hata verdiyse, kullanıcı bölüm açıklamasını okumaya devam edebilir. Fallback’e bir yeniden dene düğmesi koyduğunda, query hata state’inin temizlenmesi ve sınırın yeniden render’a izin vermesi gerekir. Aksi halde düğmeye basınca aynı hata UI’ı kalır. QueryErrorResetBoundary bunun için Query ile Error Boundary arasında reset işareti taşır. Yeniden deneme de garanti başarı değildir; yeni istek yeniden hata verirse sınır tekrar görünür.

:::mistake[Loading dalı hâlâ bileşenin içinde]
Belirti → `isPending` tipi yok veya kod hiçbir zaman loading dalına girmiyor. Neden → `useSuspenseQuery` loading’i `data` yerine Suspense üzerinden bildirir. Düzeltme → Fallback’i en yakın `<Suspense>` sınırına taşı.
:::

:::mistake[Suspense hatayı göstermiyor]
Belirti → GET 500 sonrası uygulama hata veriyor ama fallback görünmüyor. Neden → Suspense yalnız beklemeyi ele alır; hata için Error Boundary gerekir ve query hatası boundary’ye yükseltilmelidir. Düzeltme → Suspense’i Error Boundary ile birlikte kur; hata davranışını ilk yükleme ve background refetch için ayrı düşün.
:::

:::mistake[Çok geniş sınır]
Belirti → Yorumlar yavaş diye sayfanın başlığı da kayboluyor. Neden → Başlık ve yorumlar tek büyük Suspense ağacında bekliyor. Düzeltme → Kullanıcıya bağımsız gösterebileceğin bölümlere ayrı sınır koy.
:::

:::sector
Ürün ekipleri loading sınırlarını tasarım sistemi bileşenleriyle eşler: route ana yüklemesi, bağımsız yan panel ve hata fallback’i farklı yoğunlukta olabilir. Error Boundary yalnız hata mesajı değildir; kullanıcıya geri dönme, yeniden deneme veya başka route’a gitme yolu da sunmalıdır.
:::

## Özet

- Suspense beklemeyi, Error Boundary render hatasını ele alır.
- `useSuspenseQuery` başarı render’ında tanımlı `data` verir; loading dalı fallback’tedir.
- Sınırın konumu hangi alt ağaçların birlikte bekleyeceğini belirler.
- Background refetch hatasını ilk yükleme hatasıyla karıştırma.
- Yeniden denemede Error Boundary state’i ile query hata state’i birlikte resetlenmelidir.

**Kendini yokla:** `<Suspense>` bir GET 500 hatasını yakalar mı?  
Cevap: Hayır. Hata için Error Boundary gerekir.

**Kendini yokla:** İlk başarılı render’da `useSuspenseQuery` sonucu neden `data | undefined` değildir?  
Cevap: Veri yokken alt ağaç render edilmez; Promise sonuçlanınca render devam eder.
