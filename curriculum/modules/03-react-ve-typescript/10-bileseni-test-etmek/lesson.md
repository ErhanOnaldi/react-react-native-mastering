---
title: "Bileşeni kullanıcı gibi test et"
minutes: 16
kind: concept
---

# Bileşeni kullanıcı gibi test et

Bir film kartında “Fragmanı aç” düğmesi olduğunu düşün. Düğmenin içindeki state değişkeninin adını bilmek sana kullanıcının düğmeyi bulabildiğini ya da tıklayınca doğru şeyin olduğunu söylemez. Bileşeni, kullanıcının gördüğü arayüz ve yapabildiği eylem üzerinden sınayalım.

:::model[Test anatomisi]
Testte önce başlangıç koşullarını kurarsın, sonra eylemi yapar, en son sonucu doğrularsın. Bileşen testinde sonuç çoğunlukla bir fonksiyonun dönüş değeri değil, sayfada görünen arayüzdür.

![Hazırla, çalıştır, doğrula ve hatalı sürümü yakala akışı](diagram:test-anatomisi)
:::

## Önce düğmeyi kullanıcı gibi bul

Tarayıcı, HTML elementlerini bir ağaç yapısında tutar; buna **DOM** denir. React Testing Library (**RTL**), bileşenini bu DOM'a yerleştirip testte arayüzü sorgulamana yardım eden araçtır. `render` bileşeni DOM'a koyar, `screen` ise testin o ekrandaki kontrolleri aramasını sağlar.

Bir kontrolün **rolü**, arayüzdeki görevini anlatır: `<button>` bir `button`, `<input type="search">` bir `searchbox` rolüne sahiptir. **Erişilebilir ad**, kontrolü tanıtan metindir; çoğunlukla düğmenin yazısı veya input'a bağlanan etikettir. Rolü ve adı birlikte aramak, testin yalnızca “bir element var” demesinden daha anlamlıdır.

```tsx check
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { describe, expect, it } from 'vitest'

function GenreChip() {
  return <button type="button">Bilim kurgu</button>
}

describe('GenreChip', () => {
  it('türü seçilebilir bir düğme olarak gösterir', () => {
    render(<GenreChip />)

    expect(
      screen.getByRole('button', { name: 'Bilim kurgu' }),
    ).toBeInTheDocument()
  })
})
```

`getByRole` burada adı “Bilim kurgu” olan düğmeyi arıyor. Düğme yoksa veya adı değişmişse sorgu hata verir; test sessizce başka bir elemente tutunmaz. `toBeInTheDocument` gibi bir **matcher**, testte beklediğin sonucu karşılaştıran yardımcıdır.

## Tıklamadan sonraki ekranı sırayla izle

Şimdi düğmeye basınca fragman ayrıntılarını açan küçük bir bileşen düşün. **ARIA**, HTML nitelikleriyle yardımcı teknolojilere kontrolün anlamını veya durumunu duyurur; `aria-expanded` içeriğin açık olup olmadığını söyler. **`userEvent`**, testte tıklama ve yazma gibi kullanıcı eylemlerini taklit eden araçtır. Tıklama Promise döndürdüğü için `await` ile tamamlanmasını beklersin; böylece ekrandaki sonucu eylemden önce kontrol etmezsin.

```tsx check
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

function TrailerDetails() {
  const [open, setOpen] = useState(false)

  return (
    <section>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        Fragman bilgisi
      </button>
      {open && <p>Fragman süresi: 2 dakika</p>}
    </section>
  )
}

describe('TrailerDetails', () => {
  it('düğmeye basınca fragman bilgisini açar', async () => {
    const user = userEvent.setup()
    render(<TrailerDetails />)

    const button = screen.getByRole('button', { name: 'Fragman bilgisi' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Fragman süresi: 2 dakika')).not.toBeInTheDocument()

    await user.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Fragman süresi: 2 dakika')).toBeInTheDocument()
  })
})
```

`queryByText`, bulunmaması beklenen metin için kullanılır: eşleşme yoksa `null` verir. Buna karşılık `getByText` o anda bulunması gereken içeriği arar. Bu testte zaman sırası önemlidir:

| Sıra | Testin yaptığı | Ekranda olan | Neden |
| --- | --- | --- | --- |
| 1 | `render` çağrılır | Düğme kapalı, paragraf yok | Başlangıç görünümü kurulur |
| 2 | `getByRole` düğmeyi bulur | `aria-expanded="false"` | Eylem doğru kontrol üzerinde yapılır |
| 3 | `await user.click(button)` | Event handler state'i günceller | Kullanıcı tıklamasının tamamlanması beklenir |
| 4 | Assertion'lar çalışır | Düğme açık, paragraf görünür | Yeni ekran davranışı doğrulanır |

