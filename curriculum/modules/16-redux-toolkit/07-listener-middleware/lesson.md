---
title: "Action’dan sonra yan etki"
minutes: 14
kind: concept
---

# Action’dan sonra yan etki

:::pain[Sinema’da sorun]
Bir kullanıcı tercihini yenilemeden önce sayfa bellekte doğru gösteriyor, yeniledikten sonra varsayılana dönüyor. `localStorage.setItem` çağrısını reducer’a ekledin; bu kez aynı reducer test ortamında storage bulunmadığı için çöküyor ve state kuralı browser’a bağımlı hale geliyor.
:::

## Saf reducer, dış sistem middleware

:::model[Redux veri akışı]
Action dispatch edilir, middleware zincirinden geçer, reducer state’i günceller ve selector’lar yeni sonucu okur. Reducer saf state geçişi yapar; middleware, dispatch çevresindeki dış dünya işlerini üstlenebilir. Yeni nokta, listener’ın güncel state’i reducer çalıştıktan sonra okuyabilmesidir.
:::

![Redux action akışı ve middleware katmanı](diagram:redux-veri-akisi)

Reducer aynı state ve action için aynı sonucu üretmelidir. Bu şart Redux DevTools’un action’ları tekrar oynatmasını ve birim testlerinin tarayıcı olmadan çalışmasını sağlar. Storage’a yazmak, log göndermek veya başka bir action dispatch etmek reducer’ın işi değildir.

Redux Toolkit’in `createListenerMiddleware` araca katılan action’ları izler. Bir action dispatch edildikten, reducer’lar yeni state’i ürettikten sonra eşleşen listener’ın `effect` fonksiyonu çağrılır. Bu sırada `listenerApi.getState()` yeni state’i verir. Böylece reducer saf kalırken güncel değer dış sisteme yazılabilir.

1. **Reducer yalnız geçişi hesaplar.** Storage, ağ, timer ve log yoktur.
2. **Listener bir olaya bağlanır.** `actionCreator` veya matcher ile hangi action’ın ilgi alanında olduğunu tarif eder.
3. **Effect reducer sonrasında çalışır.** `getState()` ile geçiş sonrası snapshot okunabilir.
4. **Middleware store’a eklenir.** `configureStore` varsayılan middleware’lerini koruyup listener middleware’i `prepend` veya `concat` ile zincire ekler.
5. **Yan etki başarısız olabilir.** Browser storage kapalı, kota dolu veya JSON bozuk olabilir; arayüzün ana state geçişi bundan bağımsız ele alınmalıdır.

## Sıralamayı adım adım izle

Kullanıcı görünüm tercihini “sıkışık” yapıyor. Listener bu tercihi storage’a kaydediyor.

| Zaman | Katman | Olan | Okunan değer |
| --- | --- | --- | --- |
| 1 | UI | Kullanıcı “sıkışık” seçer | Eski görünüm tercihi |
| 2 | Action | `setDensity('compact')` oluşturulur | Payload: `compact` |
| 3 | Middleware | Listener action’ı görür, reducer’a geçirir | Henüz eski state |
| 4 | Reducer | `display.density` güncellenir | Yeni state: `compact` |
| 5 | Listener effect | `getState()` çağrılır | Yeni state: `compact` |
| 6 | Storage | JSON string yazılır | `{ density: 'compact' }` |
| 7 | UI | Selector sonucu yeni değeri okur | Sıkışık görünüm |

Listener’ı action’dan önce yazmaya çalışırsan eski değeri saklama riski vardır. Olayı dinlemek yeterli değil; gereken katmandan ve doğru zamanda state almak önemlidir.

