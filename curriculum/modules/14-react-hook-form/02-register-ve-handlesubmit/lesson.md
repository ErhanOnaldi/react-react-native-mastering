---
title: "Alan kaydı ve form deposu"
minutes: 15
kind: concept
---

# Alan kaydı ve form deposu

:::pain[Form sekiz ayrı yere bölünüyor]
Bir gezi planında her alan için `useState`, `value`, `onChange` ve submit nesnesi tutuyorsun. Başka sayfada aynı alanları tekrar kurunca bir input'u kaydetme verisine eklemeyi unutuyorsun. Yazarken bütün form bileşeninin render olması da gereksiz hesap yapıyor.
:::

## Alanları tek tek state'e kopyalama

Controlled input'un maliyetini önceki derste ölçtün. Form kütüphanesinin farkı, alan değerlerini her karakterde React bileşeninin state'ine yansıtmak zorunda olmamasıdır. React Hook Form (RHF), input'ları forma kaydeder ve değerleri formun kendi deposunda tutar. Bileşen yalnızca ihtiyaç duyduğu form durumuna abone olduğunda ilgili değişikliklerde render alır.

![Alanların kayıtlı olduğu form deposu, abonelikler ve submit akışı](diagram:form-state)

Modelin kesin kuralları şunlardır:

1. `useForm<T>()`, bir form örneği ve alan kayıt/submit araçlarını üretir. `T`, TypeScript'in derleme zamanı sözleşmesidir; çalışma zamanında veri doğrulaması değildir.
2. `register('field')`, native input'a ref ve event bağlarını verir. Input değerini her render'da `value` prop'una taşıyan controlled döngü yerine, RHF native alanı izler.
3. Her alanın adı `T` içindeki bir alana karşılık gelmelidir. Bu isim, submit nesnesindeki anahtarı ve doğrulama hatasının adresini belirler.
4. `defaultValues`, ilk değerlerin açık kaynağıdır. Checkbox gibi boolean alanlarda ve reset davranışında bu başlangıç özellikle önemlidir.
5. `handleSubmit(onValid)` native submit olayını alır, kayıtlı alanları toplar, kuralları çalıştırır ve yalnız geçerli değerleri `onValid`'e verir. Başarısız durumda ayrı hata callback'i kullanabilirsin.
6. Render, `formState` veya izlenen alan değerlerine aboneliğin kapsamına göre tetiklenir. “RHF hiçbir zaman render etmez” yanlıştır; kontrolsüz her alan her tuşta tüm formu render etmek zorunda değildir.

## Submit'e giden değeri izleyelim

Okuma listesi yerine bir kurs planında başlık ve not alanların olduğunu düşün. `PlanValues` formun kabul edeceği değerleri anlatır; RHF'nin generic'i submit callback'ine bu yapıyı verir:

```tsx
import { useForm } from 'react-hook-form'

type PlanValues = { title: string; note: string }

export function CoursePlanForm({ onSave }: { onSave: (values: PlanValues) => void }) {
  const { register, handleSubmit } = useForm<PlanValues>({
    defaultValues: { title: '', note: '' },
  })

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <label htmlFor="plan-title">Plan başlığı</label>
      <input id="plan-title" {...register('title')} />
      <label htmlFor="plan-note">Not</label>
      <textarea id="plan-note" {...register('note')} />
      <button type="submit">Planı kaydet</button>
    </form>
  )
}
```

Bu bileşende akış şöyle ilerler:

| An | Çalışan parça | Formdaki değer |
|---|---|---|
| İlk render | `useForm` oluşturulur, `defaultValues` uygulanır | `{ title: '', note: '' }` |
| Input bağlanır | `register('title')` ve `register('note')` alanları tanıtır | Henüz değişiklik yok |
| Kullanıcı yazar | Native input değişir, RHF alanı izler | `{ title: 'Haftalık plan', note: '' }` |
| Submit olayı | `handleSubmit` formu değerlendirir | İki alan bir arada |
| Form geçerliyse | `onSave` çağrılır | Tipli `PlanValues` nesnesi |

