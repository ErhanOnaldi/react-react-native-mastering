---
title: "Bileşenleri children ile birleştir"
minutes: 16
kind: concept
---

# Bileşenleri children ile birleştir

Bir film sayfasında başlık, açıklama ve eylem düğmesi görürsün. Birden fazla sayfa benzer bir çerçeve kullanıyorsa her sayfanın `<section>` ve sınıflarını kopyalamak yerine ortak bir component kurabilirsin. **Composition**, component'leri bir araya getirerek daha büyük bir arayüz kurma biçimidir: çerçeve yerleşimi üstlenir, onu kullanan yer değişken içeriği sağlar.

## Önce tek bir içerik alanı

JSX'te bir component'in açılış ve kapanış etiketleri arasına yazılan içerik, component'e `children` prop'u olarak gelir. `ReactNode`, React'in ekranda gösterebildiği metin, sayı veya JSX gibi değerlerin tipidir.

```tsx check
import type { ReactNode } from 'react'

function FilmFrame({ children }: { children: ReactNode }) {
  return <article className="film-frame">{children}</article>
}

const page = <FilmFrame><h2>Arrival</h2><p>Bir film notu</p></FilmFrame>
void page
```

`FilmFrame` article çerçevesini sağlar, ama başlığın ne olacağını bilmez. Çağıran farklı JSX verebilir ve aynı çerçeve yine işe yarar. Çerçeveye başlık ya da film verisini özel olarak tanıtmak gerekmedi; görünür içeriği olduğu gibi aldı.

## İki bölge birbirinden bağımsızsa ad ver

Tek `children` alanı yeterli olmadığında, component'e ayrı `ReactNode` props'ları ekleyebilirsin. Böyle isimli içerik alanına **slot** denir. Slot, çağıranın JSX'ini belli bir yere yerleştirir.

```tsx check
import type { ReactNode } from 'react'

function FilmPanel({ children, actions }: { children: ReactNode; actions?: ReactNode }) {
  return <article><div>{children}</div>{actions != null && <footer>{actions}</footer>}</article>
}

const panel = <FilmPanel actions={<button type="button">Fragmanı aç</button>}><h2>Dune</h2></FilmPanel>
void panel
```

Başlık `children` alanına, düğme `actions` slot'una gider; component bunları ayrı yerlere koyar. `actions` verilmezse footer da oluşturulmaz. Buradaki `actions != null` kontrolü yalnız `null` ve `undefined` değerlerini yok sayar. `0`, React'in gösterebildiği değer olduğundan, yalnız `actions && ...` yazmak sıfır verildiğinde beklenmedik biçimde `0` gösterebilir.

![Çağıranın iki ReactNode alanını ortak çerçevenin farklı bölgelerine vermesi](diagrams/composition-slotlari.svg "Çerçeve ve slot'lar")

Slot alanının isteğe bağlı olması, çağıranın her zaman içerik vermek zorunda olmadığı anlamına gelir. Örneğin bazı film kartlarında henüz fragman bulunmayabilir; boş bir footer ayırmak yerine slot'u hiç vermeyebilirsin. Böylece çerçeve, görünür olması gereken bir bölgenin var olup olmadığını açıkça kontrol eder. Birden çok slot ekleyeceksen her biri ayrı bir yerleşim sorumluluğuna karşılık gelsin; yalnız prop sayısını artırmak için adlandırılmış alan açma.

Bu yerleşim çağırana anlamlı seçim alanı açar: başka bir kullanım `actions` içine farklı bir düğme ya da link koyabilir. `FilmPanel` bunların ne yaptığını bilmez; yalnızca footer konumunu bilir. Ana içerik ve footer gerçekten ayrı alanlarsa isimli slot, her şeyi tek `children` içine koymaktan daha anlaşılırdır.

## Çerçeve düğmenin ayrıntılarını da taşıyabilir

Bazen ortak component yalnız içerik koymaz; kendisi bir HTML elementi de üretir. HTML `button` elementi `disabled`, `onClick`, `aria-pressed` ve `type` gibi doğal özelliklere sahiptir. Bunların tipini elle baştan yazmak yerine React'in `ComponentProps<'button'>` tipi hazır button prop tipini verir. `Omit<T, K>` ise T tipinden K adlı alanı çıkarır; bu araç TypeScript'in utility type'larından biridir ve daha önce görmüştün.

Sinema'daki favori düğmesi her zaman form göndermemeli. Bu yüzden component doğal button özelliklerini aktarırken `type` değerini kendi kontrolünde tutabilir:

