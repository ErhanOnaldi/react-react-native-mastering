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
      text: 'RHF alan doğrulamasını yapar ama pending durumunu takip edemez.',
      correct: false,
      explanation:
        'RHF kendi form/submit durumunu sunar; ağ mutation’ı için TanStack Query de ayrıca kullanılabilir.',
    },
    {
      text: 'React action dinamik alan dizisini ve her alanın hatasını kendiliğinden yönetir.',
      correct: false,
      explanation:
        'Action submit/state akışını sağlar; alan dizisi ve alan bazlı hata modeli ayrıca kurulur.',
    },
  ],
})
