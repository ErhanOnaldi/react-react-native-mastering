import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'İsme kural ekle',
  difficulty: 'kolay',
  concepts: ['form.rhf-errors', 'form.rhf-register'],
  files: ['RequiredNameForm.tsx'],
  hints: [
    '`register` ikinci argümanda yerleşik kuralları alır.',
    '`required` ve `minLength` için Türkçe mesaj yaz; `formState.errors` alanını oku.',
    '`errors.name?.message` varsa `role="alert"` içinde göster.',
  ],
})
