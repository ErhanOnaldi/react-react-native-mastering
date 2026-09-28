import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'TypeScript dosyalarına kural koy',
  difficulty: 'orta',
  concepts: ['tooling.eslint-config', 'tooling.eslint'],
  files: ['lintConfig.ts'],
  hints: [
    'Önce dosya kümesini düşün: `.ts` yardımcılarını ve `.tsx` bileşenlerini aynı katman görmeli.',
    '`eslint/config` içindeki `defineConfig` ve `typescript-eslint` önerilen preset’i TS parser/kural tabanını sağlar.',
    "`files: ['**/*.{ts,tsx}']` ile eşleşme ver; `rules` içinde `@typescript-eslint/no-unused-vars: 'error'` tanımla.",
  ],
})
