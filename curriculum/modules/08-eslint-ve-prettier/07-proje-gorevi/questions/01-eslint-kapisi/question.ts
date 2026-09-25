import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema ESLint kapısı',
  difficulty: 'orta',
  concepts: [
    'tooling.eslint-config',
    'tooling.eslint',
    'react.useEffect.deps',
    'react.useEffect.cleanup',
    'router.params',
  ],
  project: 'sinema',
  focusFiles: ['eslint.config.js', 'src/pages/MovieDetailsPage.tsx'],
  hints: [
    'Önce `eslint.config.js` oluştur; ESLint 10 `.eslintrc` okumaz.',
    '`defineConfig` içinde JS/TS preset’leri, Hook ve Refresh config’leri olmalı.',
    'Hook preset’i `reactHooks.configs.flat.recommended`; Prettier flat config dizinin en sonunda olmalı.',
  ],
  rubric: [
    'Detay sayfasında route id’si değişince yeni film isteği başlıyor ve eski istek sonucu ekranı ezmiyor.',
    'Lint uyarıları kaynak kodun niyetine uygun düzeltiliyor; kural kapatma yorumlarıyla gizlenmiyor.',
  ],
})
