---
title: "Hook’u React içinde sınamak"
minutes: 13
kind: concept
---

# Hook’u React içinde sınamak

:::pain[Problem]
Bir hook’u sıradan fonksiyon gibi çağırıp `const result = useSelectedIds()` yazıyorsun. “Invalid hook call” hatası alıyorsun; React hook’un hangi render’a ait olduğunu bilmiyor. Üstelik hook state değiştirince yeni değeri nasıl okuyacağını da belirleyemiyorsun.
:::

## Hook bağımsız fonksiyon gibi çalışmaz

Hook’lar modülünde hook kurallarını, state’in React render’ları arasında nasıl yaşadığını ve custom hook’un state paylaşmadığını öğrendin. Testte de aynı kurallar geçerlidir: hook’u React’in render akışı içinde çağırmalısın. React Testing Library’nin `renderHook` bunun için test component’i kurar; `result.current` her render’da hook’un döndürdüğü son değeri verir.

Kesin kurallar:

1. **Hook’u `renderHook(() => useSomething())` içinde çağır.** Hook’u doğrudan test gövdesinde veya callback dışında çalıştırma.
2. **Sonucu `result.current` üzerinden oku.** Hook tekrar render olduğunda bu alan son dönen değeri yansıtır.
3. **State değiştiren çağrıyı `act` içine al.** Böylece React güncellemeyi uygular ve assertion tamamlanmış render’a bakar.
4. **Render’lar arasındaki sözleşmeyi test et.** İlk değer, eylem sonrası değer ve tekrar eden eylem gibi geçişleri sırayla doğrula.
5. **Kullanıcıya dönük davranış component düzeyindeyse component’i test et.** `renderHook`, hook’un kendi API’sini sınar; DOM/etkileşim davranışının yerine geçmez.

![renderHook, act ve yeni result.current akışı](diagrams/renderhook-akisi.svg)

`renderHook` hook’unu provider’a ihtiyaç duyan kütüphanelerde wrapper alabilir. Router, Context veya QueryClient gerekiyorsa 7. dersteki render helper yaklaşımının aynısı geçerlidir: gereken Provider’ı wrapper içinde sun. Hook’un döndürdüğü callback’i doğrudan çağırmak kullanıcı arayüzünü değil, hook API’sini kullanmak olabilir; bu testin hedefi buysa uygundur. Ama callback’in düğmeye doğru bağlandığını yalnız `renderHook` kanıtlayamaz.

## Bir geçişi adım adım izle

Seçilen etiketleri benzersiz tutan `useTagSelection` hook’u düşün. Başlangıç değeri boş dizidir. `toggle('Mavi')` çağrısı etiketi ekler; aynı çağrının tekrarı etiketi kaldırır. `renderHook` içindeki `result.current` render anındaki API nesnesini gösterir:

| Sıra | İşlem | `result.current.selected` |
|---|---|---|
| 1 | `renderHook(() => useTagSelection())` | `[]` |
| 2 | `act(() => result.current.toggle('Mavi'))` | `['Mavi']` |
| 3 | Aynı etiketi tekrar toggle et | `[]` |
| 4 | `toggle('Sarı')` | `['Sarı']` |

Her transition’dan sonra değer immutable biçimde oluşturulmalıdır. Hook’un iç state’ini bir ref veya dış mutable diziyle değiştirip render sinyalini atlamak React’in güncel API’siyle uyuşmaz.

## Kırık çağrı, doğru render

Kırık örnekte hook’u React dışında çalıştırıyorsun:

```ts
// Kırık: hook çağrısı React render ağacının dışında.
const current = useTagSelection()
```

Doğru test, hook çağrısını `renderHook` callback’ine bırakır ve güncellemeyi `act` ile sarar:

