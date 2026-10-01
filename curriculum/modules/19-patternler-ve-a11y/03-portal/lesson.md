---
title: "Modal neden kartın altında kaldı?"
minutes: 17
kind: concept
---

# Modal neden kartın altında kaldı?

Bir film kartına fragman önizlemesi koydun. Kartın `overflow: hidden` stili taşan içeriği kesiyor; fragman penceresinin alt kısmı görünmüyor. `z-index: 9999` eklesen bile kartın sınırından çıkmıyorsa önce modalın nerede render edildiğine bak. Burada üç ağaç ilişkisini ayıracağız: React bileşen ağacı, tarayıcı DOM ağacı ve ekranda çizilen katmanlar.

## Kart içinde duran katman

`overflow: hidden`, bir öğenin kutusunun dışına taşan çizimi görünmez yapan CSS ayarıdır; buna **clipping** (kırpılma) denir. Aşağıdaki önizleme kartın çocuğu olduğu için kartın çizim alanının dışına çıkamaz:

```tsx
<article className="movie-card">
  <button type="button">Fragmanı aç</button>
  {open && <div className="overlay">Fragman bilgisi</div>}
</article>
```

Kartta `overflow: hidden` varsa, overlay'in taşan bölümü kesilir. `z-index` öğelerin öne-arkaya sırasını etkiler; ama kartın içindeki bir çocuk kartın dışındaki her şeyle sınırsız yarışamaz. Bu sınırı kuran **stacking context**, öğelerin kendi içinde öne-arkaya sıralandığı CSS katmanıdır. Çok büyük `z-index`, çocuğu atasının katmanından çıkarmaz.

## DOM yerini değiştir

**Portal**, React alt ağacını DOM'da başka bir container içine yerleştirir. `createPortal(children, container)` çocukları React'te render eder; ikinci parametre onların DOM'da nereye ekleneceğini söyler. Film kartından açılan küçük bir fragman bildirimi body altına taşınabilir:

```tsx check
import { createPortal } from 'react-dom'

export function TrailerNotice({ open }: { open: boolean }) {
  if (!open) return null
  return createPortal(
    <p role="status">Fragman hazır</p>,
    document.body,
  )
}
```

Artık bildirim `document.body` altında çizilir; kartın `overflow` sınırına tabi değildir. Bu örnek bir dialog yapmıyor: portal rol, ad, Escape, focus trap veya focus iadesi eklemez. Yalnızca DOM yerini değiştirir. `document.body` tarayıcıda hazırdır; özel `#overlay-root` kullanırsan hedefin gerçekten var olduğundan emin ol.

Portalın iki ağacını gözünde tut:

![Portal ile Modal bileşeninin React ağacında kartın çocuğu kalırken DOM'da body altına taşınmasını ve event akışını gösteren diyagram](diagrams/react-ve-dom-agaci.svg "DOM yeri değişir, React sahipliği kalır")

React ağacında `TrailerNotice`, çağrıldığı bileşenin altındadır. DOM'da ise bildirimi `body` altında bulursun. **Event bubbling**, bir olayın hedef öğeden üst öğelere doğru yayılmasıdır. DOM olayları DOM ağacında ilerler; React'in portal içindeki event'leri ise React bileşen ağacındaki üstlere de yayılır. CSS ve erişilebilirlik ağacının DOM konumunu izlemesi, React state ve Context'in yeni DOM ebeveynine taşındığı anlamına gelmez.

## React ebeveyni hâlâ olayı alabilir

Şimdi kartın kendisinde ayrıntıyı açan bir `onClick` olduğunu varsay. Portal içindeki bildirime tıklayınca, DOM'da kart bildirim düğmesinin atası değildir. Fakat bildirim React ağacında kartın altında render edildiği için React event'i kart handler'ına ulaşabilir:

```tsx check
import { createPortal } from 'react-dom'

export function MovieTile({ onOpen }: { onOpen: () => void }) {
  return (
    <article onClick={onOpen}>
      <h2>Ay Işığı</h2>
      {createPortal(
        <button type="button">Puan ayrıntısı</button>,
        document.body,
      )}
    </article>
  )
}
```

Butona tıklamak `onOpen` çağrısına da yol açabilir. Bunu istemiyorsan click handler'ında hedefi kontrol et veya olayın üstlere çıkmasını yalnızca bu düğmede durdur. Tüm olayları gelişigüzel durdurmak başka davranışları da kesebilir. Arka plan tıklamasıyla kapanan bir dialogda, yalnızca arka planın kendisine tıklanmışsa kapatmak için `event.target === event.currentTarget` kontrolü daha dar bir tercihtir.

| Adım | React bileşen ağacı | DOM / olay davranışı |
| --- | --- | --- |
| 1 | Portaldaki düğme kart bileşeninin altındadır | Tarayıcı gerçek DOM'daki düğmeyi click hedefi seçer |
| 2 | Düğmenin React handler'ı varsa çalışır | React olayı işler |
| 3 | Kartın React `onClick`'i de çalışabilir | Kart, DOM'da düğmenin üstü olmasa bile React ağacında üstüdür |
| 4 | Uygulama handler'larındaki koşullara göre devam eder | DOM yerleşimi ve React event yayılımı farklı ağaçları izler |

## Üç kontrol noktasıyla izle

Bir modalı body altına taşıdığında üç farklı soruyu sırayla sor. **Yerleşim:** Hangi DOM container içinde? **React sahipliği:** Hangi bileşenin state ve Context'ini kullanıyor? **Etkileşim:** Click hangi React handler'larına yayılıyor, klavye odağı nerede? Birinci sorunun cevabını değiştirmek, diğer iki cevabı otomatik değiştirmez.

:::model[React ağacındaki state ve key]
Portal DOM'da başka yerde görünse de React ağacındaki sahipliğini korur; bu nedenle state kimliği ve Context erişimi bileşen ağacından gelir. Burada `key` ile state sıfırlama ihtiyacı yoktur: yeni olan DOM yerleşimidir, React bileşen kimliği değil.
:::

![State aynı ağaç konumu ve key korunurken yaşar; değişince sıfırlanabilir](diagram:agac-ve-kimlik)

CSS seçicilerini de yeni DOM konumunda kontrol et. `.movie-card .overlay` gibi descendant selector, body altına çıkan overlay'i artık eşleştirmez. Karttan gelen CSS inheritance da yeni DOM ebeveynini izler. Portal katmanına kendi class'ını vermek stilleri tahmin edilebilir tutar.

## Gerçek bir hata ve düzeltmesi

Belirti: `z-index` sayısını 50'den 9999'a çıkarıyorsun ama modal hâlâ kesiliyor. Sorun sayının küçük olması değil; modal hâlâ `overflow: hidden` olan kartın içinde çiziliyor. Modalı daha geniş bir DOM container'ına portal etmek kırpılma sınırını değiştirir. Modalın ekran okuyucu adı, focus davranışı ve kapanış etkileşimleri ise ayrıca ele alınır.

:::mistake[Belirti: modal body'ye çıktı, ama Tab arka sayfaya geçiyor]
Portal DOM yerini değiştirir; focus trap ve focus iadesi eklemez. Dialog klavye davranışını ayrıca kur.
:::

:::mistake[Belirti: portal içi tıklama film kartını da açıyor]
Portal React ebeveynini değiştirmediği için React event'i o ebeveyne yayılabilir. Handler'da hedefi denetle veya gereken olayda yayılımı durdur.
:::

:::mistake[Belirti: portal testte container hatası veriyor]
Özel container bulunamamış olabilir ya da kod `document` olmayan sunucu ortamında çalışıyordur. Hedef DOM düğümünün varlığını sağla; sunucu tarafında çalışıyorsan container'ı istemci tarafında seç.
:::

:::sector
Tasarım sistemleri modal, tooltip ve popover katmanlarını genellikle merkezi bir portal root'ta tutar. Bu, katmanların kartların CSS sınırlarından bağımsız yönetilmesini sağlar. Kod incelemesinde DOM konumunu, React event yayılımını ve klavye akışını ayrı ayrı kontrol etmek işe yarar.
:::

## Özet

- `overflow: hidden` taşan çizimi kırpar; stacking context kendi içindeki z-index sırasını sınırlar.
- Portal, React alt ağacının DOM container'ını değiştirir; React ebeveynini, state'ini ve Context erişimini değiştirmez.
- CSS ve erişilebilirlik sırası gerçek DOM konumunu izler; React event'leri bileşen ağacındaki üstlere yayılabilir.
- Portal dialog semantiği veya klavye davranışı kurmaz; bunları ayrıca eklersin.
- Özel portal container kullanıyorsan varlığını ve CSS kapsamını kontrol et.

**Yeni terimler**

- **Stacking context:** CSS'te öğelerin kendi içinde öne-arkaya sıralandığı katman.
- **Clipping (kırpılma):** Taşan içeriğin bir kutunun sınırında görünmez olması.
- **Event bubbling:** Olayın hedeften üst öğelere doğru yayılması.

**Kendini yokla:** Body altına portal edilen bileşen React'teki Context değerini kaybeder mi?

*Cevap:* Hayır. Context DOM ağacını değil, React bileşen ağacını izler.

**Kendini yokla:** `z-index: 9999` neden `overflow: hidden` içindeki modalı kurtarmayabilir?

*Cevap:* Büyük z-index stacking context sırasını değiştirir; modalı clipping yapan DOM atasından çıkarmaz.
