---
title: "React 19 form actions ve RHF seçimi"
minutes: 14
kind: concept
---

# React 19 form actions ve RHF seçimi

:::pain[Her form için aynı araç gerekir mi?]
Tek alanlı bir destek mesajı formu yalnızca metni alıp bekleme/başarı durumunu gösterecek. Bunun yanında başka bir ekranda alan bazlı hatalar, kirli durum ve dinamik satırlar var. İki formu da aynı miktarda araçla kurmak gereksiz karmaşıklık yaratabilir.
:::

## Native form action'ın sunduğu

React 19, `<form action={fn}>` ile form gönderimini bir action fonksiyonuna bağlamayı ve `useActionState` ile sonucu React state'ine taşımayı sağlar. Formun native alanları `FormData` oluşturur. Bu, alan sayısı az ve özel alan yönetimi gerekmeyen akışlarda yeterli olabilir. RHF ise kayıtlı alanların durumunu, doğrulamasını, dirty/touched bilgilerini ve özel/dinamik kontrolleri sunar.

:::model[Form deposu ve abonelik]
RHF, alanları kendi form deposunda tutar ve ihtiyaç duyulan form state değişimlerine abone olur. React action modeli aynı kayıt deposunu sağlamaz; form submit'inde native `FormData` alır ve action sonucu/pending bilgisini React yönetir. Araç seçerken yeni değişen sorumluluk budur.
:::

Karar noktaları:

1. Native HTML form submit'i değerleri `FormData` olarak toplar; input'lara `name` vermelisin.
2. `useActionState(action, initialState)`, `[state, formAction, isPending]` döndürür.
3. React form action'ı önceki state'i, sonra `FormData`'yı argüman olarak alır: `(previousState, formData)`.
4. `formAction`, `<form action>` prop'una verilir; action tamamlanınca state ve pending bilgisi güncellenir.
5. `useFormStatus()` formun içindeki alt bileşende o formun pending bilgisini okur; formu render eden aynı bileşenden okunmaz.
6. Action modelinde RHF'nin `register`, alan bazlı errors, `Controller` veya field array API'si otomatik gelmez.
7. İki model birlikte kullanılabilir; ancak RHF ve React action arasında özel resmi entegrasyon API'si olduğu varsayılmaz.

## Action submit'ini zaman sırasıyla oku

Bir destek formu `message` alanını gönderiyor ve action kısa bir durum metni döndürüyor:

| Aşama | Action/FormData | UI durumu |
|---|---|---|
| İlk render | Action state `''` | Düğme etkin |
| Kullanıcı yazar | Native input değeri değişir | Form action henüz çalışmadı |
| Submit | React `FormData` üretip action çağırır | `isPending = true` |
| Action okur | `formData.get('message')` string/`File`/null olabilir | Aynı pending görünür |
| Action döner | Yeni sonuç state'e yazılır | `isPending = false`, mesaj görünür |

`FormData.get` dönüş tipi `FormDataEntryValue | null` olduğu için `String(...)` ile körlemesine dönüştürmek yerine beklenen değeri daralt. Dosya alanı eklenirse değer `File` olabilir. HTML `required`/`maxLength` tarayıcı kontrolleri basit kurallar için yardımcıdır; daha karmaşık, alan başına mesajlı hata akışı için state ve ilişkilendirmeyi ayrıca kurarsın.

## Basit action örneği

Action'ın imzası ve form bağını şöyle kurabilirsin:

```tsx check
import { useActionState } from 'react'

type MessageState = { text: string }

async function submitMessage(previous: MessageState, data: FormData): Promise<MessageState> {
  const value = data.get('message')
  const message = typeof value === 'string' ? value.trim() : ''
  if (!message) return { text: 'Mesaj gerekli' }
  return { text: `Alındı: ${message.length} karakter` }
}

export function SupportMessage() {
  const [state, formAction, isPending] = useActionState(submitMessage, { text: '' })
  return <form action={formAction}>
    <label htmlFor="support-message">Mesaj</label>
    <textarea id="support-message" name="message" required />
    <button disabled={isPending}>{isPending ? 'Gönderiliyor…' : 'Gönder'}</button>
    {state.text && <p role="status">{state.text}</p>}
  </form>
}
```

Action'ın ilk argümanı önceki state'dir; `FormData` ikinci argümandır. `name="message"` olmadan FormData içinde alan bulunmaz. `useActionState` action fonksiyonunu form prop'una verilecek hale getirir ve bekleme sonucunu aynı bileşene döndürür. Gerçek API isteği yapılacaksa ağ hatasını da state'e dönüştür veya hata sınırına uygun biçimde fırlat.

## Hangi formda hangisi?

Tek bir metin kutusu ve tek bir gönderim sonucu olan form action ile az kodda kurulabilir. Bir formda farklı başlangıç değerleri, anlık dirty bilgisi, her alan için hata, tarih/picker gibi controlled bir kontrol ve eklenip silinen satırlar varsa RHF'nin alan modeli bu işleri doğrudan çözer.

