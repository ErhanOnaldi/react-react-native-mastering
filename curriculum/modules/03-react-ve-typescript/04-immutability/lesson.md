---
title: "State'i yeni dizi ve nesnelerle güncelle"
minutes: 18
kind: concept
---

# State'i yeni dizi ve nesnelerle güncelle

JavaScript'te bir diziye `map` uyguladığında yeni bir dizi elde edersin. State'teki bir listeyi güncellerken de eski değeri koruyup yenisini üretmek gerekir. **Mutasyon**, var olan bir dizi veya nesnenin içeriğini yerinde değiştirmektir; bu, React'in tuttuğu eski state'i de fark etmeden değiştirebilir.

## Yeni bir dizi üretmek ne demek?

Film adlarını tuttuğunu düşün. `push` mevcut diziyi değiştirir; spread (`...`) ise elemanları yeni bir diziye kopyalar. İlk küçük örnekte yalnızca JavaScript dizisine bakıyoruz:

```ts check
const titles = ['Matrix']
titles.push('Arrival')
const nextTitles = [...titles, 'Dövüş Kulübü']

console.log(titles)     // ['Matrix', 'Arrival']
console.log(nextTitles) // ['Matrix', 'Arrival', 'Dövüş Kulübü']
```

`push` sonrası `titles` artık değişmiştir; `nextTitles` ise ayrı bir dizidir. React önceki ve yeni nesne state'lerini `Object.is` ile karşılaştırır. Nesnelerde bu karşılaştırma aynı referansı mı gösterdiklerine bakar; listenin içindeki her alanı taramaz. Aynı diziyi yerinde değiştirip geri verirsen React değişikliği atlayabilir, ayrıca eski state'i de değiştirmiş olursun.

