import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Controlled arama kutusu',
  difficulty: 'kolay',
  concepts: ['react.controlled-input', 'react.props'],
  files: ['SearchBox.tsx'],
  hints: [
    'Input’un görünen değeri nereden gelmeli?',
    '`value` prop’unu input’a bağla; değişimi string callback’ine aktar.',
    '`onChange={event => onChange(event.currentTarget.value)}` kullan; yerel `useState` ekleme.',
  ],
})