```tsx check
import { act, renderHook } from '@testing-library/react'
import { expect, it } from 'vitest'
import { useState } from 'react'

function useTagSelection() {
  const [selected, setSelected] = useState<string[]>([])
  function toggle(tag: string) {
    setSelected((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    )
  }
  return { selected, toggle }
}

it('etiketi ekleyip tekrarında kaldırır', () => {
  const { result } = renderHook(() => useTagSelection())
  expect(result.current.selected).toEqual([])

  act(() => result.current.toggle('Mavi'))
  expect(result.current.selected).toEqual(['Mavi'])

  act(() => result.current.toggle('Mavi'))
  expect(result.current.selected).toEqual([])
})
```

Burada aynı adlı setter state’in önceki değerini kullanır. `act` sonrası React güncellemesi tamamlanır ve `result.current` yeni render’ın API’sini gösterir. `act` çağrısını atlayınca React’in test uyarısı görebilir veya assertion önceki render’a bakabilir.

## Hook testi ile component testi arasındaki çizgi

Testin sorusu “hook toggle çağrısı üyeliği nasıl değiştiriyor?” ise `renderHook` kısa ve doğrudandır. Soru “ekran okuyucu düğmenin durumunu nasıl duyuruyor?”, “klavye ile etkinleşiyor mu?” ya da “loading mesajı kullanıcıya görünüyor mu?” ise component’i RTL ile render et. Aynı davranışı iki seviyede tekrar tekrar test etmek bakım yükünü artırır; her katmanda o sınıra ait bir sözleşme seç.

Hook, `useContext` veya `useQuery` gibi bağımlılıklar kullanıyorsa wrapper ile ihtiyaç duyduğu provider’ı sağla. Wrapper’da tüm uygulama router’ını, theme’i ve bütün server state altyapısını kurmak zorunda değilsin. En küçük geçerli ortamı kur; aksi halde testin başarısız olma nedeni hook değil, unrelated provider konfigürasyonu olabilir.

Hook’un dönüşü primitive ise, örneğin `boolean`, `result.current` doğrudan o değerdir; nesne ise public alanı okunur. İki durumda da test initial value’yu doğrulayabilir. State transition’larını ayrı assertion’lara bölmek, başarısızlığın ilk bozuk geçişte görünmesini sağlar. Beş eylemi arka arkaya yapıp yalnız son değeri assert etmek, aradaki hatalı geçişlerin birbirini telafi etmesine izin verebilir.

Test callback’inin kendisi hook’u yeniden render etmeli diye ekstra state ekleme. `renderHook` React yaşam döngüsünü sağlar; props değişimi için `rerender`, state güncellemesi için `act` yeterlidir. Gerçek component’te bir effect’e bağlı UI state’i varsa hook testi bu entegrasyonu göstermeyebilir. Bu durumda component testi veya birbirini tamamlayan iki sınır seç; hook’un dönüş değeriyle DOM’a giden davranışı ispatlamaya çalışma.

:::mistake[Belirti: `result.current` değişmedi]
Belirti → `toggle` çağrısından sonra ilk değer hâlâ `[]`.  
Neden → Güncelleme `act` içinde yapılmadı ya da mutation React’e yeni state değeri vermedi.  
Düzeltme → State setter’ını immutable yeni değerle çağır ve `act` sonrasında tekrar `result.current` oku.
:::

:::mistake[Belirti: Hook testi düğme davranışını kanıtlıyor sanılıyor]
Belirti → Hook unit testi geçiyor, ama ekrandaki düğme tıklanınca state değişmiyor.  
Neden → Test hook API’sini ölçtü; DOM event bağlantısını sınamadı.  
Düzeltme → Hook geçişini `renderHook` ile, düğmenin kullanıcı davranışını component testiyle doğrula.
:::

:::mistake[Belirti: Hook’u test etmek için bütün app kuruluyor]
Belirti → Bir toggle testi router ve MSW gerektirdiği için kırılganlaşıyor.  
Neden → Hook testinin ihtiyacı olmayan provider’lar eklenmiş.  
Düzeltme → Sadece gerçek context bağımlılıklarını wrapper’dan geçir; saf state hook’unu izole tut.
:::

