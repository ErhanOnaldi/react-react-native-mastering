import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Form Action durumu',
  difficulty: 'orta',
  concepts: ['react.actions', 'form.react-actions', 'react.state'],
  files: ['ReviewAction.tsx'],
  hints: [
    "Form gönderimini `onSubmit` state zinciri yerine Action'a bağla.",
    "Action ilk argümanda önceki mesajı, ikincide FormData'yı alır.",
    '`const [message, formAction, isPending] = useActionState(saveReview, "")` kullan.',
  ],
})
