---
title: "Davranış ve görünümü ayır"
minutes: 14
kind: concept
---

# Davranış ve görünümü ayır

:::pain[Belirti]
Fragman dialogu, mobil film filtresi ve “Daha fazla” menüsü aynı `open`, `close`, `toggle` kodunu tekrarlıyor. Birinde `setOpen(!open)` yazılmış; aynı olayda iki kez toggle gelince menü beklenen yere dönmüyor. Üç farklı arayüze aynı dialog markup'ını zorlamak da filtreyi yanlış bir pencereye dönüştürüyor.
:::

## Headless: davranış var, görünüm çağıranda

Headless hook veya bileşen tekrar kullanılabilir davranışı sunar, fakat görünümü ve DOM etiketini sabitlemez. `useDisclosure` açık/kapalı değerini ve eylemleri verir. Çağıran taraf ise bunun modal, çekmece, menü ya da inline panel olup olmadığına; hangi HTML öğesinin kullanılacağına; renk ve yerleşime karar verir.

Bu ayrım “erişilebilirliği başka birine bırak” demek değildir. Hook görünüm oluşturmadığı için rol ve focus seçemez; arayüzü kullanan component, kendi anlamına uygun ARIA ve klavye davranışını eklemelidir. Disclosure bir düğmeyle paneli açıyorsa düğme `aria-expanded` ve paneli işaret eden `aria-controls` taşıyabilir. Gerçek modal ise ayrıca adlandırma, focus trap, Escape ve focus iadesi ister.

Kurallar:

1. **Hook iş alanına ait durumu sahiplenir.** Örneğin boolean açık/kapalı hali ve bu durumu değiştiren eylemler.
2. **Görsel API çağıran component'te kalır.** Hook DOM üretmez; filtre çekmecesi ile dialog aynı etiketi veya stili paylaşmaya zorlanmaz.
3. **Eylemler idempotent olmalı.** `open` zaten açıkken açık bırakır; `close` zaten kapalıyken kapalı bırakır.
4. **Toggle güncel state üzerinden hesaplanmalı.** Bir React olayında birden fazla güncelleme kuyruğa girebilir; fonksiyonel updater her adımda önceki kuyruk değerini alır.
5. **Referans kararlılığı public sözleşme olabilir.** Hook'un `close` değeri effect dependency listesine girecekse render'lar arasında sabit olması tüketiciyi gereksiz senkronizasyondan korur.
6. **Her davranışı hook'a doldurma.** Focus trap, dialog adı veya dışarı tıklama kontrolü yalnızca bunlara ihtiyacı olan UI sınırında bulunmalı.

:::model[State snapshot]
Bir render'da `isOpen` o render'ın anlık değeridir. Event handler aynı closure içindeki eski değeri tekrar okuyabilir; state setter'a fonksiyon verince React güncelleme kuyruğundaki en yeni değeri kullanır. Buradaki yeni bağlam, boolean geçişlerini tekrar kullanılabilir bir eylem API'sine taşımaktır.
:::

## İki toggle'ı adım adım izle

Başlangıç değeri `false` iken aynı event içinde iki toggle çalıştığını düşün:

| Adım | Closure değeri `isOpen` | `setIsOpen(!isOpen)` kuyruğu | Updater kuyruğu |
| --- | --- | --- | --- |
| İlk çağrı | `false` | `true` | `!false` → `true` |
| İkinci çağrı | hâlâ `false` | yine `true` | önceki güncelleme `true`; sonra `!true` → `false` |
| Sonuç | render snapshot'ı değişmedi | `true` kalır | `false` başlangıca döner |

State setter'ı event anında yeni değere dönüştürmez; güncelleme planlar. Bu yüzden `setIsOpen(!isOpen)` aynı render'daki snapshot'a iki kere bakabilir. `setIsOpen((current) => !current)` ise kuyruğa sırayla uygulanan bir fonksiyon verir. Aynı kural sayaç artırma, listeye ekleme ve güncel değere göre karar verme için de geçerlidir.

Başlangıç değeri de yalnızca ilk mount'ta okunur. `useState(initial)` kullanıcının prop'u her değiştiğinde state'i kendiliğinden eşitlemez; “ilk açılışta açık başlasın mı?” sorusuna cevap verir. Dışarıdan her an değişen değer gerekiyorsa hook'u controlled API olarak tasarla ve `value`/`onChange` al. İlk değer ile devam eden kontrolü karıştırmamak, yeniden render'da beklenmeyen state resetlerini önler.

## Kırık ve doğru davranış sınırı

Kırık toggle eski render değerini kapatır:

```tsx check
import { useState } from 'react'

export function BrokenSwitch() {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen(!open)
  return <button onClick={() => { toggle(); toggle() }}>{String(open)}</button>
}
```

Tek `useState` kullanan, DOM'dan bağımsız bir hook davranışı tekrar kullanılabilir hale getirebilir:

```tsx check
import { useCallback, useState } from 'react'

export function usePanelState(initial = false) {
  const [isOpen, setIsOpen] = useState(initial)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((current) => !current), [])
  return { isOpen, open, close, toggle }
}
```

