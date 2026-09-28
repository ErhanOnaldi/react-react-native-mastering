---
title: "Kurallar, hata nesnesi ve doğrulama zamanı"
minutes: 15
kind: concept
---

# Kurallar, hata nesnesi ve doğrulama zamanı

:::pain[Form boş kayıt kabul ediyor]
Etkinlik planında başlığı boş bırakıp gönderiyorsun; uygulama boş kaydı kaydediyor. Alanın yanında hata göstermediğin için kullanıcı neyi düzeltmesi gerektiğini de anlayamıyor. Bir sonraki denemede isteğe bağlı açıklamanın boş olması da yanlışlıkla engellenmemeli.
:::

## Geçerli submit ile hata akışı

RHF'de validation kuralı alanın kaydına eklenir. `handleSubmit` form gönderiminde kayıtlı alanların kurallarını çalıştırır: başarılı callback yalnızca geçerli durumda çalışır; geçersiz durumda hata callback'i ve `formState.errors` üzerinden UI güncellenir. Hata nesnesi alan adına göre düzenlenir; bir alanın hatası diğer alanın verisini silmek zorunda değildir.

:::model[Form deposu ve abonelik]
Kayıtlı alanların değerleri form deposundadır; UI, ihtiyaç duyduğu hata ve durum alanlarına abone olur. Bu derste yeni olan nokta, `errors` değişince ilgili hata metninin render edilmesidir. Native input'u ayrıca controlled state'e kopyalamazsın.
:::

Kuralları şöyle düşün:

1. `register(name, rules)` native alanı kaydeder ve çalışma zamanı kurallarını o alana bağlar.
2. `required`, `minLength`, `maxLength`, `min`, `max`, `pattern` gibi kurallar input'un taşıdığı değeri değerlendirir. Her kural alanın veri türüne ve iş ihtiyacına uygun olmalı.
3. Kural başarısız olursa alan için `errors[name]` oluşur. Buradaki `message` kullanıcıya gösterilecek metindir; metni sen sağlarsın.
4. `handleSubmit(onValid, onInvalid)` yalnız validasyon başarılıysa `onValid` çağırır. `onInvalid` isteğe bağlı olarak hatalı alanları odaklama veya genel geri bildirim için kullanılabilir.
5. `mode` hatanın hangi aşamada doğrulanacağını etkiler. Varsayılan `onSubmit` ilk kontrolü gönderimde yapar; `onBlur`, `onChange` veya `onTouched` daha erken geri bildirim verir ve kullanıcı deneyimi/perf tercihini değiştirir.
6. Alan hatası, sunucu hatası değildir. Form geçerli olduğu halde API reddedebilir; iki mesajı ayrı durumlarda tut.

## Adım adım hata izleyelim

Bir etkinlik başlığı en az iki karakter olsun, kısa not ise isteğe bağlı ama 80 karakteri aşmasın. İlk durumda kullanıcı başlığı boş bırakıp submit eder:

| Sıra | Olay | RHF'deki sonuç | Kullanıcının gördüğü |
|---|---|---|---|
| 1 | Submit handler çalışır | Başlık için `required` başarısız | Henüz hata metni yoksa UI değişebilir |
| 2 | `onValid` atlanır | `errors.title` mesaj alır | “Başlık gerekli” |
| 3 | Kullanıcı `A` yazar | Alan değeri `A` olur | `minLength` hâlâ başarısız |
| 4 | Form yeniden değerlendirilir | `errors.title` kısa değer hatası | “En az 2 karakter” |
| 5 | Kullanıcı `Atölye` yazar | Kural geçer | Hata temizlenir, submit mümkün |
| 6 | Not boş kalır | İsteğe bağlı alan geçerli | Ek uyarı çıkmaz |

Mesajın tam ne zaman güncelleneceği `mode` ve `reValidateMode` ayarlarına bağlıdır. Varsayılan akışta ilk submit hatayı görünür kılar; sonra kullanıcı düzenledikçe hata yeniden doğrulanır. `onChange` moduna hemen geçmek her tuşta kontrol ve abone UI güncellemesi demektir. Uzun ve karmaşık formlarda anlık doğrulamanın faydasını maliyetle beraber değerlendir.

