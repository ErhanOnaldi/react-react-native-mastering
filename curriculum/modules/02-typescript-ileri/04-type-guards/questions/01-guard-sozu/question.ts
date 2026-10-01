import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Type guard ne yapar?',
  difficulty: 'kolay',
  concepts: ['ts.type-guards', 'ts.unknown-any'],
  question: '`isMovie(value): value is Movie` imzası tek başına neyi garanti eder?',
  options: [
    {
      text: 'Çağıran koda daraltma sözü verir; gövdenin doğru kontrol yapması gerekir.',
      correct: true,
      explanation: 'Doğru; yanlış guard da derlenebilir ama çalışma zamanında tehlikelidir.',
    },
    {
      text: 'Sunucunun doğru veri döndürmesini sağlar.',
      explanation:
        'TypeScript ağdaki cevabı değiştirmez; guard yalnızca aldığı değeri denetleyebilir.',
    },
    {
      text: 'Guard çağrıldığı anda `value` kesin olarak Movie olur.',
      explanation:
        'Daraltma yalnızca guard true döndüren koşul dalında geçerlidir; false dalında değer Movie sayılmaz.',
    },
    {
      text: 'TypeScript guard gövdesini imzaya göre otomatik denetler.',
      explanation:
        'TypeScript predicate imzasına güvenir; gövdeyi sen yazarsın ve test etmen gerekir.',
    },
  ],
})
