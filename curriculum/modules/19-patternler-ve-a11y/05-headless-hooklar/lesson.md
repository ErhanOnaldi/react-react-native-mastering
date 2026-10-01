---
title: "Davranış ve görünümü ayır"
minutes: 15
kind: concept
---

# Davranış ve görünümü ayır

Bir film kartında “Fragmanı aç” düğmesi, filtrelerde de “Türleri göster” düğmesi olabilir. İkisinde de açık/kapalı durum var; fakat biri dialog açar, diğeri sayfanın içinde seçenekleri gösterir. Önce bu durumu basit bir React component içinde kurup, sonra görünümden ayıracağız.

## Tek component'teki açık/kapalı durum

```tsx check
import { useState } from 'react'

function FilterPanel() {
  const [isOpen, setIsOpen] = useState(false)
  return <button onClick={() => setIsOpen((current) => !current)}>{String(isOpen)}</button>
}
```

Düğmeye basınca updater önceki state'i tersine çevirir. Component hem durumu hem düğmeyi bilir; tek yerde kullanacaksak bu gayet yeterlidir. Aynı davranış birkaç farklı görünümde gerektiğinde state mantığını yeniden kullanmanın yoluna bakarız.

## Aynı davranış, farklı görünüm

**Headless hook**, React davranışını döndürüp DOM etiketini ve görünümü çağırana bırakan özel hook'tur. Örneğin `useDisclosure` açık/kapalı değeri ve bu değeri değiştiren fonksiyonları verebilir; çağıran taraf bunun düğme, çekmece ya da sayfa içi panel olmasına karar verir.

```tsx check
import { useState } from 'react'

function usePanelState() {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen((current) => !current)
  return { isOpen, toggle }
}

function FilterDisclosure() {
  const panel = usePanelState()
  return (
    <section>
      <button aria-expanded={panel.isOpen} onClick={panel.toggle}>Türler</button>
      {panel.isOpen && <p>Aksiyon, dram, bilim kurgu</p>}
    </section>
  )
}
```

Hook durumu paylaşır, ama `<button>` ve `<p>` yalnızca bu görünümün kararıdır. `aria-expanded` burada düğmenin paneli açıp kapattığını bildirir. Hook DOM üretmediği için bunu kendi başına ekleyemez; arayüzü çizen component erişilebilir anlamı da tamamlamalıdır.

## Eylemlerinin anlamı belli olsun

Yalnızca `toggle` varsa, “aç” demek için mevcut durumu bilip tersine çevirmek gerekir. Bunun yerine ayrı `open` ve `close` eylemleri eklemek, çağıranın niyetini netleştirir. Bir eylem aynı sonuca tekrar tekrar ulaşabiliyorsa ona **idempotent** denir: `open()` açık durumu yine açık bırakır, `close()` kapalı durumu yine kapalı bırakır.

```tsx check
import { useCallback, useState } from 'react'

function usePanelState(initial = false) {
  const [isOpen, setIsOpen] = useState(initial)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((current) => !current), [])
  return { isOpen, open, close, toggle }
}
```

Şimdi hook başlangıç değerini ve üç açık eylemi sunuyor. `open` ve `close` mevcut değeri okumadan doğrudan hedef durumu planlıyor; `toggle` ise güncel kuyruğa bakarak tersine çeviriyor. Bu ayrım, “zaten açıksa aç” ile “durumu değiştir” niyetlerini birbirine karıştırmamak için var.

## İki toggle'ı izleyelim

Bir React render'ında okuduğun `isOpen`, o render'ın **state snapshot**'ıdır; setter çağrısı değeri satır ortasında değiştirmez, güncellemeyi sıraya koyar. İki hızlı çağrının farkını şu akışta görebilirsin:

| Adım | Render'daki `isOpen` | `setIsOpen(!isOpen)` kuyruğu | Functional updater kuyruğu |
| --- | --- | --- | --- |
| İlk çağrı | `false` | `true` planlanır | `!false` → `true` |
| İkinci çağrı | hâlâ `false` | yine `true` planlanır | sıradaki `true` → `false` |
| React güncellemeleri işler | yeni state `true` | Sonuç `true` | Sonuç `false` |

Sol taraftaki closure iki defa aynı render değerini okur; bu nedenle iki setter da `true` ister. Functional updater'a verilen fonksiyonlar sırayla önceki planlanan değeri alır, bu yüzden iki tersine çevirme başlangıca döner. Sayaca iki ekleme ya da listeye güncel değere göre ekleme yaparken de bu fark önemlidir.

