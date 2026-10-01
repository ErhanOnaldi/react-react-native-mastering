---
title: "Action’dan sonra yan etki"
minutes: 17
kind: concept
---

# Action’dan sonra yan etki

Bir Sinema sayfasında görünüm tercihini “sıkışık” yaptığını düşün. Ekran hemen değişiyor; sayfayı yenileyince tercih eski haline dönüyor. Redux state’i bellekte güncellendi ama `localStorage`’a yazılmadı.

Bu yazma işini reducer’a koymak ilk anda kolay görünür. Fakat reducer, aynı state ve action verildiğinde aynı sonucu üretmelidir. Storage’a dokunmak gibi uygulamanın dışındaki bir işi **yan etki** diye adlandırırız; bu işi reducer’dan ayrı tutmak test etmeyi ve state geçişini anlamayı kolaylaştırır. Redux Toolkit’in **listener middleware** aracı, belirli action’lardan sonra böyle bir işi çalıştırabilir.

## Önce state değişikliği, sonra dışarıya yazma

Bir reducer, state’i nasıl değiştireceğini anlatır. Önce yalnızca tercihi bellekte değiştiren küçük bir slice’a bakalım:

```ts check
import { createSlice } from '@reduxjs/toolkit'

const displaySlice = createSlice({
  name: 'display',
  initialState: { density: 'comfortable' as 'comfortable' | 'compact' },
  reducers: {
    setDensity(state, action: { payload: 'comfortable' | 'compact' }) {
      state.density = action.payload
    },
  },
})
void displaySlice
```

`setDensity('compact')` action’ı dispatch edilince reducer yeni tercihi hesaplar. Fakat tarayıcıyı yenileyince Redux store yeniden oluşturulur ve başlangıç değeri geri gelir. Bu beklenen bir sonuç: Redux store bellekteki state’i tutar, kalıcı kayıt kendiliğinden yapmaz.

Şimdi storage yazmayı reducer’ın yanına değil, Redux akışını görebilen bir ara katmana koyalım. **Middleware**, action’ın reducer’a ulaşması veya reducer’dan dönmesi sırasında çalışan ara katmandır. Listener middleware, dinleyeceği action’ı ve çalıştıracağı callback’i kaydeder:

```ts check
import { createListenerMiddleware, createSlice } from '@reduxjs/toolkit'

const displaySlice = createSlice({
  name: 'display',
  initialState: { density: 'comfortable' as 'comfortable' | 'compact' },
  reducers: {
    setDensity(state, action: { payload: 'comfortable' | 'compact' }) {
      state.density = action.payload
    },
  },
})
const listener = createListenerMiddleware()
listener.startListening({
  actionCreator: displaySlice.actions.setDensity,
  effect: (_action, api) => {
    const state = api.getState() as { display: { density: string } }
    localStorage.setItem('sinema:density', state.display.density)
  },
})
void listener
```

`effect`, eşleşen action’ın ardından çalışan fonksiyondur. İçindeki `api.getState()` ile güncel store okunur; action payload’ından elle state kurmaya gerek yoktur. Buradaki type assertion, örneği tek başına anlaşılır tutuyor; gerçek uygulamada listener’ı store tipine bağlayıp bu cast’i kaldırmak daha güvenlidir.

Son adımda listener middleware’i store’a ekle. RTK’nin varsayılan middleware’leri action’ları denetleyen ve thunk’ları çalıştıran hazır katmanları içerir. Bunları kaybetmemek için mevcut zincire listener’ı ekliyoruz:

```ts check
import { configureStore, createListenerMiddleware, createSlice } from '@reduxjs/toolkit'

const displaySlice = createSlice({
  name: 'display',
  initialState: { density: 'comfortable' as 'comfortable' | 'compact' },
  reducers: {
    setDensity(state, action: { payload: 'comfortable' | 'compact' }) {
      state.density = action.payload
    },
  },
})
const listener = createListenerMiddleware()
const store = configureStore({
  reducer: { display: displaySlice.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listener.middleware),
})
void store
```

