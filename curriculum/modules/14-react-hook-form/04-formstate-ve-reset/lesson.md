---
title: "Form durumu ve reset"
minutes: 13
kind: concept
---

# Form durumu ve reset

Bir film listesine yeni bir koleksiyon adı yazdığını düşün. Form açıldığında alan boş; sen yazınca Kaydet etkinleşmeli. Kayıt sürerken düğme beklemeli, başarılı olunca alan temizlenmeli. İstek başarısızsa yazdığın adı korumalıyız ki yeniden deneyebilesin.

## Başlangıç değeriyle değişikliği karşılaştır

RHF'de `defaultValues`, form açılırken alanların başlangıç değerlerini verir. `formState`, formun değerleri dışında kalan durum bilgilerini de sunar. Örneğin `isDirty`, mevcut değerlerin başlangıç değerlerinden farklı olup olmadığını söyler.

```tsx
const { register, formState: { isDirty } } = useForm<{ title: string }>({
  defaultValues: { title: '' },
})

return <>
  <input aria-label="Liste adı" {...register('title')} />
  <button disabled={!isDirty}>Kaydet</button>
</>
```

İlk açılışta `title` boş ve `isDirty` false olduğu için düğme kapalıdır. Kullanıcı bir harf yazınca değer başlangıçtan ayrılır ve `isDirty` true olur. Alanı tekrar boşaltırsa değer başlangıca döner ve `isDirty` yeniden false olabilir; bu değer “daha önce hiç düzenlenmedi” anlamına gelmez.

Başlangıç değerini açıkça vermek önemlidir. RHF'nin neyle karşılaştıracağını bilir, sen de alanın ilk ekrandaki halini önceden görürsün. Birden çok alan varsa her alanın varsayılanını belirle.

Örneğin bir liste formunda `title: ''` ve `description: ''` başlangıçlarını birlikte ver. Kullanıcı yalnızca açıklamayı değiştirdiyse form dirty olur; başlığa dokunulmamış olsa da `isDirty` bütün formun başlangıçtan sapıp sapmadığını anlatır. Bu bilgi “sunucuda farklı veri var” demek değildir; yalnızca formun bu açılıştaki başlangıç değerleriyle karşılaştırmadır.

## Kayıt sürerken form durumunu izle

Şimdi Kaydet düğmesinin kayıt sırasında da kapalı kalmasını istiyoruz. `isSubmitting`, `handleSubmit` tarafından çağrılan async iş bitene kadar true olur. `async` fonksiyonun içindeki `await`, kayıt Promise'inin tamamlanmasını bekler.

```tsx
const { register, handleSubmit, formState: { isDirty, isSubmitting } } = useForm({
  defaultValues: { title: '' },
})

async function submit(values: { title: string }) {
  await saveTitle(values.title)
}

return <form onSubmit={handleSubmit(submit)}>
  <input aria-label="Liste adı" {...register('title')} />
  <button disabled={!isDirty || isSubmitting}>
    {isSubmitting ? 'Kaydediliyor…' : 'Kaydet'}
  </button>
</form>
```

İsim değişince RHF submit callback'ini çağırır ve `isSubmitting` true olur. `saveTitle` bitene kadar düğme devre dışı kalır; Promise tamamlanınca `isSubmitting` false olur. Bunun nedeni, callback'in Promise'i doğrudan beklemesidir. `void saveTitle(...)` yazıp callback'ten hemen dönersen RHF ağ isteğinin ne zaman bittiğini bilemez.

| An | `isDirty` | `isSubmitting` | Düğme |
|---|---:|---:|---|
| Form açıldı | false | false | Kapalı |
| Başlık yazıldı | true | false | Kaydet |
| Gönderildi, istek sürüyor | true | true | Kaydediliyor… / kapalı |
| İstek tamamlandı | true | false | Kaydet |

Tabloda başarı ve hata henüz farklı değil: iki durumda da istek bitmiştir. Formu ne zaman sıfırlayacağımıza callback'in sonucuna göre karar vereceğiz.

## Başarıdan sonra yeni başlangıç belirle

`reset()` alanları ve form durumunu başlangıç haline döndürür. Ona değer verirsen, bu değerleri forma uygular ve yeni karşılaştırma başlangıcı yapar.

```tsx check
import { useForm } from 'react-hook-form'

type Collection = { title: string }

export function CollectionForm({ save }: { save: (value: Collection) => Promise<void> }) {
  const { register, handleSubmit, reset, formState: { isDirty, isSubmitting } } = useForm<Collection>({
    defaultValues: { title: '' },
  })

  async function submit(value: Collection) {
    await save(value)
    reset()
  }

  return <form onSubmit={handleSubmit(submit)}>
    <label htmlFor="collection-title">Koleksiyon adı</label>
    <input id="collection-title" {...register('title')} />
    <button disabled={!isDirty || isSubmitting}>Kaydet</button>
  </form>
}
```

Kayıt başarıyla biterse `reset()` boş başlangıca döner; alan boşalır ve `isDirty` false olur. `save` hata verirse JavaScript `await` satırından sonraki satıra geçmez. Dolayısıyla reset çağrılmaz ve kullanıcının adı formda kalır. Bu ayrım, hata sonrası tekrar denemeyi mümkün kılar.

