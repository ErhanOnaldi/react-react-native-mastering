---
title: "Arama değerini ortak bileşende tut"
minutes: 17
kind: concept
---

# Arama değerini ortak bileşende tut

Basit bir input'ta `useState` ile yazılan metni saklayıp `value` ile gösterebilirsin. Arama kutusu ve film listesi aynı metne ihtiyaç duyduğunda soru şudur: bu değerin sahibi hangi component olmalı? Önce input ile başlayalım.

## Ekrandaki yazı state'ten gelir

**Controlled input**, ekranda gösterdiği değeri React state'inden alan input'tur. Her render'da `value` state'i gösterir; yazma olayı `onChange` ile yeni değeri state'e yollar.

```tsx check
import { useState } from 'react'

function FilmNote() {
  const [note, setNote] = useState('')
  return <label>Not <input value={note} onChange={(event) => setNote(event.currentTarget.value)} /></label>
}

const screen = <FilmNote />
void screen
```

İlk açılışta `note` boş metindir, bu yüzden input boştur. Kullanıcı `A` yazınca `onChange` event'inden input'un yeni metnini okur ve `setNote` ile React'e bildirir. React sonraki render'da `value` olarak yeni state'i verir. Böylece ekrandaki metnin tek sahibi bellidir.

Bir input'a yalnız `defaultValue` verirsen başlangıç metnini gösterirsin; sonraki render'larda değerin sahibi React state'i olmaz. Bu, yazının başka bir arayüzü değiştirmesi gerekmediğinde işe yarayabilir. Birlikte değişmesi gereken arayüzler için `value` ve state daha açık bir bağlantı kurar.

State'i yukarı taşırken her şeyi uygulamanın en üstüne çıkarman gerekmez. Diyelim film arama alanı ile sonuçları yalnız `CatalogSearch` kullanıyor; sorguyu bütün uygulamanın kök component'ine taşımak, bu iki parçaya kadar gereksiz prop geçişleri ekler. En yakın ortak parent hem input'u hem listeyi kapsıyorsa, state orada dursun. Parent sorgunun değerini bilir ama input'un DOM ayrıntılarını bilmek zorunda kalmaz.

## Input başka bir component'te olsa da değer dışarıdan gelebilir

`props`, bir parent component'in çocuğuna verdiği değerlerdir. Input'u ayrı bir component yaparsak, ona `value` ile `onChange` props'larını vererek aynı kontrollü davranışı koruyabiliriz. `callback`, bir component'in gerektiğinde çağırması için aldığı fonksiyondur; burada yeni yazıyı parent'a taşır.

```tsx check
function FilmSearchField({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  return <label>Film ara <input value={value} onChange={(event) => onChange(event.currentTarget.value)} /></label>
}

const field = <FilmSearchField value="Dune" onChange={(next) => console.log(next)} />
void field
```

Bu component `Dune` değerini kendi içinde değiştirmez. Kullanıcı yazınca callback'e yeni string'i verir; onu çağıran yer bu değeri nasıl saklayacağına karar verir. Event nesnesini dışarı taşımıyoruz: alan DOM event'inden string'i çıkarıp daha sade bir değer gönderiyor.

Bu sınır iki yönde de işe yarar. Parent input'un hangi HTML event'iyle yazıldığını umursamadan `onChange('Arrival')` gibi bir değer alır. Child ise parent state'inin nerede tutulduğunu bilmez; ona yalnızca göstereceği `value` ve çağıracağı fonksiyon gerekir. Aynı alanı ileride başka bir parent kullanırsa bu sözleşme değişmeden kalabilir.

## İki component aynı aramayı kullansın

Şimdi kutu ve sonuç listesi kardeş olsun. **State'i yukarı kaldırma**, iki component'in ortak kullandığı state'i ikisinin en yakın ortak parent'ına taşıma işlemidir. Böylece parent sorgunun tek sahibi olur; kutuya değeri verir, listede de aynı değerden sonuç hesaplar.

