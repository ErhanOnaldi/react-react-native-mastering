---
title: "Modal neden kartın altında kaldı?"
minutes: 14
kind: concept
---

# Modal neden kartın altında kaldı?

:::pain[Belirti]
Film kartının içinde açtığın modal kartın `overflow: hidden` sınırında kesiliyor. `z-index: 9999` ekliyorsun ama kartın stacking context'inden çıkamıyor; içerik hâlâ kırpılıyor.
:::

## İki ağaç, tek React ilişkisi

React bileşen ağacı ile tarayıcı DOM ağacı çoğu zaman aynı hiyerarşiye benzer, fakat aynı şey değildir. Bileşen ağacı state'in ve Context'in nereden geldiğini, React event'lerinin hangi ebeveynlere ulaştığını belirler. DOM ağacı ise CSS yerleşimini, clipping sınırlarını, stacking context'i ve tarayıcının erişilebilirlik ağacını etkiler.

Portal, bir React alt ağacının DOM düğümünü başka bir DOM container içine yerleştirir. Bu, React ebeveynini değiştirmez. Örneğin `Card` içinde render edilen `TrailerLayer`, DOM'da `document.body` altına çıkabilir; buna rağmen React açısından `Card` bileşeninin çocuğudur. Dolayısıyla Context değerleri korunur ve olaylar React ağacındaki üst bileşenlere kabarcıklanır.

