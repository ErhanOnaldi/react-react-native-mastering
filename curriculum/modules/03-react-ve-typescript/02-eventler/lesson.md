---
title: "Tıklama ve form event'leri"
minutes: 15
kind: concept
---

# Tıklama ve form event'leri

Bir düğmeye `onClick` verdiğinde, daha önce yaptığın gibi, kullanıcı tıklayınca bir fonksiyon çalıştırırsın. Tıklama ve yazma gibi kullanıcı eylemlerine **event** denir; eylem gerçekleştiğinde çalışan fonksiyona **event handler** denir. JSX'e fonksiyonun kendisini verirsin: `onClick={save}`. `onClick={save()}` yazarsan fonksiyonu tıklamayı beklemeden, JSX hazırlanırken çağırırsın.

## Bir tıklamaya tepki ver

```tsx check
function TrailerButton() {
  function showTrailer() {
    console.log('Fragman açıldı')
  }
  return <button onClick={showTrailer}>Fragmanı izle</button>
}

const button = <TrailerButton />
void button
```

`onClick`, React'in kullanıcı tıklaması olduğunda çağıracağı fonksiyonu alır. `showTrailer` önce yalnızca tanımlanır; kullanıcı düğmeye basınca çalışır. Böylece render sırasında değil, doğru kullanıcı eyleminde iş yapılır.

`onClick` gibi JSX alanları **event prop**'larıdır: kullanıcı eylemine hangi fonksiyonun bağlanacağını söylerler. Her event prop'unun eylem ve element türüne göre bir event tipi vardır; React çoğu basit handler'da bu tipi imzadan çıkarabilir.

## Input'taki yeni yazıyı oku

Arama alanına yeni bir harf yazıldığında input'un `onChange` handler'ı çalışır. Handler'a gelen **event nesnesi**, olay ve olayın işlendiği element hakkında bilgi taşır. `ChangeEvent<HTMLInputElement>` bu input değişim event'inin TypeScript tipidir; handler'ın hangi elementten geldiğini belirtir. Şimdi input metnini konsola yazdıralım:

```tsx check
import type { ChangeEvent } from 'react'

function FilmSearch() {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    console.log(event.currentTarget.value)
  }
  return <input aria-label="Film ara" onChange={handleChange} />
}

const search = <FilmSearch />
void search
```

`ChangeEvent<HTMLInputElement>`, input'un değişim olayını ve olayın input üzerinde işlendiğini TypeScript'e söyler. `currentTarget`, handler'ın bağlandığı elementtir; burada input olduğu için `currentTarget.value` güncel yazıyı verir. `target` olayı başlatan öğeyi anlatır ve türü daha genel olabilir; handler'ın bağlı olduğu input'un özelliklerini okumak için `currentTarget` daha doğrudan seçimdir.

Önceki örnekte yazıyı yalnızca okuduk. Arama alanı başka bir bileşenden `value` alıyorsa değişikliği o bileşene bildirmesi gerekir. `onValueChange` bir callback prop'udur: callback, bileşenin çağırması için prop olarak verilen fonksiyondur. Input event nesnesini dışarı taşımak yerine yalnız yeni yazıyı yollar.

```tsx check
import type { ChangeEvent } from 'react'

type FilmSearchFieldProps = {
  value: string
  onValueChange: (value: string) => void
}

function FilmSearchField({ value, onValueChange }: FilmSearchFieldProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onValueChange(event.currentTarget.value)
  }
  return <input aria-label="Film ara" value={value} onChange={handleChange} />
}

const field = <FilmSearchField value="Matrix" onValueChange={(next) => void next} />
void field
```

Kullanıcı `Matrix` sonuna `!` yazdığında handler `Matrix!` değerini callback'e verir. Parent bu yeni değeri saklarsa sonraki render'da `value="Matrix!"` gelir ve input bunu gösterir. Handler içindeki event'i sade bir string'e çevirmek, üst bileşenin input'un React event tipini bilmesini gerektirmez.

![Input event'inin değer olarak parent state'ine dönmesi ve yeni render oluşturması](diagrams/event-akisi.svg "Event'ten sonraki render'a")

## Formu tek gönderim yolunda ele al

Bir arama hem düğmeyle hem Enter tuşuyla gönderilebilmeli. Bu durumda işlemi düğmenin tıklamasına değil formun `onSubmit` alanına bağla. **Varsayılan davranış**, tarayıcının kendiliğinden yapacağı iştir; formu client-side işliyorsan gönderim sonrası sayfa yenilenmesini `preventDefault()` ile durdurabilirsin.