```tsx check
import type { ComponentProps } from 'react'

type FavoriteActionProps = Omit<ComponentProps<'button'>, 'type'>
function FavoriteAction({ children, ...props }: FavoriteActionProps) {
  return <button {...props} type="button">{children}</button>
}

const favorite = <FavoriteAction disabled aria-pressed={false}>Favoriye ekle</FavoriteAction>
void favorite
```

Çağıran `disabled`, `aria-pressed` veya `onClick` gibi doğal prop'ları verebilir. `...props` (object spread) kalan özellikleri gerçek button'a aktarır. `type` ise props tipinden çıkarıldığı ve içeride sabit verildiği için çağıran tarafından `submit` yapılamaz. `type="button"` form içine konan sıradan bir düğmenin formu göndermesini önler.

Burada HTML'in yerleşik davranışından da yararlanıyoruz: `disabled` düğmeyi etkisiz yapar, `onClick` tıklamayı karşılar ve `aria-pressed` favori gibi açık/kapalı durumu yardımcı teknolojilere bildirir. Çerçeve bu özellikleri tek tek yeniden tanımlamadığı için yeni bir doğal button özelliği gerektiğinde component tipini elle genişletmen gerekmez. Yalnızca güvenlik veya tasarım kararı olarak sabit tutmak istediğin alanı dışarı kapatırsın.

## Yanlış prop tipinin belirtisi

Şöyle bir API tanımlarsan `type` hâlâ çağırana açıktır:

```tsx
type UnsafeActionProps = ComponentProps<'button'>
```

Ardından biri `<FavoriteAction type="submit">` yazabilir; düğme forma konduğunda tıklama formu yollar. Belirti, favoriye basınca formun beklenmedik biçimde gönderilmesidir. Tipten `'type'` alanını `Omit` ile çıkarıp component'in içinde `type="button"` vermek, bu kararı hem TypeScript hem HTML tarafında korur.

## Hangi parçayı kim tanımlamalı?

Bu örneklerden bir sınır çıkar: sabit kalan yerleşim ve HTML elementi çerçeve component'inde kalır; her kullanımda değişen görünür JSX'i component'i çağıran taraf verir. Bir `ReactNode` slot'u içine link ya da düğme koyduğunda çerçeve o öğeyi yeniden yorumlamaz. Eğer çerçevenin kendi kapatma davranışı varsa, bunu ayrıca `onClose` gibi bir callback prop'u ile açıklarsın.

Az sayıda ve anlamı belli görünüm seçenekleri (`disabled` veya `compact` gibi) doğal prop'lardır. Ama her olası eylem için `showFavorite`, `showTrailer`, `showRating` gibi bayraklar eklemek component'i Sinema ekranının iş kurallarına bağlar. Yeni eylemde component'i değiştirmek yerine çağıran JSX'i slot'a vermek çoğu zaman daha esnek olur.

:::model[Props aşağı, olaylar yukarı]
Bu derste slot props'u parent'tan çocuğa JSX taşır. Slot yalnızca içerik yerleştirir; tıklamanın ne yapacağını içindeki düğmenin sahibi belirler. Etkileşimden sonra bir üst bileşene bilgi dönmesi gerekiyorsa callback kullanırsın.
:::

## Özet

- Composition, sabit çerçeveyi değişken arayüz içeriğinden ayırır.
- `children` ana içeriktir; ayrı yerleşim bölgeleri isimli slot props'ları alabilir.
- `ReactNode` metin ve JSX gibi render edilebilen değerleri taşır.
- `ComponentProps<'button'>` doğal button prop tipini verir; `Omit` ile sabit tutulacak `type` alanını çıkar.
- `type="button"` form içindeki eylem düğmesinin formu istemeden göndermesini önler.

**Yeni terimler:**

- **Composition:** Component'leri bir araya getirerek daha büyük arayüz kurma biçimi.
- **Slot:** Çağıranın JSX verdiği, çerçeve içinde belirli yere yerleşen prop.
- **ReactNode:** React'in gösterebildiği metin, sayı, JSX ve benzeri değerlerin tipi.
- **ComponentProps:** Verilen React elementinin prop tipini çıkaran yardımcı tip.

**Kendini yokla:** Bir film panelinde eylem bazen link, bazen düğmeyse panel bunlardan hangisi olduğunu bilmeli mi?  
*Cevap:* Hayır; çağıran uygun JSX'i slot'a verir, panel yalnızca yerini belirler.

**Kendini yokla:** Form göndermemesi gereken bir button component'i `type` alanını neden dışarıya açmamalı?  
*Cevap:* Çağıran `submit` verip sabit tutulması gereken form davranışını değiştirebilir.
