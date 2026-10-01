---
title: "Store ve slice ile tek kural"
minutes: 18
kind: concept
---

# Store ve slice ile tek kural

Bir film sayfasında buton tıklanınca bir değerin değiştiğini `useState` ile görmüşsündür. Şimdi aynı kuralı katalog, detay ve fragman ekranlarının kullanmasını düşün. Her ekranda ayrı ayrı yazmak yerine değişikliği ortak bir yerde adlandırıp, yeni değeri oradan okumak istiyoruz.

Redux Toolkit’te ortak verinin bulunduğu nesneye **store** denir. Store’ı bir posta kutusu gibi düşünebilirsin: component’ler oradan state okur ve bir değişiklik isteğini gönderir. Bu isteğe **action** denir; örneğin “fragman açıldı” bir olaydır, doğrudan state’in yeni değerini tarif etmez.

## Bir action’dan yeni değere

Bir **slice** özelliğe ait başlangıç state’ini ve onu değiştiren kuralları bir arada tutar. RTK’nin `createSlice` fonksiyonu bu kurallardan action creator’ları da üretir: action creator, verdiğin bilgiden action nesnesi oluşturan fonksiyondur.

Önce fragman panelinin kaç kez açıldığını sayalım. Reducer, eski state ve action’ı alıp yeni state’i hesaplayan fonksiyondur. `createSlice` reducer’ında `state.count += 1` gibi bir satır göreceksin: bu satır gerçek eski nesneyi değiştirmiyor. RTK, düzenlenebilir geçici bir **draft** üzerinde çalışır ve Immer bu değişiklikten yeni, değişmez sonuç çıkarır; burada mutasyon benzeri yazımın güvenli olmasının nedeni budur.

```ts check
import { createSlice } from '@reduxjs/toolkit'

const trailerSlice = createSlice({
  name: 'trailer',
  initialState: { openCount: 0 },
  reducers: {
    trailerOpened(state) {
      state.openCount += 1
    },
  },
})
const openTrailer = trailerSlice.actions.trailerOpened()
void openTrailer
```

`trailerOpened()` action nesnesini üretir ama henüz store’a bir şey göndermez. `dispatch` action’ı store’a ileten çağrıdır; store ilgili reducer’ı çalıştırır ve yeni sonucu saklar. Bu ayrım sayesinde bir olayın tanımı component’te değil, slice kuralında kalır.

## Action’a gereken bilgiyi ekle

Bir component yalnızca “fragman açıldı” demekle kalmayıp hangi filmin açıldığını da bildirebilir. Bu bilgi action’ın `payload` alanında taşınır. Aşağıdaki örnekte son açılan film kimliğini saklıyoruz:

```ts check
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const trailerSlice = createSlice({
  name: 'trailer',
  initialState: { lastOpenedMovieId: null as number | null },
  reducers: {
    trailerOpened(state, action: PayloadAction<number>) {
      state.lastOpenedMovieId = action.payload
    },
  },
})
const action = trailerSlice.actions.trailerOpened(603)
void action
```

Action creator’a `603` verdik, o sayı payload oldu; reducer’ın görevi bu kimliği yeni state’e yazmak. Reducer içinde rastgele sayı, saat, ağ isteği veya `localStorage` çağrısı yapma: reducer yalnızca verilen state ve action’a göre sonuç hesaplamalı. Böylece aynı state ve action her zaman aynı sonucu verir; akışı izlemek ve tekrar üretmek kolaylaşır.

## Değeri okuyacak yeri seç

Bir **selector**, store state’inden component’in ihtiyaç duyduğu değeri seçen fonksiyondur. Slice state’ini root state içindeki `trailer` alanında tuttuğumuzu düşünelim:

`PayloadAction<number>`, bu reducer’a gelen action’ın `payload` alanında bir sayı bulunduğunu belirtir. Store’daki bütün feature alanlarının birleştiği nesneye **root state** denir; selector bu nesnenin içinden okur.

```ts check
type RootState = { trailer: { lastOpenedMovieId: number | null } }
const selectLastOpenedMovieId = (state: RootState) => state.trailer.lastOpenedMovieId
const lastId = selectLastOpenedMovieId({ trailer: { lastOpenedMovieId: 603 } })
void lastId
```

Selector state’in kendisini değiştirmez; sadece gereken parçayı okur. Component’in tamamını store’a bağlamak yerine küçük bir sonucu okuması, hangi ekranda hangi verinin kullanıldığını anlaşılır kılar. React Redux bu sonucu hook’larla component’e bağlar; hook kullanımı sonraki derste ele alınacak.

## İki slice’ı tek store’da birleştir

Fragman geçmişi ve katalog görünüm tercihi birbirinden bağımsız özelliklerdir. `configureStore`, reducer’ları tek store’da birleştirir. `reducer` nesnesindeki anahtarlar root state’teki yolları belirler; örneğin `trailer` anahtarı state’e `state.trailer` yolu verir.

```ts check
import { configureStore, createSlice } from '@reduxjs/toolkit'

const trailerSlice = createSlice({ name: 'trailer', initialState: { openCount: 0 }, reducers: { opened: (state) => { state.openCount += 1 } } })
const catalogSlice = createSlice({ name: 'catalog', initialState: { compact: false }, reducers: { toggleCompact: (state) => { state.compact = !state.compact } } })
const store = configureStore({ reducer: { trailer: trailerSlice.reducer, catalog: catalogSlice.reducer } })
export const { opened } = trailerSlice.actions
export const { toggleCompact } = catalogSlice.actions
store.dispatch(opened())
const count = store.getState().trailer.openCount
void count
```

