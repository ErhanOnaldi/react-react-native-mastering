---
title: "Film listesinde key ve bileşen kimliği"
minutes: 20
kind: concept
---

# Film listesinde key ve bileşen kimliği

Bir diziyi `map` ile JSX satırlarına çevirmeyi biliyorsun. React her satırın hangi film olduğunu ve sonraki render'da aynı filmin nerede bulunduğunu anlamalıdır. Bunu düşünmek için önce state'in nerede yaşadığına bakalım.

## State fonksiyon değişkeninde değil, ağaçtaki konumda yaşar

Component fonksiyonunu çağırdığında React ekrana ait bir ağaç kurar. Ağaçta bir component'in bulunduğu noktaya **konum** diyelim. React'in ekrandaki tek component gösterimine **component instance** denir; onun state'i bu konum ve kimlikle ilişkilidir, JavaScript fonksiyonunun yerel değişkeni gibi her çağrıda baştan başlamaz.

Önce aynı konumda aynı component'in kaldığı küçük bir örnek:

```tsx check
import { useState } from 'react'

function MovieNote({ title }: { title: string }) {
  const [note, setNote] = useState('')
  return <label>{title}<input value={note} onChange={(event) => setNote(event.currentTarget.value)} /></label>
}

const view = <MovieNote title="Arrival" />
void view
```

`MovieNote`'un state'i bu component'in ekrandaki konumunda saklanır. `title` prop'u farklı bir başlığa çevrilse bile, eğer React aynı tür component'i aynı konumda görmeye devam ederse note state'i de kalır. Prop değeri ile component kimliği aynı şey değildir.

![React'in liste öğelerini ve state bilgisini kararlı key ile eşleştirmesi](diagram:agac-ve-kimlik)

Bu ilişki listede karışabilir. React bir render'dan sonrakine hangi satırın aynı kaldığını bilmelidir. JSX'teki **key**, React'e kardeş satırlardan hangisinin aynı öğe olduğunu söyleyen kararlı kimliktir. İlk olarak basit bir film listesi oluşturalım:

```tsx check
const titles = ['Matrix', 'Arrival']
const rows = titles.map((title) => <li key={title}>{title}</li>)
void rows
```

Her `<li>` için key verdik. Burada başlıklar örneği kolaylaştırıyor; gerçek film listesinde aynı başlık iki kez bulunabilir. Bu yüzden verideki kalıcı `id` daha doğru kimlik olur.

## Sıra numarası neden kimlik değildir?

Şimdi her satırın kendi notunu tuttuğunu düşün. **Uncontrolled input**, input'un yazısını React state'indeki `value` prop'undan almak yerine tarayıcının kendi elementinde tuttuğu input'tur. React satırları yanlış eşlerse yazı başka filmin yanında görünebilir.

Aşağıdaki liste index, yani o anki sıra numarasını key olarak kullanıyor:

```tsx
function FilmRows({ movies }: { movies: { id: string; title: string }[] }) {
  return movies.map((movie, index) => <MovieRow key={index} movie={movie} />)
}
```

Listeye baştan yeni film eklenince sıra numaraları aynı filmlerde kalmaz. React `key=0` olan satırı önce Matrix, sonra yeni film olarak görür; eski component state'i aynı kimlik gibi görünen satırda kalabilir. Belirti, Matrix notunun yeni filmin yanında görünmesidir.

| An | Listedeki sıra | Index key'in eşleştirdiği satır | Film id'si key olsaydı |
| --- | --- | --- | --- |
| İlk render | Matrix, Arrival | `0 → Matrix`, `1 → Arrival` | `m → Matrix`, `a → Arrival` |
| Matrix notu yazılır | Matrix, Arrival | `0` notu: “yeniden izle” | `m` notu: “yeniden izle” |
| Yeni film eklenir | Dune, Matrix, Arrival | `0 → Dune`, `1 → Matrix`, `2 → Arrival` | `d → Dune`, `m → Matrix`, `a → Arrival` |
| React state'i bağlar | Dune, Matrix, Arrival | `0` state'i Dune satırında kalabilir | `m` state'i Matrix ile eşleşir |

Index key'in hatası listenin kendisinde değil, index'in değişebilir olmasındadır. Ekleme, silme veya sıralama sonrası bir film başka pozisyona geçer. Filmin `id`'si ise aynı filmde kalır.

## Key'i film verisinden ver

Bu kez React'e filmin id'sini verelim ve her satırın not state'ini küçük bir child component'te tutalım:

```tsx check
import { useState } from 'react'

type Movie = { id: number; title: string }

function MovieRow({ movie }: { movie: Movie }) {
  const [note, setNote] = useState('')
  return (
    <label>
      {movie.title}
      <input aria-label={`${movie.title} notu`} value={note} onChange={(event) => setNote(event.currentTarget.value)} />
    </label>
  )
}

function MovieNotes({ movies }: { movies: Movie[] }) {
  return <>{movies.map((movie) => <MovieRow key={movie.id} movie={movie} />)}</>
}

const notes = <MovieNotes movies={[{ id: 603, title: 'Matrix' }]} />
void notes
```

`MovieRow`'un state'i `movie.id` key'iyle eşleşir. Film sırası değişse bile aynı key aynı filmi gösterdiğinden note o filmle kalır. Key her kardeş listesinde ayırt edici ve render'lar arasında sabit olmalı. `Math.random()` gibi her render'da değişen değer, React'e her seferinde yeni satır geldiğini söyler ve input state'ini sıfırlatabilir.

`key` component'in normal prop'u değildir. `MovieRow` içinde `props.key` okuyamazsın. Component'in kendi davranışı için id gerekiyorsa örnekteki gibi `movie` prop'unu ya da ayrıca `id` prop'unu ilet; `key` yalnızca React'in eşleştirmesi içindir.

:::mistake[Index'i key olarak kullanmak]
Belirti → Liste başına film ekleyince yazdığın not başka başlığın yanında beliriyor.  
Neden → Index konumu gösterir; ekleme ile o konumdaki film değişti.  
Düzeltme → Her satırda `key={movie.id}` gibi filmle birlikte kalan bir id kullan.
:::

:::mistake[Key'i child prop'u sanmak]
Belirti → `props.key` değeri `undefined` geliyor.  
Neden → React `key` değerini kendi eşleştirme işi için kullanır; bileşene normal prop olarak iletmez.  
Düzeltme → Aynı veriyi hem `key={movie.id}` hem `movie={movie}` olarak gönder.
:::

## Özet

- Component state'i, render ağacındaki component konumu ve kimliğiyle eşleşir.
- `key`, aynı kardeş listesinde bir satırın sonraki render'da tanınmasını sağlar.
- Değişebilen listelerde index yerine film verisindeki kararlı `id`'yi kullan.
- `key` React'e aittir; child'ın prop'u değildir.

**Yeni terimler:** Component instance, component'in ekrandaki tek gösterimidir; konum, React ağacında bu gösterimin bulunduğu noktadır; key, kardeş listedeki öğeyi render'lar arasında eşleştiren kimliktir; uncontrolled input, yazı değerini React state'inden değil tarayıcı elementinden alan input'tur.

**Kendini yokla:** Listenin başına bir film eklenince `key={index}` neden riskli olur?  
*Cevap:* Aynı index artık başka filmi gösterir; React önceki component state'ini o satırda tutabilir.

**Kendini yokla:** Key'i `MovieRow` içinden okumak istiyorsan ne yapmalısın?  
*Cevap:* Id'yi ayrıca normal prop olarak gönder; `key` child'a aktarılmaz.
