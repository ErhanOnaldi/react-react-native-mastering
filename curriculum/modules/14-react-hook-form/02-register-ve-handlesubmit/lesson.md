---
title: "Alanı kaydet ve formu gönder"
minutes: 14
kind: concept
---

# Alanı kaydet ve formu gönder

Önceki derste her input'un değerini state'e bağladın. Bir formda aynı işi çok sayıda alan için yapmak tekrar üretir. React Hook Form (**RHF**), form alanlarını kaydedip değerleri göndermeye hazırlayan bir kütüphanedir. İlk adımda tek bir metin alanını bağlayalım.

## Bir input'u forma tanıt

Sinema'da izlenecek filmler için kısa bir seçki başlığı girdiğini düşün. `useForm` form araçlarını verir; `register` alanı RHF'ye tanıtır ve input'a gerekli bağlantıları döndürür.

```tsx check
import { useForm } from 'react-hook-form'

type SelectionValues = { title: string }

export function SelectionTitle() {
  const { register } = useForm<SelectionValues>({
    defaultValues: { title: '' },
  })
  return <input aria-label="Seçki başlığı" {...register('title')} />
}
```

Buradaki `{...register('title')}` ifadesi, `register`'ın verdiği input bağlantılarını alana yayar. Yazdığın değer artık `value` ve `onChange` ile bileşen state'ine kopyalanmak zorunda değildir. `defaultValues`, alan ilk açıldığında neyle başlayacağını açıkça söyler; bu örnekte başlık boş metindir.

`SelectionValues` türünü `useForm<SelectionValues>()` içine veriyoruz. Bu kullanımda `<SelectionValues>` bir **generic** tür argümanıdır: formun hangi alan adları ve değer türleriyle çalışacağını TypeScript'e bildirir. Böylece `register('title')` için editör doğru alan adını önerebilir. Bu bilgi derleme sırasında yardım eder; kullanıcının yazdığı metni çalışma zamanında doğrulamaz.

Kaydedilmiş bir seçkinin formda bulunmayan `id` ve `createdAt` alanları olabilir. TypeScript'in `Omit` türü, bu alanları bir modelden çıkarıp yalnız formun topladığı alanları bırakır:

```ts
type SavedSelection = { id: string; createdAt: string; title: string; description: string }
type SelectionValues = Omit<SavedSelection, 'id' | 'createdAt'>
```

Böylece form `title` ve `description` ister; sunucunun daha sonra ekleyeceği `id` ile kayıt zamanını kullanıcıdan istemezsin. `Omit` yalnızca TypeScript türünü şekillendirir; gönderilen gerçek nesneye alan eklemez veya değer kontrolü yapmaz.

## Submit callback'ine doğru veriyi ulaştır

Input'u kaydetmek tek başına callback çağırmaz. `handleSubmit(onSave)`, form gönderildiğinde kayıtlı alanları toplar ve `onSave` fonksiyonuna değer nesnesi olarak verir. Şimdi başlığın yanına bir açıklama ekleyelim:

```tsx
import { useForm } from 'react-hook-form'

type SelectionValues = { title: string; description: string }

function SelectionForm({ onSave }: { onSave: (values: SelectionValues) => void }) {
  const { register, handleSubmit } = useForm<SelectionValues>({
    defaultValues: { title: '', description: '' },
  })

  return <form onSubmit={handleSubmit(onSave)}>
    <label htmlFor="selection-title">Seçki başlığı</label>
    <input id="selection-title" {...register('title')} />
    <label htmlFor="selection-description">Açıklama</label>
    <textarea id="selection-description" {...register('description')} />
    <button type="submit">Kaydet</button>
  </form>
}
```

`title` ve `description` alanlarını ayrı ayrı kaydettik; gönderimde ikisi de aynı nesnede bulunur. Açıklama boş bırakılırsa başlangıç değeri olan `''` gönderilir. `onSave`, form gönderilene kadar çalışmaz; ağ isteği veya kayıt işini callback'in içinde sen yaparsın.

| Sıra | Ne olur? | RHF'nin topladığı değer |
|---|---|---|
| 1 | Form açılır | `{ title: '', description: '' }` |
| 2 | Başlığa `Yaz akşamı` yazılır | `{ title: 'Yaz akşamı', description: '' }` |
| 3 | Açıklamaya `Kısa filmler` yazılır | İki alanın güncel değerleri |
| 4 | `Kaydet` gönderilir | `onSave` iki alanlı nesneyi alır |

Tablodaki sıra önemli: önce input'lar forma kaydolur, kullanıcı yazar, sonra submit bu alanları toplar. `handleSubmit(onSave)` fonksiyonunu forma veriyoruz; sonuna `()` koymuyoruz. Parantez eklersen form gönderimini beklemek yerine render sırasında çağırmış olursun.

