---
title: tsconfig ve tip kontrolü
minutes: 9
---

# tsconfig ve tip kontrolü

:::pain[Problem]
Editörde bir satırın altı kırmızı çizili: *"Type 'string \| undefined' is not assignable to type 'string'"*. Ama tarayıcıda uygulama **çalışıyor**. Sonra `pnpm build` diyorsun ve build hata verip duruyor. Hangisi doğru?
:::

## Vite tipleri kontrol etmez, siler

Bir önceki derste gördük: Vite, `.tsx` dosyasını tarayıcıya göndermeden önce **tipleri siler**. Kontrol etmez — çünkü kontrol yavaştır ve geliştirme sunucusu anında cevap vermelidir.

```
Vite (pnpm dev)      → tipleri siler, çalıştırır       (hızlı, kontrol yok)
tsc (pnpm typecheck) → tipleri kontrol eder, raporlar  (yavaş, kesin)
```

Yani iki ayrı iş var, iki ayrı araç var:

- **Editör** (VS Code ya da buradaki Monaco) arka planda TypeScript'e sorar ve kırmızı çizgi çeker.
- **`tsc -b`** tüm projeyi kontrol eder. `build` script'i `tsc -b && vite build` olduğu için tip hatası varken **build çıkmaz**. İyi ki çıkmaz.

:::info[Bu platformda da aynısı]
"Çalıştır"a bastığında testlerin yanında `tsc` de çalışır. Testler geçse bile tip hatası varsa görev tamamlanmaz — tıpkı sektördeki CI kontrolleri gibi.
:::

## tsconfig dosyaları

Vite şablonu üç dosya kullanır:

```json title="tsconfig.json"
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

- `tsconfig.app.json` → `src/` klasörü: **tarayıcıda** çalışan kod (DOM tipleri var).
- `tsconfig.node.json` → `vite.config.ts`: **Node'da** çalışan kod (Node tipleri var).
- `tsconfig.json` ikisini birbirine bağlar; `tsc -b` ("build mode") her ikisini de kontrol eder.

## Bilmen gereken ayarlar

| Ayar | Ne yapar |
| --- | --- |
| `strict` | Sıkı kontroller (örn. `null` olabilecek değeri kontrol etmeden kullanamazsın). TypeScript 6'da **varsayılan olarak açık**. |
| `jsx: "react-jsx"` | JSX'i yeni dönüşümle derler; her dosyaya `import React` yazmana gerek kalmaz. |
| `moduleResolution: "bundler"` | Import'ları Vite gibi bir paketleyicinin çözdüğü şekilde çözer. |
| `noEmit` | tsc JavaScript dosyası üretmez; sadece kontrol eder (üretimi Vite yapar). |
| `verbatimModuleSyntax` | Sadece tip olan import'ları `import type` ile yazmanı ister. |
| `erasableSyntaxOnly` | Silinerek kaldırılamayan TS söz dizimini (`enum`, `namespace` gibi) yasaklar. |
| `noUnusedLocals` / `noUnusedParameters` | Kullanılmayan değişken ve parametreleri hata sayar. |

### `import type` neden?

```ts title="types.ts"
export interface Movie {
  id: number
  title: string
}
```

```ts title="movie-card.ts"
import type { Movie } from './types' // ✅ sadece tip: çalışma zamanında tamamen silinir
import { Movie } from './types'      // ❌ verbatimModuleSyntax: "Movie is a type…"
```

Vite dosyaları **tek tek** dönüştürür; `Movie`'nin bir tip mi yoksa gerçek bir değer mi olduğunu diğer dosyaya bakmadan bilemez. `import type` bunu açıkça söyler: "bu satırı güvenle sil".

### Neden `enum` yok?

`enum` çalışma zamanında gerçek bir nesne üretir; tipleri silmek onu kaldırmaya yetmez. Modern projeler bunun yerine **literal union** kullanır (TypeScript modülünde ayrıntılı göreceğiz):

```ts check
type Status = 'idle' | 'loading' | 'success' | 'error'

const current: Status = 'loading'
```

:::info[TypeScript 7]
TypeScript 7, derleyicinin Go ile yeniden yazılmış hâlidir ve yaklaşık 10 kat hızlıdır. Dil aynıdır; yazdığın kod değişmez. Bu projede ekosistem uyumu nedeniyle TypeScript 6 kullanıyoruz (ESLint eklentileri henüz 7'yi desteklemiyor).
:::

:::sector
Takımlar genelde CI'da (her pull request'te) `pnpm typecheck` çalıştırır. Tip hatası olan kod birleştirilemez. Editördeki kırmızı çizgiyi görmezden gelmek, sadece hatayı birkaç dakika sonraya ertelemektir.
:::
