---
title: "Giriş: formdan token çiftine"
minutes: 16
kind: concept
---

# Giriş: formdan token çiftine

Sinema'da gösterim notlarını görmek için kullanıcı adı ve parola giriyorsun. Formdaki alanların dolu olması, sunucudaki hesabın doğru olduğu anlamına gelmez. Form yalnızca girdiyi düzenli biçimde toplar; kimlik bilgilerini kontrol edip girişe izin veren taraf sunucudur.

Bu akışta iki ayrı kontrol var. **Validation** (girdi doğrulama), boş alan gibi kolayca düzeltilebilecek sorunları istek gitmeden yakalar. **Authentication** (kimlik doğrulama), sunucunun kullanıcının gerçekten o hesap olduğunu kontrol etmesidir. İlk kontrol kullanıcıya hızlı geri bildirim verir; güvenlik kararını ikinci kontrol verir.

## Önce sunucudan gelen cevabı okuyalım

İlk adım, butona basıldığında sunucuya bir `POST` isteği göndermektir. `POST`, genellikle sunucuya veri göndermek için kullanılan HTTP yöntemidir. Şimdilik Sinema'nın gösterim notu API'sine farklı bir örnek veri yollayalım:

```ts check
const response = await fetch('/api/sinema/notes/session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ screeningId: 'midnight-7' }),
})

console.log(response.status)
```

Bu örnek isteği yollar, ama durum kodunu yalnızca yazdırır. `fetch` HTTP yanıtı geldiğinde 401 veya 500 olsa da normal bir `Response` döndürür; bu yüzden kod kendi başına başarısızlığı yakalamaz. HTTP durum kodu, sunucunun isteğe verdiği sayısal sonuçtur.

İkinci adımda `response.ok` ile başarılı durum kodlarını ayıralım. Bu özellik, durum kodu 200–299 aralığındaysa `true` olur:

```ts check
const response = await fetch('/api/sinema/notes/session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ screeningId: 'midnight-7' }),
})

if (!response.ok) {
  throw new Error(`İstek başarısız: ${response.status}`)
}

const result: unknown = await response.json()
console.log(result)
```

Şimdi 401 gelirse `response.ok` false olur ve kod kendi hata sinyalini üretir. Ancak sunucunun gönderdiği açıklamayı henüz göstermiyoruz. Hata gövdesi varsa onu okuyup genel bir hata mesajına çevirmek, formun ne olduğunu kullanıcıya anlatmasını sağlar.

Üçüncü adımda sunucu hata gövdesini de okuyalım. Sinema API'sinin hata yanıtında `message` alanı bulunduğunu varsayıyoruz:

```ts check
async function requestScreeningNotes(screeningId: string): Promise<unknown> {
  const response = await fetch('/api/sinema/notes/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ screeningId }),
  })

  if (!response.ok) {
    const body = (await response.json()) as { message?: string }
    throw new Error(body.message ?? 'Notlar yüklenemedi.')
  }

  return response.json()
}
```

`response.ok` false ise yanıtın `message` değeri bir `Error` içine taşınır; çağıran katman bunu kullanıcıya gösterebilir. `fetch` ağ bağlantısı koparsa veya istek engellenirse ayrıca hata fırlatır. Bu yüzden çağıran kod hem sunucunun reddini hem ağ hatasını yakalayabilir. Parolayı veya token'ı bu hata metnine ekleme.

### Yanıt sırasını izleyelim

Asenkron istek bitene kadar kodun beklediğini ve sonra hangi dala girdiğini sırayla düşün:

| Sıra | Olay | Kodun davranışı |
| --- | --- | --- |
| 1 | Form gönderilir | Alanlar önce doğrulanır |
| 2 | Girdi geçersizdir | İstek başlamaz, alan altında uyarı görünür |
| 3 | Girdi geçerlidir | `fetch` sunucuya isteği gönderir |
| 4 | HTTP 401 gelir | `fetch` yine yanıt verir, `response.ok` false olur |
| 5 | Hata gövdesi okunur | Açıklama `Error` içine konur ve formun geneline gösterilir |
| 6 | HTTP 200 gelir | JSON okunur; uygulama token çiftini alabilir |

![Login akışı: istemci doğrulaması, sunucu isteği ve oturum durumu](diagrams/login-akis-semasi.svg "Login akışı istemci kontrolü, sunucu isteği ve hata yönetimini gösterir.")

Başarılı login cevabında Sinema'nın kullandığı servis `accessToken` ve `refreshToken` alanlarını JSON gövdesinde verir; login fonksiyonu ikisini de taşıyan bir nesne döndürmelidir. Bir token var, öteki yoksa eksik cevabı başarılı oturum gibi kaydetme. `response.json()` da asenkron çalışır; önce yanıtın başarılı olduğunu belirle, sonra gövdeyi oku. Refresh token'ın kullanımını sonraki derste açacağız.

Sunucu her zaman JSON hata metni döndürmeyebilir. Örneğin ara sunucu HTML hata sayfası gönderebilir; bu durumda `response.json()` kendi parse hatasını verir. Üretim kodu bu durumu da yakalayıp parola içermeyen genel bir mesaj kullanmalıdır. Görev örneğinde hata gövdesi JSON'dur; gerçek API sözleşmesini bilmiyorsan hata cevabının biçimini varsayma.

## Girdiyi formda doğrula

İki alanın boş olup olmadığını form gönderilmeden kontrol etmek kullanıcıya daha hızlı ve anlaşılır geri bildirim verir. Sinema formlarında **React Hook Form (RHF)** form alanlarının değer ve hata durumunu yönetmeye, **Zod** ise alan kurallarını tarif etmeye yarar. `zodResolver`, Zod kurallarını RHF'nin submit akışına bağlayan adaptördür.

