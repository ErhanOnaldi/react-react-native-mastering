import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Başlığı env’den oku',
  difficulty: 'orta',
  concepts: ['tooling.env', 'tooling.type-check', 'js.optional-chaining'],
  project: 'sinema',
  focusFiles: ['src/config.ts', 'src/vite-env.d.ts', 'src/App.tsx'],
  hints: [
    'Önce verinin yolunu izle: ortam değişkeninden yapılandırmaya, yapılandırmadan ekrandaki başlığa.',
    'Vite ortam değerlerini `import.meta.env` üzerinden okur. Opsiyonel başlık için `??` ile varsayılan değer belirleyebilirsin.',
    '`config.ts` içinde `appTitle` değerini export et; `App.tsx` bu değeri başlıkta kullansın. Ortam değerlerinin tiplerini `vite-env.d.ts` içinde tanımla.',
  ],
})