![Portal ile Modal bileşeninin React ağacında kartın çocuğu kalırken DOM'da body altına taşınmasını ve event akışını gösteren diyagram](diagrams/react-ve-dom-agaci.svg "DOM yeri değişir, React sahipliği kalır")

Kurallar:

1. **Portal'ın iki girdisi vardır:** render edilecek React düğümü ve gerçek DOM container'ı. `createPortal(children, container)` bileşen ağacında çocuk üretir, DOM'da ise container altına yazar.
2. **Container önceden bulunmalıdır.** `document.body` küçük uygulamalar için hazırdır. Özel `#overlay-root` kullanıyorsan yok olma olasılığını ele al; null hedefi portal'a veremezsin.
3. **React sahipliği değişmez.** Context, state ve event kabarcıklanması React ağacını izler; DOM'daki yeni ebeveyni izlemez.
4. **CSS ve erişilebilirlik DOM'u izler.** Portal öğesi artık kartın clipping sınırına tabi değildir; erişilebilirlik ağacında ise gerçek DOM konumunda bulunur.
5. **Portal yalnızca yerleşim aracıdır.** Rol, erişilebilir ad, focus trap, Escape ve focus iadesi eklemez. Dialog sözleşmesi ayrıca uygulanır.

`z-index` öğeleri stacking context içinde sıralar. Bir çocuk, atasının stacking context'inin dışına çıkamaz; çok büyük sayı bu sınırı aşmaz. `overflow: hidden` da atanın çizim alanını keser. Sorun bir karttan miras alınan DOM/CSS sınırıysa, `z-index` değerleriyle yarışmak yerine modalı daha geniş bir container'a taşımak yapısal çözümdür.

DOM değişikliğinin başka bir yan etkisi, CSS seçicilerinin kapsamıdır. `.movie-card .modal` gibi descendant selector body altına taşınan modalı artık eşleştirmez; karttan gelen CSS inheritance da yeni DOM ebeveynini izler. Portal katmanları bu yüzden çoğu tasarım sisteminde kendi class ve token'larını taşır. Portal eklediğinde yalnızca kırpılmayı değil, stillerin hangi DOM kökünden geldiğini de yeniden kontrol et.

## Olay nereden yukarı çıkar?

Bir kart `onClick` ile ayrıntıyı açsın; modalın arka planında ise kapatma handler'ı olsun. Modal body'ye portal edilse bile React olay sırası kabaca şöyledir:

| Adım | React bileşen ağacı | DOM olayı |
| --- | --- | --- |
| 1 | Modal içindeki düğme hedef olur | Tarayıcı click hedefini gerçek DOM'da belirler |
| 2 | Modal'ın React handler'ı çalışır | React event sistemi olayı yakalar |
| 3 | Kartın React `onClick`'i sıraya gelebilir | DOM'da kart, body içindeki düğmenin atası değildir |
| 4 | Uygulama davranışı tamamlanır | DOM propagation ile React propagation farklı ağaçları izleyebilir |

Bu yüzden DOM'un yeni konumunu bilmek event davranışını tek başına açıklamaz. Portal içi click React ağacında kart handler'ına ulaşabilir. Kartın handler'ı modalın içindeki her click'te çalışıyorsa hedefi ve handler sahibini karşılaştır ya da event propagation politikasını açıkça belirle. `stopPropagation()` tüm üst handler'ları susturabilir; yalnızca arka plan tıklamasında kapanma istiyorsan `target === currentTarget` kontrolü daha dar bir çözümdür.

## Önce kırık, sonra doğru

Kırpılma şu yapıdan gelir:

```tsx
<article className="relative overflow-hidden">
  <button type="button">Fragmanı aç</button>
  {open && <div className="absolute inset-0 z-50">Modal içeriği</div>}
</article>
```

Modal article'ın DOM çocuğu olduğu için hem `overflow` hem de stacking context sınırı geçerlidir. Portal DOM hedefini değiştirir:

```tsx check
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'

export function OverlayLayer({ children }: { children: ReactNode }) {
  return createPortal(
    <div role="region" aria-label="Gösterim katmanı">{children}</div>,
    document.body,
  )
}
```

İz sürme: React `OverlayLayer` çağrısını kartın alt bileşeni olarak görür; Context okumaları bu yüzden çalışır. `createPortal` çocukları body altına ekler; CSS artık kartın `overflow` kutusundan kesilmez. İçindeki butona tıklanınca React event'i bileşen ağacındaki üstlere ulaşabilir. Erişilebilirlik ağacında region body altındaki DOM sırasına göre yer alır. Bu nedenle modalın DOM'daki konumuna göre ekran okuyucu sırasını da kontrol et.

Küçük bir uygulamada body genellikle en uygun hedef. Büyük uygulamada `#portal-root` ana React root'un dışında olabilir; bu da stilleri ve z-index katmanlarını ayırmayı kolaylaştırır. Yine de container sayfanın DOM'unda olmalı, global CSS ile yönetilmeli ve test/önizleme ortamında var olmalı. `document` sunucu tarafında bulunmadığı için bu kod tarayıcı odaklıdır; SSR kullanan ortamda hedefi istemci render'ında belirlemek gerekir.

## Belirti → neden → düzeltme

:::mistake[Belirti: Portal içi tıklama kartın seçimini de açıyor]
Belirti → Modalın içindeki oynat düğmesine tıklayınca kartın React handler'ı çalışıyor.  
Neden → Portal DOM'u değiştirir, React olaylarının bileşen ağacında kabarcıklanmasını değil.  
Düzeltme → Handler'da hedefi kontrol et veya yalnızca gerektiği yerde propagation'ı durdur.
:::

:::mistake[Belirti: Modal body'ye çıktı ama klavyeyle arkaya geçiliyor]
Belirti → Focus modal dışındaki bağlantılara ilerliyor.  
Neden → Portal yalnızca DOM konumunu değiştirir; focus trap sağlamaz.  
Düzeltme → Modalın Tab/Shift+Tab sınırını ve focus iadesini ayrıca uygula.
:::

:::mistake[Belirti: Portal testte boş ekran veriyor]
Belirti → Uygulama `createPortal` çağrısında container hatası veriyor.  
Neden → Özel root bulunamamış ya da `document` henüz yok.  
Düzeltme → Hedef DOM düğümünün varlığını garantile; tarayıcı dışı render'da container seçimini ertele.
:::

:::mistake[Belirti: Arka planın her yerine tıklayınca kapanıyor]
Belirti → Dialog başlığına veya düğmesine tıklayınca da dışarı tıklama davranışı çalışıyor.  
Neden → Arka plan handler'ı kabarcıklanan bütün click'leri kendi tıklaması sanıyor.  
Düzeltme → `event.target === event.currentTarget` olduğunda kapat.
:::

:::model[React ağacındaki state ve key]
Bir portal DOM'da başka yerde görünse de React ağacındaki sahipliğini korur; bu nedenle state kimliği ve Context erişimi bileşen ağacından gelir. Burada `key` ile state sıfırlama ihtiyacı yoktur: yeni olan yalnızca DOM yerleşimidir, React bileşen kimliği değildir.
:::

![React component state'inin aynı ağaç konumu ve key korunurken yaşadığını gösteren ortak diyagram](diagram:agac-ve-kimlik)

:::sector
Tasarım sistemleri modal, tooltip ve popover katmanlarını çoğunlukla merkezi bir portal root'ta tutar. Bu katman z-index kararını sayfa kartlarından ayırır. Kod incelemesinde ekipler event'lerin hangi ağaçta yayıldığını, dialogun erişilebilirlik ağacındaki sırasını ve modal kapanınca focus'un nereye döndüğünü birlikte kontrol eder.
:::

## Özet

- React bileşen ağacı sahipliği, Context'i ve React event kabarcıklanmasını belirler.
- DOM ağacı CSS sınırlarını ve erişilebilirlik sırasını belirler.
- Portal DOM hedefini değiştirir, React ebeveynini değiştirmez.
- `z-index` atasının stacking context sınırını aşamaz; clipping için portal gerekebilir.
- Portal dialog semantiği veya klavye davranışı eklemez.

**Kendini yokla:** Portal body altındaysa Context değeri kaybolur mu?  
*Cevap:* Hayır. Context React bileşen ağacını izler.

**Kendini yokla:** Portalın içine tıklanan olay hangi üstlere kabarcıklanabilir?  
*Cevap:* DOM üstlerine değil yalnızca; React ağacındaki üst bileşen handler'larına da ulaşabilir.
