---
title: "Immer ve değişmeyen snapshot"
minutes: 15
kind: concept
---

# Immer ve değişmeyen snapshot

JavaScript’te bir dizinin başına eleman eklemek için `unshift` kullanmış olabilirsin. Normal bir dizide bu çağrı dizinin kendisini değiştirir. Redux’ta ise eski state’i olduğu gibi tutmamız gerekir; böylece önceki ve yeni ekran durumlarını karşılaştırabiliriz.

```ts
const before = [7, 12]
const after = before.unshift(4)
```

Burada `before` artık `[4, 7, 12]` olur; `after` ise dizinin kendisi değil, yeni uzunluk olan `3` değeridir. Normal JavaScript’te bu beklenen davranıştır, ama Redux reducer’ında eski state’i değiştirmek geçmiş değeri de bozar.

## Önceki değeri korumak

Bir **snapshot**, state’in belirli bir andaki görünümüdür. Redux her güncellemede yeni bir snapshot üretir; eskisi değişmeden kalır. Böylece DevTools önceki adımı gösterebilir, test de reducer’a verdiği ilk değeri karşılaştırabilir.

![Bir state snapshot’ından Immer ile yeni immutable snapshot üretimini gösteren diyagram](diagram:state-snapshot)

Bu kurala **immutability** denir: oluşturulmuş state’i yerinde değiştirmez, güncelleme için yeni bir değer üretirsin. Eski ve yeni değer ayrı kalınca hangi action’ın neyi değiştirdiğini geriye dönüp okuyabilirsin.

Klasik reducer’da yeni diziyi kendin kurarsın:

```ts
type RecentState = { ids: number[] }

function addRecent(state: RecentState, id: number): RecentState {
  return { ids: [id, ...state.ids] }
}
```

`[id, ...state.ids]` yeni bir dizi üretir. `state.ids` eski sırasıyla kalır, dönen nesne ise yeni sıralamadır. Bu yöntem doğrudur; birkaç ardışık düzenleme gerektiğinde her adımı elle kopyalamak kodu uzatabilir.

Redux Toolkit’in `createSlice` reducer’ları bu kopyalamayı **Immer** adlı yardımcıyla yapar. Immer, reducer içindeki değişiklikleri izleyip sonunda eski state’i koruyan yeni state üretir. Bu yüzden reducer’da aşağıdaki gibi yazabiliriz:

```ts check
import { createSlice } from '@reduxjs/toolkit'

const viewHistorySlice = createSlice({
  name: 'viewHistory',
  initialState: { ids: [7, 12] },
  reducers: {
    add(state, action: { payload: number }) {
      state.ids.unshift(action.payload)
    },
  },
})

export default viewHistorySlice.reducer
```

Bu örnekte `unshift` gerçek state dizisini değiştirmiyor. `createSlice` callback’inin içindeki `state`, Immer’in takip ettiği geçici bir **draft**’tır; draft, değişiklik yazarken kullandığın çalışma kopyasıdır. Bu draft bir **Proxy** nesnesidir: özelliklerine yazılan değerleri yakalayıp Immer’e bildirir. Immer reducer bitince değişen alanlardan yeni snapshot üretir.

## Film listesini bir adım büyütelim

Şimdi aynı listenin en fazla dört film tutmasını isteyelim. Yeni bilgi yalnızca üst sınır: önce ID’yi başa ekle, ardından fazlalığı kes.

```ts check
import { createSlice } from '@reduxjs/toolkit'

const viewHistorySlice = createSlice({
  name: 'viewHistory',
  initialState: { ids: [7, 12, 4] },
  reducers: {
    add(state, action: { payload: number }) {
      state.ids.unshift(action.payload)
      state.ids.length = Math.min(state.ids.length, 4)
    },
  },
})

export default viewHistorySlice.reducer
```

`state.ids.length` ataması ve `unshift` yalnız draft üzerinde çalışır. Örneğin `9` eklenince yeni sonuç `[9, 7, 12, 4]` olur; önceki state hâlâ `[7, 12, 4]` değerini taşır. Immer burada kopyalama kodunu saklıyor, değişmezlik kuralını kaldırmıyor.

Listede aynı film iki kez görünmesin diyelim. Bunun için yeni satır, eklemeden önce var olan kopyayı bulup çıkarsın:

```ts check
import { createSlice } from '@reduxjs/toolkit'

const viewHistorySlice = createSlice({
  name: 'viewHistory',
  initialState: { ids: [7, 12, 4] },
  reducers: {
    add(state, action: { payload: number }) {
      const id = action.payload
      const index = state.ids.indexOf(id)
      if (index !== -1) state.ids.splice(index, 1)
      state.ids.unshift(id)
      state.ids.length = Math.min(state.ids.length, 4)
    },
  },
})

export default viewHistorySlice.reducer
```

`12` gelirse önce eski konumundan çıkar, sonra başa eklenir; sonuç `[12, 7, 4]` olur. Her satır draft’ı değiştiriyor, fakat dışarıdan saklanan önceki snapshot ara adımları görmüyor. Bu sırayı korumak, “önce” ve “sonra” durumlarını anlamlı tutar.

