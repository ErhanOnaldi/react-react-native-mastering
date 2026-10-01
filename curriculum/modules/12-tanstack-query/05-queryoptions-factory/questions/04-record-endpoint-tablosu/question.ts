import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Tarifin verisi nereden gelir?',
  difficulty: 'kolay',
  concepts: ['query.query-options', 'ts.inference'],
  question:
    'Bir `movieOptions(550)` tarifi içinde `queryFn` `Promise<{ id: number; title: string }>` döndürüyor. `useQuery(movieOptions(550))` sonucundaki `data` tipi hangi kaynaktan çıkar?',
  options: [
    {
      text: '`queryFn` fonksiyonunun döndürdüğü Promise değerinden',
      correct: true,
      explanation:
        'Tarif, query function dönüş tipini taşıdığı için çağıran ayrıca generic yazmaz.',
    },
    {
      text: 'Query key dizisinden',
      correct: false,
      explanation:
        'Key cevabın kimliğini belirtir; data’nın alan tiplerini query function belirler.',
    },
    {
      text: 'Options nesnesinin değişken adına bakarak',
      correct: false,
      explanation:
        'TypeScript değişken adına göre değil, tarifteki fonksiyon dönüş tipine göre çıkarım yapar.',
    },
  ],
})
