import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Erişilebilir favori düğmesi',
  difficulty: 'orta',
  concepts: ['tailwind.states', 'tailwind.dark-mode', 'a11y.basics', 'react.props'],
  files: ['FavoriteButton.tsx'],
  hints: [
    'Görsel class ile HTML davranışını ayrı ayrı düşün.',
    '`aria-pressed={active}` ekle; `hover:`, `focus-visible:`, `disabled:` ve `dark:` class’ları yaz.',
    'Button class’ına örneğin `hover:bg-sky-800 focus-visible:outline-2 disabled:opacity-50 dark:bg-sky-500` ekle.',
  ],
  preview: {
    entry: 'Preview.tsx',
  },
})