`register` sonucunu input'a yaymak önemlidir; ref ve event bağlantılarının birini atlamak RHF'nin alanı izlemesini bozar. Aynı alana ayrıca `value`/`onChange` vererek ikinci bir kaynak kurma. Native input'a ait olmayan bir tasarım bileşeni varsa onun bağlantısı farklıdır; sonraki Controller dersinde ele alacağız.

## Domain tipinden form tipini ayır

Sunucu veya uygulama modeli formda olmayan alanlar taşıyabilir. Örneğin `CoursePlan` tipinde `id` ve `createdAt` sunucu tarafından üretiliyorsa, form kullanıcının yazmadığı değerleri istememelidir:

```ts
type CoursePlan = {
  id: string
  createdAt: string
  title: string
  note: string
}

type CoursePlanInput = Omit<CoursePlan, 'id' | 'createdAt'>
```

`Omit`, aynı alanları ikinci kez yazmadan domain modelinden form girdisini türetir. Yine de formun `T` tipi yalnızca derleyicinin yardım ettiği sözleşmedir. API cevabını ya da localStorage içeriğini bu generic güvenli hale getirmez; dış veriyi çalışma zamanında doğrulama ayrı konudur.

Checkbox `checked` üzerinden boolean değer tutar. Metin input'ları boş string ile başlayabilir; checkbox için `defaultValues` içinde `false` açıkça vermek, UI ile submit verisinin aynı başlangıcı görmesini sağlar. Select değerleri çoğunlukla string'dir. Sayısal alanların browser event değeri de string olabilir; number dönüşümünü nerede yapacağını belirle.

## Önce bozuk, sonra çalışan bağlantı

Aşağıdaki input RHF'ye kaydedilmemiştir. Ekranda yazı görünür ama submit nesnesinde alan bulunmayabilir:

```tsx
import { useForm } from 'react-hook-form'

function BrokenWorkshopForm() {
  const { handleSubmit } = useForm<{ topic: string }>()
  return <form onSubmit={handleSubmit((values) => console.log(values))}>
    <input aria-label="Konu" />
    <button type="submit">Gönder</button>
  </form>
}
```

Alanı kayıt ederek sözleşmeyi bağla:

```tsx check
import { useForm } from 'react-hook-form'

type WorkshopValues = { topic: string }

export function WorkshopForm() {
  const { register, handleSubmit } = useForm<WorkshopValues>({
    defaultValues: { topic: '' },
  })
  return <form onSubmit={handleSubmit((values) => console.log(values))}>
    <label htmlFor="workshop-topic">Konu</label>
    <input id="workshop-topic" {...register('topic')} />
    <button type="submit">Gönder</button>
  </form>
}
```

İlk kodda kayıt bağlantısı yoktur. İkinci kodda `topic` alanı tipli form nesnesine girer; `handleSubmit` event nesnesini değil alan değerlerini callback'e verir. Callback'in ikinci argümanı varsa o native event'tir, çoğu uygulamada gerekmez.

## RHF'nin render sınırı

Kayıtlı native input her tuşta formun tüm JSX'ini yeniden hesaplatmak zorunda değildir. Ama `watch()` ile bütün form değerlerini okuyan veya sık değişen `formState` alanlarına abone olan bileşen render alabilir. Bu, modelin bilerek sağladığı bir seçimdir: neyi okumak istiyorsan o bilgiye abone olursun.

Bir değeri yalnız submit'te kullanıyorsan her render'da ekrana taşımana gerek yoktur. UI'de canlı özet göstereceksen o alanı izlemek anlamlıdır. Render'dan kaçmak amacıyla bütün alanları tek bir `useRef` içine taşımak ise doğrulama, reset ve erişilebilir hata ilişkisini elle kurmana neden olur.

