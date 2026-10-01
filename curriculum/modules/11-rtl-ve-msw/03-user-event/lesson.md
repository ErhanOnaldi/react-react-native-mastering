---
title: "user-event ile gerçek etkileşim"
minutes: 16
kind: concept
---

# user-event ile gerçek etkileşim

React’te bir düğmenin `onClick` handler’ını doğrudan çağırabilirsin. Ama kullanıcı düğmeye tıklarken tarayıcı birden fazla olayı işler; düğme odak alabilir ve devre dışıysa tıklama çalışmamalıdır. Bu yüzden testte kullanıcının yapacağı hareketi canlandırıp arayüzde oluşan sonucu izleriz.

`user-event`, Testing Library’nin kullanıcı hareketlerini DOM olay dizileriyle canlandıran aracıdır. `fireEvent` ise tek bir DOM olayını doğrudan yollar; düşük seviyeli bir olayı özellikle sınamadığın sürece kullanıcı akışını anlatmak için `user-event` daha uygundur. İlk kez göreceğin `Promise`, daha sonra tamamlanacak bir işi temsil eden JavaScript değeridir; etkileşim tamamlanmadan assertion’a geçmemek için `await` ile bekleriz.

## Bir düğmeye kullanıcı gibi bas

Önce tek bir eylemi test edelim: Sinema’daki fragman düğmesine basınca callback çalışıyor mu? `userEvent.setup()` bu test için etkileşim oturumu kurar.

```tsx check
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'

function TrailerButton({ onPlay }: { onPlay: () => void }) {
  return <button onClick={onPlay}>Fragmanı oynat</button>
}

it('fragman düğmesine basıldığını bildirir', async () => {
  const user = userEvent.setup()
  const onPlay = vi.fn()
  render(<TrailerButton onPlay={onPlay} />)

  await user.click(screen.getByRole('button', { name: 'Fragmanı oynat' }))

  expect(onPlay).toHaveBeenCalledOnce()
})
```

Test önce bileşeni render eder, düğmeyi rolü ve adıyla bulur, ardından tıklama etkileşimini `await` eder. `user.click` bir Promise döndürdüğü için bekleme önemlidir: assertion ancak tıklama akışı tamamlandıktan sonra çalışır. Böylece test, callback’in doğrudan çağrıldığını değil kullanıcının düğme üzerinden ona ulaştığını doğrular.

