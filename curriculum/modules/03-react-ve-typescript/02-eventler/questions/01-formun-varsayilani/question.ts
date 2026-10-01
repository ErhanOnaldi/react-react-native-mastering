import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Formun varsayılanı',
  difficulty: 'kolay',
  concepts: ['react.events'],
  question: `Client-side arama formunda Enter'a basınca sayfa yenileniyor. Formun \`onSubmit\` handler'ında hangi işlem gerekir?`,
  options: [
    {
      text: 'Event üzerinde `preventDefault()` çağırmak.',
      correct: true,
      explanation: 'Bu, tarayıcının formu gönderip sayfayı yenileme varsayılanını durdurur.',
    },
    {
      text: 'Input değerini `event.currentTarget.value` ile formdan silmek.',
      explanation:
        'Değeri okumak sayfa yenilenmesini engellemez; tarayıcı davranışını ayrıca iptal etmelisin.',
    },
    {
      text: 'Submit düğmesine `type="button"` vermek.',
      explanation: 'Bu kez düğme formu göndermez, dolayısıyla Enter ile gönderim de çözülmez.',
    },
    {
      text: "Formu `onClick` handler'ıyla sarmalamak.",
      explanation: 'Enter klavye form submit akışını kullanır; formun `onSubmit` alanını dinle.',
    },
  ],
})
