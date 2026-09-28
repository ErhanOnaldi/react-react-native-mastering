---
title: "user-event ile gerçek etkileşim"
minutes: 14
kind: concept
---

# user-event ile gerçek etkileşim

:::pain[Problem]
Testte `fireEvent.change(input, { target: { value: 'İzmir' } })` yazdın ve callback doğru metni aldı. Gerçek kullanıcı karakterleri yazdığında input’un `onChange` akışı, seçim ve klavye davranışı beklediğinden farklı çalışıyor. Test tek bir DOM olayı yolladı; kullanıcı ise bir dizi etkileşim yapıyor.
:::

## Bir tıklama tek olaydan ibaret değildir

3. modülün 10. dersinde kullanıcı etkileşimini `userEvent` ile çalıştırdın. Burada click/type örneklerini yinelemek yerine oturumun klavye/pointer durumunu nasıl koruduğunu, etkileşim Promise’lerini, form tuşlarını ve fake timer bağlantısını ayrıntılandırıyoruz.

Tarayıcıda bir tıklamadan önce pointer hareketi, pointer down, focus, pointer up ve click gibi olaylar oluşabilir. `user-event`, bu diziyi kullanıcının yapabileceği hareketlere daha yakın biçimde üretir ve etkileşimin geçerli olup olmadığını kontrol eder. `fireEvent`, belirli bir DOM event’ini doğrudan gönderir; belirli bir düşük seviyeli olay özellikle test edilecekse yararlıdır, genel kullanıcı etkileşimi için ilk tercih değildir.

Kesin kurallar:

1. **Her testte kullanıcı oturumu kur.** `const user = userEvent.setup()` etkileşimlerin klavye ve pointer durumunu tutarlı biçimde paylaşmasını sağlar.
2. **Etkileşimi `await` et.** `click`, `type`, `clear`, `keyboard` ve benzeri metotlar Promise döndürür; assertion’dan önce tamamlanmalarını bekle.
3. **Kullanıcı eylemini amacına göre seç.** Yazı eklemek için `type`, alanı boşaltmak için `clear`, sekme ve kısayol gibi tuş dizileri için `keyboard` kullan.
4. **Form davranışını form üzerinden sınama.** Enter ile gönderim gerekiyorsa Enter tuşunu gerçekten gönder; yalnızca submit callback’ini çağırma.
5. **Timer’ı kullanıcı eyleminden ayrı düşün.** Fake timer açtıysan `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })` ver; aksi halde user-event’in kendi gecikmeleri ilerlemeyebilir.

![user-event ile DOM etkileşiminden yeni ekrana giden akış](diagrams/user-event-akisi.svg)

Oturum, aynı test içindeki etkileşimlerin tuş basılı mı, input focus’ta mı gibi tarayıcı durumlarını izlemesine yardım eder. Her satırda yeni `userEvent.setup()` kurmak, gerçek etkileşimi parçalayıp sıralama varsayımlarını bulanıklaştırır. Testler arasında ise ayrı oturum kur; bir testin pointer veya klavye durumu diğerine taşınmamalıdır.

## Kırık ve doğru etkileşim

Aşağıdaki örnekte `fireEvent.change`, alanın değerini değiştiren tek bir olayı gönderir. Kullanıcının input’a yazmasını ve formu Enter ile göndermesini birlikte sınamak istediğinde bu eksiktir:

```tsx
// Kırık sınır: gerçek klavye ve form submit akışı çalıştırılmıyor.
fireEvent.change(input, { target: { value: 'İzmir' } })
expect(onSearch).toHaveBeenCalled()
```

Daha doğru test, alanı erişilebilir adıyla bulup karakterleri yazar ve formu klavyeyle gönderir. Buradaki `CityLookup` örneği modül görevlerinden farklı bir bileşen ve veridir:

