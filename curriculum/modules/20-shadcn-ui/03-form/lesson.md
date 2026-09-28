---
title: "Formda stil, veri ve hata bir arada"
minutes: 12
kind: concept
---

# Formda stil, veri ve hata bir arada

:::pain[Problem]
Bir üyelik formunda alanın adı görünür, ama ekran okuyucu odaklandığında hata metniyle ilişkisi yoktur. Form sayfaya iki kez eklendiğinde elle yazılmış id'ler de çakışır; ilk label artık ikinci alanı işaret edebilir.
:::

## Alanın verisiyle DOM kimliğini ayır

14. modülde React Hook Form'un (RHF) alan değerlerini ve durumlarını yönettiğini öğrendin; 15. modülde Zod ile doğrulamayı tek şemada topladın. shadcn form parçaları bu iki kaynağın üstüne ince bir bağlantı katmanı koyar. Kendi başına yeni form state'i üretmez ve Zod'un yerine geçmez. Her parçanın görevi bir bağı taşımaktır.

1. **Form**, `FormProvider` görevi görür; form kontrol nesnesini Context'ten erişilebilir kılar.
2. **FormField**, RHF alanını kaydeder ve `name` değerini alan Context'ine koyar.
3. **FormItem**, DOM için benzersiz bir kök id üretir ve kendi alt bileşenlerine aktarır.
4. **useFormField**, alan adını, kök id'yi ve RHF'in alan hatasını birleştirir.
5. **FormLabel**, kontrol id'sini `htmlFor` ile referans eder.
6. **FormControl**, Slot davranışıyla id ve ARIA özelliklerini gerçek kontrol elementine geçirir.
7. **FormMessage**, hata varsa hata metnini doğru id ile render eder.

![RHF alan adı ve DOM kimliğinin hata mesajı ile kontrol arasında kurduğu bağları gösteren diyagram](diagrams/form-baglari.svg)

Bu iki Context bilgisini birbirine karıştırma. `name="email"` form verisindeki alanı belirtir; `id="radix-:r1:-control"` sayfadaki DOM öğesini ayırt eder. Aynı field adı farklı form örneklerinde tekrar kullanılabilir; DOM id'leri ise her render edilen örnekte benzersiz olmalıdır.

## Hata ekran okuyucuya nasıl ulaşır?

E-posta alanında hata oluştuğunu düşün. Zod şeması `email` için hata üretir. RHF bu hatayı kayıtlı alanın durumunda tutar. `FormField` alan adını bağlamda tuttuğundan `useFormField` doğru hatayı `getFieldState(name, formState)` ile bulabilir. `useFormState({ name })` aboneliği de yalnız ilgili alan durumu değiştiğinde parçaların güncellenmesini sağlar.

FormItem'ın ürettiği id'den iki alt id türetilir: kontrol için `-control`, mesaj için `-message`. Label'ın `htmlFor` değeri kontrol id'sidir. FormControl gerçek input'a `id`, hata varsa `aria-invalid="true"` ve `aria-describedby` verir. FormMessage aynı hata id'siyle metni gösterir. Tarayıcının erişilebilirlik ağacı böylece label ve hata bilgisini input ile ilişkilendirir.

| An | RHF durumu | Render edilen bağ |
| --- | --- | --- |
| İlk görünüm | `email` hatası yok | Label → kontrol id; input'ta `aria-invalid` yok |
| Boş gönderim | `email` hatası var | Input `aria-invalid`; `aria-describedby` mesaj id'sini gösterir |
| Düzeltme | hata temizlenir | `aria-invalid` kalkar; artık var olmayan mesaja referans verilmez |
| İkinci form örneği | aynı `name`, ayrı FormItem | Farklı DOM id; label yanlış input'a gitmez |

## Kırık bağ, doğru bağ

Kırık kullanımda Slot'un tek çocuğu bir sarmalayıcıdır:

