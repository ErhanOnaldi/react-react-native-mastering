import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Render sayacı ne anlatır?',
  difficulty: 'kolay',
  concepts: ['react.context'],
  question:
    'Bir favori action’ından sonra tema tüketicisinin render sayacı 4’ten 5’e çıktı. En güvenli yorum hangisi?',
  options: [
    {
      text: 'Tema tüketicisi tekrar render oldu; nedenini Profiler ve provider sınırıyla incelemeliyim.',
      correct: true,
      explanation: 'Sayaç gözlemi kanıttır; nedeni için Context değeri ve parent render’ını ayır.',
    },
    {
      text: 'Bu etkileşim beş bileşeni render etti; ağ istekleri ayrıca ölçülmeli.',
      correct: false,
      explanation:
        'Bu metin sayaç artışını doğru okur, fakat hangi bileşenlerin çalıştığını tek başına göstermez.',
    },
    {
      text: 'React her action’da tüm DOM’u yeniden kurdu.',
      correct: false,
      explanation: 'Render çağrısı DOM değişikliği anlamına gelmez.',
    },
  ],
})
