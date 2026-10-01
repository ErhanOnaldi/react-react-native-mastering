---
title: "Bileşen API'sini kullanım yerine göre tasarla"
minutes: 17
kind: concept
---

# Bileşen API'sini kullanım yerine göre tasarla

Sinema'da bir film kartı farklı raflarda kullanılır. Bazen başlık, poster ve puan gösterir; bazen kartı kompakt göstermek istersin. Component'in dışarıdan kabul ettiği prop'lar onun **component API**'sidir: çağıranın hangi seçimleri yapabildiğini bu sözleşme belirler. Önce sabit bir seçeneği isimli prop olarak verelim:

```tsx check
type MovieBadgeProps = { title: string; compact?: boolean }

export function MovieBadge({ title, compact = false }: MovieBadgeProps) {
  return <span className={compact ? 'badge-compact' : 'badge'}>{title}</span>
}
```

`title` kartın içeriğini, `compact` ise tanımlı görünüm seçeneğini anlatıyor. Bu iki ayarı bir prop listesinde görmek kolaydır; fakat tüm kullanım yerlerinin içeriğini `showPoster`, `showRating`, `showSynopsis`, `showTrailer` gibi bayraklarla anlatmaya çalışırsan geçerli kombinasyonları takip etmek zorlaşır.

## İçeriği çağrı yerine bırak

Bir **composition**, küçük component'leri bir araya getirerek daha büyük bir görünüm kurmaktır. `children`, açılış ve kapanış etiketi arasına konan JSX'i taşır; böylece çerçeve component'i içine hangi Sinema içeriğinin geleceğini bilmek zorunda kalmaz. TypeScript'teki `ReactNode`, component içinde gösterilebilen metin, element veya element grubunun tipidir.

```tsx check
import type { ReactNode } from 'react'

type MovieFrameProps = { title: string; children: ReactNode }

export function MovieFrame({ title, children }: MovieFrameProps) {
  return (
    <section>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  )
}
```

Çağıran yer filmi nasıl sunacağını seçebilir:

```tsx check
import type { ReactNode } from 'react'

type MovieFrameProps = { title: string; children: ReactNode }

export function MovieFrame({ title, children }: MovieFrameProps) {
  return <section><h2>{title}</h2><div>{children}</div></section>
}

export function CinemaHome() {
  return (
    <MovieFrame title="Öne çıkanlar">
      <p>Bu hafta vizyonda</p>
      <button type="button">Fragmanı aç</button>
    </MovieFrame>
  )
}
```

`MovieFrame` başlıkla çerçeveyi yönetiyor, sayfa ise istediği metin ve düğmeyi `children` olarak veriyor. Yeni bir sayfa yardım bağlantısı veya poster eklese bile çerçevenin içine `showHelpLink` gibi yeni prop koymak gerekmiyor.

Bazen tek bir `children` alanı yetmez. **Named slot**, çerçeveye adı belli birden fazla içerik yeri vermektir; örneğin `header` ve `footer` prop'ları. İçerik yuvalarının görevi farklıysa adları çağrı yerini daha okunur yapar. Her bölüm için slot eklemek gerekmez: bir serbest içerik alanı varsa `children` daha küçük bir API'dir.

## Seçimin sahibi çağrı yeri olsun

Bir düğme veya filtre seçimini component'e tıklanınca kendi içinde değiştirtmek yerine, değerin sahibini dışarıda tutabilirsin. Buna **controlled API** denir: çağıran `value` prop'uyla güncel değeri verir; component `onChange` callback'i ile yeni değer isteğini bildirir. Aşağıdaki tür filtresi tek bir seçili tür kullanır:

```tsx check
type GenreFilterProps = {
  value: number
  onChange: (nextGenreId: number) => void
}

export function GenreFilter({ value, onChange }: GenreFilterProps) {
  return (
    <select value={value} onChange={(event) => onChange(Number(event.target.value))}>
      <option value={28}>Action</option>
      <option value={18}>Drama</option>
    </select>
  )
}
```

Filtre kendi seçimini saklamıyor. `value` hangi türün seçili olduğunu söyler; kullanıcı başka tür seçince `onChange` çağrılır. Parent yeni `value` göndermedikçe ekranda eski prop görünmeye devam eder. Bu, URL'den veya formdan gelen seçimi tek bir yerde tutmaya yarar.

| Adım | Olay | `GenreFilter` prop'u | Görünüm |
| --- | --- | --- | --- |
| 1 | Sayfa Action türünü seçili verir | `value={28}` | Action görünür |
| 2 | Kullanıcı Drama'yı seçer | Hâlâ `value={28}` | Action görünür |
| 3 | Callback `18` değerini sayfaya yollar | Hâlâ `value={28}` | Action görünür |
| 4 | Sayfa state/URL'yi `18` yapıp tekrar render eder | `value={18}` | Drama görünür |

