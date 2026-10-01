---
title: "Optimistic arayüz ve rollback"
minutes: 16
kind: concept
---

# Optimistic arayüz ve rollback

Sinema’da “Favoriye ekle”ye bastığında ağ yavaşsa düğme bir süre yanıtsız görünebilir. Sunucudan onay gelmeden beklenen sonucu gösterme yaklaşımına **optimistic update** denir. Hızlı hissettirir; ama sunucu reddederse geçici görünümü kaldırman gerekir.

## En küçük geçici görünüm

Önce yalnızca tıklanan kartta bekleyen mesajı gösterelim. Mutation’ın `variables` alanı, `mutate` çağrısında verdiğin girdiyi içerir:

```tsx
const favorite = useMutation({ mutationFn: addFavorite })

return (
  <>
    {favorite.isPending && <span>Favoriye ekleniyor…</span>}
    <button onClick={() => favorite.mutate(movieId)}>Favori</button>
  </>
)
```

Tıklayınca `isPending` true olur ve mesaj görünür; Promise tamamlanınca mesaj kalkar. Cache’e bir şey yazmadığımız için hata durumunda ayrıca geri alma yok: geçici mesaj sadece mutation’ın beklediği sürece render edilir. Bu yol yeterlidir, eğer değişikliği yalnızca bu kartta göstermek istiyorsan.

Bu örnekte gerçek favori durumu henüz değişmedi. Sadece kullanıcıya bekleyen isteği anlatan bir satır render ettik. Tek kartın yanında gösterilen küçük bir “gönderiliyor” metni için bu genellikle daha az parçalı çözümdür; aynı anda birden fazla kartın mutation’ı varsa her kartın kendi mutation state’ine sahip olması da görünümü anlaşılır tutar.

## Bekleyen değeri de göster

Bir adım daha atalım. Kullanıcı “favoriye ekleniyor” yerine hangi filmin gönderildiğini görsün. `variables` değerini render’da okuyabiliriz:

```tsx
const favorite = useMutation({ mutationFn: addFavorite })

return (
  <>
    {favorite.isPending && favorite.variables !== undefined && (
      <p>{movieTitle} favorilere ekleniyor…</p>
    )}
    {favorite.isError && <p role="alert">Favori kaydedilemedi.</p>}
    <button onClick={() => favorite.mutate(movieId)}>Favori</button>
  </>
)
```

Şimdi geçici satır yalnız işlem beklerken görünür; reject olursa hata mesajı gösterilir. Ancak başka bir ekrandaki favori listesi değişmez. Çünkü bu yaklaşım yalnız mutation state’ini okur, paylaşılan query cache’ine yazmaz.

:::model[Mutation ve invalidation]
Mutation sunucuya yazma talebidir; query cache’ini kendi başına değiştirmez. Tek bileşendeki bekleme görünümü için `variables` yeterli olabilir. Birden çok ekran aynı cache verisini hemen görmeli ise geçici cache yazısı, hata halinde geri alma ve işlem bitince invalidation gerekir.
:::

![Mutation, optimistic update ve invalidation akışı](diagram:mutation-ve-invalidation)

## Ortak listeyi geçici olarak değiştir

Sinema’nın favori listesi hem film kartında hem de Favoriler sayfasında okunuyor diyelim. İki yerde de yeni favori hemen görünmeli. Önce eski cache değerinin bir kopyasını **snapshot** olarak alırız; snapshot, değişiklikten hemen önceki değerin saklanmış görüntüsüdür. TanStack Query’nin `onMutate` callback’inden döndürdüğün bu bilgi **mutation context** olur: callback’ler arasında taşınan ek veridir ve hata callback’inde rollback için kullanılır.

Şimdi üçüncü, birleştirilmiş örnek. Bu örnekte `addMovieToFavorites` senaryosu, puan kaydetme görevlerinden ayrıdır:

```tsx check
import { useMutation, useQueryClient } from '@tanstack/react-query'

type Movie = { id: number; title: string }
type FavoriteInput = { sessionId: string; movie: Movie }
declare function addMovieToFavorites(input: FavoriteInput): Promise<void>

export function FavoriteAction({ sessionId, movie }: FavoriteInput) {
  const client = useQueryClient()
  const add = useMutation({
    mutationFn: addMovieToFavorites,
    onMutate: async ({ sessionId: id, movie: nextMovie }) => {
      const queryKey = ['favorites', id] as const
      await client.cancelQueries({ queryKey })
      const previous = client.getQueryData<Movie[]>(queryKey)
      client.setQueryData<Movie[]>(queryKey, (old) =>
        old ? [...old, nextMovie] : old,
      )
      return { queryKey, previous }
    },
    onError: (_error, _input, context) => {
      if (context?.previous !== undefined) {
        client.setQueryData(context.queryKey, context.previous)
      }
    },
    onSettled: (_data, _error, input) =>
      client.invalidateQueries({ queryKey: ['favorites', input.sessionId] }),
  })

  return (
    <button
      disabled={add.isPending}
      onClick={() => add.mutate({ sessionId, movie })}
    >
      {add.isPending ? 'Ekleniyor…' : 'Favorilere ekle'}
    </button>
  )
}
```

