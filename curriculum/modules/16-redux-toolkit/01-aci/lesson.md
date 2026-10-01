---
title: "Ortak state büyüyünce"
minutes: 13
kind: concept
---

# Ortak state büyüyünce

Sinema’da bir `useState` değerini parent’ta tutup iki çocuğa `props` ile vermiş olabilirsin. Değeri kim değiştiriyor ve hangi çocuklar kullanıyor, koddan takip edebilirsin. **Context**, bir değeri aradaki her component’e `props` vermeden alt ağaçla paylaşır; **Redux Toolkit** ise birden çok ekranda kullanılan ortak state değişikliklerini düzenleyen bir kütüphanedir. İkisini düşünmeden önce gerçekten neyin yavaşladığını görmeyi öğrenelim.

Bir component fonksiyonunun çalışıp JSX hesaplamasına **render** denir. React hesaplanan sonucu DOM’a uygularsa bu son adıma **commit** denir. React Developer Tools içindeki **Profiler**, bu güncellemeleri ve harcanan süreyi kaydetmeye yarar; sayaç gibi yalnızca kaç defa çalıştığını değil, hangi etkileşimin ne kadar iş başlattığını da inceleyebilirsin.

## Önce tanıdık yol: state’i parent’ta tut

Film listesindeki seçili görünümü iki çocuk kullanacak. En küçük çözüm, state’i ikisinin ortak parent’ında tutup ihtiyaç duyan çocuklara `props` vermek:

```tsx check
import { useState } from 'react'

function ViewButton({ compact, onToggle }: { compact: boolean; onToggle: () => void }) {
  return <button onClick={onToggle}>{compact ? 'Geniş görünüm' : 'Sık görünüm'}</button>
}

function MovieList({ compact }: { compact: boolean }) {
  return <p>{compact ? 'Sıkı film listesi' : 'Geniş film listesi'}</p>
}

export function MoviePage() {
  const [compact, setCompact] = useState(false)
  return <><ViewButton compact={compact} onToggle={() => setCompact(!compact)} /><MovieList compact={compact} /></>
}
```

Tıklayınca `compact` değişir; parent ve iki çocuk yeniden render olur, React gereken DOM değişikliğini commit eder. Bu örnekte değer tek ekranda kullanılıyor, dolayısıyla taşınacak uzun bir `props` zinciri yok. Ortak state’i yakın parent’ta tutmak hâlâ en anlaşılır seçenek.

## Context erişimi uzatır

Şimdi aynı görünüm seçeneğini sayfanın uzak bir köşesindeki fragman paneli de okuyacak. **Context**, bir değeri parent’tan aradaki her component’e `props` taşımadan alt ağaçta paylaşır:

```tsx check
import { createContext, useContext, useState, type ReactNode } from 'react'

const CompactContext = createContext(false)
function Poster() {
  const compact = useContext(CompactContext)
  return <p>{compact ? 'Küçük afiş' : 'Büyük afiş'}</p>
}
export function MoviePage() {
  const [compact, setCompact] = useState(false)
  return <CompactContext value={compact}><button onClick={() => setCompact(!compact)}>Görünümü değiştir</button><Poster /></CompactContext>
}
```

Provider’ın altındaki `Poster` değeri okuyabilir; Provider’ın dışındaki component okuyamaz. Düğmeye basınca Context değeri değiştiği için `Poster` yeni değeri alır. Context, veriye erişimi kolaylaştırır; veriyi hangi component’in değiştirdiğini veya kaç component’in gerçekten ihtiyacı olduğunu senin yerine kararlaştırmaz.

![Context Provider değeri değişince tüketicilere yayılan güncellemeyi gösteren diyagram](diagram:context-yayilimi)

## Farklı hızdaki değerleri ayır

Bir ekranda hem tema hem de canlı film filtresi varsa, bunları tek Context nesnesine koymak kolay görünür. Ama kullanıcı her harf yazdığında tüm nesne yeniden oluşuyorsa, tema tüketicileri de güncelleme alabilir. Burada önemli olan Context sayısı değil, değerlerin ne sıklıkta değiştiği ve kimlerin okuduğudur:

```tsx check
import { createContext, useContext, useState, type ReactNode } from 'react'

const ThemeContext = createContext('dark')
const FilterContext = createContext('')
function ThemeLabel() { return <p>Tema: {useContext(ThemeContext)}</p> }
function FilterLabel() { return <p>Filtre: {useContext(FilterContext)}</p> }
export function Catalog({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState('')
  return <ThemeContext value="dark"><FilterContext value={filter}><input value={filter} onChange={(event) => setFilter(event.target.value)} /><ThemeLabel /><FilterLabel />{children}</FilterContext></ThemeContext>
}
```