![user-event etkileşiminden sonra React'in güncel DOM çıktısını gösteren akış](diagrams/user-event-akisi.svg "Etkileşim, React güncellemesi ve DOM")

## Yazılan harflerin arayüze dönmesini izle

Şimdi yeni bir fikir ekleyelim: controlled input. Bu, değeri React state/prop’uyla verilen ve değişen değeri `onChange` üzerinden uygulamaya bildiren input’tur. Testte karakterleri tek olayla yerleştirmek yerine `user.type` kullanırız.

```tsx check
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'

function CastFilter({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  return (
    <label>
      Oyuncuya göre filtrele
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function CastFilterExample({ onChange }: { onChange: (next: string) => void }) {
  const [value, setValue] = useState('')
  return (
    <CastFilter
      value={value}
      onChange={(next) => {
        setValue(next)
        onChange(next)
      }}
    />
  )
}

it('yazılan metni inputta ve callbackte gösterir', async () => {
  const user = userEvent.setup()
  const onChange = vi.fn()
  render(<CastFilterExample onChange={onChange} />)
  const input = screen.getByRole('textbox', { name: 'Oyuncuya göre filtrele' })

  await user.type(input, 'Ada')

  expect(input).toHaveValue('Ada')
  expect(onChange).toHaveBeenLastCalledWith('Ada')
})
```

`CastFilterExample` state’i güncelleyip yeni değeri input’a geri verir; test ayrıca callback’in son aldığı `'Ada'` değerini görür. Böylece karakterler geldikçe `onChange` çalışır, React tekrar render eder ve DOM input’un değeri ilerler. Controlled input’ta bu gidiş-dönüş önemlidir: kullanıcı olayı yeni değeri bildirir, üst state de o değeri geri sağlar.

Yazma tamamlanmadan `toHaveValue` kontrolü çalışırsa test eski değeri görebilir. Belirti “input beklenen metne sahip değil” olur; neden `user.type` Promise’inin beklenmemesidir. Düzeltme testi `async` tanımlayıp etkileşimi `await` etmektir.

## Enter tuşunun form davranışını sınayalım

Bir puan alanına `8` yazdıktan sonra Enter’a basmak formu göndermelidir. Bu örnekteki `RatingNote`, arama görevi değildir; yeni eklenen şey Enter tuşunun formu nasıl çalıştırdığını sınamaktır.

```tsx check
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'

function RatingNote({ onSave }: { onSave: (score: number) => void }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        onSave(Number(data.get('score')))
      }}
    >
      <label>
        Puan
        <input name="score" type="number" />
      </label>
    </form>
  )
}

it('Enter ile film puanını kaydeder', async () => {
  const user = userEvent.setup()
  const onSave = vi.fn()
  render(<RatingNote onSave={onSave} />)
  const score = screen.getByRole('spinbutton', { name: 'Puan' })

  await user.type(score, '8')
  await user.keyboard('{Enter}')

  expect(onSave).toHaveBeenCalledWith(8)
})
```

Test klavyeyle metni input’a yazar, Enter tuşunu gönderir ve formun submit davranışı üzerinden `onSave` çağrısına ulaşır. `preventDefault()` tarayıcının normal form gönderimindeki sayfa yenileme davranışını durdurur. Callback’i testten doğrudan çağırmadığımız için formun klavye yolunu da gerçekten kullanmış oluruz.

Sıra önemlidir; önce alanı bulur, sonra yazmayı bekler, en son Enter göndeririz:

| Sıra | Kod | Ne olur? |
|---|---|---|
| 1 | `userEvent.setup()` | Etkileşim oturumu hazırlanır. |
| 2 | `render(...)` | Puan alanı DOM’da oluşur. |
| 3 | `getByRole('spinbutton', ...)` | Adı “Puan” olan sayı alanı bulunur. |
| 4 | `await user.type(score, '8')` | Kullanıcı karakteri yazar; input olayı React’e ulaşır. |
| 5 | `await user.keyboard('{Enter}')` | Formun klavye submit akışı çalışır. |
| 6 | `toHaveBeenCalledWith(8)` | Dışarı iletilen puan doğrulanır. |

## Kullanıcı eylemini doğru seç

Bir alanı temizlemek için `clear`, yazı yazmak için `type`, tuş dizisi için `keyboard`, odak sırasını ilerletmek için `tab` kullanabilirsin. Bunlar farklı hareketleri anlatır. Örneğin mevcut arama metnini değiştirmek için önce `clear`, ardından `type` kullanmak kullanıcının yaptığı adımları açık hale getirir.

`fireEvent.change(input, { target: { value: 'Ada' } })` alanın değişim olayını yollar ama karakter karakter yazmayı, klavye akışını ve odağı canlandırmaz. Belirli bir olayın kendisi sınanacaksa bu yararlı olabilir; genel kullanıcı etkileşiminde `user-event` daha anlaşılır bir kanıt verir.

:::mistake[Etkileşimi beklememek]
Belirti → Test eski input değerini görür ya da submit callback’ini çağrılmadan kontrol eder.
Neden → `click`, `type` ve `keyboard` Promise döndürür; test sıradaki satıra erken geçmiştir.
Düzeltme → Testi `async` yap ve her kullanıcı hareketinden önce `await` kullan.
:::

:::mistake[Handler’ı doğrudan çağırmak]
Belirti → Submit testi geçer ama Enter ile form gönderilmez.
Neden → Test callback’i çağırmıştır; input ve form etkileşimini çalıştırmamıştır.
Düzeltme → Alanı bul, yaz, sonra gerekiyorsa gerçek klavye tuşunu `user.keyboard` ile gönder.
:::

## Özet

- Etkileşimi `userEvent.setup()` ile başlat; testi kullanıcının yapacağı adımlara göre yaz.
- `click`, `type` ve `keyboard` Promise döndürür; assertion’dan önce bunları `await` et.
- Controlled input’ta yazı olayı React’e gider, uygulama yeni değeri geri verince DOM güncellenir.
- Formun Enter davranışını kontrol etmek için callback yerine input ve klavyeyle form akışını çalıştır.
- `fireEvent` tek bir düşük seviyeli olay gerektiğinde uygundur; genel kullanıcı hareketi için `user-event` daha anlamlıdır.

**Yeni terimler**

- **`user-event`:** Kullanıcı hareketlerini DOM olay akışına yakın biçimde canlandıran Testing Library aracı.
- **Promise:** Daha sonra tamamlanacak bir işin sonucunu temsil eden JavaScript değeri.
- **Controlled input:** Değeri React prop/state’inden gelen ve değişikliği `onChange` ile bildiren alan.

**Kendini yokla:** `await user.click(...)` neden assertion’dan önce gelir?
*Cevap:* Etkileşim Promise’i tamamlanmadan kontrol yapılırsa olay akışı bitmemiş olabilir.

**Kendini yokla:** Testte yalnızca tek bir `change` olayını özellikle sınamak istiyorsan hangi araç işe yarayabilir?
*Cevap:* `fireEvent`; kullanıcı etkileşiminin tamamını canlandırmak yerine belirli DOM olayını yollar.

:::info[Derinlemesine (isteğe bağlı)]
Fake timer’lar saat akışını testin kontrol etmesini sağlar. Fake timer ile `user-event` birlikte kullanılırsa user-event’in beklediği küçük zaman adımları durabilir; `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })` ile saat köprüsü kurulur. Bu modülde timer senaryolarına daha sonra ihtiyaç duyacağız.

`user.upload` dosya input’una seçilmiş dosya vermeyi, clipboard araçları kopyala-yapıştır durumlarını sınar. Test ortamı bunların gerçek tarayıcı izinlerini ve donanım davranışını bütünüyle temsil etmez; dosyanın sunucuya gerçekten gönderildiğini de tek başına kanıtlamaz.
:::
