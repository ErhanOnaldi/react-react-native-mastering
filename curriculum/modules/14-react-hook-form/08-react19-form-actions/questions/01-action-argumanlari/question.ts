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
      text: 'Yalnızca DOM event’i.',
      correct: false,
      explanation: 'Form action callback’i event yerine FormData ile çalışır.',
    },
    {
      text: 'Önce FormData, sonra önceki state.',
      correct: false,
      explanation: 'Argüman sırası tersidir.',
    },
    {
      text: 'Yalnızca query key.',
      correct: false,
      explanation: 'Query key TanStack Query kavramıdır.',
    },
  ],
})