Önce yalnızca kullanıcı adı için kısa bir şema düşün:

```ts check
import { z } from 'zod'

const memberSchema = z.object({
  handle: z.string().min(1, 'Kullanıcı adı gerekli.'),
})

console.log(memberSchema.safeParse({ handle: '' }).success) // false
```

Boş dizgi kurala uymadığı için sonuç başarısızdır. Şema, girdinin biçimini denetler; sunucunun hesabı tanıyıp tanımadığını bilemez. Şimdi parolayı da aynı nesneye ekleyelim:

```ts check
import { z } from 'zod'

const memberSchema = z.object({
  handle: z.string().min(1, 'Kullanıcı adı gerekli.'),
  password: z.string().min(1, 'Parola gerekli.'),
})

console.log(memberSchema.safeParse({ handle: 'deniz', password: '' }).success) // false
```

Bu kez kullanıcı adı dolu, parola boş olduğu için tüm girdi geçersiz. RHF'ye bu şemayı verirsek hatayı doğru alana bağlayabilir ve geçersiz formda submit işlevini çalıştırmayız. Gerçek hesap kontrolü için geçerli form yine de sunucuya gitmelidir.

Formun genelinde oluşan hata ile belirli bir alanın hatasını ayırmak da önemlidir. Boş parola hatası alanın yanında gösterilir. “Kullanıcı adı veya parola hatalı” ise belirli bir alana bağlanamaz; buna **root/API error** (formun geneline ait hata) denir. Genel uyarıda `role="alert"` kullanmak, ekran okuyuculara mesajın hemen duyurulmasını sağlar.

## Örnek form ve hata akışı

Şimdi farklı bir Sinema bileşeni olan `MemberAccessPanel`'de RHF, Zod ve sunucu hatasını birleştirelim:

```tsx check
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const memberSchema = z.object({
  handle: z.string().min(1, 'Kullanıcı adı gerekli.'),
  password: z.string().min(1, 'Parola gerekli.'),
})

type MemberFields = z.infer<typeof memberSchema>

export function MemberAccessPanel({
  onCheck,
}: {
  onCheck: (fields: MemberFields) => Promise<void>
}) {
  const { register, handleSubmit, setError, formState } = useForm<MemberFields>({
    resolver: zodResolver(memberSchema),
  })

  async function submit(fields: MemberFields) {
    try {
      await onCheck(fields)
    } catch (error) {
      setError('root', {
        message: error instanceof Error ? error.message : 'Giriş başarısız oldu.',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <label>
        Kullanıcı adı
        <input {...register('handle')} />
      </label>
      {formState.errors.handle && <p>{formState.errors.handle.message}</p>}
      <label>
        Parola
        <input type="password" {...register('password')} />
      </label>
      {formState.errors.password && <p>{formState.errors.password.message}</p>}
      {formState.errors.root && <p role="alert">{formState.errors.root.message}</p>}
      <button disabled={formState.isSubmitting}>Giriş yap</button>
    </form>
  )
}
```

Burada `handleSubmit` önce şemayı çalıştırır; alanlar geçersizse `submit` çağrılmaz. Geçerliyse istek başlar. `onCheck` hata fırlatırsa `catch` hatayı genel `root` alanına koyar; işlem sürerken düğme devre dışı olduğu için art arda gönderimler de engellenir. Parola, hata metnine veya log'a eklenmez.

Gerçek bir hata belirtisi şudur: Yanlış parola girildiğinde form başarıyla gönderilmiş gibi ilerler, ama kullanıcıya hata çıkmaz. Genellikle neden `fetch` çağrısının 401'de reddedileceğini varsaymaktır. `response.ok` kontrolü bu varsayımı düzeltir; sunucu reddini açıkça `Error` olarak yukarı taşımak arayüzün doğru genel uyarıyı göstermesini sağlar.

## Aklında kalsın

- Form doğrulaması boş alan gibi hataları erkenden gösterir; hesabı doğrulayan sunucudur.
- `fetch` HTTP 400/401/500 yanıtlarında kendiliğinden reject olmaz; `response.ok` kontrol et.
- Alan hatasını girdinin yanında, root/API hatasını formun genelinde göster.
- Zod kuralları tanımlar, RHF formu yönetir, `zodResolver` ikisini bağlar.
- Parola ve token'ı hata mesajına ya da log'a koyma.

**Yeni terimler**

- **Validation / authentication:** Girdinin biçimini kontrol etmek / kullanıcının kim olduğunu sunucuda doğrulamak.
- **`response.ok`:** HTTP yanıtının başarılı durum kodu aralığında olup olmadığını gösteren boolean.
- **Root/API error:** Tek bir alana ait olmayan, formun geneline ait sunucu hatası.
- **RHF, Zod ve `zodResolver`:** RHF form durumunu yönetir; Zod kuralları tanımlar; resolver bu kuralları forma bağlar.

**Kendini yokla:** `fetch` 401 döndürdü; `try/catch` içindeki `await fetch()` tek başına `catch`'e gider mi?  
**Cevap:** Hayır. HTTP yanıtı geldiği için `fetch` resolve olur; `response.ok` kontrol edip hata fırlatmalısın.

**Kendini yokla:** Boş parola ile sunucu reddinden gelen “kimlik bilgileri hatalı” mesajı aynı yerde mi gösterilir?  
**Cevap:** Hayır. Boş parola alan altındaki hatadır; sunucu reddi formun genelindeki `role="alert"` uyarısıdır.
