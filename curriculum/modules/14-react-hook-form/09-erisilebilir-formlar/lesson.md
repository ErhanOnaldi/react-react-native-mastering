---
title: "Hata mesajını doğru alana bağla"
minutes: 16
kind: concept
---

# Hata mesajını doğru alana bağla

Sinema'da oyuncu adına göre arama alanı yaptığını düşün. Ekranda “Oyuncu adı” yazısı görünür, ama input'un kendisiyle ilişkili değilse ekran okuyucu bu adı kullanıcıya vermeyebilir. Ekran okuyucu, sayfanın içeriğini sesle veya braille ekranla aktaran yardımcı teknolojidir. Görsel yakınlık tek başına HTML içinde bir ilişki kurmaz.

Önceki doğrulama dersinde gördüğün kısa ilişkiyi hatırla: görünür label alanı adlandırır, `aria-invalid` geçersiz durumu söyler, `aria-describedby` hata metnini alana bağlar. Bu derste aynı bağı daha dikkatli kuracağız; çünkü kullanıcı yalnızca hatanın varlığını değil, hangi alanı nasıl düzelteceğini de bilmelidir.

## Görünür yazıyı input'un adına bağla

Bir input'un **accessible name**'i, yardımcı teknolojilerin o kontrolü tanıtmak için kullandığı addır. Görünür `<label>` bunu sağlamanın en anlaşılır yoludur. Etiketteki `htmlFor` ile input'un `id` eşleşir. `name` ise form verisindeki anahtardır; kendi başına input'u adlandırmaz.

### 1. örnek: Etiketi gerçek alana bağla

```tsx check
export function ActorSearch() {
  return (
    <form>
      <label htmlFor="actor-query">Oyuncu adı</label>
      <input id="actor-query" name="query" />
      <button type="submit">Ara</button>
    </form>
  )
}
```

Etikete tıklamak input'a odaklanır ve yardımcı teknoloji input'u “Oyuncu adı” diye tanıtabilir. `name="query"` form gönderiminde okunacak anahtarı belirler. Label metnini yalnızca `placeholder` olarak vermek aynı işi yapmaz: kullanıcı yazmaya başlayınca placeholder kaybolur ve alanın kalıcı adı olmaz.

## Geçersiz durumu ve açıklamayı ekle

**ARIA** (Accessible Rich Internet Applications), HTML öğelerinin anlamını ve durumunu yardımcı teknolojilere aktaran özellikler kümesidir. `aria-invalid` alanın geçersiz olduğunu bildirir. `aria-describedby` ise input için ek açıklama olan metnin `id` değerini söyler. Bunlar görünür label'ın yerine geçmez; farklı bilgileri taşır.

### 2. örnek: Hata metnine bir bağlantı kur

Bu kez arama metni en az iki karakter olmalı. Basit React state'iyle hata olup olmadığını gösterelim:

```tsx check
import { useState, type FormEvent } from 'react'

export function ActorSearch() {
  const [query, setQuery] = useState('')
  const [showError, setShowError] = useState(false)
  const errorId = 'actor-query-error'
  const invalid = showError && query.trim().length < 2

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setShowError(true)
  }

  return (
    <form onSubmit={submit}>
      <label htmlFor="actor-query">Oyuncu adı</label>
      <input
        id="actor-query"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
      />
      {invalid && <p id={errorId} role="alert">En az iki karakter yaz</p>}
      <button type="submit">Ara</button>
    </form>
  )
}
```

Submit'ten sonra metin kısa kalırsa `aria-invalid` true olur ve input, `aria-describedby` üzerinden hata paragrafına bağlanır. Hata yokken bu özellikleri kaldırıyoruz; böylece input artık görünmeyen bir hata metnine işaret etmez. `role="alert"` yeni hata mesajının hemen duyurulmasını isteyebilir, ama alanla bağ kuran özellik `aria-describedby`'dir.

## RHF hatasını DOM ilişkisine çevir

RHF `errors` içinde doğrulama sonucunu verir; bu nesneyi okumak erişilebilir HTML'i otomatik üretmez. Bileşen, hata varken doğru ARIA özelliklerini ve hata metnini DOM'a yazmalıdır. **DOM**, tarayıcının sayfayı oluşturan HTML öğeleri ağacıdır.

### 3. örnek: RHF hatasını erişilebilir göster

Şimdi aynı fikri, film gösteriminden sonra yönetmenin adını alan küçük bir formda kullanalım. Bu örnek alan hatasının nereye bağlanacağını gösterir:

```tsx check
import { useId } from 'react'
import { useForm } from 'react-hook-form'

type DirectorFields = { director: string }

export function DirectorCreditForm() {
  const errorId = useId()
  const { register, handleSubmit, formState: { errors } } = useForm<DirectorFields>()
  const invalid = Boolean(errors.director)

  return (
    <form onSubmit={handleSubmit(() => {})}>
      <label htmlFor="director-name">Yönetmen</label>
      <input
        id="director-name"
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        {...register('director', { required: 'Yönetmen adını yaz' })}
      />
      {errors.director && (
        <p id={errorId} role="alert">{errors.director.message}</p>
      )}
      <button type="submit">Devam et</button>
    </form>
  )
}
```

