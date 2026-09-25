---
title: Union ve literal tipler
minutes: 8
kind: concept
---

# Union ve literal tipler

:::pain[Problem]
Film posteri bazen URL parçası, bazen null. Tek `string` tipi seçince null gerçeği kayboluyor; `any` seçince hata saklanıyor.
:::

## Olasılıkları yaz
`string | null`, değerin iki olası şeklini söyler. `type View = 'grid' | 'list'` ise yalnızca iki geçerli görünümü kabul eder. TypeScript bu literal union sayesinde yanlış yazılmış `'grdi'` değerini yakalar.

```ts check
type View = 'grid' | 'list'
let view: View = 'grid'
view = 'list'
const poster: string | null = null
void view; void poster
```

Bu tür küçük sabit kümeler için `enum` gerekmez. Veri çalışma zamanında hâlâ JS değeridir; tipler derleme sırasında silinir.

:::mistake
`string | null` yazıp ardından doğrudan `.startsWith()` çağırmak geçmez. Sonraki derste null durumunu daraltacağız.
:::

## Veri olasılığı ve UI seçeneği
`poster_path: string | null` dış API'nin iki olasılığını modeller. `ViewMode = 'grid' | 'list'` ise uygulamanın izin verdiği iki komutu modeller. İkisi de union olsa da kaynakları farklıdır. Birincisini fixture'ları okuyarak keşfedersin; ikincisini ürün davranışına göre tasarlarsın.

Poster yoluna `''` de gelebilir. `string | null` tipi boş string'i ayrıca yazmaz, çünkü boş string zaten string'dir. Yalnızca `null` için tip kontrolü yeterli olmaz; boş yolun UI'da ne olacağını davranış kodunda seçersin. Aynı nedenle `release_date: string` tarihi dolu garanti etmez.

## Yazım hatasını erkene çek
Görünüm durumunu genel `string` yaparsan `'grdi'` yanlış yazımı geçer. Literal union ile bu değeri kullandığın satırda hata alırsın. Bu, ilk dersteki `relese_date` dersinin yeni bağlamıdır: önce nesne alanı, şimdi izin verilen değer.

:::tip
Yeni bir görünüm eklerken tipi güncelle ve bütün etiket/ekran kararlarını gözden geçir. Tip, büyüyen seçenek listesini görünür tutar. Daha kapsamlı eksiksizlik kontrolü sonraki modülde gelecek.
:::

## Sektörde
Union, API'nin izin verdiği olasılıkları görünür yapar. Geliştirici yeni bir durum eklediğinde ilgili kodları tekrar düşünür.
