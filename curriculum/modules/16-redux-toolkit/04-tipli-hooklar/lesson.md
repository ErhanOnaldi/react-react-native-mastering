---
title: "React’i store’a tipli bağla"
minutes: 14
kind: concept
---

# React’i store’a tipli bağla

:::pain[Sinema’da sorun]
Bir kartta store’dan koleksiyon okurken `state` için `any` kullandın. İkinci ekranda kök state tipini elle yazdın; store’a yeni bir alan eklenince bu kopya güncellenmedi. TypeScript derledi ama yanlış anahtar ancak ekranda gezinince fark edildi.
:::

## Hook tipi store’dan türesin

React Redux bileşenlerini store’a `Provider` bağlar. `useSelector` state’i okur, `useDispatch` action gönderir. Bu hook’ların uygulamanın gerçek state ve dispatch biçimini bilmesi gerekir. Tipleri elle kopyalamak yerine store’dan türetmek, kurulum değiştikçe bileşenlerin de doğru tipte kalmasını sağlar.

:::model[Redux veri akışı]
Bir action `dispatch` edilir, middleware zincirinden geçer, reducer state’i günceller ve selector’lar yeni değer okur. React bileşeni yalnız okuduğu sonuç değiştiğinde güncellenir. Bu derste yeni olan, bu okuma ve yazma bağlantısının TypeScript tiplerini store’dan türetmektir.
:::