## Önce bozuk, sonra alan kuralı

Bu örnekte başlık gönderim callback'ine her koşulda gider; ayrıca opsiyonel not için boş değer bile reddedilebilir:

```tsx
function BrokenEventForm({ onSave }: { onSave: (title: string) => void }) {
  return <form onSubmit={(event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    onSave(String(data.get('title') ?? ''))
  }}>
    <input name="title" aria-label="Etkinlik başlığı" />
    <button type="submit">Kaydet</button>
  </form>
}
```

Alan kuralı ve hata görünümünü kayda yakın kur:

```tsx check
import { useForm } from 'react-hook-form'

type EventValues = { title: string; note: string }

export function EventForm({ onSave }: { onSave: (values: EventValues) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<EventValues>({
    defaultValues: { title: '', note: '' },
  })
  return <form onSubmit={handleSubmit(onSave)}>
    <label htmlFor="event-title">Etkinlik başlığı</label>
    <input id="event-title" {...register('title', {
      required: 'Başlık gerekli',
      minLength: { value: 2, message: 'En az 2 karakter' },
    })} />
    {errors.title && <p role="alert">{errors.title.message}</p>}
    <label htmlFor="event-note">Kısa not</label>
    <textarea id="event-note" {...register('note', {
      maxLength: { value: 80, message: 'Not en çok 80 karakter' },
    })} />
    {errors.note && <p role="alert">{errors.note.message}</p>}
    <button type="submit">Kaydet</button>
  </form>
}
```

Bozuk örnekte geçerli ve geçersiz veri ayrımı yoktur. Düzeltilmiş örnekte her kural alanla birliktedir, boş not kabul edilir ve hata yalnız ilgili alanda görünür. Görsel metni alanla programatik olarak ilişkilendirmek ayrıca gerekir; bu modülün erişilebilirlik dersinde ele alınır.

## Kural seçerken sınırı bil

`minLength` metnin boş olup olmadığını tek başına çözmez; boş olmayan zorunlu alan için `required` de yaz. `maxLength` boş opsiyonel metni kabul eder. Sayı input'unda `min`/`max` sayısal sınırı belirler; ama `valueAsNumber` ile dönüşüm seçtiğinde boş değer nasıl temsil edileceğini kontrol et.

Özel iş kuralında `validate` kullanabilirsin. Örneğin bitiş tarihi başlangıçtan önce olamaz. Bu kural iki alana bağlıysa hangi alan hata sahibi olacak, kullanıcı mesajı nerede gösterecek ve diğer tarih değişince doğrulama ne zaman tekrarlanacak karar ver. Çok sayıda alanlar arası kuralı register callback'lerine dağıtmak okunabilirliği düşürür; şema tabanlı doğrulama için sonraki Zod modülü daha uygun olur.

:::mistake[Boş değer kısa alan hatası veriyor]
**Belirti:** Kullanıcı hiçbir şey yazmasa da “En az 2 karakter” görüyor. → **Neden:** `minLength` var ama boşluğu anlatan `required` kuralı eksik veya mesajlar aynı sırada kullanılmış. → **Düzeltme:** Zorunlu alan için önce `required`, sonra uzunluk sınırı tanımla.
:::

:::mistake[Hata nesnesi tüm alanı gösteriyor]
**Belirti:** Ekranda `[object Object]` yazıyor. → **Neden:** `errors.title` nesnesini doğrudan render ediyorsun. → **Düzeltme:** Varsa `errors.title.message` göster; alan hatasını alanın yakınında tut.
:::

