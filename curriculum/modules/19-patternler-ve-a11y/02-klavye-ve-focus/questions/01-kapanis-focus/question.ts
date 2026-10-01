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
      text: 'Dialog içindeki ilk düğmede.',
      explanation:
        'İlk düğme açılış odağı olabilir; kapatma sonrası kullanıcıyı dialog içeriğinde bırakmak görev akışını sürdürmesine yardım etmez.',
    },
    {
      text: 'Dialogu kapatan Escape tuşunun varsayılan odağına.',
      explanation:
        'Escape kapatma eylemini başlatır, fakat tarayıcı otomatik olarak açan düğmeye focus taşımaz.',
    },
    {
      text: 'Dialogun başlığında.',
      explanation:
        'Başlık uzun dialog açılırken uygun başlangıç odağı olabilir; kapanınca focus dialogu açan kontrole iade edilir.',
    },
  ],
})
