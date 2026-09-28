import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema’ya başlık ekle',
  difficulty: 'kolay',
  concepts: ['tooling.vite', 'tooling.hmr', 'react.components'],
  project: 'sinema',
  focusFiles: ['src/App.tsx'],
  hints: [
    'VS Code üzerinden `projects/sinema/src/App.tsx` dosyasını aç.',
    '`<main>` kapsayıcısı içine yeni bir `<header>` elementi yerleştir.',
    'İskelet: `<header><h1>Sinema</h1><p>Bugün ne izlesek?</p></header>`. Kaydettiğinde Vite HMR ile tarayıcının anında güncellendiğini izle.',
  ],
})
