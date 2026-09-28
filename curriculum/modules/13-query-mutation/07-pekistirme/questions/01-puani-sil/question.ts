import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Silme isteğini gönder',
  difficulty: 'orta',
  concepts: ['query.useMutation', 'fetch.headers-auth', 'fetch.error-handling'],
  files: ['deleteRating.ts'],
  hints: [
    'Silme isteğinin hangi film ve hangi guest session için gönderildiğini belirle.',
    '`fetch` seçeneklerinde `method: "DELETE"`, Bearer header ve URL query parametresi kullan.',
    '`guest_session_id` değerini encode et; `response.ok` false ise `Error` fırlat.',
  ],
})
