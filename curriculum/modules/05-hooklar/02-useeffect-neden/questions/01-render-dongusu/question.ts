import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Neden istekler bitmiyor?',
  difficulty: 'kolay',
  concepts: ['react.render-cycle', 'react.useEffect', 'react.state'],
  question: `Bileşen gövdesinde şu kod var:

\`fetch('/movie/550').then((response) => response.json()).then(setMovie)\`

İlk cevap geldiğinde sırada ne olur?`,
  options: [
    {
      text: 'State güncellenir, bileşen yeniden render olur ve gövdedeki fetch tekrar başlar.',
      correct: true,
      explanation:
        'setMovie yeni render ister; render gövdesindeki istek de her çağrıda yeniden başlar.',
    },
    {
      text: 'State değişir ama aynı props geldiği için bileşen yeniden render edilmez.',
      explanation: 'State güncellemesi render ister; aynı props olması bu güncellemeyi engellemez.',
    },
    {
      text: 'Promise ikinci render tamamlanana kadar bekler ve o render’da çalışır.',
      explanation: 'Promise callback’i cevap gelince çalışır; React onu render sırasına ertelemez.',
    },
  ],
})