## Doğru yerde storage yaz

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
      localStorage.setItem('reader:density', state.display.density)
    } catch {
      // Storage kullanılamasa da Redux state değişimi tamamlandı.
    }
  },
})
const store = configureStore({
  reducer: { display: displaySlice.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listener.middleware),
})
store.dispatch(displaySlice.actions.setDensity('compact'))
```

Örnekte `api.getState()` tipi store’a özel `RootState` olarak bağlanması için cast edildi; kurulumda listener’ı tiplemek için `TypedStartListening` tanımlanabilir. Bu küçük örnek cast’i gösteriyor, uygulamada type assertion sayısını sınırlamak daha doğru. Middleware zincirinin callback’i varsayılan thunk, serializable ve immutable kontrollerini korur.

Uygulama açılırken storage’dan başlangıç verisi de okunabilir. Bu işlem store yaratılırken bir `loadPreferences()` fonksiyonunda yapılabilir; JSON `parse` hata verebileceği ve storage erişimi reddedilebileceği için `try/catch` gerekir. Geçersiz veya eski kayıt için varsayılan state seç. Saklanan biçimi değiştirirsen kayıt sürümü ve migration stratejisi düşün.

### Kalıcılık kaydı bir sınır verisidir

`JSON.parse` sonucu güvenilir bir tip değildir. Geçerli JSON, beklediğin yapıda olmak zorunda değildir: `null`, string veya eksik alanlı nesne gelebilir. TypeScript’te `as ClientState` yazmak runtime doğrulaması yapmaz. `unknown` kabul et, gerekli alanların tipini kontrol et veya Zod şemasıyla doğrula. Hatalı kayıtta varsayılanı kullanmak, uygulamanın açılmasını bozuk istemci verisine bağlamaz.

Kayıt biçiminin sürümünü eklemek migration’ı yönetir. Örneğin v1’de tema doğrudan string, v2’de `{ theme, density }` nesnesi olmuş olabilir. Başlangıçta sürümü kontrol edip dönüştürme yaparsın; bilinmeyen daha yeni sürüm varsa onu eski kodla sessizce ezmek yerine varsayılan davranış seçilebilir. Böylece dağıtım güncellemesi kullanıcının tercihlerini anlamsızlaştırmaz.

Storage yazma işi küçük görünse de başarısızlık durumları vardır. Kullanıcı browser ayarlarından storage’ı kapatabilir, özel gezinme ortamında erişim hata verebilir veya kota dolabilir. Listener’daki `try/catch` state değişimini korur. Hatanın sessizce yutulması kabul edilebilir mi, kullanıcıya “bu cihazda kaydedilemedi” uyarısı mı gösterilmeli kararını ürün gereksinimi belirler.

### Hangi action’ları dinlemeli?

Her action’dan sonra bütün store’u yazmak basit ama gereksiz olabilir. Örneğin arayüzde yalnız geçici açık/kapalı dialog varsa her dialog tıklamasında bütün kişisel tercihleri storage’a yazmana gerek yoktur. Kalıcı olması gereken feature action’larını dinlemek veya store state’ini tek bir persistence listener’ında kontrollü biçimde kaydetmek seçeneklerdir.

Birden çok action aynı kayıt biçimini etkiliyorsa listener matcher kullanıp tek effect’te state snapshot’ını yazabilirsin. Ancak sık dispatch edilen değerleri `localStorage`’a senkron yazmak ana thread’de iş yapar. Büyük state veya çok sık güncellemede debounce, IndexedDB veya sunucu tarafı persistence gerekebilir. Bu ek katmanı, gerçek yazma maliyeti ya da ürün gereksinimi ortaya çıkınca getir.

Persistence’ta yalnız gereken client alanlarını yaz. API’den gelen TMDB yanıtını storage’a kopyalamak hem Query cache’ini ikinci bir kaynak yapar hem de gereksiz eski veri tutar. Formun yarım kalmış hassas alanları da ürün ve güvenlik kararı olmadan kalıcılaştırılmamalıdır.

## Kırık örnek: reducer içinden storage

```ts title="Kırık: reducer dış dünyaya dokunuyor"
setDensity(state, action) {
  state.density = action.payload
  localStorage.setItem('reader:density', state.density)
}
```

State geçişi artık browser storage’ın varlığına bağlı. Reducer testinde `localStorage` taklidi kurmak zorunda kalırsın; server rendering veya private mode gibi ortamlar da hata çıkarabilir. State yine güncellenmeli, kalıcılık başarısızlığı ayrı değerlendirilmelidir.

## Sınır durumları

:::mistake[Belirti → İlk tıklamada eski tercih yazılıyor]
Belirti → Kullanıcı `compact` seçti, storage’da `comfortable` kaldı.  
Neden → Listener eski state’i action dispatch edilmeden önce okuyor.  
Düzeltme → Listener effect içinde reducer sonrası `api.getState()` çağır.
:::

:::mistake[Belirti → Yenilemede bozuk JSON uygulamayı durduruyor]
Belirti → `JSON.parse` exception fırlatıyor ve ekran açılmıyor.  
Neden → Storage içeriği dışarıdan değişebilir veya eski sürümde yazılmış olabilir.  
Düzeltme → Parse işlemini koru; şekli doğrula ve hata/uyumsuzlukta güvenli varsayılanı kullan.
:::

:::mistake[Belirti → Listener middleware eklenince thunk tipi ya da davranışı bozuluyor]
Belirti → Async action middleware’den geçmiyor.  
Neden → Varsayılan middleware listesi tamamen değiştirilmiş veya listener yanlış ekleme noktasına konmuş.  
Düzeltme → `getDefaultMiddleware()` sonucunu koru ve listener’ı `prepend`/`concat` ile ekle.
:::

:::mistake[Belirti → Storage yazma hatası state güncellemesini iptal ediyor]
Belirti → Storage erişim hatasında tema/tercih ekranda da değişmiyor.  
Neden → Yan etki hatası uygulama state geçişine geri taşınmış.  
Düzeltme → Storage hatasını kontrollü ele al; Redux state’in kullanılabilirliği kalıcılıktan ayrı olsun.
:::

:::sector
Listener middleware, action sonrası loglama, storage kalıcılığı ve başka bir action başlatma gibi uygulama düzeyi tepkiler için uygundur. Süreçte iptal, tekrar deneme ve cache yönetimi gerekiyorsa bu ihtiyaca uygun araç seçilir. Kalıcı veriye schema sürümü eklemek ve kullanıcıya ait bilgiyi cihazdan çıkarmadan saklamak ekiplerin sık koyduğu kurallardandır.
:::

## Özet

- Reducer saf ve tekrar üretilebilir state geçişidir; storage yazmaz.
- Listener belirli action’ı gözler ve reducer sonrası effect çalıştırır.
- Yeni state’i `listenerApi.getState()` ile oku.
- `configureStore` varsayılan middleware’lerini koru, listener middleware’i zincire ekle.
- Storage başlangıcı, bozuk kayıt ve erişim hatası güvenli varsayılanla ele alınır.

**Kendini yokla:** Listener effect içinde `getState()` hangi state’i verir?  
*Cevap:* Eşleşen action’ın reducer’lar tarafından işlenmesinden sonraki state’i.

**Kendini yokla:** Neden `localStorage.setItem` reducer’a konmaz?  
*Cevap:* Reducer’ın saf ve tekrar üretilebilir olması gerekir; storage dış dünya yan etkisidir.
