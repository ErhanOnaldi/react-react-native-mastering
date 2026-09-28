---
title: "Store ve slice ile tek kural"
minutes: 18
kind: concept
---

# Store ve slice ile tek kural

:::pain[Sinema’da sorun]
Favori ekleme kuralı kartta, arama sayfasında ve detay ekranında ayrı ayrı yazılmış. Bir ekranda tekrar tıklayınca favori kaldırılıyor, diğerinde ikinci kopya oluşuyor. Beş Context’i tek değere toplamak bu iş kuralını ortaklaştırmıyor; yalnızca değerleri taşımaya devam ediyor.
:::

## Redux’un döngüsü

Redux Toolkit, ortak client state’e yapılan değişiklikleri adlandırılmış olaylardan geçirir. Bir bileşen ne olduğunu anlatan bir **action** gönderir. Store ilgili reducer’ları çalıştırır, yeni state’i saklar ve abonelere yeni görünümü bildirir. Bileşen, ihtiyacı olan sonucu bir selector ile okur.

![dispatch, middleware, reducer, store, selector ve UI arasındaki döngü](diagram:redux-veri-akisi)

Bu model için kurallar net olmalı:

1. **Store tek ortak state ağacıdır.** Her slice kendi alanını yönetir; örneğin `pantry` ve `settings`.
2. **Action olayı tarif eder.** Action creator’dan çıkan değer `{ type, payload? }` biçimli serileştirilebilir bir nesnedir. `type`, olayın adını; `payload` ise o olay için gereken veriyi taşır.
3. **Reducer geçişi belirler.** Reducer eski state ve action’a göre yeni state’i hesaplar. Aynı girdilerle aynı sonucu üretmelidir; ağ veya `localStorage` gibi dış dünya işi yapmaz.
4. **Slice kuralı ve action’ı bir arada tutar.** `createSlice`, başlangıç state’ini, reducer’ları ve action creator’larını üretir.
5. **Dispatch döngüyü başlatır.** `store.dispatch(action)` middleware zincirinden geçer; reducer’lar tamamlanır, store güncellenir, ilgili aboneler yeni sonucu okur.
6. **UI state’i yalnızca okur ve olay gönderir.** Görünüm hesaplaması component’te; ortak geçiş kuralı reducer’dadır.
7. **Bir kez oluşturulan store uygulamaya sağlanır.** React ağacındaki bileşenler `Provider` üzerinden aynı store’a erişir.

`configureStore` RTK’nin önerilen kurulumudur. Geliştirme kontrolleri ve temel middleware’leri ekler; reducer ağacını da tek yerde toplar. Birkaç slice’ı `combineSlices` ile birleştirip sonucu `configureStore`’a verebilirsin. Küçük örnekte nesne biçimli reducer haritası da uygundur.

## Bir paketin yolculuğu

Kilerdeki ürün miktarını artıran `restock` olayını düşün. State başlangıçta `{ items: [{ name: 'Mercimek', count: 2 }] }` olsun. Kullanıcı üç paket aldığını kaydeder.

| Sıra | Kodun yaptığı | Değer |
| --- | --- | --- |
| 1 | `restock({ name: 'Mercimek', count: 3 })` action creator çağrılır | `{ type: 'pantry/restock', payload: { ... } }` |
| 2 | `dispatch` action’ı store’a verir | Middleware action’ı iletir |
| 3 | `pantry` reducer’ı eşleşen case’i bulur | Eski sayım: `2` |
| 4 | Reducer yeni miktarı hesaplar | `2 + 3 = 5` |
| 5 | Store yeni state’i kaydeder | `count: 5` |
| 6 | Selector `count` değerini okur | `5` |
| 7 | React commit eder | Ekranda “5 paket” görünür |

Action tek başına state’i değiştirmez. Reducer’a ulaşması gerekir. Reducer da UI’yi doğrudan değiştirmez; store güncellendikten sonra component yeni değeri okur. Akışı ayırmak, “butona basınca ne oldu?” sorusunu bileşen içindeki rastgele mutasyonlardan çıkarıp izlenebilir bir geçişe dönüştürür.

## Slice kuralı: önce kırık, sonra doğru

Component içinde state’i doğrudan değiştiren saf bir JavaScript nesnesi Redux’un güvenli geçişini sağlamaz:

```ts title="Kırık: paylaşılan state'i yerinde değiştir"
type PantryState = { count: number }
const pantry: PantryState = { count: 2 }

function addPackages(amount: number) {
  pantry.count += amount
  return pantry
}
```

