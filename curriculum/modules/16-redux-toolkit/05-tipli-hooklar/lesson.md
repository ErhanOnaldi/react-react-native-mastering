---
title: "React’i store’a tipli bağla"
minutes: 15
kind: concept
---

# React’i store’a tipli bağla

Bir component’te `useState(0)` yazınca TypeScript, state’in sayı olduğunu anlar. Store’dan okuduğunda da aynı rahatlığı istersin: `state.favorites.ids` yazarken yanlış bir alan adı kullanırsan editör hemen gösterebilsin. Bunun için her component’te state ağacını elle tarif etmek yerine tipi oluşturduğumuz store’dan alacağız.

## Önce store’un şeklini okuyalım

Bir store’un kökünde birden fazla slice alanı bulunabilir. `configureStore` bu alanları birleştirir; `store.getState()` ise store’un o anki tüm değerini verir. `RootState` adını bu dönüş tipine verelim:

```ts check
import { configureStore, createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({ name: 'ui', initialState: { theme: 'dark' }, reducers: {} })
const store = configureStore({ reducer: { ui: uiSlice.reducer } })
type RootState = ReturnType<typeof store.getState>
const theme: RootState['ui']['theme'] = 'dark'

export { store, theme }
```

`RootState`, store’un tamamının tipidir. Buradaki `'ui'` yolu TypeScript’e store’da gerçekten `ui` alanı olduğunu söyler; `state.uı` gibi yanlış yazım derleme hatası verir. Store’a reducer eklediğinde tür de aynı kaynaktan yeniden çıkar, ayrıca ikinci bir state ağacı kopyalaman gerekmez.

## Okuma hook’una bu tipi ver

React Redux’un `useSelector` hook’u store’dan bir değer okur. Tipi verilmezse TypeScript state’in şeklini bilemeyebilir; bazen `any` yüzünden her alan yazımı kabul edilir. `.withTypes<T>()`, genel bir hook’a uygulamanın tipini bağlayıp tekrar kullanılabilir tipli hook üretir. Aşağıdaki örnekte yalnız tema bilgisini okuyoruz; `Provider` ise store’u React ağacındaki alt component’lere ulaştıran sarmalayıcıdır.

```tsx check
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { Provider, useSelector } from 'react-redux'

const uiSlice = createSlice({ name: 'ui', initialState: { theme: 'dark' }, reducers: {} })
const store = configureStore({ reducer: { ui: uiSlice.reducer } })
type RootState = ReturnType<typeof store.getState>
const useCinemaSelector = useSelector.withTypes<RootState>()
function ThemeLabel() {
  const theme = useCinemaSelector((state) => state.ui.theme)
  return <p>Tema: {theme}</p>
}
export function Example() { return <Provider store={store}><ThemeLabel /></Provider> }
```

`.withTypes<RootState>()`, `useSelector` hook’una uygulamanın state tipini bağlar. `ThemeLabel` içindeki callback artık `state.ui.theme` şeklini bilir. Bu tip yalnızca kod yazarken denetim yapar; component’in ekranda gerçek store’u bulması için `Provider` gerekir.

## Action göndermeyi de aynı store’dan türet

Okuma tamam; şimdi component’in store’a bir action göndermesi gerektiğini düşün. `AppDispatch`, store’un `dispatch` fonksiyonunun gerçek tipini alır. `.withTypes<AppDispatch>()` ile tipli dispatch hook’u kurup buton tıklamasında kullanabiliriz:

```tsx check
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { Provider, useDispatch, useSelector } from 'react-redux'

const watchSlice = createSlice({ name: 'watch', initialState: { count: 0 }, reducers: { opened(state) { state.count += 1 } } })
const store = configureStore({ reducer: { watch: watchSlice.reducer } })
type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch
const useCinemaSelector = useSelector.withTypes<RootState>()
const useCinemaDispatch = useDispatch.withTypes<AppDispatch>()
function OpenedCount() {
  const count = useCinemaSelector((state) => state.watch.count)
  const dispatch = useCinemaDispatch()
  return <button onClick={() => dispatch(watchSlice.actions.opened())}>Açılan: {count}</button>
}
export function Example() { return <Provider store={store}><OpenedCount /></Provider> }
```

Tıklayınca `opened` action’ı store’a gider; reducer `count` değerini artırır ve seçilen sayı değiştiği için ekranda yeni sayı görünür. `AppDispatch`’i store’dan almamız, dispatch’in uygulamada gerçekten kabul ettiği action’larla aynı tipte kalmasını sağlar. Kök state ve dispatch tiplerini bir kez tanımlayıp uygulamanın hook’larını her feature’da kullanmak, tekrar eden anotasyonları önler.

