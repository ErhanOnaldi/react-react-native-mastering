---
title: "Tabs parçalarını birlikte çalıştır"
minutes: 16
kind: concept
---

# Tabs parçalarını birlikte çalıştır

Film ayrıntısında Özet, Oyuncular ve Videolar bölümleri var. En basit çözüm, seçili sekmeyi bir `useState` içinde tutmak; şimdi bu seçimi hem sekme düğmelerine hem panellere ulaştıracağız.

## Tek seçim, tek düğme

Önce bir `value` seçelim. `value`, hangi film bölümünün açık olduğunu anlatan kısa anahtardır.

```tsx check
import { useState } from 'react'

function FilmBolumleri() {
  const [selected, setSelected] = useState('ozet')
  return <button onClick={() => setSelected('oyuncular')}>{selected}</button>
}
```

Başlangıçta ekranda `ozet` yazar. Düğmeye basınca state `oyuncular` olur ve React yeni değeri gösterir. Seçim için tek state tuttuğumuzdan, bu örnekte iki ayrı “seçili bölüm” gerçeği oluşamaz.

Şimdi aynı seçimi bir panelin görünürlüğüne bağlayalım:

```tsx check
import { useState } from 'react'

function FilmBolumleri() {
  const [selected, setSelected] = useState('ozet')
  return (
    <>
      <button onClick={() => setSelected('oyuncular')}>Oyuncular</button>
      {selected === 'ozet' && <p>Filmin kısa özeti</p>}
      {selected === 'oyuncular' && <p>Oyuncu kadrosu</p>}
    </>
  )
}
```

Artık tıklama hem seçimi hem paneli değiştiriyor. Panel için ayrıca `isSummaryOpen` state'i tutmadık; seçili anahtardan sonucu çıkardık. Böylece düğme bir durumu, panel başka bir durumu yanlışlıkla gösteremez.

## Parçaları ayrı tutmak

Gerçek ekranda sekme düğmeleri ve paneller farklı alt component'lerde olabilir. Bu seçimi bir component'ten aşağıdaki birkaç katmana props olarak taşımaya **prop drilling** denir; her katman yalnızca aktarım yapıyorsa kodu okumak zorlaşır. React **Context**, bir üst component'in değerini alt component'lere aradaki her component'e prop eklemeden ulaştırır.

Birlikte çalışan küçük parçalardan oluşan API'ye **compound component** denir. Kök olan `Tabs` seçimi tutar; `Tabs.Trigger` ve `Tabs.Panel` aynı Context'ten okuyup kendi işini yapar. Kullanıcı JSX içinde parçaları dizer, ama parçalar ortak seçimi kendileri üretmez.

```tsx check
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

type TabsValue = { selected: string; select: (value: string) => void }
const TabsContext = createContext<TabsValue | null>(null)

function useTabsValue(): TabsValue {
  const value = useContext(TabsContext)
  if (value === null) throw new Error('Sekme parçaları Tabs içinde olmalı')
  return value
}

export function FilmTabs({ children }: { children: ReactNode }) {
  const [selected, select] = useState('ozet')
  return <TabsContext value={{ selected, select }}>{children}</TabsContext>
}
```

Kök `FilmTabs` seçimi sağlar, `useTabsValue` ise Context'i okur. `null` denetimi önemlidir: biri alt parçayı köksüz kullanırsa anlaşılır bir hata alır; daha sonra `null` alanını okumaya çalışırken belirsiz bir hata görmez. Trigger `selected === value` ile seçili olup olmadığını hesaplayabilir, Panel de aynı karşılaştırmayla içeriğini belirler.

:::model[Context yayılımı]
Context Provider'ın değeri değişince onu okuyan alt component'ler yeni değeri alıp render edilir. Burada bu tam istediğimiz şeydir: seçili sekme değişince Trigger'ın işareti ve görünen Panel birlikte güncellenir. Provider'ı bir sekme grubunun kökünde tut; iki ayrı film ayrıntı grubunun seçimi birbirinden bağımsız kalır.
:::

![Provider değeri değişince Context tüketicileri yeni değerle render edilir](diagram:context-yayilimi)

![FilmTabs seçimi Context üzerinden Tabs.List, Tabs.Trigger ve Tabs.Panel parçalarına dağıtır](diagrams/compound-context.svg "Kök state'i, alt parçalar ortak kullanır")

## Başlangıç değeri mi, dışarıdan yönetilen değer mi?

`useState('ozet')` ilk render'da başlangıç seçimini verir. Bu, **uncontrolled** API'dir: seçim bileşenin içinde yönetilir. Eğer üst component seçimi her an belirlemek ve değişikliklerden haberdar olmak istiyorsa **controlled** API kullanır; üst component `value` verir, çocuk değişiklik isteğini `onValueChange` ile bildirir.

```tsx
function FilmSayfasi() {
  const [section, setSection] = useState('ozet')
  return <FilmTabs value={section} onValueChange={setSection} />
}
```

Bu kullanımda seçim sahibi FilmSayfasi'dır. Controlled ve uncontrolled yolların ikisini birden sunmak mümkün, ama basit bir sekme grubu için önce tek yolu seçmek API'yi anlaşılır tutar. Ayrıca `defaultValue` adı “ilk değer” demektir; prop sonradan değişirse `useState` içindeki state kendiliğinden eşitlenmez.

## Erişilebilir sekme ilişkileri

Sekmelerin yalnızca görünmesi yetmez; ekran okuyucuya düğmenin sekme olduğunu ve hangi paneli kontrol ettiğini anlatan **semantik öğeler** gerekir. Önceki derste gördüğün `tablist`, `tab` ve `tabpanel` rolleri bu anlamı verir. `aria-controls`, sekmeden panele gider; `aria-labelledby`, panelden sekmenin adına döner.

