---
title: Event tipleri
minutes: 8
kind: concept
---

# Event tipleri

:::pain[Problem]
Arama kutusuna yazdığın metni almak isterken `event.target.value` için tip hatası aldın. Formdaki “Ara” düğmesi de sayfayı yeniliyor; favori işaretlerin kayboluyor.
:::

## Olayı kaynağında tiple
Input değişiminde `ChangeEvent<HTMLInputElement>` kullan; metni `event.currentTarget.value` üzerinden oku. Form submit’inde `FormEvent<HTMLFormElement>` kullan ve tarayıcının varsayılan gönderimini `preventDefault()` ile durdur.

```tsx check
import type { ChangeEvent, FormEvent } from 'react'
function Search() {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => { console.log(event.currentTarget.value) }
  const onSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault() }
  return <form onSubmit={onSubmit}><input aria-label="Film ara" onChange={onChange} /><button>Ara</button></form>
}
export default Search
```

JSX içindeki inline handler’da TypeScript çoğu zaman event tipini kendisi çıkarır. Handler’ı dışarı taşıdığında açık tip, IDE’de doğru alanları gösterir. `currentTarget`, handler’ın bağlandığı elementtir; `target` ise olayın başladığı alt element olabilir.

:::mistake
Bir form içindeki sıradan favori düğmesi için `type="button"` seç. Aksi hâlde varsayılan `submit` tetiklenebilir.
:::

:::sector
Semantik form ve input etiketleri klavye kullanımını da sağlar; testleri role ile yazmak bunu görünür kılar.
:::
