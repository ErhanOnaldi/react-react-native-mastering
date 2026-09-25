import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema’ya başlık ekle',
  difficulty: 'kolay',
  concepts: ['tooling.vite', 'tooling.hmr', 'react.components'],
  project: 'sinema',
  focusFiles: ['src/App.tsx'],
  hints: [
    '`<main>` içine, mevcut paragrafın üstüne bir `<header>` ekle.',
    'Başlık `<h1>Sinema</h1>`, alt yazı `<p>Bugün ne izlesek?</p>` olsun.',
  ],
})
