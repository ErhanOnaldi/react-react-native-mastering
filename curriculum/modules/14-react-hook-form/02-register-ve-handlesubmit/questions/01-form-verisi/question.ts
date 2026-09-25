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
      text: '`onValid` fonksiyonunu render sırasında hemen çalıştırır.',
      correct: false,
      explanation: 'Dönen handler ancak form gönderildiğinde çalışır.',
    },
    {
      text: 'Sunucuya otomatik POST atar.',
      correct: false,
      explanation: 'RHF formu yönetir; ağ isteğini senin callback’in veya mutation yapar.',
    },
    {
      text: 'TypeScript tipini çalışma zamanında otomatik şemaya çevirir.',
      correct: false,
      explanation: 'Generic yalnızca tip kontrolüdür; doğrulama kurallarını ayrıca yazarsın.',
    },
  ],
})