![Eski state'i mutasyona uğratmak ile değişen yolu yeni referanslarla üretmenin farkı](diagrams/referans-yolu.svg "Değişen referans yolu")

Bir dizinin **referansı**, bellekteki o diziye ulaşmak için kullanılan kimlik gibidir. İki değişken aynı diziye bakıyorsa birinden yapılan yerinde değişiklik ötekinden bakıldığında da görünür. `useState`'ten aldığın ve `setTitles` gibi adlandırdığın state güncelleme fonksiyonuna setter denir. Şimdi bu fonksiyona yeni diziyi verelim:

```tsx check
import { useState } from 'react'

function Watchlist() {
  const [titles, setTitles] = useState(['Matrix'])

  function addMovie(title: string) {
    setTitles((current) => [...current, title])
  }

  return <button onClick={() => addMovie('Arrival')}>Listede {titles.length} film</button>
}

const shelf = <Watchlist />
void shelf
```

Buradaki `current`, güncelleme sırası geldiğinde React'in en güncel state değeridir. **Updater**, setter'a verdiğin ve önceki değerden yeni değeri hesaplayan fonksiyondur. Updater içinde `current.push(title)` yazmak da mutasyon olur; fonksiyon biçimini seçmek eski diziyi değiştirme izni vermez. Spread eski elemanları okur, yeni diziyi döndürür.

Silmek için `filter` yeni bir dizi üretip yalnızca koşulu sağlayan elemanları alır. Ters çevirmek için dikkat et: `reverse` mevcut diziyi yerinde değiştirir. Önce kopya alırsan kaynak sıra korunur:

```ts check
const titles = ['Matrix', 'Arrival']
const withoutArrival = titles.filter((title) => title !== 'Arrival')
const reversedTitles = [...titles].reverse()

console.log(titles)         // ['Matrix', 'Arrival']
console.log(withoutArrival) // ['Matrix']
console.log(reversedTitles) // ['Arrival', 'Matrix']
```

`filter` başlığı çıkarılmış yeni dizi verir; `reverse` ise kopyaladığımız diziyi değiştirir, `titles` aynı sırada kalır. Bu yüzden bir filmi listeden çıkarırken `filter`, yalnız görünümü ters çevirmek için `[...titles].reverse()` uygundur.

## Listedeki tek filmi değiştirmek

Yeni dış dizi üretmek yetmeyebilir. Her film nesnesi dizinin içindedir; `map` dış diziyi yeniler ama döndürdüğün film nesnelerini kendiliğinden kopyalamaz. Sinema'da izleme listenin bir filmine puan notu eklediğini düşünelim:

```ts check
type Movie = { id: number; title: string; note: string }

function setMovieNote(movies: Movie[], targetId: number, note: string): Movie[] {
  return movies.map((movie) =>
    movie.id === targetId ? { ...movie, note } : movie,
  )
}

const movies = [
  { id: 1, title: 'Matrix', note: '' },
  { id: 2, title: 'Arrival', note: '' },
]
const updated = setMovieNote(movies, 2, 'Tekrar izlerim')
void updated
```

`map` yeni bir dizi oluşturur. Yalnız id'si eşleşen film için `{ ...movie, note }` yeni nesne üretir; diğer film olduğu gibi kalır. Böylece hem eski dizi hem de eski Arrival nesnesi korunur. Spread, `title` ve `id` gibi değiştirmediğin alanları da yeni nesneye taşır.

Bu ayrımı görmek için kırık biçime bakalım:

```tsx
function changeNote(targetId: number, note: string) {
  movies.map((movie) => {
    if (movie.id === targetId) movie.note = note
    return movie
  })
}
```

Bu kod yeni bir dış dizi oluştursa bile eşleşen `movie` nesnesini yerinde değiştirir ve aynı nesneyi geri verir. Belirti, eski state'i saklayan başka bir yerde filmin notunun da değişmiş görünmesi veya React'in beklediğin güncellemeyi göstermemesidir. Çözüm, değişen film için `{ ...movie, note }` ile yeni nesne döndürmektir.

## Birden fazla güncelleme sıraya girdiğinde

Event handler çalışırken o render'ın state değerini görür. Aynı etkileşimde birden fazla artışı biriktirmek istiyorsan updater biçimi her hesaplamayı sıradaki son değerden yapar. Örneği oy sayısı yerine fragman görüntülenme sayacıyla izleyelim:

```tsx check
import { useState } from 'react'

function TrailerViews() {
  const [views, setViews] = useState(4)
  function replayTwice() {
    setViews((current) => current + 1)
    setViews((current) => current + 1)
  }
  return <button onClick={replayTwice}>İzlenme: {views}</button>
}

const counter = <TrailerViews />
void counter
```

İki updater da sıraya girer; ilki 4'ü 5 yapar, ikincisi sıradaki 5'i 6 yapar. Handler içindeki `views` değişkeni kendiliğinden 6 olmaz: o, handler'ın başladığı render'dan gelen değerdir. State güncellemelerinin zamanlaması önceki dersten tanıdık; burada önemli olan updater'ın güncel değeri alıp her adımda yeni sayı üretmesidir.

| Adım | Çalışan işlem | İşlemin gördüğü değer | Sonraki state |
| --- | --- | ---: | ---: |
| Başlangıç | Ekrandaki değer | — | 4 |
| Tıklama | İlk updater | 4 | 5 |
| Tıklama | İkinci updater | 5 | 6 |
| Render | Yeni state ekrana gelir | — | 6 |

Nesne veya dizi güncellemesinde de updater aynı nedenle yararlıdır: aynı etkileşimde sıraya giren değişiklikler son state üzerinden hesaplanır. Ama içerik için yeni dizi/nesne üretme kuralı değişmez.

## İç içe nesnede kopya nereye kadar gider?

Bir filmin `display` ayarındaki altyazı dilini değiştirelim. Değişen alana ulaşan her üst nesne yeni olmalıdır:

```ts check
type MovieSettings = { display: { subtitle: string }; title: string }

function withSubtitle(movie: MovieSettings, subtitle: string): MovieSettings {
  return {
    ...movie,
    display: { ...movie.display, subtitle },
  }
}

const movie = { title: 'Arrival', display: { subtitle: 'Türkçe' } }
const nextMovie = withSubtitle(movie, 'English')
void nextMovie
```

`nextMovie` yeni bir nesnedir; içindeki `display` de yenidir. Sadece dış nesneyi kopyalayıp `nextMovie.display.subtitle = ...` deseydin, `display` eski nesneyle ortak kaldığı için eski `movie` de değişirdi. Değişmeyen alanlar için kopya gerekmez; yalnız değişen değere giden yolu yenilersin.

:::mistake[Eski diziyi yerinde değiştirmek]
Belirti → Yeni öğe görünmüyor ya da listeyi kullanan başka bir görünüm beklenmedik biçimde değişiyor.  
Neden → `push` aynı diziyi değiştirdi; setter'a da aynı referans verildi.  
Düzeltme → `setItems(current => [...current, item])` ile yeni dizi döndür.
:::

:::mistake[Yeni dizi içinde eski filmi değiştirmek]
Belirti → Tek film güncellenince önceki state'i tutan kodda da yeni alan görünüyor.  
Neden → `map` yeni dış dizi üretti ama eşleşen iç nesne aynı kaldı.  
Düzeltme → Değişen filmde `{ ...movie, alan: yeniDeger }` döndür.
:::

## Özet

- State'teki dizi ve nesneleri yerinde değiştirmek yerine yeni değer üret.
- `map` yeni bir dizi verir; içindeki değişen nesneyi ayrıca kopyalaman gerekir.
- İç içe nesnede değişen alana giden her üst katmanı da kopyala.
- Birden fazla güncelleme birikiyorsa updater, sıradaki son state'ten hesap yapar.

**Yeni terimler:** Mutasyon, var olan dizi veya nesnenin içeriğini yerinde değiştirmektir; referans, bir nesnenin bellekteki kimliğine ulaşmanı sağlayan değerdir; setter, state'i güncellemek için `useState`'in verdiği fonksiyondur; `Object.is`, iki değerin aynı değer veya nesnelerde aynı referans olup olmadığını karşılaştırır; updater, önceki state'i alıp yeni state'i hesaplayan fonksiyondur.

**Kendini yokla:** `[...movies]` yeni dizi üretir; içindeki bir `movie.title` alanını doğrudan değiştirirsen eski state korunur mu?  
*Cevap:* Hayır. Yeni dizi eski film nesnesini paylaşabilir; alanı değiştirmek nesnenin kendisini mutasyona uğratır.

**Kendini yokla:** İki artışın da sırayla birikmesi için setter'a ne verirsin?  
*Cevap:* `current => current + 1` gibi updater; her hesaplama sıradaki güncel değeri alır.