İz sürme: ilk render `isOpen=false` ve üç eylem fonksiyonu üretir. `open` sabit `true` planlar; iki çağrı da `true` bırakır. `toggle` güncelleme kuyruğunu tersine çevirir, iki çağrı başlangıç değerine geri döndürür. State değişince component yeniden render olur ama callback referansları aynı kalır. Bir component `useEffect(() => close(), [route, close])` yazdığında route değişimi kapatma gerektirir; sıradan başka render'ın effect'i tekrar tetiklemesi gerekmez.

React Compiler birçok uygulama kodundaki manuel memo ihtiyacını azaltır. Fakat bir kütüphane hook'u, compiler kullanmayan uygulamada da kararlı callback sözü verecekse bu davranış API sözleşmesine dönüşür. `useCallback` yazmak otomatik olarak hızlı kod anlamına gelmez; burada belirli tüketici beklentisini sağlamak için kullanılır. Kararlılık gerekmiyorsa gereksiz memo katmanı ekleme.

## UI katmanında semantiği tamamla

Hook yalnızca `isOpen` verir. Disclosure kullanan bir bölüm bunu kendi etiketleriyle ifade eder:

```tsx check
import { useState } from 'react'

function usePanelState() {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen((current) => !current)
  return { isOpen, toggle }
}

export function FilterDisclosure() {
  const panel = usePanelState()
  return (
    <section>
      <button type="button" aria-expanded={panel.isOpen} onClick={panel.toggle}>
        Filtreler
      </button>
      {panel.isOpen && <div>Tür ve süre seçenekleri</div>}
    </section>
  )
}
```

Bu panel modal değildir; focus trap eklemek hatalı olur. Eğer aynı hook modal kökünde kullanılırsa, Modal.Content component'i `role="dialog"`, `aria-modal`, `aria-labelledby`, portal ve focus yönetimini kendi sorumluluğunda tutar. Davranış paylaşılır, ama semantik ve görünüm ihtiyaca göre kalır. Hook'a `children`, class adları veya HTML element tipi eklemek ayrımı ortadan kaldırır.

## Belirti → neden → düzeltme

:::mistake[Belirti: Çift tıklama bir toggle adımını yutuyor]
Belirti → İki toggle çağrısı sonrası state bir kez değişmiş.  
Neden → Her iki güncelleme de aynı render snapshot'ının tersini kuyruğa koymuş.  
Düzeltme → Fonksiyonel setter ile güncel değeri tersine çevir.
:::

:::mistake[Belirti: Menü hook'u gereksiz modal gibi davranıyor]
Belirti → Basit çekmecede focus sayfadan kopuyor veya Escape beklenmedik etki yapıyor.  
Neden → Genel açık/kapalı state hook'u dialog klavye politikasını da üstlenmiş.  
Düzeltme → Hook'u state ve eylemlerle sınırla; modal davranışını modal component'ine koy.
:::

:::mistake[Belirti: Her render'da route effect'i çalışıyor]
Belirti → Route değişmemişken menü kapanıyor veya animasyon tekrar başlıyor.  
Neden → Effect dependency'sindeki `close` her render'da yeni fonksiyon.  
Düzeltme → Public hook sözleşmesi kararlı referans gerektiriyorsa callback'i `useCallback` ile sabitle.
:::

:::mistake[Belirti: `open()` sonrası state tersine dönüyor]
Belirti → Açma eylemi kapalı/açık durumuna göre ters işliyor.  
Neden → `open` fonksiyonu toggle semantiğiyle yazılmış.  
Düzeltme → `open` doğrudan `true`, `close` doğrudan `false` planlamalı; toggle ayrı eylem olmalı.
:::

:::model[Context yayılımı]
Bir compound root ortak state'i Context üzerinden alt parçalara dağıtır. Headless hook ise API'nin sadece davranış kısmını çıkarır; kendi başına provider kurmaz. Modal pattern'inde bu iki yaklaşım birleşebilir: hook state'i üretir, root Context'e verir, parçalar değeri okur.
:::

:::sector
Tasarım sistemlerinde davranış hook'ları görsel component ailesinden bağımsız kalır. Ürün farklı ekranlarda aynı seçim mantığını farklı yerleşimle kullanabilir. Ekipler public hook döndürdüğü fonksiyonların idempotentliğini, referans beklentisini ve UI semantiğinin hangi katmanda sağlandığını API dokümantasyonunda belirtir.
:::

## Özet

- Headless API davranışı verir, HTML ve görünümü kullanan component seçer.
- `open`/`close` idempotent; `toggle` fonksiyonel updater kullanır.
- State snapshot'ı ile update kuyruğu farklı şeylerdir.
- Kararlı callback, yalnızca tüketicinin buna ihtiyaç duyduğu sözleşmede önemlidir.
- Disclosure state'i dialogun erişilebilirlik ve focus kurallarını otomatik getirmez.

**Kendini yokla:** Aynı olayda iki kez çağrılan `setOpen(!open)` neden iki geçiş yapmayabilir?  
*Cevap:* İki çağrı da aynı render snapshot'ındaki `open` değerini okur.

**Kendini yokla:** Hook bir panel açıyorsa focus trap'i de kendisi kurmalı mı?  
*Cevap:* Hayır. Trap modal dialog gibi belirli bir UI semantiğinin sorumluluğudur.
