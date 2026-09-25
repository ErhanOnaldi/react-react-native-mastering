import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Silme isteğini gönder',
  difficulty: 'orta',
  concepts: ['query.useMutation', 'fetch.headers-auth', 'fetch.error-handling'],
  files: ['deleteRating.ts'],
  hints: [
    'fetch method DELETE olmalı.',
    'URL query parametresinde guest_session_id kullan.',
    'response.ok false ise Error fırlat.',
  ],
})
