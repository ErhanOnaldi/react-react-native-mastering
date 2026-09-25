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

## Sektörde
Union, API'nin izin verdiği olasılıkları görünür yapar. Geliştirici yeni bir durum eklediğinde ilgili kodları tekrar düşünür.
