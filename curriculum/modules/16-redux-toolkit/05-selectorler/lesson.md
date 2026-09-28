---
title: "Selector sonucu ve referans"
minutes: 15
kind: concept
---

# Selector sonucu ve referans

:::pain[Sinema’da sorun]
İzleme listesi değişmedi; yalnızca tema ayarı güncellendi. Buna rağmen ekranda favori ve izleme listesi sayısını gösteren sayaçlar da render oldu. Selector’lardan biri her store güncellemesinde yeni bir dizi oluşturduğu için React Redux değişikliği gerçek kabul etti.
:::

## Selector neyi seçer?

Selector, store state’ini bir görünümün ihtiyaç duyduğu değere dönüştüren fonksiyondur. En basit haliyle bir alanı döndürür. Daha karmaşık hali birden fazla alanı birleştirip filtrelenmiş liste veya özet hesaplar. Selector’ın sonucu yalnızca doğru olmalı değil; referans davranışı da bileşenin render maliyetini etkiler.

:::model[State sahipliği ve snapshot]
Store güncellemesi yeni immutable state snapshot’ı üretir; selector bu snapshot’tan görünüm verisi okur. Server, URL, form ve client state sahipleri ayrı kalır. Bu derste yeni soru, türetilmiş görünüm verisinin her güncellemede yeniden hesaplanıp yeniden referans üretmesinin aboneliklere etkisidir.
:::