```tsx check
import { useState } from 'react'
type Film = { id: number; title: string }
const catalog: Film[] = [{ id: 1, title: 'Dune' }, { id: 2, title: 'Arrival' }, { id: 3, title: 'Amélie' }]

function FilmSearchField({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  return <label>Film ara <input value={value} onChange={(event) => onChange(event.currentTarget.value)} /></label>
}

function CatalogSearch() {
  const [query, setQuery] = useState('')
  const matches = catalog.filter((film) => film.title.toLowerCase().includes(query.toLowerCase()))
  return <><FilmSearchField value={query} onChange={setQuery} />{matches.map((film) => <p key={film.id}>{film.title}</p>)}</>
}

const search = <CatalogSearch />
void search
```

Burada `CatalogSearch` ortak parent'tır. `query` hem input'un `value` değerine gider hem `matches` hesabında kullanılır. `matches` ayrı bir state değildir; katalog ve sorgudan render sırasında türetilir. İkinci bir state açsaydık her yazımda hem sorguyu hem listeyi güncellememiz gerekecek, biri unutulursa ekranlar ayrışacaktı.

## Bir harfin yolunu izleyelim

Başlangıçta `query` boş olduğu için üç film görünür. Kullanıcı `A` yazınca akış bu sırayla ilerler:

| An | Parent'taki `query` | Input ve liste |
| --- | --- | --- |
| İlk render | `''` | Boş kutu; üç film |
| Input olayı | Hâlâ `''` olan render fotoğrafı | Olay yeni metin olarak `A` içerir |
| Callback ve setter | React'e `setQuery('A')` iletilir | Ekran henüz yeni render'ı göstermedi |
| Sonraki render | `'A'` | Input için `A`; filtre iki eşleşme hesaplar |
| DOM güncellemesi | `'A'` | `A` görünür; yalnız eşleşen filmler kalır |

Setter çağrısı o an çalışan handler içindeki `query` değişkenini anında değiştirmez. O handler, oluşturulduğu render'daki değeri görür; güncelleme sonraki render'da kullanılır. Bu yüzden input ile listenin aynı anda güncellenmesi, ikisini de aynı parent state'inden beslememizden gelir.

:::model[Props aşağı, olaylar yukarı]
Paylaşılan değerin sahibi en yakın ortak parent'tır. Değer props olarak çocuklara iner; kullanıcı etkileşimi yeni değeri callback ile parent'a bildirir. Parent state'i değişince sonraki render aynı değeri ilgili çocuklara ve hesaplara tekrar verir.
:::

![Props aşağı iner, olay callback'i yukarı çıkar](diagram:veri-akisi "Ortak ebeveynin state sahipliği")

## Sık görülen takılma

Input'a `value={query}` bağladın ama yazdığın harf hemen kayboluyor. Bunun belirtisi, kutunun önceki metne dönmesidir. Neden: `value` React'in gösterdiği kaynak ama `onChange` yeni değeri state'e göndermiyor. `onChange` içinde `setQuery(event.currentTarget.value)` çağırınca sonraki render yeni yazıyı gösterir.

Bir başka hata da sorguyu hem kutuda hem parent'ta ayrı ayrı saklamaktır. Bir süre sonra input bir metin gösterirken liste başka metne göre süzülebilir. Aynı bilgi iki yerde tutulduğu için güncellemeler yarışır; sorguyu ortak parent'ta tek kez sakla, sonuç listesini ondan hesapla.

## Özet

- Controlled input, görünen `value` değerini state'ten alır ve yazmayı `onChange` ile bildirir.
- Birden fazla component'in kullandığı state'i en yakın ortak parent'ta tut.
- Parent değeri props olarak aşağı verir; çocuk yeni değeri callback ile yukarı iletir.
- Görünür listeyi kaynak veriden ve sorgudan hesapla; ayrıca state'te kopyalama.

**Yeni terimler:**

- **Controlled input:** Değeri React state'inden gelen input; ekrandaki yazının sahibi bellidir.
- **Callback:** Başka bir component'e verilen ve gerektiğinde çağrılan fonksiyon.
- **State'i yukarı kaldırma:** Paylaşılan state'i kullanan component'lerin ortak parent'ına taşıma.

**Kendini yokla:** SearchBox ve MovieGrid aynı sorguya ihtiyaç duyarsa sorgu nerede durmalı?  
*Cevap:* İkisini de kapsayan en yakın ortak parent'ta.

**Kendini yokla:** Filtrelenmiş listeyi neden ikinci bir state olarak tutmuyoruz?  
*Cevap:* Her render'da katalog ve sorgudan hesaplanabilir; ayrı kopya eşit tutulmak zorunda kalır.
