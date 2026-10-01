---
title: "Zod şemasını forma bağla"
minutes: 16
kind: concept
---

# Zod şemasını forma bağla

Bir film arama formundaki input'a metin yazarsın ve React Hook Form (RHF) bu alanın değerini tutar. Şimdi aynı değeri bir Zod şemasına da denetletmek istiyoruz. `zodResolver`, RHF ile Zod arasında çalışan bağlantıdır: RHF doğrulama istediğinde şemayı çalıştırır, sonucu alan hatalarına ve submit akışına geri verir.

## Önce metin alanını bağla

İlk formda yalnızca arama teriminin boş olmamasını isteyelim. Bu örnekte dönüşüm yok; kullanıcı ne yazdıysa submit callback'i aynı string biçiminde alır.

```tsx check
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const searchSchema = z.object({ query: z.string().trim().min(1) })

export function MovieSearchForm() {
  const { register, handleSubmit } = useForm({ resolver: zodResolver(searchSchema) })
  return <form onSubmit={handleSubmit((values) => console.log(values.query))}>
    <label>Film ara<input {...register('query')} /></label>
    <button>Ara</button>
  </form>
}
```

`register('query')` input'u RHF'ye bağlar. Kullanıcı `  Dune  ` yazıp Ara'ya basarsa resolver şemayı çalıştırır; `trim()` boşlukları kaldırır ve callback'e `Dune` gider. Alan boş veya yalnız boşluksa şema başarısız olur ve geçerli submit callback'i çalışmaz.

Burada RHF alanın değerini ve submit etkileşimini yönetiyor; Zod hangi değerin kabul edileceğini belirliyor. Aynı `.trim().min(1)` kuralını hem register seçeneklerine hem şemaya kopyalamak iki ayrı kural listesi yaratır. Kuralı şemada tutup resolver ile forma bağlamak değişiklikleri tek yerde toplar.

![Formdan gelen bilinmeyen değerin doğrulamayla tipli veriye ya da hataya ayrıldığı akış](diagram:zod-sinir)

## Hata varsa kullanıcıya göster

Önceki örnekte form gönderimi durabilir ama kullanıcı nedenini görmüyor. Şimdi RHF'nin `formState.errors` değerini okuyup alan hatasını render edelim. Bir label, input'un ne için olduğunu söyler; `aria-invalid` input'un geçersiz durumda olduğunu yardımcı teknolojiye bildirir; `role="alert"` yeni hata mesajının fark edilmesini sağlar.

```tsx check
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const filterSchema = z.object({ title: z.string().trim().min(2, { error: 'En az 2 harf yaz' }) })

export function TitleFilterForm() {
  const { register, handleSubmit, formState: { errors } } =
    useForm({ resolver: zodResolver(filterSchema) })
  return <form onSubmit={handleSubmit((values) => console.log(values.title))}>
    <label>Film başlığı
      <input aria-invalid={Boolean(errors.title)} {...register('title')} />
    </label>
    {errors.title && <p role="alert">{errors.title.message}</p>}
    <button>Filtrele</button>
  </form>
}
```

İki harften kısa girişte resolver `title` için bir hata üretir. RHF bunu `errors.title` içinde tutar; input geçersiz işaretlenir ve mesaj görünür. Geçerli girişte hata yoktur ve submit callback'i çalışır. `aria-invalid` ve mesajın ikisi de yararlıdır: biri alan durumunu, diğeri nasıl düzelteceğini açıklar.

RHF ayrıca alanla ilgili iki durumu izleyebilir. **Touched**, kullanıcı alanla etkileşip alandan ayrıldı mı bilgisidir. **Dirty**, alanın başlangıç değerinden farklı olup olmadığıdır. Bunlar doğrulama kuralı değildir; hatayı ne zaman göstereceğine karar verirken kullanılan etkileşim bilgileridir.

```tsx check
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const titleSchema = z.object({ title: z.string().trim().min(2, { error: 'Başlık kısa' }) })

export function MovieTitleField() {
  const { register, formState: { errors, touchedFields, dirtyFields } } =
    useForm({ resolver: zodResolver(titleSchema) })
  const showError = Boolean(errors.title && (touchedFields.title || dirtyFields.title))
  return <label>Film başlığı
    <input aria-invalid={showError} {...register('title')} />
    {showError && <span>{errors.title?.message}</span>}
  </label>
}
```

Kullanıcı input'a dokunmadan önce `touchedFields.title` ve `dirtyFields.title` yanlıştır; mesaj gizlidir. Yazıp sonra alandan ayrılırsa ikisi de doğru olabilir, böylece hata görünür. Alanı değiştirip başlangıç değerine geri yazarsa dirty durumu başlangıca göre hesaplanır ve tekrar false olabilir. Bu örnek yalnızca olası bir gösterim tercihini anlatıyor; birçok form hataları ilk submit denemesinden sonra göstermeyi seçer.

## Input ile submit değeri farklıysa

