---
title: "Hook’u React içinde sınamak"
minutes: 13
kind: concept
---

# Hook’u React içinde sınamak

Bir custom hook, React’in kurallarına göre component render edilirken çalışan fonksiyondur. Bu nedenle `useState` kullanan hook’u sıradan JavaScript fonksiyonu gibi `const value = useCounter()` diye çağıramazsın. React’in render akışını testte kuran `renderHook`, hook’un o anki dönüşünü `result.current` alanında sunar.

## React’e hook için bir render ver

Önce state’i olmayan basit bir hook düşün: `useMovieLabel`, film adını biçimlendiriyor. `renderHook` callback’i hook’u React’in içinde çağırır; `result.current` hook’un döndürdüğü değeri verir.

```tsx check
import { renderHook } from '@testing-library/react'
import { expect, it } from 'vitest'

function useMovieLabel(title: string) {
  return `Film: ${title}`
}

it('film başlığını biçimlendirir', () => {
  const { result } = renderHook(() => useMovieLabel('Kıyı'))
  expect(result.current).toBe('Film: Kıyı')
})
```

Burada state değişmediği için yalnız ilk dönüş değerini okuduk. Hook çağrısını `renderHook` içine koymamız, React’in hook kurallarına uygun bir render bağlamı sağlar.

## State değişikliğini `act` ile tamamla

Şimdi hook bir düğme tıklanınca artacak sayaç tutsun. Hook’un döndürdüğü `increment` fonksiyonunu çağırmak bir React state güncellemesi başlatır. `act`, testte bu güncellemenin ve ona bağlı render’ın bitmesini beklediğimiz sınırdır.

```tsx check
import { act, renderHook } from '@testing-library/react'
import { expect, it } from 'vitest'
import { useState } from 'react'

function useWatchCount() {
  const [count, setCount] = useState(0)
  return { count, increment: () => setCount((current) => current + 1) }
}

it('izlenme sayısını artırır', () => {
  const { result } = renderHook(() => useWatchCount())
  expect(result.current.count).toBe(0)

  act(() => result.current.increment())
  expect(result.current.count).toBe(1)
})
```

İlk assertion ilk render’ın `0` değerini görür. `act` içindeki çağrı state’i 1 yapar ve React yeni render’ı tamamlar; ardından `result.current.count` artık 1’dir. `act` olmadan güncelleme React’in testteki sınırları dışında kalabilir; uyarı alabilir veya henüz güncellenmemiş değeri okursun.

Bu sırayı gözünde canlandır:

| Sıra | Testte olan | `result.current.count` |
|---|---|---:|
| 1 | `renderHook` ilk render’ı kurar | 0 |
| 2 | İlk assertion çalışır | 0 |
| 3 | `act` içinde `increment()` çağrılır | State güncellemesi başlar |
| 4 | React yeni render’ı tamamlar | 1 |
| 5 | İkinci assertion çalışır | 1 |

![Hook render’ı, act içindeki güncelleme ve yeni dönüş değeri](diagrams/renderhook-akisi.svg "renderHook ile state güncellemesini izleme")

## Bir hook API’sinin birkaç geçişini incele

Sinema’da seçilen türleri tutan bir hook, başlangıçta boş seçim sunabilir; bir tür eklendiğinde yeni liste döndürür. Aynı türü kaldırmak da ayrı bir geçiştir. Her adımdan sonra assertion koyarsan hangi davranışta hata çıktığını hemen görürsün.

```tsx
function useGenreSelection() {
  const [genres, setGenres] = useState<string[]>([])
  function addGenre(genre: string) {
    setGenres((current) => [...current, genre])
  }
  function removeGenre(genre: string) {
    setGenres((current) => current.filter((item) => item !== genre))
  }
  return { genres, addGenre, removeGenre }
}

const { result } = renderHook(() => useGenreSelection())
expect(result.current.genres).toEqual([])
act(() => result.current.addGenre('Belgesel'))
expect(result.current.genres).toEqual(['Belgesel'])
act(() => result.current.removeGenre('Belgesel'))
expect(result.current.genres).toEqual([])
```

Bu örnekte her state geçişi yeni dizi üretir; eski diziyi yerinde değiştirmez. Tablo aynı işlemlerin hook API’sine etkisini gösterir:

