---
title: "Immer ve değişmeyen snapshot"
minutes: 15
kind: concept
---

# Immer ve değişmeyen snapshot

:::pain[Sinema’da sorun]
Son açılan filmi listenin başına koymak için reducer’da diziyi `unshift` ile değiştirdin. Eski state’i saklayan bir test de şimdi yeni sıralamayı görüyor. Önceki snapshot yerinde değiştiği için “önce” ve “sonra” arasındaki fark silindi.
:::

## Snapshot kuralını Redux’ta hatırla

:::model[State snapshot ve immutability]
Bir render belirli bir props/state snapshot’ını görür. Yeni state, eski nesneleri yerinde değiştirmek yerine yeni referanslarla üretilir; React değişimi bu kimliklerden izler. Redux reducer’ı da önceki state’i bozmadan yeni snapshot üretmelidir. Immer, bu kuralı koruyarak reducer içinde değişiklik yazımını sadeleştirir.
:::

![Bir state snapshot'ından Immer ile yeni immutable snapshot üretimini gösteren diyagram](diagram:state-snapshot)

Redux Toolkit `createSlice` reducer’larında Immer kullanır. Reducer’daki `state` parametresi normal state nesnesi gibi görünse de bir **draft** proxy’sidir. Draft’a atama yaptığında Immer değişiklikleri izler ve reducer tamamlanınca yeni immutable sonuç üretir. Önceki state nesnesi ve ona ait diziler korunur.

Kurallar:

1. **Eski snapshot değişmez.** Reducer çağrısından önceki nesne ve içindeki referanslar aynı değerleri taşımaya devam eder.
2. **Draft yalnız Immer kapsamındadır.** `createSlice` reducer’ı ve Immer’in `produce` callback’i içinde mutasyon benzeri yazım güvenlidir. Normal component kodunda aynı sözdizimi gerçek mutasyondur.
3. **Bir reducer iki yol seçer.** Draft’ı değiştirip `undefined` bırakabilir veya tamamen yeni state döndürebilir.
4. **Aynı reducer’da ikisini karıştırma.** Draft’ı değiştirdikten sonra yeni bir nesne döndürmek belirsiz ve hatalı sonuç verir.
5. **Her değer Immer’e uygun değildir.** Store state’i ve action payload’ları serileştirilebilir plain data olmalı; DOM düğümü, Promise, class instance veya fonksiyon saklama.
6. **Değişmeyen dallar korunabilir.** Immer yalnız değişen yollar için yeni referans üretir; değişmeyen alt nesneler aynı kalabilir.

## Bir öğeyi listenin başına taşı

Bir okuma uygulamasında son açılan makalelerin ID’leri `[7, 12, 4]` olsun. Kullanıcı `12` numaralı makaleyi tekrar açınca sonuç `[12, 7, 4]` olmalı. `12` tekrar eklenmemeli ve eski snapshot `[7, 12, 4]` olarak kalmalı.

| An | Eski state | Draft üstündeki adım | Yeni state |
| --- | --- | --- | --- |
| Başlangıç | `[7, 12, 4]` | ID 12’yi eski yerinden çıkar | draft `[7, 4]` |
| Öne al | Aynı snapshot | ID 12’yi başa koy | draft `[12, 7, 4]` |
| Reducer biter | Hâlâ `[7, 12, 4]` | Immer değişen diziyi üretir | `[12, 7, 4]` |

Bu zaman çizelgesinde eski state’in ara adımlardan hiçbirini görmediğine dikkat et. React’in state snapshot modelinde event handler da o render’da gördüğü sabit değeri taşır; Redux DevTools ve saf reducer testleri de aynı değişmezlik sayesinde geçişleri sırayla inceleyebilir.

## Kırık: reducer dışındaki mutasyon

RTK olmadan yazılmış sıradan reducer’da `push` eski diziyi değiştirir:

```ts title="Kırık: eski state dizisini yerinde değiştir"
type ReadingState = { ids: number[] }
function addReading(state: ReadingState, id: number): ReadingState {
  state.ids.unshift(id)
  return state
}
```

`const previous = { ids: [7, 12] }` sakladıktan sonra bu fonksiyonu çağırırsan `previous.ids` da `[12, 7, 12]` olur. Saf Redux reducer beklentisine aykırıdır. RTK `createSlice` içinde draft sayesinde benzer yazım doğru olabilir; ancak bu kod normal bir fonksiyondur ve Immer proxy’si yoktur.

## Doğru: Immer draft’ı veya immutable kopya

Slice reducer’ında her adım draft’a uygulanır:

```ts check
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type ReadingState = { ids: number[] }
const readingSlice = createSlice({
  name: 'reading',
  initialState: { ids: [] } as ReadingState,
  reducers: {
    openArticle(state, action: PayloadAction<number>) {
      const id = action.payload
      const index = state.ids.indexOf(id)
      if (index !== -1) state.ids.splice(index, 1)
      state.ids.unshift(id)
      state.ids.length = Math.min(state.ids.length, 4)
    },
  },
})

export const openArticle = readingSlice.actions.openArticle
export default readingSlice.reducer
```

`splice`, `unshift` ve `length` ataması burada draft’ı değiştirir. Immer reducer tamamlanınca immutable sonucu üretir. Eski state’in dış referanslarını elle kopyalamana gerek kalmaz.

İstersen immutable işlemleri de yazabilirsin. Immer zorunlu stil değildir. Spread ve `filter` kullanmak reducer’ı saf tutar; fakat birkaç ardışık kural için geçici diziler üretmek kodu uzatabilir. Takımın okuma kolaylığına göre iki stilden birini seç; slice’ın dışındaki sıradan dizileri Immer varmış gibi değiştirme.

## Mutasyon mu, state’i değiştirmek mi?

Immer “mutasyon sorun değildir” demez; draft üzerindeki işlemleri değişmez snapshot modeline çevirir. Bu ayrım özellikle nested state’te önemlidir. `state.profile.name = 'Ada'` yazımı Immer içinde güvenli olabilir, ama `const person = state.profile; person.name = 'Ada'` de aynı draft referansını tuttuğu için Immer kapsamı içindeyse izlenir. Buna karşılık reducer’dan draft nesnesini dışarı sızdırmak veya `state`i daha sonra saklamak yanlıştır.

Bir reducer’ın mantığını test ederken hem yeni sonucu hem önceki girdiyi kontrol et. Bu test yalnız liste sırasını değil, değişmezlik sözleşmesini de kanıtlar. Geniş, gerçek state ağacına ihtiyaç yoksa slice reducer’ını doğrudan çağırabilirsin.

### Reducer’ın dönüş değerini seç

Bir draft alanına doğrudan atama yapabilirsin: `state.status = 'ready'`. Bir alt diziyi hesaplayıp draft alanına atamak da geçerlidir: `state.ids = state.ids.filter(...)`. Her iki durumda da reducer dönüş değeri yeni state’i el ile taşımaz; Immer draft değişikliklerinden sonucu oluşturur.

Başka bir seçenek tüm state’i değiştirmektir. Reducer draft’a dokunmadan `{ ...state, status: 'ready' }` döndürebilir. Bu stil özellikle discriminated union state geçişlerinde okunaklı olabilir. Ama draft’ta bir alanı değiştirdikten sonra yeni nesne döndürme; Immer bunun hangi güncellemenin kazandığını belirleyemez ve açık hata verir.

Primitive başlangıç state’lerinde davranış biraz farklı görünür. Sayı veya string draft proxy’ye sarılamaz; bu tiplerde reducer yeni değeri `return` etmelidir. Nesne/dizi state kullandığın `createSlice` örneklerinde mutasyon benzeri draft yazımı yaygındır. Hangi biçimde olduğunu başlangıç state tipi belirler.

### Kopyalama derinliği

Immutable güncelleme, her alt nesneyi elle kopyalamak demek değildir. Immer değişiklik yolundaki nesneleri kopyalar, dokunulmayan dalların referansını koruyabilir. Bu yüzden `state.profile.name` değiştiğinde `profile` yeni referans alır; `preferences` gibi ilgisiz dal aynı kalabilir. Bu yapı selector aboneliklerinin yalnız değişen dala göre sonuç üretmesine yardım eder.

Eski snapshot’ın korunması, yalnız test kolaylığı sağlamaz. Redux DevTools önceki action state’ini ve yeni state’i ayrı ayrı gösterebilir. React component’leri önceki render’ın state değerlerini closure içinde kullanmaya devam eder. Yerinde mutasyon yapılsaydı eski render’ın gördüğü nesnenin içeriği de sonradan değişebilir, zaman içindeki davranış yanıltıcı olurdu. Immutability bu tarih çizgisini korur.

## Sınır durumları

:::mistake[Belirti → Immer hata mesajı “mutated state returned”]
Belirti → Reducer draft’ı değiştirdikten sonra TypeScript hatası veya Immer runtime hatası alıyorsun.  
Neden → Aynı reducer hem `state.ids.push(...)` ile draft’ı değiştirmiş hem `return { ... }` ile yeni state döndürmüş.  
Düzeltme → Yalnız draft’ı değiştirip dönüş yapma ya da draft’a dokunmadan yeni state döndür.
:::

:::mistake[Belirti → Eski test verisi reducer sonrasında değişti]
Belirti → Reducer’dan önce aldığın `previous.ids` beklentisi artık yanlış.  
Neden → Immer dışındaki bir fonksiyon veya component eski state dizisini doğrudan değiştirmiş.  
Düzeltme → Mutasyon benzeri satırın gerçekten RTK reducer callback’i içinde olup olmadığını kontrol et; normal kodda yeni dizi oluştur.
:::

:::mistake[Belirti → Store’daki alan JSON’a dönmüyor]
Belirti → DevTools uyarı veriyor veya kalıcılık kodu değeri kaydedemiyor.  
Neden → State’e Promise, Set, class örneği veya başka serileştirilemeyen değer eklenmiş.  
Düzeltme → Plain object, dizi, string, number, boolean ve `null` kullan; türetilmiş nesneleri selector’da üret.
:::

:::mistake[Belirti → Redux dışındaki bir nesne beklenmedik biçimde değişti]
Belirti → Component’teki bir listede reducer’a gönderilen diziden öğe kayboldu.  
Neden → Action payload’ındaki diziyi reducer dışında da kullanan kod yerinde değiştirmiş ya da payload’ı state’e aynen taşımış.  
Düzeltme → Action verisini immutable data gibi ele al; gerekliyse sınırda kopyala ve state’i yalnız reducer kurallarıyla güncelle.
:::

:::sector
Immer, reducer kodunu kısa tutarken Redux’un zaman yolculuğu ve güvenilir karşılaştırma özelliklerini korur. Ekip standardı olarak state ve action payload’larını serileştirilebilir tutmak, DevTools ve persistence davranışını öngörülebilir kılar. Immer draft’larını reducer callback’i dışına çıkarmamak da bu standardın parçasıdır.
:::

## Özet

- Her render ve reducer geçişi belirli bir state snapshot’ı görür; önceki snapshot değişmez.
- RTK slice reducer’ında Immer draft’a yazmayı immutable state üretimine çevirir.
- Draft’ı değiştirme veya yeni state döndürme yollarından birini seç; ikisini karıştırma.
- Immer benzeri sözdizimini reducer dışındaki normal nesnelere uygulama.
- State ve action’larda serileştirilebilir plain data tercih et.

**Kendini yokla:** Immer reducer’ında `state.ids.push(id)` eski state dizisini gerçekten değiştirir mi?  
*Cevap:* Hayır. Draft değişir; Immer yeni immutable sonuç üretir.

**Kendini yokla:** Reducer draft’a yazdıktan sonra neden yeni nesne döndürmemelisin?  
*Cevap:* Reducer iki farklı güncelleme modelini aynı anda kullanmış olur; tek yolu seçmek gerekir.
