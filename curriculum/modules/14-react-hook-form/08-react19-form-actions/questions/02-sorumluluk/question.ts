import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hangi araç hangi ihtiyacı çözer?',
  difficulty: 'kolay',
  concepts: ['form.react-actions', 'form.rhf-field-array'],
  question: 'Sekiz alanlı, dinamik etiketli ve alan bazlı hatalı formda hangi değerlendirme doğru?',
  options: [
    {
      text: 'RHF alan yönetimi ve doğrulamayı; React action asenkron gönderim durumunu sağlayabilir.',
      correct: true,
      explanation: 'İki aracın sorumlulukları örtüşebilir, ancak alan dizisi RHF tarafındadır.',
    },
    {
      text: '`useActionState` otomatik olarak `register` ve `useFieldArray` sağlar.',
      correct: false,
      explanation: 'Bunlar RHF API’leridir.',
    },
    {
      text: 'RHF, React 19’da artık kullanılamaz.',
      correct: false,
      explanation: 'RHF 7 React 19 ile kullanılabilir.',
    },
    {
      text: 'İki araç birlikte kullanılırsa özel resmi RHF action API’si zorunludur.',
      correct: false,
      explanation: 'Böyle bir zorunlu entegrasyon API’si yoktur.',
    },
  ],
})
