import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Yıldızlar neden register ile bağlanmıyor?',
  difficulty: 'kolay',
  concepts: ['form.rhf-controller', 'react.controlled-input'],
  question:
    '`RatingStars` yalnızca `value` ve `onChange` prop’ları alıyor. RHF ile en uygun bağlantı hangisi?',
  options: [
    {
      text: '`Controller` içindeki `field.value` ve `field.onChange` prop’larını aktar.',
      correct: true,
      explanation: 'Controller controlled bileşene RHF durumunu bağlar.',
    },
    {
      text: '`register("rating")` sonucunu herhangi bir prop’a yay; ref gerekmiyor.',
      correct: false,
      explanation: '`register` native input ref ve event düzenine dayanır.',
    },
    {
      text: 'Yıldız değerini ayrı state’te tutup submit’te rastgele birleştir.',
      correct: false,
      explanation: 'Bu iki değer kaynağı oluşturur; RHF durumu ile UI ayrışabilir.',
    },
    {
      text: 'Bileşeni her tıklamada yeniden mount et.',
      correct: false,
      explanation: 'Mount etmek form değerini RHF’ye taşımaz.',
    },
  ],
})
