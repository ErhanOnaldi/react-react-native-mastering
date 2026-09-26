import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Dialog başlığını bağla',
  difficulty: 'orta',
  concepts: ['a11y.basics', 'react.useId'],
  question:
    'Fragman dialogunun görünür başlığı “Dövüş Kulübü fragmanı”. Dialog adını doğru bağlayan çift hangisi?',
  options: [
    {
      text: 'Başlığa id, dialoga aria-labelledby eklemek.',
      correct: true,
      explanation: 'Doğru. Dialogun erişilebilir adı görünür başlığın metninden gelir.',
    },
    {
      text: 'Dialoga yalnızca aria-modal=true eklemek.',
      explanation: 'aria-modal modal ilişkiyi bildirir; adı sağlamaz.',
    },
    {
      text: 'Başlığı yalnızca kalın göstermek.',
      explanation: 'Görsel vurgu, dialog ile başlık arasında programatik ilişki kurmaz.',
    },
    {
      text: 'Dialoga aria-hidden=true eklemek.',
      explanation: 'Bu, içeriği erişilebilirlik ağacından saklar; tam tersi sonuç verir.',
    },
  ],
})