```tsx check
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'

function CityLookup({ onSearch }: { onSearch: (city: string) => void }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        onSearch(String(data.get('city') ?? '').trim())
      }}
    >
      <label htmlFor="city">Şehir ara</label>
      <input id="city" name="city" type="search" />
    </form>
  )
}

it('Enter ile girilen şehri yollar', async () => {
  const user = userEvent.setup()
  const onSearch = vi.fn()
  render(<CityLookup onSearch={onSearch} />)

  await user.type(screen.getByRole('searchbox', { name: 'Şehir ara' }), ' İzmir {Enter}')

  expect(onSearch).toHaveBeenCalledWith('İzmir')
})
```

`type` metodu metni ve özel tuşları aynı komut dizisinde işleyebilir. `{Enter}` özel tuş gösterimidir; gerçek harf küme paranteziyle yazılacaksa user-event’in kaçış biçimini kullan. Uzun klavye dizilerinde `keyboard('{Tab}...')` odağı izler; `tab()` ise sıradaki odaklanabilir öğeye geçmek gibi kısa senaryolarda okunaklıdır.

## Etkileşim sırasını takip et

Controlled input’ta kullanıcı yazdığında önce DOM input olayı oluşur. React’in `onChange` handler’ı yeni değeri üst state’e iletir; state güncellemesi render üretir ve yeni `value` DOM’a geri yazılır. Testte `await user.type(...)` tamamlandığında bu etkileşim adımları çalışmış olur. Ardından `expect(input).toHaveValue(...)` kullanıcıya dönük değeri kontrol eder.

| Adım | Eylem | Beklenen etki |
|---|---|---|
| 1 | `user.setup()` | Etkileşim oturumu hazırdır. |
| 2 | Rol/ad ile input bulunur | Test, doğru alanı seçtiğini doğrular. |
| 3 | `await user.type(input, 'Ada')` | Her karakter için yazma olayı ve değişiklik akışı yürür. |
| 4 | React state güncellenir | Bileşen yeni controlled `value` ile render olur. |
| 5 | `toHaveValue('Ada')` | DOM’daki son input değeri gözlenir. |
| 6 | `await user.keyboard('{Enter}')` | Formun klavye submit davranışı çalışır. |

Buton davranışını da benzer şekilde ele al: `await user.click(button)` sonrasında kullanıcıya yansıyan sonucu kontrol et. `disabled` bir düğmeye click göndermek, düğmenin etkinmiş gibi handler çalıştırdığı anlamına gelmemelidir. Klavye erişimi önemliyse sadece pointer click ile yetinme; Tab ile focus ve Enter/Space ile aktivasyonunu sınayabilirsin.

## Fake timer ile etkileşimi eşleştir

Debounce gibi gecikmeli UI davranışlarını ölçerken Vitest’in fake timer’ı saati senin kontrolüne verir. Ancak user-event bazı etkileşim adımları arasında küçük beklemeler kullanabilir. `advanceTimers` bağlanmazsa etkileşim tamamlanmayı beklerken sanal saat ilerlemez ve test asılı kalabilir.

```ts
// Zamanlayıcı kullanan bir testin ilgili kurulum parçaları
vi.useFakeTimers()
const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
await user.type(input, 'ada')
await vi.advanceTimersByTimeAsync(300)
```

Gerçek timer kullanıyorsan testte süreyi tahmin eden sabit `setTimeout` ekleme. UI’ın beklenen sonucunu bulmak için `findBy` veya `waitFor` kullan; timer kontrolü gerçekten gereksinimin parçasıysa fake timer’ı ilerlet. Timer modu ile gerçek Promise beklemelerini gelişigüzel karıştırmak scheduler sırasını belirsiz yapabilir.

:::mistake[Belirti: assertion erken çalışıyor]
Belirti → Input’un değeri eski kalıyor veya submit callback’i çağrılmadan test bitiyor.  
Neden → `user.type` ya da `user.click` Promise’i beklenmeden assertion yapılmış.  
Düzeltme → `await user.type(...)` ve `await user.click(...)` kullan; testi `async` tanımla.
:::

:::mistake[Belirti: Enter ile sayfa yenileniyor]
Belirti → Butona tıklama testi geçiyor, Enter davranışı formu gönderince sayfayı yeniliyor.  
Neden → Test yalnızca button click çalıştırmış; formun submit varsayılanı ve klavye akışı sınanmamış.  
Düzeltme → Enter tuşunu alan üzerinde gönder ve ürün gereksinimi SPA davranışıysa submit handler’ında varsayılan gezinmenin engellendiğini doğrula.
:::

