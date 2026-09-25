import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Sayfa değişirken',
  difficulty: 'kolay',
  concepts: ['query.pagination', 'router.search-params'],
  question: '`?page=2` yüklenirken sayfa 1 ekranda kalsın. TanStack Query 5 seçeneği hangisi?',
  options: [
    {
      text: '`placeholderData: keepPreviousData`',
      correct: true,
      explanation: 'v5 önceki sonucu geçici placeholder olarak gösterebilir.',
    },
    {
      text: '`keepPreviousData: true`',
      explanation: 'Bu eski API biçimidir; v5’te placeholderData kullanılır.',
    },
    { text: '`gcTime: 0`', explanation: 'Cache’i çabuk silmek geçişteki boşluğu artırabilir.' },
  ],
})
