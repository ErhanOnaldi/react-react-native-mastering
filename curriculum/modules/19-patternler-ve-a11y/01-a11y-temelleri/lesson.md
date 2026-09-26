---
title: "Ekran okuyucu ne görüyor?"
minutes: 8
kind: concept
---

# Ekran okuyucu ne görüyor?

:::pain[Problem]
Film kartındaki yıldız düğmesi gözle bakınca belli. Ama testte `getByRole('button', { name: 'Favori' })` hiçbir şey bulamıyor; ekran okuyucu da yalnızca “düğme” diyor. Kullanıcı neye bastığını ve favorinin açık mı kapalı mı olduğunu bilmiyor.
:::

## Erişilebilirlik ağacı
Tarayıcı DOM'dan bir **erişilebilirlik ağacı** üretir. Her öğenin bir **rolü** (`button`, `dialog`, `tab`), bir **adı** ("Favori") ve gerekiyorsa bir **durumu** (`pressed`, `selected`, `expanded`) olur. Ekran okuyucu bu üçlüyü okur. RTL'in `getByRole` sorgusu da aynı ağaca bakar; bu yüzden `getByRole` ile yazdığın test, ekran okuyucunun gördüğünü test eder.

`getByText('☆')` geçiyor diye düğmenin anlaşılır olduğunu sanma: simge metni bir ad değildir.

## Ad nereden gelir?
- Görünür metin varsa ad odur: `<button>Favorilere ekle</button>`.
- Yalnızca simge varsa `aria-label` ver ve simgeyi `aria-hidden="true"` ile gizle; yoksa ad "☆ Favori" gibi karışık okunur.
- Görünür bir başlık başka bir öğeyi adlandıracaksa `aria-labelledby` ile bağla (birazdan dialogda).

```tsx title="FavoriteButton.tsx"
<button type="button" aria-label="Favori" aria-pressed={isFavorite} onClick={onToggle}>
  <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span>
</button>
```

## Aç/kapa düğmesi: iki doğru yol, bir yanlış
Favori düğmesi bir **toggle**. İki geçerli seçeneğin var:

| Yol | Ad | Durum |
| --- | --- | --- |
| Sabit ad + durum | Hep **Favori** | `aria-pressed={isFavorite}` → "Favori, basılı" |
| Değişen ad | **Favorilere ekle** ↔ **Favorilerden çıkar** | `aria-pressed` YOK |

İkisini karıştırırsan ekran okuyucu "Favorilerden çıkar, basılı" der: ad bir eylem söylüyor, durum başka bir şey. Kullanıcı "basılı olan çıkarmak mı?" diye kalır. Kural: **adı değişen düğmede `aria-pressed` kullanma; `aria-pressed` kullanıyorsan adı sabit tut.**

:::mistake
`<div onClick={...}>` düğme değildir. Tab ile ulaşılmaz, Enter/Space çalışmaz. `role="button"` eklemek rolü düzeltir ama klavye davranışını eklemez; onu da elle yazman gerekir. Doğal `<button>` hepsini bedava verir.
:::

## Yeni bağlam: dialog
Modalın dış kabına `role="dialog"` ve `aria-modal="true"` yazmak yetmez; dialogun bir **adı** olmalı. Görünen başlığa bir id ver ve dialogu `aria-labelledby` ile ona bağla. Açıklama metni varsa `aria-describedby` ile bağla.

```tsx check
import { useId } from 'react'

export function TrailerDialog({ title }: { title: string }) {
  const titleId = useId()
  return (
    <div role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <h2 id={titleId}>{title} fragmanı</h2>
    </div>
  )
}
```

Kimlikleri `useId` ile üret: sayfada iki dialog olsa da çakışmaz. Testlerde üretilen id'nin biçimine (`_r_1_` gibi) güvenme; React sürümüyle değişebilir.

:::sector
Otomatik a11y testleri rol, ad ve durumu doğrular. Yine de gerçek bir ekran okuyucuyla (macOS VoiceOver, Windows NVDA) ve yalnızca klavyeyle bir tur atmak ekiplerde standart bir kontroldür.
:::
