---
title: "Formun kirli, bekliyor ve sıfırlandı durumları"
minutes: 15
kind: concept
---

# Formun kirli, bekliyor ve sıfırlandı durumları

:::pain[Eski metin yeniden gönderiliyor]
Profil açıklamanı kaydettikten sonra eski metin alanda kalıyor. Kaydet'e tekrar basınca aynı veri bir kez daha gidiyor. İstek hata verdiğinde ise formu temizlersen kullanıcı yazdığını yeniden girmek zorunda kalıyor.
:::

## Başlangıç değeri karşılaştırma noktasıdır

Formun durumu yalnızca alanların anlık değerlerinden oluşmaz. Formun hangi değerlerle başladığı, kullanıcının bunlardan sapıp sapmadığı, submit'in sürüp sürmediği ve başarıdan sonra yeni başlangıcın ne olduğu da önemlidir. RHF `formState` bu sinyalleri sağlar; `defaultValues` karşılaştırma tabanıdır; `reset` değerleri yeni bir başlangıca taşır.

:::model[Form deposu ve abonelik]
Değerler form deposunda tutulur; `formState.isDirty` veya `isSubmitting` okuyan UI ilgili durum değişikliklerine abone olur. Bu yeni durumda render edilen şey input değerinin kontrollü kopyası değil, formun yaşam döngüsü sinyalidir.
:::

Kurallar:

1. `defaultValues` her alanın başlangıç değerini tanımlar. Alanları başıboş bırakmak dirty karşılaştırmasını belirsizleştirir.
2. `isDirty`, mevcut değerlerin başlangıç değerlerinden farklı olduğunu söyler; “sunucuya kaydedilmedi” ile her zaman eş anlamlı değildir.
3. `dirtyFields`, hangi alanların başlangıçtan saptığını gösterir. Kısmi güncelleme hazırlarken yararlı olabilir.
4. `isSubmitting`, `handleSubmit` içindeki Promise sonuçlanana kadar true kalır. Callback'i `await` etmen gerekir.
5. `reset()` değerleri ve form durumunu varsayılanlara döndürür. `reset(nextValues)` yeni değerleri yeni karşılaştırma tabanı yapar.
6. Başarılı yazma işleminden sonra reset güvenlidir. Hata dalında formu korumak, düzeltip tekrar denemeyi sağlar.
7. `defaultValues` prop veya sunucu verisi değişti diye her render'da otomatik güncellenmez. Yeni kayda geçişte `reset` veya kontrollü remount gibi açık karar gerekir.

## Bir async kayıt sırasını izle

Bir kullanıcı kartı başlık ve kısa bio alanlarını düzenliyor:

| Zaman | Form değeri | isDirty | isSubmitting | Ekran |
|---|---|---:|---:|---|
| Açılış | `{ title: 'Okur', bio: '' }` | false | false | Kaydet kapalı |
| Başlık değişti | `{ title: 'Film okuru', bio: '' }` | true | false | Kaydet açık |
| Gönderildi | aynı | true | true | “Kaydediliyor…” |
| API hata verdi | aynı | true | false | Hata; veri duruyor |
| Yeniden denendi, başarılı | aynı | true | true | “Kaydediliyor…” |
| Başarı sonrası `reset(values)` | aynı yeni varsayılan | false | false | Kaydet yeniden kapalı |

Bu sırada submit callback'i Promise döndürüyorsa `handleSubmit` bekleme durumunu izleyebilir. Callback içinde yalnız `void save(values)` çağırıp hemen döndürürsen RHF ağın bitmesini bilemez. Mutation'ı ayrıca kullanırken form submit durumu ile mutation pending durumunu ayır; hangi kaynağın hangi işlemi kapsadığını net tut.

## Önce bozuk, sonra güvenli kayıt

Başarısız istekte bile formu submit'in sonunda temizleyen örnek veri kaybettirir:

