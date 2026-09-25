import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Form ne zaman sıfırlanır?',
  difficulty: 'kolay',
  concepts: ['form.rhf-form-state', 'form.rhf-reset'],
  question: 'Kaydetme isteği başarısız olabilir. `reset()` için en güvenli an hangisi?',
  options: [
    {
      text: 'Başarılı async kayıt tamamlandıktan sonra.',
      correct: true,
      explanation: 'Hata hâlinde kullanıcının girdiği veri korunur.',
    },
    {
      text: '`mutate` çağrısından hemen önce.',
      correct: false,
      explanation: 'İstek hata verirse kullanıcı girdilerini kaybeder.',
    },
    {
      text: 'Her input değişiminde.',
      correct: false,
      explanation: 'Böylece kullanıcı yazamaz.',
    },
    {
      text: 'Render gövdesinde.',
      correct: false,
      explanation: 'Render sırasında form durumunu değiştirmek döngü doğurabilir.',
    },
  ],
})