```tsx
<FormControl>
  <div className="field-frame">
    <input value={value} onChange={onChange} />
    <span>{value.length}/120</span>
  </div>
</FormControl>
```

FormControl, `id` ve ARIA özelliklerini doğrudan `div` öğesine verir. Div label ile ilişkilendirilmiş olur; gerçek input ise hata açıklamasını almaz. Sayaç görsel olarak yerinde dursa da erişilebilirlik ağacındaki alan bağlantısı kopmuştur.

Doğru düzende FormControl gerçek kontrolü sarar; ek görsel öğe FormItem içinde kardeş olabilir:

```tsx check
import { useId } from 'react'
import { Slot } from 'radix-ui'

type FieldBindings = { id: string; messageId: string; error?: string }

function ContactField({ bindings }: { bindings: FieldBindings }) {
  const hintId = useId()
  const describedBy = bindings.error
    ? `${bindings.messageId} ${hintId}`
    : hintId

  return (
    <div>
      <label htmlFor={bindings.id}>E-posta</label>
      <Slot.Root
        id={bindings.id}
        aria-invalid={Boolean(bindings.error)}
        aria-describedby={describedBy}
      >
        <input type="email" />
      </Slot.Root>
      <span id={hintId}>Onay bağlantısı bu adrese gönderilir.</span>
      {bindings.error ? <p id={bindings.messageId}>{bindings.error}</p> : null}
    </div>
  )
}

export function ContactCard() {
  const id = useId()
  return <ContactField bindings={{ id: `${id}-control`, messageId: `${id}-message` }} />
}
```

Buradaki `Slot.Root` tek çocuğu olan input'a özellikleri aktarır; yeni bir wrapper DOM elementi oluşturmaz. Gerçek shadcn form katmanında alan adı Context'ten ve hata RHF'ten gelir. `useId` ise her form örneğine ayrı DOM id üretir. `aria-describedby` hem yardım hem hata metnini gösterecekse iki id boşlukla birleştirilebilir; hata yokken geçersiz bir message id eklenmez.

Bu bağlantıyı tarayıcıda kontrol ederken yalnızca görsel hataya bakma. Accessibility panelinde kontrolün adını, rolünü ve açıklamasını ayrı ayrı oku. Klavyeyle label'a tıkladığında doğru input focus almalı; hatalı gönderimden sonra mesajın DOM'da görünmesi kadar input'un açıklamasına eklenmiş olması da gerekir. `aria-invalid` boolean değer olarak false yazılabilir, ancak hata yokken attribute'u hiç vermemek çoğu bileşende daha temiz ve beklentisi açık bir DOM üretir.

Bir alan hem yardımcı metin hem hata taşıyabilir. Bu durumda `aria-describedby` birden fazla id içerebilir; id'ler aralarında boşlukla ayrılır. Yardım metnini hata mesajı geldiğinde kaldırmak zorunlu değildir, ama her iki id de aynı input'a ait olmalıdır. Eğer formda özet hata listesi de varsa, alan seviyesindeki mesajı ve özet bağlantısını tekrar etmeden nasıl sunacağını tasarla. Ekran okuyucunun aynı cümleyi arka arkaya duyması kullanıcıyı yavaşlatır.

Compound parça yapısının katkısı yalnız tekrar azaltmak değildir. `FormField` alan adını, `FormItem` DOM kimliğini, `FormControl` gerçek elementi taşır; tek bir bileşen hem doğrulama, hem id üretme, hem layout hem submit yapmaya kalkmaz. Bu ayrım farklı kontrol türlerine uyum sağlar. Bir text input, textarea veya radio group aynı `FormItem` bağlamında kalabilir; Control'un çocuğu ise her zaman gerçek form kontrolü olmalıdır.

## Doğrulama mesajı kullanıcıya aittir