```tsx
async function saveProfile(values: ProfileValues) {
  try {
    await sendProfile(values)
  } catch {
    setMessage('Kaydedilemedi')
  }
  reset()
}
```

Hata halinde erken dön; yalnız başarılı sonuçta yeni varsayılanı belirle:

```tsx check
import { useForm } from 'react-hook-form'

type ProfileValues = { title: string }

export function ProfileForm({ save }: { save: (values: ProfileValues) => Promise<void> }) {
  const { register, handleSubmit, reset, formState: { isDirty, isSubmitting } } = useForm<ProfileValues>({
    defaultValues: { title: '' },
  })
  async function submit(values: ProfileValues) {
    await save(values)
    reset(values)
  }
  return <form onSubmit={handleSubmit(submit)}>
    <label htmlFor="profile-title">Başlık</label>
    <input id="profile-title" {...register('title')} />
    <button disabled={!isDirty || isSubmitting}>Kaydet</button>
  </form>
}
```

Bu örnekte `save` reddederse `reset(values)` satırına ulaşılmaz; input ve dirty bilgisi korunur. Üretim UI'sinde reddedilen Promise'i yakalayıp görünür hata mesajı da göster. `isSubmitting` callback boyunca pending kalır, tekrar submit'i engeller.

## Düzenleme kaydı değişince

`defaultValues` ilk form oluşturulurken uygulanır. Aynı form bileşeni başka bir profil kaydını prop olarak aldığında RHF eski değerleri korur. Seçilen kaydın kimliği değiştiğinde `reset` ile yeni değerleri uygula; id dependency'si genellikle içerik değişimini anlamak için daha sağlamdır. Her render'da `reset` çağırmak kullanıcı yazarken alanları sürekli siler.

Başka seçenek `key={record.id}` ile alt formu yeniden mount etmektir. Bu sade olabilir ama focus, açık menü ve alt bileşen state'i de sıfırlanır. `reset` kullanınca hangi dirty değerin korunacağını bilerek seç; `keepDirtyValues` gibi seçenekler yalnız gerçekten istenen düzenleme davranışında kullanılır.

`isDirty` tüm formun başlangıçtan sapıp sapmadığını belirtir. `dirtyFields` kısmi autosave için hangi alanların değiştiğini bulmaya yardım eder, fakat backend'in beklediği payload biçimini kendi başına belirlemez. Sunucuya yalnız değişiklik göndereceksen bunu iş sözleşmesiyle eşleştir ve tam kayıt tipini gereksiz yere opsiyonel yapma.

:::mistake[Hata sonrası alan boşalıyor]
**Belirti:** Ağ hatasından sonra kullanıcının yazısı siliniyor. → **Neden:** `reset` başarı/başarısızlık ayrılmadan çalışıyor. → **Düzeltme:** Kaydı `await` et, reset'i başarıdan sonra çağır; catch'te hatayı göster ve değeri koru.
:::

:::mistake[Kaydet düğmesi form değişmeden açık]
**Belirti:** Değişiklik yokken gereksiz kayıt gönderilebiliyor. → **Neden:** `isDirty` UI'de okunmuyor veya varsayılanlar eksik. → **Düzeltme:** Tüm alanlar için `defaultValues` belirle ve `isDirty`'yi düğme kararına bağla.
:::

:::mistake[Başka kayda geçince önceki ad duruyor]
**Belirti:** Düzenleme sayfası yeni prop'u almış ama alan eski değeri gösteriyor. → **Neden:** `defaultValues` sonraki prop değişikliklerini otomatik izlemez. → **Düzeltme:** Kayıt kimliği değişince `reset(nextRecord)` çağır veya bilinçli key ile remount et.
:::

