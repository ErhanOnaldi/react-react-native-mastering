---
title: "Kartları ve içerik satırlarını yerleştir"
minutes: 16
kind: concept
---

# Kartları ve içerik satırlarını yerleştir

:::pain[Dar ekranda kartlar taşıyor]
Film kataloğunda 12 poster masaüstünde tek sütun halinde uzuyor. Telefon görünümünde üç sütun sabit kalınca başlıklar sıkışıp puanlar poster alanının dışına taşıyor.
:::

## Önce düzen problemini tanı

Bir sayfada posterlerin yan yana dizilmesi ile tek posterin başlık ve puan satırı aynı problem değildir. Grid satır ve sütunları birlikte düzenler; Flexbox bir eksende hizalama ve boşluk paylaşımı için uygundur. Tailwind class'ları CSS'in bu iki düzen modelini kullanır; birbirlerinin yerine geçmezler.

:::model[Grid dış ilişkiyi, flex iç ilişkiyi kurar]
1. Birden çok eş boyutlu kartın satır ve sütunlarını Grid ile tanımla.
2. Bir kart içindeki başlık, puan veya eylem gibi elemanları çoğunlukla Flexbox ile hizala.
3. Dar görünüm temel düzendir; responsive eşikler yalnızca gerekli genişlikte yeni sütun veya hizalama ekler.
4. Uzun içeriğin bulunduğu flex/grid çocuğuna küçülme izni ver; görsel taşmayı ayrıca ele al.
:::

![Izgara dış kartları, flex içeriği hizalar](diagrams/dis-duzen-ic-duzen.svg)

Bu ayrım, hangi öğenin hangi alanı yönettiğini belli eder. Eğer ızgara içindeki her kart kendi `display: flex` düzenini kullanıyorsa iki model birbirine karışmaz; her biri farklı seviyedeki ilişkiyi çözer.

## Responsive sütunları izleyelim

`grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5` satırını genişliği artan bir pencereyle takip edelim:

| Viewport | Eşik durumu | Etkin sütun class'ı | Sonuç |
|---|---|---|---|
| 390 px | `md` yok | `grid-cols-2` | iki sütun |
| 900 px | `md` var, `xl` yok | `md:grid-cols-3` | üç sütun |
| 1400 px | `md` ve `xl` var | `xl:grid-cols-5` | beş sütun |

`gap-4` bütün boyutlarda kartlar arasındaki boşluğu korur. Responsive prefix cihaz türü değildir; viewport genişliğinin bir eşiğidir. Bu nedenle `sm:` küçük telefon anlamına gelmez. Mobile-first bir düzen önce dar pencerede işe yarayan temel class'ı seçer, sonra alan arttığında kolon sayısını artırır.

Önce kırık class dizisini düşün:

```tsx
function TightShelf() {
  return <section className="grid grid-cols-5 gap-3">{/* kartlar dar ekranda sıkışır */}</section>
}
```

Burada kolon sayısı her viewport'ta beş olarak kalır. Responsive eşiklerle kolon artışını açıkça belirt:

```tsx check
type Album = { id: number; title: string }

export function AlbumShelf({ albums }: { albums: Album[] }) {
  return (
    <section aria-label="Albümler" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      {albums.map((album) => (
        <article key={album.id} className="min-w-0 rounded-xl border p-3">
          <h2 className="truncate font-medium">{album.title}</h2>
        </article>
      ))}
    </section>
  )
}
```

Örnek kod bir veri dizisini bölümlere çizer. `key` React'in öğe kimliğini korur; bu, CSS düzeniyle aynı konu değildir. `min-w-0` grid çocuğunun içerik uzunluğundan daha geniş olmamasına izin verir. `truncate` görünür metni tek satırda keser; erişilebilir başlığın kendisini değiştirmez.

## Bir kartın içindeki satırı izleyelim

Şimdi ızgaradaki tek kartı düşün. Başlık uzun ve puan alanı kısa. `flex items-center justify-between gap-2` iki ucu ayırır. Başlık `min-w-0 truncate` ile daralabilir; puan `shrink-0` ile sabit kalır.

| Öğe | Kural | Render sonrası rolü |
|---|---|---|
| Satır | `flex` | çocukları tek eksende yerleştirir |
| Satır | `justify-between` | ilk ve son öğeyi uçlara iter |
| Başlık | `min-w-0` | varsayılan minimum içerik genişliğini kaldırır |
| Başlık | `truncate` | taşanı tek satırda görünür biçimde keser |
| Puan | `shrink-0` | dar alanda kendi genişliğini korur |

`min-w-0` olmadan flex öğesi bazen uzun başlığın en az içerik genişliğine tutunur ve puanı iter. Bu, flex öğelerinin varsayılan küçülme davranışından kaynaklanır; yalnız `overflow-hidden` eklemek puan ile başlık arasındaki alan paylaşımını açıklamaz.

```tsx
type TrackLineProps = { title: string; duration: string }

export function TrackLine({ title, duration }: TrackLineProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h3 className="min-w-0 truncate">{title}</h3>
      <span className="shrink-0 text-sm">{duration}</span>
    </div>
  )
}
```

Burada başlık için `title` niteliği eklemek kısaltılan metni hover'da gösterebilir, ancak erişilebilirlik veya tasarım gereksiniminin yerine geçmez. Ekran okuyucu DOM metnini hâlâ okuyabilir; kullanıcı açısından önemli bir başlık görsel olarak kısaltılıyorsa tam metne erişim yolu tasarımla düşünülmelidir.

