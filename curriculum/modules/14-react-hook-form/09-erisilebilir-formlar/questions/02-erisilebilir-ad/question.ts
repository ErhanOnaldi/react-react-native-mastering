import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Hata ile alanı ilişkilendir',
  difficulty: 'orta',
  concepts: ['form.a11y', 'form.rhf-errors', 'test.rtl-queries'],
  files: ['AccessibleNameForm.tsx'],
  hints: [
    'Input için görünür bir `<label>` ve eşleşen `htmlFor`/`id` ekle.',
    'Hata varken `aria-invalid` true olsun.',
    '`aria-describedby` hata mesajının id’sini göstersin; mesaj `role="alert"` taşısın.',
  ],
})
