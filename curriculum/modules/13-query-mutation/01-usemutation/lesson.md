---
title: "Yazma işleminin yaşamı"
minutes: 12
kind: concept
---

# Yazma işleminin yaşamı

:::pain[Problem]
Atölye arşivinde bir kaydı yıldızladın. Düğme yıldızı dolu gösteriyor ama sayfayı yenileyince kayıt eski haline dönüyor. Network panelinde `POST` yok; değişiklik yalnızca o anki bileşen state’indeydi.
:::

## Bir okuma ile bir yazma aynı sözleşme değildir

Bir query, sunucudan bir kaynağın görünümünü okur. Aynı query key’iyle gelen veri cache’te tutulabilir, birden fazla bileşen tarafından paylaşılabilir ve ihtiyaç olduğunda yeniden alınabilir. Mutation ise sunucuda değişiklik talep eder: kayıt oluşturur, alan günceller veya kaydı siler. Bu iki işin tekrar davranışı farklı olduğu için Query onları ayrı araçlarla temsil eder.

Bir okuma çoğu zaman aynı parametrelerle tekrar yapılabilir. Bir yazmayı gelişigüzel tekrar etmek ise aynı kaydı iki kere oluşturabilir, ikinci puanı birincinin üstüne yazabilir veya iki ödeme başlatabilir. Bu yüzden mutation, render sırasında değil kullanıcının açık bir eylemiyle başlar. React’in render, commit ve effect sırasını daha önce kurdun; burada yeni kural şudur: render yalnızca mutation durumunu okur, olayı ise event handler başlatır.

Bir mutation üç parçadan oluşur: neyin gönderileceğini taşıyan değişkenler, işi yapan asenkron fonksiyon ve bu işin kullanıcıya yansıyan durumu. `useMutation` bu parçaları bir araya getirir. Hook’u çağırmak isteği başlatmaz; dönen `mutate` veya `mutateAsync` fonksiyonunu çağırmak başlatır.

## İşlem hangi sırayla ilerler?

![Mutation, optimistic update ve invalidation sırasını gösteren ortak model](diagram:mutation-ve-invalidation)

Modelin kuralları:

1. `useMutation({ mutationFn })` bileşene bir mutation gözlemcisi verir; bu satır tek başına ağ isteği atmaz.
2. `mutate(variables)` çağrısı kullanıcı olayı sırasında mutation’ı başlatır ve değişkenleri `mutationFn`’e iletir.
3. `mutationFn` Promise’i çözülene kadar durum `pending` olur. Promise çözülürse `success`, reject olursa `error` olur.
4. Render, `isPending`, `isSuccess`, `isError` ve `error` değerlerini okuyup uygun arayüzü üretir. Bu değerler yeni render’larda değişebilir.
5. Mutation sonucu query cache’ini kendiliğinden değiştirmez. Başarılı yazmanın etkilediği okumalar için ayrıca invalidation veya kesin cache güncellemesi gerekir.
6. Hata halinde arayüz başarısızlığı saklamaz. Kullanıcıya tekrar deneyebileceği veya girdiyi düzeltebileceği bir durum gösterilir.

`mutate` hata Promise’ini çağırana taşımadan mutation durumuna yazar. `mutateAsync` ise Promise döndürür; onu `await` edebilir, ama reddedilebileceği için `try/catch` gerekir. Bileşende yalnızca pending ve hata görünümü gerekiyorsa `mutate` genellikle daha yalındır.

## Yazmayı yetkili ve geçerli hale getir

Bir API yazması yalnız doğru mutation hook’uyla tamamlanmaz. Sinema’daki TMDB puan akışında guest session önce bir kez alınır ve session kimliği tarayıcıda saklanır; sonraki istekler aynı session’ı kullanır. Session id query parametresinde taşınır, API token’ı ise `Authorization: Bearer ...` başlığındadır. Token’ı URL’ye koymak loglarda ve geçmişte görünmesine yol açabilir.

Puan API’si yalnız 0,5 ile 10 arasındaki yarım puanları kabul eder. Bu kuralı isteği göndermeden önce doğrulamak, kullanıcı hatasında gereksiz POST’u önler; sunucu doğrulaması yine de asıl güvenlik sınırıdır. Her iki istekte de `response.ok` kontrol edilir: guest session alınamazsa puan isteği başlamamalı, puan POST’u başarısızsa başarı UI’ı gösterilmemelidir. Session kimliği saklanmış olsa bile bozulmuş veya süresi dolmuş olabilir; hata yolu bunu da kullanıcıya anlaşılır biçimde yansıtmalıdır.

