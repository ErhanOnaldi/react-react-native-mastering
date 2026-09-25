---
title: "React Compiler ile varsayılan yol"
minutes: 7
kind: concept
---

# React Compiler ile varsayılan yol

:::pain[Problem]
Kartlara tek tek `memo` eklemek bakım yükü oldu. Aynı kodun compiler tarafından optimize edilmesini istiyorsun.
:::

## Otomatik memoization
React Compiler 1.0 kararlı. Yeni kodda varsayılan olarak compiler'ın memoization yapmasına izin ver. Eski `useMemo`/`useCallback` kullanımını topluca silme: bazı referanslar davranış sözleşmesidir. Effect dependency'sinde bilerek sabit referans gerektiğinde el yazısı kontrol hâlâ uygundur.

`@vitejs/plugin-react` 6 için araştırma notumuzdaki kararlı Babel yolu: `react()` ile `@rolldown/plugin-babel` ve `reactCompilerPreset()` birlikte kullanılır. `react({ compiler: true })` native Oxc yolu daha hızlı ama **deneysel** olarak işaretlidir. Kurulum paketleri yoksa koordinatör eklemelidir; bu modülde kök bağımlılıklar değiştirilmez.

Compiler, saf render ve Hook kurallarına uyan kodda çalışır. Hatalı mutasyonu derleme sihriyle düzeltemez; lint kurallarını koru.

:::sector
Optimized ölçümünü production build'de tekrar yap. Geliştirme `StrictMode` çağrı sayılarıyla son kullanıcı hızını karıştırma.
:::

## Vite 8 ayarı

```ts title="vite.config.ts"
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
})
```

Bu örnek, `@rolldown/plugin-babel`, `@babel/core` ve `babel-plugin-react-compiler` paketleri projeye eklendiğinde çalışır. Sadece config satırını yazıp bağımlılıkları eksik bırakmak build'i bozar. React Hooks lint kurallarını da kapatma: compiler kurallara uymayan bileşenleri optimize etmeyebilir. Compiler açıkken `memo` sınırını her kartta elle kurmadan önce Profiler ile tekrar ölç.