Ne oldu? Başlangıçta `open` false olduğu için paragraf üretilmedi. Tıklama state'i true yaptı; React bileşeni yeni değerle tekrar çizdi ve paragraf DOM'a girdi. Test state değişkenini okumak yerine bu iki görünür işareti kontrol ediyor.

## Callback'in gerçekten çağrıldığını da sınayabilirsin

Bazı bileşenler kendi başına sonucu değiştirmez; bir eylemin sonucunu callback ile bildirir. Callback, bir bileşene prop olarak verilen ve olay olduğunda çağrılan fonksiyondur. Örneğin not alanına yazılan metni parent'a iletmesini bekleyebilirsin. Testte **mock** (çağrılma biçimini gözleyebildiğin sahte fonksiyon) kullanıp son metnin gerçekten iletildiğini kontrol et.

```tsx check
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

function ActorNote({ onNoteChange }: { onNoteChange: (note: string) => void }) {
  return (
    <input
      type="text"
      aria-label="Oyuncu notu"
      defaultValue=""
      onChange={(event) => onNoteChange(event.currentTarget.value)}
    />
  )
}

describe('ActorNote', () => {
  it('yazılan notu bildirir', async () => {
    const user = userEvent.setup()
    const onNoteChange = vi.fn()
    render(<ActorNote onNoteChange={onNoteChange} />)

    await user.type(screen.getByRole('textbox', { name: 'Oyuncu notu' }), 'başrol')

    expect(onNoteChange).toHaveBeenLastCalledWith('başrol')
  })
})
```

Ne oldu? Test, alanı kullanıcı gibi rolü ve adıyla buldu, sonra harfleri yazdı. `vi.fn()` her değişiklikte çağrılan mock'tu; son çağrının ‘başrol’ taşıması, tamamlanan metnin callback'e ulaştığını gösterdi. Böylece test yalnız input'un ekranda oluşmasını değil, yazının bileşen sınırından çıkmasını da denetledi.
## Sorgu arayüzün anlamına bağlı olsun

Şimdi sık rastlanan bir yanlışın belirtisine bakalım. Bir geliştirici düğmeyi `.green-button` CSS sınıfıyla (HTML elementine görünüş vermek için kullanılan ad) arar; tasarım sınıfı değişince test kalır, ama düğmenin adı yanlış olsa test bunu fark etmeyebilir. Çünkü CSS sınıfı görünüşü tarif eder, kullanıcının kontrolü nasıl bulduğunu değil.

Düzeltmek için önce `screen.getByRole('button', { name: 'Fragman bilgisi' })` gibi rol ve ad kullan. Arama alanı için rol `searchbox`, açıklayıcı ad da etiketin metni olabilir. `data-testid` gibi yalnız teste ait kimlikler, kullanıcıya açık bir rol ve adla sorgulama mümkün değilse son seçenek olsun.

Bulunması gereken elementte `getBy...` sorgusu uygundur; yokluğu doğrularken `queryBy...` kullan. Arayüz hemen değil de daha sonra ortaya çıkacaksa bekleme yapan sorgular da vardır, ancak asenkron arayüz ve ağ davranışını burada genişletmiyoruz.

## Özet

- Bileşeni render et, sonra kullanıcıya açık rol ve adla kontrolü bul.
- Etkileşimi `userEvent` ile yap ve tamamlanmasını `await` et.
- State'in kendisi yerine DOM'daki metni, ARIA durumunu ve callback sonucunu doğrula.
- Bulunması beklenen element için `getBy...`, yokluğu sınamak için `queryBy...` kullan.

**Yeni terimler:** DOM, tarayıcının HTML elementlerini tuttuğu ağaçtır; RTL, React arayüzünü DOM üzerinden sorgulama aracıdır; rol, kontrolün arayüzdeki görevini söyler; erişilebilir ad, kontrolü tanıtan metindir; ARIA, yardımcı teknolojilere anlam ve durum bildiren HTML nitelikleridir; matcher, testte beklenen sonucu karşılaştırır; mock, testte çağrısı gözlenebilen sahte fonksiyondur; callback, bileşenin dışarı bildirim yapmak için çağırdığı fonksiyondur.

**Kendini yokla:** “Film ara” alanının gerçekten arama alanı ve doğru adla bulunduğunu nasıl sınarsın?
*Cevap:* `screen.getByRole('searchbox', { name: 'Film ara' })` ile ararım.

**Kendini yokla:** Başlangıçta henüz görünmemesi gereken bir uyarıyı hangi sorguyla kontrol edersin?
*Cevap:* `queryByRole` ile sorgular ve `not.toBeInTheDocument()` beklentisini yazarım.