```tsx check
import type { FormEvent } from 'react'

function ScreeningSearch() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log('Arama gönderildi')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input aria-label="Film ara" />
      <button type="submit">Ara</button>
    </form>
  )
}

const form = <ScreeningSearch />
void form
```

`FormEvent<HTMLFormElement>` handler'ın bir form gönderimini ele aldığını belirtir. `preventDefault()` bu formun tarayıcıdaki varsayılan gönderim davranışını durdurur; böylece sayfa yenilenmeden kendi React kodunu çalıştırabilirsin. Formun `onSubmit` alanı hem submit düğmesine tıklamayı hem Enter ile göndermeyi karşılar.

Birleştirelim: input'un değişiminde yazıyı state'e kaydedip, gönderimde boş olmayan temizlenmiş sorguyu kullanacağız. Buradaki **state**, React'in render'lar arasında sakladığı değerdir.

```tsx check
import { useState } from 'react'
import type { FormEvent } from 'react'

function ScreeningSearch() {
  const [query, setQuery] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanQuery = query.trim()
    if (cleanQuery !== '') console.log(`Aranıyor: ${cleanQuery}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input aria-label="Film ara" value={query} onChange={(event) => setQuery(event.currentTarget.value)} />
      <button type="submit">Ara</button>
    </form>
  )
}

const form = <ScreeningSearch />
void form
```

`trim()` baştaki ve sondaki boşlukları siler. Kullanıcı yalnız boşluk yazdıysa sonuç boş string olur ve arama başlamaz. Düğmenin `type="submit"` değeri formu gönderir; form içindeki başka bir eylem düğmesine `type="button"` vermek ise onun formu göndermesini önler.

Sıra şöyle işler: yazarken input handler'ı yeni değeri state'e yollar; Enter'a basınca form handler'ı çalışır; varsayılan yenileme durur; sorgu temizlenir ve boş değilse işlem yapılır. Değişim ve submit farklı event'lerdir: ilki her yazı değiştiğinde, ikincisi kullanıcı formu göndermeyi seçtiğinde çalışır.

## Görünen hata ve düzeltmesi

Yalnız düğmenin `onClick` alanına arama bağlarsan mouse ile arama çalışabilir, ama Enter ile gönderim aynı handler'a ulaşmayabilir. Form submit'ini `<form onSubmit={handleSubmit}>` üzerinde dinle ve düğmeye `type="submit"` ver. Böylece iki kullanıcı yolu da tek bir işlemden geçer.

:::mistake[Input değerini yanlış yerden okumak]
Belirti → TypeScript `event.target.value` satırında elementin `value` alanını bulamadığını söyler.
Neden → `target` olayı başlatan genel öğedir; input'a özgü tür garanti edilmez.
Düzeltme → `ChangeEvent<HTMLInputElement>` kullan ve bağlı input'un değerini `event.currentTarget.value` ile al.
:::

:::mistake[Formu gönderdikten sonra sayfanın yenilenmesi]
Belirti → Enter'a basınca sayfa yenilenir ve ekrandaki React durumu kaybolur.
Neden → Client-side formda tarayıcının varsayılan gönderim davranışı durdurulmamıştır.
Düzeltme → Formun `onSubmit` handler'ında `event.preventDefault()` çağır.
:::

## Aklında tut

- Event kullanıcı eylemidir; event handler o eylem gerçekleştiğinde çalışan fonksiyondur.
- Input yazısını `ChangeEvent<HTMLInputElement>` içinden `currentTarget.value` ile oku.
- Formun gönderimini `onSubmit` üzerinde ele al; client-side akışta yenilemeyi `preventDefault()` durdurur.
- Enter ve submit düğmesi aynı form gönderim yolunu kullanır; boş sorguyu temizledikten sonra ayır.

**Yeni terimler:** Event, kullanıcı eylemidir; event handler, eylem olduğunda çalışan fonksiyondur; event prop, handler'ı eyleme bağlayan JSX alanıdır; event tipi olayın ve bağlı elementin TypeScript tarifidir; varsayılan davranış, tarayıcının kendiliğinden yapacağı iştir.

**Kendini yokla:** Enter ile de çalışması gereken aramayı hangi elementte dinlersin?
*Cevap:* `<form>` üzerindeki `onSubmit` alanında.

**Kendini yokla:** `preventDefault()` client-side formda neyi önler?
*Cevap:* Tarayıcının formu gönderip sayfayı yenilemesini.
