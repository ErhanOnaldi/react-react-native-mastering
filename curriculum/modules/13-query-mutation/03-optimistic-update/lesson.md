---
title: "Optimistic arayüz ve rollback"
minutes: 14
kind: concept
---

# Optimistic arayüz ve rollback

:::pain[Problem]
Otobüs durağında bağlantı zayıf. “Takip et” düğmesine bastın; sunucu yanıtı üç saniye gecikince düğme hiçbir şey olmamış gibi duruyor. Hemen “Takip ediliyor” göstermek istiyorsun, ama kayıt sunucuda reddedilirse bu görüntüyü nasıl geri alacaksın?
:::

## Geçici doğruyu göstermek

Optimistic update, sunucu onayını beklemeden beklenen sonucu arayüze yansıtır. Kullanıcıya hız kazandırır; karşılığında başarısızlık ve eşzamanlı değişiklikleri daha dikkatli ele alman gerekir. “Ekranı hemen güncelle” tek başına yeterli kural değildir. Geçici değerin nerede tutulacağı, hatada neyin geri döneceği ve gerçek cevap geldiğinde cache’in nasıl uzlaşacağı belirlenmelidir.

:::model[Mutation ve invalidation]
Mutation önce kullanıcı olayında başlar; başarılı cevap query cache’ini otomatik güncellemez. Bir değişiklik tek bir bileşende görünüyorsa geçici değeri mutation variables içinden göstermek yeterli olabilir. Paylaşılan query görünümü de anında değişecekse cache’e geçici yazarsın; hata halinde önceki snapshot’ı geri koyar, son durumda sunucu cevabıyla yeniden uzlaşırsın. Bu derste modelin yeni tarafı, geçici yazı ve rollback’tir.

![Mutation, optimistic update ve invalidation akışı](diagram:mutation-ve-invalidation)
:::

## Önce geçici değerin kapsamını seç

İki yaklaşım vardır. Mutation `pending` iken `variables` ile metin göstermek, mutation state’ini tek ekrana yansıtır; ortak cache’i değiştirmez. Bu nedenle rollback gerekmez: hata olduğunda pending biter ve geçici satır kendiliğinden kaybolur. Aynı bekleyen değişiklik başka bileşende de görünmeli ya da query’yi okuyan ekranların hepsi hemen değişmeli ise cache patch’i gerekebilir.

`variables` yaklaşımı için mutation sonucu şart değildir:

```tsx
const follow = useMutation({ mutationFn: saveFollow })
const preview = follow.isPending ? follow.variables?.followed : undefined
```

Buradaki `follow` ve `saveFollow` yalnız kesit örneğidir. Tek bir `FollowButton` içinde geçici metin göstermek için cache’i değiştirmek gereksiz risk getirir. Başka bir bileşen aynı pending işlemleri okuyacaksa `useMutationState` ve ortak `mutationKey` ile MutationCache’ten izleyebilirsin; bu değerler query cache’inde değildir.

## Paylaşılan query için snapshot ve rollback

Örneğin takip edilen uzmanların listesi header ve profil sayfasında aynı query’den okunuyor. İki yerde de anında yeni görünüm isteniyorsa mutation başlamadan önce listeyi güvenli hale getir. Sıra şöyledir:

1. Etkilenen query’nin devam eden GET’ini iptal et. Aksi halde eski GET optimistic yazının üstüne eski cevabı koyabilir.
2. Cache’teki mevcut değeri snapshot olarak al.
3. Yeni array ve değişen kayıtlarla geçici sonucu yaz.
4. Mutation hata verirse snapshot’ı geri yükle.
5. İşlem sona erdiğinde query’yi invalidate et; sunucunun son kabul ettiği görünüm gelsin.

`onMutate` async olabilir. Döndürdüğü context, `onError` parametresine taşınır; bu nedenle snapshot’ı context olarak döndür. Önceki değer `undefined` ise hata halinde cache’e uydurma boş liste yazma. `cancelQueries` iptal ettiği Promise’i beklemek ve sonra snapshot almak, eski fetch’in sonra dönüp patch’i ezmesini önler.

