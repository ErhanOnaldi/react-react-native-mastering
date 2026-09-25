import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Arama kutusunu etkileşimle çalıştır',
  difficulty: 'orta',
  concepts: ['test.user-event', 'react.controlled-input'],
  files: ['SearchBox.tsx'],
  hints: [
    'Input’u label ile ilişkilendir.',
    'onChange içinde event.currentTarget.value kullan.',
    'onSubmit handler’ında trim yapıp boş değilse callback’i çağır.',
  ],
})