![Redux dispatch’ten UI seçimine uzanan akış](diagram:redux-veri-akisi)

## Hangi component güncellenir?

Bir store güncellemesi bütün state ağacına yeni snapshot verir; bu, bütün component’lerin mutlaka render olacağı anlamına gelmez. `useSelector` her abone component için seçilen sonucu karşılaştırır. Varsayılan karşılaştırma `===` kullanır: sayı veya string aynı değerdeyse yalnız store değişti diye o component’in render olması gerekmez.

Örneğin `OpenedCount` `state.watch.count` seçerken başka bir başlık `state.ui.theme` seçebilir. `opened` action’ı sayıyı artırır ama temayı değiştirmez. İki component farklı sonuçlar aldığı için yalnız sayaçtaki seçim değişir:

| An | `watch.count` seçimi | `ui.theme` seçimi | Store güncellemesinin etkisi |
| --- | ---: | --- | --- |
| Başlangıç | `0` | `dark` | İki seçim de ekranda |
| `opened` gönderilir | `1` | `dark` | Sayaç component’i yeni değeri okur |
| Tema değişir | `1` | `light` | Tema component’i yeni değeri okur |

Bu karşılaştırma tüm render’ları kilitlemez. Parent yeni props verirse, component’in kendi state’i değişirse veya Context güncellenirse component yine render olabilir. Selector’ın dar bir primitive değer döndürmesi yalnızca store aboneliğinin ne zaman yeni sonuç gördüğünü anlaşılır kılar.

## Bir yanlış tipi “düzeltmek” neden çözüm değil?

Bazen editörün hata mesajını susturmak için **type assertion** (tip iddiası) yazarsın: `value as SomeType`. Bu, TypeScript’e “bu değeri bu tipte kabul et” demektir; değeri kontrol edip dönüştürmez. Store’dan türetilen tipi kullanmak yerine state’i `as RootState` diye işaretlemek, eksik ya da yanlış veriyi doğru hale getirmez.

Örneğin API’den gelen JSON’u `RootState` diye işaretlemek tehlikelidir: veri hâlâ beklediğin alanları taşımıyor olabilir. Type assertion yalnızca TypeScript denetimini etkiler; runtime’da, yani uygulama çalışırken doğrulama yapmaz. Dış veriyi kullanmadan önce şemasını doğrulamak gerekir. Store’un kendi tipinde ise assertion yerine gerçek store’dan türetmek doğru kaynağı kullanır.

:::mistake[Belirti → `state.missing` hata vermiyor]
Editör yanlış alan adını kabul ediyorsa selector’ın state parametresi `any` olmuş olabilir. Tipli hook’u store’dan çıkan `RootState` ile oluştur; ayrıca selector parametresine `any` yazma.
:::

:::mistake[Belirti → “could not find react-redux context value”]
Tipli hook derleniyor ama ekran açılınca store bulunamıyor. TypeScript tipi çalışma anında store sağlamaz; component’i doğru `store` verilen `Provider` içine al.
:::

Store tipi component’in hangi alanları okuyabileceğini ve hangi action’ları gönderebileceğini derleme sırasında denetler. Provider ise gerçek store’u çalışma anında taşır. Bu iki iş birbirinin yerine geçmez.

## Özet

- `RootState` tipini `ReturnType<typeof store.getState>` ile store’dan çıkar.
- `AppDispatch` tipini `typeof store.dispatch` ile aynı store’dan çıkar.
- React Redux’un `.withTypes<T>()` metodu, uygulamaya özel selector ve dispatch hook’u oluşturur.
- `Provider` çalışma anında store’u verir; TypeScript tek başına Provider’ın varlığını kanıtlamaz.
- Type assertion derleyiciye iddiada bulunur, runtime verisini doğrulamaz.

**Yeni terimler**

- **`RootState`:** Store’daki bütün reducer alanlarının TypeScript tipi.
- **`AppDispatch`:** Uygulamanın store’una ait dispatch fonksiyonunun tipi.
- **`.withTypes<T>()`:** Bir hook’a uygulamanın TypeScript tipini bağlayan React Redux metodu.
- **Type assertion:** TypeScript’e bir değeri belirli tipte kabul etmesini söyleyen ifade; runtime doğrulaması yapmaz.

**Kendini yokla:** Store’a yeni reducer alanı eklendiğinde `RootState` nasıl güncel kalır?  
*Cevap:* Store’un `getState()` dönüşünden türetildiği için yeni alan tipi de ona yansır.

**Kendini yokla:** `RootState` tipi component’e store’u sağlar mı?  
*Cevap:* Hayır. `RootState` yalnız derleme zamanındadır; gerçek store’u React ağacına `Provider` verir.