## Zaman çizelgesinde bir başarısızlık

Başlangıç listesi `['Ada']`, kullanıcı `Bora`yı takip etmeyi seçti. POST 500 döndü.

| An | Ağ | Cache | Ekran |
| --- | --- | --- | --- |
| t0 | Önceki GET tamamlandı | `['Ada']` | Ada |
| t1 | Eski GET iptal edilir | Snapshot `['Ada']` | Ada |
| t2 | POST başlar | `['Ada', 'Bora']` geçici | Ada ve Bora |
| t3 | POST 500 | Hata callback’i snapshot’ı yazar | Ada |
| t4 | Invalidation sonrası GET | Sunucu cevabı cache’e girer | Sunucunun kabul ettiği liste |

Tabloda görünüm başarısızlık boyunca kısa süre yanlış olabilir. Düğme veya satırda “Kaydedilemedi” mesajı göster; aksi halde kullanıcı geçici görünümü onaylandı sanabilir. `onSettled` invalidation’ı hata halinde de çalıştırır. Eğer hata sonrası rollback kesin ve server cevabı değişmemişse yine de invalidation yapmak son durumu doğrular.

## Önce bozuk geri alma, sonra doğru örnek

Kırık yaklaşım eski değeri hiç saklamaz. POST başarısız olsa bile cache’te “Bora” kalır:

```ts
onMutate: ({ person }) => {
  client.setQueryData(['following'], (old: Person[] = []) => [...old, person])
}
```

Bir başka kırılma, snapshot’ı saklayıp rollback’te yok saymaktır. Aşağıdaki tam kesitte başka bir ürüne ait collection listesi kullanılır; `saveSelection` sunucu hata cevabında reject eder.

```tsx check
import { useMutation, useQueryClient } from '@tanstack/react-query'

type Selection = { id: number; label: string }
type Input = { collectionId: string; item: Selection }
declare function saveSelection(input: Input): Promise<void>

export function SelectionButton({ collectionId, item }: Input) {
  const client = useQueryClient()
  const save = useMutation({
    mutationFn: saveSelection,
    onMutate: async ({ collectionId: id, item: next }) => {
      const key = ['collections', id, 'items'] as const
      await client.cancelQueries({ queryKey: key })
      const previous = client.getQueryData<Selection[]>(key)
      client.setQueryData<Selection[]>(key, (old) =>
        old ? [...old, next] : old,
      )
      return { key, previous }
    },
    onError: (_error, _input, context) => {
      if (context?.previous !== undefined) {
        client.setQueryData(context.key, context.previous)
      }
    },
    onSettled: (_data, _error, input) =>
      client.invalidateQueries({ queryKey: ['collections', input.collectionId, 'items'] }),
  })
  return (
    <button disabled={save.isPending} onClick={() => save.mutate({ collectionId, item })}>
      {save.isPending ? 'Ekleniyor…' : 'Koleksiyona ekle'}
    </button>
  )
}
```

Burada yeni öğenin listede olmadığı varsayılmıştır. Gerçek üründe tekrar tıklama ihtimali varsa eklemeden önce aynı `id` var mı kontrol et. Cache değeri sayfalıysa toplam ve sayfa ilişkisini de koru.

`onMutate` çalışırken `mutationFn` henüz sunucuda başarılı olmamıştır. Callback’in kendi Promise’i tamamlanana kadar mutation’ın asıl gönderimi bekler; bu sayede cancellation ve snapshot adımları yazmadan önce tamamlanır. Callback içinde hata fırlarsa yazma akışı farklı davranır; optimistic kurulumun sessizce yarım kalmaması için context’i ve olası hata yolunu düşün. Snapshot tipi de cache’teki veri tipiyle aynı olmalıdır; `unknown` veya aşırı geniş tip rollback’in güvenliğini azaltır.

