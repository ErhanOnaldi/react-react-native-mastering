import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Form Action durumu',
  difficulty: 'orta',
  concepts: ['react.actions', 'form.react-actions', 'react.state'],
  files: ['ReviewAction.tsx'],
  hints: [
    'Form gönderimini geleneksel `onSubmit` ve manuel state yönetimi yerine React 19’un form eylemleriyle yönetmelisin.',
    'React 19’da form durumunu ve geçişini yönetmek için `useActionState` hook’u kullanılır.',
    "`const [message, formAction, isPending] = useActionState(saveReview, '')` yapısını kur; form etiketine `action={formAction}` ver.",
    "`saveReview` fonksiyonu ilk argümanda önceki state değerini (`_previous: string`), ikinci argümanda ise `FormData` nesnesini alır: `formData.get('review')` ile değeri oku.",
  ],
})
