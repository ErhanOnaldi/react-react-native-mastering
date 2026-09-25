import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Başlık bileşeni',
  difficulty: 'kolay',
  concepts: ['react.components', 'react.props', 'tooling.hmr'],
  files: ['AppHeader.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Başlık için `<h1>`, alt yazı için `<p>` kullan; ikisini bir `<header>` içine koy.',
    'Props’u parametrede destructure et: `function AppHeader({ title, tagline }: AppHeaderProps)`.',
  ],
})