Bu tür adımlar mutation’ın `mutationFn` içinde sıralanır. Arayüz yalnızca tek bir `mutate` çağrısı görür; içeride session okuma, gerekirse session alma ve puanı yazma tek Promise zincirinde tamamlanır. Böylece butonun pending durumu yalnız POST’u değil, işlem için zorunlu olan ön hazırlığı da kapsar.

## Bir tıklamayı izleyelim

Örnekte başka bir alana ait koleksiyon kaydını sabitleyelim. Fonksiyonun imzası `pinEntry({ entryId, pinned })` olsun.

| An | Mutation durumu | Arayüzün kararı |
| --- | --- | --- |
| İlk render | `isPending === false` | “Sabitle” düğmesi etkin |
| Tıklama | `mutate({ entryId: 42, pinned: true })` | İstek başlar; gövdeye `entryId` ve `pinned` gider |
| İstek sürüyor | `isPending === true` | Düğme kilitlenir, “Kaydediliyor…” görünür |
| Cevap başarılı | `isSuccess === true` | “Kaydedildi” görünür |
| Cevap başarısız | `isError === true` | Hata görünür; düğme tekrar kullanılabilir |

Burada arayüzün gösterdiği “Kaydedildi” metni ancak `mutationFn` gerçekten hata durumunda reject ederse güvenilirdir. `fetch`, 404 veya 500 cevaplarında kendiliğinden reject olmaz; yalnızca bağlantı hatalarında reject eder. Sunucu 500 döndürdüğünde `response.ok` kontrol edilip hata fırlatılmazsa mutation başarı koluna gider.

## Önce yanıltıcı, sonra dürüst örnek

Kırık örnekte buton metni değişiyor, fakat sunucuya yazma yapılmıyor:

```tsx
import { useState } from 'react'

export function PinControl() {
  const [pinned, setPinned] = useState(false)
  return (
    <button onClick={() => setPinned(true)}>
      {pinned ? 'Kaydedildi' : 'Sabitle'}
    </button>
  )
}
```

Görüntü, sunucunun onayladığını iddia ediyor ama yalnızca tarayıcı belleğini değiştirdik. Doğru örnekte isimler ve senaryo görevlerden ayrıdır; `saveBookmark` sunucu fonksiyonunun hata cevabında reject ettiği varsayılır.

```tsx check
import { useMutation } from '@tanstack/react-query'

type BookmarkInput = { articleId: number; folder: string }
declare function saveBookmark(input: BookmarkInput): Promise<void>

export function BookmarkButton({ articleId }: { articleId: number }) {
  const save = useMutation({ mutationFn: saveBookmark })
  return (
    <section>
      <button
        disabled={save.isPending}
        onClick={() => save.mutate({ articleId, folder: 'okunacaklar' })}
      >
        {save.isPending ? 'Ekleniyor…' : 'Okuma listesine ekle'}
      </button>
      {save.isSuccess && <p>Listeye eklendi.</p>}
      {save.isError && <p role="alert">Kayıt yapılamadı. Yeniden deneyebilirsin.</p>}
    </section>
  )
}
```

Pending sırasında düğmeyi devre dışı bırakmak, aynı tıklamanın beklerken tekrar gönderilmesini önler. Bu tek başına sunucu tarafında idempotency sağlamaz; ağ kopması sonrası istemci cevabı alamamış olabilir. Önemli yazmalarda API’nin tekrarları güvenli işleyecek bir sözleşmesi de gerekir.

Mutation state’ini query state’iyle karıştırma. Query, `isFetching` ile arka planda okuma yaparken eski veriyi koruyabilir; mutation ise çoğunlukla kullanıcı eyleminin tekil ömrünü anlatır. Mutation’ın `isPending` olması, ilgili query’nin yenilendiği anlamına gelmez. Başarı mesajı göstermek yazmanın kabul edildiğini söyler; ilişkili ekranda son durumun güncel olduğunu söylemez. O ikinci iş için invalidation veya cache güncellemesi gerekecek.

