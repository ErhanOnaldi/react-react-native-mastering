---
title: "Mutation sonrası cache’i uzlaştır"
minutes: 15
kind: concept
---

# Mutation sonrası cache’i uzlaştır

Sinema’da bir filme puan verdin ve POST başarılı oldu. Ekranda “Kaydedildi” yazıyor ama Puanladıklarım listesi hâlâ eski puanı gösteriyor. Bunun nedeni, mutation’ın yazdığı veri ile `useQuery`’nin okuduğu cache’in ayrı olması: Query, hangi listelerin etkilendiğini kendiliğinden bilemez.

## Önce değişmeyen listeyi görelim

Query key, bir query cache kaydını tanımlayan dizidir. Örneğin `['ratings', 'guest-1']`, guest session `guest-1` için puan listesidir. Mutation başarılı olsa bile bu dizinin içeriği aynı kalabilir.

```ts
const ratings = useQuery({
  queryKey: ['ratings', sessionId],
  queryFn: () => getRatings(sessionId),
})

const saveRating = useMutation({ mutationFn: rate })
```

`rate` sunucuya puan yazar; `ratings` ise daha önce alınmış cevabı cache’ten gösterebilir. İstek başarılı diye Query, cache’te hangi verinin eski kaldığını tahmin etmez. Bu ayrım, ekranda başarı mesajı varken listenin kısa süre eski görünmesini açıklar.

Bu iki ayrı kaynak gibi düşünülebilir: mutation sunucuda değişikliği yapar, query cache ise en son alınmış okuma cevabını saklar. Aralarında otomatik bir bağlantı olmadığı için yazmanın hangi okumayı etkilediğini bilip bildirmek uygulamanın işidir. Aksi halde başka bir ekrana geçince eski cevabı yeniden görmen normaldir.

## Listeyi sunucuya yeniden sor

İlk çözüm, başarıdan sonra ilgili query’yi yeniden alınması gereken durumda işaretlemektir. Buna **invalidation** denir. Aşağıdaki Sinema örneğinde `sessionId`, `['ratings', sessionId]` key’inin ikinci parçasıdır:

```tsx check
import { useMutation, useQueryClient } from '@tanstack/react-query'

type FavoriteInput = { movieId: number }
declare function saveFavorite(input: FavoriteInput): Promise<void>

export function SaveFavorite({ sessionId, movieId }: { sessionId: string; movieId: number }) {
  const client = useQueryClient()
  const save = useMutation({
    mutationFn: saveFavorite,
    onSuccess: () =>
      client.invalidateQueries({ queryKey: ['favorites', sessionId] }),
  })

  return <button onClick={() => save.mutate({ movieId })}>Favoriye ekle</button>
}
```

Başarı callback’i oturumun favori query’lerini stale, yani yeniden okunması gerekebilir, olarak işaretler. Ekranda aktif olan eşleşen query arka planda yeniden alınır; ekranda eski veri yeni cevap gelene kadar kalabilir. Böylece sunucunun kabul ettiği son listeye dönersin.

Key eşleşmesi varsayılan olarak **önek tabanlıdır**: verilen key’in başında aynı parçalar bulunan daha uzun key’ler de eşleşir. `['favorites', sessionId]` key’i örneğin `['favorites', sessionId, 'page', 2]` ile de eşleşir. Bu kullanışlıdır, çünkü aynı oturumun birden fazla görünümünü hedefleyebilirsin. `['favorites']` ise bütün session’ları kapsar; gereğinden geniş seçim gereksiz liste yenilemelerine yol açabilir.

Aktif query ekranda kullanılan ve izlenen query’dir. Aktif eşleşme yenilenirken eski sonuç tutulabilir; ekranda `isFetching` gibi bir gösterge varsa kullanıcı arka plandaki yenilemeyi fark eder. Eşleşen query o anda kullanılmıyorsa stale işaretlenir ve tekrar ihtiyaç olduğunda yenilenir. Dolayısıyla invalidation “cache’i sil” değil, “bir sonraki uygun anda yeniden kontrol et” demektir.

## Zamanı adım adım izleyelim

`guest-1` listesinin cache’inde puan 8 olsun. Kullanıcı 9 göndermeyi seçsin:

| An | Sunucu ve cache | Ekran |
| --- | --- | --- |
| t0 | Cache’te puan 8 | Puan 8 görünür |
| t1 | POST başlar; cache değişmez | Kaydet düğmesi bekler |
| t2 | POST başarılı; başarı callback’i invalidation çağırır | Puan hâlâ 8 olabilir |
| t3 | Aktif query için GET başlar | Eski değer yenilenirken kalabilir |
| t4 | GET puan 9 döndürür; cache güncellenir | Puan 9 görünür |

Buradaki 8 değeri t2–t4 arasında görünmeye devam edebilir. Bu bir kayıp yazma değildir; yenileme tamamlanana kadar eldeki son query cevabıdır. Callback’ten `invalidateQueries` Promise’ini döndürürsen mutation `pending` durumu bu yenileme bitene kadar sürer. Böylece “Kaydedildi” mesajı yeni liste geldikten sonra gösterilebilir.

![Mutation, sunucu, invalidation ve rollback sırası](diagram:mutation-ve-invalidation)

Rollback adımı optimistic update dersinde ayrıntılanır.

