---
title: "Bağlantılı durumlar tek akışta"
minutes: 16
kind: concept
---

# Bağlantılı durumlar tek akışta

Bir film kartındaki beğeni sayısını göstermek için `useState` yeterlidir. Değişiklik yalnızca bu sayıdaysa, `setLikes(likes + 1)` gibi tek bir güncelleme anlaşılır kalır.

```tsx
const [likes, setLikes] = useState(0)

function handleLike() {
  setLikes((current) => current + 1)
}
```

Bir rezervasyon ekranında ise seçilen koltuklar, adım, işlem durumu ve hata mesajı birbirine bağlıdır. Ödeme başarısız olduğunda hata yazılırken işlem göstergesinin de kapanması gerekir. Birlikte değişen alanlar çoğalınca geçiş mantığını tek yerde tutmak yararlı olur.

## Olayı state geçişine dönüştür

**Reducer**, mevcut state ile gelen olayı alıp yeni state'i döndüren saf fonksiyondur. Olayın kendisine **action** deriz: örneğin "koltuk seçildi" veya "ödeme başarısız oldu". Reducer `useState` setter'ları gibi bileşene dağılmaz; aynı girdileri verdiğinde aynı state'i üretir.

En küçük reducer, bir koltuk sayacını artırabilir:

```ts check
type SeatCountAction = { type: 'seatSelected' }

function seatCountReducer(count: number, action: SeatCountAction): number {
  if (action.type === 'seatSelected') return count + 1
  return count
}
```

`seatSelected` action'ı geldiğinde reducer bir fazla sayı döndürür; önceki sayı dışarıdan değiştirilmez. `useReducer`, reducer'ı React state'ine bağlayan Hook'tur. Bu Hook iki değer verir: güncel state ve **dispatch** adlı, action'ı reducer'a ileten fonksiyon. Bileşenin sayacı ekranda göstermesi için şöyle bağlarız:

```tsx
const [seatCount, dispatch] = useReducer(seatCountReducer, 0)

return <button onClick={() => dispatch({ type: 'seatSelected' })}>
  Koltuk seç ({seatCount})
</button>
```

Tıklamada action gönderilir, reducer yeni sayıyı hesaplar, sonraki render bu sayıyı gösterir. Tek sayı için reducer şart değil; burada yalnızca geçişin şeklini tanıtıyoruz.

## Bir olay birden çok alanı birlikte günceller

Bir film seansında koltuk seçilince hata mesajı temizlenmeli, koltuk bırakılınca da aynı kural geçerli olsun. Action'ların olası biçimlerini TypeScript'te bir **discriminated union** ile yazarız: bu, ortak `type` alanına göre birbirinden ayrılan nesne türlerinin birleşimidir.

```ts
type SeatState = {
  selected: string[]
  error: string | null
}

type SeatAction =
  | { type: 'select'; seatId: string }
  | { type: 'remove'; seatId: string }

function seatReducer(state: SeatState, action: SeatAction): SeatState {
  switch (action.type) {
    case 'select':
      return { selected: [...state.selected, action.seatId], error: null }
    case 'remove':
      return {
        selected: state.selected.filter((id) => id !== action.seatId),
        error: null,
      }
  }
}
```

`action.type` değeri `select` olduğunda TypeScript `action.seatId` alanının var olduğunu bilir; iki olayın verileri karışmaz. Yeni diziler oluşturduğumuz için eski state'e dokunmadan seçim listesini ve hata mesajını tek geçişte güncelleriz.

**Immutability**, var olan nesne veya diziyi yerinde değiştirmeyip değişmiş bir kopya üretme kuralıdır. Örnekte `push` yerine yeni dizi döndürürüz; React değişmiş state'i yeni değer olarak işler.

## Rezervasyon akışını adım adım izle

Şimdi bir katman daha ekleyelim: ödeme başlatılır, sonra ya başarılı olur ya hata verir. Her action hangi alanları değiştireceğini bilir; bir olayla birlikte değişen alanlar reducer'ın aynı dönüş değerinde güncellenir.

```ts check
export type BookingState = {
  step: 'seats' | 'payment' | 'done'
  selectedSeats: string[]
  processing: boolean
  error: string | null
}

export type BookingAction =
  | { type: 'chooseSeat'; seatId: string }
  | { type: 'startPayment' }
  | { type: 'paymentFailed'; message: string }
  | { type: 'paymentSucceeded' }

export function bookingReducer(
  state: BookingState,
  action: BookingAction,
): BookingState {
  switch (action.type) {
    case 'chooseSeat':
      return {
        ...state,
        selectedSeats: [...state.selectedSeats, action.seatId],
        error: null,
      }
    case 'startPayment':
      return { ...state, step: 'payment', processing: true, error: null }
    case 'paymentFailed':
      return { ...state, processing: false, error: action.message }
    case 'paymentSucceeded':
      return { ...state, step: 'done', processing: false, error: null }
  }
}
```

Her action yeni bir `BookingState` döndürür. `...state` mevcut alanları korur; ilgili olayın değiştirdiği alanlar yeni nesnede güncellenir. Örneğin `paymentFailed` hem işlemi kapatır hem mesajı yazar; ayrı setter'lardan birini unutma riski azalır.