Şema teknik olarak doğru bir sayıyı reddedebilir; kullanıcıya “Invalid input: expected number, received undefined” göstermek iyi geri bildirim değildir. Zod 4'te `error` seçeneği tip hatası ve kurallara özel metin sağlar. Örneğin bir etkinlik başvurusunda:

```ts check
import { z } from 'zod'

export const signupSchema = z.object({
  email: z.email({ error: 'Geçerli bir e-posta yaz' }),
  guests: z.number({ error: 'Katılımcı sayısı gerekli' })
    .int({ error: 'Katılımcı sayısı tam sayı olmalı' })
    .min(1, { error: 'En az bir katılımcı gerekli' })
    .max(8, { error: 'En fazla sekiz katılımcı ekleyebilirsin' }),
})

export type SignupInput = z.input<typeof signupSchema>
export type SignupData = z.output<typeof signupSchema>
```

Şema `transform` veya `coerce` kullanırsa kullanıcı girişinin tipi ile doğrulanmış verinin tipi ayrılabilir. O zaman RHF'in input ve output tiplerini ayrı ver; `z.infer` tek başına çıktı tipine karşılık gelir. Zod 4, eski `required_error` ve `invalid_type_error` seçeneklerini `error` altında toplar.

## Sınır durumları ve sık hatalar

:::mistake[Hata görünür ama alana bağlı değil]
Belirti → Hata metni var, ekran okuyucu alanı okurken duyurmuyor. Neden → `FormControl` tek çocuğu olan div'e id ve `aria-describedby` aktardı. Düzeltme → Slot'u gerçek input ya da RadioGroup üzerinde kullan; sayaç gibi öğeleri onun dışına al.
:::

:::mistake[İki formda label yanlış yere gidiyor]
Belirti → Tıklayınca sayfadaki diğer form alanı odaklanıyor. Neden → Elle yazılmış id'ler kopyalandı. Düzeltme → Her FormItem'da `useId` üretip kontrol ve mesaj id'lerini ondan türet.
:::

:::mistake[Boş hata id'sine açıklama bağlı]
Belirti → Hata yokken accessibility panelinde bulunmayan id uyarısı görülüyor. Neden → `aria-describedby` her durumda message id'sini tutuyor. Düzeltme → Hata yoksa hata id'sini çıkar; varsa kontrol ve mesajı açıkça bağla.
:::

:::mistake[İlk karakter hatası düzelmiyor]
Belirti → Alan geçerli olduktan sonra eski mesaj kalıyor. Neden → Parçalar RHF field state değişimini izlemiyor ya da FormItem sabit hata prop'u tutuyor. Düzeltme → Hata bilgisini kayıtlı alandan oku ve doğru form durumuna abone ol.
:::

:::sector
Ekiplerde form bileşen kütüphanesi görsel tutarlılığın yanında label, error ve helper text ilişkisini de standartlaştırır. Bir tasarım sistemi değiştiğinde geliştirici önce accessibility tree'de gerçek kontrolün adını ve açıklamasını kontrol eder; sınıf adlarının doğru görünmesi tek başına yeterli sayılmaz.
:::

## Özet

- RHF alan adı ile DOM id'si farklı kaynaklardır; ikisi de doğru bağlama taşınır.
- Her FormItem benzersiz id üretir; label ve hata bu id ailesini kullanır.
- Slot, ARIA özelliklerini gerçek input'a geçirir; araya wrapper koymak bağı koparır.
- `aria-describedby` yalnız var olan açıklamaları göstermelidir.
- Zod 4 `error` mesajları teknik varsayılanları kullanıcı diline çevirir.

Kendini yokla: FormField `name` bilgisini, FormItem ise id bilgisini neden ayrı taşır? Cevap: Biri form state'indeki alanı, diğeri DOM'daki belirli öğeyi işaret eder.

Kendini yokla: FormControl içine sayaç sarmalayıcısı konursa ne bozulabilir? Cevap: Slot ARIA bağlarını wrapper'a geçirir; gerçek input hata açıklamasını alamaz.