:::sector
Ürünlerde başarısız kayıttan sonra girdiyi korumak temel güven beklentisidir. Takım kuralı olarak pending sırasında çift submit'i engelle, başarı bildirimi sonrası formu yeni sunucu değerine göre temizle ve hata durumunda düzeltme için veriyi bırak. Sunucu normalize edilmiş veri döndürüyorsa `reset(response.data)` kullanmak yerel taslağı doğru yeni tabana alır.
:::

`reset` yalnız input metnini silen bir fonksiyon değildir; errors, touched/dirty durumu ve formun başlangıç karşılaştırmasını da etkiler. `reset(values)` ile server'ın normalize edilmiş cevabını yeni başlangıç yapmak, `isDirty` değerinin false olmasını sağlar. `resetField('bio')` yalnız bir alanı başlangıç değerine döndürmek için uygundur; tüm formun başarı durumunu temsil etmez. Sadece value'yu değiştirmek için `setValue` kullanman, dirty/touched/validation bayraklarını otomatik aynı karara getirmeyebilir; seçenekleri ihtiyaca göre ver.

`isDirty` güncel tüm değerlerle varsayılanların farkını söyler. `dirtyFields` alan bazında hangi değişikliklerin olduğunu gösterir. Kullanıcı bir alanı değiştirip sonra ilk değerine dönerse `isDirty` tekrar false olabilir; bu, “hiç etkilemedi” demek değildir. Dokunulma geçmişi gerekiyorsa `touchedFields` veya `isSubmitted` gibi ayrı sinyale bak. UI'de bu sinyalleri tek bir “form değişti” boolean'ı gibi yorumlama.

İstek callback'i hata fırlatıyorsa RHF `isSubmitting` sonunda false'a döner; kullanıcı girdisi ise reset çağrılmadığı sürece kalır. Uygulama reddi yakalayarak hata görünümüne çevirmeli ki beklenmeyen unhandled rejection olmasın. Hata mesajını kullanıcı tekrar düzenlediğinde temizlemek de bir ürün kararıdır: aynı isteğin hata bağlamı artık geçerli değilse eski mesajı kaldır.

Sunucudan gelen başlangıç verisi ilk render'da hazır değilse `defaultValues` için async fonksiyon kullanma ihtiyacı doğabilir; RHF'nin `defaultValues` async biçimini desteklediğini ve `isLoading` durumunu formda değerlendirebildiğini bil. Ancak prop her değiştiğinde bu fonksiyon tekrar çalışmaz. Aynı component başka kayda yönlendirilirse kimlik değişimini izle ve yeni kaydı `reset` ile forma uygula. Loading sırasında boş formu kullanıcıya gösterip sonra alanları sıçratarak değiştirmek yerine başlangıç yüklenme durumunu açıkça sun.

Kayıt anında sunucu yeni alan değerleri veya normalize edilmiş içerik döndürüyorsa onu response'tan al. Örneğin metin başındaki/sonundaki boşluklar temizlenmiş olabilir ya da backend başka kullanıcıların eşzamanlı güncellemesini kabul etmiştir. `reset(response)` formun yerel taslağını sunucunun kabul ettiği hale getirir. Yalnız `reset()` çağırmak ise ilk `defaultValues`'a döner; response'tan gelen yeni tabanı kullanmadığın için ekrandaki bilgi sunucuyla ayrışabilir.

## Özet ve kendini yokla

- `defaultValues` başlangıç/karşılaştırma tabanıdır; `isDirty` değişikliği, `isSubmitting` async submit'i gösterir.
- RHF'nin pending durumunu izlemesi için submit callback'i Promise'i beklemeli.
- Reset'i başarı dalına koy; yeni kayıt prop'u geldiğinde başlangıç değerini açıkça güncelle.

**Kendini yokla:** `isDirty` sunucuda kayıt yapılmadığını kesin söyler mi? Hayır; yalnız başlangıç değerlerinden farkı söyler. Kayıt reddedilirse `reset` neden atlanır? Kullanıcı girdisini koruyup tekrar denemesini sağlamak için.