Bu örnekte filtre değişince filtreyi okuyan yerler yeni değeri alır; tema değeri ayrı ve sabit kalır. Ayrı Context’ler tek başına bütün render’ları önlemez: `Catalog` parent’ı yine render olur ve normal React kuralları çocuklarını da çalıştırabilir. Bu yüzden “bir tüketici çalıştı” gözlemini tek başına Context’in gereksiz güncelleme yaptığına yormamalısın.

## Bir etkileşimi adım adım izle

Bir **StrictMode** geliştirme denetimidir; bazı render’ları ek kez çağırarak render sırasında yapılan hataları görünür kılabilir. Bu nedenle ekrandaki sayaçtaki mutlak sayıyı hedef yapma. Önce hangi etkileşimi ölçtüğünü seç, ardından Profiler kaydında o etkileşim öncesi ve sonrasını karşılaştır.

| Sıra | Ne olur? | Neyi görürsün? |
| --- | --- | --- |
| 1 | Filtre kutusuna bir harf yazarsın | Event handler `filter` state’ini günceller |
| 2 | `Catalog` yeniden render olur | Yeni `filter` metni hesaplanır |
| 3 | Context Provider yeni değer verir | Filtre tüketicileri yeni metni okur |
| 4 | React değişen görünümü DOM’a uygular | Bu uygulama adımına commit denir |
| 5 | Profiler kaydını açarsın | Hangi component’lerin ne kadar süre çalıştığını incelersin |

Render edilen JSX ile ekranda gerçekten değişen DOM aynı şey değildir. Bir component çalışabilir ama React DOM’da değişiklik bulmayabilir; bu da doğrudan kullanıcıya görünen yavaşlık anlamına gelmez. Pahalı hesaplama varsa yine önemlidir, bu yüzden kayıtta hem etkileşimin süresine hem de çalışan component’lere bak.

## Sık yapılan yanlış çıkarım

:::mistake[Belirti → Her sayaç artışını Context’e bağlamak]
Belirti → Bir tıklamadan sonra sayaç yükselir ve “Context yüzünden” dersin.
Neden → Parent’ın render’ı da çocuk fonksiyonlarını çalıştırmış olabilir; sayaç nedeni tek başına göstermez.
Düzeltme → Profiler’da etkileşimi seç, değişen Context değerini ve çalışan component’leri ayrı ayrı incele.
:::

:::mistake[Belirti → Alan değişmediği halde tüketici çalışıyor]
Belirti → `theme` metni aynı ama tema tüketicisi tekrar render oldu.
Neden → Tek Context’in `value` nesnesi her parent render’ında yeniyse, Context bütün değeri değişmiş sayar; alanları kendiliğinden ayrı ayrı izlemez.
Düzeltme → Farklı sıklıkta değişen verileri ayırmayı düşün, sonra Profiler’la farkı ölç.
:::

:::mistake[Belirti → Redux kurunca ekranın hızlanmasını beklemek]
Belirti → Store eklendi ama etkileşimin süresi aynı kaldı.
Neden → State aracı işin maliyetini otomatik düşürmez; pahalı component veya gereksiz geniş güncelleme hâlâ duruyor olabilir.
Düzeltme → Önce gerçek maliyeti ölç. Redux Toolkit’in asıl katkısı ortak state geçişlerini ve seçimleri düzenlemektir.
:::

Küçük ve seyrek değişen tema gibi değerlerde Context yeterli olabilir. Birçok ekranda kullanılan ve sık değişen ortak tercihlerde Redux Toolkit gibi bir store, değişiklik kurallarını tek yerde toplar. Araç seçimini Provider sayısına bakarak değil, verinin sahibi ve ölçtüğün iş üzerinden yap.

## Özet

- Parent state’i ve `props` küçük paylaşım alanlarında anlaşılır kalır; Context erişimi uzak alt component’lere taşır.
- Context tüketicileri Provider değerini alır; nesnenin içindeki alanlar ayrı abonelik değildir.
- Component’in render olması DOM’un mutlaka değiştiği anlamına gelmez; Profiler etkileşimdeki süreyi ve işi görmene yardım eder.
- Context veya Redux seçmeden önce neyin değiştiğini ve hangi component’lerin bu değeri kullandığını ölç.

**Yeni terimler:**

- **Render:** Component fonksiyonunun çalışıp ekrana ait JSX’i hesaplaması.
- **Commit:** React’in hesaplanan farkı DOM’a uygulaması.
- **Profiler:** React güncellemelerinin süresini ve çalışan component’leri kaydeden araç.
- **StrictMode:** Geliştirmede bazı hataları bulmaya yardım eden React denetimi.

**Kendini yokla:** Sayaç bir artınca DOM’un da değiştiğini kesin söyleyebilir misin?
*Cevap:* Hayır. Render olmuş olabilir ama React uygulanacak bir DOM farkı bulmamış olabilir.

**Kendini yokla:** Beş Context’in olması tek başına beş kat render demek midir?
*Cevap:* Hayır. Maliyeti değişim sıklığı, tüketiciler ve onların yaptığı iş belirler.