![Alanların kayıtlı olduğu form deposu, abonelikler ve submit akışı](diagram:form-state)

## Checkbox da kayıtlı bir alandır

Bir seçkinin herkese açık olup olmadığını checkbox ile tutalım. Yeni bilgi, checkbox başlangıcının boolean olması:

```tsx
type VisibilityValues = { title: string; isPublic: boolean }

function VisibilityChoice({ onSave }: { onSave: (values: VisibilityValues) => void }) {
  const { register, handleSubmit } = useForm<VisibilityValues>({
    defaultValues: { title: '', isPublic: false },
  })

  return <form onSubmit={handleSubmit(onSave)}>
    <label htmlFor="visibility-title">Seçki başlığı</label>
    <input id="visibility-title" {...register('title')} />
    <label>
      <input type="checkbox" {...register('isPublic')} />
      Herkese açık
    </label>
    <button type="submit">Kaydet</button>
  </form>
}
```

Checkbox işaretli değilken `isPublic` değeri `false`, işaretliyken `true` olur. `defaultValues` bu başlangıcı ve formun beklenen şeklinin tamamını belirler. Bir form tipi tanımladığında görünmeyen ama callback'te istenen alanları da başlangıç değerlerinde tut; form nesnesinin ne içerdiği sürpriz olmasın.

## Bağlantı eksikse submit verisinde alan da eksik kalır

Gerçek hata: ekranda yazılabilen input var ama `register` kullanılmamış.

```tsx
function UnregisteredTitle() {
  const { handleSubmit } = useForm<{ title: string }>()
  return <form onSubmit={handleSubmit((values) => console.log(values))}>
    <input aria-label="Seçki başlığı" />
    <button type="submit">Kaydet</button>
  </form>
}
```

Input'a yazı yazabilirsin, fakat RHF'ye bu alanı tanıtmadın; bu nedenle beklediğin değer submit nesnesinde olmayabilir. Alanı `register('title')` ile bağla ve adı tipteki alanla aynı tut. Belirti “input'ta metin görünüyor ama callback'te alan yok” ise önce kayıt bağlantısını kontrol et.

```tsx check
import { useForm } from 'react-hook-form'

type SelectionValues = { title: string }

export function RegisteredTitle() {
  const { register, handleSubmit } = useForm<SelectionValues>({
    defaultValues: { title: '' },
  })
  return <form onSubmit={handleSubmit((values) => console.log(values))}>
    <label htmlFor="registered-title">Seçki başlığı</label>
    <input id="registered-title" {...register('title')} />
    <button type="submit">Kaydet</button>
  </form>
}
```

İkinci bileşende input RHF'ye tanıtılmış, başlangıç değeri belirlenmiş ve form gönderimi `handleSubmit`'e bağlanmış durumda. `useForm<T>` içindeki `T` alan adlarını TypeScript'te kontrol eder; gerçek kullanıcı verisinin biçimini garanti etmez. Dış kaynaktan gelen veriyi doğrulamak ayrı bir konudur ve ileride Zod ile ele alınır.

RHF'yi burada native HTML alanlarında kullanıyoruz. Bir tasarım sistemi alanı kendi kontrollü API'sini sunuyorsa bağlantı biçimi farklı olabilir; onu daha sonra ele alacağız. Bu ilk adımda alanı doğrudan `<input>`, `<textarea>` veya `<input type="checkbox">` ile kurup değerleri submit callback'inde toplamak yeterli.

## Özet

- `useForm<T>()` RHF form araçlarını üretir; `T` alanların TypeScript şeklini belirtir.
- `register('alan')` native alanı forma bağlar; dönen bağlantıları input'a yaymalısın.
- `defaultValues` alanların başlangıç değerlerini açık eder; checkbox için boolean kullan.
- `handleSubmit(onSave)` submit'te kayıtlı değerleri toplar ve callback'e verir.

**Yeni terimler:**

- **RHF:** React Hook Form; input kayıt ve submit akışını yöneten React kütüphanesi.
- **`register`:** Native input'u RHF'ye tanıtan ve bağlantı özelliklerini döndüren fonksiyon.
- **`handleSubmit`:** Form gönderiminde kayıtlı değerleri toplayıp callback'i çağıran fonksiyon.
- **Generic tür argümanı:** `useForm<Values>` içindeki, form alanlarının TypeScript şeklini belirten tür.
- **`Omit`:** Bir TypeScript türündeki seçilen alanları çıkararak yeni tür oluşturan yardımcı tür.

**Kendini yokla:** Callback'e input event'i mi gider, alan değerleri mi? Alan değerleri gider. Checkbox başlangıçta özel olmalıysa `defaultValues` içinde ne yazarsın? `false`.