Her mutation’da bütün cache’i geri yüklemek zorunda değilsin. Basit ve tek işlemli örnekte snapshot en anlaşılır çözümdür. Aynı kayda paralel iki değişiklik varsa daha güvenli seçenekler vardır: aynı kayda ait işlemleri seri yürütmek; ekleme/silme gibi tersine çevrilebilir bir farkı geri almak; ya da ortak cache’i bekletip yalnız mutation variables’ı görünür kılmak. Seçeneklerden biri bütün yarışları kendiliğinden çözmez; API’nin çakışma kuralı da önemlidir.

Optimistic arayüzde erişilebilirlik de korunmalı. Pending metni yalnız renkle ayrılmamalı; düğme adı veya canlı bölge kullanıcıya işlemin sürdüğünü anlatmalı. Hata sonrası kaybolan geçici değer, “başarılı oldu” hissi vermemeli. Ekran okuyucu kullanan biri de geçici ve onaylanmış değeri ayırt edebilmelidir.

## Eşzamanlı yazmaların sınırı

Tek snapshot’ı körlemesine geri koymak iki paralel mutation’da sorun çıkarabilir. A işlemi snapshot alır, B işlemi yeni snapshot alır, A başarısız olunca ilk snapshot’ı geri koyarsa B’nin başarılı değişikliğini de silebilir. Bu durumda sadece variables tabanlı görünüm kullanmak, aynı kaynağa yazmaları sıraya almak veya işlem başına farkı tersine çevirmek daha doğru olabilir. `scope` ile aynı scope’taki mutation’ları seri çalıştırmak da bir seçenektir; fakat başka cihazlardan gelen yazmaları çözmez.

:::mistake[Eski GET geçici sonucu siliyor]
Belirti → Yeni satır tıklama anında çıkıp birkaç milisaniye sonra kayboluyor. Neden → Önceden başlamış GET eski listeyle cache’e yazdı. Düzeltme → Patch’ten önce aynı query’yi `cancelQueries` ile iptal et.
:::

:::mistake[Rollback başka başarıyı siliyor]
Belirti → İki kayıt aynı anda gönderildi; biri hata verince ikisi de kayboldu. Neden → Eski snapshot bütün cache’i geri koydu. Düzeltme → Yerel variables yaklaşımı seç, yazmaları sırala veya yalnız başarısız işlemin farkını geri al.
:::

:::mistake[Undefined cache’i boş liste sanmak]
Belirti → Henüz açılmamış sayfa hata sonrası boş ve taze görünüyor. Neden → Rollback öncesinde olmayan query için `[]` yazıldı. Düzeltme → Snapshot `undefined` ise kayıt üretme; gerektiğinde invalidate et.
:::

:::sector
Ürün ekipleri optimistic değişikliği seçerken “kaç ekran hemen güncellenmeli?” sorusunu sorar. Tek satır cevabı için variables, ortak liste görünümü için cache patch’i uygundur. Cache patch’inde hata halinde geri alma ve paralel işlemlerin sahipliği tasarımın parçasıdır; yalnız animasyon kararı değildir.
:::

## Özet

- Tek bileşendeki geçici görünüm için `variables` genellikle yeterlidir.
- Paylaşılan cache’i değiştirirken önce GET’i iptal et, snapshot al ve immutable yaz.
- Hata callback’i snapshot’ı geri yükler; işlem sonunda invalidation sunucuyla uzlaştırır.
- Snapshot rollback’i paralel mutation’ları yanlışlıkla silebilir.
- Cache yoksa boş veri uydurmak yerine `undefined` durumunu koru.

**Kendini yokla:** Optimistic metin için her zaman `setQueryData` gerekir mi?  
Cevap: Hayır. Tek mutation’ı gösteren bileşen `isPending` ve `variables` okuyabilir.

**Kendini yokla:** Snapshot’tan önce eski GET’i neden iptal ederiz?  
Cevap: Eski cevap daha sonra dönüp geçici cache güncellemesini ezmesin diye.