| Sıra | İşlem | Seçili türler |
|---|---|---|
| 1 | İlk render | `[]` |
| 2 | `addGenre('Belgesel')` | `['Belgesel']` |
| 3 | `removeGenre('Belgesel')` | `[]` |

Bir test yalnız son boş listeyi kontrol etseydi ekleme işleminin hiç çalışmadığı halde testi geçirebilecek hatalı bir hook’u kaçırabilirdi. Ara değerleri de kontrol etmek, her davranış basamağını kanıtlar.

## Her render kendi değerini verir

State değişince `result.current` sonraki render’ın dönüşünü gösterir. Önceki render’daki nesneyi ayrı değişkende tutup onun da güncelleneceğini varsayma; o nesne eski görüntü olarak kalabilir.

```ts
const previousRender = result.current
act(() => result.current.addGenre('Drama'))
// Yeni değeri result.current'tan oku; previousRender eski nesne olabilir.
```

React’in state’i component render’ına ait bir görüntü gibidir. Setter eski görüntüyü düzenlemez, sonraki render için yeni değer hazırlar. Bu yüzden güncellemeden sonra güncel hook API’sini tekrar `result.current` üzerinden okuruz.

:::mistake[Belirti: değer ilk haliyle kalıyor]
Belirti → State güncelleyen fonksiyondan sonra assertion hâlâ boş listeyi görüyor.  
Neden → Güncelleme `act` dışında yapıldı veya test eski render’dan sakladığı nesneyi okuyor.  
Düzeltme → Eylemi `act` içine al, assertion’da güncel `result.current` değerini kullan.
:::

## Hook testi hangi soruya cevap verir?

`renderHook`, hook’un döndürdüğü değerleri ve fonksiyonları doğrudan incelemek için uygundur. Bir hook’un sonucu ekrandaki başlık, düğme durumu veya erişilebilir ad üzerinden kullanıcıya yansıyorsa, o bağlantıyı bir component testinde de kontrol etmelisin. Hook testi tek başına düğmenin doğru callback’e bağlı olduğunu göstermez.

Hook’un `useContext` gibi bir başka kaynağa ihtiyacı varsa, `renderHook`’a `wrapper` vererek gerekli Provider’ı sağlarsın. `wrapper`, test component’ini gerekli ortak ortamla saran component’tir. Yalnız hook’un gerçekten istediği Provider’ı ekle; state tutmayan `useMovieLabel` testi Router veya ağ handler’ı gerektirmez.

:::info[Derinlemesine (isteğe bağlı)]
Hook props değişince farklı sonuç veriyorsa `renderHook`’un callback’ine props aldırabilir, sonra `rerender(newProps)` ile yeni girdiyi sağlayabilirsin. Asenkron hook’larda Promise ve `act` birlikte kullanılır; zamanlama, iptal ve eski isteğin sonucu gibi konuları asenkron UI dersindeki görünür component testleriyle birlikte düşün.
:::

## Özet

- Hook’u doğrudan çağırma; `renderHook` onu React render akışında çalıştırır.
- `result.current`, son tamamlanan render’daki hook dönüşüdür.
- State değiştiren hook eylemini `act` içinde çalıştır.
- Birden fazla geçişi sırayla doğrula; ara değerler hatanın yerini gösterir.
- Hook API’si testi, DOM’daki kullanıcı etkileşimi testinin yerine geçmez.

**Yeni terimler**

- **`renderHook`:** Hook’u React render akışı içinde çalıştıran test yardımcısı.
- **`result.current`:** Son render’da hook’un döndürdüğü güncel değer.
- **`act`:** React state güncellemesini ve ona bağlı render’ı testte tamamlayan yardımcı.
- **`wrapper`:** Hook testini gerekli Provider veya ortak ortamla saran component.

**Kendini yokla:** `act` sonrasında `result.current` neyi gösterir?  
*Cevap:* State güncellemesi tamamlandıktan sonraki render’ın hook dönüşünü.

**Kendini yokla:** `renderHook` testi bir düğmenin doğru callback’i çağırdığını kanıtlar mı?  
*Cevap:* Hayır. Düğme ve callback bağlantısı için component’i render edip kullanıcı etkileşimini sınamalısın.
