import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Action argümanları',
  difficulty: 'kolay',
  concepts: ['form.react-actions', 'react.actions'],
  question:
    '`useActionState(action, initialState)` ile kullanılan form action’ı hangi argümanları alır?',
  options: [
    {
      text: 'Önce önceki state, sonra FormData.',
      correct: true,
      explanation: '`useActionState` action imzasına önce state ekler.',
    },
    {
      text: 'Önceki state ve submit düğmesi bilgisi.',
      correct: false,
      explanation:
        'Action’a submit düğmesi verilmez; ikinci argüman native alanlardan oluşan `FormData` nesnesidir.',
    },
    {
      text: 'Önce FormData, sonra önceki state.',
      correct: false,
      explanation: 'Argüman sırası tersidir.',
    },
    {
      text: 'Submit event’i ve FormData.',
      correct: false,
      explanation:
        'Bu imza normal `onSubmit` event handler’ına benzer; `useActionState` action’ı önceki state’i de alır.',
    },
  ],
})
