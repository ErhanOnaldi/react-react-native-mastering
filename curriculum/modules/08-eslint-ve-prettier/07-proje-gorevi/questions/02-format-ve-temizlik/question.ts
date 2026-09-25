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
    'Önce `.prettierrc.json` ve `.prettierignore` dosyalarını ekle.',
    '`package.json` script’lerini ekleyip `pnpm lint` ve `pnpm format` çalıştır.',
    'Tailwind v4 için `tailwindStylesheet` tam olarak `./src/index.css`; lint hatalarını kaynakta düzelt.',
  ],
  rubric: [
    'Biçim ve lint değişiklikleri uygulamanın TMDB, arama ve gezinme davranışını koruyor.',
    'Gereksiz import’lar ve gerçek Hook hataları kodda düzeltilmiş; lint kuralları susturulmamış.',
  ],
})
