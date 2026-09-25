import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Değişim olayını tiple',
  difficulty: 'kolay',
  concepts: ['react.events', 'react.controlled-input', 'ts.functions'],
  files: ['SearchField.tsx'],
  hints: [
    'Handler’ı input’a bağla ve üst bileşene string gönder.',
    'Ayrı handler parametresini `ChangeEvent<HTMLInputElement>` olarak tiple.',
    '`onChange(event.currentTarget.value)` çağır; input `value` prop’unu kullanmaya devam et.',
  ],
})