Çağıran kodun tuttuğu `pantry` nesnesi aynı referansla değişti. Eski ve yeni görünüm arasındaki sınır kayboldu. React ve Redux, değişim tespiti için referans kimliğinden yararlanabilir; aynı nesneyi değiştirmek abonelerin beklediği yeni snapshot’ı vermez.

Slice içinde Immer draft’ı kullanarak geçişi okunur yazarsın. Buradaki mutasyon gibi görünen satır yalnız `createSlice` reducer’ının özel bağlamında güvenlidir:

```ts check
import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit'

type PantryState = { count: number }
const pantrySlice = createSlice({
  name: 'pantry',
  initialState: { count: 0 } satisfies PantryState,
  reducers: {
    restock(state, action: PayloadAction<number>) {
      state.count += action.payload
    },
  },
})

const store = configureStore({ reducer: { pantry: pantrySlice.reducer } })
export const restock = pantrySlice.actions.restock
export type RootState = ReturnType<typeof store.getState>
store.dispatch(restock(3))
const count = store.getState().pantry.count
void count
```

RTK’de reducer’ın `state.count += amount` satırı gerçek eski state’i değiştirmez. Immer bir draft üzerinde çalışır ve yeni immutable sonuç üretir. Bu esneklik yalnız `createSlice`/Immer reducer bağlamındadır; dışarıda normal bir nesneye aynı satırı yazarsan mutasyon olur.

Slice adı, Redux DevTools’ta ve action türlerinde görünür. `pantry/restock` adı, “hangi değer değişti?” yerine “hangi olay oldu?” sorusunu cevaplar. Action’ı birden çok ekrandan dispatch edebilmek, kuralın her ekranda yeniden kurulmasına gerek bırakmaz.

## Store’u bir araya getir

Birden çok özellik bağımsız reducer’lara sahipse her biri kök state’te bir anahtar alır. Aşağıdaki küçük kurulumda ürün sayacı ile görünüm tercihi farklı alanlardadır:

```ts title="İki slice, bir store"
import { combineSlices, configureStore, createSlice } from '@reduxjs/toolkit'

const stockSlice = createSlice({
  name: 'stock',
  initialState: { count: 0 },
  reducers: { addOne: (state) => { state.count += 1 } },
})
const displaySlice = createSlice({
  name: 'display',
  initialState: { compact: false },
  reducers: { toggleCompact: (state) => { state.compact = !state.compact } },
})
const rootReducer = combineSlices(stockSlice, displaySlice)
const store = configureStore({ reducer: rootReducer })
```

Store’un state şekli `{ stock: { count: number }, display: { compact: boolean } }` olur. Özellik sınırı hem state ağacında hem action adlarında görünür. Slice’ları farklı dosyalara koyabilirsin; store dosyası onları birleştirir.

### Action adlarını olay diliyle kur

Action type Redux DevTools’ta kalır ve hata ayıklarken değişiklik geçmişini okumaya yardım eder. `pantry/restock` “miktar 5 olsun” gibi sonucu değil, “stok yenilendi” olayını anlatır. İki farklı component aynı action creator’ı kullanınca iş kuralı ortak kalır. Payload yalnız reducer’ın geçişi hesaplaması için gereken en küçük bilgiyi taşımalıdır; bütün component props’unu veya API cevabını action’a koymak gerekmeyebilir.

Action creator’ı çağırmak da dispatch ile aynı şey değildir. `pantrySlice.actions.restock(3)` action nesnesini oluşturur; `store.dispatch(...)` onu zincire verir. Bu ayrım, event handler’da action’ı üretip göndermeyi, testte ise reducer’a action’ı doğrudan vererek tek bir geçişi izole etmeyi mümkün kılar.

### Kök state şekli bir sözleşmedir

`configureStore({ reducer: { stock: stockSlice.reducer } })` yazdıysan kök state anahtarı `stock` olur. Slice’ın `name` değeri action type’larını adlandırır; reducer haritasındaki anahtar ise state ağacının yolunu belirler. Bunlar çoğu zaman aynı ad olsa da aynı kavram değildir. `name: 'stock'` olan slice’ı `inventory` anahtarına bağlarsan bileşenler `state.inventory` okur.

Bu state şekli selector’ları, preloaded state’i ve DevTools incelemesini etkiler. Store büyüdükçe feature sınırlarını root anahtarlarında tutmak gezinmeyi kolaylaştırır. Her şeyi tek `app` nesnesine koymak da geçerlidir ama feature’ların reducer sahipliğini daha az görünür yapar. Kök şekli üründeki veri sınırına göre belirle.

