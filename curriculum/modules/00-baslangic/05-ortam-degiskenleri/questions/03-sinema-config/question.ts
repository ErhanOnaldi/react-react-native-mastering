import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Başlığı env’den oku',
  difficulty: 'orta',
  concepts: ['tooling.env', 'tooling.type-check', 'js.optional-chaining'],
  project: 'sinema',
  focusFiles: ['src/config.ts', 'src/vite-env.d.ts', 'src/App.tsx'],
  hints: [
    '`src/config.ts`: `export const appTitle = import.meta.env.VITE_APP_TITLE ?? "Sinema"`.',
    '`App.tsx`’te `import { appTitle } from "./config"` ve `<h1>{appTitle}</h1>`.',
    'Tip hatası alıyorsan `src/vite-env.d.ts` dosyasını dersteki gibi oluşturduğundan emin ol; sonra `pnpm typecheck`.',
  ],
})
