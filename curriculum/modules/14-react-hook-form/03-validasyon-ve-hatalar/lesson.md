---
title: "Kurallar, hata mesajı ve erişilebilir alan"
minutes: 15
kind: concept
---

# Kurallar, hata mesajı ve erişilebilir alan

Bir seçki başlığını boş kaydedersen sonraki ekranda başlıksız bir liste görünür. Bunu önlemek için gönderilecek değeri kurallarla kontrol ederiz; bu kontrole **validation** denir. RHF'de kurallar alanın `register` çağrısına eklenir. İlk örnekte yalnızca başlığın boş olmamasını isteyelim.

## İlk kural: boş başlığı durdur

```tsx check
import { useForm } from 'react-hook-form'

type SelectionValues = { title: string }

export function RequiredTitle({ onSave }: { onSave: (values: SelectionValues) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<SelectionValues>({
    defaultValues: { title: '' },
  })
  return <form onSubmit={handleSubmit(onSave)}>
    <label htmlFor="required-title">Seçki başlığı</label>
    <input id="required-title" {...register('title', { required: 'Başlık gerekli' })} />
    {errors.title && <p>{errors.title.message}</p>}
    <button type="submit">Kaydet</button>
  </form>
}
```

Burada `required`, başlık boşken geçerli gönderime izin vermez. RHF alan hatalarını `formState.errors` nesnesinde alan adına göre tutar; `errors.title.message` kullanıcıya göstermek istediğimiz metindir. Hata oluştuğunda geçerli callback `onSave` çağrılmaz. Mesajı ekranda göstermek ise bizim işimizdir; yalnızca kural eklemek kullanıcıya ne olduğunu anlatmaz.

Şimdi başlığın yalnızca boş olmamasını değil, en az üç karakter olmasını isteyelim. Bu örnekte ikinci kural `minLength`:

```tsx
<input
  id="required-title"
  {...register('title', {
    required: 'Başlık gerekli',
    minLength: { value: 3, message: 'Başlık en az 3 karakter olmalı' },
  })}
/>
```

`required` boş değeri yakalar; `minLength` girilmiş kısa metni yakalar. Kuralların ayrı mesajları olduğu için kullanıcı boş başlık ile kısa başlığın farkını anlayabilir. Yalnız `minLength` yazmak, boş değerin yasak olduğu anlamına gelmez; boş bırakılabilen alanlarda bu kuralı tek başına kullanmak doğrudur.

## Kısa denemeden kayda kadar

Varsayılan davranışta kontrol gönderim sırasında yapılır. Değerleri ve sonucu sırayla izleyelim:

| Sıra | Kullanıcı olayı | Kural sonucu | Ekran ve callback |
|---|---|---|---|
| 1 | Alan boşken `Kaydet` | `required` geçmez | “Başlık gerekli”; `onSave` çalışmaz |
| 2 | `AB` yazıp gönderir | `required` geçer, `minLength` geçmez | “Başlık en az 3 karakter olmalı”; `onSave` çalışmaz |
| 3 | `Akşam` yazıp gönderir | İki kural da geçer | Hata yok; `onSave({ title: 'Akşam' })` çalışır |

Tabloda her deneme aynı kayıtlı alanı kontrol eder; geçersiz denemeler callback'e veri göndermez. Bu ayrım, hata mesajının yalnız görsel bir not olmadığını gösterir: yanlış verinin kaydedilmesini de durdurur.

## İsteğe bağlı açıklamaya üst sınır ekle

Bir seçki açıklaması boş kalabilir ama çok uzunsa kabul edilmesin. `maxLength`, girilen metnin üst sınırını belirler:

```tsx
<textarea
  aria-label="Açıklama"
  {...register('description', {
    maxLength: { value: 120, message: 'Açıklama en çok 120 karakter' },
  })}
/>
{errors.description && <p>{errors.description.message}</p>}
```

Bu alan için `required` kuralı yazmadık. Dolayısıyla boş açıklama geçerlidir; 120 karakter de geçerlidir, 121 karakter ise sınırı aşar. Her alanın iş ihtiyacına göre kural seç: opsiyonel metne zorunluluk eklemek kullanıcıyı gereksiz yere durdurur.

## Hata mesajını input'a bağla