:::mistake[Form verisi callback'e gelmiyor]
**Belirti:** Input'ta yazı var, submit nesnesinde anahtar yok. → **Neden:** `register` çıktısı alana bağlanmamış ya da adı `T`/beklenen alan adıyla uyuşmuyor. → **Düzeltme:** Native input'a `{...register('alan')}` ekle ve alan adını form tipiyle aynı tut.
:::

:::mistake[Submit render sırasında çalışıyor]
**Belirti:** Sayfa açılır açılmaz kayıt callback'i çağrılıyor. → **Neden:** `onSubmit={handleSubmit(onSave)()}` gibi dönen handler'ı render'da çalıştırıyorsun. → **Düzeltme:** Form prop'una fonksiyonun kendisini ver: `onSubmit={handleSubmit(onSave)}`.
:::

:::mistake[TypeScript her veriyi doğruluyor sanılıyor]
**Belirti:** API'den gelen beklenmedik değer generic tipten geçmiş gibi kabul ediliyor. → **Neden:** Generic yalnız derleme sırasında alan adlarını ve callback tipini kontrol eder. → **Düzeltme:** Dış veri sınırında runtime schema kullan; sonraki modülde Zod ile bunu kuracaksın.
:::

:::sector
Takımlarda domain modeli, form girdisi ve sunucu cevabı ayrı şekillere sahip olabilir. Form tipini domain tipinden `Pick`/`Omit` ile türetmek tekrar yazımı azaltır; API sınırında doğrulama ise ayrı kalır. RHF'yi native alanlarda varsayılan yol seçmek, özel controlled bileşenleri köprü gerektirdiğinde ayrıca ele almak iyi bir ekip kuralıdır.
:::

Bir input'u formdan koşullu olarak kaldırıyorsan onun değeri gönderimde kalmalı mı, silinmeli mi karar ver. RHF'nin `shouldUnregister` seçeneği unmount olan alanın değerini koruma veya kayıttan çıkarma davranışını etkiler. Örneğin “başka adres kullan” kutusu kapatılınca adres alanını saklayabilirsin; backend eski adresi almamalıysa değer de gönderim nesnesinden çıkmalıdır. Bu ayarı her formda gelişigüzel açma, çünkü koşullu alan davranışını ve varsayılanlarla karşılaştırmayı değiştirir.

`register` dönüşündeki `ref`, `name`, `onChange` ve `onBlur` bağlantılarını başka bir bileşene geçirirken de koru. Tasarım sistemi wrapper'ı input ref'ini gerçek DOM input'una iletmiyorsa alanın odaklanması veya hata sonrası otomatik focus çalışmayabilir. Wrapper'ın `inputRef` gibi farklı bir prop'u varsa ref'i doğru yere eşle. Bir alanı iki kez kaydetmek veya yayılım sonrasında `onChange`'i ezmek de form deposuyla DOM'u ayırır.

Form alanlarının adları iç içe yapılara da işaret edebilir. `address.city` gibi yol, submit nesnesinde nested yapı kurar; aynı yolu TypeScript tipiyle uyumlu yaz. Alan isimlerinin boşluk ve büyük-küçük harf farkını açık tutmak, payload'ın API beklentisiyle eşleşmesini sağlar. TypeScript'in doğru alan yolunu önermesi geliştirme ergonomisidir; kullanıcı girdisinin içeriğini doğrulamanın yerine geçmez.

## Özet ve kendini yokla

- RHF kayıtlı alanları bir form deposunda tutar; her tuşta bütün formu controlled state'e kopyalaman gerekmez.
- `register` native input bağlantısını, `handleSubmit` toplama/doğrulama/submit akışını kurar.
- `defaultValues` ilk değerleri ve reset temelini belirler; generic runtime doğrulaması yapmaz.
- Render'lar abonelikle ilgilidir; izlenen `formState` ve değerler değiştiğinde UI güncellenir.

**Kendini yokla:** `handleSubmit(onSave)` ne zaman `onSave`'i çağırır? Form gönderilip kurallar geçince. `useForm<CoursePlanInput>()` API yanıtını doğrular mı? Hayır; bu yalnız TypeScript sözleşmesidir.
