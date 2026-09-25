---
title: "ESLint 10 flat config"
minutes: 9
kind: concept
---

# ESLint 10 flat config

:::pain[Problem]
Bir önceki görevde `no-unused-vars` çalıştı; çünkü test kuralları verdi. Sinema’nın kendi dosyalarında aynı kontrol yok. Her dosya için kuralları tek tek yazamayız.
:::

## Proje kuralı nerede yaşar?

ESLint 10 yalnızca **flat config** okur: proje kökündeki `eslint.config.js` gibi bir dosya. `.eslintrc` ve `.eslintignore` bu sürümde çözüm değil. ESLint 10 aramaya lint edilen dosyanın klasöründen başlar; monorepoda paketlerin ayrı config’leri olabilir.

```js title="eslint.config.js"
import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig({
  files: ['**/*.{js,ts,jsx,tsx}'],
  extends: [js.configs.recommended, tseslint.configs.recommended],
})
```

`defineConfig`, ESLint çekirdeğinin yardımcısıdır. Eski örneklerde görülen `tseslint.config(...)` artık önerilmiyor. `files` kapsamı önemlidir: TS dosyası için parser ve kurallar gelmezse dosya hiç lint edilmeyebilir veya yanlış ayrıştırılabilir.

## Kuralın kapsamını daralt

Sinema’da React bileşenleri `.tsx`, yardımcılar `.ts`. Aynı config dizisinde bir nesneyi yalnızca `**/*.tsx` için, başka bir nesneyi bütün TS dosyaları için açabilirsin. Örneğin `no-console`’u hata yapmak kolaydır ama geliştirmede bilinçli log kullanıyorsan bu kararı takımca ver.

TypeScript dosyalarında temel `no-unused-vars` yerine `@typescript-eslint/no-unused-vars` kullanılır; TS parser tip sözdizimini anlar. Preset’ler başlangıç noktasıdır; kendi proje kuralını ayrıca ekleyebilirsin.

:::mistake[Sık hata]
`files` içindeki uzantıyı unutunca lint “temiz” görünebilir çünkü dosya kapsam dışında kalmıştır. Yalnızca `errorCount === 0` değil, `messages` ve `warningCount` ile dosyanın gerçekten incelendiğini de kontrol et.
:::

:::sector
Config’i repoda tutmak editör, terminal ve CI için aynı ölçütü sağlar. Kuralı değiştirdiğinde tüm ekip değişikliği kod incelemesinde görebilir.
:::
