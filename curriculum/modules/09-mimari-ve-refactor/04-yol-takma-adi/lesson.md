---
title: "@/ ile sabit import"
minutes: 6
kind: concept
---

# @/ ile sabit import

:::pain[Problem]
MovieCard taşınınca `../../../shared/lib/format` import’u bir klasör daha derine indi ve kırıldı. Aynı taşıma onlarca göreli yolu etkiliyor.
:::

## İhtiyaçtan karar

`@/` kökü `src/` yap. TypeScript için `tsconfig.app.json` içindeki `paths`, Vite için `vite.config.ts` içindeki `resolve.alias` gerekir.

## Sinema’da dene

TypeScript 6’da `baseUrl` kullanma: `"@/*": ["./src/*"]`. Vite tarafında `fileURLToPath(new URL("./src", import.meta.url))` ile mutlak konuma bağla.

## İki çözücü, tek kök

```jsonc
// tsconfig.app.json içindeki compilerOptions
{ "paths": { "@/*": ["./src/*"] } }
```

```ts
// vite.config.ts içindeki resolve alanı
resolve: {
  alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
}
```

TypeScript editörde ve typecheck sırasında importu çözer; Vite tarayıcıya sunacağı modülü çözer. Biri eksikse hata farklı yerde görünür. `@/features/movies/api/movies-api` gibi bir import, dosya derinliği değişse de aynı kalır. Bu kolaylık, `features` ile `shared` arasındaki sahiplik kararını ortadan kaldırmaz.

:::mistake[Sık hata]
Alias yalnızca editörün tip kontrolünde çalışırsa tarayıcı import’u çözemeyebilir; yalnız Vite’ta çalışırsa tsc hata verir. İki ayarı beraber doğrula.
:::

:::sector[Sektörde]
Alias dosyanın ne işe yaradığını söylemez. Feature sınırı yine önemlidir; `@/` yalnız taşımanın mekanik yükünü azaltır.
:::