## Görsel alanı ve içerik sınırları

Poster veya kapak görseli farklı oranlarda geliyorsa kartların boyu değişebilir. Bir görsel alanına `aspect-[2/3]` verip `object-cover` kullanmak görünür alanı sabitler; kaynağın kırpılması tasarım kararıdır. Görsel yoksa aynı ölçüde yer tutucu tutmak, yükleme veya boş state sırasında kart listesinin sıçramasını azaltır.

`grid-cols-4` çok dar ekranda kartlara yetersiz genişlik verebilir. Dört sütunu temel kural yapmak yerine iki sütundan başlayıp eşiklerde artır. `grid-cols-[repeat(auto-fit,minmax(...))]` gibi özel grid ifadeleri de mümkündür, ama sabit ürün düzeninde anlaşılır eşikler daha kolay gözden geçirilir.

Önce kırık düzene bakalım: bütün kolonları dar ekranda da sabitlemek ve kartların minimum genişliğini artırmak başlıkların dışarı taşmasına neden olur.

```tsx
function Shelf() {
  return <section className="grid grid-cols-5 gap-4">{/* narrow viewport still has five columns */}</section>
}
```

Daha iyi başlangıç, dar pencerede az sütunla başlamak ve alan büyüdükçe eklemektir. Kapsayıcıya `min-w-0` verilmesi de uzun bir başlığın grid ölçüsünü zorlamasını engeller. Sütun sayısını seçerken posterin okunabilir genişliğini ve kart içindeki en uzun gerçek veriyi birlikte değerlendir.

Grid ve flex kararlarının erişilebilirlik üzerinde de dolaylı etkisi vardır. CSS `order` veya `row-reverse` ile görsel sırayı değiştirirken DOM sırası aynı kalır; klavye ve ekran okuyucu sırası çoğunlukla DOM'u izler. İçeriğin görsel ve okuma sırasını farklılaştırmak kullanıcıyı şaşırtabilir. Responsive tasarımda sırayı değiştirmek gerekiyorsa semantik akışı da düşün.

Bir grid her kart için eşit yükseklik garantilemez. Satırdaki hücreler çoğu durumda satır alanını paylaşsa da içeriğin kendi görsel yüksekliği değişebilir. Posterlerin aynı oranı paylaşması, puan satırının kartın altına sabitlenmesi veya özetin belirli satırda kesilmesi tasarımın ayrı kararlarıdır. `grid` class'ı koymak bu kararları kendiliğinden çözmez.

Responsive class'ları büyütürken her eşikte yeni bir layout yazmak zorunda değilsin. `md:grid-cols-3` önceki `grid-cols-2` değerini aynı CSS özelliği için değiştirir; `gap-4` gibi değişmeyen kuralı tekrar etmezsin. Bir breakpoint'te kart içi hizalamayı da değiştireceksen bunu açıkça `md:flex-row` gibi ayrı karar olarak ekle. Prefix'lerin CSS media query eşikleri olarak çözüldüğünü, browser zoom veya yan panel açıldığında viewport genişliğinin değişeceğini unutma.

İçerik kırpma kararı da ürün gereksinimidir. `truncate` tek satır taşmasını üç nokta ile gösterir; çok satırlı özet için farklı bir clamp yaklaşımı gerekir. `overflow-hidden` görüntüyü kesebilir ama kullanıcıya kısaltıldığını anlatmaz. Başlığın tam metnini DOM'da korumak ve gerektiğinde detay sayfasına ulaşım sağlamak önemlidir.

:::mistake[Belirti → neden → düzeltme]
Birinci sütundaki uzun başlık tüm ızgarayı genişletiyor → kart içeriği küçülmüyor → grid çocuğuna `min-w-0` ver ve taşan metnin nasıl gösterileceğini seç.
:::

:::mistake[Belirti → neden → düzeltme]
Telefon görünümünde kartlar dar kalıyor → büyük ekran sütun sayısı temel düzene yazılmış → iki sütun gibi dar görünüm kuralıyla başla, eşikte arttır.
:::

:::mistake[Belirti → neden → düzeltme]
Puan satırın altına düşüyor → satırda sabit kalması gereken öğe küçülüyor veya tek eksenli düzen yok → iç satıra flex ver, puana `shrink-0` ekle.
:::

:::sector
Ürün ekiplerinde responsive düzeni belirli telefon modellerine göre değil içerik ve viewport ihtiyacına göre seç. Tasarım incelemesinde gerçek uzun başlık, boş görsel ve beklenmedik metin uzunluğuyla dene; ideal örnek veri tek başına düzeni doğrulamaz.
:::

## Özet

- Grid kartlar arası satır/sütun ilişkisini; Flexbox tek satır veya sütundaki hizalamayı kurar.
- Responsive prefix viewport eşiğinden itibaren etkindir.
- Dar ekran temel düzendir; genişlik geldikçe kolon eklenir.
- Grid/flex çocuğunda `min-w-0`, uzun içeriğin düzeni zorlamasını önleyebilir.
- Başlık, puan ve poster alanının taşma davranışını ayrı ayrı belirle.

**Kendini yokla:** `sm:grid-cols-3` dar telefonda üç sütun zorunlu kılar mı? Hayır; temel class ne diyorsa eşik gelene kadar o geçerlidir.

**Kendini yokla:** Bir kartın başlık ve puan satırını Grid mi Flexbox mı yönetir? Tek eksenli satır ilişkisi için Flexbox uygundur.