Bir hata görünür olsa da ekran okuyucu kullanan kişi hangi alanın geçersiz olduğunu ve hangi mesajı okuması gerektiğini bilmelidir. `aria-invalid`, input'un geçersiz olduğunu belirtir. `aria-describedby`, input'u açıklayan metnin `id` değerine bağlar. `role="alert"` yeni hata mesajının yardımcı teknolojiye duyurulmasını sağlar.

Şimdi başlık hatasının hem kullanıcıya görünmesini hem input'la ilişkili olmasını tamamlayalım:

```tsx
const titleError = errors.title

<input
  id="selection-title"
  aria-invalid={titleError ? true : undefined}
  aria-describedby={titleError ? 'selection-title-error' : undefined}
  {...register('title', { required: 'Başlık gerekli' })}
/>
{titleError && (
  <p id="selection-title-error" role="alert">
    {titleError.message}
  </p>
)}
```

Hata varken input geçersizliğini bildirir ve `selection-title-error` mesajına bağlanır. Hata yokken bu iki ilişkiyi eklemeyiz; görünmeyen bir mesaja bağlantı bırakmayız. `label` ise input'un adını verir; hata bağlantısı etiketin yerini tutmaz.

Bir alanın yanlış bağlanması gerçek ve sık görülen bir hatadır. Belirti, hata metninin görünmesine rağmen input'un yanında veya ekran okuyucuda ilgili alanla ilişkisiz duyulmasıdır. Neden, `aria-describedby` değerinin hata metninin `id` değeriyle aynı olmamasıdır. İki değeri eşleştir ve `aria-invalid` bilgisini yalnız hata varken ver.

## Hata nesnesinden metni seç

Şu kullanımda ekrana metin yerine `[object Object]` basılabilir:

```tsx
{errors.title && <p>{errors.title}</p>}
```

`errors.title`, yalnızca mesaj metni değil; alanın hata bilgisini taşıyan bir nesnedir. Kullanıcıya göstermek için `.message` alanını oku. Ayrıca kendi mesajını kurala yaz; `required: true` gibi mesajı olmayan bir kural, arayüzde ne söyleyeceğini belirlemez.

Tarayıcının yerleşik form kontrolü ile RHF mesajları aynı anda görünüyorsa iki farklı uyarı kullanıcıyı şaşırtabilir. Formun hata metinlerini RHF üzerinden göstermek istediğinde HTML formuna `noValidate` ekleyebilirsin; o durumda gerekli kuralların RHF'de tanımlı olduğundan emin ol. Client-side validation hızlı geri bildirim sağlar, fakat sunucuya ulaşan veriyi de sunucu doğrulamalıdır.

:::info[Derinlemesine (isteğe bağlı)]
İki alan arasındaki kuralı, örneğin bitiş tarihi başlangıçtan önce olamaz koşulunu, `validate` ile kurabilirsin. Sayı girdisinde `valueAsNumber` veya `setValueAs` ile dönüşüm de yapılabilir; boş değerin nasıl temsil edileceğini ayrıca kararlaştırman gerekir. Birçok alanın ilişkili kuralları olduğunda sonraki Zod modülünde şema üzerinden doğrulamayı göreceksin.
:::

## Özet

- Validation, submit edilecek değerin kuralları karşılayıp karşılamadığını kontrol eder.
- `required`, `minLength` ve `maxLength` kuralları `register` yanında tanımlanır; mesajı da sen verirsin.
- Hatalar `formState.errors` içindedir; `errors.field.message` kullanıcıya gösterilecek metindir.
- Input'u `aria-invalid` ile işaretle, hata mesajına `aria-describedby` ile bağla ve mesajı `role="alert"` ile duyur.
- Hatalı submit `onSave` callback'ini çağırmaz; sunucu yine kendi doğrulamasını yapmalıdır.

**Yeni terimler:**

- **Validation:** Bir değerin tanımlı kurallara uyup uymadığını kontrol etme.
- **`aria-invalid`:** Input'un geçersiz durumda olduğunu yardımcı teknolojiye bildiren nitelik.
- **`aria-describedby`:** Input'u açıklayıcı metnin kimliğine bağlayan nitelik.
- **`role="alert"`:** Yeni mesajı yardımcı teknolojiye duyuran rol.

**Kendini yokla:** `maxLength` olan opsiyonel açıklama boşken geçerli mi? Evet; zorunlu olmadığını ayrıca söyleyen `required` kuralı yok. `errors.title` yerine neden `.message` gösterirsin? Çünkü `errors.title` hata bilgisini taşıyan nesne, `.message` ise metindir.
