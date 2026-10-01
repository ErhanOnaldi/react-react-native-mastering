---
title: "Sanal saatle callback zamanını sınama"
minutes: 13
kind: concept
---

# Sanal saatle callback zamanını sınama

Sinema’da bir fragman başladığında altyazı işareti kısa bir gecikmeyle görünür. Bu gecikmeyi her testte gerçek zamanla beklemek istemezsin; ayrıca sınırın hemen öncesinde ve tam sınırda ne olduğunu ayrı ayrı görmek gerekir.

## Önce tanıdık bir zamanlayıcı

`setTimeout`, bir işi verilen süre geçince çalıştırır. Sonradan çalışacak bu işe `callback` denir. Mesela aşağıdaki kod, 1200 milisaniye sonra konsola mesaj yazar:

```ts check
setTimeout(() => {
  console.log('Fragman başladı')
}, 1200)
```

Bu kodu çalıştırınca mesaj hemen çıkmaz; JavaScript zamanlayıcıyı kurar, sonra süre dolduğunda callback’i çağırır. Gerçek uygulamada bu bekleme doğaldır. Testte ise 1200 ms gerçekten beklemek testi yavaşlatır ve makinenin o anki yüküne göre test süresini değişken kılar.

Vitest, test içindeki zamanlayıcıları sanal bir saatle kontrol edebilir. Sanal saat, duvar saatini beklemeden testin zamanını istediğin kadar ilerletmene yarar.

