import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Yeşil test ne söyler?',
  difficulty: 'orta',
  concepts: ['arch.refactoring', 'arch.separation-of-concerns'],
  question:
    'Spagetti başlangıç kodu davranış testlerini geçiyor. Bu bilgi tek başına neyi kanıtlar?',
  options: [
    {
      text: 'Yalnız ölçülen davranışların korunduğunu',
      correct: true,
      explanation: 'Doğru. Tekrar ve sınır kalitesi için rubric/code review da gerekir.',
    },
    {
      text: 'Klasör yapısının iyi olduğunu',
      explanation: 'Davranış testleri dosyanın nerede durduğunu değerlendirmez.',
    },
    { text: 'Hiç bug kalmadığını', explanation: 'Testler yazılmamış durumları garanti etmez.' },
    {
      text: 'API client’ın merkezileştiğini',
      explanation: 'Aynı cevap dağınık fetch koduyla da üretilebilir.',
    },
  ],
})
