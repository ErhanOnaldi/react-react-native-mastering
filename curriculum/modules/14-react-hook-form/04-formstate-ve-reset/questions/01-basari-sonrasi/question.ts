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
      text: 'İstek başlar başlamaz, başarılı mı başarısız mı olduğuna bakmadan.',
      correct: false,
      explanation: 'İstek henüz sonuçlanmadı; hata durumunda reset kullanıcının girdisini siler.',
    },
    {
      text: 'Submit callback’i başlar başlamaz, bekleyen Promise varken.',
      correct: false,
      explanation: 'Başarı yanıtını görmeden temizlemek hata sonrası yeniden denemeyi zorlaştırır.',
    },
    {
      text: 'Her render sonunda, form değişmese bile.',
      correct: false,
      explanation:
        'Render başarı sınırını bilmez; her çalıştığında resetlemek kullanıcı girdisini siler.',
    },
  ],
})
