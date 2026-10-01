import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Tek sorgu tarifi',
  difficulty: 'kolay',
  concepts: ['query.query-options', 'ts.generics', 'arch.colocation'],
  question:
    'Kart hover’da prefetch edilen detay, detay sayfasında yeniden GET olmasın. En sağlam düzen hangisi?',
  options: [
    {
      text: 'İki yerde aynı `movieQueries.detail(id)` seçeneklerini kullan',
      correct: true,
      explanation: 'Key ve queryFn tek factory’den gelince cache kimliği paylaşılır.',
    },
    {
      text: 'Kartta `detail-${id}`, sayfada `["detail", id]` kullan',
      explanation: 'Farklı key’ler farklı cache girdileridir.',
    },
    {
      text: 'Detay sonucunu kartın `useState` değerine yaz',
      explanation: 'Yerel state sayfalar arası Query cache’i yerine geçmez.',
    },
  ],
})