`useId` her component örneğine uygun, kararlı bir id üretir; iki form aynı sayfadaysa hata açıklamalarının id'leri birbirine karışmaz. `id` ve `htmlFor` label-input çiftini kurar; hata için ayrı bir id vardır. Submit geçersizse RHF `errors.director` üretir ve üç şey birlikte görünür: geçersiz durumu, açıklamaya giden bağlantı ve metnin kendisi.

## Hata anını sırayla izle

Yönetmen alanı boşken kullanıcı Devam et'e basarsa şu değişiklikler olur:

| Sıra | Form/DOM değişikliği | Kullanıcıya aktarılan bilgi |
|---|---|---|
| 1 | Label ile input id eşleşir | Alanın adı “Yönetmen” |
| 2 | RHF required kuralı çalışır | Alan geçersiz bulunur |
| 3 | Hata paragrafı DOM'a eklenir | “Yönetmen adını yaz” metni görünür/duyurulur |
| 4 | Input `aria-invalid` alır ve `aria-describedby` hata id'sini gösterir | Alanın hatalı olduğu ve düzeltme mesajı bilinir |
| 5 | Kullanıcı ad yazar, hata silinir | Geçersizlik kalkar; artık görünmeyen hata referansı kalmaz |

İlişki id değerleriyle kurulur. Paragrafın id'si `actor-error`, input'un `aria-describedby` değeri ise `name-error` olursa bağ kopuktur. Belirti: hata ekranda görünür, ama input'a geldiğinde ekran okuyucu bu metni açıklama olarak bulamaz. İki değeri aynı kaynaktan üret veya bir kez tanımlayıp ikisinde de kullan.

## Sık görülen kopukluklar

Placeholder'ı label yerine koyma. Kullanıcı metin yazınca ipucu kaybolur; ekran okuyucu adı da her durumda sağlanmış olmaz. Görünür label'ı tut ve `<label htmlFor>` değerinin input `id` değeriyle eşleştiğini kontrol et.

Hata paragrafını ekleyip alana bağlamayı unutma. Görsel olarak hemen altında durması ekran okuyucuya ilişkisini bildirmez. Hata id'sini `aria-describedby`'ye koy; hata yokken o bağlantıyı kaldır. Yardım metni sürekli görünüyorsa onun id'si açıklama listesinde kalabilir.

Bir ekranda hata sayısı çoksa her mesajı aynı anda `role="alert"` yapmak fazla duyuru üretebilir. Alan mesajlarını `aria-describedby` ile ilişkilendir; gerekiyorsa submit sonrası kısa bir hata özeti göster ve ilk hatalı alana odaklan. Görsel hata renginin yanında metin de kullan; anlamı yalnız renge bırakma.

Formdaki başka kontrollerde de native HTML öğelerini seç. Onay kutusunda gerçek `<input type="checkbox">`, tek seçimde `<input type="radio">` kullanmak klavye etkileşimini ve seçili durumu tarayıcıya bırakır. Bunları tıklanabilir `div` ile taklit edersen Space/ok tuşu gibi beklenen davranışları ayrıca yazman gerekir. Label bağlantısı ve açıklama ilişkisi aynı şekilde bu kontroller için de önemlidir.

:::info[Derinlemesine (isteğe bağlı)]
`useId` component kopyaları için DOM id üretir; film veya oyuncu kaydının veri id'si değildir, liste `key` değeri olarak da kullanılmaz. `jsdom` test ortamı DOM davranışını taklit eder ama ekran okuyucu değildir. Otomatik testler label ve id bağlantısını denetleyebilir; gerçek klavye ve ekran okuyucu deneyimini manuel olarak da kontrol et.
:::

## Özet ve kendini yokla

- Görünür `<label>` input'u adlandırır; `name` ve `placeholder` label yerine geçmez.
- `aria-invalid` geçersizliği, `aria-describedby` ise yardım/hata açıklamasını bildirir.
- Hata metni görünürken id'si input'a bağlanmalı; hata kalkınca eski referans kaldırılmalıdır.
- `role="alert"` duyuruyu başlatabilir; alan-hata ilişkisini `aria-describedby` kurar.

**Yeni terimler:**

- **Accessible name:** Yardımcı teknolojinin bir kontrolü tanıtmak için okuduğu ad.
- **ARIA:** HTML durum ve ilişkilerini yardımcı teknolojilere aktaran özellikler.
- **DOM:** Tarayıcının sayfayı temsil ettiği HTML öğeleri ağacı.
- **`aria-invalid`:** Bir kontrolün geçersiz olduğunu bildiren ARIA özelliği.
- **`aria-describedby`:** Kontrole ek açıklama bağlayan ARIA özelliği.

**Kendini yokla:** Yalnız `name="email"` input'a “E-posta” adını verir mi? Hayır; görünür label veya başka bir erişilebilir ad gerekir. Hata paragrafı hangi özellikle input'a bağlanır? `aria-describedby` ile paragrafın id'si eşleştirilir.