Karar “React action yeni, RHF eski” değildir. Gerekli kullanıcı deneyimini ve doğrulama kapsamını karşılayan en küçük modeli seç. Native submit davranışı, JavaScript yüklenmeden gönderim gibi progressive enhancement beklentisi varsa React action avantaj sağlayabilir; client-side form kütüphanesinin kurulumuna bağlı davranışları da düşün. Bu platformun istemci uygulamalarında API entegrasyonu, alan hatası ve tekrar deneme akışları zaten bulunduğundan RHF yaygın kullanım için uygundur.

İki yöntemi aynı formda kullanmak mümkün olsa da submit'in sahibi net olmalı. `<form action>` ve `onSubmit={handleSubmit(...)}` birlikte bağlanırsa iki akışın ne zaman çalıştığını dikkatle belirlemen gerekir; aksi halde iki kez submit veya iki doğrulama yolu oluşabilir. RHF değerlerini kendi callback'inle alıp bir React action çağırmak da ayrı bir tasarım kararıdır; bunun form kütüphanesinin otomatik entegrasyonu olduğunu söyleme.

:::mistake[Action argüman sırası ters]
**Belirti:** Action `FormData` üzerinde `.get` çağırınca hata verir. → **Neden:** `useActionState` action'a önce önceki state'i, sonra form verisini verir. → **Düzeltme:** İmzayı `(previousState, formData)` olarak tanımla.
:::

:::mistake[Form gönderiliyor ama FormData boş]
**Belirti:** Action `null` değer alıyor. → **Neden:** Input üzerinde `name` yok veya yanlış anahtar okunuyor. → **Düzeltme:** Her native alanın `name` değerini ve `FormData.get` anahtarını eşleştir.
:::

:::mistake[`useFormStatus` pending false kalıyor]
**Belirti:** Submit düğmesi bekleme durumunu görmüyor. → **Neden:** Hook formu oluşturan aynı bileşende çağrılmış; o formun alt ağacında değil. → **Düzeltme:** Pending düğmesini `<form>` ağacının altındaki child bileşene taşı.
:::

:::sector
Takımlar form mimarisini tek teknoloji kuralına değil ihtiyaç sınıflarına göre standardize eder: basit native form, action; zengin alan yönetimi, RHF; şema doğrulaması gerekiyorsa Zod gibi runtime schema. Bir projede iki yöntemi desteklemek bakım maliyetini artırıyorsa ekip varsayılanı belirleyip istisnaları gerekçelendirir.
:::

## Native davranış ile runtime doğrulaması

HTML `required`, `minLength`, `type="email"` gibi constraint'ler tarayıcıda JavaScript çalışmadan önce kullanıcıya geri bildirim verebilir. Bunlar action'ın veya sunucunun aldığı veriyi otomatik doğru tipe dönüştürmez. `FormData.get()` `string | File | null` döndürür; hidden input da güvenilir değildir, kullanıcı istemci değerini değiştirebilir. Action içinde veriyi doğrula, API sınırında da tekrar kontrol et.

`useActionState` sonucu çoğu zaman `{ kind: 'idle' } | { kind: 'error'; message: string } | { kind: 'success'; message: string }` gibi discriminated union olabilir. Böylece UI hata ve başarı mesajlarını karıştırmaz. Birden çok field error gerekiyorsa state yapısını ve alan-id ilişkisini kendin kurmalısın; action hook'u form library'nin hata ağacını üretmez. Basit string state hızlıdır ama durum çeşitlendikçe anlamı belirsizleşir.

Progressive enhancement ihtiyacında action'a doğrudan server function bağlama kalıbı Server Components/Server Actions bağlamıyla karıştırılabilir. Bu eğitimdeki istemci React uygulamasında sıradan bir async client function kullanılabilir; sunucu işlemi hangi runtime'da çalışıyor, bu işin güvenlik sınırını belirler. Tarayıcı içinde çalışan action fonksiyonu sır saklamaz ve backend yetkilendirmesinin yerini almaz.

Son karar, “formun kaç alanı var?” sayısından daha geniştir. Alanlar arası doğrulama, taslak saklama, tekrar deneme, offline destek ve erişilebilir hata focus'u gibi gereksinimleri yaz. Basit formda native kontrol + action az kodla yeterli olabilir; gelişmiş formda RHF bu tekrar eden alan durumunu sağlar. İki yöntemi birleştiriyorsan her birinin sorumlu olduğu state'i açıkça belirt.

## Özet ve kendini yokla

- React action formu `FormData` ve `useActionState` ile submit sonucu/pending yönetebilir.
- Action imzası önceki state, sonra `FormData` alır; native input'larda `name` zorunludur.
- RHF alan odaklı durum ve dinamik/özel alan araçları verir; React action bunları sağlamaz.
- Bir submit'in sahibini açık tut; iki mekanizmayı gelişigüzel üst üste bindirme.

**Kendini yokla:** Bir radio grubunun hatasını alan düzeyinde ve `Controller` ile yönetmen gerekiyor; hangi model daha uygun? RHF. `useFormStatus` nerede okunur? İlgili formun alt ağacındaki bileşende.