![Redux dispatch'ten UI seçimine uzanan akış](diagram:redux-veri-akisi)

1. **Store tipi kaynağıdır.** `RootState`, `store.getState()` dönüşünden; `AppDispatch`, `store.dispatch` türünden türetilir.
2. **Tipli hook’lar bir kez tanımlanır.** React Redux 9.3’ün `.withTypes<T>()` metodu mevcut hook’a uygulama tipini bağlar.
3. **Bileşen hook’u Provider içinde çağırır.** Tipler hangi verinin okunabileceğini denetler; çalışma zamanında gerçek store’u Provider sağlar.
4. **Selector mümkün olduğunca dar sonuç döndürür.** Bir boolean veya primitive değer, geniş state nesnesine göre daha açık bir abonelik ihtiyacıdır.
5. **Dispatch tipi action’ları izler.** Store’a middleware veya thunk eklenince `AppDispatch` de bu davranışa uygun hale gelir.

Bir önceki derste slice’ların ayrı state alanları oluşturduğunu gördün. Burada aynı alanlar TypeScript tarafından da bilinir. Bu tipli sınır, state’i runtime’da doğrulamaz; store’un kendi kodunda yanlış alan erişimini derleme sırasında yakalar.

## Tipler nereden geliyor?

| Tanım | Kaynak | Ne anlatır? |
| --- | --- | --- |
| `RootState` | `ReturnType<typeof store.getState>` | Store’un tüm reducer alanları |
| `AppDispatch` | `typeof store.dispatch` | Kabul edilen action/thunk’lar |
| `useAppSelector` | `useSelector.withTypes<RootState>()` | Selector parametresinin gerçek tipi |
| `useAppDispatch` | `useDispatch.withTypes<AppDispatch>()` | Gönderilen action’ın gerçek tipi |

Bu türleri store’u oluşturan dosyadan veya özel `hooks.ts` dosyasından dışa ver. Store dosyası uygulamaya özgü tiplerin kaynağı olmalı; component içinde her kez `ReturnType` yazmak aynı bilgiyi farklı yerlere dağıtır.

## Render’da seçilen değeri izle

Bir mutfak ekranında her satır kendi ürününün stokta olup olmadığını gösteriyor. Bileşen tüm store nesnesini kullanmamalı; yalnız kendi `itemId` değerine ait boolean’ı seçebilir. Action gönderme de aynı store dispatch’inden geçer.

```tsx check
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { Provider, useDispatch, useSelector } from 'react-redux'

const stockSlice = createSlice({
  name: 'stock',
  initialState: { ids: [] as number[] },
  reducers: {
    markAvailable(state, action: { payload: number }) {
      if (!state.ids.includes(action.payload)) state.ids.push(action.payload)
    },
  },
})
const store = configureStore({ reducer: { stock: stockSlice.reducer } })
type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch
const useReaderSelector = useSelector.withTypes<RootState>()
const useReaderDispatch = useDispatch.withTypes<AppDispatch>()

function StockFlag({ itemId }: { itemId: number }) {
  const available = useReaderSelector((state) => state.stock.ids.includes(itemId))
  const dispatch = useReaderDispatch()
  return (
    <button onClick={() => dispatch(stockSlice.actions.markAvailable(itemId))}>
      {available ? 'Stokta' : 'Stokta değil'}
    </button>
  )
}

export function Example() {
  return <Provider store={store}><StockFlag itemId={42} /></Provider>
}
```

Selector `state.stock.ids.includes(itemId)` ile boolean döndürür. Başka bir özellik değişse de sonuç `false` ise `false` kalır. React Redux varsayılan olarak önceki ve yeni selector sonucunu referans/sıkı eşitlikle karşılaştırır; aynı primitive değer bileşenin store güncellemesi nedeniyle yeniden render olmasını önler. Parent render’ı, props değişimi veya başka React tetikleri yine çalıştırabilir; selector tüm render’ları engelleyen bir kilit değildir.

Kodun içinde `Provider` statik olarak uygulamanın tepesine yerleştirilir. Testlerde de her örnek için taze store kullanmak, bir testin diğerinin state’ini kirletmesini önler. Store’u tüketen bileşen Provider dışında render edilirse tip kontrolü bunu yakalamaz; çalışma anında React Redux store bağlamı hatası verir. TypeScript ile runtime sağlayıcının görevleri ayrıdır.

### Abonelik ne zaman render başlatır?

`useAppSelector` hook’u selector’ı store güncellemelerinde çalıştırır ve önceki sonuçla karşılaştırır. Store state nesnesinin tamamı değişmiş olabilir; component’in sonucu aynı boolean ise yalnız bu abonelik sebebiyle yeni render gerekmez. Bu, her render’ı durduran genel bir memo mekanizması değildir. Parent’ın yeni props göndermesi, Context değişimi veya local state güncellemesi yine bileşeni render edebilir.

Dar selector yazmak, React’in verdiği bu karşılaştırma sınırını anlamlı hale getirir. `state.stock.ids.includes(itemId)` belirli bir satırın tek kararını ifade eder. `state.stock` gibi geniş bir nesne seçersen her stok güncellemesi satırı render edebilir. Eğer bu satır başka stok alanlarını da gösteriyorsa bu doğru olabilir; seçim darlığı yalnız görünüm gereksinimine göre belirlenir, performans adına gerekli veriyi gizleme.

### Tipler, inference ve sınırları

`RootState` store’dan türediği için feature reducer’ı eklendikçe kök tip de güncellenir. `useAppSelector` callback’inde `state` artık bu kök şekildir; yanlış anahtar veya eksik alan derleme hatası verir. `AppDispatch` da `configureStore` tarafından kurulan middleware’leri hesaba katar. Örneğin thunk dispatch etmek, çıplak Redux `Dispatch` tipinde olmayan bir davranıştır; store’un dispatch türünü kullanmak bu farkı saklamaz.

Bu tipler yalnız uygulamanın kendi kodundaki doğru şekli temsil eder. API’den gelen JSON’u `RootState` diye cast etmek onu runtime’da doğrulamaz; önceki Zod dersindeki gibi dış veriye sınır doğrulaması gerekir. Ayrıca bir selector fonksiyonunun `RootState` alıyor olması, yanlış değer döndürmesini engellemez. Tipler yapıyı denetler, iş kuralının anlamını değil.

React Redux’un `.withTypes` kullanımı her feature için yeni hook üretmek yerine tek uygulama hook’u sunar. Bileşenler altyapıdan gelen genel hook’ları değil, uygulamanın bu tipli arayüzünü import eder. Bu yaklaşım store tipinin kaynağını merkezde tutar; feature dosyasının kendi küçük selector’ı ise hangi değere abone olduğunu açıkça gösterir.

## Geniş seçim neden sorun?

Kırık selector her çağrıda yeni nesne üretir:

```tsx title="Her seçimde yeni nesne"
const summary = useReaderSelector((state) => ({ ids: state.stock.ids }))
```

Store güncellendiğinde selector yeniden çalışır. `{ ids: ... }` yeni nesne olduğu için önceki sonuçla eşit değildir; bileşen, `ids` dizisinin kendisi değişmemiş olsa bile render olabilir. Önce doğrudan ihtiyacın olan alanı seç:

```tsx title="Dizi referansını doğrudan seç"
const ids = useReaderSelector((state) => state.stock.ids)
```

Birden çok değer gerekiyorsa sonraki derste memoized selector ve eşitlik stratejilerini göreceksin. Basit seçimde gereksiz soyutlama kurma.

## Sınır durumları

:::mistake[Belirti → State parametresi `any` oluyor]
Belirti → `state.missing.path` yazınca TypeScript hata vermiyor.  
Neden → Tipli hook yerine çıplak `useSelector` kullanılmış veya selector parametresi `any` olarak anotasyonlanmış.  
Düzeltme → Store’dan `RootState` türet ve `useSelector.withTypes<RootState>()` ile uygulama hook’u oluştur.
:::

:::mistake[Belirti → `Provider` olmasına rağmen store bulunamıyor]
Belirti → Uygulama çalışınca “could not find react-redux context value” hatası alıyorsun.  
Neden → Bileşen Provider ağacının dışında render ediliyor; tip tanımı bunu garanti etmez.  
Düzeltme → Root bileşen ağacını gerçek store verilen Provider ile sar; testte de Provider kullan.
:::

:::mistake[Belirti → İlgisiz action her kartı render ediyor]
Belirti → Stok dışında ayar güncellenince satır bileşenleri de çalışıyor.  
Neden → Selector tüm `RootState` nesnesini veya her çağrıda yeni bir nesneyi döndürüyor.  
Düzeltme → Yalnız bileşenin gösterdiği alanı seç; birden çok türetilmiş alan için memoization’ı ancak gerekince ekle.
:::

:::mistake[Belirti → Slice ekledikten sonra selector alanı eksik]
Belirti → `state.stock` bulunamıyor veya beklenmedik kök anahtarı var.  
Neden → `RootState` store tipinden türetilmek yerine elle kopyalanmış, ya da reducer store’a bağlanmamış.  
Düzeltme → Reducer haritasını ve store tiplerini tek kaynaktan oluştur.
:::

:::sector
Takımlar genellikle store tipleri ve tipli hook’ları `app` katmanında merkezileştirir. Böylece feature bileşenleri altyapı ayrıntısı tekrarlamaz, yeni middleware eklenince dispatch tipi de güncellenir. `connect` halen mevcut olsa da React Redux 9.3 yeni React kodu için hook kullanımını önerir ve `connect`’i deprecated olarak işaretler.
:::

## Özet

- `RootState` ve `AppDispatch` kurulu store’dan türetilir; elle ikinci kez tarif edilmez.
- React Redux 9’un `.withTypes` metodu uygulamaya özel selector ve dispatch hook’ları oluşturur.
- `Provider` çalışma zamanında store’u sağlar; TypeScript bu bağlantının varlığını garanti etmez.
- Dar selector sonucu ilgisiz store değişimlerinde yeniden render ihtimalini azaltır.
- Yeni nesne döndüren selector, girdiler değişmese bile eşitlik kontrolünü bozabilir.

**Kendini yokla:** Store’a yeni bir reducer alanı eklendiğinde `RootState` nasıl güncel kalır?  
*Cevap:* `store.getState()` dönüşünden türetildiği için yeni alan tipi otomatik yansır.

**Kendini yokla:** `Provider` varlığını `RootState` tipi kanıtlar mı?  
*Cevap:* Hayır. Tipler derleme zamanında çalışır; Provider çalışma zamanında React context sağlar.