Bir mutation’ın değişkenleri çoğu zaman tıklama anında oluşur. Kullanıcı iki ayrı kartta işlem başlatabiliyorsa her kartın pending görünümünü yalnız tek bir üst mutation nesnesine bağlamak yanıltıcı olabilir. Her satır kendi mutation sonucunu tutabilir veya ortak bekleyen işlemler `mutationKey` ile izlenebilir. Tasarım, kullanıcının aynı anda kaç işi başlatmasına izin verdiğine dayanmalıdır.

`reset()` mutation durumunu başlangıç görünümüne döndürür; sunucuda yapılmış işi geri almaz. Örneğin başarı metnini bir süre sonra temizlemek için reset kullanabilirsin, fakat bu bir undo değildir. Undo isteniyorsa sunucuya ters bir mutation gönderilmesi gerekir. Bu ayrım özellikle silme ve ödeme gibi geri dönüşü olmayan işlemlerde önemlidir.

## Değer ve hata sınırları

Mutation değişkenlerini tek bir nesnede taşımak birden fazla girdinin yanlış sırayla verilmesini önler. TypeScript `mutationFn` tipinden parametreyi çıkarır; `mutate` çağrısı da aynı şekli ister. Değişkenler yalnızca tıklama anında biliniyorsa state’e kopyalamak gerekmez.

Hata nesnesini doğrudan kullanıcıya basmak yerine anlaşılır bir mesaj seç. `error.message` sunucu yanıtı, URL veya hassas veri içerebilir. Bir form hatası alanın yanında; geçici bağlantı hatası tekrar deneme olanağıyla gösterilebilir. Mutation hatası route değişince bile hatırlanacaksa, bildirimin sahibi bileşenden daha üst bir katmanda olmalıdır; bunun sınırını 6. derste kuracağız.

:::mistake[Başarı gibi görünen başarısız cevap]
Belirti → Sunucu 500 verdiği halde “Kaydedildi” çıkıyor. Neden → `fetch` cevabının `ok` özelliği kontrol edilmeden Promise çözülüyor. Düzeltme → `if (!response.ok) throw new Error(...)` ile `mutationFn`’i reject et.
:::

:::mistake[Render sırasında yazma]
Belirti → Aynı kayıt için peş peşe POST istekleri görünüyor. Neden → `mutate` bileşen gövdesinde veya render edilen bir ifade içinde çağrılıyor. Düzeltme → Çağrıyı `onClick` gibi kullanıcı olayı handler’ına taşı.
:::

:::mistake[Pending sonsuza kadar sürüyor]
Belirti → Düğme hep “Kaydediliyor…” kalıyor. Neden → `mutationFn` çözülmeyen bir Promise bekliyor veya callback içinde Promise tamamlanmıyor. Düzeltme → Her başarı ve hata yolunun Promise’i tamamladığından emin ol; iptal edilebilir ağ işlerinde iptal politikasını ayrıca belirle.
:::

:::sector
Ekipler yazma akışını code review’da üç soruyla inceler: olay gerçekten kullanıcı eyleminde mi başlıyor, HTTP hata cevabı Promise’i reddediyor mu, pending ve error kullanıcıya açık mı? Bu kurallar puanlama, favori ekleme ve form kaydetme gibi tüm sunucu yazmalarında tekrar kullanılabilir.
:::

## Özet

- Query okur ve cache’ler; mutation sunucuda değişiklik ister.
- `useMutation` isteği başlatmaz; `mutate(variables)` başlatır.
- Render mutation durumunu gösterir; event handler işlemi başlatır.
- HTTP 4xx/5xx cevabında `response.ok` kontrolü yapılmazsa sahte başarı oluşabilir.
- Mutation, etkilenmiş query cache’lerini otomatik güncellemez.

**Kendini yokla:** `useMutation` hook’unu çağırmak neden POST atmaz?  
Cevap: Hook gözlemciyi kurar; yazma ancak kullanıcı olayı `mutate` çağırınca başlar.

**Kendini yokla:** `fetch` 500 döndürdüğünde mutation neden `success` olabilir?  
Cevap: `fetch` HTTP hata durumlarında da Response ile çözülür. `response.ok` kontrol edip hata fırlatmak gerekir.
