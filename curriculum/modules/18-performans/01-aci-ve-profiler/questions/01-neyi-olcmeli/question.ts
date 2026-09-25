import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Önce hangi sayı?',
  difficulty: 'kolay',
  concepts: ['perf.rerender'],
  question:
    '500 filmlik aramada bir tuş gecikiyor. İlk karşılaştırmada hangisi makineden bağımsız bir sinyaldir?',
  options: [
    {
      text: 'Liste Profiler callback çağrı sayısı',
      correct: true,
      explanation:
        'Her commit için callback gelir; aynı etkileşimde gereksiz tekrarları gösterebilir.',
    },
    {
      text: 'Tek bir makinede 5 ms sınırı',
      correct: false,
      explanation: 'Süre cihaz ve geliştirme moduna göre değişir; sabit eşik kırılgandır.',
    },
    {
      text: 'Paket sürüm numarası',
      correct: false,
      explanation: 'Sürüm darboğazın hangi bileşende olduğunu göstermez.',
    },
  ],
})
