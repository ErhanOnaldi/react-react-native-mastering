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
      text: 'Dialoga `aria-describedby` ile başlığı bağlamak.',
      explanation:
        '`aria-describedby` açıklayıcı metin içindir; dialogun adını başlıktan almak için `aria-labelledby` gerekir.',
    },
    {
      text: 'Dialoga `aria-label="Fragman"` vermek ve görünür başlığı ayrıca bırakmak.',
      explanation:
        'Bu ad sağlar, ancak görünür başlıktan türemez. Başlık değişirse erişilebilir ad eski metinde kalabilir.',
    },
    {
      text: 'Başlıkla dialoga aynı sabit `id` değerini vermek.',
      explanation:
        'Aynı id belge içinde iki öğeye verilemez ve tek başına dialogu adlandıran ilişki kurmaz.',
    },
  ],
})