| An | State | Action / işlem | Sonraki ekranda |
| --- | --- | --- | --- |
| İlk render | `processing: false`, `error: null` | henüz yok | Ödeme düğmesi görünür |
| Ödemeye tıklama | handler'ın elinde hâlâ eski state | `dispatch({ type: 'startPayment' })` | Reducer işlem state'ini hazırlar |
| Yeni render | `processing: true` | handler tamamlanmıştır | Yükleniyor göstergesi görünür |
| İstek reddedilir | önceki render'ın state'i | handler `paymentFailed` gönderir | Reducer işlem durumunu kapatır ve mesajı yazar |
| Sonraki render | `processing: false`, hata metni dolu | yeni state | Gösterge kapanır, hata görünür |

`dispatch` çağrısı handler içindeki `state` değişkenini anında değiştirmez; handler başladığı render'ın state değerini görmeye devam eder. Yeni değer reducer'ın sonucudur ve sonraki render'da görünür.

![Önceki state ve action'ın saf reducer üzerinden yeni state üretmesi](diagrams/reducer-gecisleri.svg "Reducer dış etki yapmadan yeni state hesaplar.")

### Ağ işi handler'da, state hesabı reducer'da

Ödeme isteği gibi dış dünyayla konuşan işi reducer'ın içine koymayız. Event handler isteği başlatabilir ve sonucuna göre action dispatch edebilir; reducer yalnızca o action'a uygun state'i hesaplar.

```tsx
async function handlePayment() {
  dispatch({ type: 'startPayment' })

  try {
    await sendBookingRequest()
    dispatch({ type: 'paymentSucceeded' })
  } catch {
    dispatch({ type: 'paymentFailed', message: 'Ödeme tamamlanamadı' })
  }
}
```

Burada ağ isteği handler içinde gerçekleşir. Başarı veya hata action'ı geldikten sonra reducer yeni ekran durumunu üretir; böylece aynı state/action çifti her zaman aynı sonucu verir.

:::mistake[Reducer'da state'i doğrudan değiştirmek]
**Belirti:** `state.selectedSeats.push(action.seatId)` sonrası seçim ekranda görünmez ya da state başka yerde de değişmiş gibi davranır. **Neden:** `push` eski diziyi yerinde değiştirir ve aynı nesne referansı kalır. **Düzeltme:** `[...state.selectedSeats, action.seatId]` ile yeni dizi oluştur ve yeni state nesnesi döndür.
:::

:::mistake[Her şeyi reducer'a taşımak]
**Belirti:** Tek bir arama kutusu için uzun bir `switch` ve çok sayıda action oluşur. **Neden:** Birbirinden bağımsız basit değerler de gereksiz yere bir akışa bağlanmıştır. **Düzeltme:** Az ve bağımsız state alanları için `useState` kullan; birlikte değişmesi gereken alanlar çoğalınca reducer'ı seç.
:::

## Yeni akış ne kazandırır?

Reducer dış sistemlere dokunmadığı için doğrudan fonksiyon gibi incelenebilir: belirli bir state ve action verip dönen state'in doğru olduğunu kontrol edersin. DOM kurmak veya butona tıklamak gerekmez. Aynı saf hesaplamanın tekrar çalışması da sonucu değiştirmez; React geliştirme sırasında hesaplamaları denetleyebilir.

Bu yaklaşım her state için gerekli değildir. Reducer, bir olay birden çok alanı etkilediğinde geçişleri görünür kılar ve her dalın hangi alanları değiştirdiğini tek yerde toplar.

## Özet

- `useReducer` state değişimlerini `(state, action) => newState` akışında toplar.
- Action adları ne olduğunu söyler; reducer olayın state'te hangi alanları değiştireceğine karar verir.
- Reducer saf kalır: ağ isteği handler'da yapılır, sonucu action olarak reducer'a gönderilir.
- Yeni state ve içindeki değişen diziler yeni değer olmalıdır; eskisini yerinde değiştirme.
- Bağlantılı alanlar için reducer kullan; basit ve bağımsız değerlerde `useState` yeterlidir.

**Yeni terimler:**

- **Reducer:** Mevcut state ve action'dan yeni state üreten saf fonksiyon.
- **Action:** Gerçekleşen olayı ve gerekirse ona ait veriyi taşıyan nesne.
- **Dispatch:** Action'ı reducer akışına ileten fonksiyon.
- **Discriminated union:** Ortak bir `type` alanıyla ayrılan TypeScript nesne türleri.
- **Immutability:** Mevcut nesneyi değiştirmeden yeni nesne veya dizi üretme yaklaşımı.

**Kendini yokla:** Ödeme isteğini neden reducer'ın içinde başlatmıyoruz?

*Cevap:* Ağ isteği dış etkidir ve aynı state/action çağrısında tekrarlanmamalıdır; handler isteği yapıp sonucu action olarak bildirir.

**Kendini yokla:** `dispatch({ type: 'startPayment' })` sonrasında aynı handler'daki `state.processing` hemen `true` olur mu?

*Cevap:* Hayır. Handler o render'ın state değerini görür; yeni değer sonraki render'da görünür.