## Dönen fonksiyon ve snapshot farkı

`result.current` bir hook render’ındaki dönüş değeridir. State güncellendiğinde React yeni render üretir ve `result.current` yeni nesneyi gösterir. Önceki nesneyi ayrı bir değişkende saklayıp onun güncelleneceğini varsayma:

```ts
const previousRenderValue = result.current
act(() => result.current.toggle(5))
// previousRenderValue eski render'ın nesnesi olabilir; yeni değeri result.current'tan oku.
```

Bu, 3.3’te öğrendiğin state snapshot modelinin testteki karşılığıdır. Her render kendi değer görüntüsünü üretir; setter çağrısı o görüntüyü mutate etmez. Callback’ler de oluşturuldukları render’a ait closure değerlerini yakalar. Ardışık güncellemelerde hook’un updater fonksiyonu önceki state’i kullanıyorsa, testin birden çok eylemi sırayla uygulayarak bu geçişi sınayabilir.

State değiştiren hook çağrılarını `act` içine al. Eğer eylem asenkron bir Promise döndürüyorsa async `act` kullanmak ve sonrasında beklenen durumu doğrulamak gerekebilir:

```ts
await act(async () => {
  await result.current.refresh()
})
expect(result.current.status).toBe('ready')
```

Bu örnek yalnızca hook’un public API’si `refresh` ve `status` sunuyorsa geçerlidir. İçerde kaç state setter kullandığını, kaç render yaptığını veya state alanlarının adını olmayan bir kullanıcı gereksinimi gibi test etme. Davranışın sözleşmesi public dönüş değeri ve eylem sonucudur.

Props değişimine tepkiyi sınamak için `renderHook` props alan callback kullanır; `rerender(newProps)` yeni input’u sağlar. Eski input’un sonucu yeni input’tan sonra dönüyorsa effect cleanup davranışını da test et. Ancak hook’un asenkron yaşam döngüsü karmaşıksa component seviyesinde görünür UI testi daha açıklayıcı olabilir. `renderHook` kullanmak kodu otomatik olarak daha iyi test etmez; yalnız hook API’sine yakın bir sınır sunar.

Hook bir Context’e bağlıysa `wrapper` component’i, gereken Provider’ı sarmalar. Wrapper’a testte değişen değeri dışarıdan parametre olarak geçirmek yerine inline closure ile üretmek mümkün olabilir; fakat provider değeri test girdisiyse açık prop daha okunaklıdır. Wrapper testteki bağlamı hazırlar, hook’un çalışma mantığını kopyalamaz.

:::sector
Takımlar custom hook’u başka component’lerde tekrar kullanıyorsa, hook API’sinin geçişlerini `renderHook` ile doğrudan sınamak faydalıdır. Bir UI davranışının tek kullanımı varsa component testi genellikle daha değerli kanıt sağlar. Bu ayrım, refactor sırasında test sayısını değil, her testin koruduğu sözleşmeyi önemser.
:::

## Özet

- Hook’u React render akışında çalıştır; doğrudan fonksiyon gibi çağırma.
- `renderHook` dönüşündeki `result.current`, en son hook değeridir.
- State geçişini `act` içinde çalıştır.
- Hook API’sini test etmek ile DOM davranışını test etmek farklı sınırlardır.
- Yalnız hook’un ihtiyaç duyduğu Provider’ları wrapper’dan geçir.

**Kendini yokla:** `act` sonrasında `result.current` neyi gösterir?  
*Cevap:* State güncellemesi tamamlandıktan sonraki render’ın hook dönüşünü.

**Kendini yokla:** Hook testinde düğmenin erişilebilir adını doğrulayabilir misin?  
*Cevap:* Hayır; bunun için component’i DOM’a render edip RTL sorgusu kullanmalısın.
