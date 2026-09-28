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
    'Önce hangi kaynak uzantılarının ve hangi React davranışlarının denetlenmesi gerektiğini listele.',
    'ESLint 10 için `defineConfig` (`eslint/config`), `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals` ve `eslint-config-prettier/flat` kullan.',
    'Config’te TS/TSX katmanına `reactHooks.configs.flat.recommended` ve React Refresh Vite config’ini ekle; `globals` ile browser/Node kapsamını ayır, `dist`’i ignore et, Prettier katmanını sona koy.',
    'Sinema bağımlılıklarında eksik araçları `devDependencies` içine ekle; sürümleri kök `package.json` ve workspace catalog’undan al. Ardından detay URL’sini `id` değişimine bağla ve eski isteğin cleanup ile ekranı ezmesini önle.',
  ],
  rubric: [
    'Detay sayfasında route id’si değişince yeni film isteği başlıyor ve eski istek sonucu ekranı ezmiyor.',
    'Lint uyarıları kaynak kodun niyetine uygun düzeltiliyor; kural kapatma yorumlarıyla gizlenmiyor.',
  ],
})
