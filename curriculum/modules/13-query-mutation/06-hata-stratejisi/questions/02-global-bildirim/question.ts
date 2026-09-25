import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Global mutation hatasını bildir',
  difficulty: 'orta',
  concepts: ['query.useMutation', 'fetch.error-handling'],
  files: ['makeClient.ts'],
  hints: [
    'MutationCache’i QueryClient kurulumuna ver.',
    'onError callback’i notify fonksiyonunu çağırır.',
    'defaultOptions içindeki mutations.retry false olsun.',
  ],
})
