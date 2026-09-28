import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Arama kutusunu etkileşimle çalıştır',
  difficulty: 'orta',
  concepts: ['test.user-event', 'react.controlled-input'],
  files: ['SearchBox.tsx'],
  hints: [
    'Önce input değerinin kaynağını ve form gönderiminde hangi değerin iletileceğini ayır.',
    'Controlled input, `onChange` ve form `onSubmit` olaylarını kullan.',
    'Submit handler’ında `preventDefault()`, `trim()` ve boş-string kontrolü uygula; erişilebilir label ile arama alanını ilişkilendir.',
  ],
})
