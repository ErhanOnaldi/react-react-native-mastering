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

## Bir JSON örneği yeterli değil
`movie-550.json` detay cevabıdır; liste öğelerinde `genre_ids` bulunurken detayda `genres` bulunur. `popular-1.json` ve `trending-week.json` içindeki birkaç öğeyi karşılaştır. Bir örnekte poster doluysa bile başka bir filmde null olabilir. Tipi yalnızca mutlu örneğe göre yazarsan tip kontrolü yanlış güven verir.

`release_date` alanı `""` olduğunda alan eksik değildir. Dolayısıyla `release_date?: string` bu durumu anlatmak için yanlış modeldir. Boş string'i kullanırken kontrol edeceksin. Gerçekten hiç gelmeyebilen bir `tagline` için `tagline?: string` uygun olur. `readonly id` ise id'nin uygulama kodunda yanlışlıkla yeniden atanmasını engeller; ağdan gelen nesneyi dondurmaz.

## type ve interface seçimi
İkisi de basit bir nesne şeklini anlatabilir. Bu derste `Movie` gibi açık nesnelerde `interface` kullanıyoruz; küçük yerel veri şekillerinde `type` da göreceksin. Birini “her zaman doğru” diye seçme. Birazdan `string | null` ve `'grid' | 'list'` gibi union'lar için `type` gerekecek.

:::tip
Bir film nesnesine baktığında sırayla alan adı, değer türü, null olasılığı ve alanın yokluğu sorularını sor. Bunlar dört farklı kontroldür.
:::

## Sektörde
API cevap tiplerini örnek veriye ve API sözleşmesine dayanarak yaz. Tip, ağdan gelen veriyi kendi başına doğrulamaz.