Gerçek bir ekranda hatayı da yakalayıp kullanıcıya göstermelisin. Hata yakalamak için kullanılan `catch`, Promise başarısız olduğunda çalışan bölümdür:

```tsx
async function submit(value: Collection) {
  try {
    await save(value)
    reset()
    setMessage('Koleksiyon kaydedildi')
  } catch {
    setMessage('Kaydedilemedi; bilgileri kontrol edip yeniden dene')
  }
}
```

Burada hata dalında `reset` yok. Böylece hata mesajı gösterilirken yazı da durur. `isSubmitting` callback'in Promise'i tamamlanınca false olur; bu, hata ya da başarı bilgisinin yerine geçmez, yalnızca bekleme durumunu anlatır.

Başarılı yanıt sunucunun düzelttiği son değeri içeriyorsa, örneğin başlığın başındaki boşlukları kaldırdıysa, `reset(savedValue)` kullanabilirsin. Ekran sunucunun sakladığı değeri gösterir ve aynı değer yeni başlangıç olur. Parametresiz `reset()` ise formun tanımlı başlangıcına, bu örnekte boş başlığa döner; hangi biçimin doğru olduğu kayıt akışının sonucuna bağlıdır.

:::mistake[Hata geldi ama yazdığım ad silindi]
**Belirti:** Kayıt başarısız olduktan sonra alan boş. → **Neden:** `reset()` sonucu beklemeden veya hata dalında da çalışıyor. → **Düzeltme:** Önce `await save(value)` ile sonucu bekle, reset'i yalnız başarılı satırın arkasına koy.
:::

## Bir kayıttan diğerine geç

Düzenleme ekranı bazen başka film listesine geçer. `defaultValues` form ilk kurulduğunda uygulanır; aynı form yeni `record` prop'u aldı diye otomatik yeniden okunmaz. Kayıt kimliği değiştiğinde `reset(nextRecord)` çağırarak yeni veriyi forma ve karşılaştırma başlangıcına alabilirsin.

```tsx
// Film A: { title: 'Hafta sonu' }
// Film B seçilince:
reset({ title: 'Korku klasikleri' })
```

İlk kayıtta başlık “Hafta sonu” iken `isDirty` false'tur. İkinci kayda geçip `reset` edince “Korku klasikleri” görünür ve bu değer yeni başlangıç olur; kullanıcı düzenleme yapana kadar `isDirty` yine false kalır. `reset`'i her render'da çağırma, çünkü kullanıcı yazarken alanı tekrar tekrar yeni veriye çevirirsin.

Bir başka seçenek, form component'ine React `key` verip kayıt değişince yeniden kurmaktır. `remount`, component'in kaldırılıp yeni kimlikle tekrar oluşturulmasıdır; kullanımı kolaydır ama form dışındaki yerel UI durumu ve focus da sıfırlanabilir. Çoğu durumda hangi alanların korunacağını açıkça seçmek için `reset` daha anlaşılırdır.

Mesela listeden “Hafta sonu”ndan “Korku klasikleri”ne geçtin. İlk formun `defaultValues` değeri “Hafta sonu”ydu; yalnızca yeni prop'un gelmesi input'u kendiliğinden değiştirmez. Seçilen kayıt değiştiğinde yeni başlığı `reset` ile verirsen input güncellenir, dirty karşılaştırması da yeni film listesi için sıfırdan başlar. `reset` çağrısının zamanı bu yüzden önemlidir: onu kullanıcı yazarken değil, gerçekten başka kayda geçerken çalıştır.

:::info[Derinlemesine (isteğe bağlı)]
`resetField` tek bir alanı sıfırlar. `setValue` tek bir alanın değerini değiştirir; dirty, touched veya doğrulama bilgisini de değiştirmek istiyorsan seçeneklerini ayrıca belirlersin. Sunucudan gelen bazı alanları, kullanıcının düzenlediği alanları koruyarak uygulamak için `keepDirtyValues` seçeneği vardır; bunu yalnız bu davranış gerçekten isteniyorsa kullan.
:::

## Özet

- `defaultValues` alanların ilk değerini ve `isDirty` karşılaştırmasının tabanını belirler.
- `isSubmitting`, submit callback'inin beklediği Promise sürerken true olur.
- `reset()` formu başlangıca döndürür; `reset(values)` verilen değerleri yeni başlangıç yapar.
- Hata halinde girdiyi koru; başarılı kayıt tamamlanınca reset et.

**Yeni terimler:** `formState` — alanlar dışındaki form durumlarını okuduğun RHF nesnesi. `isDirty` — güncel form değerlerinin başlangıçtan farklı olup olmadığını söyler. `isSubmitting` — async submit callback'inin çalıştığını gösterir. `reset` — form değerlerini ve başlangıç karşılaştırmasını yeniden kurar. `remount` — component'i kaldırıp yeni kimlikle tekrar oluşturur.

**Kendini yokla:** Kayıt başarısızsa neden `reset()` çağırmıyoruz? Kullanıcının yazdıklarını korumak için. `reset({ title: 'Korku klasikleri' })` sonrası bu başlık dirty midir? Hayır; verilen değer yeni başlangıçtır.
