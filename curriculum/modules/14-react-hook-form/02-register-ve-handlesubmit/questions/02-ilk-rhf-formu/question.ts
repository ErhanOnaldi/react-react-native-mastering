import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'İlk register formu',
  difficulty: 'kolay',
  concepts: ['form.rhf-register', 'ts.omit', 'test.user-event'],
  files: ['WatchlistNameForm.tsx'],
  hints: [
    'Form değerlerinin anahtarları input label metni değil, submit sözleşmesindeki `name` ve `description` alanlarıdır.',
    '`useForm<WatchlistValues>()` içinden `register` ve `handleSubmit` al; başlangıç için `defaultValues` belirle.',
    "İki native alana sırasıyla `register('name')` ve `register('description')` bağla, formu `handleSubmit(onSave)` ile gönder.",
  ],
})
