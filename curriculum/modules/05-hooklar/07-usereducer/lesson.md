---
title: "Bağlantılı durumlar tek akışta"
minutes: 14
kind: concept
---

# Bağlantılı durumlar tek akışta

:::pain[Problem]
Sinema bilet alma adımında koltuk seçimi, adım durumu, ödeme işlemi ve hata mesajı dört ayrı `useState` ile yönetiliyor. Ödeme başarısız olduğunda hata mesajı yazılıyor ama `isProcessing` açık kalıyor; kullanıcı geri dönüp koltuk değiştirdiğinde eski hata mesajı ekranda asılı kalıyor. Ayrı setter'lar arttıkça arayüz tutarsız ara durumlara saplanıyor.
:::

## Geçişleri isimlendirmek ve sonlu durum makinesi

Birden fazla state alanı aynı kullanıcı eylemiyle birlikte değişmek zorundaysa, bu alanları ayrı `useState` çağrılarıyla tek tek yönetmek hata payını katlar. Bir fonksiyonda `setLoading(false)` satırını yazmayı unuttuğunda ekran sonsuza dek yükleniyor kalabilir.

`useReducer`, karmaşık state geçişlerini saf bir fonksiyon arkasında toplar. Mantık şudur:
- State'in **mevcut durumu** bellidir.
- Bir **olay (action)** meydana gelir ("koltuk seçildi", "ödeme başladı", "hata oluştu").
- Reducer fonksiyonu bu ikisini alır ve **yeni state** nesnesini safça hesaplayıp döndürür.

