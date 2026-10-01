import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Geçişteki sonuç',
  difficulty: 'kolay',
  concepts: ['query.pagination', 'router.search-params'],
  question: `Page 1 sonucu ekrandayken URL page 2 oldu. Page 2 cevabı gelene kadar ekranda page 1'in gösterildiğini hangi değer belirtir?`,
  options: [
    {
      text: '`isPlaceholderData === true`',
      correct: true,
      explanation:
        'Bu değer true iken yeni key’in cevabı henüz gelmemiş, önceki sonuç geçici gösteriliyor olabilir.',
    },
    {
      text: '`isFetching === false`',
      explanation:
        'Page 2 isteği sürerken fetching devam eder; bu değer geçici olarak kullanılan eski data’yı anlatmaz.',
    },
    {
      text: '`query.data === undefined`',
      explanation:
        'Önceki sonuç gösteriliyorsa query data dolu olabilir; undefined ilk veri yokluğunu anlatır.',
    },
  ],
})
