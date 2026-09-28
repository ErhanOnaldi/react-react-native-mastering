---
title: "Tabs parçaları birlikte çalışsın"
minutes: 16
kind: concept
---

# Tabs parçaları birlikte çalışsın

:::pain[Belirti]
Film ayrıntısında Özet, Oyuncular ve Videolar sekmelerine `active`, `onChange` ve kimlik prop'larını ayrı ayrı taşıyorsun. Bir panel yanlış sekmeye bağlanınca seçili çizgi Oyuncular'ı gösterirken ekranda Özet kalıyor. Her bölüm kendi state'ini tutunca iki panel aynı anda açık bile kalabiliyor.
:::

## Paylaşılan Context, açık parça API'si

Compound component'ler birbirleriyle uyumlu çalışan küçük bileşenlerden oluşur. Kök (`Tabs`) seçimi ve ortak kimlik bilgisini sahiplenir; `List`, `Trigger` ve `Panel` gibi alt parçalar o ortak değere göre davranır. Kullanıcı bunları JSX içinde ihtiyacına göre dizer. Böylece tek bir devasa bileşen sabit DOM üretmez, her alt elemana aynı state prop'larını elle taşıman da gerekmez.

:::model[Context yayılımı]
Context Provider değeri değişince o Context'i okuyan tüm tüketiciler render edilir. Tabs bağlamında bu istenen davranıştır: Trigger seçili durumu, Panel de görünürlüğü aynı seçimden türetir. Yeni olan, geniş uygulama verisi değil; kapsamı tek bir Tabs kökü olan küçük bir UI sözleşmesidir.
:::

![Provider değeri değişince Context tüketicilerine yayılan güncelleme](diagram:context-yayilimi)

![Tabs kökünün seçimi ve id tabanını ortak Context üzerinden List, Trigger ve Panel parçalarına dağıttığını gösteren diyagram](diagrams/compound-context.svg "Kök state'i, alt parçalar ortak kullanır")

Kurallar:

1. **Tek state sahibi seç.** Kök `defaultValue` veya kontrollü `value` alır. Trigger seçimi bildirir; Panel hangi içeriğin görünür olduğunu aynı seçimden hesaplar.
2. **Alt parçalar Context tüketir.** Her render ağacındaki en yakın Tabs kökünün state ve davranışına bağlanırlar. Prop zinciri oluşmaz.
3. **Provider dışında kullanım anlaşılır hata verir.** Null Context değerini denetleyen bir hook, yanlış kullanımı ilk render'da tanımlar.
4. **Roller ve ilişkiler component API'sinin parçasıdır.** `tablist`, `tab`, `tabpanel`, `aria-selected`, `aria-controls` ve `aria-labelledby` görsel ayrıntı değil, davranış sözleşmesidir.
5. **Klavye modeli role göre seçilir.** Tabs'te Tab seçili sekmeye girer; ok/Home/End sekmeler arasında dolaşır. Dialogun klavye trap'i burada uygulanmaz.
6. **API'de bileşen yerleşimi serbest, anlam sabit kalır.** Tasarım alanı verirken ARIA ilişkilerini ve klavye beklentisini koru.

`Tabs.List` ve `Tabs.Trigger` yazımı, kök üstünde statik alt bileşenler sunan bir API'dir. Aynı parçaları ayrı named export'larla dışa açmak da mümkündür. Nokta yazımı tek başına erişilebilirlik sağlamaz; yalnızca bileşenleri bir aile olarak keşfetmeyi kolaylaştırır. Öğrenci API'yi kullanırken gereken parçaları bir arada görür.

## Bir seçim nasıl bütün parçaları günceller?

Başlangıçta `selected = 'summary'` olsun. React ağacında Tabs Provider, onun altında tablist, iki trigger ve paneller var:

| Olay | Kök state | Trigger durumu | Panel sonucu |
| --- | --- | --- | --- |
| İlk render | `summary` | Özet seçili, Oyuncular seçili değil | Özet görünür |
| Oyuncular tıklanır | `cast` olur | Oyuncular seçili olur | Oyuncular görünür |
| Başka tüketici render edilir | `cast` kalır | Aynı seçimden hesaplanır | Aynı panel görünür |

Bu akışta seçili durumu her trigger'ın içinde ayrı ayrı saklanmaz. Kök tıklama event'ini `setSelected(value)` ile işler; Provider yeni değeri verir; tüketiciler aynı kaynağı okur. İki bağımsız state varsa birinin güncellenip diğerinin unutulması mümkündür. Ortak state ile tutarsız kombinasyon temsil edilemez.

`aria-controls` sekmenin hangi paneli kontrol ettiğini; `aria-labelledby` paneli hangi sekmenin adlandırdığını gösterir. Bu id'ler aynı kökten türeyip aynı `value` için eşleşmeli. `useId` birden çok Tabs örneğini sayfaya koyduğunda benzersiz taban üretir. `value` değerini doğrudan HTML id'ye koymak güvenli olmayabilir; karakter kısıtları ve aynı değerli nested component'ler id çakışması doğurabilir.

## Kırık ve düzeltilmiş parça

Her Trigger kendi seçili state'ini tutarsa liste iki farklı gerçek üretir:

