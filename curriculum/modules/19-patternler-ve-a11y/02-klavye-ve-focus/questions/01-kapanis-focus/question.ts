import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Kapanınca focus nereye?',
  difficulty: 'kolay',
  concepts: ['a11y.focus', 'react.useRef'],
  question: 'Fragman dialogu Escape ile kapandı. Klavyeyle devam eden kullanıcı nerede olmalı?',
  options: [
    {
      text: 'Dialogu açan düğmede.',
      correct: true,
      explanation:
        'Doğru. Açıldığı nokta, kullanıcının akışı sürdürmesi için doğal geri dönüş yeridir.',
    },
    {
      text: 'Her zaman document.body üzerinde.',
      explanation:
        'Body çoğu zaman görünür bir focus hedefi değildir; kullanıcı konumunu kaybeder.',
    },
    {
      text: 'Kapanmış dialogdaki son düğmede.',
      explanation: 'DOM’dan kaldırılmış öğede focus kalamaz; bağlantı kopar.',
    },
    {
      text: 'İlk sayfa linkinde.',
      explanation: 'Kullanıcıyı sayfanın başına ışınlamak bağlamı kaybettirir.',
    },
  ],
})
