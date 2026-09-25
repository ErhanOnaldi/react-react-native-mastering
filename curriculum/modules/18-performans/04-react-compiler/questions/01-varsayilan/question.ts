import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Yeni kodda varsayılan',
  difficulty: 'kolay',
  concepts: ['perf.compiler'],
  question: 'Compiler 1.0 etkin ve saf bir bileşen yazıyorsun. Ne yaparsın?',
  options: [
    {
      text: 'Önce compiler’a bırakır, ölçülmüş özel ihtiyaçta el yazısı memo kullanırım',
      correct: true,
      explanation:
        'Güncel öneri otomatik memoization ile başlayıp özel kontrolü ölçerek eklemektir.',
    },
    {
      text: 'Her ifadeye useMemo eklerim',
      correct: false,
      explanation: 'Bu okunurluğu ve dependency bakımını gereksiz artırır.',
    },
    {
      text: 'Eski tüm memo çağrılarını topluca silerim',
      correct: false,
      explanation: 'Mevcut memo davranışı bazı durumlarda sözleşme olabilir.',
    },
  ],
})