Bir Sinema gösterimi için formda katılımcı sayısı alınsın. HTML input kullanıcının yazdığı değeri metin biçiminde verir; kayıt işinde ise sayı kullanmak istiyoruz. Şema metni sayıya çevirip aralığı denetler. **Input tipi** şemaya gelen ham biçimi, **output tipi** başarılı parse'tan sonraki biçimi anlatır.

```tsx check
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const attendanceSchema = z.object({
  guests: z.coerce.number().int().min(1).max(8),
})

export function ScreeningForm({ onSave }: { onSave: (guests: number) => void }) {
  const { register, handleSubmit, formState: { errors } } =
    useForm<z.input<typeof attendanceSchema>, unknown, z.output<typeof attendanceSchema>>({
      resolver: zodResolver(attendanceSchema),
    })
  return <form onSubmit={handleSubmit((values) => onSave(values.guests))}>
    <label>Katılımcı sayısı
      <input type="number" aria-invalid={Boolean(errors.guests)} {...register('guests')} />
    </label>
    {errors.guests && <p role="alert">1–8 arasında tam sayı gir</p>}
    <button>Kaydet</button>
  </form>
}
```

İlk `useForm` generic'i input şeklidir; üçüncü generic output şeklidir. Ortadaki `unknown`, bu formda ek bir context verisi olmadığını belirtir. Schema'daki coercion nedeniyle `guests` ham halde metin olabilir, ama `handleSubmit` callback'inde başarılı parse sonrasındaki output olan number gelir.

| Zaman | Değer | Kim kullanır? |
| --- | --- | --- |
| Kullanıcı input'a `4` yazar | `'4'` metni | RHF alan değeri |
| Form gönderilir | Ham form verisi | `zodResolver` şemayı çalıştırır |
| Şema dönüştürüp doğrular | `4` number | Zod output'u |
| Doğrulama başarılıysa | `4` number | `handleSubmit` callback'i |
| Giriş `0` veya `1.5` ise | Issue | callback durur, form hatayı gösterir |

`type="number"` yazmak TypeScript'teki alan tipini kendi başına number yapmaz. Tarayıcı input'u metin olarak düzenlenir; şema gerçek dönüştürme ve sınır kontrolünü yapar. Bu sıra sayesinde callback number alır ve orada tekrar `Number(...)` yazmak gerekmez.

## Adları ve hataları takip et

Form alanının adı, şemadaki key ile aynı olmalı. `register('title')` RHF verisinde `title` üretir; şema da `title` beklemelidir. İsimler uyuşmazsa şema beklediği alanı bulamaz ve hata doğru input yanında görünmeyebilir. Alan adı, hata nesnesindeki key ve label metnini yan yana kontrol et.

Alanlar arası refine kuralında önceki derste gördüğün `path` kararı önemlidir. Kural formdaki belli bir input'a aitse issue yolunu o alana bağla; resolver alan hatasını `errors` içine yerleştirebilir. Hata kökte kalırsa onu alan mesajı gibi göstermek zorlaşır.

## Gerçek bir hata ve düzeltmesi

Dönüşüm olan şemada sık rastlanan hata, formun input ve output tiplerini tek tipe zorlamaktır. Belirti olarak TypeScript callback'te `guests` alanını metin gibi görür ya da resolver ile form generic'leri uyuşmaz der. Sebep, input'un `'4'` ve output'un `4` olmasıdır. Düzeltme, `useForm` için `z.input<typeof schema>` ve `z.output<typeof schema>` tiplerini ayrı kullanmaktır.

Bir başka görünür sorun, submit'in çalışmaması ama ekranda mesaj olmamasıdır. Resolver hata üretmiş olabilir; bileşen `errors` değerini göstermiyorsa kullanıcı neyi değiştireceğini göremez. Alan için okunur label, hata mesajı ve geçersiz durum bilgisini birlikte render et.

## Zihinde tut

- RHF input değerini ve kullanıcı etkileşimini; Zod kabul edilen veri biçimini yönetir.
- `zodResolver` Zod şemasının sonucunu RHF form akışına bağlar.
- Şema hatası geçerli submit callback'ini durdurur; bileşen mesajı kullanıcıya göstermelidir.
- Dönüşüm varsa input ham form değeri, output callback'e verilen doğrulanmış değerdir.
- `touched` ve `dirty` doğrulama kuralı değil, alanın kullanıcıyla etkileşim durumudur.

**Yeni terimler:**

- **resolver:** RHF'nin doğrulama sırasında çağırdığı bağlantı; bu derste Zod sonucunu forma taşır.
- **touched:** Kullanıcının alana dokunup sonra ayrıldığını belirten durum.
- **dirty:** Alan değerinin başlangıç değerinden farklı olduğunu belirten durum.
- **input / output:** Dönüşüm öncesi forma giren tip / başarılı parse sonrası submit tipidir.

**Kendini yokla:** Resolver başarısız olunca geçerli submit callback'i çağrılır mı?  
*Cevap:* Hayır; hata RHF form durumuna aktarılır ve callback durur.

**Kendini yokla:** Neden number input olsa da callback'e string yerine number vermek için şema gerekir?  
*Cevap:* Input'un ham değeri metindir; şema onu dönüştürüp number olarak doğrular.
