---
title: "React event'leri ve TypeScript"
minutes: 15
kind: concept
---

# React event'leri ve TypeScript

:::pain[Enter'a basınca sayfa yenileniyor]
Bilet arama formunda metni yazıp Enter'a basıyorsun. Tarayıcı sayfayı yeniliyor; React state'i sıfırlanıyor ve arama sonucu kayboluyor. Input değişiminde neyi okuyacağını bilmek ve formun tarayıcı varsayılanını doğru yerde durdurmak, event'in hangi elementten geldiğini anlamayı gerektiriyor.
:::

## Event nesnesi nereden gelir?

React elementine verdiğin `onClick`, `onChange` veya `onSubmit` fonksiyonu kullanıcı olayı gerçekleşince çağrılır. Handler parametresi, olayı ve olayın bağlandığı elementin tipini taşır. TypeScript bu ilişkiyi event tipleriyle anlatır; doğru tip, `currentTarget` üzerinden elemente özgü özellikleri kullanmanı sağlar.

Event handler içindeki kod, render hesabının parçası değildir; React onu kullanıcı eylemi geldiğinde çağırır. Örneğin input'tan yeni string'i okumak ve parent'a vermek handler sorumluluğudur. Parent state'i güncellediğinde yeni render oluşur. Böylece render saf kalır, event tek bir eyleme bağlanır ve TypeScript event kaynağının sunduğu alanları korur.

Bu akış için beş kesin kuralı akılda tut:

1. **Handler'ı doğru elemana bağla.** Form gönderimi `<form onSubmit={...}>` üzerinde karşılanır; yalnız submit düğmesinin click olayına bağlamak Enter yolunu yakalamaz.
2. **Event tipini kaynağa göre seç.** Input değişiminde `ChangeEvent<HTMLInputElement>`, form submit'inde `FormEvent<HTMLFormElement>` kullan. `MouseEvent<HTMLButtonElement>` başka bir olay ve element türüdür.
3. **`currentTarget` handler'ın bağlı olduğu elementtir.** Input için `event.currentTarget.value` string'dir. `target` olayı başlatan iç içe bir element olabilir; tipi daha genel olduğundan elemente özgü alana doğrudan erişim her zaman güvenli değildir.
4. **Tarayıcı varsayılanını yalnız gerektiğinde iptal et.** Form gönderimi sayfa navigasyonu başlatacaksa `event.preventDefault()` çağır. Link navigasyonu veya düğme davranışı gerçekten gerekiyorsa gelişigüzel iptal etme.
5. **Bileşen sınırında event'i sade veriye çevir.** Alt bileşen input event nesnesini değil, çoğu zaman `onChange(value: string)` gibi anlamlı değeri üst bileşene aktarır. Böylece callback tarayıcı ayrıntısından bağımsız kalır.

Bu kurallar React event'inin DOM'dan farklı bir nesne modeli olduğunu anlatmak için değil, günlük kodda doğru tipi ve doğru varsayılan davranışı seçmek içindir. React'in event prop'ları camelCase yazılır (`onChange`); callback'i sen tanımlarsın, React uygun kullanıcı olayında çağırır.

![Input event'inin değer olarak parent state'ine dönmesi ve yeni render oluşturması](diagrams/event-akisi.svg "Event'ten sonraki render'a")

## Input değişimini izleyelim

Bir filtre alanı `value` prop'unu parent'tan alıyorsa kontrollü input'tur. Kullanıcı harf yazdığında handler event'ten yeni string'i çıkarıp callback'e iletir. Parent state'i günceller; sonraki render yeni `value` değerini input'a geri verir.

```tsx check
import type { ChangeEvent } from 'react'

type FilterFieldProps = {
  value: string
  onValueChange: (value: string) => void
}

function FilterField({ value, onValueChange }: FilterFieldProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onValueChange(event.currentTarget.value)
  }
  return <input aria-label="Yayınevi filtresi" value={value} onChange={handleChange} />
}

const field = <FilterField value="Ada" onValueChange={(next) => void next} />
void field
```

Zaman sırasıyla bakalım. Render `value="Ada"` üretir. Kullanıcı “m” tuşuna basar; React `handleChange` fonksiyonunu event ile çağırır. `currentTarget.value` artık “Adam” olabilir; callback “Adam” değerini parent'a iletir. Parent state'i günceller, render tekrar olur ve `value="Adam"` olarak input'a yazılır. Callback içinde değer parent'a ulaşmış olsa da bu render'ın `value` değişkeni kendiliğinden değişmez.

`currentTarget` olay handler'ının bağlı olduğu input'tur. Olay hedefi olan `target`, bir input'un altındaki başka node veya genel EventTarget olarak görülebilir. TypeScript'te `currentTarget` tipi seçilen React event türüyle eşleşir; `event.currentTarget.value` bu yüzden daha doğru ve güvenli yoldur.

## Form submit'ini satır satır izle

HTML formu Enter veya submit düğmesiyle gönderilebilir. Tarayıcının varsayılan davranışı form verisini gönderip sayfayı yenilemek olabilir. Client-side arama yapıyorsan bu tarayıcı davranışını önleyip arama işlemini callback'e verirsin:

```tsx check
import type { FormEvent } from 'react'
import { useState } from 'react'

type FilterFormProps = { onApply: (query: string) => void }

function FilterForm({ onApply }: FilterFormProps) {
  const [query, setQuery] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanQuery = query.trim()
    if (cleanQuery !== '') onApply(cleanQuery)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Yayınevi ara
        <input value={query} onChange={(event) => setQuery(event.currentTarget.value)} />
      </label>
      <button type="submit">Uygula</button>
    </form>
  )
}

const form = <FilterForm onApply={(query) => void query} />
void form
```

Gönderimde önce tarayıcı navigasyonunu durduruyoruz. `trim()` iki uçtaki boşlukları siler; yalnız boşluklardan oluşan değer boş kabul edilir. Callback yalnız anlamlı sorguda çalışır. Düğmenin `type="submit"` değeri form gönderimini açık yapar; form içindeki diğer eylem düğmelerini submit olmaması için `type="button"` olarak tanımla.

Bu kodda `FormEvent<HTMLFormElement>` submit event'inin form üzerinde işlendiğini söyler. `ChangeEvent<HTMLInputElement>` ise input'un değerini okumaya izin verir. İki event aynı handler içinde kullanılsa bile tiplerini tek bir genel `Event`'e indirgemek gerekmez.

Handler'ı inline yazmak kısa olduğunda event türü JSX prop'undan çıkarılabilir: `onChange={(event) => setQuery(event.currentTarget.value)}`. Ayrı fonksiyon daha uzun iş yapıyorsa veya tekrar kullanılacaksa parametre tipini imzada belirtmek niyeti görünür kılar. İki stili de TypeScript denetler. Genel `Event` kullanınca `currentTarget` özellikleri daha belirsizleşir; her satırda cast yazmak bu belirsizliği ortadan kaldırmaz, yalnızca TypeScript'in uyarısını bastırır.

`preventDefault()` ile event akışını iptal etmek aynı şey değildir. `stopPropagation()` olayı üst elementlere ulaşmadan durdurur; sayfa yenilenmesi gibi varsayılan davranışı iptal etmez. Formda çoğu zaman üstteki handler'ın çalışması sorun değildir; ihtiyacın yalnız browser navigasyonunu durdurmaktır. Düğme türünü doğru seçmek de aynı derecede önemlidir: form dışındaki button varsayılan olarak submit değildir, form içinde type verilmemiş button submit davranışı gösterebilir. Bu nedenle eylem düğmesini `type="button"`, form gönderme düğmesini `type="submit"` diye açıkla.

Değişim event'i input her değiştiğinde gelir; form submit'i ise kullanıcı gönderme kararı verdiğinde gelir. Her karakterde arama yapman gerekiyorsa input callback'i, Enter veya düğmeyle arama yapmak gerekiyorsa form submit'i doğal tetik noktasıdır. Bu iki kullanıcı akışını karıştırma: ikisi de string üretir ama eylem sıklığı ve boş sorgu kararı farklıdır. Bir form daha sonra gerçek navigasyonla gönderilecekse `preventDefault()` kullanmamak doğru olabilir; karar uygulamanın iş akışına bağlıdır.

## Önce kırık, sonra doğru

Aşağıdaki yaklaşım sadece düğme tıklamasını dinler:

```tsx
<form>
  <input aria-label="Yayınevi ara" />
  <button onClick={applyFilter}>Uygula</button>
</form>
```

Mouse ile düğmeye basınca işleyebilir, ama Enter ile gönderim aynı yola girmeyebilir. Ayrıca düğmenin varsayılan tipi form içinde submit olabilir; bu durumda sayfa navigasyonu tetiklenir. İşlemi form seviyesinde ele al ve submit düğmesini açıkça belirt:

```tsx
<form onSubmit={handleSubmit}>
  <input aria-label="Yayınevi ara" />
  <button type="submit">Uygula</button>
</form>
```

Bir başka kırık örnekte `onChange={(event) => onValueChange(event.target.value)}` yazılır. Standart input'ta çalışıyor gibi görünse de `target` daha geniş EventTarget türüdür; kod olayı başlatan node'a da bağlanmış olabilir. Handler'ın bağlandığı input'u `currentTarget` ile açıkça kullan.

## Sık hatalar

:::mistake[Submit yerine click dinlemek]
Belirti → Mouse ile arama çalışıyor ama Enter ile form gönderilince sonuç gelmiyor.  
Neden → Yalnız düğmenin click olayı dinleniyor; klavye form submit akışını kullanıyor.  
Düzeltme → `onSubmit` handler'ını form elementine bağla ve submit düğmesine `type="submit"` ver.
:::

:::mistake[Form yenilenmesini durdurmamak]
Belirti → Enter sonrası sayfa yenileniyor, state sıfırlanıyor.  
Neden → Tarayıcının varsayılan form submit davranışı iptal edilmedi.  
Düzeltme → Client-side form işinde submit handler'ında `preventDefault()` çağır; ardından kendi callback'ini çalıştır.
:::

:::mistake[Event tipini her yerde genel bırakmak]
Belirti → `value` erişiminde TypeScript element tipinin belirsiz olduğunu söylüyor.  
Neden → Handler'a input veya form ilişkisi verilmedi.  
Düzeltme → `ChangeEvent<HTMLInputElement>` veya `FormEvent<HTMLFormElement>` gibi kaynağa özgü tipi seç.
:::

:::mistake[Boş sorguyu anlamlı arama saymak]
Belirti → Boşluk yazıp gönderince gereksiz filtreleme veya istek başlıyor.  
Neden → Görünürde boş olmayan whitespace metni kontrol edilmedi.  
Düzeltme → Önce `trim()` uygula, ardından boş string'i ayır.
:::

:::sector
Ekiplerde form submit'ini form elementinde ele almak mouse, Enter ve erişilebilir teknolojiyle gönderimi aynı akışta toplar. Alt bileşenler de event nesnesi yerine `onValueChange(value)` gibi sade callback'ler sunarak tarayıcı olay ayrıntılarını UI sınırında bırakır. Böylece parent form state'inin sahibi olur; input bileşeni yalnız değeri gösterir ve değişikliği bildirir.
:::

## Özet

- Handler parametresinin event tipi, hem olay türünü hem bağlı elementin API'sini anlatır.
- Input değerini `ChangeEvent<HTMLInputElement>` içinden `currentTarget.value` ile oku.
- Formu `onSubmit` ile işle; client-side akışta varsayılan navigasyonu `preventDefault()` ile durdur.
- Kontrollü input değişikliği callback ile parent'a gider; boş sorgu için `trim()` sonrası karar ver.

**Kendini yokla:** Neden `onClick` yerine formun `onSubmit` olayını dinlemek daha kapsayıcıdır?  
*Cevap:* Submit hem düğme tıklamasını hem Enter gibi form gönderim yollarını yakalar.

**Kendini yokla:** `currentTarget` ile `target` arasındaki pratik fark nedir?  
*Cevap:* `currentTarget` handler'ın bağlandığı tipli elementtir; `target` olayı başlatan daha genel öğe olabilir.
