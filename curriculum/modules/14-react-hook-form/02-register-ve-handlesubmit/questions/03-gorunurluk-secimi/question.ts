import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Checkbox ile görünürlük',
  difficulty: 'orta',
  concepts: ['form.rhf-register', 'form.rhf-reset', 'ts.omit'],
  files: ['VisibilityForm.tsx'],
  hints: [
    'Bu kez metne ek olarak `isPublic` boolean alanı var.',
    '`defaultValues` içinde `isPublic: false` ver ve checkbox’ı `register` ile bağla.',
    '`handleSubmit(onSave)` ile checkbox’ın boolean değerini gönder.',
  ],
})