![Sanal saat: callback 2400 ms öncesinde çalışmaz, 2400 ms'de bir kez çalışır](diagrams/sanal-saat.svg "Test saati 2399 ms'den 2400 ms'ye ilerler.")

## Saati biz ilerletelim

Önce Sinema’nın altyazı işaretinin 1200 ms sonra göründüğünü düşün. Aşağıdaki testte callback’in çalışıp çalışmadığını bir mock fonksiyonla sayıyoruz. Mock fonksiyon, testin çağrılmasını gözleyebildiği sahte bir fonksiyondur. `afterEach`, her test tamamlanınca çalışan Vitest kancasıdır; burada gerçek saate geri dönmek için kullanacağız.

```ts check
import { afterEach, expect, it, vi } from 'vitest'

afterEach(() => vi.useRealTimers())

it('altyazı işaretini gecikmeden önce göstermez', () => {
  vi.useFakeTimers()
  const showMark = vi.fn()

  setTimeout(showMark, 1200)
  vi.advanceTimersByTime(1199)
  expect(showMark).not.toHaveBeenCalled()

  vi.advanceTimersByTime(1)
  expect(showMark).toHaveBeenCalledTimes(1)
})
```

`vi.useFakeTimers()` çağrısından sonra `setTimeout` sanal saate bağlanır. İlk ilerletme saati 1199 ms’ye getirir; callback hâlâ bekler. Bir milisaniye daha eklenince toplam 1200 ms olur ve callback tam o anda çalışır. Böylece test hem erken çalışmadığını hem de zamanında çalıştığını gösterir.

## İki sınırı zaman çizelgesinde oku

Burada sınanan şey yalnızca “callback sonunda çalıştı mı?” değil. Callback’in çalışmaması gereken son an ile çalışması gereken ilk anı ayrı görürüz:

| Sanal saat | İşlem | `showMark` çağrı sayısı |
| --- | --- | ---: |
| 0 ms | Zamanlayıcı 1200 ms için kurulur | 0 |
| 1199 ms | 1199 ms ilerletilir | 0 |
| 1200 ms | 1 ms daha ilerletilir | 1 |

Bu aralık önemlidir: yalnızca 1200 ms’ye gidip callback’in çağrıldığını görmek, onun yanlışlıkla daha erken çalışmadığını kanıtlamaz. Sınırdan hemen önce ve sınırda bakmak, gecikme kuralını iki taraftan da denetler.

İlerletme miktarları birikerek saati taşır. Önce 1199 ms ilerletince test saati 1199’dadır; sonraki `1` yeni bir başlangıç değildir, saati 1200’e tamamlar. Bu yüzden callback’in ne zaman çalıştığını hesaplarken son ilerletme miktarına değil, toplam geçen sanal süreye bak.

Callback, sanal saat ilerlerken süresi dolduğunda çalıştırılır. Testte önce ilerletme satırı, sonra onu izleyen assertion çalışır; callback’in sonucunu aynı test adımında okuyabilirsin. Gerçek 1200 ms beklemede ise testin yürütmesi o süre boyunca durur, bu da hem yavaş hem de gereksizdir.

## Aynı fikri Sinema’daki gecikmeye uygula

Bir fragman başladığında Sinema oynatma çubuğundaki “Atla” işaretini 2400 ms sonra açıyor olsun. Önce uygulamanın basit fonksiyonunu, ardından bu fonksiyonun callback’ini test edelim:

```ts check
import { afterEach, expect, it, vi } from 'vitest'

function scheduleSkipMark(onShow: () => void) {
  setTimeout(onShow, 2400)
}

afterEach(() => vi.useRealTimers())

it('Atla işaretini fragman başladıktan 2400 ms sonra açar', () => {
  vi.useFakeTimers()
  const showSkipMark = vi.fn()

  scheduleSkipMark(showSkipMark)
  vi.advanceTimersByTime(2399)
  expect(showSkipMark).not.toHaveBeenCalled()

  vi.advanceTimersByTime(1)
  expect(showSkipMark).toHaveBeenCalledTimes(1)
})
```

Fonksiyon zamanı beklemez; yalnızca callback’i 2400 ms sonrasına planlar. Test, saati kontrollü biçimde ilerletip işaretin erken açılmadığını ve eşikte bir kez açıldığını gözler. Kullanıcı açısından anlamlı olan da timer nesnesinin varlığı değil, işaretin doğru anda görünmesidir.

## Sık düşülen hata: saati ilerletmeyi unutmak

Sanal saati açmak tek başına süreyi geçirmez. Aşağıdaki testte callback kurulur ama zaman hiç ilerlemediği için beklenti başarısız olur:

```ts check
import { expect, vi } from 'vitest'

vi.useFakeTimers()
const showMark = vi.fn()
setTimeout(showMark, 1200)

expect(showMark).toHaveBeenCalled()
```

Belirti, “beklenen çağrı sayısı 1, bulunan 0” hatasıdır. Çünkü fake timer gerçek saatte 1200 ms’nin geçmesini izlemiyor; zamanı senin ilerletmeni bekliyor. Çağrının zamanında olup olmadığını sınamak için `vi.advanceTimersByTime(1200)` ekle ve tam eşiğin öncesini de kontrol et.

Sanal saat testten sonra açık kalırsa daha sonraki testlerin zamanlayıcıları ve `Date` davranışı etkilenebilir. Bu nedenle `afterEach(() => vi.useRealTimers())` ile her testten sonra gerçek saate dön. `afterEach`, test bittikten sonra çalışan Vitest kancasının adıdır; temizliği her testte elle tekrarlatmaz.

Bir testte sırayı şöyle düşün: fake timer’ı aç, zamanlayıcıyı kur, saati kontrollü ilerlet, callback’in durumunu doğrula, gerçek saati geri getir. Böyle kurunca test beklemeden çalışır ve hangi milisaniyede ne olması gerektiği açık kalır.

Fake timer’ı zamanlayıcı kurulduktan sonra açmak da geç kalmaktır: o ilk timer gerçek saate bağlı kalabilir. Testte tüm zamanlayıcı davranışını kontrol etmek istiyorsan sanal saati önce aç, sonra fonksiyonu çağır. Sınanan fonksiyonun kendi içinde kurduğu timer da böylece aynı kontrol edilen saate bağlanır.

## Özet

- `setTimeout` callback’i belirli bir süre geçince çalıştırır.
- Fake timer, gerçek zamanı beklemeden test saatini ilerletir.
- Eşik öncesini ve eşiğin kendisini ayrı kontrol et; yalnızca son duruma bakma.
- Test sonunda `vi.useRealTimers()` ile gerçek saate dön.

**Yeni terimler**

- **callback:** Daha sonra çalıştırılmak üzere başka bir fonksiyona verilen fonksiyon.
- **sanal saat (fake timer):** Testte zamanlayıcıların süresini gerçek zaman beklemeden yönetme yolu.
- **mock fonksiyon:** Testin çağrıları ve çağrı sayısını gözleyebildiği sahte fonksiyon.
- **`afterEach`:** Her test tamamlandığında temizlik gibi işleri çalıştıran Vitest kancası.

**Kendini yokla:** 800 ms gecikme için 799 ms’de callback çağrılmadığını görmek neyi kanıtlar?  
Yanıt: Callback’in belirlenen süreden önce çalışmadığını gösterir.

**Kendini yokla:** Fake timer’ı açtın ama callback çağrılmadı. İlk neyi kontrol edersin?  
Yanıt: `vi.advanceTimersByTime(...)` ile sanal saati yeterince ilerletip ilerletmediğimi.
