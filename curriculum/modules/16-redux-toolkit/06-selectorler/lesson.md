---
title: "Selector sonucu ve referans"
minutes: 16
kind: concept
---

# Selector sonucu ve referans

Bir film kartında “favori mi?” bilgisini göstermek için store’daki bir alanı okuyabilirsin. Bu işi yapan küçük fonksiyona **selector** denir: state’i alır ve ekranın kullanacağı bir değeri seçer. Selector, store’daki veriyi değiştirmez; görünümün ihtiyacı olan sonucu tarif eder.

![Redux state’inden selector ile UI sonucuna giden akış](diagram:redux-veri-akisi)

## Önce tek bir alan seç

Diyelim store’da filmlerin ID’leri ve seçili tema var. Tema etiketinin yalnız tema değerine ihtiyacı var:

```ts check
type State = { ui: { theme: 'light' | 'dark' }; movies: { ids: number[] } }

const selectTheme = (state: State) => state.ui.theme
export { selectTheme }
```

`selectTheme` var olan string’i döndürür. Aynı `state` ile yeniden çağrıldığında aynı string değerini verir; yeni bir dizi ya da nesne oluşturmaz. Bu selector küçük ve doğrudandır, bu yüzden onu ayrıca optimize etmeye gerek yoktur.

Şimdi filmlerin sayısını seçelim. Bu değer bir sayı olduğundan, ID dizisi değişmediyse sonuç da aynı sayıdır:

```ts check
type State = { movies: { ids: number[] }; ui: { theme: 'light' | 'dark' } }

const selectMovieCount = (state: State) => state.movies.ids.length
export { selectMovieCount }
```

Selector yalnızca kullandığı alanı belirtir. `ui.theme` değişse bile `selectMovieCount` aynı sayı döndürür. React Redux selector sonucunu önceki sonuçla karşılaştırır; sayı değişmediyse bu okuma tek başına component’i güncellemek için sebep oluşturmaz.

Bir slice kendi alanından seçim yapan fonksiyonları da dışa açabilir. Örneğin koleksiyon sayısını slice sınırında tutalım:

```ts check
import { createSlice } from '@reduxjs/toolkit'

const collectionSlice = createSlice({
  name: 'collection',
  initialState: { ids: [7, 12, 4] },
  reducers: {},
  selectors: {
    selectCount: (state) => state.ids.length,
  },
})

export const selectCollectionCount = collectionSlice.selectors.selectCount
```

Bu selector slice-ın kendi state alanını bilir; kullanan component store’daki iç içe `collection.ids` yolunu tekrar etmek zorunda kalmaz. Sayı dönmesi de kolay karşılaştırma sağlar. Bu örnekte slice selector’ı tanımlamak, büyük bir optimizasyon katmanı eklemeden state erişimini anlaşılır kılar.

## Yeni dizi her çağrıda yeni sonuçtur

Bir dizi ya da nesnenin **referansı**, bellekte hangi nesne olduğunu gösteren kimliğidir. İki farklı dizi aynı filmleri tutsa bile referansları ayrıdır. Bir ekran seçili türe ait filmleri gösterecek olsun. Düz `filter` ile doğru listeyi bulabiliriz:

```ts
type Movie = { id: number; title: string; genre: string }
type State = { movies: Movie[]; selectedGenre: string; ui: { theme: string } }

const selectVisibleMovies = (state: State) =>
  state.movies.filter((movie) => movie.genre === state.selectedGenre)
```

Filtre doğru sonuç üretir; ama `.filter` her çağrıldığında yeni bir dizi kurar. Tema değişince `movies` ve `selectedGenre` aynı kalsa bile yeni dizi referansı çıkar. React Redux varsayılan olarak selector’ın önceki ve yeni sonucunu `===` ile karşılaştırır; iki farklı dizi içeriği aynı olsa da `===` karşılaştırmasında eşit değildir. Sonuç: gereksiz render olabilir.

Bu örnekte, seçim ve güncelleme sırasını izleyelim:

| An | `movies` | `selectedGenre` | Selector sonucu |
| --- | --- | --- | --- |
| İlk çağrı | referans A | `drama` | `[film1, film3]` — dizi A |
| Tema değişir | referans A | `drama` | aynı içerik, yeni dizi B |
| Tür `comedy` olur | referans A | `comedy` | yeni içerik ve dizi C |
| Film eklenir | referans B | `comedy` | yeni liste ve dizi D |

İkinci satırda görünen filmler değişmedi ama sonuç referansı değişti. Bu yüzden önceki ve sonraki selector sonucu eşit görünmüyor. Kural, her yeni dizi sorunludur demek değil; dizi hesaplayıp selector üzerinden abone olduğunda referans değişikliğinin ek render başlatabileceğini bilmektir.

## İki input’tan tek sonuç üret

