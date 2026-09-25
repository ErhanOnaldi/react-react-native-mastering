import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'İlk register formu',
  difficulty: 'kolay',
  concepts: ['form.rhf-register', 'ts.omit', 'test.user-event'],
  files: ['WatchlistNameForm.tsx'],
  hints: [
    '`useForm<WatchlistValues>()` sonucundan `register` ve `handleSubmit` al.',
    "İki input’a sırasıyla `register('name')` ve `register('description')` yay.",
    'Formun `onSubmit` değerini `handleSubmit(onSave)` yap.',
  ],
})