`onMutate` önce aynı query için devam eden GET isteğini iptal eder. Böylece daha önce başlamış eski bir cevap, optimistic yazının üstüne gelip onu silemez. Sonra mevcut listeyi alıp snapshot olarak döndürür ve yeni array ile geçici favoriyi cache’e yazar. Sunucu hata verirse `onError` snapshot’ı yerine koyar; işlem başarılı ya da hatalı bittiğinde `onSettled` listeyi invalidate eder ve sunucunun son durumunu tekrar aldırır.

Context’i ayrıca callback’ten döndürmemizin nedeni, hata anında başlangıç listesini yeniden hesaplayamıyor oluşumuzdur: o sırada cache geçici olarak değişmiş durumdadır. `onMutate` içindeki `previous` değeri işlem başlamadan önceki tek güvenilir kopyadır. Context ile bu kopya mutation’ın hata callback’ine kadar taşınır.

Cache henüz yüklenmediyse `previous` değeri `undefined` olur. Bu durumda boş listeyi snapshot gibi yazıp rollback etmek yanlış olurdu; eski bir liste yoktu. Kod, yalnız gerçek bir önceki değer varsa geri yükler. Ayrıca `[...old, nextMovie]` yeni array üretir; `old.push(nextMovie)` ile eski array’i değiştirmez.

## Başarısız isteği zaman çizelgesinde izle

Favori cache’i `['Dune']` olsun; kullanıcı “Arrival”ı eklesin ve sunucu isteği reddetsin:

| An | Ağ ve callback | Cache | Ekran |
| --- | --- | --- | --- |
| t0 | Önceki GET tamamlanmış | `['Dune']` | Dune |
| t1 | `onMutate` eski GET’i iptal eder, snapshot alır | `['Dune']` | Dune |
| t2 | Optimistic yazı yapılır, POST başlar | `['Dune', 'Arrival']` | İkisi görünür |
| t3 | POST hata verir, `onError` çalışır | Snapshot: `['Dune']` | Arrival kaybolur, hata gösterilir |
| t4 | `onSettled` sonrası GET döner | Sunucudaki gerçek liste | Son durum görünür |

İşlem sırasında Arrival görünür ama henüz onaylanmamıştır. Hata mesajı bu farkı kullanıcıya anlatır; aksi halde kullanıcı eklemenin kesinleştiğini sanabilir.

## Gerçek bir rollback hatası

Snapshot alıp `onError` içinde kullanmazsan POST başarısız olsa bile favori cache’te kalır. Belirti, kullanıcı Favoriler sayfasına geçtiğinde reddedilen filmin hâlâ listede görünmesidir. Düzeltme, yalnızca `onMutate` içinde saklanan önceki değeri `onError` callback’inde geri yazmaktır.

:::mistake[Önceki GET geçici favoriyi siliyor]
Belirti → Arrival bir an görünür, ardından liste eski haline döner. Neden → Patch’ten önce başlayan GET, eski listeyi daha sonra cache’e yazdı. Düzeltme → Snapshot almadan ve optimistic yazmadan önce aynı query’yi `cancelQueries` ile iptal et.
:::

:::mistake[Cache yokken boş liste uydurmak]
Belirti → Henüz yüklenmemiş Favoriler ekranı hata sonrası boş ve yüklüymüş gibi görünür. Neden → Snapshot `undefined` iken `[]` geri yüklendi. Düzeltme → Cache’te gerçekten önceki değer varsa onu geri koy; yoksa kayıt yaratma.
:::

:::info[Derinlemesine (isteğe bağlı)]
Aynı listeye birden çok mutation aynı anda yazarsa, eski snapshot’ı geri koymak arada başarıyla eklenen başka bir filmi de silebilir. `scope` aynı scope’taki mutation’ları sıraya alabilir; `useMutationState` ortak mutation durumlarını okumaya yarar. Bu araçlar başka cihazlardan gelen değişiklikleri çözmez; paralel yazmaların kuralı API ve ürün davranışıyla birlikte tasarlanır.
:::

## Özet

- Tek karttaki geçici görünüm için `isPending` ve `variables` kullan; cache yazmak şart değildir.
- Ortak query görünümünü değiştireceksen önce devam eden GET’i iptal et ve snapshot al.
- `onMutate` dönüşü mutation context’tir; hata callback’i bunu rollback için alır.
- Immutable cache yaz; cache yoksa `undefined` değerini boş listeye çevirme.
- İşlem sonunda invalidation, arayüzü sunucunun son kabul ettiği veriyle uzlaştırır.

**Yeni terimler**

- **Optimistic update:** Sunucu cevabını beklemeden beklenen sonucu geçici gösterme.
- **Snapshot:** Değişiklikten önce cache’te bulunan değerin saklanmış görüntüsü.
- **Mutation context:** `onMutate` dönüşüyle diğer mutation callback’lerine taşınan ek bilgi.

**Kendini yokla:** Tek bir film kartında bekleyen metin için neden cache güncellemen gerekmeyebilir?

Cevap: O kart `isPending` ve `variables` okuyarak geçici metni gösterebilir; ortak listeyi değiştirmek zorunda değildir.

**Kendini yokla:** Snapshot almadan önce eski GET’i neden iptal ederiz?

Cevap: Eski cevap geç dönüp yeni optimistic cache değerinin üstüne yazmasın diye.