### Provider’ı uygulama sınırında kur

React Redux `Provider`, store nesnesini React context üzerinden alt bileşenlere verir. Uygulama girişinde tek bir varsayılan store sağlayabilirsin. Testlerde veya birden fazla bağımsız uygulama örneğinde ise `setupStore()` benzeri factory her çağrıda yeni store üretir. Tek bir module singleton’ı kullanırsan her test ve render aynı state’i paylaşabilir.

Redux Provider ile TanStack Query Provider aynı ağaçta birlikte bulunabilir; her biri kendi verisinin erişim sınırıdır. Provider sırasını seçerken birinin diğerinin state’ini kapsadığını varsayma. Bileşen yalnız store’daki client seçimini ve Query’den gelen katalog verisini birlikte okuyabilir; iki provider da ilgili consumer’ların üstünde olmalıdır.

Bu örnekte reducer’lar inline arrow function olarak yazılmış. Gerçek ekipte satırları ayrı satırlara yaymak okunabilirliği artırır; burada önemli olan iki ayrı reducer’ın birleştirilmesi. `combineSlices` mevcut reducer’ları bir araya getirir ve gerektiğinde lazy-loaded slice eklemek için de kullanılabilir. Bu modülde statik kök kurulum yeterlidir.

## Sınırlar ve sık hatalar

:::mistake[Belirti → Action görünüyor ama state beklenmiyor]
Belirti → DevTools’ta `pantry/restock` var; miktar değişmiyor.  
Neden → Action creator çağrılmış ama sonucu `dispatch` edilmemiş olabilir; ya da slice reducer’ı store’a bağlanmamıştır.  
Düzeltme → Önce action’ın `type` değerini, ardından reducer ağacındaki slice anahtarını ve store dispatch’ini izle.
:::

:::mistake[Belirti → Reducer her çağrıda farklı sonuç üretiyor]
Belirti → Aynı action bazen farklı bir tarih veya rastgele kimlik üretiyor.  
Neden → Reducer’ın içine saat, random, ağ veya storage gibi gizli girdiler konmuş.  
Düzeltme → Gerekli değeri olay gerçekleştiği yerde hesapla ve action payload’ında taşı; reducer yalnız state dönüşümünü yapsın.
:::

:::mistake[Belirti → Slice dışındaki diziler de değişiyor]
Belirti → Reducer’dan önce sakladığın eski liste, action sonrası farklı.  
Neden → Immer dışındaki normal nesnede mutasyon yaptın veya reducer’dan gelen taslağı sızdırdın.  
Düzeltme → Mutasyon gibi yazımı yalnız RTK reducer içinde kullan; dışarıda immutable güncelleme uygula.
:::

:::mistake[Belirti → Store’da aynı özellik için iki anahtar var]
Belirti → `state.stock` ve `state.stockSlice` gibi beklenmeyen bir şekil görüyorsun.  
Neden → Slice’ın adı ile store’daki reducer anahtarının farklı olabileceğini gözden kaçırdın.  
Düzeltme → `configureStore` reducer haritasında seçtiğin anahtarı kök state sözleşmesi olarak kabul et ve selector’ları ona göre yaz.
:::

:::sector
Takımlar Redux DevTools action geçmişini hata raporlarında tekrar üretilebilir bir iz olarak kullanabilir. Bu değer, olay adlarının anlamlı ve payload’ların serileştirilebilir olmasıyla artar. Kişisel bilgi veya sırları payload’a koymamak ve dış dünya işlerini middleware/thunk katmanında tutmak ekip standardı olmalıdır.
:::

## Özet

- Action bir olayı anlatır; reducer saf state geçişini hesaplar; store sonucu saklar.
- `createSlice` başlangıç state’i, reducer ve action creator’larını birlikte üretir.
- `configureStore` reducer’ları ortak state ağacına bağlar; `combineSlices` slice’ları birleştirebilir.
- Immer, RTK reducer’ında mutasyon benzeri yazımı immutable sonuca dönüştürür.
- Reducer’da ağ, saat, random veya storage gibi yan etkiler bulunmaz.

**Kendini yokla:** `createSlice` ile üretilen action creator’ı çağırmak state’i değiştirir mi?  
*Cevap:* Hayır. Oluşan action store’a `dispatch` edilmelidir.

**Kendini yokla:** `state.count += 1` neden slice reducer’ında güvenli ama sıradan nesnede güvenli değil?  
*Cevap:* RTK reducer’ında Immer draft’ı günceller; sıradan nesnede aynı satır gerçek nesneyi mutasyona uğratır.
