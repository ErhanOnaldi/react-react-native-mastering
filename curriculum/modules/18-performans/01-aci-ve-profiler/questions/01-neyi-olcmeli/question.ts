import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Önce hangi sayı?',
  difficulty: 'kolay',
  concepts: ['perf.rerender'],
  question:
    '500 filmlik aramada bir tuş gecikiyor. Profiler ile ilk karşılaştırmada hangi sinyal daha güvenilirdir?',
  options: [
    {
      text: 'Aynı arama etkileşiminde liste için bildirilen commit sayısı',
      correct: true,
      explanation:
        'Aynı etkileşimdeki commit sayısı, gereksiz tekrarları süre eşiğinden daha tutarlı gösterir.',
    },
    {
      text: 'Geliştirici bilgisayarında ölçülen render süresinin 5 ms altında kalması',
      correct: false,
      explanation: 'Süre cihaz ve geliştirme moduna göre değişir; sabit eşik kırılgandır.',
    },
    {
      text: 'İlk açılışta indirilen JavaScript paketinin sürüm numarası',
      correct: false,
      explanation:
        'Paket sürümü gecikmenin hangi etkileşimde ve hangi ağaçta oluştuğunu göstermez; commit kaydı doğrudan etkileşime bakar.',
    },
  ],
})