Callback bir emir değil, sahibine gönderilen değişiklik isteğidir. Sayfa bu isteği kabul edebilir, başka state ile birleştirebilir veya reddedebilir. Değerin sahibini dışarıda tutmanın nedeni, URL, form ve component'in birbirine rakip kopyalar üretmesini önlemektir.

Bir açılır film bölümü de aynı sözleşmeyi Boolean değerle kurabilir: `open` görünür olup olmadığını taşır, `onOpenChange(nextOpen)` yeni tercihi sahibine iletir. Düğmenin `aria-expanded` niteliği ise bölüm gerçekten açık mı bilgisini ekran okuyucuya verir; aynı `open` değerinden hesaplanmalıdır. İki ayrı değişken kullanırsan görsel kapalıyken yardımcı teknoloji açık olduğunu söyleyebilir.

:::mistake[Belirti: geri tuşu filtreyi değiştirmiyor]
**Belirti →** URL'de `genre=18` görünür ama filtre Action kalır. **Neden →** Filter kendi `useState` kopyasını tutup yalnız ilk `value` prop'unu kullandı. **Düzeltme →** Seçimin sahibi URL/sayfa olsun; her render'da güncel `value` ver ve etkileşimde callback ile yeni değeri sahibine ilet.
:::

:::mistake[Belirti: parent değeri değişmeden görünüm değişiyor]
**Belirti →** Component `onChange(18)` çağırdıktan hemen sonra Drama'yı seçili gösteriyor. **Neden →** Component controlled prop'u kullanırken aynı değeri internal state'te de güncelledi. **Düzeltme →** Controlled modda görünümü yalnız prop belirlesin; callback yalnızca sahibine isteği bildirsin.
:::

Serbest içerik, isimli seçenek ve sahipli seçim farklı ihtiyaçlardır: görünümü baştan kurmak için `children`, sabit tercihler için anlamlı prop, dışarıdan yönetilecek değer için `value`/callback çifti kullan. Her değişkeni prop yapmak da, her şeyi `children` içine saklamak da okunaklı değildir. Component'i kullandığın satıra bak: çağıran neyi seçmeli ve hangi karar component'in işi?

:::info[Derinlemesine (isteğe bağlı)]
Component kendi içinde küçük bir aç/kapa state'i tutabilir; bu **uncontrolled** kullanımdır. `defaultOpen` yalnız ilk değeri verir ve sonraki parent değişikliklerini izlemez. Controlled ve uncontrolled modları tek component'te birlikte sunmak, prop birleşimlerini ve kimin sahibi olduğu kuralını artırır; başlangıçta bir modu seçip açıkça sunmak daha kolay anlaşılır.
:::

![Controlled durumda değerin dış owner'dan geldiğini, uncontrolled durumda içeride yaşadığını gösteren diyagram](diagrams/state-sahipligi.svg "Controlled değer dışarıdan gelir; uncontrolled değer içeride tutulur.")

## Özet

- Sabit, anlamlı seçeneği prop olarak ver; her varyant için boolean ekleme.
- Serbest JSX içeriğini `children` ile çağrı yerine bırak.
- Birden fazla farklı içerik yeri gerekiyorsa named slot kullan; az sayıda tut.
- Controlled component görünümünü prop'tan alır, callback ile sahibine değişiklik önerir.
- Görsel açık/kapalı haliyle `aria-expanded` aynı `open` değerini izlesin.

**Yeni terimler**

- **Component API:** Component'i çağıranların kullanabildiği props ve içerik sözleşmesi.
- **Composition:** Component'leri bir araya getirip daha büyük bir görünüm kurma.
- **ReactNode:** React içinde gösterilebilen metin ve elementlerin TypeScript tipi.
- **Named slot:** Component'te adı verilmiş bir içerik yuvası.
- **Controlled API:** Görünüm değerini dış sahibin prop olarak verdiği ve callback ile güncellediği sözleşme.

**Kendini yokla:** URL geri tuşuyla değişince tür filtresi de değişmeli. Seçimin sahibi neresi olmalı?  
*Cevap:* URL/sayfa; filtre güncel `value` alır ve değişiklik isteğini callback ile geri yollar.

**Kendini yokla:** Her sayfada rafın içeriği farklıysa yeni `showX` prop'ları mı eklemelisin?  
*Cevap:* Hayır. Sayfa içeriği `children` olarak verir; raf çerçeveyi sağlar.