![Önceki state ve action'ın saf reducer üzerinden yeni state üretmesi](diagrams/reducer-gecisleri.svg "Reducer dış etki yapmadan yeni state hesaplar.")

Kurallar:

1. **Reducer saf bir fonksiyondur:** `(state, action) => newState`. Aynı girdi her zaman aynı çıktıyı üretir; içinde asla `fetch`, `localStorage`, `Math.random()` veya DOM işlemi yapılamaz.
2. **Action bir olay adıdır:** Setter fonksiyonu gibi eylem emretmez (`setIsProcessingTrue`); neyin gerçekleştiğini söyler (`payStart`).
3. **Birlikte değişenler birlikte yazılır:** Bir olay birden fazla alanı etkiliyorsa, o olayın dönüş nesnesinde tüm alanlar tek seferde güncellenir.
4. **Discriminated Union ile tip güvenliği:** Action tipleri TypeScript `type` birleşimiyle daraltılır. Böylece yanlış payload kullanımı derleme aşamasında yakalanır.
5. **İmmutability kuralı:** Reducer mevcut `state` nesnesini asla mutasyona uğratmaz; her zaman `{ ...state }` ile yeni bir nesne referansı döndürür.

:::model[TypeScript narrowing]
`action.type` kontrolü union tipini daraltır. `type: 'selectSeat'` dalında TypeScript `action.seatId` değerinin varlığını garanti ederken, `type: 'payError'` dalında `action.message` alanını zorunlu tutar. Tip sistemi, yanlış verinin yanlış olaya sızmasını derleme anında engeller.
:::

## Bilet rezervasyonu geçiş tablosu

Karmaşık bir akışı kodlamadan önce durum matrisini çıkarmak en sağlıklı yaklaşımdır:

| Action (`type`) | `step` | `selectedSeats` | `isProcessing` | `error` | Açıklama |
| --- | --- | --- | --- | --- | --- |
| `selectSeat` | korunur | yeni koltuk eklenir | korunur | `null` (temizlenir) | Koltuk seçilince hata temizlenir |
| `deselectSeat` | korunur | koltuk çıkarılır | korunur | `null` (temizlenir) | Koltuk iptali |
| `proceedToPayment`| `'payment'`| korunur | korunur | `null` | Ödeme adımına geçiş |
| `payStart` | korunur | korunur | `true` | `null` | İşlem başladı |
| `paySuccess` | `'success'`| korunur | `false` | `null` | Başarıyla tamamlandı |
| `payError` | korunur | korunur | `false` | yeni hata metni | **İşlem biter, hata yazılır** |
| `reset` | `'seats'` | `[]` | `false` | `null` | Baştan başlama |

Bu tablo sayesinde "ödeme patlarsa `isProcessing` ne olur?" sorusunun yanıtı tek bir satırda (`payError`) kilitlenmiş olur.

## Kırık yaklaşım: Dağınık setter zincirleri

```tsx
function handlePaymentFailure(errorMessage: string) {
  setError(errorMessage)
  // UNUTULAN SATIR: setIsProcessing(false)
  // Kullanıcı sonsuza dek dönen bir spinner ile baş başa kalır!
}

function handleSeatChange(seatId: string) {
  setSelectedSeats((prev) => [...prev, seatId])
  // UNUTULAN SATIR: setError(null)
  // Eski hata mesajı yeni koltuk seçilmesine rağmen ekranda kalır!
}
```

Setter'lar bileşenin farklı fonksiyonlarına dağıldığında bir alanı güncellemeyi unutmak kaçınılmazdır.

## Doğru yaklaşım: Tipli reducer tasarımı

Durumları ve olayları eksiksiz tipleştirip tek bir saf fonksiyonda topluyoruz:

```ts check
export type BookingState = {
  step: 'seats' | 'payment' | 'success'
  selectedSeats: string[]
  isProcessing: boolean
  error: string | null
}

export type BookingAction =
  | { type: 'selectSeat'; seatId: string }
  | { type: 'deselectSeat'; seatId: string }
  | { type: 'proceedToPayment' }
  | { type: 'payStart' }
  | { type: 'paySuccess' }
  | { type: 'payError'; message: string }
  | { type: 'reset' }

export function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'selectSeat':
      return {
        ...state,
        selectedSeats: [...state.selectedSeats, action.seatId],
        error: null,
      }
    case 'deselectSeat':
      return {
        ...state,
        selectedSeats: state.selectedSeats.filter((id) => id !== action.seatId),
        error: null,
      }
    case 'proceedToPayment':
      if (state.selectedSeats.length === 0) {
        return { ...state, error: 'Lütfen en az bir koltuk seçin' }
      }
      return { ...state, step: 'payment', error: null }
    case 'payStart':
      return { ...state, isProcessing: true, error: null }
    case 'paySuccess':
      return { ...state, isProcessing: false, step: 'success', error: null }
    case 'payError':
      return { ...state, isProcessing: false, error: action.message }
    case 'reset':
      return { step: 'seats', selectedSeats: [], isProcessing: false, error: null }
  }
}
```

Bileşen tarafında bu yapıyı kullanmak tek bir satıra bakar:
```tsx
const [state, dispatch] = useReducer(bookingReducer, initialBookingState)
```

Artık butonlar yalnızca olay bildirir: `dispatch({ type: 'payStart' })`.

## Reducer'ı test etmek neden bu kadar kolaydır?

Reducer'ın saf fonksiyon olmasının en büyük ödülü test yazarken ortaya çıkar. Bir React bileşenini test etmek için DOM ortamı kurmak (jsdom), bileşeni render etmek ve butonlara tıklamak gerekir. Oysa bir reducer'ı test etmek için yalnızca saf JavaScript yeterlidir:

```ts
// Saf birim testi (Bileşen veya DOM gerekmez):
const prevState: BookingState = {
  step: 'payment',
  selectedSeats: ['A1', 'A2'],
  isProcessing: true,
  error: null,
}

const nextState = bookingReducer(prevState, {
  type: 'payError',
  message: 'Kart limiti yetersiz',
})

// Doğrudan iddialar:
expect(nextState.isProcessing).toBe(false)
expect(nextState.error).toBe('Kart limiti yetersiz')
expect(nextState.selectedSeats).toEqual(['A1', 'A2'])
```

Bu sadelik sayesinde onlarca farklı uç durumu saniyeler içinde, sıfır maliyetle test edebilirsin.

## Action adları emir değil, olay anlatmalıdır

Action adlandırmasında düşülen en büyük hata, fonksiyon adlarını taklit etmektir:

| Kötü Adlandırma (Emir) | İyi Adlandırma (Olay) | Neden? |
| --- | --- | --- |
| `setProcessingTrue` | `payStart` | Reducer'a ne yapacağını söyleme; neyin başladığını söyle |
| `clearErrorAndSetSeats` | `selectSeat` | Olay bir tanedir; hangi alanların temizleneceği reducer'ın iş kuralıdır |
| `setStepSuccess` | `paySuccess` | Adım değişimi başarının doğal bir sonucudur |

Olay odaklı adlandırma, bileşeni iş kurallarından soyutlar. Bileşen sadece "ödeme başladı" der; kaç state alanının nasıl değişeceği reducer'ın içindedir.

## Action'dan ekrana geçişi adım adım izleyelim

Bir reducer çağrısında React, mevcut state'i ve dispatch edilen action'ı reducer'a verir. Reducer yeni nesneyi hesaplar; React bu sonucu sonraki render'da state olarak kullanır. Dispatch çağrısı bileşenin içindeki state'i anında değiştirmez. Event handler aynı render'ın snapshot'ını okumaya devam eder.

| An | State | Action / işlem | Sonraki ekranda |
|---|---|---|---|
| İlk render | isProcessing false, error null | henüz yok | işlem düğmesi açık |
| Tıklama | aynı snapshot | dispatch(payStart) | reducer true ve null üretir |
| Yeni render | isProcessing true | handler tamamlandı | spinner görünür |
| İstek reddi | önceki state korunur | dispatch(payError) | reducer false ve hata metni üretir |
| Sonraki render | isProcessing false | hata artık state'te | spinner kapanır, hata görünür |

Bu akışta ağ isteği handler'da, state geçişinin hesabı reducer'dadır. Handler Promise'in sonucunu bekler ve dispatch ile sonucu bildirir. Reducer'ı Strict Mode gibi geliştirme denetimlerinde tekrar çalıştırmak sonucu değiştirmemelidir; saf olma şartı bu yüzden yalnız test kolaylığı değil, React'in güvenli hesaplama beklentisidir.

Başlangıç state'i de geçerli bir ekranı temsil etsin. İlgisiz alanları boş bırakıp ilk action'ın onları kurmasını beklemek, arada tutarsız render üretir. Reducer içindeki her action için korunan alanları bilinçli seç: yeni state nesnesi oluşturmak tek başına kuralı sağlamaz, içteki dizi veya nesneyi de değiştiriyorsan onun için de yeni referans üretmelisin. Bilinmeyen action tipi varsa TypeScript union'ı ve exhaustive check tüm dalların ele alınmadığını görünür kılabilir.

:::mistake[Handler'da dispatch sonrası state'in değiştiğini varsaymak]
**Belirti:** dispatch(payStart) sonrasında aynı handler içindeki state.isProcessing hâlâ false okunuyor. **Neden:** Handler o render'ın state snapshot'ını kapatmıştır. **Düzeltme:** Sonraki kararları handler'da güncellenmiş state arayarak değil, action sonucunu ve yeni render'ı kullanarak kur.
:::

## Sınır durumları ve sık hatalar

:::mistake[Sık hata: Reducer içinde asenkron iş veya fetch başlatmak]
Belirti → Reducer gövdesinde `fetch('/api/pay')` çağrısı yapmak.  
Neden → Reducer'ın saf fonksiyon kuralını ihlal etmek.  
Düzeltme → Reducer ASLA yan etki yapmaz. Ağ isteği bileşenin olay yöneticisinde (`handlePay`) başlar; istek başlamadan önce `dispatch({ type: 'payStart' })`, yanıt gelince `dispatch({ type: 'paySuccess' })` veya `dispatch({ type: 'payError', message })` fırlatılır.
:::

:::mistake[Sık hata: State'i doğrudan mutasyona uğratmak]
Belirti → `state.selectedSeats.push(action.seatId)` yazıp `return state` dönmek.  
Neden → Dizi mutasyonu referansı değiştirmez; React referans aynı kaldığı için bileşeni render etmez.  
Düzeltme → Her zaman yeni dizi ve yeni nesne referansı döndür:
```ts
return {
  ...state,
  selectedSeats: [...state.selectedSeats, action.seatId]
}
```
:::

:::mistake[Sık hata: Her küçük state için reducer açmak]
Belirti → Bir arama input'u ve bir boolean modal açık/kapalı durumu için devasa reducer'lar yazmak.  
Neden → Aşırı mühendislik (over-engineering).  
Düzeltme → Birbirinden bağımsız basit değerler için `useState` kullanmaya devam et. Reducer, durumların birbiriyle bağlantılı olduğu durumlarda anlam kazanır.
:::

:::sector
Modern frontend mimarilerinde (özellikle Redux Toolkit, Zustand veya XState kullanan ekiplerde) reducer disiplini standarttır. İş mantığını kullanıcı arayüzünden (UI) izole etmek, aynı mantığın hem web uygulamasında hem de mobil uygulamada (React Native) test edilip yeniden kullanılabilmesini sağlar.
:::

## Özet

- Birbirine bağlı birden fazla state alanı varsa `useReducer` tutarlılık sağlar.
- Reducer saf fonksiyondur: yan etki barındırmaz, dış dünyaya dokunmaz.
- Action adları emir değil olay anlatır (`selectSeat`, `paySuccess`).
- Discriminated union ile action payload'ları tam tip güvenliğine kavuşur.
- Reducer'lar DOM bağımlılığı olmadan saf birim testleriyle hızla doğrulanabilir.

**Kendini yokla:** `bookingReducer` içinde neden `fetch('/api/book')` çağrısı yapamayız?  
*Cevap:* Çünkü reducer saf bir hesaplama fonksiyonu olmak zorundadır; yan etkiler React'in render döngüsünü bozar. Ağ isteği event handler içinde başlatılır ve sonuçlar reducer'a action olarak gönderilir.

**Kendini yokla:** Reducer içinde `state.selectedSeats.push('B3')` yazıp `return state` yaparsak React arayüzü neden güncellenmez?  
*Cevap:* Çünkü `state` nesnesinin bellek referansı değişmemiştir; React referans eşitliği (`Object.is`) gördüğünde hiçbir şeyin değişmediğini varsayar.