| Adım | Önceki state | Draft’ta yapılan | Reducer bitince |
| --- | --- | --- | --- |
| Başlangıç | `[7, 12, 4]` | — | henüz sonuç yok |
| Kopyayı çıkar | `[7, 12, 4]` | `[7, 4]` | henüz sonuç yok |
| Başa ekle | `[7, 12, 4]` | `[12, 7, 4]` | henüz sonuç yok |
| Sonuç | `[7, 12, 4]` | draft artık kullanılmaz | `[12, 7, 4]` |

## Aynı yazım her yerde güvenli değil

Draft sadece Immer’in yönettiği callback içinde vardır. Bir component’teki normal diziye `unshift` uygularsan dizi gerçekten değişir. Bu sık rastlanan hatayı küçük bir fonksiyonla görebilirsin:

```ts
function brokenAdd(ids: number[], id: number) {
  ids.unshift(id)
  return ids
}
```

Çağıran kod `const before = [7, 12]` saklayıp `brokenAdd(before, 4)` çağırırsa `before` da `[4, 7, 12]` olur. Belirti, reducer öncesi diye sakladığın listenin sonradan değişmesidir. Düzeltme: bu fonksiyonda `[id, ...ids]` gibi yeni dizi döndür; `unshift` yazımını yalnız `createSlice` reducer’ındaki draft’a uygula.

Immer’in bağımsız `produce` fonksiyonu da aynı fikri `createSlice` dışında kullanır. **`produce`**, eski değeri ve değişiklik callback’ini alıp yeni immutable sonuç döndüren fonksiyondur; örneğin küçük bir yardımcıda aynı snapshot kuralını korumak için kullanılır. Redux Toolkit bu fonksiyonu `createNextState` adıyla dışa açar; aşağıda yerel import adını `produce` olarak veriyoruz.

```ts check
import { createNextState as produce } from '@reduxjs/toolkit'

const before = { ids: [7, 12] }
const after = produce(before, (draft) => {
  draft.ids.unshift(4)
})

export { before, after }
```

Bu kodda `before.ids` hâlâ `[7, 12]`, `after.ids` ise `[4, 7, 12]` olur. `produce` yeni değeri oluşturur; `draft` ise yalnız callback sürerken düzenlenir. RTK slice’larında genellikle ayrıca `produce` çağırmazsın, çünkü `createSlice` bunu senin yerine zaten kullanır.

## Reducer’da iki seçenek var

Örneklerden sonra kuralı kısa söyleyebiliriz: reducer ya draft’ı değiştirir ve yeni state döndürmez ya da draft’a dokunmadan yepyeni state döndürür. İki yöntemi aynı reducer’da karıştırma.

```ts
// Draft yolunda: değiştir, return yazma.
state.status = 'ready'

// Yeni state yolunda: draft'a dokunmadan nesne döndür.
return { ...state, status: 'ready' }
```

Draft’ı değiştirip bir yandan nesne döndürürsen Immer hangi sonucu istediğini belirleyemez. Belirti, reducer çalışırken “state mutated and returned” benzeri bir hata görmendir. Bir yolu seçmek hem niyeti hem sonucu açık tutar.

Bir reducer’ın başlangıç state’i nesne ya da dizi ise draft yazımı kullanılabilir. Sayı veya string gibi ilkel bir değer proxy’ye sarılmaz; böyle bir state’i güncellerken yeni değeri `return` edersin. Bu ayrım, başlangıç state’inin biçimine göre hangi yazımın mümkün olduğunu açıklar.

:::info[Derinlemesine (isteğe bağlı)]
Immer değişen yoldaki nesne ve dizilere yeni referans verir, dokunulmayan dalları aynı referansla koruyabilir. Redux state’inde Promise, DOM düğümü veya class örneği yerine JSON’a çevrilebilen sade veriler tutmak DevTools ve kalıcılık araçlarıyla çalışmayı kolaylaştırır. Bu ayrıntılar, burada yazdığın temel reducer kuralını değiştirmez.
:::

## Özet

- Redux güncellemesi yeni snapshot üretir; reducer’a gelen önceki değer aynı kalır.
- Immer, `createSlice` içindeki draft değişikliklerini yeni immutable state’e çevirir.
- Draft yazımı Immer callback’inde güvenlidir; sıradan component kodunda mutasyon yapar.
- Reducer’da draft’ı değiştir veya yeni state döndür; ikisini karıştırma.

**Yeni terimler**

- **Draft:** Immer’in callback içinde izlediği geçici state görünümü.
- **Proxy:** Özelliklere erişimi izleyebilen JavaScript nesnesi; Immer değişiklikleri bununla takip eder.
- **`produce`:** Eski değerden ve draft callback’inden yeni immutable sonuç üreten Immer fonksiyonu.
- **Snapshot:** State’in belirli bir andaki, sonraki güncellemelerden etkilenmeyen değeri.

**Kendini yokla:** Slice reducer’ında `state.ids.unshift(id)` neden eski diziyi bozmaz?  
*Cevap:* `state` gerçek eski dizi değil, Immer’in izlediği draft’tır; reducer bitince Immer yeni sonuç üretir.

**Kendini yokla:** Draft’a yazıp sonra `{ ...state }` döndürmek neden hatalıdır?  
*Cevap:* Reducer hem draft yolunu hem yeni state yolunu kullanmış olur; bunlardan yalnız biri seçilmelidir.