```tsx
function SummaryTrigger() {
  const [selected, setSelected] = useState(true)
  return <button aria-selected={selected}>Özet</button>
}
```

Bu state yalnızca kendi içinde değişir; diğer Trigger ve Panel onunla haberleşmez. Doğru model seçimi köke alır, Context'in dışında alt parçayı hata ile durdurur:

```tsx check
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

type TabsValue = { selected: string; select: (value: string) => void }
const TabsContext = createContext<TabsValue | null>(null)

function useTabsValue(): TabsValue {
  const value = useContext(TabsContext)
  if (value === null) throw new Error('Tabs parçaları Tabs içinde kullanılmalı')
  return value
}

export function ReadingTabs({ children }: { children: ReactNode }) {
  const [selected, select] = useState('details')
  return <TabsContext value={{ selected, select }}>{children}</TabsContext>
}
```

`useTabsValue` null sınırını tek yerde kontrol eder. Trigger `selected === value` ile durumunu çıkarır; Panel aynı karşılaştırmayla içeriğini gösterir. Controlled API gerekiyorsa kök `value` ve `onValueChange` alabilir, ama controlled/uncontrolled iki yolu birden sunmak API karmaşıklığını artırır. Önce gerçek kullanım ihtiyacına göre birini seç.

Bu örnekte Provider her root render'ında yeni nesne üretebilir. Tabs'in kendi kapsamı küçük olduğu ve seçim değişince tüm parçaların güncellenmesi gerektiği için çoğu kullanımda bu kabul edilebilir. Ancak Context tüm sayfaya açılıp yüksek frekansla güncellenen büyük değerler taşırsa tüketiciler gereksiz render alabilir. Context'i yalnızca prop drilling'i ortadan kaldırmak için her seviyede ekleme; bir alt bileşeni `children` composition ile taşımak daha basit olabilir.

## Belirti → neden → düzeltme

:::mistake[Belirti: İki panel aynı anda seçili]
Belirti → Özet ve Oyuncular içeriği birlikte görünüyor.  
Neden → Paneller ayrı state tutuyor veya seçimi birbirinden bağımsız hesaplıyor.  
Düzeltme → Seçimi kökte tek kaynak yap; tüm alt parçalar aynı Context'i okusun.
:::

:::mistake[Belirti: Alt parça boş render ediyor]
Belirti → `Tabs.Trigger` ekranda görünmüyor ve hata da yok.  
Neden → Context varsayılanı sessiz değer veya null assertion ile saklanmış.  
Düzeltme → Provider yoksa özel hook anlaşılır hata fırlatsın.
:::

:::mistake[Belirti: Ekran okuyucu panelin sekmesini söylemiyor]
Belirti → Panel içeriği duyuluyor ama hangi sekmeyle ilişkili olduğu belirsiz.  
Neden → Tab ve panel id bağları eksik ya da eşleşmiyor.  
Düzeltme → `aria-controls` ve `aria-labelledby` aynı id çifti üzerinden bağla.
:::

:::mistake[Belirti: Her Tab tüm sekmelerde duruyor]
Belirti → Kullanıcı her sekmeye ayrı Tab basarak ulaşmak zorunda.  
Neden → Roving tabindex yok; tüm trigger'lar `tabIndex=0`.  
Düzeltme → Yalnız seçili trigger `0`, diğerleri `-1` olsun; grup içi hareketi ok tuşlarına ver.
:::

:::model[Context yayılımı]
Sağlayıcı değişince tüketiciler render olur; bu, ortak değerin tek kaynaktan yayılmasıdır. Tabs'te seçili değerin Trigger ve Panel'e aynı anda ulaşması istenen sonuçtur. Provider kapsamını her sekme grubunun kökünde tut; bağımsız gruplar farklı seçimlere sahip olabilir.
:::

:::sector
UI kütüphaneleri compound bileşenleri, kullanıcıya esnek markup verirken ortak davranışı tek yerde tutmak için kullanır. Tasarım sistemi ekipleri component API incelemesinde “hangi parçalar birlikte kullanılmalı?”, “provider dışında ne olur?” ve “klavye sözleşmesi nedir?” sorularını netleştirir. Bileşen API'sini tasarlarken esneklik ile yanlış kombinasyonları engelleme arasında denge kur.
:::

## Özet

- Compound API alt parçaları serbestçe dizer; Context ortak state ve kimliği taşır.
- Seçim, kökte tek kaynak olur; Trigger ve Panel görünümü ondan türetir.
- Provider dışında kullanım erken ve anlaşılır biçimde hata vermeli.
- ARIA rollerinin ve iki yönlü id bağlarının doğruluğu görsel düzenden bağımsızdır.
- Context'i dar kapsamlı kullan; tek child taşıma ihtiyacında composition yeterli olabilir.

**Kendini yokla:** Trigger ve Panel neden ayrı `useState` tutmamalı?  
*Cevap:* İki state birbirinden kopabilir; ortak kök değeri tutarlılığı garanti eder.

**Kendini yokla:** Provider dışında `Tabs.Trigger` kullanılırsa sessiz boşluk yerine ne olmalı?  
*Cevap:* Hatanın nedenini ve gereken Tabs kökünü söyleyen anlaşılır hata.
