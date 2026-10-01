import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Form verisini kim toplar?',
  difficulty: 'kolay',
  concepts: ['form.rhf-register', 'ts.omit'],
  question: '`useForm<Values>()` içindeki `handleSubmit(onValid)` ne yapar?',
  options: [
    {
      text: 'Alanları toplar, doğrular ve geçerli veriyi `onValid` fonksiyonuna verir.',
      correct: true,
      explanation:
        '`register` ile bağlanan alanlar form verisine girer; `handleSubmit` submit akışını yönetir.',
    },
    {
      text: 'Submit olayındaki DOM event’ini doğrudan `onValid` fonksiyonuna verir.',
      correct: false,
      explanation: '`handleSubmit` alanları toplar; callback’e event değil form değerlerini verir.',
    },
    {
      text: '`useForm` alanlardan runtime şeması üretip kuralları kendiliğinden doğrular.',
      correct: false,
      explanation:
        'Generic değerlerin TypeScript tipini belirtir; runtime kurallarını ayrıca yazarsın.',
    },
    {
      text: '`handleSubmit` hangi endpoint’e istek atacağını belirler.',
      correct: false,
      explanation: 'Ağ isteği senin callback’inde kurulur; RHF endpoint bilmez.',
    },
  ],
})