Burada `state.trailer.openCount` ve `state.catalog.compact` yolları reducer haritasındaki anahtarlardan gelir. Slice’ın `name` alanı action türünü `trailer/opened` gibi adlandırır; store haritasındaki anahtar ise state yolunu belirler. Genellikle aynı adı seçmek okunaklıdır ama bunlar farklı işler yapar. Örnekte store bir kez oluşturuluyor. Birden çok bağımsız store gerektiğinde `configureStore` çağrısını bir fonksiyon içinde yaparsın; her fonksiyon çağrısı yeni başlangıç state’i olan bir store verir.

Action’ın yolculuğunu bu örnekte sırayla izleyebilirsin:

| Sıra | Ne çalışır? | Sonuç |
| --- | --- | --- |
| 1 | `opened()` action creator’ı çağrılır | `{ type: 'trailer/opened' }` oluşur |
| 2 | `store.dispatch(action)` çağrılır | Action store’a gider |
| 3 | Store `trailer` reducer’ını çalıştırır | `openCount` 0’dan 1’e çıkar |
| 4 | Store yeni state’i saklar | `state.trailer.openCount` artık 1’dir |
| 5 | Selector değeri okur | Ekran “1 kez açıldı” gösterebilir |

![Dispatch, middleware, reducer, store, selector ve UI arasındaki Redux veri akışı](diagram:redux-veri-akisi)

### Store’un çevresindeki iki terim

`configureStore` bazı **middleware**’leri de store’a ekler. Middleware, action reducer’a ulaşmadan önce onu görebilen bir ara katmandır; örneğin geliştirmede yaygın hataları denetleyen varsayılan katmanlar bulunur. Şimdilik kendi middleware’ini yazmana gerek yok; ana state geçişini action ve reducer ile takip et.

`preloadedState`, store ilk oluşturulurken başlangıç state’i olarak verdiğin değerdir. Örneğin daha sonra testte belirli bir film seçimiyle başlamak veya kaydedilmiş başlangıç verisini geri yüklemek için kullanılabilir; verdiğin nesnenin şekli reducer haritasıyla uyumlu olmalıdır. Normal açılışta slice’ların `initialState` değerleri yeterlidir.

:::info[Derinlemesine (isteğe bağlı)]
Bir test ya da uygulama başlangıç state’i veriyorsa `configureStore({ reducer, preloadedState })` biçimini kullanabilirsin. Her slice için gerekli alanların tipi reducer’ın beklediği state ile uyuşmalıdır; kısmi başlangıç değerlerini otomatik birleştiren ayrı bir kural varsayma.
:::

## Sık yapılan yanlışlar

:::mistake[Belirti → Action geçmişte görünüyor ama değer değişmedi]
Belirti → Action creator’ı çağırdın fakat state aynı kaldı.
Neden → Action nesnesini üretmek dispatch etmek değildir; ayrıca slice reducer’ı store’a bağlanmamış olabilir.
Düzeltme → Action’ı `dispatch` et ve reducer’ın `configureStore` haritasında yer aldığını kontrol et.
:::

:::mistake[Belirti → State ağacında beklenmeyen yol var]
Belirti → `state.trailer` beklerken değer başka anahtarın altında.
Neden → Slice `name` alanı ile reducer haritasındaki anahtarın aynı şeyi yaptığını varsaydın.
Düzeltme → State yolunu `configureStore` içindeki anahtara göre oku.
:::

:::mistake[Belirti → Eski state de değişmiş görünüyor]
Belirti → Action öncesinde tuttuğun sıradan nesne, işlemden sonra farklı.
Neden → `state.count += 1` yazımını slice reducer’ı dışında normal nesnede kullandın.
Düzeltme → Mutasyon benzeri yazımı yalnız RTK reducer’ının Immer draft’ında kullan; sıradan veriyi yerinde değiştirme.
:::

## Özet

- Action bir olayı taşır; `dispatch` onu store’a verir; reducer yeni state’i hesaplar.
- Slice başlangıç state’iyle ilgili reducer kurallarını ve action creator’larını bir arada tutar.
- Selector store’dan ihtiyaç duyulan değeri okur; `configureStore` reducer haritası root state yollarını belirler.
- RTK reducer’ındaki draft yazımı Immer sayesinde yeni immutable sonuç üretir.
- Middleware action ile reducer arasındaki ara katmandır; `preloadedState` store’un ilk state’ini verir.

**Yeni terimler:**

- **Store:** Uygulamanın ortak state’ini ve güncelleme akışını tutan yer.
- **Action / action creator / dispatch:** Sırasıyla olay bilgisi, olay nesnesini üreten fonksiyon ve olayı store’a gönderme.
- **Reducer / slice:** Yeni state’i hesaplayan kural / bu kuralları ve başlangıç state’ini özellik bazında toplayan RTK yapısı.
- **Selector:** State içinden component’in ihtiyaç duyduğu değeri okuyan fonksiyon.
- **Draft:** Immer’ın reducer’da geçici olarak düzenlenebilir sunduğu state görünümü.
- **Middleware / preloadedState:** Action’ı reducer öncesi gören ara katman / store’un oluşturulurken aldığı başlangıç state’i.

**Kendini yokla:** `trailerOpened(603)` çağrısı store’daki state’i hemen değiştirir mi?
*Cevap:* Hayır. Action oluşturur; state’in değişmesi için onu dispatch etmek gerekir.

**Kendini yokla:** `configureStore` içindeki `catalog` anahtarı neyi belirler?
*Cevap:* Root state’teki yolu belirler; katalog state’i `state.catalog` altında bulunur.
