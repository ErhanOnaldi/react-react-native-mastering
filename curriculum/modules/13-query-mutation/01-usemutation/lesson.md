---
title: "Yazma işleminin yaşamı"
minutes: 14
kind: concept
---

# Yazma işleminin yaşamı

Sinema’da film listesini `useQuery` ile okuyabiliyorsun. Şimdi bir kullanıcı filmine favori verdiğinde sunucuya değişiklik göndermen gerekiyor. Bu tür sunucuya yazma isteğine **mutation** denir; mutation’ı ayrı bir araçla yönetiriz çünkü bir okuma tekrar edilebilirken yazmanın tekrarı yeni kayıt oluşturabilir veya mevcut değeri yeniden değiştirebilir.

## Önce bir tıklamayı sunucuya ulaştıralım

İlk olarak yalnızca isteği başlatan satıra bakalım. `saveFavorite`, sunucuya yazan ve tamamlandığında Promise döndüren hazır bir fonksiyon olsun:

```tsx
import { useMutation } from '@tanstack/react-query'

declare function saveFavorite(movieId: number): Promise<void>

function FavoriteButton({ movieId }: { movieId: number }) {
  const favorite = useMutation({ mutationFn: saveFavorite })
  return <button onClick={() => favorite.mutate(movieId)}>Favoriye ekle</button>
}
```

`useMutation` hook’u burada bir mutation hazırlar; henüz istek göndermez. Tıklama handler’ı `mutate(movieId)` çağırınca `saveFavorite` çalışır. Bu ayrım önemli: render sırasında bir yazma başlasaydı React her render’da aynı isteği yeniden başlatabilirdi.

Buradaki `mutationFn`, işi gerçekten yapan fonksiyondur. `mutate` ona hangi film için çalışacağını iletir; bu girdiye mutation’ın **variables** değeri denir. Yani `movieId`, tıklama anında belirlenir ve `saveFavorite` fonksiyonuna ulaşır.

`mutate` bir kez çağrılır ve bu örnekte tek bir `movieId` taşır. İşlem için film kimliğiyle birlikte başka veri de gerekiyorsa, bunları tek bir object içinde verebilirsin; fonksiyonun parametresi de aynı object’i alır. Böylece hangi değerlerin bu yazma işlemini tarif ettiği açık kalır.

## Beklerken arayüze ne söyleyelim?

Bir ağ isteği hemen dönmeyebilir. Mutation’ın **state**’i, isteğin hangi aşamada olduğunu tutar. `pending` beklediğini, `success` tamamlandığını, `error` ise başarısız olduğunu anlatır. Şimdi önceki düğmeye tek bir yenilik ekleyelim: beklerken onu kilitleyelim.

```tsx
const favorite = useMutation({ mutationFn: saveFavorite })

return (
  <button
    disabled={favorite.isPending}
    onClick={() => favorite.mutate(movieId)}
  >
    {favorite.isPending ? 'Kaydediliyor…' : 'Favoriye ekle'}
  </button>
)
```

`mutate` çalıştıktan sonra `isPending` true olur; istek sonuçlanınca false’a döner. Düğmenin disabled olması, beklerken ikinci bir tıklamayla aynı işlemi göndermeyi zorlaştırır. Bu tek başına sunucuda tekrarları güvenli hale getirmez, ama arayüzde yanlışlıkla çift gönderimi önler.

## Sinema’da başarı ve hatayı ayrı göster

Şimdi aynı düğmeye iki sonuç görünümü ekleyelim. Sinema’nın favori servisi HTTP hatasında Promise’i reddediyor varsayalım. Bu örnek film puanlama kodundan farklıdır ama aynı film dünyasında kalır.

```tsx check
import { useMutation } from '@tanstack/react-query'

declare function addFavorite(movieId: number): Promise<void>

export function FavoriteButton({ movieId }: { movieId: number }) {
  const favorite = useMutation({ mutationFn: addFavorite })

  return (
    <section>
      <button
        disabled={favorite.isPending}
        onClick={() => favorite.mutate(movieId)}
      >
        {favorite.isPending ? 'Ekleniyor…' : 'Favoriye ekle'}
      </button>
      {favorite.isSuccess && <p>Favorilere eklendi.</p>}
      {favorite.isError && <p role="alert">Favoriye eklenemedi.</p>}
    </section>
  )
}
```

Bir tıklamadan sonra `pending` görünür; Promise başarılıysa `success`, reddedilirse `error` görünür. Her yeni `mutate` çağrısı yeni bir işlem başlatır ve arayüz sonraki render’da ilgili durumu okur. Hata mesajını kullanıcıya uygun bir cümleyle gösteriyoruz; ham hata metni URL ya da teknik ayrıntı içerebilir.

Başarı ve hata burada kalıcı kayıt bilgisi değildir; yalnızca mutation’ın en son çağrısının sonucunu yansıtır. Örneğin başarıdan sonra düğme tekrar tıklanırsa yeni işlem `pending` olur. Bu yüzden “en son işlem başarılı” bilgisiyle “favori listesinde film kesin var” bilgisini birbirine karıştırma; listeyi cache üzerinden ayrıca ele almak gerekir.

