---
title: "Controlled form her tuşta ne yapar?"
minutes: 13
kind: concept
---

# Controlled form her tuşta ne yapar?

React'te state kullandığın bir input'ta `value` değerini state'ten verir, `onChange` ile kullanıcının yeni yazısını state'e aktarırsın. Bu tür input'a **controlled input** denir: ekranda görünen değerin kaynağı React state'idir. Önce tek alanla bu bağı kuralım.

## Bir alanın değerini React'e bağla

Sinema'daki bir gösterim için kısa bir başlık yazdığını düşün. Bu ilk örnekte sadece metin alanı ve state var:

```tsx check
import { useState } from 'react'

export function ScreeningTitle() {
  const [title, setTitle] = useState('')
  return <input aria-label="Gösterim başlığı" value={title} onChange={(event) => setTitle(event.target.value)} />
}
```

Input'a `A` yazınca `onChange` yeni metni `setTitle`'a verir. State değiştiği için React bileşeni yeniden çalıştırır; buna **render** denir. Yeni render `value="A"` üretir ve input'ta yazdığın harf kalır. `value` ve `onChange` birlikte bu döngüyü kurar.

![Her render'ın kendi state fotoğrafını gösteren diyagram](diagram:state-snapshot)

`value` tek başına yeterli değildir. Değer sabit kalırsa kullanıcı yazarken React aynı eski değeri tekrar verir. Şimdi aynı formun başlığına bir not alanı ekleyelim:

```tsx
const [title, setTitle] = useState('')
const [note, setNote] = useState('')

return (
  <>
    <input aria-label="Gösterim başlığı" value={title} onChange={(event) => setTitle(event.target.value)} />
    <textarea aria-label="Gösterim notu" value={note} onChange={(event) => setNote(event.target.value)} />
  </>
)
```

Başlığa yazınca yalnız `title` değişir; `note` state'i kendi değerini korur. İki alan aynı bileşende olduğu için bileşen yeniden çalışır, ama bu diğer alanın silindiği anlamına gelmez. State değişkenlerinin sayısı da render sayısını çarpmaz: bu olayda bir setter çağrısı yaptın.

Render, bileşenin arayüzü yeniden hesaplamasıdır; tarayıcıdaki bütün input'ların silinip yeniden yaratılması değildir. React mevcut arayüzle yeni sonucu karşılaştırır ve gerekli DOM değişikliğini uygular. Bu yüzden aynı formdaki not alanı değerini korurken başlık alanı yeni metni gösterebilir.

![Tetikleme, render, commit ve effect sırasını gösteren diyagram](diagram:render-commit)

Effect adımı bu modülde değil, sonraki Hook derslerinde ele alınır.

## Submit'te alanları bir araya getir

İki alanlı formda submit callback'i, o render'daki güncel state değerlerini tek nesnede alabilir. Form gönderiminde tarayıcının sayfayı yenilemesini `preventDefault()` ile durduruyoruz:

```tsx
type ScreeningDraft = { title: string; note: string }

function ScreeningForm({ onSave }: { onSave: (draft: ScreeningDraft) => void }) {
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')

  return <form onSubmit={(event) => {
    event.preventDefault()
    onSave({ title, note })
  }}>
    <input aria-label="Gösterim başlığı" value={title} onChange={(event) => setTitle(event.target.value)} />
    <textarea aria-label="Gösterim notu" value={note} onChange={(event) => setNote(event.target.value)} />
    <button type="submit">Kaydet</button>
  </form>
}
```

Örneğin başlığa `Gece gösterimi`, nota `Yönetmen söyleşisi` yazıp kaydedersen callback bu iki güncel değeri birlikte alır. Her alan için state, `value`, `onChange` ve submit nesnesinde bir karşılık kurduk. İki alanda bu tekrar kolay izleniyor; sekiz alanda aynı dört bağlantıyı ayrı ayrı tutmak ve yeni alan eklerken hepsini eşlemek daha çok el işi demek.

Submit'in ne zaman hangi değeri gördüğünü küçük bir iz tablosunda takip edelim:

| Sıra | Olay | `title` state'i | Callback |
|---|---|---|---|
| 1 | Form ilk açılır | `''` | Henüz çağrılmaz |
| 2 | Kullanıcı `Gece` yazar | `'Gece'` | Henüz çağrılmaz |
| 3 | Kullanıcı `Kaydet`'e basar | `'Gece'` | `{ title: 'Gece', note: ... }` alır |

Submit handler, `title` değişkenini son render'dan okur. Bir karakteri doğrudan callback'e göndermiyoruz; önce state'i güncelliyoruz, sonra form gönderilince alanları topluyoruz.

Kaydetmeden önce basit kuralları kendin de kontrol edebilirsin. Örneğin gösterim başlığı boş kalmamalı ve en az üç karakter olmalıysa submit handler'da kontrol edip sorun varsa callback'ten önce çık:

```tsx
function save(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()
  const cleanTitle = title.trim()
  if (!cleanTitle) {
    setMessage('Gösterim başlığı gerekli')
    return
  }
  if (cleanTitle.length < 3) {
    setMessage('Başlık en az 3 karakter olmalı')
    return
  }
  setMessage('')
  onSave({ title: cleanTitle, note })
}
```

İlk başarısız koşulda `return` çalıştığı için `onSave` çağrılmaz; iki koşul da geçince değerler gönderilir. `trim()` başındaki ve sonundaki boşlukları yok sayar. Bu elle yazılmış yaklaşım küçük formlarda anlaşılırdır; birden çok alanda aynı kontrolleri sürdürmek zorlaşınca sonraki derslerde form kütüphanesi bu işi üstlenir.

## Metin, sayı ve checkbox aynı türde değil

Bir etkinliğin yaş sınırı `input type="number"` ile yazdırılsa da tarayıcıdaki `event.target.value` metindir. Kullanıcı alanı boş bırakabileceğinden veya yazarken geçici bir metin girebileceğinden, controlled formda değeri önce string tutup kaydetme anında dönüştürmek genellikle daha kolaydır. `Number('')` sonucu `0` olduğu için boşluğu dönüştürmeden önce ayrıca ele al.

Checkbox farklıdır: `value` yerine `checked` boolean değerini state'e bağlarsın. Kullanıcı kutuyu işaretleyince `event.target.checked` sana `true` ya da `false` verir. Metin input'undaki `event.target.value` ile checkbox'ın `checked` değerini karıştırma; biri metin, diğeri açık/kapalı bilgisidir.

## Yazı input'ta kaybolursa

Gerçek bir başlangıç hatası, `value` verip değişim handler'ını unutmak:

```tsx
function FrozenTitle() {
  return <input aria-label="Gösterim başlığı" value="Gece gösterimi" />
}
```

Bu input yazılamaz; her render'da aynı başlık geri verilir. Kullanıcı yazabilsin istiyorsan değerin değişmesine izin ver:

```tsx check
import { useState } from 'react'

export function EditableTitle() {
  const [title, setTitle] = useState('Gece gösterimi')
  return <input aria-label="Gösterim başlığı" value={title} onChange={(event) => setTitle(event.target.value)} />
}
```

Şimdi yazdığın harf state'e gider ve bir sonraki render'ın `value` değeri olur. Belirti “harf yazıyorum ama input eski metne dönüyor” ise önce `onChange`'in doğru state'i güncelleyip güncellemediğine bak.

Controlled yaklaşımın güçlü yanı, input'un anlık değerini React kodunda kullanabilmendir; örneğin yazarken başlık önizlemesi gösterebilirsin. Bedeli ise her alanın state bağlantısını ve submit'teki eşleşmesini kendin sürdürmendir. Alan sayısı ve ortak davranışlar arttığında bir form kütüphanesi bu tekrarı azaltabilir; küçük tek alanlı aramada `useState` gayet yeterlidir.

## Özet

- Controlled input'un görünen değerini React state'i belirler; `onChange` yeni değeri state'e taşır.
- State değişince bileşen yeniden çalışır (**render**); diğer state alanları korunur.
- Submit'te güncel state değerlerini bir nesnede birleştirebilirsin.
- Metin alanı string, checkbox ise `checked` üzerinden boolean verir.

**Yeni terimler:**

- **Controlled input:** Değeri React state'inden gelen ve değişimi handler ile state'e yazılan input.
- **Render:** State değişikliğinden sonra React bileşen fonksiyonunun yeniden çalışması.

**Kendini yokla:** `value` var ama `onChange` yoksa neden yazamazsın? React her render'da aynı değeri input'a verir. İki state alanın varsa birinin değişmesi diğerini siler mi? Hayır; değişmeyen state korunur.