:::mistake[Her tuşta kullanıcıya hata bağırıyor]
**Belirti:** Daha yazmaya başlarken form kırmızı uyarılarla doluyor. → **Neden:** Doğrulamayı `onChange` seçtin veya form ilk submit'ten sonra bu modda tekrar doğrulanıyor. → **Düzeltme:** Hatanın ne zaman yararlı olacağına göre `onSubmit`, `onBlur`, `onTouched` ve yeniden doğrulama davranışını seç.
:::

:::sector
Ürün ekipleri hata metnini “geçersiz” gibi genel bir etiket olarak bırakmaz; kullanıcıya yapılacak işi söyler: “Başlığı en az 2 karakter yaz.” Client-side kural deneyimi iyileştirir, ama sunucu girdiyi yine doğrulamalıdır. Tarayıcı kodu değiştirilip doğrudan API çağrılabilir.
:::

## Çok alanlı ve değer dönüşümlü kurallar

Bir alanın tek başına geçerli olması, tüm formun iş kuralını karşıladığı anlamına gelmez. Bitiş tarihi başlangıç tarihinden önce olmamalıysa iki alan arasındaki ilişkiyi tanımlarsın. RHF'deki `validate` fonksiyonu diğer alanı `getValues` ile okuyabilir; ancak hangi alanda hata göstereceğini seç. Genellikle kullanıcıya düzeltmesi gereken alanı işaretlemek daha anlaşılırdır. Öteki alan değiştiğinde ilk hatanın yeniden değerlendirilmesi gerektiğini de planla.

HTML input türü, tarayıcı giriş davranışını ve erişilebilir kontrolleri etkiler. `type="email"` için native constraint validation ile RHF validation bir arada çalışabilir. Formun tarayıcı validation balonunu kullanmasını istemiyor, tüm hata metinlerini kendi alanında göstermek istiyorsan `<form noValidate>` seçeneğini değerlendir; bunu yapınca iş kuralı kontrollerini de RHF'de yazdığından emin ol. İki hata sisteminin aynı kullanıcı etkileşiminde çelişmesine izin verme.

Rakam girişi gibi dönüşümlerde kaydedilen string ile callback'teki sayı arasında bilinçli sınır çiz. `valueAsNumber` boş input için `NaN` üretebilir; `setValueAs` ile dönüşüm yapıyorsan boş değeri `undefined` veya domain'in kabul ettiği bir tipe açıkça çevir. Ardından `required`, `min` ve `max` kurallarının bu temsil üzerinde beklediğin gibi davrandığını kontrol et. Kullanıcı `0` girmiş olabilir; `value || fallback` kullanımı bu geçerli sıfırı yanlışlıkla siler.

Validasyon modunu ürün akışına göre seç. Gönderimden önce her tuşta hata göstermek, özellikle kullanıcı daha alanı tamamlamadan, sinir bozucu olabilir. Öte yandan parola gücü veya anlık arama gibi geri bildirimin hemen yararlı olduğu alanlar `onChange` kontrolünden fayda görebilir. Uzun formda yalnız gerekli alanları izle, her hata değişiminde bütün formu render etme.

Son olarak istemci kuralları verinin güvenilirliğini garanti etmez. Browser'ın HTML kontrolü atlanabilir ve JavaScript devre dışı bırakılabilir. Aynı zorunluluk, uzunluk sınırı ve alan ilişkisi sunucuda da doğrulanmalıdır. İstemci mesajı hızlı geri bildirim, sunucu kuralı ise verinin kalıcı sınırıdır.

## Özet ve kendini yokla

- Alan kuralları `register` yanında durur; hatalar `formState.errors` içinde alan adına göre tutulur.
- Geçersiz submit `onValid`'i çağırmaz; hata UI'sini sen gösterirsin.
- `mode` geri bildirimin zamanını belirler; daha erken kontrol daha sık doğrulama demektir.
- İstemci validasyonu kullanıcı deneyimidir; güvenlik sınırı sunucu validasyonudur.

**Kendini yokla:** `maxLength` verilen boş opsiyonel metin geçerli mi? Evet. `errors.title` neden doğrudan ekrana basılmaz? Çünkü alan hatası nesnedir; mesajı `.message` içindedir.