![Redux state'inden selector ile UI sonucuna giden akış](diagram:redux-veri-akisi)

1. **Basit alanı doğrudan seç.** `state.settings.density` gibi primitive değerler için selector sade ve ucuzdur.
2. **Referans eşitliği önemlidir.** React Redux varsayılan olarak önceki selector sonucuyla yeni sonucu `===` karşılaştırır.
3. **Yeni nesne veya dizi farklı sonuçtur.** İçerikleri eşit olsa da her çağrıda üretilen yeni referans subscriber’ı güncelleyebilir.
4. **Türetilmiş state çoğu zaman saklanmaz.** Kaynak state’ten render sırasında hesaplanır; böylece iki kopyayı eşzamanlı tutma işi çıkmaz.
5. **Memoization hesaplama girdilerini izler.** `createSelector` aynı input selector değerleri değişmediyse önceki sonucu ve referansı döndürür.
6. **Memoization doğruluğun şartı değildir.** Önce sade selector ile davranışı kur; pahalı hesap veya yeni referans problemi varsa memoize et.

## Önceki ve yeni sonucu izle

Kütüphanedeki kitapları türe göre süzen bir panel düşün. Store’da `books` ve `selectedGenre` vardır. Kullanıcı bir ayarı değiştirdiğinde bu iki input değişmediyse sonuç listesi de değişmemelidir.

| Olay | `books` referansı | `selectedGenre` | Filtrelenmiş sonuç |
| --- | --- | --- | --- |
| İlk seçim | A | `history` | Yeni `[book1, book3]` |
| Tema değişir | A | `history` | Aynı önceki referans kullanılabilir |
| Tür değişir | A | `poetry` | Yeni filtrelenmiş dizi gerekir |
| Kitaplar güncellenir | B | `poetry` | Yeni sonuç yeniden hesaplanır |

`createSelector` input selector’ları önce store alanlarını çıkarır. Result function yalnızca input değerlerinden hesap yapar. Böylece hangi değişimlerin hesabı geçersiz kıldığını da kod açıkça gösterir.

## Kırık sonuç: her seferinde yeni dizi

Bu selector state değiştikçe çağrılır ve her seferinde yeni bir dizi üretir:

```tsx title="Kırık: filter her çağrıda yeni dizi verir"
const historyBooks = useAppSelector((state) =>
  state.library.books.filter((book) => book.genre === 'history'),
)
```

Bir tema güncellemesinde `books` değişmemiş olsa bile `filter` yeni dizi döndürür. İçindeki öğeler aynı olabilir, fakat dizi kimliği farklıdır. Component gereksiz render edilir. Bu kod yanlış liste göstermek zorunda değildir; sorun sonucu tekrar tekrar ve yeni referansla üretmesidir.

Doğru kullanımda input’lar ve türetilen sonuç ayrı tanımlanır:

```ts check
import { createSelector } from '@reduxjs/toolkit'

type Book = { id: number; title: string; genre: string }
type LibraryState = { library: { books: Book[]; selectedGenre: string } }

const selectBooks = (state: LibraryState) => state.library.books
const selectGenre = (state: LibraryState) => state.library.selectedGenre

export const selectVisibleBooks = createSelector(
  [selectBooks, selectGenre],
  (books, genre) => books.filter((book) => book.genre === genre),
)
```

İki selector aynı `books` dizisini ve aynı `genre` değerini gördüğünde `selectVisibleBooks` önceki dizi sonucunu döndürür. `books` yeni referans alırsa veya `genre` değişirse hesap yenilenir. Sonucu bellekte saklamak, kaynak state’e ikinci bir alan eklemek anlamına gelmez.

## Slice’a yakın selector

Bir slice’ın kendi alanından değer seçen fonksiyonlar slice tanımıyla birlikte tutulabilir. RTK’de `createSlice` `selectors` alanını destekler. Bu, selector’ın hangi feature’a ait olduğunu ve bileşenlerin hangi public API’yi kullanacağını gösterir.

```ts title="Slice sınırında basit seçim"
const notesSlice = createSlice({
  name: 'notes',
  initialState: { entries: [] as { id: string; pinned: boolean }[] },
  reducers: {},
  selectors: {
    selectPinnedCount: (state) => state.entries.filter((entry) => entry.pinned).length,
  },
})
```

Bu sonuç sayı gibi primitive olduğundan içerik aynı kaldığında eşitlik basittir. Her çağrıda yeni dizi döndüren selector’da ise referans önem kazanır. Birden fazla slice’ın alanını birleştiren selector’ı root state’i bilen ayrı bir dosyada tutmak daha doğal olabilir.

## Selector bir kez oluşturulmalı mı?

`createSelector` çağrısı selector fonksiyonunu oluşturur. Bunu component render gövdesinde her render’da tekrar kurarsan memoization geçmişi de her seferinde sıfırlanır:

```tsx title="Kırık: selector instance her render'da sıfırlanıyor"
function BookCount() {
  const selectCount = createSelector([selectBooks], (books) => books.length)
  const count = useAppSelector(selectCount)
  return <output>{count}</output>
}
```

Tek input’lu basit seçimde zaten `state.library.books.length` yeterlidir. Birden çok component paylaşacak sabit selector’ı modül seviyesinde tanımla. Component parametresiyle birden fazla bağımsız hesaplama geçmişi gerekirse selector factory tasarlanabilir; her yerde factory kullanmak gerekmez.

Selector içinde `Date.now()`, random veya yan etki bulunmaz. Aynı state için aynı görünüm değerini üretmek, test etmeyi ve Redux DevTools zaman yolculuğunda sonucu anlamayı kolaylaştırır.

### Memoization’ın girdi sınırı

`createSelector` hesaplama önbelleğini input selector’ların son sonuçlarına göre tutar. Varsayılan kullanımda aynı selector çağrısında input’ların referansı değişmediyse result function tekrar çalışmaz. Bir input nesnesi Immer güncellemesiyle yeni referans alırsa selector sonucu günceller. Bu nedenle state’in immutable güncellenmesi, memoization’ın hangi verinin değiştiğini anlaması için gereklidir.

Input selector şu tür bir değer üretirse memoization etkisizleşir:

```ts title="Her input çağrısında yeni dizi"
const selectIdsCopy = (state: RootState) => [...state.library.ids]
```

Store’da `ids` aynı referans olsa bile kopyalama her çalışmada farklı dizi verir. Result function çalışmaya devam eder. Input selector’ın görevi parçayı seçmektir; kopya, filtre ve sıralama gibi dönüşümler result function’a aittir.

### Parametreli selector ve component sayısı

Tek bir memoized selector farklı `categoryId` parametreleriyle çok sayıda satırda çağrılırsa cache davranışını düşün. Modern Reselect birden fazla argüman kombinasyonunu memoize edebilir; fakat her selector tasarımının cache boyutu ve kullanım biçimi aynı değildir. Bir liste öğesi için ucuz bir boolean kontrolünde `includes` çoğu kez yeterlidir. Pahalı hesapta component başına selector factory veya uygun selector argument memoization yaklaşımı kullanılabilir.

Önce selector’ın her çağrıda ne kadar iş yaptığını ve referansın gerçekten render doğurup doğurmadığını ölç. Sonuç dizisi büyükse hesap maliyeti; küçükse yeni referansın yarattığı render maliyeti öne çıkabilir. Bir optimizasyonu eklemek, kodun doğruluk koşulunu değiştirmemeli: aynı girdiler aynı üyelik ve sırayı üretmeye devam etmelidir.

Selector’ı slice’a yakın tutmak da public state API’si sağlar. Component `state.library.books` yoluna doğrudan bağımlı olmaz; `selectVisibleBooks` gibi anlamlı bir adla ihtiyacını bildirir. State’in iç yapısı yeniden düzenlenirse selector uyarlanır, tüketen ekranlar aynı sözleşmeyi kullanır. Root state’e bağlı selector’ı slice içinde saklamak mümkün olsa da feature sınırlarının birbirine bağımlı hale gelmesine dikkat et.

## Sınır durumları

:::mistake[Belirti → Tema güncellemesinde liste de render oluyor]
Belirti → Liste görünümü aynı, sayaç artıyor.  
Neden → Selector her çalışmada `.map`, `.filter` veya object literal ile yeni referans üretmiş.  
Düzeltme → Primitive/var olan alanı doğrudan seç veya birden fazla girdi ve türetilmiş sonuç için `createSelector` kullan.
:::

:::mistake[Belirti → Memoized selector hiç önbellek kullanmıyor]
Belirti → Hesap her store değişiminde tekrarlanıyor.  
Neden → Input selector’ı her seferinde yeni dizi/nesne üretiyor.  
Düzeltme → Input’lar kaynak state alanlarını doğrudan döndürsün; türetmeyi result function içinde yap.
:::

:::mistake[Belirti → Selector içindeki liste eski kalıyor]
Belirti → Bir kitabı ekledin ama filtre sonucu güncellenmedi.  
Neden → State immutable güncellenmediği için input referansı değişmedi veya selector başka bir kök anahtara bakıyor.  
Düzeltme → RTK reducer’ında Immer draft kullan ve root state yolunu store tanımıyla eşleştir.
:::

:::mistake[Belirti → Her küçük alan için `createSelector` dosyası oluşuyor]
Belirti → Okuma kodu küçük bir boolean için çok sayıda katmana bölünmüş.  
Neden → Memoization’ı varsayılan doğruluk kuralı sanmışsın.  
Düzeltme → Hesap ucuzsa ve primitive döndürüyorsa doğrudan selector kullan; memoization’ı referans veya ölçülmüş maliyet gerektiğinde ekle.
:::

:::sector
Ekiplerde selector’lar state shape’i bileşenlerden saklayan bir feature API’si işlevi de görür. State iç içe yapı değiştiğinde component dosyalarının tamamını güncellemek yerine selector’ın içini değiştirebilirsin. Memoization kararını render Profiler verisi ve hesap maliyetine göre vermek, “her şeyi memoize et” kuralından daha sürdürülebilirdir.
:::

## Özet

- Selector store state’ini görünümün ihtiyacı olan değere dönüştürür.
- `useSelector` sonuç referansını karşılaştırır; yeni nesne/dizi gereksiz render doğurabilir.
- `createSelector`, input sonuçları aynı kaldıkça önceki türetilmiş sonucu korur.
- Input selector’larında türetme yapma; kaynak state alanlarını döndür.
- Ucuz primitive seçimlerde memoization şart değildir.

**Kendini yokla:** İçeriği aynı iki dizi `===` karşılaştırmasında eşit midir?  
*Cevap:* Hayır. Dizi nesneleri farklı referanssa eşit değillerdir.

**Kendini yokla:** `createSelector` input’ları değişmediğinde neyi korur?  
*Cevap:* Önceki hesap sonucunu ve onun referansını.
