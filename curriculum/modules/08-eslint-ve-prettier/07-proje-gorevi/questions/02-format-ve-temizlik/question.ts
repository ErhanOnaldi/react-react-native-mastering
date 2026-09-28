import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema format ve lint temizliği',
  difficulty: 'orta',
  concepts: [
    'tooling.prettier',
    'tooling.scripts',
    'tooling.eslint',
    'react.useEffect.deps',
    'tailwind.utilities',
  ],
  project: 'sinema',
  focusFiles: [
    '.prettierrc.json',
    '.prettierignore',
    'package.json',
    'src/pages/MovieDetailsPage.tsx',
  ],
  hints: [
    'Önce ortak biçim tercihlerini, üretilen dosya istisnalarını ve CI kontrolünü ayrı ayrı kur.',
    '`prettier-plugin-tailwindcss` ile `tailwindStylesheet` seçeneğini kullan; yazma ve kontrol komutlarını farklı script’lerde tut.',
    '`.prettierrc.json`: `singleQuote: true`, `semi: false`, Tailwind plugin’i ve `tailwindStylesheet: "./src/index.css"`; `.prettierignore`: `dist`, `coverage`.',
    'Eksik `prettier`/plugin paketlerini kök manifest ve workspace catalog sürümlerine göre devDependency ekle. `format` uygulandıktan sonra `format:check` ve lint sonuçlarını incele.',
  ],
  rubric: [
    'Biçim ve lint değişiklikleri uygulamanın TMDB, arama ve gezinme davranışını koruyor.',
    'Gereksiz import’lar ve gerçek Hook hataları kodda düzeltilmiş; lint kuralları susturulmamış.',
  ],
})
