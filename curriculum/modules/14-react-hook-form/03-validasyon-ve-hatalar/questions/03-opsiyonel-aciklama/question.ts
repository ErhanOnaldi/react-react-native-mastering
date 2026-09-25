import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Opsiyonel açıklama sınırı',
  difficulty: 'orta',
  concepts: ['form.rhf-errors', 'form.rhf-register', 'react.conditional-rendering'],
  files: ['DescriptionForm.tsx'],
  hints: [
    'Açıklama boşken geçerli olmalı.',
    '`maxLength: { value: 120, message: ... }` kuralını yalnızca açıklamaya ekle.',
    'Hata varsa alanın yanında alert göster; ad için required kuralını koru.',
  ],
})
