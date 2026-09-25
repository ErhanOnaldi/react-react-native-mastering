---
title: Nesne tipleri
minutes: 9
kind: concept
---

# Nesne tipleri

:::pain[Problem]
Bir film kartında `poster_path` null olabiliyor. `poster_path: string` diye tarif edersen kod güvenli görünür, ama gerçek veride çöker.
:::

## Gerçek cevaptan şekil çıkar
TMDB liste öğesinde `id` number, `title` string, `poster_path` ise `string | null`. `release_date` alanı vardır ama içeriği `''` olabilir. Opsiyonel `?`, alanın **hiç gelmeyebileceği** anlamına gelir; boş string ile aynı şey değildir.

```ts check
type MoviePreview = {
  readonly id: number
  title: string
  poster_path: string | null
  tagline?: string
}
const movie: MoviePreview = { id: 550, title: 'Dövüş Kulübü', poster_path: null }
void movie
```

`readonly` yeniden atamayı tip kontrolünde yasaklar; çalışma zamanında nesneyi dondurmaz. `interface Movie { ... }` de nesne şekli tarif eder. Bu modülde veri modelleri için `interface` kullanacağız; union gibi birleşimlerde `type` gerekir.

:::mistake[JSON'u kör kopyalama]
Bir örnek filmde poster var diye tüm posterleri string sayma. Birden fazla fixture'a bak; null olasılığını tipe taşı.
:::

## Sektörde
API cevap tiplerini örnek veriye ve API sözleşmesine dayanarak yaz. Tip, ağdan gelen veriyi kendi başına doğrulamaz.
