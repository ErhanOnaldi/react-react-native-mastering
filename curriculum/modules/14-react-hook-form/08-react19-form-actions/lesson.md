---
title: "React 19 form actions ve RHF seçimi"
minutes: 16
kind: concept
---

# React 19 form actions ve RHF seçimi

Sinema'da tek bir metin alanıyla destek mesajı alabilirsin. Tarayıcının normal form gönderimi zaten input değerlerini toplar. Daha önce öğrendiğin RHF de formlar kurar, ama her küçük formun ayrı alan deposu ve doğrulama modeline ihtiyacı olmayabilir. React 19'daki **form action**, `<form>` gönderimini bir fonksiyona bağlayıp bu fonksiyonun sonucunu React state'iyle göstermenin yoludur.

## Tarayıcı form değerlerini nasıl toplar?

Native HTML formda (tarayıcının kendi `<form>`, `<input>` davranışında) gönderilecek her alana bir `name` verirsin. Tarayıcı bu ad ve değer çiftlerini `FormData` nesnesinde toplar. `FormData` bir form gönderiminin alanlarını taşır; burada yeni bir form kütüphanesi kurmadan ilk adımı deneyelim.

### 1. örnek: Bir native alanı oku

```tsx check
function readMessage(data: FormData): string {
  const value = data.get('message')
  return typeof value === 'string' ? value.trim() : ''
}

export function MessagePreview() {
  function submit(data: FormData) {
    const message = readMessage(data)
    console.log(message)
  }

  return (
    <form action={submit}>
      <label htmlFor="message">Mesaj</label>
      <textarea id="message" name="message" />
      <button>Önizle</button>
    </form>
  )
}
```

`name="message"` tarayıcıya alanın FormData içindeki anahtarını söyler. Action burada gönderilen veriyi okur. `FormData.get` bir metin, dosya veya `null` verebilir; `typeof` kontrolüyle yalnız beklediğimiz metni kullanıyoruz. `name` unutulursa action çalışsa bile bu anahtar için `null` okursun.

## Action sonucunu React state'inde göster

Bir fonksiyon `<form action>` ile çağrılınca **form action** olur; yani form gönderiminin yaptığı iş. Çalışmanın beklediği sırada kullanıcıya bir pending durumu (iş sürüyor bilgisi) göstermek için `useActionState` kullanabiliriz. Bu Hook, önceki sonucu action'a verir, yeni sonucu bileşene döndürür.

### 2. örnek: Önceki state'i al, yeni sonucu döndür

```tsx check
import { useActionState } from 'react'

type MessageState = { text: string }

async function countMessage(
  previous: MessageState,
  data: FormData,
): Promise<MessageState> {
  const value = data.get('message')
  const message = typeof value === 'string' ? value.trim() : ''
  if (!message) return { text: 'Mesaj gerekli' }
  return { text: `Mesaj ${message.length} karakter` }
}

export function MessageCounter() {
  const [state, formAction, isPending] = useActionState(countMessage, { text: '' })

  return (
    <form action={formAction}>
      <label htmlFor="message-count">Mesaj</label>
      <textarea id="message-count" name="message" required />
      <button disabled={isPending}>{isPending ? 'Sayılıyor…' : 'Say'}</button>
      {state.text && <p role="status">{state.text}</p>}
    </form>
  )
}
```

Action imzası `(previousState, formData)` sırasındadır. `useActionState` ilk render'da başlangıç state'ini verir; submit'te action'ı çalıştırır; dönüş değerini `state` olarak sunar. Bu fonksiyon asenkron olduğunda `isPending` action tamamlanana kadar true olur. Buradaki `previous` kullanılmıyor, ama argüman yine de imzada yer almalı.

## Gönderimi adım adım izle

Kullanıcı “Yeni sezonu ne zaman duyuracaksınız?” yazıp gönderdiğinde şu sıra oluşur:

| Adım | Ne çalışır? | State / görünen sonuç |
|---|---|---|
| İlk açılış | `useActionState` başlangıç değerini verir | `state.text` boş; düğme açık |
| Yazma | Native textarea değeri değişir | Henüz action çağrılmaz |
| Submit | React alanı `FormData` olarak toplar ve action'ı çağırır | `isPending` true |
| Action | `data.get('message')` metni okur | Düğmede “Sayılıyor…” görünür |
| Action döner | Yeni `MessageState` döner | `state.text` güncellenir, `isPending` false |

Bu ayrım, “form gönderiliyor” ile “sonuç geldi” anlarını görünür kılar. `required` tarayıcının boş alanı göndermemesine yardım eder; action yine de gelen veriyi kontrol eder, çünkü istemciden gelen değerleri güvenilir kabul edemeyiz.

### 3. örnek: Sinema film önerisini action ile al

Şimdi aynı yapıyı tek metin alanıyla film önerisi almaya büyütelim. Bu action alanı temizlemez veya film kaydettiğini iddia etmez; gelen öneriyi doğrulayıp kısa bir alındı sonucu gösterir:

