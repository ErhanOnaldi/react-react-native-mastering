import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'TypeScript dosyalarına kural koy',
  difficulty: 'orta',
  concepts: ['tooling.eslint-config', 'tooling.eslint'],
  files: ['lintConfig.ts'],
  hints: [
    'Config yalnızca `.js` dosyalarını seçiyor; kapsamı `.ts` ve `.tsx` için genişlet.',
    '`typescript-eslint` paketinden önerilen preset’i `extends` içine koy.',
    '`rules` içinde `@typescript-eslint/no-unused-vars` değerini `error` yap.',
  ],
})