Birden fazla kaynak alandan türetilen sonucu **memoization** ile hesaplayabiliriz. Memoization, aynı girdiler tekrar geldiğinde önceki hesap sonucunu saklayıp geri kullanmaktır. Redux Toolkit, `createSelector` ile bu işi kurar:

```ts check
import { createSelector } from '@reduxjs/toolkit'

type Movie = { id: number; title: string; genre: string }
type State = { movies: Movie[]; selectedGenre: string; ui: { theme: string } }

const selectMovies = (state: State) => state.movies
const selectGenre = (state: State) => state.selectedGenre

export const selectVisibleMovies = createSelector(
  [selectMovies, selectGenre],
  (movies, genre) => movies.filter((movie) => movie.genre === genre),
)
```

`createSelector` içindeki ilk iki fonksiyon **input selector**’dır; bunlar yalnızca hesap için gereken kaynak değerleri seçer. Sonraki fonksiyon **result function**’dır; input değerlerini alır ve yeni görünüm sonucunu hesaplar. Bu ayrım sayesinde tema gibi alakasız bir alan değiştiğinde `movies` ve `genre` aynı kalır, önceki sonuç dizisi kullanılabilir.

| Olay | Input sonuçları değişti mi? | Result function | Dönen liste |
| --- | --- | --- | --- |
| İlk çağrı | İlk değerler | çalışır | yeni `[film1, film3]` |
| Yalnız tema değişir | Hayır | tekrar çalışmaz | önceki dizi |
| Tür değişir | Evet | yeniden çalışır | yeni türe göre dizi |
| Film listesi güncellenir | Evet | yeniden çalışır | güncel dizi |

Burada `createSelector` sadece render sayısını azaltmıyor; hangi state parçalarının sonuca etki ettiğini de açık ediyor. Filtre hesabı yalnız iki input’a bağlı olduğu için tema güncellemesi sonucu değiştirmez. State Immer ile immutable biçimde güncellendiğinde değişen liste yeni referans alır ve selector bunun üzerinden yeniden hesaplar.

## Öğrencinin yapabileceği hata

Input selector’ın içinde kopya üretirsen memoization işe yaramaz:

```ts
const selectMovieCopy = (state: State) => [...state.movies]
```

Her çağrı yeni dizi döndürdüğü için input değişmiş gibi görünür ve result function tekrar çalışır. Belirti, alakasız store güncellemelerinde de filtre hesabının sürmesidir. Input selector’lar kaynak alanı olduğu gibi döndürsün; filtreleme, sıralama veya birleştirme result function’da kalsın.

Selector’lar state yapısını component’lerden de saklayabilir. `selectVisibleMovies` kullanan ekran, filmlerin state ağacındaki yolunu bilmez. State alanı taşınırsa selector’ın içi güncellenebilir ve ekranın kullandığı ad aynı kalır.

:::info[Derinlemesine (isteğe bağlı)]
Reselect, `createSelector`’ın arkasındaki selector kütüphanesidir. Cache ayrıntıları sürüme ve selector’ın çağrılma biçimine göre değişebilir; başlangıç için input’ları kaynak state alanlarından döndür ve `createSelector`’ı component render gövdesinde her seferinde yeniden oluşturma. Farklı parametrelerle çok sayıda bağımsız pahalı hesap gerekiyorsa selector factory düşünülebilir; basit `includes` veya sayı hesabı için factory gerekmez.
:::

## Özet

- Selector, store state’inden ekranın ihtiyacı olan değeri seçer; state’i değiştirmez.
- Sayı ve string gibi primitive sonuçlar doğrudan seçilebilir.
- Her çağrıda yeni nesne veya dizi döndürmek React Redux’un eşitlik kontrolünde farklı sonuç sayılır.
- `createSelector`, kaynak değerler değişmediğinde önceki hesap sonucunu ve referansını korur.
- Input selector’lar kaynak alanı seçer; dönüşüm result function’da yapılır.

**Yeni terimler**

- **Selector:** State’ten görünüm için gereken değeri döndüren fonksiyon.
- **Memoization:** Girdiler aynı kaldığında önceki hesap sonucunu saklayıp kullanma tekniği.
- **Input selector:** `createSelector` hesabına girdi olacak state değerini seçen fonksiyon.
- **Result function:** Input değerlerinden türetilmiş sonucu üreten fonksiyon.
- **Referans:** Bir nesne veya dizinin bellekteki kimliği; içerik aynı olsa da iki ayrı dizi farklı referanstır.

**Kendini yokla:** Tema değişti, film listesi ve tür aynı kaldı. Memoized selector ne yapar?  
*Cevap:* Input sonuçları aynı olduğundan önceki filtrelenmiş liste referansını verir.

**Kendini yokla:** Neden filtrelemeyi input selector’ın içine koymuyoruz?  
*Cevap:* Her çağrıda yeni dizi üretebilir; input’ları seçip dönüşümü result function’da tutmak cache’in değişikliği doğru izlemesini sağlar.