State değişince React bileşeni yeniden render eder ve metinler yeni duruma göre seçilir. Sen elle bir “bekliyor” boolean’ı yönetmezsin; Query bunu mutation Promise’inin sonucuna göre tutar.

İşlemin zaman sırasını izleyelim. İlk durumda henüz tıklama yok:

| An | Olan | Arayüz |
| --- | --- | --- |
| İlk render | Hook mutation’ı hazırlar; istek başlamaz | “Favoriye ekle” etkin |
| Tıklama | Handler `mutate(movieId)` çağırır | İstek başlar |
| Yanıt beklenirken | Promise hâlâ çözülmedi | `isPending` true, düğme kilitli |
| Sunucu kabul eder | Promise çözülür | `isSuccess` true, başarı metni görünür |
| Sunucu reddeder | Promise reject olur | `isError` true, hata metni görünür |

Bu tablo, `useMutation` çağrısıyla isteğin başladığını sanma hatasını önler. Hook yalnızca React’e durum bilgisini bağlar; kullanıcı eylemi `mutate` çağrısını yapar.

## `fetch` hatasını mutation’a bildir

Gerçek `fetch` kullanırken sık rastlanan bir tuzak var: HTTP 500 cevabı `fetch` Promise’ini otomatik reddetmez. `mutationFn` 500 cevabını kontrol etmeden normal dönerse Query işlemi başarılı sanır.

```ts
async function markFavorite(movieId: number): Promise<void> {
  const response = await fetch(`/api/favorites/${movieId}`, { method: 'POST' })
  if (!response.ok) throw new Error('Favori kaydedilemedi')
}
```

Burada `response.ok` false ise hata fırlatılır ve mutation `error` durumuna geçer. Böylece “Favorilere eklendi” yalnızca sunucu isteği gerçekten başarılı olduğunda görünür.

:::mistake[Sunucu hata verdi ama başarı çıktı]
Belirti → Network’te POST 500, ekranda “Favorilere eklendi.” görüyorsun. Neden → `fetch` cevabında `response.ok` kontrol edilmeden fonksiyon normal tamamlandı. Düzeltme → Hata cevabında `throw` et; mutation’ın Promise’i reddedilsin.
:::

## Neyi yönetir, neyi yönetmez?

Mutation’ın kendi state’i yalnızca bu yazma işleminin durumunu anlatır. POST’un başarılı olması, daha önce okuduğun favori listesinin cache’te kendiliğinden değiştiği anlamına gelmez. Query cache’ini mutation sonrasında güncellemek ayrı bir adımdır; sıradaki derste bunu yapacağız.

Şemadaki optimistic update ve invalidation adımlarını sonraki derslerde açacağız.

![Mutation, optimistic update ve invalidation sırasını gösteren ortak model](diagram:mutation-ve-invalidation)

`mutate` sonucu bekleyen Promise’i çağırana vermez; sonucu mutation state’inde görürsün. `mutateAsync` Promise döndürür ve `await` edilebilir, ancak hata durumunda `try/catch` gerekir. Şu an için durum metinlerini göstermek istediğinde `mutate` yeterlidir.

:::info[Derinlemesine (isteğe bağlı)]
Bazı API’ler aynı yazma isteğinin tekrar gelmesini sunucu tarafında tek işlem sayan bir **idempotency** anahtarı destekler. Bu, istemci cevap alamadığı için tekrar denediğinde çift kayıt oluşmasını önlemeye yardımcı olur. Mutation’daki `reset()` ise yalnızca arayüzdeki mutation state’ini temizler; sunucuda yapılan işi geri almaz. Çok sayıda bileşenin bekleyen mutation’ları birlikte izlemesi gerektiğinde `mutationKey` ve `useMutationState` gibi araçlar da vardır.
:::

## Özet

- Mutation, sunucuda değişiklik isteyen işlemdir; `useMutation` işlemi hazırlar, `mutate` başlatır.
- `mutationFn` işi yapar; `variables` çağrı anındaki girdidir.
- `pending`, `success` ve `error` state’leri arayüzün bekleme, başarı ve hata görünümünü seçmesini sağlar.
- `fetch` HTTP hatasında otomatik reject etmez; başarısız cevapta hata fırlat.
- Başarılı yazma, ilişkili query cache’ini kendiliğinden güncellemez.

**Yeni terimler**

- **Mutation:** Sunucuda veri oluşturan, değiştiren veya silen yazma işlemi.
- **Mutation state:** Yazma işleminin bekliyor, başarılı veya hatalı olduğunu tutan durum.
- **`mutationFn`:** Mutation’ın asıl işini yapan Promise döndüren fonksiyon.
- **Variables:** Mutation’a `mutate` çağrısında verilen girdi.

**Kendini yokla:** Hook render olurken neden favori POST’u göndermez?

Cevap: Hook yalnız mutation’ı hazırlar; POST, kullanıcı tıklayıp `mutate` çağırınca başlar.

**Kendini yokla:** HTTP 500’de neden `isSuccess` görebilirsin?

Cevap: `fetch` 500 cevabında Promise’i çözebilir. `response.ok` false iken hata fırlatmalısın.
