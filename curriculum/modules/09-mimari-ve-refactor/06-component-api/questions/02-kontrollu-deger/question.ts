import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Controlled SearchBox',
  difficulty: 'orta',
  concepts: ['arch.component-api', 'react.controlled-input', 'router.search-params'],
  question: 'SearchBox değeri URL’deki `q` ile eşleşmeli. Hangi API state sahibini açık eder?',
  options: [
    {
      text: 'value ve onChange',
      correct: true,
      explanation: 'Doğru. Değeri sayfa/URL tutar, bileşen değişim isteğini bildirir.',
    },
    {
      text: 'Yalnız defaultValue',
      explanation:
        'defaultValue ilk değerdir; URL sonradan değişince input’u zorunlu olarak güncellemez.',
    },
    {
      text: 'Hem value hem defaultValue',
      explanation: 'İki ayrı başlangıç/sahip kaynağı belirsizlik yaratır.',
    },
    {
      text: 'Bileşen içinde sabit useState',
      explanation:
        'URL ile eşleşmesi gereken değeri yalnız iç state’te tutmak senkronizasyon yükü doğurur.',
    },
  ],
})