## Key’leri tekrar yazmak yerine bir yerden üret

Bir **key fabrikası**, query key’lerini aynı kuralla oluşturan küçük bir nesne veya fonksiyon grubudur. Böylece query kurarken ve mutation sonrası invalidation yaparken aynı key’i kullanırsın:

```ts
const favoriteKeys = {
  all: ['favorites'] as const,
  session: (sessionId: string) => ['favorites', sessionId] as const,
}

const key = favoriteKeys.session('guest-1')
```

`favoriteKeys.session('guest-1')` her yerde aynı `['favorites', 'guest-1']` dizisini verir. Elle yazılan key’de harf veya parça sırası değişirse, invalidation sorguyla eşleşmeyebilir. Fabrika bu tür yazım hatalarını azaltır; invalidation kapsamını yine de sen belirlersin.

Fabrika zorunlu bir TanStack Query API’si değil; key’leri düzenli tutmak için bizim kurduğumuz bir kalıptır. Küçük uygulamada key’i doğrudan yazmak okunaklı olabilir. Aynı kaynak için liste, detay ve sayfa key’leri çoğaldıkça ortak üretici, hangi verilerin aynı ailede olduğunu görmeyi kolaylaştırır.

## Kesin cevabın varsa cache’i doğrudan güncelle

Bazen sunucu cevabında cache’e yazmak için gereken doğru bilgi zaten vardır. O zaman listeyi yeniden indirmek yerine `setQueryData` ile cache’i güncelleyebilirsin. Şimdi farklı bir Sinema görünümüne bakalım: puan ayrıntısı `['movies', movieId, 'summary']` key’inde tutuluyor.

```ts
type MovieSummary = { title: string; rating: number }

function showConfirmedRating(
  client: QueryClient,
  movieId: number,
  rating: number,
) {
  client.setQueryData<MovieSummary>(
    ['movies', movieId, 'summary'],
    (old) => old ? { ...old, rating } : old,
  )
}
```

Updater `old` ile çalışır; cache’te veri varsa yeni bir object döndürür, yoksa `undefined` bırakır. Yeni object üretmemizin nedeni React ve Query’nin değişikliği referans üzerinden fark etmesidir; eski object’i yerinde değiştirmek diğer kullananların güncellemeyi görmesini bozabilir. Ayrıca cache’te henüz olmayan film özeti için eksik bir kayıt uydurmuyoruz.

İki yolun karar noktası, sunucu cevabının ne kadar kesin olduğudur. Özet cevabı tam puanı içeriyor ve yalnızca o alan değişiyorsa doğrudan yazmak uygundur. Sunucu yalnızca `{ success: true }` döndürüyorsa hangi listelerin nasıl değişeceğini bilemeyebilirsin; o zaman invalidation daha güvenlidir.

:::mistake[Her listeyi yenilemek]
Belirti → `guest-1` puan verdiğinde diğer oturumların listeleri de GET atıyor. Neden → Yalnız `['ratings']` gibi üst key kullanıldı. Düzeltme → Yalnız etkilenen oturum için `['ratings', sessionId]` hedefle.
:::

:::mistake[Cache nesnesini yerinde değiştirmek]
Belirti → Puan nesnesi değişmiş görünüyor ama başka bir görünüm güncellenmiyor. Neden → Eski object’in `rating` alanı doğrudan atandı. Düzeltme → `{ ...old, rating }` ile yeni object üret.
:::

:::info[Derinlemesine (isteğe bağlı)]
`exact: true`, önek eşleşmesi yerine yalnız verdiğin key ile birebir aynı query’yi hedefler. Sayfalı listede `page` ve toplam kayıt sayısı da cache’te ayrı alanlarsa, her sayfayı doğru sırayla güncellemek gerekir; bu ayrıntılar belirsizken listeyi doğrudan yamamak yerine invalidation seçmek daha güvenlidir.
:::

## Özet

- Başarılı mutation, query cache’ini otomatik değiştirmez; etkilenen okumayı sen seçersin.
- Invalidation eşleşen query’leri stale yapar; aktif query yeniden alınır.
- Önek tabanlı eşleşme, key’in başındaki parçalar aynıysa daha uzun key’leri de kapsar.
- `setQueryData` kesin cevapta işe yarar; immutable güncelle ve cache yoksa veri uydurma.
- Key fabrikası aynı query key’ini farklı yerlerde tutarlı üretir.

**Yeni terimler**

- **Query key:** Cache’teki bir okuma kaydını tanımlayan dizi.
- **Invalidation:** Query’yi yeniden okunması gerekebilir diye işaretleme.
- **Önek tabanlı eşleşme:** Query key’in başlangıç parçalarıyla daha uzun key’leri eşleştirme.
- **Key fabrikası:** Query key’lerini ortak kuralla üreten fonksiyon veya nesne.

**Kendini yokla:** `['favorites', 'guest-1']` invalidate edilince `guest-2` listesi neden etkilenmez?

Cevap: Session key’in ikinci parçası farklıdır; bu nedenle key’in başlangıcı eşleşmez.

**Kendini yokla:** Sunucu yalnızca `{ success: true }` döndürüyorsa neden doğrudan cache yazmak riskli?

Cevap: Yeni liste veya özetin tam içeriğini bilmiyorsun; invalidation sunucudan gerçek veriyi tekrar alır.