Birden çok Tabs grubu sayfada bulunabilir. `useId` her grup için benzersiz bir id tabanı üretir; her `value` için bundan tab ve panel id'si türetilebilir. Değerleri doğrudan HTML id'sine eklemek yerine tek bir yerde id üretmek, aynı anahtarların farklı gruplarda çakışmasını önler.

`aria-controls` ile `aria-labelledby` görsel bir ayrıntı değildir. İki id yanlış eşleşirse kullanıcı doğru paneli görse bile ekran okuyucu ilişkiyi yanlış duyurur. Seçim, rol ve id ilişkileri aynı kaynaktan üretildiğinde bu bağ daha kolay korunur.

## Klavyede bir durak, grup içinde oklar

Tabs, dialog gibi bir **focus trap** kullanmaz; Tab tuşu sekme grubuna girer, ok tuşları grup içindeki sekmeler arasında dolaşır. **Roving tabindex**, grupta yalnızca bir öğeye `tabIndex={0}`, diğerlerine `-1` verip Tab duraklarını azaltma yöntemidir. Böylece kullanıcı Tab ile üç sekmenin her birinde durmak yerine gruba bir kez girer.

| Kullanıcı eylemi | Seçim ve focus | Görünen sonuç |
| --- | --- | --- |
| Sayfa açılır | `ozet`, ilk odak durağı | Özet paneli görünür |
| Tab ile gruba girilir | Odak seçili Özet sekmesinde | Grup tek Tab durağıdır |
| ArrowRight basılır | Odak ve seçim Oyuncular'a geçer | Oyuncular paneli görünür |
| ArrowLeft basılır | Odak ve seçim Özet'e döner | Özet paneli görünür |

Klavye davranışı da aynı seçili `value` üzerinden ilerler. Örneğin son sekmedeyken ArrowRight ilk sekmeye dönebilir; Home ilk, End son sekmeye götürür. Ok tuşu yalnızca görünür ve kullanılabilir sekmeleri izlemeli; görsel dizilişi CSS ile ters çevirip DOM sırasından ayırma.

## Bir seçim bütün parçaları günceller

Context Provider'ın altında sekme listesi, iki Trigger ve paneller olduğunu düşün. Başlangıç seçimi `ozet` olsun:

| Adım | Kök state | Trigger sonucu | Panel sonucu |
| --- | --- | --- | --- |
| İlk render | `ozet` | Özet seçili | Özet görünür |
| Oyuncular'a tıklanır | `oyuncular` planlanır | Bir sonraki render'da Oyuncular seçili | Oyuncular görünür |
| React yeni Context değerini verir | `oyuncular` | Aynı değerden hesaplanır | Aynı değerden hesaplanır |

Tıklama state güncellemesini planlar; aynı anda her alt parça kendine ait state'i değiştirmez. Yeni değer Context'ten yayıldığında iki parça da aynı seçimi okur. Bir Trigger ile Panel'in ayrışma ihtimali böylece azalır; ayrıca her ara component'e `selected` ve `select` prop'u eklemek gerekmez.

:::mistake[Belirti: Sekme başka, panel başka]
Belirti → Oyuncular sekmesi seçili görünürken Özet paneli ekranda kalır.
Neden → Trigger ve Panel birbirinden bağımsız state tutuyor veya biri state'i güncellemiyor.
Düzeltme → Kök tek `selected` değeri tutsun; iki parça da aynı değerden sonucunu hesaplasın.
:::

:::mistake[Belirti: Panel sekmeyle ilişkilendirilmiyor]
Belirti → Panelin içeriği duyuluyor ama hangi sekmeyle bağlantılı olduğu anlaşılmıyor.
Neden → `aria-controls` ve `aria-labelledby` eşleşen id'leri göstermiyor.
Düzeltme → Her Trigger-panel çifti için aynı kökten üretilen, benzersiz id'leri iki yönde bağla.
:::

Kısa model şu: kök seçim sahibidir; Trigger seçimi bildirir; Panel görünürlüğü aynı seçimden türetir. Compound API JSX yerleşiminde esneklik verir, Context ortak değeri taşır, semantik ve klavye kuralları ise sekme parçalarının sorumluluğunda kalır.

## Özet

- Compound component'ler JSX içinde ayrı dizilir ama ortak bir kök state'e dayanır.
- Context, aradaki component'lere prop eklemeden seçimi alt parçalara ulaştırır.
- Uncontrolled API başlangıç değerini içeride yönetir; controlled API değeri dışarıdan alır.
- Tab, Panel ve klavye davranışı aynı seçili değerden türesin; roving tabindex Tab duraklarını azaltır.

**Yeni terimler:**

- **Prop drilling:** Bir değeri kullanmayan ara component'lerden props ile aşağı taşımak.
- **Compound component:** Bir kök değeri paylaşarak beraber çalışan, ayrı yerleştirilebilir component ailesi.
- **Controlled / uncontrolled:** Değeri üst component'in yönetmesi / component'in kendi içinde yönetmesi.
- **Roving tabindex:** Bir grupta yalnızca bir öğeyi Tab sırasına alıp grup içinde oklarla dolaştırma yöntemi.

**Kendini yokla:** Trigger ve Panel neden ayrı seçili state tutmamalı?
*Cevap:* İki state birbirinden kopabilir; aynı kök değeri ikisinin de aynı seçimi göstermesini sağlar.

**Kendini yokla:** Sekme grubuna Tab ile girildikten sonra sekmeler arasında hangi tuşlar dolaşır?
*Cevap:* Ok tuşları; Tab her sekmede ayrı durak oluşturmaz.
