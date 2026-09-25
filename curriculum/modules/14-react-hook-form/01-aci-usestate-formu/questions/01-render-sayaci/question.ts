import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Her tuşta ne değişir?',
  difficulty: 'kolay',
  concepts: ['react.controlled-input', 'react.render-cycle', 'perf.rerender'],
  question:
    'Sekiz `useState` kullanan tek form bileşeninde ad input’una üç harf yazınca ne beklenir?',
  options: [
    {
      text: 'Form bileşeni her değişiklikte yeniden render edilir; sayı StrictMode’a göre değişebilir.',
      correct: true,
      explanation:
        'Her `setState` yeni render isteği oluşturur; kesin sayı geliştirme ortamına göre değişebilir.',
    },
    {
      text: 'Yalnızca input DOM’u değişir, React bileşeni yeniden çalışmaz.',
      correct: false,
      explanation:
        'Controlled input değeri React state’indedir; state güncellemesi bileşeni yeniden çalıştırır.',
    },
    {
      text: 'Sekiz state olduğu için her tuşta tam sekiz render olur.',
      correct: false,
      explanation: 'State sayısı tek bir güncellemenin render sayısını sekizle çarpmaz.',
    },
    {
      text: 'Render sayacı artarsa mutlaka sekiz ağ isteği atılmıştır.',
      correct: false,
      explanation: 'Render ile ağ isteği farklı işlerdir; fetch çağrısı yoksa ağ isteği de yoktur.',
    },
  ],
})
