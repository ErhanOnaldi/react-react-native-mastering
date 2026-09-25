---
title: Props ve children
minutes: 9
kind: concept
---

# Props ve children

:::pain[Problem]
Sinema’daki kartı çağıran biri `movie` yerine `movies` yazdı; kart başlığı çalışma zamanında kayboldu. Bir de favori düğmesini standart `disabled` ile kapatmak isterken kendi props tipin HTML düğme özelliklerini kabul etmiyor.
:::

## Bileşenin sözleşmesi
Props tipi, çağıranın ne vermesi gerektiğini ve bileşenin ne kullanabileceğini açıklar. Varsayılan değer, prop verilmezse kullanılır; zorunlu alanı gizlemek için rastgele `as` kullanma.

```tsx check
import type { ReactNode } from 'react'
function PosterFrame({ children, caption = 'Afiş yok' }: { children: ReactNode; caption?: string }) {
  return <figure>{children}<figcaption>{caption}</figcaption></figure>
}
export default PosterFrame
```

`ReactNode` metin, sayı, element, boş değer ve daha fazlasını kapsar. `children` otomatik eklenmez; kullanacaksan props tipinde belirt.

## Omit merdiveninin yeni basamağı
Önceki modülde `Omit<Movie, 'id'>` ile veri alanı çıkardın. Şimdi HTML düğmesinin bütün doğal props’unu alıp sadece `type` alanını çıkar: `Omit<ComponentProps<'button'>, 'type'>`. Bileşen `type="button"` değerini kendisi sabitler. Böylece yanlışlıkla form gönderen bir favori düğmesi oluşmaz; `onClick`, `disabled` ve `aria-pressed` kullanılabilir.

:::mistake
`children: string` yazmak ikon veya vurgu etiketi geçmeyi engeller. API gerçekten düz yazıyla sınırlı değilse `ReactNode` seç.
:::

:::sector
Doğal element props’unu türetmek, erişilebilirlik alanlarını tek tek kopyalama yükünü azaltır.
:::