**Gerçek bir yanlış:** `toggle: () => setIsOpen(!isOpen)` çoğu tek tıklamada doğru görünür. Belirti, bir event'te iki toggle çağrıldığında sonucun başlangıca dönmemesidir; nedeni iki çağrının da eski snapshot'ı okumasıdır. Çözüm `setIsOpen((current) => !current)` kullanmaktır.

## Hook arayüzü çizmez

Disclosure paneli modal dialog değildir. Bu yüzden yalnızca `open`, `close`, `toggle` ve `isOpen` sunmak hook'u farklı arayüzlerde işe yarar tutar. Filtre panelinde düğme ve `aria-expanded` kullanırsın; fragman dialogunda ise dialog component'i adlandırma, klavye ve focus davranışlarını ayrıca sağlar.

| Adım | Çağrı | State'e planlanan değer | Kullanıldığı yer |
| --- | --- | --- | --- |
| İlk render | `usePanelState(false)` | `false` | Filtre seçenekleri kapalı |
| Kullanıcı aç der | `open()` | `true` | Panel görünür |
| Rota değişir | `close()` | `false` | Panel kapalı kalır |
| Aynı kapatma tekrar gelir | `close()` | `false` | Sonuç değişmez |

Bir başlangıç değeri (`initial`) yalnızca ilk mount sırasında kullanılır. Prop olarak sonradan değişen her değeri state'e kopyalayıp eşitlemek beklenmedik iki kaynak yaratır. Üst component seçimi devamlı yönetecekse ayrı bir controlled API tasarlarsın; basit tekrar kullanılabilir davranış için başlangıç değeri yeterlidir.

Hook bir UI parçasının yerine geçmez; component'lerin paylaşacağı davranış için küçük bir sözleşmedir. Bu sözleşmeyi büyütürken “hangi component bu davranışa gerçekten ihtiyaç duyuyor?” diye sor. Focus trap veya dialog rolünü her disclosure'a eklemek filtre panelini gereksiz yere modal gibi davranmaya zorlar.

:::info[Derinlemesine (isteğe bağlı)]
React Compiler uygun durumlarda component içindeki fonksiyonları otomatik olarak kararlı tutabilir. Yine de paylaşılan hook'un açıkça kararlı callback döndürmesi, compiler kullanmayan projelerde de aynı referans sözleşmesini sağlar; bu derste `useCallback` bu nedenle kullanılıyor.
:::

:::mistake[Belirti: İki toggle yalnızca bir kez değiştiriyor]
Belirti → Aynı event'teki iki toggle sonrası panel açık kalıyor.
Neden → İki çağrı da aynı render snapshot'ının tersini planladı.
Düzeltme → Functional updater ile kuyruğun önceki değerini tersine çevir.
:::

:::mistake[Belirti: Basit filtrede focus sayfadan kopuyor]
Belirti → Panel açılırken kullanıcı beklemediği biçimde modal davranışı görüyor.
Neden → Genel durum hook'una belirli bir dialog davranışı eklenmiş.
Düzeltme → Hook'u durum ve eylemlerle sınırla; UI semantiğini onu çizen component'te kur.
:::

## Özet

- Headless hook davranışı döndürür; HTML, görünüm ve erişilebilir anlam component'te kalır.
- `open` ve `close` hedef durumu doğrudan planlar; `toggle` güncel değeri tersine çevirir.
- Bir render'ın state snapshot'ı setter çağrısıyla anında değişmez; functional updater sıradaki değeri kullanır.
- Focus trap gibi davranışlar yalnızca ihtiyaç duyan dialog katmanında bulunmalıdır.

**Yeni terimler:**

- **Headless hook:** Davranışı veren ama HTML görünümünü çağırana bırakan özel hook.
- **Idempotent:** Aynı eylemi tekrarlamak sonucu değiştirmeyen işlem.
- **State snapshot:** Belirli bir render'ın okuduğu state değeri.

**Kendini yokla:** İki toggle neden functional updater ile başlangıca döner?
*Cevap:* İkinci updater, ilk güncellemenin sıraya koyduğu değeri okur.

**Kendini yokla:** `usePanelState` hook'u neden `aria-expanded` üretmiyor?
*Cevap:* Hook DOM üretmediği için düğme/panel ilişkisini kullanan UI component'i kurar.