```tsx check
import { useActionState } from 'react'

type SuggestionState = { message: string }

async function receiveSuggestion(
  previous: SuggestionState,
  data: FormData,
): Promise<SuggestionState> {
  const value = data.get('title')
  const title = typeof value === 'string' ? value.trim() : ''
  if (title.length < 2) return { message: 'Film adı en az iki karakter olmalı' }
  return { message: `${title} önerin alındı` }
}

export function FilmSuggestionForm() {
  const [state, formAction, isPending] = useActionState(receiveSuggestion, { message: '' })

  return (
    <form action={formAction}>
      <label htmlFor="suggested-title">Önermek istediğin film</label>
      <input id="suggested-title" name="title" required minLength={2} />
      <button disabled={isPending}>{isPending ? 'Gönderiliyor…' : 'Öner'}</button>
      {state.message && <p role="status">{state.message}</p>}
    </form>
  )
}
```

Artık formun üç parçası belli: `name` alanı FormData'ya koyar, action değeri okur ve `useActionState` sonucu/pending bilgisini verir. `title` anahtarı ile input'un `name` değeri aynı olduğu için doğru alan okunur. Action'ın aldığı veriyi kontrol etmek önemlidir; tarayıcı kısıtlamaları tek başına sunucu doğrulaması değildir.

Bir alanı dosya yüklemeye çevirirsen `FormData.get` bu kez `File` döndürebilir; sayı gibi görünen metin de kendiliğinden number olmaz. FormData sadece gönderilen değerleri taşır, uygulama kuralını ve doğruluğunu belirlemez. Bu nedenle action içinde beklenen türü kontrol et ve gerekirse sunucuya ulaşmadan önce anlaşılır bir sonuç döndür.

## Action mı, RHF mi?

Tek bir alan ve tek bir sonuç mesajı varsa native form ile action az kodda yeterli olabilir. Sekiz alan, alan başına hata, başlangıç değerleri, kirli durum veya eklenip silinen alan satırları varsa RHF bu alan yönetimini sunar. RHF'nin `register`, `Controller` ve field array araçları React action ile kendiliğinden ortaya çıkmaz.

İki modeli aynı arayüzde birlikte kullanabilirsin, ama her form gönderiminin sahibini belirgin tut. RHF'nin `handleSubmit`'i ve `<form action>` gelişigüzel aynı forma bağlanırsa iki farklı gönderim akışı çalışabilir. RHF doğrulamasından geçen değerleri kendi callback'inde bir action'a vermek ayrı bir düzenlemedir; iki kütüphane arasında hazır, resmi bir bağlayıcı olduğu anlamına gelmez.

Sekiz alanlı, dinamik etiketli ve alan bazlı hatalı bir formda RHF alanları yönetir. React action, asenkron gönderim ve sonuç bilgisini taşıyabilir. Gereksinime en küçük uyan yapıyı seç; araçları yeni oldukları için değil, çözdükleri ihtiyaç için kullan.

:::mistake[Action yanlış sırada veri arıyor]
**Belirti:** `data.get` çağrısı hata verir veya önceki sonuç üzerinde aranır. → **Neden:** `useActionState` önceki state'i ilk, FormData'yı ikinci argüman olarak verir. → **Düzeltme:** Action imzasını `(previousState, formData)` yaz.
:::

:::mistake[Action alanı boş okuyor]
**Belirti:** `FormData.get('title')` `null` döndürür. → **Neden:** Input'ta `name="title"` yoktur veya action başka anahtarı okur. → **Düzeltme:** `name` ile `get` içindeki anahtarı eşleştir.
:::

:::info[Derinlemesine (isteğe bağlı)]
`useFormStatus()` formun pending durumunu alt bileşenden okumayı sağlar; onu `<form>` elementini oluşturan aynı bileşende çağırma. Server Components ve Server Actions, server tarafında çalışan React altyapısı ve action işlevleriyle ilgilidir; bu istemci uygulamasındaki sıradan async action fonksiyonuyla aynı çalışma yeri değildir. Tarayıcıdaki kodda gizli anahtar tutulamaz; sunucu tarafı yetkilendirme yine sunucuda yapılmalıdır.
:::

## Özet ve kendini yokla

- Native alanın `name` değeri, FormData içinde hangi anahtarla bulunacağını belirler.
- `useActionState` action'a önceki state'i, sonra FormData'yı verir; sonucu ve pending bilgisini döndürür.
- Basit tek alanlı form action için uygun olabilir; zengin alan yönetimi RHF'nin işidir.
- Aynı formda iki submit mekanizması varsa sorumluluklarını açıkça bağla.

**Yeni terimler:**

- **Native form:** Tarayıcının yerleşik `<form>` ve alan davranışı.
- **FormData:** Form alanlarının ad/değer çiftlerini tutan tarayıcı nesnesi.
- **Form action:** Form gönderilince çalışan fonksiyon.
- **Pending:** Asenkron iş sürerken görülen bekleme durumu.

**Kendini yokla:** Action neden önceki state ve sonra FormData alır? `useActionState` önceki sonucu action'a aktarır, sonra bu gönderimin alanlarını verir. `FormData.get('title')` neden `null` olabilir? İlgili input'ta `name="title"` yoksa veya anahtar uyuşmuyorsa.