Store artık `setDensity` action’ını reducer’a uygular, sonra eşleşen listener’ı çalıştırır. `prepend` listener’ı zincirin başına ekler; action’ın reducer sonrasındaki işini listener effect yapar. Varsayılan zinciri tamamen yeni bir diziyle değiştirmek, thunk gibi hazır davranışları yanlışlıkla kaldırabilir.

![Redux action akışını ve middleware katmanını gösteren diyagram](diagram:redux-veri-akisi)

## Action’dan güncel değere kadar izleyelim

Kullanıcı görünümü “sıkışık” seçtiğinde action payload’ı yeni tercihi taşır. Listener’ın effect’i reducer tamamlandıktan sonra çalıştığı için `getState()` yeni değeri görür:

| Sıra | Katman | Olan | Görülen değer |
| --- | --- | --- | --- |
| 1 | UI | Kullanıcı “sıkışık” seçer | Eski tercih: `comfortable` |
| 2 | Action | `setDensity('compact')` dispatch edilir | Payload: `compact` |
| 3 | Middleware | Action reducer’a iletilir | Henüz geçiş tamamlanmadı |
| 4 | Reducer | `display.density` güncellenir | Yeni state: `compact` |
| 5 | Listener effect | `api.getState()` çağrılır | `compact` |
| 6 | Storage | Tercih yazılır | `sinema:density` → `compact` |
| 7 | UI | Selector yeni state’i okur | Sıkışık görünüm |

Bu sıra önemlidir. Listener action dispatch edilmeden önce state okusaydı storage’a eski `comfortable` değeri yazılırdı. Action payload’ı “ne istendiğini”, `getState()` ise reducer’ın bu isteği uyguladıktan sonraki güncel sonucu verir.

## Storage hatası state değişikliğini geri almamalı

Bir sonraki küçük ekleme, storage erişiminin başarısız olabileceğini ele alıyor. Kullanıcı tarayıcı ayarında storage’ı kapatmış olabilir; `setItem` bu durumda hata fırlatabilir. State’in yine de kullanılabilir olması için yazmayı korumalı bir blokta yap:

```ts check
import { createListenerMiddleware, createSlice } from '@reduxjs/toolkit'

const displaySlice = createSlice({
  name: 'display',
  initialState: { density: 'comfortable' as 'comfortable' | 'compact' },
  reducers: {
    setDensity(state, action: { payload: 'comfortable' | 'compact' }) {
      state.density = action.payload
    },
  },
})
const listener = createListenerMiddleware()
listener.startListening({
  actionCreator: displaySlice.actions.setDensity,
  effect: (_action, api) => {
    const state = api.getState() as { display: { density: string } }
    try {
      localStorage.setItem('sinema:density', state.display.density)
    } catch {
      // Storage yazılamasa da Redux state güncel kalır.
    }
  },
})
```

Şimdi storage yazma hatası görünümü eski haline çevirmiyor; Redux state geçişi ve kalıcılık birbirinden ayrılmış oluyor. Ürüne göre hata sessizce geçilebilir ya da kullanıcıya “bu cihazda kaydedilemedi” denebilir. Her durumda storage erişiminin başarılı olduğunu varsaymamalısın.

## Daha gerçekçi bir tercih kaydı

Sinema’da kart yoğunluğu tercihini kaydetmek, tek bir boolean yerine gerçek bir UI tercihi verir. Action sonrası güncel state’ten tek alanı alıp JSON string olarak storage’a yazabiliriz:

```ts check
import { configureStore, createListenerMiddleware, createSlice } from '@reduxjs/toolkit'

const displaySlice = createSlice({
  name: 'display',
  initialState: { density: 'comfortable' as 'comfortable' | 'compact' },
  reducers: {
    setDensity(state, action: { payload: 'comfortable' | 'compact' }) {
      state.density = action.payload
    },
  },
})
const listener = createListenerMiddleware()
listener.startListening({
  actionCreator: displaySlice.actions.setDensity,
  effect: (_action, api) => {
    const state = api.getState() as { display: { density: string } }
    try {
      localStorage.setItem('sinema:density', JSON.stringify(state.display.density))
    } catch {
      // Tercih ekranda kullanılabilir; kayıt başarısız olabilir.
    }
  },
})
const store = configureStore({
  reducer: { display: displaySlice.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listener.middleware),
})
store.dispatch(displaySlice.actions.setDensity('compact'))
```

Listener yalnızca ilgili action’da çalışır ve yalnızca saklamak istediğimiz tercihi yazar. Başka bir action, örneğin fragman panelini açmak, aynı kaydı güncellemez. Ayrıca API’den gelen TMDB filmlerini bu storage’a kopyalamıyoruz; onların cache sahibi Query’dir. Saklama kararını verinin kim olduğuna ve hangi ekranların kullandığına göre ver.

## Reducer içinde yazarsan ne olur?

Bu kod state güncellemesiyle tarayıcı kaydını aynı reducer’a karıştırır:

```ts title="Kırık: reducer storage'a yazıyor"
setDensity(state, action) {
  state.density = action.payload
  localStorage.setItem('sinema:density', state.density)
}
```

Belirti, storage erişimi kapalıyken reducer’ın hata vermesi ve state güncellemesinin de yarıda kalabilmesidir. Ayrıca reducer testi için tarayıcı storage’ı kurman gerekir. Düzeltme olarak reducer yalnızca state geçişini yapar; storage yazımı ilgili action’dan sonra listener effect’inde ve hata yönetimiyle çalışır.

Kayıt daha sonra geri yüklenecekse `JSON.parse` sonucunu doğrudan doğru tipte varsayma. JSON geçerli olsa bile beklenen yapıda olmayabilir; parse hatasını yakala, değeri kontrol et ve uygun değilse güvenli başlangıç tercihini kullan. Basit bir uygulama için bu kadar yeterlidir.

## Özet

- Reducer aynı state ve action’dan aynı sonucu hesaplar; storage yazmak yan etkidir.
- Listener middleware belirli action’ı izler ve reducer tamamlandıktan sonra effect çalıştırır.
- `api.getState()` listener effect’inde yeni state’i verir.
- Varsayılan middleware zincirini koru; storage hatasının state güncellemesini bozmamasını sağla.
- Yalnız kalıcı olması gereken client state’i yaz; server verisinin cache’ini Query’de bırak.

**Yeni terimler:**

- **Yan etki:** State hesabının dışında, storage veya ağ gibi bir sisteme dokunan işlem.
- **Middleware:** Action ile reducer akışı arasında çalışan ara katman.
- **Listener middleware:** Seçtiğin action’lardan sonra callback çalıştıran RTK aracı.
- **Effect:** Listener’ın eşleşen action sonrasında çağırdığı fonksiyon.

**Kendini yokla:** Listener effect’indeki `getState()` dispatch öncesi mi, reducer sonrası mı çalışır?  
*Cevap:* Reducer sonrası; güncellenmiş state’i verir.

**Kendini yokla:** Storage yazımı hata verirse Redux state’i de geri almalı mıyız?  
*Cevap:* Hayır; kalıcılık başarısız olabilirken ekrandaki Redux state kullanılabilir kalmalıdır.

:::info[Derinlemesine (isteğe bağlı)]
Birden fazla action aynı kaydı değiştiriyorsa listener matcher ile onları eşleyebilirsin. Listener API’sini `TypedStartListening` ile store tipine bağlamak type assertion ihtiyacını kaldırır. Sık yazma için debounce, büyük kayıtlar için IndexedDB düşünülebilir; kayıt biçimi değişirse migration gerekebilir. Açılışta storage’dan okurken `JSON.parse` hatasını yakala, dış verinin şeklini doğrula ve eski kayıtlar için varsayılan davranışı belirle.
:::
