import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hata metniyle taşan düğmeler',
  difficulty: 'orta',
  concepts: ['tailwind.layout', 'form.a11y'],
  question:
    'Yorum formunda uzun Türkçe hata metni görünürken İptal ve Kaydet düğmeleri dar ekranda taşıyor. DOM’da hata metnini alanın hemen ardından tutup düğmeleri alt satıra alacak düzen hangisi?',
  options: [
    {
      text: 'Alan ve hata metnini bir blokta bırakıp düğme satırına `flex flex-wrap gap-2` uygularım.',
      correct: true,
      explanation:
        'Doğru. Düzen görsel olarak kırılır; hata metninin DOM ilişkisi ve düğme sırası korunur.',
    },
    {
      text: 'Hata metnini CSS ile gizlerim ki düğmeler sığsın.',
      correct: false,
      explanation: 'Görsel ve erişilebilir hata geri bildirimi kaybolur; taşma nedeni çözülmez.',
    },
    {
      text: 'Düğmeleri `absolute` konumlandırırım.',
      correct: false,
      explanation: 'Mutlak konum uzun hata metnine göre doğal yer açmaz; çakışma yaratabilir.',
    },
  ],
})