:::mistake[Belirti: timer testi takılıyor]
Belirti → `user.type` hiç çözülmüyor; zaman aşımı oluşuyor.  
Neden → Fake timer açık, user-event’in zaman adımları ilerletilmiyor.  
Düzeltme → `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })` kullan ve test sonunda gerçek timer’lara dön.
:::

## Eylem metodunu hareket türüne göre seç

`user-event` yalnız tıklama ve metin yazma için değildir. Select alanında `selectOptions`, checkbox veya radio için `click`, alanı boşaltmak için `clear`, focus sırası için `tab`, tuş kombinasyonu için `keyboard` kullanabilirsin. Bu metodlar birbiriyle aynı şeyi yapmaz: `clear` mevcut değeri temizleyip ilgili olayları üretir, `keyboard` ise klavyedeki tuşları sırayla yollar. Gereksinimin “önceki değeri silip yenisini yaz” ise `clear` ardından `type` akışı gerçek kullanıcı hareketini açık anlatır.

Bir dosya input’u veya clipboard gibi tarayıcı kabiliyeti test edilecekse önce test ortamının o davranışı ne ölçüde modellediğini kontrol et. `user.upload(input, file)` dosya seçimini temsil eder; bununla dosyanın sunucuya yüklendiğini değil, input’un seçilmiş File değerini verdiğini test edersin. Ağ gönderimi için ayrıca form/API davranışı gerekir. Aynı şekilde clipboard permission ve gerçek cihaz klavye düzeni jsdom’da gerçek tarayıcıyla aynı değildir.

Kullanıcı hareketini tamamladıktan sonra hangi kanıtı aradığını netleştir. Bir submit callback’i dışarı çağrılıyorsa spy kullanılabilir. Bir dialog açılıyorsa `dialog` rolünü; input değeri değişiyorsa `toHaveValue`; seçili state varsa role ve `aria-selected`/`aria-pressed` gibi semantik durumları doğrula. Sadece “mock çağrıldı” testini ürün davranışının tamamı sanma.

Kullanıcı olaylarını fazla ayrıntıyla test etmek de yararlı değildir. Örneğin her harften sonra `onChange` çağrısının tam sayısını sabitlemek, uygulama kontrollü input’u aynı şekilde sunduğu sürece gereksiz olabilir. Eğer ürün gereksinimi her karakteri kaydetmekse sayım anlam kazanır. Varsayılan olarak son input değeri veya submit sonucu daha dayanıklı kanıttır.

:::sector
Ekipler etkileşim testlerinde erişilebilir adıyla kontrol bulmayı ve kullanıcı akışını await etmeyi standartlaştırır. Bu kural, klavye ve ekran okuyucu kullanıcılarının davranışını da kapsayan testler yazmayı kolaylaştırır. `fireEvent` ise drag gibi user-event’in tam modellemediği özel bir DOM olayı gerektiğinde bilinçli olarak seçilir.
:::

## Özet

- `userEvent.setup()` ile test başına etkileşim oturumu kur.
- Kullanıcı eylemlerini `await` et; sonra DOM’daki sonucu doğrula.
- Enter, Tab ve Space gibi klavye davranışlarını gerektiğinde gerçekten uygula.
- Fake timer kullanıyorsan user-event’in saatini `advanceTimers` ile bağla.
- `fireEvent` düşük seviyeli olay gerektiğinde; genel etkileşimlerde `user-event` kullan.

**Kendini yokla:** Neden `user.click(button)` sonrasında `await` gerekir?  
*Cevap:* Etkileşim dizisi asenkrondur; assertion tamamlanmasından önce çalışmamalı.

**Kendini yokla:** Fake timer ile `user.type` bekliyorsa ilk kontrol edeceğin ayar nedir?  
*Cevap:* `userEvent.setup` içine `advanceTimers: vi.advanceTimersByTime` verilip verilmediği.
